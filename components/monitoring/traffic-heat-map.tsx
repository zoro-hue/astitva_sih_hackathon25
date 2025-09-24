"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface TrafficData {
  route: string
  congestion: number
  trend: "up" | "down" | "stable"
  trains: number
}

export function TrafficHeatMap() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])

  useEffect(() => {
    // Mock traffic data
    const generateTrafficData = () => {
      const routes = iranRailwayData.routes.map((r) => r.name)

      return routes.map((route) => ({
        route,
        congestion: Math.random() * 100,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
        trains: Math.floor(Math.random() * 20) + 5,
      }))
    }

    setTrafficData(generateTrafficData())
    const interval = setInterval(() => {
      setTrafficData(generateTrafficData())
    }, 120000) // Update every 2 minutes

    return () => clearInterval(interval)
  }, [])

  const getCongestionColor = (congestion: number) => {
    if (congestion >= 80) return "bg-red-500"
    if (congestion >= 60) return "bg-orange-500"
    if (congestion >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getCongestionLevel = (congestion: number) => {
    if (congestion >= 80) return "High"
    if (congestion >= 60) return "Medium"
    if (congestion >= 40) return "Low"
    return "Clear"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-red-500" />
      case "down":
        return <TrendingDown className="w-3 h-3 text-green-500" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />
    }
  }

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Traffic Heat Map - Iran Railway
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-56 overflow-y-auto">
        {trafficData.map((data, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-3 h-3 rounded-full ${getCongestionColor(data.congestion)}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{data.route}</div>
                <div className="text-xs text-muted-foreground">{data.trains} active trains</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getCongestionLevel(data.congestion)}
              </Badge>
              {getTrendIcon(data.trend)}
              <div className="text-xs font-medium w-8 text-right">{data.congestion.toFixed(0)}%</div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Clear</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>High</span>
              </div>
            </div>
            <div className="text-muted-foreground">Congestion Level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
