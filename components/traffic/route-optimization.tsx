"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Route, Clock, Zap } from "lucide-react"

interface RouteOptimization {
  id: string
  routeName: string
  currentEfficiency: number
  optimizedEfficiency: number
  timeSaving: number
  fuelSaving: number
  status: "analyzing" | "optimized" | "implementing" | "completed"
  recommendations: string[]
}

export function RouteOptimization() {
  const [routes, setRoutes] = useState<RouteOptimization[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string>("")

  useEffect(() => {
    // Mock route optimization data
    const mockRoutes: RouteOptimization[] = [
      {
        id: "1",
        routeName: "Delhi-Mumbai Express",
        currentEfficiency: 72,
        optimizedEfficiency: 89,
        timeSaving: 45,
        fuelSaving: 18,
        status: "optimized",
        recommendations: [
          "Reduce stops at intermediate stations during peak hours",
          "Implement dynamic speed control in sections 200-300km",
          "Optimize signal timing at major junctions",
        ],
      },
      {
        id: "2",
        routeName: "Chennai-Bangalore Route",
        currentEfficiency: 68,
        optimizedEfficiency: 84,
        timeSaving: 32,
        fuelSaving: 15,
        status: "implementing",
        recommendations: [
          "Adjust departure times to avoid congestion",
          "Use alternative route via Hosur during maintenance",
          "Coordinate with freight traffic scheduling",
        ],
      },
      {
        id: "3",
        routeName: "Delhi-Kolkata Corridor",
        currentEfficiency: 75,
        optimizedEfficiency: 91,
        timeSaving: 38,
        fuelSaving: 22,
        status: "analyzing",
        recommendations: [
          "Implement predictive maintenance scheduling",
          "Optimize train consist configuration",
          "Reduce dwell time at major stations",
        ],
      },
    ]

    setRoutes(mockRoutes)
    setSelectedRoute(mockRoutes[0]?.id || "")
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "implementing":
        return "secondary"
      case "optimized":
        return "outline"
      case "analyzing":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "implementing":
        return "Implementing"
      case "optimized":
        return "Ready to Implement"
      case "analyzing":
        return "Analyzing"
      default:
        return "Unknown"
    }
  }

  const selectedRouteData = routes.find((r) => r.id === selectedRoute)
  const improvementPercentage = selectedRouteData
    ? ((selectedRouteData.optimizedEfficiency - selectedRouteData.currentEfficiency) /
        selectedRouteData.currentEfficiency) *
      100
    : 0

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5" />
          Route Optimization
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedRoute === route.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {route.routeName}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedRouteData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{selectedRouteData.routeName}</div>
                <div className="text-xs text-muted-foreground">
                  Current Efficiency: {selectedRouteData.currentEfficiency}%
                </div>
              </div>
              <Badge variant={getStatusColor(selectedRouteData.status)}>
                {getStatusText(selectedRouteData.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-green-600">+{improvementPercentage.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Efficiency Gain</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{selectedRouteData.timeSaving}min</div>
                <div className="text-xs text-muted-foreground">Time Saved</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Optimization Progress</span>
                <span className="text-sm text-muted-foreground">{selectedRouteData.optimizedEfficiency}%</span>
              </div>
              <Progress value={selectedRouteData.optimizedEfficiency} className="h-2 mb-1" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Current: {selectedRouteData.currentEfficiency}%</span>
                <span>Target: {selectedRouteData.optimizedEfficiency}%</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Key Recommendations</div>
              <div className="space-y-1">
                {selectedRouteData.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>{selectedRouteData.timeSaving}min saved</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span>{selectedRouteData.fuelSaving}% fuel</span>
                </div>
              </div>
              {selectedRouteData.status === "optimized" && (
                <Button variant="default" size="sm" className="text-xs">
                  Implement
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Route className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select a route to view optimization details</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
