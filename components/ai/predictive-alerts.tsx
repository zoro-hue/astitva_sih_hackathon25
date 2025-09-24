"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, Zap } from "lucide-react"

interface PredictiveAlert {
  id: string
  type: "equipment" | "weather" | "traffic" | "safety"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  location: string
  predictedTime: string
  confidence: number
  preventiveActions: string[]
}

export function PredictiveAlerts() {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-generated predictive alerts
    const mockAlerts: PredictiveAlert[] = [
      {
        id: "1",
        type: "equipment",
        severity: "high",
        title: "Potential Signal Failure",
        description: "Signal system at Junction J-15 showing degradation patterns",
        location: "Junction J-15, Sector 7",
        predictedTime: "2-3 days",
        confidence: 89,
        preventiveActions: ["Schedule immediate inspection", "Prepare backup signal system", "Alert maintenance crew"],
      },
      {
        id: "2",
        type: "weather",
        severity: "medium",
        title: "Heavy Rain Impact",
        description: "Monsoon forecast indicates potential flooding on Route R-23",
        location: "Route R-23, KM 45-52",
        predictedTime: "6-8 hours",
        confidence: 76,
        preventiveActions: ["Deploy drainage pumps", "Reduce train speeds", "Monitor water levels"],
      },
      {
        id: "3",
        type: "traffic",
        severity: "medium",
        title: "Congestion Buildup",
        description: "Peak hour traffic pattern suggests 25% delay increase",
        location: "Central Station Hub",
        predictedTime: "1-2 hours",
        confidence: 82,
        preventiveActions: ["Redistribute train schedules", "Open additional platforms", "Notify passengers"],
      },
      {
        id: "4",
        type: "safety",
        severity: "critical",
        title: "Track Stress Alert",
        description: "Thermal expansion patterns indicate potential track buckling",
        location: "Track T-12, KM 78",
        predictedTime: "4-6 hours",
        confidence: 94,
        preventiveActions: ["Immediate speed restrictions", "Deploy inspection team", "Prepare alternate routing"],
      },
    ]

    setTimeout(() => {
      setAlerts(mockAlerts)
      setLoading(false)
    }, 1200)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "equipment":
        return <Zap className="h-4 w-4" />
      case "weather":
        return <AlertTriangle className="h-4 w-4" />
      case "traffic":
        return <Clock className="h-4 w-4" />
      case "safety":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Predictive Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Predictive Alerts
        </CardTitle>
        <CardDescription>AI-powered early warning system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(alert.type)}
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <Badge variant="outline">{alert.confidence}% confidence</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{alert.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expected in {alert.predictedTime}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-medium">Preventive Actions:</h5>
                <div className="space-y-1">
                  {alert.preventiveActions.map((action, index) => (
                    <div key={index} className="text-xs bg-muted p-2 rounded flex items-center justify-between">
                      <span>{action}</span>
                      <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
