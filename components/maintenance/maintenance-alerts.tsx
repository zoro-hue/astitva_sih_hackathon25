"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Wrench, X } from "lucide-react"

interface MaintenanceAlert {
  id: string
  type: "overdue" | "due_soon" | "critical_failure" | "prediction"
  equipment: string
  message: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  actionRequired: boolean
}

export function MaintenanceAlerts() {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([])

  useEffect(() => {
    // Mock maintenance alerts
    const mockAlerts: MaintenanceAlert[] = [
      {
        id: "1",
        type: "critical_failure",
        equipment: "Track-KM-100",
        message: "Critical rail wear detected. Immediate replacement required.",
        severity: "critical",
        timestamp: "2024-01-25T10:30:00Z",
        actionRequired: true,
      },
      {
        id: "2",
        type: "overdue",
        equipment: "Signal-NDLS-001",
        message: "Maintenance overdue by 15 days. LED modules showing degradation.",
        severity: "high",
        timestamp: "2024-01-25T09:15:00Z",
        actionRequired: true,
      },
      {
        id: "3",
        type: "due_soon",
        equipment: "WAP7-30281",
        message: "Scheduled maintenance due in 3 days. Bearing inspection required.",
        severity: "medium",
        timestamp: "2024-01-25T08:45:00Z",
        actionRequired: false,
      },
      {
        id: "4",
        type: "prediction",
        equipment: "Coach-ICF-2301",
        message: "AI predicts door mechanism failure in 2 weeks. Consider early maintenance.",
        severity: "low",
        timestamp: "2024-01-25T07:20:00Z",
        actionRequired: false,
      },
    ]

    setAlerts(mockAlerts)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical_failure":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "overdue":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "due_soon":
        return <Wrench className="w-4 h-4 text-yellow-500" />
      case "prediction":
        return <div className="w-4 h-4 rounded-full bg-blue-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Maintenance Alerts
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {alerts.length} active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 max-h-72 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No active alerts</div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1">{getTypeIcon(alert.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{getTimeAgo(alert.timestamp)}</span>
                </div>

                <div className="font-medium text-sm mb-1">{alert.equipment}</div>
                <div className="text-xs text-muted-foreground mb-2">{alert.message}</div>

                {alert.actionRequired && (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="text-xs">
                      Take Action
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Schedule
                    </Button>
                  </div>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="p-1 h-auto">
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
