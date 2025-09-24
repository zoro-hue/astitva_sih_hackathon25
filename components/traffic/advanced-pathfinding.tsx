"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Route, Brain, Zap, Clock, DollarSign, TrendingUp, MapPin, ArrowRight, Settings } from "lucide-react"
import {
  DijkstraPathfinder,
  AStarPathfinder,
  MultiObjectivePathfinder,
  BidirectionalPathfinder,
  type GraphNode,
  type GraphEdge,
  type PathResult,
} from "@/lib/algorithms/pathfinding"

export function AdvancedPathfinding() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"dijkstra" | "astar" | "multi" | "bidirectional">(
    "dijkstra",
  )
  const [pathResults, setPathResults] = useState<PathResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState({ start: "TEH", end: "ISF" })
  const [optimizationCriteria, setOptimizationCriteria] = useState<"time" | "distance" | "cost" | "efficiency">("time")

  // Iran Railway Network Data
  const networkNodes: GraphNode[] = [
    {
      id: "TEH",
      name: "Tehran Central",
      coordinates: { x: 50, y: 20 },
      type: "junction",
      capacity: 1000,
      operationalStatus: "active",
    },
    {
      id: "QOM",
      name: "Qom",
      coordinates: { x: 45, y: 35 },
      type: "station",
      capacity: 400,
      operationalStatus: "active",
    },
    {
      id: "KAS",
      name: "Kashan",
      coordinates: { x: 48, y: 50 },
      type: "station",
      capacity: 300,
      operationalStatus: "active",
    },
    {
      id: "ISF",
      name: "Isfahan Central",
      coordinates: { x: 45, y: 65 },
      type: "junction",
      capacity: 800,
      operationalStatus: "active",
    },
    {
      id: "SEM",
      name: "Semnan",
      coordinates: { x: 70, y: 25 },
      type: "station",
      capacity: 250,
      operationalStatus: "active",
    },
    {
      id: "SHA",
      name: "Shahroud",
      coordinates: { x: 85, y: 30 },
      type: "junction",
      capacity: 350,
      operationalStatus: "active",
    },
    {
      id: "MAS",
      name: "Mashhad",
      coordinates: { x: 95, y: 35 },
      type: "junction",
      capacity: 900,
      operationalStatus: "active",
    },
    {
      id: "ZAN",
      name: "Zanjan",
      coordinates: { x: 30, y: 15 },
      type: "station",
      capacity: 200,
      operationalStatus: "active",
    },
    {
      id: "TAB",
      name: "Tabriz",
      coordinates: { x: 15, y: 10 },
      type: "junction",
      capacity: 600,
      operationalStatus: "active",
    },
    {
      id: "SHI",
      name: "Shiraz",
      coordinates: { x: 35, y: 85 },
      type: "junction",
      capacity: 700,
      operationalStatus: "active",
    },
  ]

  const networkEdges: GraphEdge[] = [
    {
      from: "TEH",
      to: "QOM",
      distance: 156,
      baseTime: 95,
      currentCongestion: 0.7,
      maxSpeed: 160,
      trackCondition: 0.9,
      cost: 1200,
    },
    {
      from: "QOM",
      to: "KAS",
      distance: 108,
      baseTime: 70,
      currentCongestion: 0.5,
      maxSpeed: 140,
      trackCondition: 0.8,
      cost: 850,
    },
    {
      from: "KAS",
      to: "ISF",
      distance: 156,
      baseTime: 105,
      currentCongestion: 0.6,
      maxSpeed: 150,
      trackCondition: 0.85,
      cost: 1100,
    },
    {
      from: "TEH",
      to: "SEM",
      distance: 216,
      baseTime: 150,
      currentCongestion: 0.4,
      maxSpeed: 180,
      trackCondition: 0.95,
      cost: 1500,
    },
    {
      from: "SEM",
      to: "SHA",
      distance: 168,
      baseTime: 115,
      currentCongestion: 0.3,
      maxSpeed: 160,
      trackCondition: 0.9,
      cost: 1200,
    },
    {
      from: "SHA",
      to: "MAS",
      distance: 331,
      baseTime: 240,
      currentCongestion: 0.5,
      maxSpeed: 200,
      trackCondition: 0.92,
      cost: 2200,
    },
    {
      from: "TEH",
      to: "ZAN",
      distance: 298,
      baseTime: 210,
      currentCongestion: 0.8,
      maxSpeed: 140,
      trackCondition: 0.75,
      cost: 1800,
    },
    {
      from: "ZAN",
      to: "TAB",
      distance: 184,
      baseTime: 130,
      currentCongestion: 0.9,
      maxSpeed: 120,
      trackCondition: 0.7,
      cost: 1400,
    },
    {
      from: "ISF",
      to: "SHI",
      distance: 476,
      baseTime: 320,
      currentCongestion: 0.4,
      maxSpeed: 180,
      trackCondition: 0.88,
      cost: 2800,
    },
    {
      from: "TEH",
      to: "ISF",
      distance: 420,
      baseTime: 280,
      currentCongestion: 0.6,
      maxSpeed: 160,
      trackCondition: 0.85,
      cost: 2500,
    },
  ]

  // Initialize pathfinding algorithms
  const dijkstraPathfinder = new DijkstraPathfinder(networkNodes, networkEdges)
  const aStarPathfinder = new AStarPathfinder(networkNodes, networkEdges)
  const multiObjectivePathfinder = new MultiObjectivePathfinder(networkNodes, networkEdges)
  const bidirectionalPathfinder = new BidirectionalPathfinder(networkNodes, networkEdges)

  const runPathfinding = async () => {
    setIsCalculating(true)

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let results: PathResult[] = []

    try {
      switch (selectedAlgorithm) {
        case "dijkstra":
          const dijkstraResult = dijkstraPathfinder.findOptimalPath(
            selectedRoute.start,
            selectedRoute.end,
            optimizationCriteria,
          )
          if (dijkstraResult) results = [dijkstraResult]
          break

        case "astar":
          const aStarResult = aStarPathfinder.findOptimalPath(
            selectedRoute.start,
            selectedRoute.end,
            optimizationCriteria,
          )
          if (aStarResult) results = [aStarResult]
          break

        case "multi":
          results = multiObjectivePathfinder.findOptimalPaths(selectedRoute.start, selectedRoute.end)
          break

        case "bidirectional":
          const bidirectionalResult = bidirectionalPathfinder.findOptimalPath(
            selectedRoute.start,
            selectedRoute.end,
            optimizationCriteria,
          )
          if (bidirectionalResult) results = [bidirectionalResult]
          break
      }

      setPathResults(results)
    } catch (error) {
      console.error("Pathfinding error:", error)
      setPathResults([])
    }

    setIsCalculating(false)
  }

  useEffect(() => {
    runPathfinding()
  }, [selectedAlgorithm, selectedRoute, optimizationCriteria])

  // Performance comparison data
  const algorithmPerformance = [
    { algorithm: "Dijkstra", time: 45, accuracy: 100, memory: 85 },
    { algorithm: "A*", time: 28, accuracy: 98, memory: 70 },
    { algorithm: "Multi-Objective", time: 120, accuracy: 95, memory: 95 },
    { algorithm: "Bidirectional", time: 32, accuracy: 99, memory: 75 },
  ]

  const getAlgorithmDescription = (algorithm: string) => {
    switch (algorithm) {
      case "dijkstra":
        return "Guaranteed shortest path with dynamic weight calculation based on real-time conditions"
      case "astar":
        return "Heuristic-guided search for faster pathfinding with near-optimal results"
      case "multi":
        return "Multi-objective optimization considering time, distance, cost, and efficiency simultaneously"
      case "bidirectional":
        return "Simultaneous forward and backward search for improved performance on large networks"
      default:
        return ""
    }
  }

  const routeOptions = [
    { start: "TEH", end: "ISF", name: "Tehran → Isfahan" },
    { start: "TEH", end: "MAS", name: "Tehran → Mashhad" },
    { start: "TEH", end: "TAB", name: "Tehran → Tabriz" },
    { start: "TEH", end: "SHI", name: "Tehran → Shiraz" },
    { start: "ISF", end: "SHI", name: "Isfahan → Shiraz" },
  ]

  return (
    <div className="space-y-6">
      {/* Algorithm Selection Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Advanced Pathfinding Algorithms
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 break-words">
                {getAlgorithmDescription(selectedAlgorithm)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button onClick={runPathfinding} disabled={isCalculating} className="flex items-center gap-2">
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Algorithm & Route Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dijkstra", name: "Dijkstra", icon: "🎯" },
                  { id: "astar", name: "A*", icon: "⚡" },
                  { id: "multi", name: "Multi-Obj", icon: "🎛️" },
                  { id: "bidirectional", name: "Bi-Search", icon: "↔️" },
                ].map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgorithm(algo.id as any)}
                    className={`p-2 rounded text-xs transition-colors ${
                      selectedAlgorithm === algo.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <div className="text-lg mb-1">{algo.icon}</div>
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Route</label>
              <div className="space-y-1">
                {routeOptions.map((route) => (
                  <button
                    key={`${route.start}-${route.end}`}
                    onClick={() => setSelectedRoute({ start: route.start, end: route.end })}
                    className={`w-full p-2 rounded text-xs text-left transition-colors ${
                      selectedRoute.start === route.start && selectedRoute.end === route.end
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {route.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Optimization</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "time", name: "Time", icon: <Clock className="w-3 h-3" /> },
                  { id: "distance", name: "Distance", icon: <MapPin className="w-3 h-3" /> },
                  { id: "cost", name: "Cost", icon: <DollarSign className="w-3 h-3" /> },
                  { id: "efficiency", name: "Efficiency", icon: <TrendingUp className="w-3 h-3" /> },
                ].map((criteria) => (
                  <button
                    key={criteria.id}
                    onClick={() => setOptimizationCriteria(criteria.id as any)}
                    className={`flex items-center gap-1 p-2 rounded text-xs transition-colors ${
                      optimizationCriteria === criteria.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {criteria.icon}
                    {criteria.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Network Graph
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

                  const isInPath =
                    pathResults.length > 0 &&
                    pathResults[0].path.includes(edge.from) &&
                    pathResults[0].path.includes(edge.to) &&
                    Math.abs(pathResults[0].path.indexOf(edge.from) - pathResults[0].path.indexOf(edge.to)) === 1

                  const congestionColor = isInPath
                    ? "#10b981"
                    : edge.currentCongestion > 0.7
                      ? "#ef4444"
                      : edge.currentCongestion > 0.4
                        ? "#f59e0b"
                        : "#6b7280"

                  return (
                    <line
                      key={index}
                      x1={`${fromNode.coordinates.x}%`}
                      y1={`${fromNode.coordinates.y}%`}
                      x2={`${toNode.coordinates.x}%`}
                      y2={`${toNode.coordinates.y}%`}
                      stroke={congestionColor}
                      strokeWidth={isInPath ? "4" : "2"}
                      opacity={isInPath ? "1" : "0.6"}
                    />
                  )
                })}
              </svg>

              {/* Network nodes */}
              {networkNodes.map((node) => {
                const isInPath = pathResults.length > 0 && pathResults[0].path.includes(node.id)
                const isStartEnd = node.id === selectedRoute.start || node.id === selectedRoute.end

                return (
                  <div
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        isStartEnd
                          ? "bg-red-600"
                          : isInPath
                            ? "bg-green-600"
                            : node.type === "junction"
                              ? "bg-purple-600"
                              : "bg-blue-600"
                      }`}
                    />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <div className="text-xs font-medium text-center whitespace-nowrap bg-white px-1 rounded shadow">
                        {node.id}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={algorithmPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="algorithm" tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="time" fill="#ef4444" name="Execution Time (ms)" />
                  <Bar dataKey="accuracy" fill="#10b981" name="Accuracy %" />
                  <Bar dataKey="memory" fill="#3b82f6" name="Memory Usage %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel - Fixed visibility */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              AI-Powered Route Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Current Analysis</h4>
                  <p className="text-blue-800 leading-relaxed">
                    The selected route shows{" "}
                    {pathResults.length > 0 && pathResults[0].congestionFactor > 0.5
                      ? "high"
                      : pathResults.length > 0 && pathResults[0].congestionFactor > 0.3
                        ? "moderate"
                        : "low"}{" "}
                    congestion levels with {pathResults.length > 0 ? pathResults[0].efficiency : 85}% efficiency score.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Performance Metrics</h4>
                  <p className="text-blue-800 leading-relaxed">
                    Current algorithm: <strong>{selectedAlgorithm.toUpperCase()}</strong> with{" "}
                    {pathResults.length > 0 ? Math.round(pathResults[0].totalTime) : 0} minutes estimated time and{" "}
                    {pathResults.length > 0 ? Math.round(pathResults[0].totalDistance) : 0}km total distance.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Optimization Potential</h4>
                  <p className="text-blue-800 leading-relaxed">
                    {selectedAlgorithm === "multi"
                      ? "Multi-objective optimization considers all factors simultaneously for balanced results."
                      : selectedAlgorithm === "astar"
                        ? "A* algorithm provides near-optimal results with improved performance."
                        : "Current configuration offers optimal pathfinding for the selected criteria."}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                  <p className="text-blue-800 leading-relaxed">
                    {pathResults.length > 0 && pathResults[0].efficiency > 90
                      ? "Maintain current routing for optimal performance."
                      : "Consider switching to multi-objective optimization for better overall efficiency."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Path Results */}
      {pathResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Pathfinding Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pathResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">
                        Path {index + 1} - {selectedAlgorithm.toUpperCase()} Algorithm
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {networkNodes.find((n) => n.id === selectedRoute.start)?.name} →{" "}
                        {networkNodes.find((n) => n.id === selectedRoute.end)?.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Efficiency: {result.efficiency}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{Math.round(result.totalTime)}min</div>
                      <div className="text-xs text-muted-foreground">Total Time</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{Math.round(result.totalDistance)}km</div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{Math.round(result.totalCost)}</div>
                      <div className="text-xs text-muted-foreground">Cost Units</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {Math.round(result.congestionFactor * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Congestion</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Optimal Path:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {result.path.map((stationId, i) => {
                          const station = networkNodes.find((n) => n.id === stationId)
                          return (
                            <div key={i} className="flex items-center gap-1">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {station?.name || stationId}
                              </span>
                              {i < result.path.length - 1 && <ArrowRight className="w-3 h-3" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
