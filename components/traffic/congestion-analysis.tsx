"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HeatMapGrid } from "react-grid-heatmap"
import { Activity, AlertTriangle } from "lucide-react"

interface CongestionPoint {
  location: string
  severity: "low" | "medium" | "high" | "critical"
  congestionLevel: number
  affectedTrains: number
  averageDelay: number
  peakHours: string
  causes: string[]
}

export function CongestionAnalysis() {
  const [congestionPoints, setCongestionPoints] = useState<CongestionPoint[]>([])
  const [selectedPoint, setSelectedPoint] = useState<string>("")
  const [heatmapData, setHeatmapData] = useState<number[][]>([])

  useEffect(() => {
    // Mock congestion data
    const mockCongestionPoints: CongestionPoint[] = [
      {
        location: "Kanpur Central",
        severity: "critical",
        congestionLevel: 92,
        affectedTrains: 18,
        averageDelay: 25,
        peakHours: "07:00-10:00, 18:00-21:00",
        causes: ["Signal bottleneck", "Platform capacity", "Freight interference"],
      },
      {
        location: "Vadodara Junction",
        severity: "high",
        congestionLevel: 78,
        affectedTrains: 12,
        averageDelay: 18,
        peakHours: "08:00-11:00, 19:00-22:00",
        causes: ["Track maintenance", "Crew change delays"],
      },
      {
        location: "Allahabad Junction",
        severity: "medium",
        congestionLevel: 65,
        affectedTrains: 8,
        averageDelay: 12,
        peakHours: "06:00-09:00, 17:00-20:00",
        causes: ["Weather conditions", "Passenger loading time"],
      },
      {
        location: "Katpadi Junction",
        severity: "low",
        congestionLevel: 45,
        affectedTrains: 4,
        averageDelay: 8,
        peakHours: "09:00-12:00",
        causes: ["Minor signal delays"],
      },
    ]

    // Mock heatmap data (24 hours x 7 days)
    const mockHeatmapData: number[][] = []
    for (let day = 0; day < 7; day++) {
      const dayData: number[] = []
      for (let hour = 0; hour < 24; hour++) {
        let congestion = Math.random() * 30 + 20

        // Simulate peak hours
        if ((hour >= 7 && hour <= 10) || (hour >= 18 && hour <= 21)) {
          congestion = Math.random() * 40 + 60
        }

        // Weekend patterns
        if (day >= 5) {
          congestion *= 0.7
        }

        dayData.push(Math.round(congestion))
      }
      mockHeatmapData.push(dayData)
    }

    setCongestionPoints(mockCongestionPoints)
    setSelectedPoint(mockCongestionPoints[0]?.location || "")
    setHeatmapData(mockHeatmapData)
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

  const getCongestionColor = (level: number) => {
    if (level >= 80) return "text-red-600"
    if (level >= 60) return "text-orange-600"
    if (level >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const selectedPointData = congestionPoints.find((p) => p.location === selectedPoint)
  const xLabels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const yLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Congestion Analysis
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {congestionPoints.map((point) => (
            <button
              key={point.location}
              onClick={() => setSelectedPoint(point.location)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                selectedPoint === point.location
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  point.severity === "critical"
                    ? "bg-red-500"
                    : point.severity === "high"
                      ? "bg-orange-500"
                      : point.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                }`}
              />
              {point.location}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedPointData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{selectedPointData.location}</div>
                <div className="text-xs text-muted-foreground">{selectedPointData.affectedTrains} trains affected</div>
              </div>
              <Badge variant={getSeverityColor(selectedPointData.severity)}>
                {selectedPointData.severity.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/20 rounded-lg">
                <div className={`text-sm font-bold ${getCongestionColor(selectedPointData.congestionLevel)}`}>
                  {selectedPointData.congestionLevel}%
                </div>
                <div className="text-xs text-muted-foreground">Congestion</div>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg">
                <div className="text-sm font-bold text-red-600">{selectedPointData.averageDelay}min</div>
                <div className="text-xs text-muted-foreground">Avg Delay</div>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg">
                <div className="text-sm font-bold text-foreground">{selectedPointData.affectedTrains}</div>
                <div className="text-xs text-muted-foreground">Trains</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Congestion Level</span>
                <span className="text-sm text-muted-foreground">{selectedPointData.congestionLevel}%</span>
              </div>
              <Progress value={selectedPointData.congestionLevel} className="h-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Peak Hours</div>
                <div className="text-xs text-muted-foreground">{selectedPointData.peakHours}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Main Causes</div>
                <div className="space-y-1">
                  {selectedPointData.causes.slice(0, 2).map((cause, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-muted-foreground">{cause}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-20">
              <div className="text-sm font-medium mb-2">Weekly Congestion Pattern</div>
              <div className="text-xs">
                <HeatMapGrid
                  data={heatmapData}
                  xLabels={xLabels.filter((_, i) => i % 4 === 0)}
                  yLabels={yLabels}
                  cellRender={(x, y, value) => (
                    <div
                      style={{
                        backgroundColor: `rgba(239, 68, 68, ${value / 100})`,
                        width: "100%",
                        height: "100%",
                        fontSize: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value > 50 ? "white" : "black",
                      }}
                    >
                      {value}
                    </div>
                  )}
                  cellStyle={(x, y, ratio) => ({
                    background: `rgba(239, 68, 68, ${ratio})`,
                    fontSize: "8px",
                    color: ratio > 0.5 ? "white" : "black",
                  })}
                  cellHeight="12px"
                  xLabelsStyle={() => ({
                    fontSize: "8px",
                  })}
                  yLabelsStyle={() => ({
                    fontSize: "8px",
                  })}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select a location to view congestion details</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
