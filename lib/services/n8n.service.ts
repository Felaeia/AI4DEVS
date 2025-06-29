// n8n integration service
import { APP_CONFIG } from "@/lib/config"
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants"
import type { N8nPayload, N8nResponse } from "@/lib/types"

export class N8nService {
  private static readonly config = APP_CONFIG.n8n
  private static messageQueue: N8nPayload[] = []
  private static isProcessing = false

  static async sendToWorkflow(payload: N8nPayload): Promise<void> {
    if (!this.config.enabled) {
      console.log("n8n integration disabled")
      return
    }

    // Add to queue for batch processing
    this.messageQueue.push(payload)

    // Process queue if not already processing
    if (!this.isProcessing && this.messageQueue.length >= this.config.batchSize) {
      await this.processBatch()
    }
  }

  static async processBatch(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) return

    this.isProcessing = true
    const batch = this.messageQueue.splice(0, this.config.batchSize)

    let attempts = 0
    while (attempts < this.config.retryAttempts) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

        const response = await fetch(this.config.workflowUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Batch-Size": batch.length.toString(),
            "X-Kent-J-Version": APP_CONFIG.app.version,
          },
          body: JSON.stringify({
            batch: true,
            messages: batch,
            metadata: {
              batchSize: batch.length,
              timestamp: new Date().toISOString(),
              version: APP_CONFIG.app.version,
            },
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          console.log(`Successfully sent batch of ${batch.length} messages to n8n workflow`)
          this.isProcessing = false
          return
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        attempts++
        console.error(`n8n batch attempt ${attempts} failed:`, error)

        if (attempts >= this.config.retryAttempts) {
          console.error("Failed to send batch to n8n workflow after all retries")
          // Re-queue failed messages for later retry
          this.messageQueue.unshift(...batch)
          break
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000))
      }
    }

    this.isProcessing = false
  }

  static async testConnection(): Promise<N8nResponse> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const response = await fetch(this.config.workflowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Test-Connection": "true",
        },
        body: JSON.stringify({
          test: true,
          message: "Connection test from Kent J. chatbot",
          timestamp: new Date().toISOString(),
          version: APP_CONFIG.app.version,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          message: SUCCESS_MESSAGES.N8N.CONNECTION_SUCCESS,
          workflowUrl: this.config.workflowUrl,
          data,
        }
      } else {
        return {
          success: false,
          message: ERROR_MESSAGES.N8N.CONNECTION_FAILED,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.N8N.CONNECTION_FAILED,
      }
    }
  }

  static createPayload(
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    userId: string,
    messageCount: number,
    sessionDuration: number,
    category?: string,
    userProfile?: any,
  ): N8nPayload {
    return {
      sessionId,
      timestamp: new Date().toISOString(),
      userMessage,
      aiResponse,
      chatbotName: APP_CONFIG.app.name,
      category: category || "general_advice",
      userId,
      metadata: {
        messageCount,
        sessionDuration,
        userProfile,
        sentiment: this.analyzeSentiment(userMessage),
      },
    }
  }

  private static analyzeSentiment(message: string): string {
    // Simple sentiment analysis
    const positiveWords = ["happy", "excited", "great", "awesome", "love", "wonderful", "amazing"]
    const negativeWords = ["sad", "worried", "anxious", "scared", "hate", "terrible", "awful"]

    const words = message.toLowerCase().split(/\s+/)
    const positiveCount = words.filter((word) => positiveWords.includes(word)).length
    const negativeCount = words.filter((word) => negativeWords.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  static async flushQueue(): Promise<void> {
    if (this.messageQueue.length > 0) {
      await this.processBatch()
    }
  }

  static getQueueStatus(): { queueLength: number; isProcessing: boolean } {
    return {
      queueLength: this.messageQueue.length,
      isProcessing: this.isProcessing,
    }
  }
}
