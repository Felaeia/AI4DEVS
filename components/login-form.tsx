"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/error-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Heart, Lock, User, Eye, EyeOff } from "lucide-react"
import { APP_CONFIG, DEMO_USERS } from "@/lib/config"
import type { LoginFormProps } from "@/lib/types"

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", { username, password })

    setIsLoading(true)
    setError("")

    try {
      // Simple validation first
      if (!username || !password) {
        setError("Please enter both username and password")
        setIsLoading(false)
        return
      }

      // Check credentials directly
      if (DEMO_USERS[username as keyof typeof DEMO_USERS] === password) {
        console.log("Credentials valid, creating user...")

        // Create user object directly
        const user = {
          id: `user_${username}`,
          username,
          token: `token_${username}_${Date.now()}`,
          loginTime: Date.now(),
          profile: undefined,
        }

        console.log("User created:", user)

        // Save to localStorage
        localStorage.setItem("kent_j_auth_token", user.token)

        // Call onLogin
        onLogin(user)
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`bg-gradient-to-r ${APP_CONFIG.ui.themes.primary} p-3 rounded-full shadow-lg`}>
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome to {APP_CONFIG.app.name}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{APP_CONFIG.app.tagline}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-medium mb-2">Demo Accounts (click to use):</p>
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-1 text-xs"
                  onClick={() => handleQuickLogin("demo", "password123")}
                >
                  demo / password123
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-1 text-xs"
                  onClick={() => handleQuickLogin("user", "user123")}
                >
                  user / user123
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-auto p-1 text-xs"
                  onClick={() => handleQuickLogin("kent", "advisor2024")}
                >
                  kent / advisor2024
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${APP_CONFIG.ui.themes.primary} hover:opacity-90 transition-opacity`}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
