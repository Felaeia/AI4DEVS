import { type NextRequest, NextResponse } from "next/server"
import { N8nService } from "@/lib/services/n8n.service"
import { ERROR_MESSAGES } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: ERROR_MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 })
    }

    const result = await N8nService.testConnection()

    return NextResponse.json({
      ...result,
      queueStatus: N8nService.getQueueStatus(),
    })
  } catch (error) {
    console.error("n8n test error:", error)
    return NextResponse.json({ error: ERROR_MESSAGES.GENERAL.SERVER_ERROR }, { status: 500 })
  }
}
