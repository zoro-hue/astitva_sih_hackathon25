"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, AlertTriangle } from "lucide-react"

interface CapacityData {
  route: string
  currentCapacity: number
  maxCapacity: number
  utilization: number
  peakHours: string
  bottlenecks: string[]
  status: "optimal" | "high" | "critical"
}

interface HourlyCapacity {
  hour: string
  utilization: number
  capacity: number
}

export function CapacityManagement() {
  const [capacityData, setCapacityData] = useState<CapacityData[]>([])
  const [hourlyCapacity, setHourlyCapacity] = useState<HourlyCapacity[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string>("")

  useEffect(() => {
    // Mock capacity data
    const mockCapacityData: CapacityData[] = [
      {
        route: "Delhi-Mumbai",
        currentCapacity: 15600,
        maxCapacity: 18000,
        utilization: 86.7,
        peakHours: "07:00-10:00, 18:00-21:00",
        bottlenecks: ["Vadodara Junction", "Surat Station"],
        status: "high",
      },
      {
        route: "Chennai-Bangalore",
        currentCapacity: 8400,
        maxCapacity: 12000,
        utilization: 70.0,
        peakHours: "08:00-11:00, 17:00-20:00",
        bottlenecks: ["Katpadi Junction"],
        status: "optimal",
      },
      {
        route: "Delhi-Kolkata",
        currentCapacity: 12800,
        maxCapacity: 14000,
        utilization: 91.4,
        peakHours: "06:00-09:00, 19:00-22:00",
        bottlenecks: ["Kanpur Central", "Allahabad Junction", "Asansol"],
        status: "critical",
      },
    ]

    // Mock hourly capacity data
    const mockHourlyCapacity: HourlyCapacity[] = []
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00"
      let utilization = 40 + Math.random() * 20

      // Peak hours simulation
      if ((i >= 7 && i <= 10) || (i >= 18 && i <= 21)) {
        utilization = 80 + Math.random() * 15
      }

      mockHourlyCapacity.push({
        hour,
        utilization: Math.min(100, utilization),
        capacity: 18000,
      })
    }

    setCapacityData(mockCapacityData)
    setHourlyCapacity(mockHourlyCapacity)
    setSelectedRoute(mockCapacityData[0]?.route || "")
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "default"
      case "high":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 80) return "text-orange-600"
    if (utilization >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const selectedRouteData = capacityData.find((r) => r.route === selectedRoute)
  const averageUtilization = hourlyCapacity.reduce((sum, item) => sum + item.utilization, 0) / hourlyCapacity.length

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Capacity Management
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {capacityData.map((route) => (
            <button
              key={route.route}
              onClick={() => setSelectedRoute(route.route)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                selectedRoute === route.route
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  route.status === "critical"
                    ? "bg-red-500"
                    : route.status === "high"
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
              />
              {route.route}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedRouteData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{selectedRouteData.route}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedRouteData.currentCapacity.toLocaleString()} /{" "}
                  {selectedRouteData.maxCapacity.toLocaleString()} passengers
                </div>
              </div>
              <Badge variant={getStatusColor(selectedRouteData.status)}>{selectedRouteData.status.toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className={`text-lg font-bold ${getUtilizationColor(selectedRouteData.utilization)}`}>
                  {selectedRouteData.utilization}%
                </div>
                <div className="text-xs text-muted-foreground">Current Utilization</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{averageUtilization.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">24h Average</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Capacity Utilization</span>
                <span className="text-sm text-muted-foreground">{selectedRouteData.utilization}%</span>
              </div>
              <Progress value={selectedRouteData.utilization} className="h-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">Peak Hours</div>
                <div className="text-xs text-muted-foreground">{selectedRouteData.peakHours}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Bottlenecks</div>
                <div className="space-y-1">
                  {selectedRouteData.bottlenecks.slice(0, 2).map((bottleneck, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-muted-foreground">{bottleneck}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-16">
              <div className="text-sm font-medium mb-2">24-Hour Utilization Pattern</div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyCapacity.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" tick={{ fontSize: 8 }} />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="utilization" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select a route to view capacity details</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
