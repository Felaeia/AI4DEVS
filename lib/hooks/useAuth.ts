"use client"

// Enhanced authentication hook
import { useState, useEffect, useCallback } from "react"
import { AuthService } from "@/lib/services/auth.service"
import type { User, UserProfile } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const result = await AuthService.login({ username, password })
    if (result.success && result.token && result.user) {
      AuthService.saveToken(result.token)
      setUser(result.user)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    AuthService.removeToken()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!user) return

      const updatedProfile = AuthService.updateUserProfile(user.username, updates)
      setUser({
        ...user,
        profile: updatedProfile,
      })
    },
    [user],
  )

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
  }
}
