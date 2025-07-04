"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import { Navigation } from "@/components/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const suggestionPrompts = [
  "How can I report a problem in my neighborhood?",
  "What's the status of reported issues in downtown?",
  "How long does it typically take to resolve problems?",
  "Can I get updates on problems I've reported?",
  "What types of problems can be reported?",
  "How can I contact the city about urgent issues?",
  "Are there any ongoing maintenance projects?",
  "How can I volunteer to help with community issues?",
]

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm here to help you with community problems and questions. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Convert messages to the format expected by the API
      const apiMessages = messages.concat(userMessage).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }))

      // Call our API route instead of n8n directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response from chatbot")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "I'm sorry, I couldn't process your request at the moment. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error calling chat API:", error)

      // Fallback response for demo purposes
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm currently experiencing technical difficulties. Please try again later or contact support if the issue persists.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Community Assistant</h1>
              <p className="text-muted-foreground mt-1">Get help with community problems and questions</p>
            </div>

            {/* Chat Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4" ref={scrollAreaRef}>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  message.sender === "user" ? "bg-blue-500" : "bg-muted"
                                }`}
                              >
                                {message.sender === "user" ? (
                                  <User className="h-4 w-4 text-white" />
                                ) : (
                                  <Bot className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div
                                className={`rounded-lg px-4 py-2 ${
                                  message.sender === "user" ? "bg-blue-500 text-white" : "bg-muted text-foreground"
                                }`}
                              >
                                {message.sender === "bot" ? (
                                  <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        code({ node, className, children, ...props }) {
                                          const match = /language-(\w+)/.exec(className || "")
                                          const isInline = (props as any).inline
                                          return !isInline && match ? (
                                            <SyntaxHighlighter
                                              style={
                                                theme === "dark"
                                                  ? typeof oneDark === "object" && "default" in oneDark
                                                    ? (oneDark as any)
                                                    : { ...oneDark }
                                                  : typeof oneLight === "object" && "default" in oneLight
                                                    ? (oneLight as any)
                                                    : { ...oneLight }
                                              }
                                              language={match[1]}
                                              preTag="div"
                                              className="rounded-md"
                                            >
                                              {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                          ) : (
                                            <code
                                              className={`${className} bg-muted px-1 py-0.5 rounded text-sm`}
                                              {...props}
                                            >
                                              {children}
                                            </code>
                                          )
                                        },
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => (
                                          <ul className="list-disc list-inside mb-2">{children}</ul>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="list-decimal list-inside mb-2">{children}</ol>
                                        ),
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                                        blockquote: ({ children }) => (
                                          <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-2">
                                            {children}
                                          </blockquote>
                                        ),
                                        a: ({ children, href }) => (
                                          <a
                                            href={href}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {children}
                                          </a>
                                        ),
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-sm">{message.content}</p>
                                )}
                                <p
                                  className={`text-xs mt-1 ${
                                    message.sender === "user" ? "text-blue-100" : "text-muted-foreground"
                                  }`}
                                >
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Bot className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Suggested Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestionPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-3 whitespace-normal bg-transparent"
                          onClick={() => handleSuggestionClick(prompt)}
                          disabled={isLoading}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>You can ask me about:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Reporting community problems</li>
                        <li>Checking problem status</li>
                        <li>General community information</li>
                        <li>Contact information</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
