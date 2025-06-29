import { NextResponse } from "next/server"

// Configuration endpoint for n8n workflow settings
const N8N_CONFIG = {
  workflowUrl: "https://your-n8n-instance.com/webhook/relationship-advice",
  enabled: true,
  dataFields: ["timestamp", "userMessage", "aiResponse", "chatbotName", "category"],
  description: "Kent J. relationship advice chatbot integration",
}

export async function GET() {
  return NextResponse.json({
    success: true,
    config: N8N_CONFIG,
  })
}

export async function POST(req: Request) {
  try {
    const { enabled } = await req.json()

    // In a real implementation, you would update the configuration
    // For now, we'll just return the current config
    return NextResponse.json({
      success: true,
      message: `n8n integration ${enabled ? "enabled" : "disabled"}`,
      config: { ...N8N_CONFIG, enabled },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
  }
}
