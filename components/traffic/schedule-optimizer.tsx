"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Zap, Train } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface ScheduleOptimization {
  trainId: string
  trainName: string
  route: string
  currentDeparture: string
  optimizedDeparture: string
  currentArrival: string
  optimizedArrival: string
  timeSaved: number
  conflictResolved: boolean
  passengerImpact: "positive" | "neutral" | "negative"
  status: "pending" | "approved" | "implemented"
}

export function ScheduleOptimizer() {
  const [optimizations, setOptimizations] = useState<ScheduleOptimization[]>(
    iranRailwayData.trains.map((train, index) => ({
      trainId: train.id,
      trainName: train.name,
      route: train.route,
      currentDeparture: "16:55",
      optimizedDeparture: "16:40",
      currentArrival: train.estimatedArrival,
      optimizedArrival: addMinutes(train.estimatedArrival, -15),
      timeSaved: 15 + Math.floor(Math.random() * 20),
      conflictResolved: Math.random() > 0.3,
      passengerImpact: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as
        | "positive"
        | "neutral"
        | "negative",
      status: ["pending", "approved", "implemented"][index % 3] as "pending" | "approved" | "implemented",
    })),
  )
  const [filter, setFilter] = useState<"all" | "pending" | "high_impact">("all")

  function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "default"
      case "approved":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600"
      case "neutral":
        return "text-blue-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "↗️"
      case "neutral":
        return "➡️"
      case "negative":
        return "↘️"
      default:
        return "➡️"
    }
  }

  const filteredOptimizations = optimizations.filter((opt) => {
    if (filter === "pending") return opt.status === "pending"
    if (filter === "high_impact") return opt.timeSaved >= 20
    return true
  })

  const totalTimeSaved = optimizations
    .filter((opt) => opt.status === "implemented")
    .reduce((sum, opt) => sum + opt.timeSaved, 0)

  return (
    <Card className="h-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Schedule Optimizer - Iran Railway
        </CardTitle>
        <div className="flex gap-2">
          {(["all", "pending", "high_impact"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-xs"
            >
              {filterType === "all" ? "All" : filterType === "pending" ? "Pending" : "High Impact"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 p-2 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{totalTimeSaved}min</div>
            <div className="text-xs text-muted-foreground">Total Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {optimizations.filter((o) => o.status === "pending").length}
            </div>
            <div className="text-xs text-muted-foreground">Pending Approval</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {optimizations.filter((o) => o.conflictResolved).length}
            </div>
            <div className="text-xs text-muted-foreground">Conflicts Resolved</div>
          </div>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredOptimizations.map((opt, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Train className="w-3 h-3" />
                  <span className="font-medium text-sm">{opt.trainId}</span>
                  <Badge variant={getStatusColor(opt.status)} className="text-xs">
                    {opt.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs">{getImpactIcon(opt.passengerImpact)}</span>
                </div>

                <div className="text-xs text-muted-foreground mb-1">
                  {opt.trainName} - {opt.route}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span>{opt.currentDeparture}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-medium">{opt.optimizedDeparture}</span>
                  </div>
                  <div className="text-muted-foreground">|</div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-green-500" />
                    <span className="font-medium text-green-600">+{opt.timeSaved}min</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {opt.status === "pending" && (
                  <Button variant="default" size="sm" className="text-xs">
                    Approve
                  </Button>
                )}
                {opt.status === "approved" && (
                  <Button variant="secondary" size="sm" className="text-xs">
                    Implement
                  </Button>
                )}
                {opt.status === "implemented" && (
                  <Badge variant="default" className="text-xs">
                    ✓ Done
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOptimizations.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <div className="text-xs">No optimizations match the current filter</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
