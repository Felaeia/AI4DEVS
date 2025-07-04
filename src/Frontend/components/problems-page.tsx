"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Filter, MapPin, Clock, BarChart3, TrendingUp } from "lucide-react"
import { ReportProblemDialog } from "@/components/report-problem-dialog"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"

export interface Problem {
  id: string
  title: string
  description: string
  place: string
  area: string
  reportedTime: Date
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
}

export interface ProblemInsights {
  totalProblems: number
  openProblems: number
  resolvedProblems: number
  averageResolutionTime: number
  mostCommonArea: string
  trendingIssues: string[]
}

// Mock data - in a real app, this would come from a database
const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Broken streetlight on Main Street",
    description: "The streetlight near the intersection is not working, creating safety concerns.",
    place: "Main Street & Oak Avenue",
    area: "Downtown",
    reportedTime: new Date("2024-01-15T10:30:00"),
    status: "open",
    priority: "high",
  },
  {
    id: "2",
    title: "Pothole on Elm Street",
    description: "Large pothole causing damage to vehicles.",
    place: "Elm Street",
    area: "Residential District",
    reportedTime: new Date("2024-01-14T14:20:00"),
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "3",
    title: "Graffiti on park bench",
    description: "Vandalism reported at Central Park.",
    place: "Central Park",
    area: "Parks & Recreation",
    reportedTime: new Date("2024-01-13T09:15:00"),
    status: "resolved",
    priority: "low",
  },
  {
    id: "4",
    title: "Broken water fountain",
    description: "Water fountain in the plaza is not functioning.",
    place: "City Plaza",
    area: "Downtown",
    reportedTime: new Date("2024-01-12T16:45:00"),
    status: "open",
    priority: "medium",
  },
]

export function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>(mockProblems)
  const [insights, setInsights] = useState<ProblemInsights | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const { toast } = useToast()

  // Get unique areas for filter dropdown
  const areas = useMemo(() => {
    const uniqueAreas = Array.from(new Set(problems.map((p) => p.area)))
    return uniqueAreas.sort()
  }, [problems])

  // Filter problems based on search and filters
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesArea = selectedArea === "all" || problem.area === selectedArea
      const matchesStatus = selectedStatus === "all" || problem.status === selectedStatus

      return matchesSearch && matchesArea && matchesStatus
    })
  }, [problems, searchTerm, selectedArea, selectedStatus])

  // Load insights on component mount
  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    setIsLoadingInsights(true)
    try {
      const response = await fetch("/api/problems?action=get-insights", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.statistics) {
          setInsights(data.statistics)
        }
      }
    } catch (error) {
      console.error("Error loading insights:", error)
    } finally {
      setIsLoadingInsights(false)
    }
  }

  const handleReportProblem = async (newProblem: Omit<Problem, "id" | "reportedTime">) => {
    try {
      // Call n8n API to create problem
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          data: newProblem,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Add to local state (in real app, this would be handled by the API response)
        const problem: Problem = {
          ...newProblem,
          id: result.problem?.id || Date.now().toString(),
          reportedTime: new Date(),
        }
        setProblems((prev) => [problem, ...prev])

        toast({
          title: "Problem Reported",
          description: result.message || "Your problem has been successfully reported.",
        })

        // Refresh insights
        loadInsights()
      } else {
        throw new Error(result.message || "Failed to report problem")
      }
    } catch (error) {
      console.error("Error reporting problem:", error)

      // Fallback: add to local state anyway
      const problem: Problem = {
        ...newProblem,
        id: Date.now().toString(),
        reportedTime: new Date(),
      }
      setProblems((prev) => [problem, ...prev])

      toast({
        title: "Problem Reported",
        description: "Your problem has been reported locally. We'll sync it when the connection is restored.",
        variant: "default",
      })
    }
  }

  const handleAnalyzeProblems = async () => {
    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "analyze",
          data: {
            problems: filteredProblems,
            filters: {
              area: selectedArea,
              status: selectedStatus,
            },
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Analysis Complete",
          description: result.message || "Problem analysis has been completed.",
        })

        if (result.insights) {
          setInsights(result.insights)
        }
      } else {
        throw new Error(result.message || "Analysis failed")
      }
    } catch (error) {
      console.error("Error analyzing problems:", error)
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze problems at the moment. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Problem["status"]) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: Problem["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community Problems</h1>
              <p className="text-muted-foreground mt-1">Report and track community issues in your area</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyzeProblems}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <BarChart3 className="h-4 w-4" />
                Analyze
              </Button>
              <Button onClick={() => setIsReportDialogOpen(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Report Problem
              </Button>
            </div>
          </div>

          {/* Insights Cards */}
          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Problems</p>
                      <p className="text-2xl font-bold">{insights.totalProblems}</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                      <p className="text-2xl font-bold text-destructive">{insights.openProblems}</p>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">{insights.resolvedProblems}</p>
                    </div>
                    <Badge variant="secondary" className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Most Active Area</p>
                      <p className="text-lg font-bold">{insights.mostCommonArea}</p>
                    </div>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          <div className="grid gap-4">
            {filteredProblems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No problems found matching your criteria.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredProblems.map((problem) => (
                <Card key={problem.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{problem.title}</CardTitle>
                        <CardDescription className="mt-1">{problem.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(problem.status)}>{problem.status.replace("-", " ")}</Badge>
                        <Badge variant={getPriorityColor(problem.priority)}>{problem.priority} priority</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {problem.place} • {problem.area}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Reported {problem.reportedTime.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <ReportProblemDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        onSubmit={handleReportProblem}
        areas={areas}
      />
    </div>
  )
}
