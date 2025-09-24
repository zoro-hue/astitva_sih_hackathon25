"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation, Zap, Clock, TrendingUp } from "lucide-react"

interface PathNode {
  id: string
  name: string
  x: number
  y: number
  type: "station" | "junction" | "terminal"
  status: "operational" | "maintenance" | "disrupted"
}

interface OptimizedPath {
  id: string
  name: string
  origin: string
  destination: string
  currentPath: string[]
  optimizedPath: string[]
  currentTime: number
  optimizedTime: number
  timeSaved: number
  efficiency: number
  congestionLevel: "low" | "medium" | "high"
  recommendation: string
}

export function OptimizationPathMap() {
  const [selectedRoute, setSelectedRoute] = useState<string>("route-1")
  const [optimizedPaths, setOptimizedPaths] = useState<OptimizedPath[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showOptimizedOnly, setShowOptimizedOnly] = useState(false)

  // Network nodes for Iran Railway
  const networkNodes: PathNode[] = [
    { id: "TEH", name: "Tehran Central", x: 50, y: 25, type: "terminal", status: "operational" },
    { id: "QOM", name: "Qom", x: 45, y: 40, type: "station", status: "operational" },
    { id: "KAS", name: "Kashan", x: 48, y: 55, type: "station", status: "operational" },
    { id: "ISF", name: "Isfahan", x: 45, y: 70, type: "terminal", status: "operational" },
    { id: "SEM", name: "Semnan", x: 70, y: 30, type: "station", status: "maintenance" },
    { id: "SHA", name: "Shahroud", x: 85, y: 35, type: "junction", status: "maintenance" },
    { id: "MAS", name: "Mashhad", x: 95, y: 40, type: "terminal", status: "operational" },
    { id: "ZAN", name: "Zanjan", x: 30, y: 20, type: "station", status: "disrupted" },
    { id: "TAB", name: "Tabriz", x: 15, y: 15, type: "terminal", status: "disrupted" },
    { id: "AHV", name: "Ahvaz", x: 25, y: 80, type: "terminal", status: "operational" },
    { id: "SHZ", name: "Shiraz", x: 35, y: 85, type: "terminal", status: "operational" },
  ]

  useEffect(() => {
    // Mock optimized path data
    const mockPaths: OptimizedPath[] = [
      {
        id: "route-1",
        name: "Tehran-Isfahan Express",
        origin: "TEH",
        destination: "ISF",
        currentPath: ["TEH", "ZAN", "QOM", "KAS", "ISF"],
        optimizedPath: ["TEH", "QOM", "KAS", "ISF"],
        currentTime: 285,
        optimizedTime: 220,
        timeSaved: 65,
        efficiency: 92,
        congestionLevel: "medium",
        recommendation: "Bypass Zanjan due to disruption, use direct Tehran-Qom route",
      },
      {
        id: "route-2",
        name: "Tehran-Mashhad Corridor",
        origin: "TEH",
        destination: "MAS",
        currentPath: ["TEH", "SEM", "SHA", "MAS"],
        optimizedPath: ["TEH", "QOM", "KAS", "ISF", "MAS"],
        currentTime: 420,
        optimizedTime: 380,
        timeSaved: 40,
        efficiency: 88,
        congestionLevel: "high",
        recommendation: "Alternative route via Isfahan due to maintenance on Semnan-Shahroud section",
      },
      {
        id: "route-3",
        name: "Tehran-Tabriz Route",
        origin: "TEH",
        destination: "TAB",
        currentPath: ["TEH", "ZAN", "TAB"],
        optimizedPath: ["TEH", "QOM", "ZAN", "TAB"],
        currentTime: 310,
        optimizedTime: 280,
        timeSaved: 30,
        efficiency: 85,
        congestionLevel: "high",
        recommendation: "Use Qom bypass to reduce congestion on direct Tehran-Zanjan route",
      },
    ]

    setOptimizedPaths(mockPaths)
  }, [])

  const selectedPath = optimizedPaths.find((path) => path.id === selectedRoute)

  const getPathColor = (pathType: "current" | "optimized") => {
    return pathType === "current" ? "#ef4444" : "#10b981"
  }

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "disrupted":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const renderPath = (path: string[], color: string, strokeWidth = 3) => {
    if (!path || path.length < 2) return null

    const pathElements = []
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = networkNodes.find((n) => n.id === path[i])
      const toNode = networkNodes.find((n) => n.id === path[i + 1])

      if (fromNode && toNode) {
        pathElements.push(
          <line
            key={`${path[i]}-${path[i + 1]}`}
            x1={`${fromNode.x}%`}
            y1={`${fromNode.y}%`}
            x2={`${toNode.x}%`}
            y2={`${toNode.y}%`}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={color === "#ef4444" ? "5,5" : "none"}
            opacity="0.8"
          />,
        )
      }
    }
    return pathElements
  }

  const runOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      // Trigger re-render with updated efficiency values
      setOptimizedPaths((prev) =>
        prev.map((path) => ({
          ...path,
          efficiency: Math.min(95, path.efficiency + Math.random() * 3),
        })),
      )
    }, 2000)
  }

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Optimization Path Map
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time optimized routing with AI-powered path recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {optimizedPaths.map((path) => (
                  <SelectItem key={path.id} value={path.id}>
                    {path.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={runOptimization} disabled={isOptimizing} size="sm">
              {isOptimizing ? "Optimizing..." : "Optimize"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Information Panel */}
        {selectedPath && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{selectedPath.timeSaved}min</div>
              <div className="text-xs text-muted-foreground">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedPath.efficiency}%</div>
              <div className="text-xs text-muted-foreground">Efficiency</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getCongestionColor(selectedPath.congestionLevel)}`}>
                {selectedPath.congestionLevel.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">Congestion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(((selectedPath.currentTime - selectedPath.optimizedTime) / selectedPath.currentTime) * 100)}
                %
              </div>
              <div className="text-xs text-muted-foreground">Improvement</div>
            </div>
          </div>
        )}

        {/* Network Visualization */}
        <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
          <svg className="absolute inset-0 w-full h-full">
            {/* Base network connections */}
            {!showOptimizedOnly &&
              networkNodes.map((node) =>
                node.id !== "AHV" && node.id !== "SHZ"
                  ? // Skip some connections for clarity
                    networkNodes
                      .filter((n) => n.id !== node.id)
                      .slice(0, 2)
                      .map((connectedNode) => (
                        <line
                          key={`base-${node.id}-${connectedNode.id}`}
                          x1={`${node.x}%`}
                          y1={`${node.y}%`}
                          x2={`${connectedNode.x}%`}
                          y2={`${connectedNode.y}%`}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          opacity="0.3"
                        />
                      ))
                  : null,
              )}

            {/* Current path (red dashed) */}
            {selectedPath && !showOptimizedOnly && renderPath(selectedPath.currentPath, "#ef4444", 4)}

            {/* Optimized path (green solid) */}
            {selectedPath && renderPath(selectedPath.optimizedPath, "#10b981", 5)}
          </svg>

          {/* Network nodes */}
          {networkNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-4 h-4 ${getNodeStatusColor(node.status)} rounded-full border-2 border-white shadow-lg`}
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="text-xs font-medium text-center whitespace-nowrap bg-white px-1 rounded shadow">
                  {node.name}
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500 border-dashed border border-red-500"></div>
                <span>Current Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span>Optimized Path</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Disrupted</span>
              </div>
            </div>
          </div>

          {/* Toggle button */}
          <div className="absolute top-4 right-4">
            <Button variant="outline" size="sm" onClick={() => setShowOptimizedOnly(!showOptimizedOnly)}>
              {showOptimizedOnly ? "Show All Paths" : "Optimized Only"}
            </Button>
          </div>
        </div>

        {/* AI Recommendation */}
        {selectedPath && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">AI Optimization Recommendation</h4>
                <p className="text-sm text-blue-800">{selectedPath.recommendation}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-blue-700">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedPath.optimizedTime} min total
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {selectedPath.efficiency}% efficiency
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
