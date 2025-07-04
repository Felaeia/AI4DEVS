import { NextResponse } from "next/server"

// Configuration constants
const APP_CONFIG = {
  problems: {
    maxDuration: 30,
    maxProblemsPerRequest: 10,
  },
  app: {
    name: "Community Tracker",
    version: "1.0.0",
  },
  n8n: {
    problemsWorkflowUrl: process.env.PROBLEMS_WEBHOOK_URL || "",
  },
}

export const maxDuration = APP_CONFIG.problems.maxDuration

export async function POST(req: Request) {
  try {
    const { action, data } = await req.json()

    // Validate required fields
    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    // Validate action types
    const validActions = ["create", "update", "delete", "analyze", "search", "get-insights"]
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 })
    }

    // Get n8n webhook URL from environment
    const N8N_WEBHOOK_URL = process.env.PROBLEMS_WEBHOOK_URL || APP_CONFIG.n8n.problemsWorkflowUrl

    if (!N8N_WEBHOOK_URL) {
      throw new Error("PROBLEMS_WEBHOOK_URL environment variable is not set.")
    }

    console.log(`Sending ${action} request to n8n:`, data)

    // Prepare payload based on action type
    const payload = {
      action,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        appName: APP_CONFIG.app.name,
        version: APP_CONFIG.app.version,
        userId: "", // Can be populated with actual user ID when auth is implemented
      },
    }

    // Add specific validation based on action
    switch (action) {
      case "create":
        if (!data?.title || !data?.description || !data?.place || !data?.area) {
          return NextResponse.json({ error: "Missing required fields for problem creation" }, { status: 400 })
        }
        break
      case "update":
        if (!data?.id) {
          return NextResponse.json({ error: "Problem ID is required for updates" }, { status: 400 })
        }
        break
      case "delete":
        if (!data?.id) {
          return NextResponse.json({ error: "Problem ID is required for deletion" }, { status: 400 })
        }
        break
      case "search":
        if (!data?.query && !data?.filters) {
          return NextResponse.json({ error: "Search query or filters are required" }, { status: 400 })
        }
        break
    }

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Version": APP_CONFIG.app.version,
        "X-Action-Type": action,
        "X-Request-ID": `req_${Date.now()}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }

    const n8nResponse = await response.json()

    console.log("🚀 ~ POST ~ n8n problems response:", n8nResponse)

    // Process response based on action type
    let processedResponse: Record<string, any> = {
      success: true,
      action,
      timestamp: new Date().toISOString(),
    }

    switch (action) {
      case "create":
        processedResponse = {
          ...processedResponse,
          problem: n8nResponse?.problem || n8nResponse?.data,
          message: n8nResponse?.message || "Problem created successfully",
        }
        break
      case "update":
        processedResponse = {
          ...processedResponse,
          problem: n8nResponse?.problem || n8nResponse?.data,
          message: n8nResponse?.message || "Problem updated successfully",
        }
        break
      case "delete":
        processedResponse = {
          ...processedResponse,
          message: n8nResponse?.message || "Problem deleted successfully",
        }
        break
      case "analyze":
        processedResponse = {
          ...processedResponse,
          analysis: n8nResponse?.analysis || n8nResponse?.data,
          insights: n8nResponse?.insights || [],
          message: n8nResponse?.message || "Analysis completed",
        }
        break
      case "search":
        processedResponse = {
          ...processedResponse,
          results: n8nResponse?.results || n8nResponse?.data || [],
          total: n8nResponse?.total || 0,
          message: n8nResponse?.message || "Search completed",
        }
        break
      case "get-insights":
        processedResponse = {
          ...processedResponse,
          insights: n8nResponse?.insights || n8nResponse?.data || [],
          statistics: n8nResponse?.statistics || {},
          message: n8nResponse?.message || "Insights retrieved successfully",
        }
        break
      default:
        processedResponse = {
          ...processedResponse,
          data: n8nResponse?.data || n8nResponse,
          message: n8nResponse?.message || "Operation completed successfully",
        }
    }

    return NextResponse.json(processedResponse, { status: 200 })
  } catch (error) {
    console.error("Error processing problems request:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process problems request",
        message: "We're experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action") || "get-insights"
    const area = searchParams.get("area")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    // Get n8n webhook URL from environment
    const N8N_WEBHOOK_URL = process.env.PROBLEMS_WEBHOOK_URL || APP_CONFIG.n8n.problemsWorkflowUrl

    /**
     * If the webhook URL isn’t defined (e.g. during local previews or
     * in early staging), gracefully return an empty success response
     * instead of throwing so the UI can still render.
     */
    if (!N8N_WEBHOOK_URL) {
      console.warn(
        "[/api/problems] PROBLEMS_WEBHOOK_URL is not set – returning fallback data. " +
          "Add it to .env.local in production.",
      )

      return NextResponse.json(
        {
          success: true,
          action,
          // Empty placeholders so the frontend can handle them safely
          data: [],
          insights: [],
          statistics: {},
          message: "Using local fallback – n8n webhook URL not configured.",
          timestamp: new Date().toISOString(),
        },
        { status: 200 },
      )
    }

    console.log(`Sending GET ${action} request to n8n`)

    // Prepare payload for GET requests
    const payload = {
      action,
      filters: {
        area,
        status,
        priority,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        appName: APP_CONFIG.app.name,
        version: APP_CONFIG.app.version,
        requestType: "GET",
      },
    }

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST", // n8n webhooks typically use POST even for read operations
      headers: {
        "Content-Type": "application/json",
        "X-App-Version": APP_CONFIG.app.version,
        "X-Action-Type": action,
        "X-Request-Type": "GET",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }

    const n8nResponse = await response.json()

    console.log("🚀 ~ GET ~ n8n problems response:", n8nResponse)

    return NextResponse.json(
      {
        success: true,
        action,
        data: n8nResponse?.data || n8nResponse,
        insights: n8nResponse?.insights || [],
        statistics: n8nResponse?.statistics || {},
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing problems GET request:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve problems data",
        message: "We're experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
