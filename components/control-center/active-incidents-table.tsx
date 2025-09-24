"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Users, TrendingUp, Download, Plus, MapPin, Train } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface ActiveIncident {
  id: string
  title: string
  severity: string
  status: string
  location: string
  reportedAt: string
  affectedTrains: string[]
  assignedTeam: string
  estimatedResolution: string
  description: string
  impact: string
}

export function ActiveIncidentsTable() {
  const [incidents, setIncidents] = useState<ActiveIncident[]>(iranRailwayData.incidents)

  const getPriorityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case "active":
        return "text-red-600 bg-red-50"
      case "in progress":
        return "text-blue-600 bg-blue-50"
      case "monitoring":
        return "text-orange-600 bg-orange-50"
      case "resolved":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getImpactColor = (count: number) => {
    if (count >= 5) return "text-red-600 font-bold"
    if (count >= 2) return "text-orange-600 font-semibold"
    return "text-green-600"
  }

  const handleIncidentAction = (incidentId: string, action: string) => {
    console.log(`[v0] Incident action ${action} triggered for ${incidentId}`)

    if (action === "Update") {
      setIncidents((prev) =>
        prev.map((incident) => (incident.id === incidentId ? { ...incident, status: "In Progress" } : incident)),
      )
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prev) => [...prev])
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Incidents - Iran Railway Network
            </CardTitle>
            <CardDescription>Current incidents requiring immediate attention</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Incident
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Incident ID</th>
                <th className="text-left p-3">Title & Location</th>
                <th className="text-left p-3">Severity</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Assigned Team</th>
                <th className="text-left p-3">Timeline</th>
                <th className="text-center p-3">Impact</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-mono text-sm">{incident.id}</td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-semibold">{incident.title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </div>
                      <div className="text-xs text-muted-foreground">{incident.description}</div>
                      <div className="text-xs text-blue-600">{incident.impact}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge className={getPriorityColor(incident.severity)} variant="secondary">
                      {incident.severity}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={getStatusColor(incident.status)} variant="secondary">
                      {incident.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{incident.assignedTeam}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Reported: {new Date(incident.reportedAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>ETA: {new Date(incident.estimatedResolution).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className={`text-lg font-bold ${getImpactColor(incident.affectedTrains.length)}`}>
                      {incident.affectedTrains.length}
                    </div>
                    <div className="text-xs text-muted-foreground">trains</div>
                    {incident.affectedTrains.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <Train className="h-3 w-3 inline mr-1" />
                        {incident.affectedTrains.slice(0, 2).join(", ")}
                        {incident.affectedTrains.length > 2 && "..."}
                      </div>
                    )}
                  </td>
                  <td className="text-center p-3">
                    <div className="flex gap-1 justify-center">
                      <Button variant="ghost" size="sm" onClick={() => handleIncidentAction(incident.id, "View")}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleIncidentAction(incident.id, "Update")}>
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter((i) => i.severity === "Critical").length}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {incidents.filter((i) => i.severity === "High").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {incidents.filter((i) => i.status === "Active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {incidents.reduce((sum, i) => sum + i.affectedTrains.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Trains Affected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
