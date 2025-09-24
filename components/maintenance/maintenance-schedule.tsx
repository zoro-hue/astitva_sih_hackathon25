"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, MapPin } from "lucide-react"

interface ScheduledMaintenance {
  id: string
  equipmentName: string
  equipmentType: string
  maintenanceType: "preventive" | "corrective" | "emergency"
  scheduledDate: string
  estimatedDuration: number
  technician: string
  location: string
  priority: "low" | "medium" | "high" | "critical"
  status: "scheduled" | "in_progress" | "completed" | "delayed"
}

export function MaintenanceSchedule() {
  const [schedule, setSchedule] = useState<ScheduledMaintenance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    // Mock scheduled maintenance data
    const mockSchedule: ScheduledMaintenance[] = [
      {
        id: "1",
        equipmentName: "WAP7-30281",
        equipmentType: "Locomotive",
        maintenanceType: "preventive",
        scheduledDate: "2024-01-25",
        estimatedDuration: 4,
        technician: "Rajesh Kumar",
        location: "New Delhi Shed",
        priority: "medium",
        status: "scheduled",
      },
      {
        id: "2",
        equipmentName: "Signal-NDLS-001",
        equipmentType: "Signal",
        maintenanceType: "corrective",
        scheduledDate: "2024-01-25",
        estimatedDuration: 2,
        technician: "Amit Singh",
        location: "New Delhi Platform 3",
        priority: "high",
        status: "in_progress",
      },
      {
        id: "3",
        equipmentName: "Track-KM-100",
        equipmentType: "Track",
        maintenanceType: "emergency",
        scheduledDate: "2024-01-25",
        estimatedDuration: 6,
        technician: "Suresh Patel",
        location: "Delhi-Mumbai Route KM 100",
        priority: "critical",
        status: "scheduled",
      },
      {
        id: "4",
        equipmentName: "Coach-ICF-2301",
        equipmentType: "Coach",
        maintenanceType: "preventive",
        scheduledDate: "2024-01-26",
        estimatedDuration: 3,
        technician: "Priya Sharma",
        location: "Chennai Yard",
        priority: "low",
        status: "scheduled",
      },
    ]

    setSchedule(mockSchedule)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "secondary"
      case "delayed":
        return "destructive"
      case "scheduled":
        return "outline"
      default:
        return "outline"
    }
  }

  const getMaintenanceTypeIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return "🚨"
      case "corrective":
        return "🔧"
      case "preventive":
        return "🛡️"
      default:
        return "⚙️"
    }
  }

  const filteredSchedule = schedule.filter((item) => item.scheduledDate === selectedDate)

  return (
    <Card className="h-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Maintenance Schedule
        </CardTitle>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-2 py-1 text-xs border rounded"
        />
      </CardHeader>
      <CardContent className="space-y-3 max-h-56 overflow-y-auto">
        {filteredSchedule.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No maintenance scheduled for this date</div>
          </div>
        ) : (
          filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="text-lg mt-1">{getMaintenanceTypeIcon(item.maintenanceType)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{item.equipmentName}</span>
                  <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                    {item.priority.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusColor(item.status)} className="text-xs">
                    {item.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-2">
                  {item.equipmentType} • {item.maintenanceType} maintenance
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.estimatedDuration}h
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.technician}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {item.status === "scheduled" && (
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    Start
                  </Button>
                )}
                {item.status === "in_progress" && (
                  <Button variant="default" size="sm" className="text-xs">
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))
        )}

        {filteredSchedule.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredSchedule.length} maintenance tasks scheduled</span>
              <span>Total duration: {filteredSchedule.reduce((sum, item) => sum + item.estimatedDuration, 0)}h</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
