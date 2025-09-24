"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MapPin, Navigation, Train, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp } from "lucide-react"

interface TrackSegment {
  id: string
  name: string
  trackNumber: number
  status: "operational" | "congested" | "blocked" | "maintenance"
  utilization: number
  maxCapacity: number
  currentTrains: number
  coordinates: { start: [number, number]; end: [number, number] }
}

interface Station {
  id: string
  name: string
  realName: string
  coordinates: [number, number]
  tracks: TrackSegment[]
}

interface RouteOption {
  id: string
  name: string
  stations: string[]
  tracks: string[]
  distance: number
  estimatedTime: number
  status: "optimal" | "alternative" | "blocked"
  diversions: boolean
  timeSavings?: number
}

interface TrainMovement {
  id: string
  trackId: string
  position: number
  direction: "forward" | "backward"
  type: "passenger" | "freight"
  status: "moving" | "diverted" | "stopped"
}

export function InteractiveRoutePlanner() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  const [showLiveData, setShowLiveData] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [trainMovements, setTrainMovements] = useState<TrainMovement[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [originalRoute, setOriginalRoute] = useState<RouteOption | null>(null)
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOption | null>(null)

  // Real station data
  const stations: Station[] = [
    {
      id: "TEH",
      name: "Tehran Central",
      realName: "Tehran, Iran",
      coordinates: [400, 100],
      tracks: [
        {
          id: "TEH-QOM-1",
          name: "Tehran-Qom Track 1",
          trackNumber: 1,
          status: "blocked",
          utilization: 95,
          maxCapacity: 16,
          currentTrains: 2,
          coordinates: { start: [400, 100], end: [400, 250] },
        },
        {
          id: "TEH-QOM-2",
          name: "Tehran-Qom Track 2",
          trackNumber: 2,
          status: "operational",
          utilization: 65,
          maxCapacity: 16,
          currentTrains: 1,
          coordinates: { start: [420, 100], end: [420, 250] },
        },
      ],
    },
    {
      id: "QOM",
      name: "Qom Junction",
      realName: "Qom, Iran",
      coordinates: [400, 250],
      tracks: [
        {
          id: "QOM-ISF-1",
          name: "Qom-Isfahan Track 1",
          trackNumber: 1,
          status: "operational",
          utilization: 45,
          maxCapacity: 14,
          currentTrains: 1,
          coordinates: { start: [400, 250], end: [600, 400] },
        },
        {
          id: "QOM-ISF-2",
          name: "Qom-Isfahan Track 2",
          trackNumber: 2,
          status: "operational",
          utilization: 30,
          maxCapacity: 14,
          currentTrains: 0,
          coordinates: { start: [420, 250], end: [620, 400] },
        },
      ],
    },
    {
      id: "ISF",
      name: "Isfahan Terminal",
      realName: "Isfahan, Iran",
      coordinates: [600, 400],
      tracks: [],
    },
  ]

  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([
    {
      id: "route-1",
      name: "Direct Route (Track 1 - Blocked)",
      stations: ["TEH", "QOM", "ISF"],
      tracks: ["TEH-QOM-1", "QOM-ISF-1"],
      distance: 344,
      estimatedTime: 180,
      status: "blocked",
      diversions: false,
    },
    {
      id: "route-2",
      name: "Optimized Route (Track 2 - Clear)",
      stations: ["TEH", "QOM", "ISF"],
      tracks: ["TEH-QOM-2", "QOM-ISF-2"],
      distance: 348,
      estimatedTime: 165,
      status: "optimal",
      diversions: true,
      timeSavings: 15,
    },
  ])

  // Initialize train movements
  useEffect(() => {
    setTrainMovements([
      {
        id: "train-1",
        trackId: "TEH-QOM-1",
        position: 0.6,
        direction: "forward",
        type: "passenger",
        status: "stopped",
      },
      {
        id: "train-2",
        trackId: "TEH-QOM-2",
        position: 0.3,
        direction: "forward",
        type: "passenger",
        status: "moving",
      },
      {
        id: "train-3",
        trackId: "QOM-ISF-2",
        position: 0.7,
        direction: "forward",
        type: "passenger",
        status: "moving",
      },
    ])
  }, [])

  // Animate train movements
  useEffect(() => {
    if (!showLiveData) return

    const interval = setInterval(() => {
      setTrainMovements((prev) =>
        prev.map((train) => {
          if (train.status === "moving") {
            let newPosition = train.position + 0.02
            if (newPosition > 1) newPosition = 0
            return { ...train, position: newPosition }
          }
          return train
        }),
      )
    }, 500)

    return () => clearInterval(interval)
  }, [showLiveData])

  const calculateRoute = () => {
    if (!fromLocation || !toLocation) return

    setIsCalculating(true)

    // Generate different routes based on actual input
    setTimeout(() => {
      let newRoutes: RouteOption[] = []

      const normalizedFrom = fromLocation.toLowerCase().trim()
      const normalizedTo = toLocation.toLowerCase().trim()

      // Check if locations are valid
      const validLocations = [
        "tehran",
        "qom",
        "kashan",
        "isfahan",
        "tehran central",
        "qom junction",
        "isfahan terminal",
      ]
      const isFromValid = validLocations.some((loc) => normalizedFrom.includes(loc.split(" ")[0]))
      const isToValid = validLocations.some((loc) => normalizedTo.includes(loc.split(" ")[0]))

      if (!isFromValid || !isToValid) {
        // Show error for invalid locations
        newRoutes = [
          {
            id: "error-route",
            name: "Invalid Route - Location Not Found",
            stations: [],
            tracks: [],
            distance: 0,
            estimatedTime: 0,
            status: "blocked",
            diversions: false,
          },
        ]
        setShowComparison(false)
      } else if (normalizedFrom.includes("tehran") && normalizedTo.includes("isfahan")) {
        const blockedRoute = {
          id: "route-1",
          name: "Original Route (Track 1 - Blocked)",
          stations: ["TEH", "QOM", "ISF"],
          tracks: ["TEH-QOM-1", "QOM-ISF-1"],
          distance: 344,
          estimatedTime: 180,
          status: "blocked" as const,
          diversions: false,
        }

        const optimizedRouteData = {
          id: "route-2",
          name: "Optimized Route (Track 2 - Clear)",
          stations: ["TEH", "QOM", "ISF"],
          tracks: ["TEH-QOM-2", "QOM-ISF-2"],
          distance: 348,
          estimatedTime: 165,
          status: "optimal" as const,
          diversions: true,
          timeSavings: 15,
        }

        newRoutes = [blockedRoute, optimizedRouteData]

        setOriginalRoute(blockedRoute)
        setOptimizedRoute(optimizedRouteData)
        setShowComparison(true)
      } else if (normalizedFrom.includes("qom") && normalizedTo.includes("isfahan")) {
        newRoutes = [
          {
            id: "route-qom-isf-1",
            name: "Qom-Isfahan Direct Route",
            stations: ["QOM", "ISF"],
            tracks: ["QOM-ISF-1"],
            distance: 200,
            estimatedTime: 95,
            status: "optimal",
            diversions: false,
          },
          {
            id: "route-qom-isf-2",
            name: "Qom-Isfahan Alternative",
            stations: ["QOM", "ISF"],
            tracks: ["QOM-ISF-2"],
            distance: 205,
            estimatedTime: 105,
            status: "alternative",
            diversions: false,
          },
        ]
        setShowComparison(false)
      } else {
        // Default routes for other combinations
        newRoutes = [
          {
            id: "route-default",
            name: `${normalizedFrom} to ${normalizedTo} Route`,
            stations: ["TEH", "QOM", "ISF"],
            tracks: ["TEH-QOM-2", "QOM-ISF-2"],
            distance: Math.floor(Math.random() * 200) + 150,
            estimatedTime: Math.floor(Math.random() * 60) + 90,
            status: "alternative",
            diversions: false,
          },
        ]
        setShowComparison(false)
      }

      setRouteOptions(newRoutes)
      setIsCalculating(false)
      setSelectedRoute(newRoutes[0].id)
    }, 2000)
  }

  const getTrackColor = (status: string) => {
    switch (status) {
      case "operational":
        return "#10b981"
      case "congested":
        return "#f59e0b"
      case "blocked":
        return "#ef4444"
      case "maintenance":
        return "#f97316"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800 border-green-200"
      case "alternative":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderTrack = (track: TrackSegment, isSelected: boolean) => {
    const { start, end } = track.coordinates
    const isBlocked = track.status === "blocked"
    const isCongested = track.status === "congested"

    return (
      <g key={track.id}>
        {/* Track bed */}
        <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#8b7355" strokeWidth="16" opacity="0.6" />

        {/* Main track */}
        <line
          x1={start[0]}
          y1={start[1]}
          x2={end[0]}
          y2={end[1]}
          stroke={getTrackColor(track.status)}
          strokeWidth="8"
          strokeDasharray={isBlocked ? "10,5" : "none"}
          opacity={isSelected ? 1 : 0.8}
        />

        {/* Track rails */}
        <line x1={start[0] - 3} y1={start[1]} x2={end[0] - 3} y2={end[1]} stroke="#4a5568" strokeWidth="2" />
        <line x1={start[0] + 3} y1={start[1]} x2={end[0] + 3} y2={end[1]} stroke="#4a5568" strokeWidth="2" />

        {/* Track ties */}
        {Array.from({ length: 8 }).map((_, i) => {
          const progress = (i + 1) / 9
          const x = start[0] + (end[0] - start[0]) * progress
          const y = start[1] + (end[1] - start[1]) * progress
          return <rect key={i} x={x - 8} y={y - 2} width="16" height="4" fill="#8b7355" opacity="0.8" />
        })}

        {/* Blocked indicator */}
        {isBlocked && (
          <g>
            <rect
              x={start[0] + (end[0] - start[0]) * 0.5 - 30}
              y={start[1] + (end[1] - start[1]) * 0.5 - 20}
              width="60"
              height="20"
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#ef4444"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={start[0] + (end[0] - start[0]) * 0.5}
              y={start[1] + (end[1] - start[1]) * 0.5 - 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#ef4444"
            >
              BLOCKED
            </text>
          </g>
        )}

        {/* Track number label */}
        <g>
          <rect
            x={start[0] + (end[0] - start[0]) * 0.1 - 20}
            y={start[1] + (end[1] - start[1]) * 0.1 - 25}
            width="40"
            height="16"
            fill="rgba(255, 255, 255, 0.9)"
            stroke="#374151"
            strokeWidth="1"
            rx="3"
          />
          <text
            x={start[0] + (end[0] - start[0]) * 0.1}
            y={start[1] + (end[1] - start[1]) * 0.1 - 12}
            textAnchor="middle"
            fontSize="10"
            fill="#374151"
            fontWeight="bold"
          >
            Track {track.trackNumber}
          </text>
        </g>
      </g>
    )
  }

  const renderStation = (station: Station) => {
    const [x, y] = station.coordinates

    return (
      <g key={station.id}>
        {/* Station platform */}
        <rect x={x - 25} y={y - 8} width="50" height="16" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="4" />

        {/* Station building */}
        <rect x={x - 15} y={y - 15} width="30" height="30" fill="#10b981" stroke="#ffffff" strokeWidth="2" rx="4" />

        <rect
          x={x - 40}
          y={y + 25}
          width="80"
          height="16"
          fill="rgba(255, 255, 255, 0.95)"
          stroke="#374151"
          strokeWidth="1"
          rx="3"
        />
        <text x={x} y={y + 35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">
          {station.name}
        </text>

        {/* Signal lights */}
        {station.tracks.map((track, i) => (
          <circle
            key={`signal-${track.id}`}
            cx={x + (i - 0.5) * 20}
            cy={y - 25}
            r="4"
            fill={track.status === "operational" ? "#10b981" : track.status === "blocked" ? "#ef4444" : "#f59e0b"}
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}
      </g>
    )
  }

  const renderTrain = (train: TrainMovement) => {
    const track = stations.flatMap((s) => s.tracks).find((t) => t.id === train.trackId)
    if (!track) return null

    const { start, end } = track.coordinates
    const x = start[0] + (end[0] - start[0]) * train.position
    const y = start[1] + (end[1] - start[1]) * train.position

    const trainColor = train.type === "passenger" ? "#3b82f6" : "#f97316"
    const isMoving = train.status === "moving"

    return (
      <g key={train.id}>
        {/* Train body */}
        <rect
          x={x - 12}
          y={y - 6}
          width="24"
          height="12"
          fill={trainColor}
          stroke="#ffffff"
          strokeWidth="2"
          rx="3"
          opacity={isMoving ? 1 : 0.7}
        />

        {/* Train windows */}
        <rect x={x - 8} y={y - 3} width="4" height="3" fill="#ffffff" rx="1" />
        <rect x={x - 2} y={y - 3} width="4" height="3" fill="#ffffff" rx="1" />
        <rect x={x + 4} y={y - 3} width="4" height="3" fill="#ffffff" rx="1" />

        {/* Movement indicator */}
        {isMoving && (
          <circle cx={x + 15} cy={y} r="3" fill="#10b981" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Stopped indicator */}
        {train.status === "stopped" && <circle cx={x + 15} cy={y} r="3" fill="#ef4444" />}
      </g>
    )
  }

  const renderDiversionPath = () => {
    if (selectedRoute !== "route-2") return null

    return (
      <g>
        {/* Diversion curve from blocked track to clear track */}
        <path
          d="M 400 150 Q 350 200 420 200"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray="8,4"
          opacity="0.8"
        />

        {/* Diversion arrow */}
        <polygon points="415,195 425,200 415,205" fill="#10b981" />

        {/* Diversion label */}
        <text x={375} y={185} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981">
          DIVERSION
        </text>
      </g>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="h-auto min-h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                Interactive Route Planner
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 break-words">
                Plan optimal routes between real locations with live track conditions
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${showLiveData ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                />
                Live Data
              </div>
              <Switch checked={showLiveData} onCheckedChange={setShowLiveData} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-4">
          {/* Route Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Location</label>
              <Input
                placeholder="Enter departure city..."
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Location</label>
              <Input
                placeholder="Enter destination city..."
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={calculateRoute}
                disabled={!fromLocation || !toLocation || isCalculating}
                className="w-full"
              >
                {isCalculating ? "Calculating..." : "Find Routes"}
              </Button>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="relative h-80 bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Render tracks */}
              {stations.flatMap((station) =>
                station.tracks.map((track) =>
                  renderTrack(track, selectedRoute === "route-2" && track.trackNumber === 2),
                ),
              )}

              {/* Render diversion path */}
              {renderDiversionPath()}

              {/* Render stations */}
              {stations.map((station) => renderStation(station))}

              {/* Render trains */}
              {trainMovements.map((train) => renderTrain(train))}
            </svg>

            <div className="absolute bottom-4 left-4 bg-white/98 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 max-w-64">
              <div className="space-y-2 text-xs">
                <div className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                  <MapPin className="h-4 w-4" />
                  Map Legend
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-700">Track Status</div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-green-500"></div>
                      <span className="text-gray-600">Operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-red-500"></div>
                      <span className="text-gray-600">Blocked</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-medium text-gray-700">Signals</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Clear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Stop</span>
                    </div>
                  </div>

                  {/* Live Train Status in Legend */}
                  {showLiveData && (
                    <div className="space-y-1 border-t pt-2">
                      <div className="font-medium text-gray-700 flex items-center gap-1">
                        <Train className="h-3 w-3" />
                        Live Trains
                      </div>
                      {trainMovements.map((train) => {
                        const track = stations.flatMap((s) => s.tracks).find((t) => t.id === train.trackId)
                        return (
                          <div key={train.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Train {train.id.split("-")[1]}</span>
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  train.status === "moving"
                                    ? "bg-green-500"
                                    : train.status === "stopped"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                }`}
                              />
                              <span className="text-gray-500 text-xs">{Math.round(train.position * 100)}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showComparison && originalRoute && optimizedRoute && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Zap className="h-5 w-5" />
              Route Optimization Comparison
            </CardTitle>
            <p className="text-sm text-blue-700 mt-1">
              Detailed comparison between original blocked route and optimized alternative
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original Blocked Route Block */}
              <Card className="bg-red-50 border-2 border-red-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <CardTitle className="text-red-800 text-lg">Original Route (Blocked)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-300">
                      <div className="text-3xl font-bold text-red-700 mb-1">{originalRoute.distance}km</div>
                      <div className="text-sm text-red-600 font-medium">Distance</div>
                    </div>
                    <div className="text-center p-4 bg-red-100 rounded-lg border border-red-300">
                      <div className="text-3xl font-bold text-red-700 mb-1">{originalRoute.estimatedTime}min</div>
                      <div className="text-sm text-red-600 font-medium">Travel Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Route Details</h4>
                      <div className="text-sm text-red-700 space-y-1">
                        <div>
                          <strong>Path:</strong> {originalRoute.stations.join(" → ")}
                        </div>
                        <div>
                          <strong>Tracks:</strong> {originalRoute.tracks.join(", ")}
                        </div>
                        <div>
                          <strong>Status:</strong> Service Disrupted
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-red-200 rounded-lg border border-red-300">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Critical Issues
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Track 1 blocked due to maintenance work</li>
                        <li>• All trains stopped, causing passenger delays</li>
                        <li>• Service reliability compromised</li>
                        <li>• Increased operational costs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Route Block */}
              <Card className="bg-green-50 border-2 border-green-200 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-green-800 text-lg">Optimized Route (Active)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
                      <div className="text-3xl font-bold text-green-700 mb-1">{optimizedRoute.distance}km</div>
                      <div className="text-sm text-green-600 font-medium">Distance</div>
                    </div>
                    <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
                      <div className="text-3xl font-bold text-green-700 mb-1">{optimizedRoute.estimatedTime}min</div>
                      <div className="text-sm text-green-600 font-medium">Travel Time</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Route Details</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>
                          <strong>Path:</strong> {optimizedRoute.stations.join(" → ")}
                        </div>
                        <div>
                          <strong>Tracks:</strong> {optimizedRoute.tracks.join(", ")}
                        </div>
                        <div>
                          <strong>Status:</strong> Fully Operational
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-200 rounded-lg border border-green-300">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Optimization Benefits
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Automatic diversion to Track 2 (clear signals)</li>
                        <li>• Trains moving smoothly with optimal flow</li>
                        <li>• On-time performance maintained</li>
                        <li>• Enhanced passenger satisfaction</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <TrendingUp className="h-6 w-6" />
                  Time Savings & Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      -{originalRoute.estimatedTime - optimizedRoute.estimatedTime}min
                    </div>
                    <div className="text-sm text-green-700 font-semibold">Time Saved</div>
                    <div className="text-xs text-green-600 mt-1">Per Journey</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {Math.round(
                        ((originalRoute.estimatedTime - optimizedRoute.estimatedTime) / originalRoute.estimatedTime) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-blue-700 font-semibold">Efficiency Gain</div>
                    <div className="text-xs text-blue-600 mt-1">Overall Improvement</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                    <div className="text-sm text-purple-700 font-semibold">Service Reliability</div>
                    <div className="text-xs text-purple-600 mt-1">Uptime Maintained</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {Math.round((optimizedRoute.distance / originalRoute.distance) * 100)}%
                    </div>
                    <div className="text-sm text-orange-700 font-semibold">Route Efficiency</div>
                    <div className="text-xs text-orange-600 mt-1">Distance Optimization</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Operational Benefits
                    </h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>
                          Reduced passenger wait times by {originalRoute.estimatedTime - optimizedRoute.estimatedTime}{" "}
                          minutes
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Improved fuel efficiency through optimal routing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Lower operational costs and maintenance requirements</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Customer Impact
                    </h4>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Enhanced customer satisfaction and loyalty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Maintained schedule reliability during disruptions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Seamless travel experience with minimal delays</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {fromLocation && toLocation && (
        <Card className="mb-8">
          <CardHeader className="bg-gray-900 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold">Available Routes</CardTitle>
            <p className="text-gray-300">Select from available route options based on current track conditions</p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {routeOptions.map((route) => {
              if (route.id === "error-route") {
                return (
                  <Card key={route.id} className="p-6 border-2 border-red-300 bg-red-50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-800">Invalid Location</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Please enter valid station names like: Tehran, Qom, Kashan, Isfahan
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              }

              const isBlocked = route.status === "blocked"
              const isOptimal = route.status === "optimal"

              return (
                <Card
                  key={route.id}
                  className={`cursor-pointer transition-all border-2 rounded-xl ${
                    selectedRoute === route.id ? "ring-2 ring-blue-500" : ""
                  } ${
                    isBlocked
                      ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                      : isOptimal
                        ? "bg-gradient-to-r from-green-50 to-teal-50 border-green-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                  }`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {isBlocked && (
                          <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                        {isOptimal && (
                          <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                        {route.status === "alternative" && (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Navigation className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                        <h3
                          className={`text-lg font-bold ${
                            isBlocked ? "text-red-800" : isOptimal ? "text-green-800" : "text-blue-800"
                          }`}
                        >
                          {route.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        {route.diversions && (
                          <Badge className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1">Auto Diversion</Badge>
                        )}
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
                            isBlocked ? "text-red-700" : isOptimal ? "text-green-700" : "text-blue-700"
                          }`}
                        >
                          <Clock className="h-5 w-5" />
                          {route.estimatedTime}min
                          {route.timeSavings && <span className="text-green-600 ml-2">-{route.timeSavings}min</span>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mb-6">
                      <div>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isBlocked ? "text-red-600" : isOptimal ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          Distance:
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            isBlocked ? "text-red-800" : isOptimal ? "text-green-800" : "text-blue-800"
                          }`}
                        >
                          {route.distance}km
                        </div>
                      </div>

                      <div>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isBlocked ? "text-red-600" : isOptimal ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          Stations:
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            isBlocked ? "text-red-800" : isOptimal ? "text-green-800" : "text-blue-800"
                          }`}
                        >
                          {route.stations.length}
                        </div>
                      </div>

                      <div>
                        <div
                          className={`text-sm font-medium mb-2 ${
                            isBlocked ? "text-red-600" : isOptimal ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          Status:
                        </div>
                        <div
                          className={`text-2xl font-bold capitalize ${
                            isBlocked ? "text-red-800" : isOptimal ? "text-green-800" : "text-blue-800"
                          }`}
                        >
                          {route.status === "blocked"
                            ? "Blocked"
                            : route.status === "optimal"
                              ? "Optimal"
                              : "Alternative"}
                        </div>
                      </div>
                    </div>

                    {isBlocked && (
                      <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-red-800 mb-2">Service Alert:</h4>
                            <p className="text-sm text-red-700 leading-relaxed">
                              Track 1 is currently blocked due to maintenance. Trains are being automatically rerouted
                              to Track 2.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isOptimal && route.diversions && (
                      <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-green-800 mb-2">Smart Routing Active:</h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                              This route automatically diverts trains from blocked Track 1 to operational Track 2,
                              saving {route.timeSavings} minutes and ensuring reliable service.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}

      {showLiveData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-blue-600" />
              Live Train Status
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of train movements and track utilization
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trainMovements.map((train) => {
                const track = stations.flatMap((s) => s.tracks).find((t) => t.id === train.trackId)
                return (
                  <Card key={train.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Train {train.id.split("-")[1]}</span>
                      </div>
                      <Badge
                        variant={
                          train.status === "moving"
                            ? "default"
                            : train.status === "stopped"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {train.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Track: {track?.name}</div>
                      <div>Type: {train.type}</div>
                      <div>Progress: {Math.round(train.position * 100)}%</div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
