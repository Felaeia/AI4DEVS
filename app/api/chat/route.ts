import { NextResponse } from "next/server"
import { APP_CONFIG } from "@/lib/config"


export const maxDuration = APP_CONFIG.chat.maxDuration

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]
    if (!latestMessage || latestMessage.role !== "user") {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    const userMessage = latestMessage.content

    // Validate message count
    if (messages.length > APP_CONFIG.chat.maxMessagesPerSession) {
      return NextResponse.json({ error: "Too many messages in session" }, { status: 429 })
    }

    // Get n8n webhook URL from environment
    const N8N_WEBHOOK_URL = process.env.CHAT_WEBHOOK_URL || APP_CONFIG.n8n.workflowUrl

    if (!N8N_WEBHOOK_URL) {
      throw new Error("CHAT_WEBHOOK_URL environment variable is not set.")
    }

    console.log("Sending message to n8n:", userMessage)

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kent-J-Version": APP_CONFIG.app.version,
        "X-User-Message-Count": messages.length.toString(),
      },
      body: JSON.stringify({
        chatInput: userMessage,
        conversationHistory: messages.slice(-5), // Send last 5 messages for context
        metadata: {
          timestamp: new Date().toISOString(),
          chatbotName: APP_CONFIG.app.name,
          messageCount: messages.length,
          userId: "",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }

    const n8nResponse = await response.json()
    console.log("🚀 ~ POST ~ n8n response:", n8nResponse)

    // Extract the AI response from n8n
    const aiMessage =
      n8nResponse?.output ||
      n8nResponse?.message ||
      "I'm sorry, I couldn't process your message right now. Please try again."

    // Return the response in the format expected by the chat interface
    return NextResponse.json(
      {
        message: aiMessage,
        success: true,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat message",
        message: "I'm experiencing some technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
