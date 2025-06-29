// Comprehensive type definitions
export interface User {
  id: string
  username: string
  token: string
  loginTime: number
  profile?: UserProfile
}

export interface UserProfile {
  age?: number
  relationshipGoals?: string[]
  experienceLevel?: "beginner" | "intermediate" | "experienced"
  interests?: string[]
  location?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  category?: string
  metadata?: MessageMetadata
}

export interface MessageMetadata {
  confidence?: number
  category?: string
  sentiment?: "positive" | "neutral" | "negative"
  followUpSuggestions?: string[]
}

export interface ConversationSession {
  id: string
  userId: string
  messages: ChatMessage[]
  startTime: Date
  lastActivity: Date
  category?: string
  summary?: string
}

export interface N8nPayload {
  sessionId: string
  timestamp: string
  userMessage: string
  aiResponse: string
  chatbotName: string
  category: string
  userId: string
  metadata: {
    messageCount: number
    sessionDuration: number
    userProfile?: UserProfile
    sentiment?: string
  }
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
  error?: string
}

export interface N8nResponse {
  success: boolean
  message: string
  workflowUrl?: string
  error?: string
  data?: any
}

export interface ApiError {
  error: string
  code?: string
  details?: unknown
  timestamp?: string
}

export interface AdviceCategory {
  id: string
  name: string
  description: string
  icon: string
  prompts?: string[]
}

export type LoginCredentials = {
  username: string
  password: string
}

export type ChatInterfaceProps = {
  onLogout: () => void
  user: User
}

export type LoginFormProps = {
  onLogin: (user: User) => void
}

export type RelationshipAdviceContext = {
  userAge?: number
  relationshipStatus?: "single" | "dating" | "relationship" | "complicated"
  goals?: string[]
  previousAdvice?: string[]
}
