// Enhanced typing indicator
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import { APP_CONFIG } from "@/lib/config"

interface TypingIndicatorProps {
  message?: string
}

export function TypingIndicator({ message = "Kent is thinking..." }: TypingIndicatorProps) {
  return (
    <div className="flex items-start space-x-3 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
          <Heart className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: APP_CONFIG.ui.animationDelay.dot1 }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: APP_CONFIG.ui.animationDelay.dot2 }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: APP_CONFIG.ui.animationDelay.dot3 }}
            />
          </div>
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </div>
    </div>
  )
}
