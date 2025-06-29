"use client"

// Conversation management hook
import { useState, useEffect, useCallback } from "react"
import { ConversationService } from "@/lib/services/conversation.service"
import { N8nService } from "@/lib/services/n8n.service"
import type { ConversationSession, ChatMessage, User } from "@/lib/types"

export function useConversation(user: User | null) {
  const [session, setSession] = useState<ConversationSession | null>(null)

  useEffect(() => {
    if (user) {
      const currentSession = ConversationService.getCurrentSession()
      if (currentSession && currentSession.userId === user.id) {
        setSession(currentSession)
      } else {
        // Create new session
        const newSession = ConversationService.createSession(user)
        setSession(newSession)
      }
    }
  }, [user])

  const addMessage = useCallback(
    (message: ChatMessage) => {
      if (!session) return

      const updatedSession = ConversationService.addMessage(session, message)
      setSession(updatedSession)
    },
    [session],
  )

  const endSession = useCallback(() => {
    if (!session) return

    ConversationService.endSession(session)
    setSession(null)
  }, [session])

  const sendToN8n = useCallback(
    async (userMessage: string, aiResponse: string) => {
      if (!session || !user) return

      const payload = N8nService.createPayload(
        session.id,
        userMessage,
        aiResponse,
        user.id,
        session.messages.length,
        ConversationService.getSessionDuration(session),
        session.category,
        user.profile,
      )

      await N8nService.sendToWorkflow(payload)
    },
    [session, user],
  )

  return {
    session,
    addMessage,
    endSession,
    sendToN8n,
    messageCount: session?.messages.length || 0,
    sessionDuration: session ? ConversationService.getSessionDuration(session) : 0,
  }
}
