# Kent J. - Relationship Advice Chatbot

A comprehensive, maintainable chatbot designed to provide relationship advice and dating guidance.

## Features

### 🤖 AI-Powered Advice
- Specialized relationship counseling using GPT-4 Turbo
- Personalized responses based on user context
- Category-specific advice (dating, confidence, communication, etc.)

### 🔐 Authentication System
- Secure user login with session management
- User profiles and conversation history
- Demo accounts for testing

### 💬 Advanced Chat Interface
- Real-time streaming responses
- Message categorization and sentiment analysis
- Conversation session management
- Quick prompt suggestions

### 🔗 n8n Integration
- Hardcoded workflow URL for backend data management
- Batch processing with retry logic
- Conversation analytics and tracking

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Category-based advice organization
- Loading states and error handling
- Accessible components

## Quick Start

1. **Clone and Install**
   \`\`\`bash
   git clone <repository>
   cd kent-j-chatbot
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   # Add your OpenAI API key and n8n workflow URL
   \`\`\`

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Login with Demo Account**
   - Username: `demo`
   - Password: `password123`

## Architecture

### 📁 Project Structure
\`\`\`
lib/
├── config.ts          # Centralized configuration
├── types.ts           # TypeScript definitions
├── constants.ts       # System prompts and messages
├── services/          # Business logic services
│   ├── auth.service.ts
│   ├── n8n.service.ts
│   └── conversation.service.ts
└── hooks/             # Custom React hooks
    ├── useAuth.ts
    └── useConversation.ts

components/
├── ui/                # Reusable UI components
├── chat/              # Chat-specific components
├── login-form.tsx
└── chat-interface.tsx
\`\`\`

### 🔧 Key Services

**AuthService**: Handles user authentication, session management, and user profiles
**N8nService**: Manages workflow integration with batching and retry logic
**ConversationService**: Manages chat sessions and message history

### 🎯 Relationship Categories
- Conversation Starters
- Building Confidence
- Finding Partners
- Date Planning
- Healthy Relationships
- Communication Skills

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `N8N_WORKFLOW_URL`: Your n8n workflow webhook URL
- `N8N_ENABLED`: Enable/disable n8n integration (true/false)

### App Configuration
All settings are centralized in `lib/config.ts`:
- Chat settings (model, temperature, max tokens)
- UI themes and animations
- Feature flags
- Authentication settings

## n8n Integration

The chatbot automatically sends conversation data to your n8n workflow:

\`\`\`json
{
  "sessionId": "session_123456789",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userMessage": "How do I start a conversation?",
  "aiResponse": "Here are some great conversation starters...",
  "chatbotName": "Kent J.",
  "category": "conversation_starters",
  "userId": "user_demo_123456789",
  "metadata": {
    "messageCount": 5,
    "sessionDuration": 120000,
    "userProfile": {...},
    "sentiment": "positive"
  }
}
\`\`\`

### Workflow Features
- **Batch Processing**: Messages are sent in batches for efficiency
- **Retry Logic**: Automatic retry with exponential backoff
- **Queue Management**: Failed messages are queued for retry
- **Analytics**: Conversation metrics and user insights

## Demo Accounts

| Username | Password | Description |
|----------|----------|-------------|
| demo | password123 | General demo account |
| user | user123 | Standard user account |
| kent | advisor2024 | Kent J. themed account |
| admin | admin123 | Admin access account |
| guest | guest123 | Guest user account |

## Relationship Advice Categories

### 💬 Conversation Starters
Learn natural ways to break the ice and start meaningful conversations with potential partners.

### 💪 Building Confidence
Develop self-confidence, overcome social anxiety, and present your authentic self.

### 🔍 Finding Partners
Identify compatible partners, recognize red flags, and know where to meet like-minded people.

### 📅 Date Planning
Plan memorable, appropriate dates for any stage of your relationship journey.

### ❤️ Healthy Relationships
Maintain and nurture long-term relationships with effective communication and mutual respect.

### 🗣️ Communication Skills
Master active listening, express needs clearly, and resolve conflicts constructively.

## Maintenance

### Adding New Categories
1. Update `RELATIONSHIP_CATEGORIES` in `lib/config.ts`
2. Add corresponding prompts to `QUICK_PROMPTS`
3. Update the system prompt if needed

### Modifying AI Behavior
- Edit `KENT_J_SYSTEM_PROMPT` in `lib/constants.ts`
- Adjust chat parameters in `APP_CONFIG.chat`

### Updating n8n Integration
- Change workflow URL in `APP_CONFIG.n8n.workflowUrl`
- Modify payload structure in `N8nService.createPayload()`

## Security Considerations

- Demo authentication (replace with proper auth in production)
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure token generation and validation
- Environment variable protection

## Performance Optimizations

- Message batching for n8n integration
- Conversation session management
- Local storage for user data
- Optimized re-renders with React hooks
- Lazy loading of components

## Troubleshooting

### Common Issues

**Login Issues**
- Check demo credentials
- Clear browser storage
- Verify network connection

**Chat Not Working**
- Verify OpenAI API key
- Check API rate limits
- Review browser console for errors

**n8n Integration Issues**
- Test workflow URL manually
- Check n8n webhook configuration
- Review network connectivity

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed console logging
- Error stack traces
- Development tools

## Contributing

1. Follow TypeScript best practices
2. Maintain service layer separation
3. Add proper error handling
4. Update documentation
5. Test with demo accounts

## License

This project is licensed under the MIT License.
