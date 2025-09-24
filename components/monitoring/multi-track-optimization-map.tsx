"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Activity, BarChart3, Route } from "lucide-react"

interface TrackSegment {
  id: string
  name: string
  trackNumber: number
  trackType: string
  maxThroughput: number
  currentUtilization: number
  status: "operational" | "maintenance" | "congested" | "blocked"
  bottleneckFactor: number
}

interface PathNode {
  id: string
  name: string
  x: number
  y: number
  type: "station" | "junction" | "terminal"
  status: "operational" | "maintenance" | "disrupted"
  tracks: TrackSegment[]
}

interface MultiPathOption {
  id: string
  name: string
  origin: string
  destination: string
  trackSequence: string[]
  totalDistance: number
  estimatedTime: number
  maxThroughput: number
  currentCongestion: number
  reliabilityScore: number
  isOptimized: boolean
  timeSavings: number
  efficiencyGain: number
  throughputIncrease: number
}

export function MultiTrackOptimizationMap() {
  const [selectedRoute, setSelectedRoute] = useState<string>("route-1")
  const [pathOptions, setPathOptions] = useState<MultiPathOption[]>([])
  const [selectedPath, setSelectedPath] = useState<string>("path-1")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [viewMode, setViewMode] = useState<"paths" | "throughput" | "optimization">("paths")

  // Enhanced network nodes with multiple track information
  const networkNodes: PathNode[] = [
    {
      id: "TEH",
      name: "Tehran Central",
      x: 50,
      y: 25,
      type: "terminal",
      status: "operational",
      tracks: [
        {
          id: "TEH-QOM-1",
          name: "Main Track 1",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 16,
          currentUtilization: 75.5,
          status: "operational",
          bottleneckFactor: 1.0,
        },
        {
          id: "TEH-QOM-2",
          name: "Main Track 2",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 16,
          currentUtilization: 68.2,
          status: "operational",
          bottleneckFactor: 1.0,
        },
        {
          id: "TEH-QOM-3",
          name: "Freight Track",
          trackNumber: 3,
          trackType: "freight",
          maxThroughput: 8,
          currentUtilization: 45.0,
          status: "operational",
          bottleneckFactor: 1.1,
        },
      ],
    },
    {
      id: "QOM",
      name: "Qom",
      x: 45,
      y: 40,
      type: "station",
      status: "operational",
      tracks: [
        {
          id: "QOM-KAS-1",
          name: "Main Track 1",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 14,
          currentUtilization: 82.1,
          status: "congested",
          bottleneckFactor: 1.3,
        },
        {
          id: "QOM-KAS-2",
          name: "Main Track 2",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 14,
          currentUtilization: 71.8,
          status: "operational",
          bottleneckFactor: 1.1,
        },
      ],
    },
    {
      id: "KAS",
      name: "Kashan",
      x: 48,
      y: 55,
      type: "station",
      status: "operational",
      tracks: [
        {
          id: "KAS-ISF-1",
          name: "Express Track",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 18,
          currentUtilization: 91.3,
          status: "congested",
          bottleneckFactor: 1.5,
        },
        {
          id: "KAS-ISF-2",
          name: "Main Track",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 16,
          currentUtilization: 78.5,
          status: "operational",
          bottleneckFactor: 1.2,
        },
        {
          id: "KAS-ISF-3",
          name: "Local Track",
          trackNumber: 3,
          trackType: "local",
          maxThroughput: 12,
          currentUtilization: 55.2,
          status: "operational",
          bottleneckFactor: 1.0,
        },
      ],
    },
    {
      id: "ISF",
      name: "Isfahan",
      x: 45,
      y: 70,
      type: "terminal",
      status: "operational",
      tracks: [],
    },
    {
      id: "SEM",
      name: "Semnan",
      x: 70,
      y: 30,
      type: "station",
      status: "maintenance",
      tracks: [
        {
          id: "SEM-SHA-1",
          name: "Main Track",
          trackNumber: 1,
          trackType: "standard",
          maxThroughput: 8,
          currentUtilization: 95.8,
          status: "blocked",
          bottleneckFactor: 2.1,
        },
      ],
    },
    {
      id: "SHA",
      name: "Shahroud",
      x: 85,
      y: 35,
      type: "junction",
      status: "maintenance",
      tracks: [
        {
          id: "SHA-MAS-1",
          name: "Main Track 1",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 12,
          currentUtilization: 87.4,
          status: "operational",
          bottleneckFactor: 1.4,
        },
        {
          id: "SHA-MAS-2",
          name: "Main Track 2",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 12,
          currentUtilization: 79.1,
          status: "operational",
          bottleneckFactor: 1.2,
        },
      ],
    },
    {
      id: "MAS",
      name: "Mashhad",
      x: 95,
      y: 40,
      type: "terminal",
      status: "operational",
      tracks: [],
    },
  ]

  useEffect(() => {
    // Mock multi-path options data
    const mockPathOptions: MultiPathOption[] = [
      {
        id: "path-1",
        name: "Tehran-Isfahan Express Path",
        origin: "TEH",
        destination: "ISF",
        trackSequence: ["TEH-QOM-1", "QOM-KAS-1", "KAS-ISF-1"],
        totalDistance: 344.5,
        estimatedTime: 185,
        maxThroughput: 14,
        currentCongestion: 3.2,
        reliabilityScore: 9.1,
        isOptimized: true,
        timeSavings: 25,
        efficiencyGain: 18.5,
        throughputIncrease: 22.3,
      },
      {
        id: "path-2",
        name: "Tehran-Isfahan Standard Path",
        origin: "TEH",
        destination: "ISF",
        trackSequence: ["TEH-QOM-2", "QOM-KAS-2", "KAS-ISF-2"],
        totalDistance: 344.5,
        estimatedTime: 205,
        maxThroughput: 14,
        currentCongestion: 4.1,
        reliabilityScore: 8.7,
        isOptimized: false,
        timeSavings: 0,
        efficiencyGain: 0,
        throughputIncrease: 0,
      },
      {
        id: "path-3",
        name: "Tehran-Isfahan Mixed Path",
        origin: "TEH",
        destination: "ISF",
        trackSequence: ["TEH-QOM-1", "QOM-KAS-2", "KAS-ISF-3"],
        totalDistance: 346.3,
        estimatedTime: 225,
        maxThroughput: 12,
        currentCongestion: 2.8,
        reliabilityScore: 8.9,
        isOptimized: false,
        timeSavings: -15,
        efficiencyGain: -8.2,
        throughputIncrease: -14.3,
      },
      {
        id: "path-4",
        name: "Tehran-Mashhad Direct Path",
        origin: "TEH",
        destination: "MAS",
        trackSequence: ["TEH-SEM-1", "SEM-SHA-1", "SHA-MAS-1"],
        totalDistance: 782.4,
        estimatedTime: 420,
        maxThroughput: 8,
        currentCongestion: 8.5,
        reliabilityScore: 6.2,
        isOptimized: false,
        timeSavings: 0,
        efficiencyGain: 0,
        throughputIncrease: 0,
      },
      {
        id: "path-5",
        name: "Tehran-Mashhad Alternative Path",
        origin: "TEH",
        destination: "MAS",
        trackSequence: ["TEH-QOM-1", "QOM-KAS-1", "KAS-ISF-1"],
        totalDistance: 890.3,
        estimatedTime: 380,
        maxThroughput: 12,
        currentCongestion: 4.1,
        reliabilityScore: 8.8,
        isOptimized: true,
        timeSavings: 40,
        efficiencyGain: 28.3,
        throughputIncrease: 35.7,
      },
    ]

    setPathOptions(mockPathOptions)
  }, [])

  const currentPathOptions = pathOptions.filter((path) =>
    selectedRoute === "route-1" ? path.destination === "ISF" : path.destination === "MAS",
  )
  const currentPath = currentPathOptions.find((path) => path.id === selectedPath)

  const getTrackStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500"
      case "congested":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-orange-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const renderMultipleTracks = (fromNode: PathNode, toNode: PathNode) => {
    const tracks = fromNode.tracks.filter((track) => track.name.includes(toNode.id) || track.id.includes(toNode.id))

    return tracks.map((track, index) => {
      const offset = (index - tracks.length / 2) * 3
      const isSelected = currentPath?.trackSequence.includes(track.id)

      return (
        <line
          key={track.id}
          x1={`${fromNode.x}%`}
          y1={`${fromNode.y + offset}%`}
          x2={`${toNode.x}%`}
          y2={`${toNode.y + offset}%`}
          stroke={
            isSelected
              ? "#10b981"
              : track.status === "blocked"
                ? "#ef4444"
                : track.status === "congested"
                  ? "#f59e0b"
                  : "#6b7280"
          }
          strokeWidth={isSelected ? 4 : track.status === "blocked" ? 3 : 2}
          strokeDasharray={track.status === "maintenance" ? "5,5" : "none"}
          opacity={isSelected ? 1 : 0.6}
        />
      )
    })
  }

  const runOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      // Update path options with new optimization results
      setPathOptions((prev) =>
        prev.map((path) => ({
          ...path,
          efficiencyGain: path.isOptimized
            ? Math.min(35, path.efficiencyGain + Math.random() * 5)
            : path.efficiencyGain,
          throughputIncrease: path.isOptimized
            ? Math.min(40, path.throughputIncrease + Math.random() * 3)
            : path.throughputIncrease,
        })),
      )
    }, 3000)
  }

  return (
    <Card className="h-[700px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600" />
              Multi-Track Optimization Map
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Advanced multi-track routing with throughput optimization and capacity analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="route-1">Tehran-Isfahan Corridor</SelectItem>
                <SelectItem value="route-2">Tehran-Mashhad Corridor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={runOptimization} disabled={isOptimizing} size="sm">
              {isOptimizing ? "Optimizing..." : "Optimize All"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paths">Path Options</TabsTrigger>
            <TabsTrigger value="throughput">Throughput Analysis</TabsTrigger>
            <TabsTrigger value="optimization">Optimization Results</TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="space-y-4">
            {/* Path Selection */}
            <div className="flex items-center gap-2">
              <Select value={selectedPath} onValueChange={setSelectedPath}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select path option" />
                </SelectTrigger>
                <SelectContent>
                  {currentPathOptions.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.name}{" "}
                      {path.isOptimized && (
                        <Badge variant="secondary" className="ml-2">
                          Optimized
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Path Metrics */}
            {currentPath && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentPath.maxThroughput}/hr</div>
                  <div className="text-xs text-muted-foreground">Max Throughput</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentPath.estimatedTime}min</div>
                  <div className="text-xs text-muted-foreground">Travel Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{currentPath.reliabilityScore.toFixed(1)}/10</div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${currentPath.currentCongestion > 5 ? "text-red-600" : currentPath.currentCongestion > 3 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {currentPath.currentCongestion.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Congestion Level</div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="throughput" className="space-y-4">
            {/* Throughput Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {networkNodes
                .filter((node) => node.tracks.length > 0)
                .map((node) => (
                  <Card key={node.id} className="p-4">
                    <h4 className="font-semibold mb-3">{node.name} - Track Capacity</h4>
                    <div className="space-y-2">
                      {node.tracks.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getTrackStatusColor(track.status)}`} />
                            <span className="text-sm font-medium">Track {track.trackNumber}</span>
                            <Badge variant="outline" className="text-xs">
                              {track.trackType}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${getUtilizationColor(track.currentUtilization)}`}>
                              {track.currentUtilization.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.floor((track.maxThroughput * track.currentUtilization) / 100)}/{track.maxThroughput}
                              /hr
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            {/* Optimization Results */}
            <div className="grid grid-cols-1 gap-4">
              {currentPathOptions
                .filter((path) => path.isOptimized)
                .map((path) => (
                  <Card key={path.id} className="p-4 border-green-200 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-green-800">{path.name}</h4>
                      <Badge className="bg-green-600">Optimized</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">+{path.timeSavings}min</div>
                        <div className="text-xs text-muted-foreground">Time Saved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">+{path.efficiencyGain.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency Gain</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">+{path.throughputIncrease.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Throughput Increase</div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Network Visualization */}
        <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
          <svg className="absolute inset-0 w-full h-full">
            {/* Render multiple tracks between stations */}
            {networkNodes.map((node) =>
              networkNodes
                .filter(
                  (targetNode) =>
                    targetNode.id !== node.id && node.tracks.some((track) => track.id.includes(targetNode.id)),
                )
                .map((targetNode) => renderMultipleTracks(node, targetNode)),
            )}
          </svg>

          {/* Network nodes */}
          {networkNodes.map((node) => (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div
                className={`w-5 h-5 ${getTrackStatusColor(node.status)} rounded-full border-2 border-white shadow-lg`}
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="text-xs font-medium text-center whitespace-nowrap bg-white px-2 py-1 rounded shadow">
                  {node.name}
                  {node.tracks.length > 0 && (
                    <div className="text-xs text-muted-foreground">{node.tracks.length} tracks</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="space-y-2 text-xs">
              <div className="font-semibold mb-2">Track Status</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-yellow-500"></div>
                <span>Congested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500"></div>
                <span>Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-orange-500 border-dashed border border-orange-500"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>

          {/* Track Count Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="text-xs font-semibold">Track Density</div>
            <div className="text-xs text-muted-foreground">Thicker lines = More tracks</div>
          </div>
        </div>

        {/* AI Optimization Recommendation */}
        {currentPath && currentPath.isOptimized && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Multi-Track Optimization Recommendation</h4>
                <p className="text-sm text-blue-800 mb-2">
                  This optimized path utilizes multiple track segments to maximize throughput and minimize congestion.
                  Expected improvements: {currentPath.timeSavings}min time savings,{" "}
                  {currentPath.efficiencyGain.toFixed(1)}% efficiency gain.
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-700">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {currentPath.maxThroughput} trains/hour capacity
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {currentPath.reliabilityScore.toFixed(1)}/10 reliability score
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
