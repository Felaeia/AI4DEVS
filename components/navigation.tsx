"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              Community Tracker
            </Link>

            <div className="flex space-x-4">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"} className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Problems
                </Button>
              </Link>

              <Link href="/chatbot">
                <Button variant={pathname === "/chatbot" ? "default" : "ghost"} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Assistant
                </Button>
              </Link>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
