"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, ChevronRight } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface IncidentData {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  status: string
  location: string
  timeAgo: string
  description: string
}

export function IncidentAlerts() {
  const [incidents, setIncidents] = useState<IncidentData[]>(
    iranRailwayData.incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      severity: incident.severity.toLowerCase() as "low" | "medium" | "high" | "critical",
      status: incident.status,
      location: incident.location,
      timeAgo: getTimeAgo(incident.reportedAt),
      description: incident.description,
    })),
  )
  const [loading, setLoading] = useState(false)

  function getTimeAgo(timestamp: string) {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prev) => [...prev])
    }, 60000)

    return () => clearInterval(interval)
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

  if (loading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Active Incidents - Iran Railway
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {incidents.length} active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 max-h-56 overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No active incidents</div>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                    {incident.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{incident.timeAgo}</span>
                </div>
                <div className="font-medium text-sm mb-1 line-clamp-1">{incident.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {incident.location}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))
        )}

        {incidents.length > 0 && (
          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View All Incidents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
