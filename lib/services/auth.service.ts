// Enhanced authentication service
import { APP_CONFIG, DEMO_USERS } from "@/lib/config"
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants"
import type { AuthResponse, LoginCredentials, User, UserProfile } from "@/lib/types"

export class AuthService {
  private static readonly TOKEN_KEY = APP_CONFIG.auth.tokenKey
  private static readonly PROFILE_KEY = "kent_j_user_profile"
  private static loginAttempts = new Map<string, number>()

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { username, password } = credentials

      // Check for too many attempts
      const attempts = this.loginAttempts.get(username) || 0
      if (attempts >= APP_CONFIG.auth.maxLoginAttempts) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.TOO_MANY_ATTEMPTS,
        }
      }

      if (DEMO_USERS[username as keyof typeof DEMO_USERS] === password) {
        // Reset attempts on successful login
        this.loginAttempts.delete(username)

        const token = this.generateToken(username)
        const user: User = {
          id: this.generateUserId(username),
          username,
          token,
          loginTime: Date.now(),
          profile: this.getUserProfile(username),
        }

        return {
          success: true,
          token,
          user,
          message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
        }
      } else {
        // Increment failed attempts
        this.loginAttempts.set(username, attempts + 1)
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.GENERAL.SERVER_ERROR,
      }
    }
  }

  static generateToken(username: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    return Buffer.from(`${username}:${timestamp}:${randomString}`).toString("base64")
  }

  static generateUserId(username: string): string {
    return `user_${username}`
  }

  static saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.PROFILE_KEY)
  }

  static isTokenValid(token: string): boolean {
    try {
      const decoded = Buffer.from(token, "base64").toString()
      const [, timestamp] = decoded.split(":")
      const tokenAge = Date.now() - Number.parseInt(timestamp)
      return tokenAge < APP_CONFIG.auth.sessionTimeout
    } catch {
      return false
    }
  }

  static getCurrentUser(): User | null {
    const token = this.getToken()
    if (!token || !this.isTokenValid(token)) {
      return null
    }

    try {
      const decoded = Buffer.from(token, "base64").toString()
      const [username, timestamp] = decoded.split(":")
      return {
        id: this.generateUserId(username),
        username,
        token,
        loginTime: Number.parseInt(timestamp),
        profile: this.getUserProfile(username),
      }
    } catch {
      return null
    }
  }

  static getUserProfile(username: string): UserProfile | undefined {
    try {
      const stored = localStorage.getItem(`${this.PROFILE_KEY}_${username}`)
      return stored ? JSON.parse(stored) : undefined
    } catch {
      return undefined
    }
  }

  static saveUserProfile(username: string, profile: UserProfile): void {
    localStorage.setItem(`${this.PROFILE_KEY}_${username}`, JSON.stringify(profile))
  }

  static updateUserProfile(username: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile(username) || {}
    const updated = { ...current, ...updates }
    this.saveUserProfile(username, updated)
    return updated
  }
}
