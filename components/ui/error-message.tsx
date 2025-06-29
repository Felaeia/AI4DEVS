"use client"

// Enhanced error message component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  title?: string
  message: string
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  variant?: "destructive" | "warning"
}

export function ErrorMessage({
  title,
  message,
  className,
  dismissible = false,
  onDismiss,
  variant = "destructive",
}: ErrorMessageProps) {
  return (
    <Alert variant={variant} className={className}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </div>
      {dismissible && onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} className="h-auto p-1">
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
