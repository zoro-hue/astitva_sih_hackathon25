"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Route, Brain, TrendingUp, MapPin, ArrowRight } from "lucide-react"

interface RouteNode {
  id: string
  name: string
  x: number
  y: number
  type: "station" | "junction"
}

interface RouteEdge {
  from: string
  to: string
  distance: number
  currentTime: number
  optimizedTime: number
  congestion: number
}

interface OptimizationResult {
  route: string
  algorithm: string
  currentPath: string[]
  optimizedPath: string[]
  timeSaved: number
  distanceSaved: number
  efficiency: number
}

export function AIRouteOptimization() {
  const [selectedRoute, setSelectedRoute] = useState("RT-001")
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Iran Railway Network Graph
  const networkNodes: RouteNode[] = [
    { id: "TEH", name: "Tehran Central", x: 50, y: 20, type: "junction" },
    { id: "QOM", name: "Qom", x: 45, y: 35, type: "station" },
    { id: "KAS", name: "Kashan", x: 48, y: 50, type: "station" },
    { id: "ISF", name: "Isfahan Central", x: 45, y: 65, type: "junction" },
    { id: "SEM", name: "Semnan", x: 70, y: 25, type: "station" },
    { id: "SHA", name: "Shahroud", x: 85, y: 30, type: "junction" },
    { id: "MAS", name: "Mashhad", x: 95, y: 35, type: "junction" },
    { id: "ZAN", name: "Zanjan", x: 30, y: 15, type: "station" },
    { id: "TAB", name: "Tabriz", x: 15, y: 10, type: "junction" },
  ]

  const networkEdges: RouteEdge[] = [
    { from: "TEH", to: "QOM", distance: 156, currentTime: 120, optimizedTime: 95, congestion: 0.7 },
    { from: "QOM", to: "KAS", distance: 108, currentTime: 85, optimizedTime: 70, congestion: 0.5 },
    { from: "KAS", to: "ISF", distance: 156, currentTime: 125, optimizedTime: 105, congestion: 0.6 },
    { from: "TEH", to: "SEM", distance: 216, currentTime: 180, optimizedTime: 150, congestion: 0.4 },
    { from: "SEM", to: "SHA", distance: 168, currentTime: 140, optimizedTime: 115, congestion: 0.3 },
    { from: "SHA", to: "MAS", distance: 331, currentTime: 280, optimizedTime: 240, congestion: 0.5 },
    { from: "TEH", to: "ZAN", distance: 298, currentTime: 250, optimizedTime: 210, congestion: 0.8 },
    { from: "ZAN", to: "TAB", distance: 184, currentTime: 155, optimizedTime: 130, congestion: 0.9 },
  ]

  // Dijkstra's Algorithm Implementation
  const dijkstraOptimization = (start: string, end: string, useOptimized = false) => {
    const distances: { [key: string]: number } = {}
    const previous: { [key: string]: string | null } = {}
    const unvisited = new Set(networkNodes.map((n) => n.id))

    // Initialize distances
    networkNodes.forEach((node) => {
      distances[node.id] = node.id === start ? 0 : Number.POSITIVE_INFINITY
      previous[node.id] = null
    })

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      const current = Array.from(unvisited).reduce((min, node) => (distances[node] < distances[min] ? node : min))

      if (distances[current] === Number.POSITIVE_INFINITY) break
      unvisited.delete(current)

      // Update distances to neighbors
      networkEdges
        .filter((edge) => edge.from === current || edge.to === current)
        .forEach((edge) => {
          const neighbor = edge.from === current ? edge.to : edge.from
          if (unvisited.has(neighbor)) {
            const weight = useOptimized ? edge.optimizedTime : edge.currentTime
            const newDistance = distances[current] + weight
            if (newDistance < distances[neighbor]) {
              distances[neighbor] = newDistance
              previous[neighbor] = current
            }
          }
        })
    }

    // Reconstruct path
    const path: string[] = []
    let current = end
    while (current !== null) {
      path.unshift(current)
      current = previous[current]
    }

    return { path, totalTime: distances[end] }
  }

  const runOptimization = () => {
    setIsOptimizing(true)

    setTimeout(() => {
      const routes = [
        { start: "TEH", end: "ISF", name: "Tehran-Isfahan Corridor" },
        { start: "TEH", end: "MAS", name: "Tehran-Mashhad Main Line" },
        { start: "TEH", end: "TAB", name: "Tehran-Tabriz Route" },
      ]

      const results = routes.map((route) => {
        const current = dijkstraOptimization(route.start, route.end, false)
        const optimized = dijkstraOptimization(route.start, route.end, true)

        return {
          route: route.name,
          algorithm: "Dijkstra's Shortest Path",
          currentPath: current.path,
          optimizedPath: optimized.path,
          timeSaved: current.totalTime - optimized.totalTime,
          distanceSaved: Math.round(((current.totalTime - optimized.totalTime) / current.totalTime) * 100),
          efficiency: Math.round((optimized.totalTime / current.totalTime) * 100),
        }
      })

      setOptimizationResults(results)
      setIsOptimizing(false)
    }, 2000)
  }

  // Performance comparison data
  const performanceData = [
    { time: "00:00", current: 78, optimized: 85, traffic: 65 },
    { time: "04:00", current: 82, optimized: 89, traffic: 70 },
    { time: "08:00", current: 65, optimized: 78, traffic: 45 },
    { time: "12:00", current: 58, optimized: 72, traffic: 35 },
    { time: "16:00", current: 62, optimized: 75, traffic: 40 },
    { time: "20:00", current: 75, optimized: 83, traffic: 60 },
  ]

  useEffect(() => {
    runOptimization()
  }, [])

  return (
    <div className="space-y-6">
      {/* AI Optimization Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Route Optimization - Iran Railway Network
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced algorithms for optimal path finding and traffic management
              </p>
            </div>
            <Button onClick={runOptimization} disabled={isOptimizing}>
              {isOptimizing ? "Optimizing..." : "Run Optimization"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Railway Network Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
              {/* Network connections */}
              <svg className="absolute inset-0 w-full h-full">
                {networkEdges.map((edge, index) => {
                  const fromNode = networkNodes.find((n) => n.id === edge.from)
                  const toNode = networkNodes.find((n) => n.id === edge.to)
                  if (!fromNode || !toNode) return null

                  const congestionColor =
                    edge.congestion > 0.7 ? "#ef4444" : edge.congestion > 0.4 ? "#f59e0b" : "#10b981"

                  return (
                    <line
                      key={index}
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      stroke={congestionColor}
                      strokeWidth="3"
                      opacity="0.7"
                    />
                  )
                })}
              </svg>

              {/* Network nodes */}
              {networkNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      node.type === "junction" ? "bg-purple-600" : "bg-blue-600"
                    }`}
                  />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                    <div className="text-xs font-medium text-center whitespace-nowrap bg-white px-1 rounded shadow">
                      {node.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Low Traffic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Medium Traffic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>High Traffic</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="Current Efficiency"
                  />
                  <Area
                    type="monotone"
                    dataKey="optimized"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="AI Optimized"
                  />
                  <Line type="monotone" dataKey="traffic" stroke="#f59e0b" strokeWidth={2} name="Traffic Load" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            AI Optimization Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {optimizationResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{result.route}</h4>
                    <p className="text-sm text-muted-foreground">Algorithm: {result.algorithm}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {result.distanceSaved}% improvement
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{result.timeSaved}min</div>
                    <div className="text-xs text-muted-foreground">Time Saved</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{result.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{result.distanceSaved}%</div>
                    <div className="text-xs text-muted-foreground">Improvement</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Current Path:</span>
                    <div className="flex items-center gap-1">
                      {result.currentPath.map((station, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">{station}</span>
                          {i < result.currentPath.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Optimized Path:</span>
                    <div className="flex items-center gap-1">
                      {result.optimizedPath.map((station, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{station}</span>
                          {i < result.optimizedPath.length - 1 && <ArrowRight className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
