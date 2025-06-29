"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import LoginForm from "@/components/login-form"
import ChatInterface from "@/components/chat-interface"
import ThemeToggle from "@/components/theme-toggle"
import type { User } from "@/lib/types"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("kent_j_auth_token")
    if (token) {
      // Create user from stored token (simplified for demo)
      const username = token.split("_")[1]
      if (username) {
        setUser({
          id: `user_${username}`,
          username,
          token,
          loginTime: Date.now(),
          profile: undefined,
        })
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (user: User) => {
    console.log("Login successful, setting user:", user)
    setUser(user)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    localStorage.removeItem("kent_j_auth_token")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Kent J...</p>
      </div>
    )
  }

  console.log("Current user state:", user)

  return (
    <div className="min-h-screen">
      {/* Header with theme toggle */}
      <header className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </header>
      
      {!user ? <LoginForm onLogin={handleLogin} /> : <ChatInterface onLogout={handleLogout} user={user} />}
    </div>
  )
}
