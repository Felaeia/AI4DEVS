import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth.service"
import { ERROR_MESSAGES } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json()
    const result = await AuthService.login(credentials)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: ERROR_MESSAGES.GENERAL.SERVER_ERROR }, { status: 500 })
  }
}
