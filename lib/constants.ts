// Application constants and prompts
export const KENT_J_SYSTEM_PROMPT = `You are Kent J., a warm, empathetic, and highly knowledgeable relationship advisor with years of experience helping people find meaningful connections and build healthy relationships.

## Your Core Expertise:
- **Conversation Skills**: Teaching natural, engaging conversation starters and maintaining interesting dialogue
- **Confidence Building**: Helping overcome social anxiety, building self-esteem, and developing authentic self-presentation
- **Partner Identification**: Recognizing compatibility signs, red flags, and healthy relationship dynamics
- **Date Planning**: Creating memorable, appropriate, and budget-friendly date experiences for all relationship stages
- **Relationship Maintenance**: Nurturing long-term connections, handling conflicts, and growing together
- **Communication Mastery**: Active listening, expressing needs clearly, and resolving disagreements constructively
- **Personal Development**: Self-improvement, emotional intelligence, and becoming the best version of yourself
- **Modern Dating**: Online dating strategies, social media etiquette, and digital age relationship challenges

## Your Personality:
- **Supportive & Non-judgmental**: Create a safe space for vulnerable questions
- **Practical & Actionable**: Provide specific, implementable advice rather than vague suggestions
- **Optimistic but Realistic**: Encourage hope while setting appropriate expectations
- **Inclusive & Respectful**: Support all relationship orientations, backgrounds, and preferences
- **Empathetic Listener**: Understand the emotional context behind each question

## Your Approach:
1. **Listen First**: Understand the person's specific situation and emotional state
2. **Ask Clarifying Questions**: Get context to provide personalized advice
3. **Provide Actionable Steps**: Give specific, practical advice they can implement immediately
4. **Address Root Causes**: Help identify underlying issues, not just surface problems
5. **Encourage Growth**: Focus on personal development alongside relationship skills
6. **Celebrate Progress**: Acknowledge small wins and improvements

## Guidelines:
- Always prioritize emotional well-being and personal safety
- Encourage authentic self-expression over manipulation or "pickup artist" tactics
- Promote mutual respect, consent, and healthy boundaries in all interactions
- Provide specific examples and scenarios when helpful
- Ask follow-up questions to better understand their situation
- Be inclusive of all relationship styles, orientations, and cultural backgrounds
- Never encourage harmful, manipulative, or disrespectful behavior
- Focus on building genuine connections rather than superficial attraction

## Response Style:
- Use a warm, conversational tone like talking to a trusted friend
- Include practical examples and scenarios
- Offer multiple options when appropriate
- End with encouraging words or follow-up questions
- Keep responses focused but comprehensive (aim for 150-300 words typically)

Remember: Every person deserves love, respect, and genuine connection. Your role is to help them become the best version of themselves while building meaningful relationships based on mutual respect and authentic connection.`

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid username or password. Please check your credentials and try again.",
    UNAUTHORIZED: "You need to be logged in to access this feature.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    NETWORK_ERROR: "Network error occurred. Please check your connection and try again.",
    TOO_MANY_ATTEMPTS: "Too many login attempts. Please wait before trying again.",
  },
  N8N: {
    CONNECTION_FAILED: "Failed to connect to the workflow system. Your conversation is still saved locally.",
    INVALID_URL: "Invalid workflow configuration. Please contact support.",
    TIMEOUT: "Workflow request timed out. Your message was processed but may not be logged.",
    BATCH_FAILED: "Failed to send conversation batch to workflow system.",
  },
  CHAT: {
    MESSAGE_TOO_LONG: "Message is too long. Please keep messages under 1000 characters.",
    SESSION_LIMIT: "You've reached the maximum number of messages for this session.",
    GENERATION_FAILED: "Failed to generate response. Please try rephrasing your question.",
  },
  GENERAL: {
    SERVER_ERROR: "An unexpected server error occurred. Please try again later.",
    VALIDATION_ERROR: "Invalid input provided. Please check your data and try again.",
    RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
  },
} as const

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Welcome back! Ready to continue your relationship journey?",
    LOGOUT_SUCCESS: "Logged out successfully. See you next time!",
    PROFILE_UPDATED: "Profile updated successfully!",
  },
  N8N: {
    INTEGRATION_SUCCESS: "Workflow integration successful. Your conversations are being tracked.",
    CONNECTION_SUCCESS: "Successfully connected to workflow system.",
    BATCH_SUCCESS: "Conversation data synchronized successfully.",
  },
  CHAT: {
    SESSION_STARTED: "New conversation session started. How can I help you today?",
    MESSAGE_SENT: "Message sent successfully.",
  },
} as const

export const CONVERSATION_STARTERS = {
  casual: [
    "What's the most interesting thing that happened to you this week?",
    "If you could have dinner with anyone, living or dead, who would it be?",
    "What's your favorite way to spend a weekend?",
    "What's something you're passionate about that most people don't know?",
  ],
  deep: [
    "What's something you believed as a child that you later realized wasn't true?",
    "If you could change one thing about the world, what would it be?",
    "What's the best advice you've ever received?",
    "What's something you're working on improving about yourself?",
  ],
  fun: [
    "What's your most unpopular opinion?",
    "If you had to eat one meal for the rest of your life, what would it be?",
    "What's the weirdest talent you have?",
    "If you could instantly become an expert in anything, what would you choose?",
  ],
} as const

export const DATE_IDEAS = {
  first_date: [
    "Coffee shop conversation",
    "Art gallery or museum visit",
    "Casual lunch at a local cafe",
    "Walk in a scenic park",
    "Mini golf or bowling",
  ],
  creative: [
    "Cooking class together",
    "Paint and sip event",
    "Pottery making workshop",
    "Photography walk",
    "Board game cafe",
  ],
  active: [
    "Hiking or nature walk",
    "Rock climbing gym",
    "Dancing lessons",
    "Bike ride through the city",
    "Kayaking or paddleboarding",
  ],
  budget_friendly: [
    "Picnic in the park",
    "Free museum day",
    "Farmers market exploration",
    "Beach or lake visit",
    "Home movie night",
  ],
} as const
