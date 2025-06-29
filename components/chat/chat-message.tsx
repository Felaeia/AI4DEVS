import { memo } from "react"
import ReactMarkdown from "react-markdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Heart, Sparkles } from "lucide-react"
import type { ChatMessage } from "@/lib/types"

interface ChatMessageProps {
  message: ChatMessage
  showTimestamp?: boolean
  showCategory?: boolean
}

export const ChatMessageComponent = memo(function ChatMessageComponent({
  message,
  showTimestamp = false,
  showCategory = false,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const isKent = message.role === "assistant"

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback        
          className={
            isUser
              ? "bg-blue-500 text-white"
              : isKent
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                : "bg-gray-500 text-white"
          }
        >
          {isUser ? <User className="h-4 w-4" /> : isKent ? <Heart className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`max-w-[80%] ${isUser ? "ml-auto" : ""}`}>
        <div
          className={`p-4 rounded-xl ${
            isUser
              ? "bg-blue-500 text-white"
              : isKent
                ? "bg-gray-50 text-gray-900 border border-gray-200 dark:bg-black dark:text-gray-200 dark:border-gray-700"
                : "bg-yellow-50 text-yellow-900 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
          }`}
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p className="mb-3 text-[16px] leading-[1.7]">{props.children}</p>
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1">{props.children}</ul>
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1">{props.children}</ol>
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed">{props.children}</li>
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-gray-900 dark:text-gray-100">{props.children}</strong>
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-[17px] font-semibold mt-4 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-pink-500 dark:text-pink-400" />
                  {props.children}
                </h2>
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-pink-400 pl-3 italic text-gray-700 dark:text-gray-300 mb-3">
                  {props.children}
                </blockquote>
              ),
              code: ({ node, ...props }) => {
                const { inline, children, ...rest } = props as any;
                return inline ? (
                  <code className="bg-gray-200 dark:bg-balc-700 rounded px-1 py-0.5 text-sm" {...rest}>{children}</code>
                ) : (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-3 overflow-x-auto text-sm">
                    <code {...rest}>{children}</code>
                  </pre>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {showCategory && message.category && (
            <Badge variant="secondary" className="mt-2 text-xs">
              {message.category}
            </Badge>
          )}
        </div>

        {showTimestamp && (
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
})
