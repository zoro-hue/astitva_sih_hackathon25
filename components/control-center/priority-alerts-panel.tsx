"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, Users, MapPin, RefreshCw, Filter, CheckCircle } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface PriorityAlert {
  id: string
  type: string
  priority: string
  title: string
  message: string
  timestamp: string
  status: string
  location: string
  assignedTeam: string | null
  acknowledged: boolean
  acknowledgedBy: string | null
  acknowledgedAt: string | null
}

// Helper to normalize past timestamps to today's date while retaining time-of-day and relative offsets
const normalizeAlertDatesToToday = (sourceAlerts: PriorityAlert[]): PriorityAlert[] => {
  const now = new Date()
  return sourceAlerts.map((a) => {
    const srcTs = new Date(a.timestamp)
    // Build a new date for today using the original hours/minutes/seconds
    const todayTs = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      srcTs.getHours(),
      srcTs.getMinutes(),
      srcTs.getSeconds(),
      srcTs.getMilliseconds(),
    )

    let newAcknowledgedAt: string | null = a.acknowledgedAt
    if (a.acknowledgedAt) {
      const srcAck = new Date(a.acknowledgedAt)
      const deltaMs = srcAck.getTime() - srcTs.getTime()
      const todayAck = new Date(todayTs.getTime() + deltaMs)
      newAcknowledgedAt = todayAck.toISOString()
    }

    return {
      ...a,
      timestamp: todayTs.toISOString(),
      acknowledgedAt: newAcknowledgedAt,
    }
  })
}

export function PriorityAlertsPanel() {
  // Initialize alerts using normalized "today" timestamps rather than past 2024 dates
  const [alerts, setAlerts] = useState<PriorityAlert[]>(normalizeAlertDatesToToday(iranRailwayData.alerts))
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "unacknowledged":
        return "text-red-600 bg-red-50"
      case "acknowledged":
        return "text-orange-600 bg-orange-50"
      case "in progress":
        return "text-blue-600 bg-blue-50"
      case "resolved":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const filteredAlerts = alerts.filter(
    (alert) => selectedStatus === "all" || alert.status.toLowerCase().replace(" ", "") === selectedStatus,
  )

  const handleAction = (alertId: string, action: string) => {
    console.log(`[v0] Action ${action} triggered for alert ${alertId}`)

    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          switch (action) {
            case "Acknowledge":
              return {
                ...alert,
                status: "Acknowledged",
                acknowledged: true,
                acknowledgedBy: "Current User",
                acknowledgedAt: new Date().toISOString(),
              }
            case "Assign Team":
              // Find available team from dataset
              const availableTeam = iranRailwayData.teams.find((team) => team.status === "Available")
              return {
                ...alert,
                assignedTeam: availableTeam?.name || "Emergency Response Team",
                status: "In Progress",
              }
            default:
              return alert
          }
        }
        return alert
      }),
    )
  }

  useEffect(() => {
    // Ensure initial mount keeps normalized timestamps (no-op but preserves behavior if dataset changes)
    setAlerts((prev) => normalizeAlertDatesToToday(prev))
    const interval = setInterval(() => {
      // Simulate new alerts or status changes (timestamps already normalized to today)
      setAlerts((prev) => [...prev])
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Alerts - Iran Railway Network
            </CardTitle>
            <CardDescription>Real-time system alerts and incident notifications</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlerts(normalizeAlertDatesToToday(iranRailwayData.alerts))}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value="unacknowledged">Unacknowledged</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="space-y-4 mt-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(alert.priority)} mt-1`} />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="text-xs text-muted-foreground">
                        Type: {alert.type} | Priority: {alert.priority}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(alert.status)} variant="secondary">
                    {alert.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {alert.assignedTeam && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{alert.assignedTeam}</span>
                      </div>
                    )}
                    {alert.acknowledged && alert.acknowledgedBy && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Acknowledged by {alert.acknowledgedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!alert.acknowledged && (
                    <Button variant="default" size="sm" onClick={() => handleAction(alert.id, "Acknowledge")}>
                      Acknowledge
                    </Button>
                  )}
                  {!alert.assignedTeam && (
                    <Button variant="outline" size="sm" onClick={() => handleAction(alert.id, "Assign Team")}>
                      Assign Team
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleAction(alert.id, "Details")}>
                    Details
                  </Button>
                </div>
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No alerts found for the selected status.</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
