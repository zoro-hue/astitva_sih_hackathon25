"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, TrendingUp, Users, Clock } from "lucide-react"

interface TrafficMetrics {
  totalTrains: number
  onTimePerformance: number
  averageDelay: number
  capacityUtilization: number
  passengerLoad: number
  fuelEfficiency: number
}

interface HourlyTraffic {
  hour: string
  trains: number
  passengers: number
  capacity: number
}

export function TrafficOverview() {
  const [metrics, setMetrics] = useState<TrafficMetrics>({
    totalTrains: 0,
    onTimePerformance: 0,
    averageDelay: 0,
    capacityUtilization: 0,
    passengerLoad: 0,
    fuelEfficiency: 0,
  })

  const [hourlyData, setHourlyData] = useState<HourlyTraffic[]>([])

  useEffect(() => {
    // Mock traffic metrics
    setMetrics({
      totalTrains: 247,
      onTimePerformance: 87.3,
      averageDelay: 12.5,
      capacityUtilization: 78.2,
      passengerLoad: 82.1,
      fuelEfficiency: 4.2,
    })

    // Mock hourly traffic data
    const mockHourlyData: HourlyTraffic[] = []
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00"
      const baseTrains = 8 + Math.sin(((i - 6) * Math.PI) / 12) * 6
      const trains = Math.max(2, Math.round(baseTrains + Math.random() * 4))

      mockHourlyData.push({
        hour,
        trains,
        passengers: trains * (800 + Math.random() * 400),
        capacity: trains * 1200,
      })
    }
    setHourlyData(mockHourlyData)
  }, [])

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value >= threshold) return "text-green-600"
    if (value >= threshold * 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Traffic Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{metrics.totalTrains}</div>
            <div className="text-xs text-muted-foreground">Active Trains</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.onTimePerformance, 85)}`}>
              {metrics.onTimePerformance}%
            </div>
            <div className="text-xs text-muted-foreground">On-Time Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{metrics.averageDelay}min</div>
            <div className="text-xs text-muted-foreground">Avg Delay</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.capacityUtilization, 70)}`}>
              {metrics.capacityUtilization}%
            </div>
            <div className="text-xs text-muted-foreground">Capacity Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{metrics.passengerLoad}%</div>
            <div className="text-xs text-muted-foreground">Passenger Load</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{metrics.fuelEfficiency}</div>
            <div className="text-xs text-muted-foreground">km/L Efficiency</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">System Performance</span>
                <Badge variant={metrics.onTimePerformance >= 85 ? "default" : "secondary"}>
                  {metrics.onTimePerformance >= 85 ? "Excellent" : "Good"}
                </Badge>
              </div>
              <Progress value={metrics.onTimePerformance} className="h-2 mb-2" />

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Capacity Utilization</span>
                <span className="text-sm text-muted-foreground">{metrics.capacityUtilization}%</span>
              </div>
              <Progress value={metrics.capacityUtilization} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Peak Hour Efficiency</span>
                </div>
                <span className="font-medium">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Daily Passengers</span>
                </div>
                <span className="font-medium">1.2M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Avg Journey Time</span>
                </div>
                <span className="font-medium">3h 45m</span>
              </div>
            </div>
          </div>

          <div className="h-32">
            <div className="text-sm font-medium mb-2">24-Hour Traffic Pattern</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" tick={{ fontSize: 8 }} interval={3} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="trains"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Active Trains"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
