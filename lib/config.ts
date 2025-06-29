// Centralized configuration management
export const APP_CONFIG = {
  app: {
    name: "Kent J.",
    description: "Your Personal Relationship Advisor",
    version: "1.0.0",
    tagline: "Find love, build confidence, create meaningful connections",
  },
  auth: {
    tokenKey: "kent_j_auth_token",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
  },
  chat: {
    maxTokens: 1200,
    temperature: 0.7,
    maxDuration: 30,
    maxMessagesPerSession: 100,
  },
  n8n: {
    workflowUrl: "http://localhost:5678/webhook-test/kentj-webhook",
    enabled: true,
    retryAttempts: 3,
    timeout: 8000,
    batchSize: 10,
  },
  ui: {
    maxChatHeight: "65vh",
    animationDelay: {
      dot1: "0s",
      dot2: "0.15s",
      dot3: "0.3s",
    },
    themes: {
      primary: "from-pink-500 to-red-500",
      secondary: "from-blue-500 to-purple-500",
    },
  },
  features: {
    conversationHistory: true,
    userProfiles: true,
    adviceCategories: true,
    moodTracking: false,
  },
} as const

export const DEMO_USERS = {
  demo: "password123",
  user: "user123",
  kent: "advisor2024",
  admin: "admin123",
  guest: "guest123",
} as const

export const RELATIONSHIP_CATEGORIES = [
  {
    id: "conversation_starters",
    name: "Conversation Starters",
    description: "Learn how to break the ice and start meaningful conversations",
    icon: "💬",
  },
  {
    id: "confidence_building",
    name: "Building Confidence",
    description: "Develop self-confidence and overcome dating anxiety",
    icon: "💪",
  },
  {
    id: "finding_partners",
    name: "Finding Partners",
    description: "Identify compatible partners and where to meet them",
    icon: "🔍",
  },
  {
    id: "date_planning",
    name: "Date Planning",
    description: "Plan memorable and appropriate dates for any stage",
    icon: "📅",
  },
  {
    id: "relationship_maintenance",
    name: "Healthy Relationships",
    description: "Maintain and nurture long-term relationships",
    icon: "❤️",
  },
  {
    id: "communication",
    name: "Communication Skills",
    description: "Improve communication and resolve conflicts",
    icon: "🗣️",
  },
] as const

export const QUICK_PROMPTS = [

  // Quick prompts for common relationship questions

  // Conversation Starters
  {
    category: "conversation_starters",
    text: "What are some good icebreakers for starting a conversation?",
  },
  {
    category: "conversation_starters",
    text: "How do I keep a conversation going with someone I'm interested in?",
  },
  {
    category: "conversation_starters",
    text: "How do I start a conversation with someone I'm interested in?",
  },
  {
    category: "conversation_starters",
    text: "What are some good conversation starters for a first date?",
  },
  {
    category: "conversation_starters",
    text: "How do I ask someone out without being too forward?",
  },
  {
    category: "conversation_starters",
    text: "What are some good questions to ask on a first date?",
  },
  {
    category: "conversation_starters",
    text: "How do I keep a conversation going with someone I'm interested in?",
  },

  // Confidence Building
  {
    category: "confidence_building",
    text: "How can I build my confidence before going on a date?",
  },
  {
    category: "confidence_building",
    text: "What are some tips for overcoming shyness when dating?",
  },
  {
    category: "confidence_building",
    text: "How can I overcome my fear of rejection when dating?",
  },
  {
    category: "confidence_building",
    text: "How can I feel more confident when talking to someone I like?",
  },
  {
    category: "confidence_building",
    text: "How can I build more confidence when approaching someone I like?",
  },

  // Finding Partners
  {
    category: "finding_partners",
    text: "How do I know if someone is interested in me?",
  },
  {
    category: "finding_partners",
    text: "What are some signs that someone is attracted to me?",
  },
  {
    category: "finding_partners",
    text: "How can I find people who share my interests?",
  },
  {
    category: "finding_partners",
    text: "What are some good places to meet new people?",
  },
  {
    category: "finding_partners",
    text: "What are the best ways to meet new people in my area?",
  },
  {
    category: "finding_partners",
    text: "Where can I meet new people who share my interests?",
  },
  {
    category: "finding_partners",
    text: "How do I know if someone is genuinely interested in me?",
  },


  // Date Planning
  {
    category: "date_planning",
    text: "What are some good first date ideas?",
  },
  {
    category: "date_planning",
    text: "How do I plan a first date that isn't too awkward?",
  },
  {
    category: "date_planning",
    text: "What are some creative first date ideas?",
  },
  {
    category: "date_planning",
    text: "How do I plan a first date that is fun and memorable?",
  },
  {
    category: "date_planning",
    text: "What are some good first date ideas that won't break the bank?",
  },
  {
    category: "date_planning",
    text: "What should I consider when planning a first date?",
  },
  {
    category: "date_planning",
    text: "What are some fun and unique date ideas for a first date?",
  },
  {
    category: "date_planning",
    text: "What are some good first date ideas that aren't too intimidating?",
  },

  // Communication Skills
  {
    category: "communication",
    text: "How do I communicate my feelings effectively?",
  },
  {
    category: "communication",
    text: "What are some tips for improving communication in a relationship?",
  },
  {
    category: "communication",
    text: "How do I express my needs in a relationship without sounding demanding?",
  },
  {
    category: "communication",
    text: "How can I improve my listening skills in conversations?",
  },
  {
    category: "communication",
    text: "What are some effective ways to resolve conflicts in a relationship?",
  },
  {
    category: "communication",
    text: "How do I handle disagreements in a healthy way?",
  },
  {
    category: "communication",
    text: "What are some effective ways to communicate my feelings?",
  },


  // Relationship Maintenance
  {
    category: "relationship_maintenance",
    text: "How do I keep my relationship healthy and strong?",
  },
  {
    category: "relationship_maintenance",
    text: "What are some ways to maintain a long-term relationship?",
  },
  {
    category: "relationship_maintenance",
    text: "How do I keep the spark alive in a long-term relationship?",
  },
  {
    category: "relationship_maintenance",
    text: "What should I avoid doing in a new relationship?",
  },
  {
    category: "relationship_maintenance",
    text: "How can I strengthen my relationship with my partner?",
  },
  {
    category: "relationship_maintenance",
    text: "How do I keep my relationship healthy and strong?",
  },
  {
    category: "relationship_maintenance",
    text: "How do I keep the spark alive in a long-term relationship?",
  },
  {
    category: "relationship_maintenance",
    text: "What should I avoid doing in a new relationship?",
  },
 
] as const
