export const APP_CONFIG = {
  chat: {
    maxDuration: 30,
    maxMessagesPerSession: 50,
  },
  app: {
    name: "Community Tracker",
    version: "1.0.0",
  },
  n8n: {
    workflowUrl: process.env.CHAT_WEBHOOK_URL || "",
  },
} as const
