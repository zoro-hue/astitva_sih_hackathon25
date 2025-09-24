"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface TrackThroughputData {
  trackId: string
  trackName: string
  stationPair: string
  currentThroughput: number
  maxCapacity: number
  utilizationPercent: number
  bottleneckFactor: number
  recommendedActions: string[]
  status: "optimal" | "congested" | "critical" | "maintenance"
  hourlyData: { hour: number; throughput: number }[]
}

export function TrackThroughputAnalyzer() {
  const [throughputData, setThroughputData] = useState<TrackThroughputData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<"24h" | "7d" | "30d">("24h")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Mock throughput data
    const mockData: TrackThroughputData[] = [
      {
        trackId: "TEH-QOM-1",
        trackName: "Tehran-Qom Express Track 1",
        stationPair: "Tehran Central → Qom",
        currentThroughput: 12,
        maxCapacity: 16,
        utilizationPercent: 75.5,
        bottleneckFactor: 1.0,
        recommendedActions: ["Maintain current schedule", "Monitor peak hours"],
        status: "optimal",
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          throughput: Math.floor(8 + Math.random() * 8 + Math.sin(i / 4) * 4),
        })),
      },
      {
        trackId: "QOM-KAS-1",
        trackName: "Qom-Kashan Main Track 1",
        stationPair: "Qom → Kashan",
        currentThroughput: 11,
        maxCapacity: 14,
        utilizationPercent: 82.1,
        bottleneckFactor: 1.3,
        recommendedActions: ["Consider track switching", "Implement dynamic scheduling"],
        status: "congested",
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          throughput: Math.floor(6 + Math.random() * 8 + Math.sin(i / 3) * 5),
        })),
      },
      {
        trackId: "KAS-ISF-1",
        trackName: "Kashan-Isfahan Express Track",
        stationPair: "Kashan → Isfahan",
        currentThroughput: 16,
        maxCapacity: 18,
        utilizationPercent: 91.3,
        bottleneckFactor: 1.5,
        recommendedActions: ["Urgent: Redistribute traffic", "Use alternative tracks", "Schedule maintenance window"],
        status: "critical",
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          throughput: Math.floor(12 + Math.random() * 6 + Math.sin(i / 2) * 3),
        })),
      },
      {
        trackId: "SEM-SHA-1",
        trackName: "Semnan-Shahroud Main Track",
        stationPair: "Semnan → Shahroud",
        currentThroughput: 0,
        maxCapacity: 8,
        utilizationPercent: 0,
        bottleneckFactor: 0,
        recommendedActions: ["Complete maintenance", "Inspect signal systems", "Update ETA"],
        status: "maintenance",
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          throughput: 0,
        })),
      },
    ]

    setThroughputData(mockData)
  }, [selectedTimeframe])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600 bg-green-50 border-green-200"
      case "congested":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "maintenance":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "congested":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "maintenance":
        return <BarChart3 className="h-4 w-4 text-gray-600" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const runThroughputAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      // Update data with new analysis
      setThroughputData((prev) =>
        prev.map((track) => ({
          ...track,
          bottleneckFactor:
            track.status === "critical" ? Math.max(1.0, track.bottleneckFactor - 0.2) : track.bottleneckFactor,
          recommendedActions:
            track.status === "critical"
              ? [...track.recommendedActions, "AI suggests alternative routing"]
              : track.recommendedActions,
        })),
      )
    }, 2500)
  }

  const totalCapacity = throughputData.reduce((sum, track) => sum + track.maxCapacity, 0)
  const totalCurrent = throughputData.reduce((sum, track) => sum + track.currentThroughput, 0)
  const overallUtilization = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Track Throughput Analyzer
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time analysis of track capacity utilization and bottleneck identification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Timeframe:</span>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
            <Button onClick={runThroughputAnalysis} disabled={isAnalyzing} size="sm">
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Network Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalCurrent}/{totalCapacity}
            </div>
            <div className="text-xs text-muted-foreground">Total Throughput (trains/hr)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{overallUtilization.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Network Utilization</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {throughputData.filter((t) => t.status === "critical" || t.status === "congested").length}
            </div>
            <div className="text-xs text-muted-foreground">Bottlenecks Detected</div>
          </div>
        </div>

        {/* Track Analysis Cards */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {throughputData.map((track) => (
            <Card key={track.trackId} className={`p-4 border ${getStatusColor(track.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(track.status)}
                  <div>
                    <h4 className="font-semibold text-sm">{track.trackName}</h4>
                    <p className="text-xs text-muted-foreground">{track.stationPair}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {track.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Throughput Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      Throughput: {track.currentThroughput}/{track.maxCapacity} trains/hr
                    </span>
                    <span className="font-medium">{track.utilizationPercent.toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={track.utilizationPercent}
                    className={`h-2 ${
                      track.utilizationPercent >= 90
                        ? "bg-red-100"
                        : track.utilizationPercent >= 70
                          ? "bg-yellow-100"
                          : "bg-green-100"
                    }`}
                  />
                </div>

                {/* Bottleneck Factor */}
                {track.bottleneckFactor > 1.0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-700">Bottleneck Factor: {track.bottleneckFactor.toFixed(1)}x</span>
                  </div>
                )}

                {/* Recommendations */}
                {track.recommendedActions.length > 0 && (
                  <div className="text-xs">
                    <div className="font-medium mb-1">Recommendations:</div>
                    <ul className="space-y-1">
                      {track.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-muted-foreground">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mini Throughput Chart */}
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">24h Throughput Pattern</div>
                  <div className="flex items-end gap-1 h-8">
                    {track.hourlyData.slice(0, 12).map((data, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t ${
                          data.throughput === 0
                            ? "bg-gray-300"
                            : data.throughput >= track.maxCapacity * 0.9
                              ? "bg-red-400"
                              : data.throughput >= track.maxCapacity * 0.7
                                ? "bg-yellow-400"
                                : "bg-green-400"
                        }`}
                        style={{
                          height: `${Math.max(2, (data.throughput / (track.maxCapacity || 1)) * 100)}%`,
                        }}
                        title={`Hour ${data.hour}: ${data.throughput} trains`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
