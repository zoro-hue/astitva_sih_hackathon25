"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Bot, User } from "lucide-react"

interface WorkOrder {
  id: string
  title: string
  priority: "critical" | "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "failed"
  estimatedTime: number
  impact: string
  trainsAffected: number
  costSavings: number
  assignedBy: "ai" | "controller" | "station"
  assignedByName: string
  confidence: number
  timeAgo: string
  progress?: number
  failureReason?: string
  completedTime?: string
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO001",
    title: "Reroute Express 12001",
    priority: "high",
    status: "pending",
    estimatedTime: 3,
    impact: "High",
    trainsAffected: 2,
    costSavings: 8500,
    assignedBy: "ai",
    assignedByName: "System AI",
    confidence: 92,
    timeAgo: "5m ago",
  },
  {
    id: "WO002",
    title: "Speed Optimization NGP-HWH",
    priority: "medium",
    status: "in-progress",
    estimatedTime: 5,
    impact: "Medium",
    trainsAffected: 2,
    costSavings: 4200,
    assignedBy: "controller",
    assignedByName: "Controller A. Sharma",
    confidence: 87,
    timeAgo: "10m ago",
    progress: 65,
  },
  {
    id: "WO003",
    title: "Schedule Adjustment Platform 3",
    priority: "low",
    status: "completed",
    estimatedTime: 2,
    impact: "Low",
    trainsAffected: 2,
    costSavings: 2350,
    assignedBy: "station",
    assignedByName: "Station Master",
    confidence: 78,
    timeAgo: "20m ago",
    completedTime: "15m ago",
  },
  {
    id: "WO004",
    title: "Emergency Reroute Freight 18029",
    priority: "high",
    status: "failed",
    estimatedTime: 4,
    impact: "High",
    trainsAffected: 1,
    costSavings: 6800,
    assignedBy: "ai",
    assignedByName: "System AI",
    confidence: 95,
    timeAgo: "30m ago",
    failureReason: "Track maintenance conflict",
  },
]

export function AIWorkOrderQueue() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders)
  const [selectedTab, setSelectedTab] = useState("all")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <TrendingUp className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAssignedByIcon = (assignedBy: string) => {
    return assignedBy === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  const handleImplement = (orderId: string) => {
    setWorkOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: "in-progress" as const, progress: 0 } : order)),
    )
  }

  const handleCancel = (orderId: string) => {
    setWorkOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const filteredOrders = workOrders.filter((order) => {
    if (selectedTab === "all") return true
    return order.status === selectedTab
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI-Powered Work Order Queue
        </CardTitle>
        <CardDescription>Prioritized maintenance tasks with AI-generated recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Status</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4 mt-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)} mt-2`} />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{order.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status.replace("-", " ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{order.estimatedTime} min Est. Time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {order.priority}
                  </Badge>
                </div>

                {order.status === "in-progress" && order.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="ml-1 font-medium">{order.impact}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trains:</span>
                    <span className="ml-1 font-medium">{order.trainsAffected}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Savings:</span>
                    <span className="ml-1 font-medium text-green-600">₹{order.costSavings.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getAssignedByIcon(order.assignedBy)}
                    <span>
                      By {order.assignedByName} • {order.timeAgo}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {order.confidence}% confidence
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleCancel(order.id)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleImplement(order.id)}>
                          Implement
                        </Button>
                      </>
                    )}
                    {order.status === "in-progress" && (
                      <Button variant="outline" size="sm">
                        In Progress
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <div className="text-sm text-green-600">
                        Completed {order.completedTime} • Saved ₹{order.costSavings.toLocaleString()}
                      </div>
                    )}
                    {order.status === "failed" && (
                      <div className="text-sm text-red-600">Failed: {order.failureReason}</div>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
