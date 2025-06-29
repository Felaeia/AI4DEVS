import { NextResponse } from "next/server"
import { N8nService } from "@/lib/services/n8n.service"
import { APP_CONFIG } from "@/lib/config"

export async function GET() {
  try {
    const queueStatus = N8nService.getQueueStatus()

    return NextResponse.json({
      success: true,
      config: {
        enabled: APP_CONFIG.n8n.enabled,
        workflowUrl: APP_CONFIG.n8n.workflowUrl,
        batchSize: APP_CONFIG.n8n.batchSize,
        retryAttempts: APP_CONFIG.n8n.retryAttempts,
      },
      queueStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("n8n status error:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
