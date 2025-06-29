"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChatMessageComponent } from "@/components/chat/chat-message"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { CategorySelector } from "@/components/chat/category-selector"
import { Heart, LogOut, Send, Sparkles, MessageCircle, User } from "lucide-react"
import { APP_CONFIG, QUICK_PROMPTS } from "@/lib/config"
import type { ChatInterfaceProps, ChatMessage } from "@/lib/types"
import { shuffleArray } from "@/lib/utils"

export default function ChatInterface({ onLogout, user }: ChatInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isQuickPromptsLoading, setIsQuickPromptsLoading] = useState(false)

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setShowCategorySelector(false)

    setIsQuickPromptsLoading(true)
    setTimeout(() => {
      setIsQuickPromptsLoading(false)
    }, 600) // adjust duration to your liking
  }, [])

  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt)
    setShowCategorySelector(false)
  }, [])

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      category: selectedCategory,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const conversationMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      const data = await response.json()

      if (response.ok) {
        const aiMessage: ChatMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          category: selectedCategory,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [...prev, {
        id: generateMessageId(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        category: selectedCategory,
      }])
    } finally {
      setIsLoading(false)
    }
  }



  const filteredQuickPrompts = useMemo(() => {
    const prompts = selectedCategory
      ? QUICK_PROMPTS.filter((p) => p.category === selectedCategory)
      : QUICK_PROMPTS
    return shuffleArray(Array.from(prompts))
  }, [selectedCategory])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-r ${APP_CONFIG.ui.themes.primary} p-2 rounded-full shadow-lg`}>
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{APP_CONFIG.app.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{APP_CONFIG.app.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MessageCircle className="h-4 w-4" />
              <span>{messages.length} messages</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Sidebar - Quick Suggestions */}
          <div className="lg:col-span-1 space-y-4">
            {selectedCategory && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-2">{selectedCategory.replace("_", " ")}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("")
                      setShowCategorySelector(true)
                    }}
                    className="w-full"
                  >
                    Change Topic
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isQuickPromptsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))
                ) : (
                  filteredQuickPrompts.slice(0, 4).map((prompt, index) => (
                    <Button
                      key={`${prompt.category}-${index}`}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto p-2 text-xs whitespace-normal border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleQuickPrompt(prompt.text)}
                    >
                      {prompt.text}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Chat with {APP_CONFIG.app.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[60vh] p-5">
                  {showCategorySelector && messages.length === 0 && (
                    <div className="mb-6 text-center">
                      <CategorySelector onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />
                    </div>
                  )}

                  {messages.length === 0 && !showCategorySelector && (
                    <div className="text-center py-8">
                      <div className={`bg-gradient-to-r ${APP_CONFIG.ui.themes.primary} p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg`}>
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-100">
                        Hi {user.username}! I'm {APP_CONFIG.app.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        I'm here to help you navigate relationships and dating. What would you like to talk about today?
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <ChatMessageComponent key={message.id} message={message} showTimestamp={true} showCategory={false} />
                  ))}

                  {isLoading && <TypingIndicator message="Kent is thinking about your question..." />}
                </ScrollArea>
              </CardContent>
              <CardFooter className="pt-3">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${APP_CONFIG.app.name} about relationships, dating, or personal development...`}
                    className="flex-1"
                    disabled={isLoading}
                    maxLength={1000}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
