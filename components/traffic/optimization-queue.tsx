"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Brain, CheckCircle, AlertTriangle, Play, Pause, RotateCcw } from "lucide-react"

interface OptimizationTask {
  id: string
  type: "route" | "schedule" | "maintenance" | "traffic"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  estimatedTime: number
  progress: number
  status: "queued" | "running" | "completed" | "failed" | "paused"
  affectedRoutes: string[]
  expectedImprovement: number
  startedAt?: string
  completedAt?: string
  algorithm: string
}

export function OptimizationQueue() {
  const [tasks, setTasks] = useState<OptimizationTask[]>([
    {
      id: "OPT-001",
      type: "route",
      priority: "high",
      title: "Tehran-Isfahan Route Optimization",
      description: "Applying Dijkstra's algorithm to find optimal path considering current traffic",
      estimatedTime: 300,
      progress: 85,
      status: "running",
      affectedRoutes: ["Tehran-Isfahan Corridor"],
      expectedImprovement: 15,
      startedAt: new Date(Date.now() - 255000).toISOString(),
      algorithm: "Dijkstra's Shortest Path",
    },
    {
      id: "OPT-002",
      type: "schedule",
      priority: "medium",
      title: "Peak Hour Schedule Optimization",
      description: "Optimizing train schedules for morning rush hour efficiency",
      estimatedTime: 180,
      progress: 100,
      status: "completed",
      affectedRoutes: ["Tehran-Mashhad Main Line", "Tehran-Tabriz Route"],
      expectedImprovement: 22,
      completedAt: new Date(Date.now() - 120000).toISOString(),
      algorithm: "Genetic Algorithm",
    },
    {
      id: "OPT-003",
      type: "maintenance",
      priority: "critical",
      title: "Predictive Maintenance Scheduling",
      description: "AI-powered maintenance scheduling to prevent signal failures",
      estimatedTime: 420,
      progress: 0,
      status: "queued",
      affectedRoutes: ["Tehran-Qom Line"],
      expectedImprovement: 35,
      algorithm: "Machine Learning Prediction",
    },
    {
      id: "OPT-004",
      type: "traffic",
      priority: "high",
      title: "Real-time Traffic Flow Optimization",
      description: "Dynamic traffic management using current congestion data",
      estimatedTime: 240,
      progress: 45,
      status: "running",
      affectedRoutes: ["All Active Routes"],
      expectedImprovement: 18,
      startedAt: new Date(Date.now() - 108000).toISOString(),
      algorithm: "A* Pathfinding",
    },
    {
      id: "OPT-005",
      type: "route",
      priority: "low",
      title: "Energy Efficiency Optimization",
      description: "Optimizing routes for minimal energy consumption",
      estimatedTime: 360,
      progress: 0,
      status: "queued",
      affectedRoutes: ["Tehran-Shiraz Route"],
      expectedImprovement: 12,
      algorithm: "Multi-objective Optimization",
    },
  ])

  const [selectedTab, setSelectedTab] = useState("all")
  const [isProcessing, setIsProcessing] = useState(true)

  // Simulate real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.status === "running" && task.progress < 100) {
            const newProgress = Math.min(100, task.progress + Math.random() * 5)
            const newStatus = newProgress >= 100 ? "completed" : "running"

            return {
              ...task,
              progress: newProgress,
              status: newStatus,
              completedAt: newStatus === "completed" ? new Date().toISOString() : task.completedAt,
            }
          }
          return task
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "running":
        return "text-blue-600 bg-blue-50"
      case "failed":
        return "text-red-600 bg-red-50"
      case "paused":
        return "text-orange-600 bg-orange-50"
      case "queued":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "running":
        return <Play className="w-4 h-4 text-blue-600" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "paused":
        return <Pause className="w-4 h-4 text-orange-600" />
      case "queued":
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "route":
        return "🗺️"
      case "schedule":
        return "⏰"
      case "maintenance":
        return "🔧"
      case "traffic":
        return "🚦"
      default:
        return "⚙️"
    }
  }

  const handleTaskAction = (taskId: string, action: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          switch (action) {
            case "start":
              return { ...task, status: "running", startedAt: new Date().toISOString() }
            case "pause":
              return { ...task, status: "paused" }
            case "restart":
              return { ...task, status: "running", progress: 0, startedAt: new Date().toISOString() }
            case "cancel":
              return { ...task, status: "queued", progress: 0 }
            default:
              return task
          }
        }
        return task
      }),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (selectedTab === "all") return true
    if (selectedTab === "active") return ["running", "queued"].includes(task.status)
    if (selectedTab === "completed") return task.status === "completed"
    return task.type === selectedTab
  })

  const runningTasks = tasks.filter((t) => t.status === "running").length
  const queuedTasks = tasks.filter((t) => t.status === "queued").length
  const completedTasks = tasks.filter((t) => t.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{runningTasks}</div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{queuedTasks}</div>
                <div className="text-sm text-muted-foreground">Queued</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    tasks.reduce((sum, t) => sum + (t.status === "completed" ? t.expectedImprovement : 0), 0),
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Total Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Optimization Queue - Iran Railway Network
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Automated optimization tasks using advanced algorithms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isProcessing ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm text-muted-foreground">{isProcessing ? "Processing" : "Idle"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({runningTasks + queuedTasks})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks})</TabsTrigger>
              <TabsTrigger value="route">Routes</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4 mt-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getTypeIcon(task.type)}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)} variant="secondary">
                            {task.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Algorithm: {task.algorithm} | Expected Improvement: +{task.expectedImprovement}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {task.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {task.status === "running" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(task.progress)}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Estimated time remaining: {Math.round((task.estimatedTime * (100 - task.progress)) / 100)}s
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Affected Routes:</span>
                        <span className="font-medium">{task.affectedRoutes.length}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{task.affectedRoutes.join(", ")}</div>
                    </div>
                    <div className="space-y-2">
                      {task.startedAt && (
                        <div className="flex justify-between">
                          <span>Started:</span>
                          <span className="font-medium">{new Date(task.startedAt).toLocaleTimeString()}</span>
                        </div>
                      )}
                      {task.completedAt && (
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span className="font-medium">{new Date(task.completedAt).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {task.status === "queued" && (
                      <Button variant="default" size="sm" onClick={() => handleTaskAction(task.id, "start")}>
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {task.status === "running" && (
                      <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "pause")}>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    {task.status === "paused" && (
                      <Button variant="default" size="sm" onClick={() => handleTaskAction(task.id, "start")}>
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    {(task.status === "completed" || task.status === "failed") && (
                      <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "restart")}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restart
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No optimization tasks found for the selected filter.</div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
