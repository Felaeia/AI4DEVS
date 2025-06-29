// Enhanced loading spinner component
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "primary" | "secondary" | "white"
}

export function LoadingSpinner({ size = "md", className, color = "primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  }

  const colorClasses = {
    primary: "border-gray-300 border-t-blue-600",
    secondary: "border-gray-300 border-t-pink-500",
    white: "border-gray-400 border-t-white",
  }

  return (
    <div
      className={cn("animate-spin rounded-full", sizeClasses[size], colorClasses[color], className)}
      role="status"
      aria-label="Loading"
    />
  )
}
