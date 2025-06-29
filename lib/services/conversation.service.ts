// Conversation management service
import type { ChatMessage, ConversationSession, User } from "@/lib/types"

export class ConversationService {
  private static readonly STORAGE_KEY = "kent_j_conversations"
  private static readonly SESSION_KEY = "kent_j_current_session"

  static createSession(user: User, category?: string): ConversationSession {
    const session: ConversationSession = {
      id: this.generateSessionId(),
      userId: user.id,
      messages: [],
      startTime: new Date(),
      lastActivity: new Date(),
      category,
    }

    this.saveCurrentSession(session)
    return session
  }

  static getCurrentSession(): ConversationSession | null {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY)
      if (!stored) return null

      const session = JSON.parse(stored)
      // Convert date strings back to Date objects
      session.startTime = new Date(session.startTime)
      session.lastActivity = new Date(session.lastActivity)
      session.messages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))

      return session
    } catch {
      return null
    }
  }

  static saveCurrentSession(session: ConversationSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  }

  static addMessage(session: ConversationSession, message: ChatMessage): ConversationSession {
    const updatedSession = {
      ...session,
      messages: [...session.messages, message],
      lastActivity: new Date(),
    }

    this.saveCurrentSession(updatedSession)
    return updatedSession
  }

  static endSession(session: ConversationSession): void {
    // Save to conversation history
    this.saveToHistory(session)

    // Clear current session
    localStorage.removeItem(this.SESSION_KEY)
  }

  static saveToHistory(session: ConversationSession): void {
    try {
      const history = this.getConversationHistory()
      history.push(session)

      // Keep only last 50 sessions
      const trimmed = history.slice(-50)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed))
    } catch (error) {
      console.error("Failed to save conversation to history:", error)
    }
  }

  static getConversationHistory(): ConversationSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  static getSessionDuration(session: ConversationSession): number {
    return Date.now() - session.startTime.getTime()
  }

  static categorizeMessage(content: string): string {
    const categories = {
      conversation: ["conversation", "talk", "chat", "say", "speak"],
      confidence: ["confidence", "nervous", "anxiety", "shy", "scared"],
      dating: ["date", "dating", "meet", "ask out", "first date"],
      relationship: ["relationship", "boyfriend", "girlfriend", "partner"],
      communication: ["communication", "argue", "fight", "talk", "listen"],
    }

    const lowerContent = content.toLowerCase()

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerContent.includes(keyword))) {
        return category
      }
    }

    return "general"
  }
}
