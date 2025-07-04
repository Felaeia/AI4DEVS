"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Problem } from "./problems-page"

interface ReportProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (problem: Omit<Problem, "id" | "reportedTime">) => void
  areas: string[]
}

export function ReportProblemDialog({ open, onOpenChange, onSubmit, areas }: ReportProblemDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    place: "",
    area: "",
    priority: "medium" as Problem["priority"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.place || !formData.area) {
      return
    }

    onSubmit({
      ...formData,
      status: "open",
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      place: "",
      area: "",
      priority: "medium",
    })

    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report a Problem</DialogTitle>
          <DialogDescription>Help improve your community by reporting issues that need attention.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the problem"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide more details about the problem"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place">Location *</Label>
            <Input
              id="place"
              value={formData.place}
              onChange={(e) => handleInputChange("place", e.target.value)}
              placeholder="Specific address or location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area *</Label>
            <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
                <SelectItem value="Downtown">Downtown</SelectItem>
                <SelectItem value="Residential District">Residential District</SelectItem>
                <SelectItem value="Parks & Recreation">Parks & Recreation</SelectItem>
                <SelectItem value="Industrial Zone">Industrial Zone</SelectItem>
                <SelectItem value="Commercial District">Commercial District</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: Problem["priority"]) => handleInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
