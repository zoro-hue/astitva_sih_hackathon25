"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Zap, Activity, BarChart3, Route, MapPin, Layers, Navigation, Gauge } from "lucide-react"

interface TrackSegment {
  id: string
  name: string
  trackNumber: number
  trackType: "express" | "standard" | "freight" | "local" | "high_speed"
  maxThroughput: number
  currentUtilization: number
  status: "operational" | "maintenance" | "congested" | "blocked"
  bottleneckFactor: number
  signalStatus: "green" | "yellow" | "red"
  speedLimit: number
  currentTrains: number
  coordinates: { start: [number, number]; end: [number, number] }
}

interface Station {
  id: string
  name: string
  coordinates: [number, number]
  type: "terminal" | "junction" | "station" | "depot"
  status: "operational" | "maintenance" | "disrupted"
  platforms: number
  currentTrains: number
  capacity: number
  tracks: TrackSegment[]
  elevation: number
  facilities: string[]
}

interface OptimizedPath {
  id: string
  name: string
  stations: string[]
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
  coordinates: [number, number][]
}

export function RealisticTrackMap() {
  const [selectedRoute, setSelectedRoute] = useState<string>("tehran-isfahan")
  const [selectedPath, setSelectedPath] = useState<string>("path-1")
  const [viewMode, setViewMode] = useState<"satellite" | "schematic" | "heatmap">("satellite")
  const [showSignals, setShowSignals] = useState(true)
  const [showTrains, setShowTrains] = useState(true)
  const [showCongestion, setShowCongestion] = useState(true)
  const [zoomLevel, setZoomLevel] = useState([50])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [realTimeData, setRealTimeData] = useState(true)
  const [actualZoom, setActualZoom] = useState(1)

  const stations: Station[] = [
    {
      id: "TEH",
      name: "Tehran Central",
      coordinates: [51.4215, 35.6944],
      type: "terminal",
      status: "operational",
      platforms: 12,
      currentTrains: 8,
      capacity: 15,
      elevation: 1190,
      facilities: ["maintenance", "freight", "passenger", "control_center"],
      tracks: [
        {
          id: "TEH-QOM-1",
          name: "Tehran-Qom Express Track 1",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 16,
          currentUtilization: 75.5,
          status: "operational",
          bottleneckFactor: 1.0,
          signalStatus: "green",
          speedLimit: 160,
          currentTrains: 3,
          coordinates: { start: [51.4215, 35.6944], end: [50.8764, 34.6401] },
        },
        {
          id: "TEH-QOM-2",
          name: "Tehran-Qom Standard Track 2",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 16,
          currentUtilization: 68.2,
          status: "operational",
          bottleneckFactor: 1.0,
          signalStatus: "green",
          speedLimit: 120,
          currentTrains: 2,
          coordinates: { start: [51.4215, 35.6944], end: [50.8764, 34.6401] },
        },
        {
          id: "TEH-QOM-3",
          name: "Tehran-Qom Freight Track",
          trackNumber: 3,
          trackType: "freight",
          maxThroughput: 8,
          currentUtilization: 45.0,
          status: "operational",
          bottleneckFactor: 1.1,
          signalStatus: "yellow",
          speedLimit: 80,
          currentTrains: 1,
          coordinates: { start: [51.4215, 35.6944], end: [50.8764, 34.6401] },
        },
        {
          id: "TEH-TAB-1",
          name: "Tehran-Tabriz Express",
          trackNumber: 4,
          trackType: "express",
          maxThroughput: 14,
          currentUtilization: 82.3,
          status: "congested",
          bottleneckFactor: 1.2,
          signalStatus: "yellow",
          speedLimit: 140,
          currentTrains: 4,
          coordinates: { start: [51.4215, 35.6944], end: [46.2919, 38.0962] },
        },
      ],
    },
    {
      id: "QOM",
      name: "Qom Junction",
      coordinates: [50.8764, 34.6401],
      type: "junction",
      status: "operational",
      platforms: 6,
      currentTrains: 4,
      capacity: 8,
      elevation: 930,
      facilities: ["passenger", "freight", "signal_box"],
      tracks: [
        {
          id: "QOM-KAS-1",
          name: "Qom-Kashan Express Track",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 14,
          currentUtilization: 82.1,
          status: "congested",
          bottleneckFactor: 1.3,
          signalStatus: "yellow",
          speedLimit: 140,
          currentTrains: 4,
          coordinates: { start: [50.8764, 34.6401], end: [51.4364, 33.9831] },
        },
        {
          id: "QOM-KAS-2",
          name: "Qom-Kashan Standard Track",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 14,
          currentUtilization: 71.8,
          status: "operational",
          bottleneckFactor: 1.1,
          signalStatus: "green",
          speedLimit: 100,
          currentTrains: 2,
          coordinates: { start: [50.8764, 34.6401], end: [51.4364, 33.9831] },
        },
        {
          id: "QOM-ARA-1",
          name: "Qom-Arak Industrial",
          trackNumber: 3,
          trackType: "freight",
          maxThroughput: 10,
          currentUtilization: 55.4,
          status: "operational",
          bottleneckFactor: 1.0,
          signalStatus: "green",
          speedLimit: 90,
          currentTrains: 2,
          coordinates: { start: [50.8764, 34.6401], end: [49.6893, 34.0954] },
        },
      ],
    },
    {
      id: "KAS",
      name: "Kashan",
      coordinates: [51.4364, 33.9831],
      type: "station",
      status: "operational",
      platforms: 4,
      currentTrains: 3,
      capacity: 6,
      elevation: 982,
      facilities: ["passenger", "maintenance"],
      tracks: [
        {
          id: "KAS-ISF-1",
          name: "Kashan-Isfahan High Speed",
          trackNumber: 1,
          trackType: "high_speed",
          maxThroughput: 18,
          currentUtilization: 91.3,
          status: "congested",
          bottleneckFactor: 1.5,
          signalStatus: "red",
          speedLimit: 200,
          currentTrains: 5,
          coordinates: { start: [51.4364, 33.9831], end: [51.6746, 32.6539] },
        },
        {
          id: "KAS-ISF-2",
          name: "Kashan-Isfahan Standard",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 16,
          currentUtilization: 78.5,
          status: "operational",
          bottleneckFactor: 1.2,
          signalStatus: "yellow",
          speedLimit: 120,
          currentTrains: 3,
          coordinates: { start: [51.4364, 33.9831], end: [51.6746, 32.6539] },
        },
        {
          id: "KAS-ISF-3",
          name: "Kashan-Isfahan Local",
          trackNumber: 3,
          trackType: "local",
          maxThroughput: 12,
          currentUtilization: 55.2,
          status: "operational",
          bottleneckFactor: 1.0,
          signalStatus: "green",
          speedLimit: 80,
          currentTrains: 2,
          coordinates: { start: [51.4364, 33.9831], end: [51.6746, 32.6539] },
        },
      ],
    },
    {
      id: "ISF",
      name: "Isfahan Terminal",
      coordinates: [51.6746, 32.6539],
      type: "terminal",
      status: "operational",
      platforms: 8,
      currentTrains: 6,
      capacity: 12,
      elevation: 1574,
      facilities: ["passenger", "freight", "maintenance", "depot"],
      tracks: [
        {
          id: "ISF-SHI-1",
          name: "Isfahan-Shiraz Express",
          trackNumber: 1,
          trackType: "express",
          maxThroughput: 15,
          currentUtilization: 67.8,
          status: "operational",
          bottleneckFactor: 1.1,
          signalStatus: "green",
          speedLimit: 150,
          currentTrains: 3,
          coordinates: { start: [51.6746, 32.6539], end: [52.5311, 29.5918] },
        },
        {
          id: "ISF-YAZ-1",
          name: "Isfahan-Yazd Desert Line",
          trackNumber: 2,
          trackType: "standard",
          maxThroughput: 12,
          currentUtilization: 43.2,
          status: "operational",
          bottleneckFactor: 1.0,
          signalStatus: "green",
          speedLimit: 110,
          currentTrains: 2,
          coordinates: { start: [51.6746, 32.6539], end: [54.3675, 31.8974] },
        },
      ],
    },
    {
      id: "TAB",
      name: "Tabriz",
      coordinates: [46.2919, 38.0962],
      type: "terminal",
      status: "operational",
      platforms: 6,
      currentTrains: 4,
      capacity: 8,
      facilities: ["passenger", "freight", "international"],
      tracks: [
        {
          id: "TAB-ARD-1",
          name: "Tabriz-Ardabil Mountain",
          trackNumber: 1,
          trackType: "standard",
          maxThroughput: 10,
          currentUtilization: 38.5,
          status: "operational",
          bottleneckFactor: 1.3,
          signalStatus: "green",
          speedLimit: 90,
          currentTrains: 1,
          coordinates: { start: [46.2919, 38.0962], end: [48.2933, 38.2498] },
        },
      ],
    },
    {
      id: "ARA",
      name: "Arak Industrial",
      coordinates: [49.6893, 34.0954],
      type: "depot",
      status: "operational",
      platforms: 4,
      currentTrains: 6,
      capacity: 10,
      elevation: 1708,
      facilities: ["freight", "maintenance", "industrial"],
      tracks: [
        {
          id: "ARA-HAM-1",
          name: "Arak-Hamedan Freight",
          trackNumber: 1,
          trackType: "freight",
          maxThroughput: 8,
          currentUtilization: 72.1,
          status: "operational",
          bottleneckFactor: 1.2,
          signalStatus: "yellow",
          speedLimit: 70,
          currentTrains: 3,
          coordinates: { start: [49.6893, 34.0954], end: [48.5146, 34.7992] },
        },
      ],
    },
    {
      id: "SHI",
      name: "Shiraz",
      coordinates: [52.5311, 29.5918],
      type: "terminal",
      status: "operational",
      platforms: 6,
      currentTrains: 3,
      capacity: 8,
      elevation: 1486,
      facilities: ["passenger", "freight", "tourist"],
      tracks: [],
    },
    {
      id: "YAZ",
      name: "Yazd",
      coordinates: [54.3675, 31.8974],
      type: "station",
      status: "operational",
      platforms: 3,
      currentTrains: 2,
      capacity: 4,
      elevation: 1216,
      facilities: ["passenger", "desert_operations"],
      tracks: [],
    },
  ]

  const [pathOptions, setPathOptions] = useState<OptimizedPath[]>([
    {
      id: "path-1",
      name: "Tehran-Isfahan Express Corridor",
      stations: ["TEH", "QOM", "KAS", "ISF"],
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
      coordinates: [
        [51.4215, 35.6944],
        [50.8764, 34.6401],
        [51.4364, 33.9831],
        [51.6746, 32.6539],
      ],
    },
    {
      id: "path-2",
      name: "Tehran-Isfahan Standard Route",
      stations: ["TEH", "QOM", "KAS", "ISF"],
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
      coordinates: [
        [51.4215, 35.6944],
        [50.8764, 34.6401],
        [51.4364, 33.9831],
        [51.6746, 32.6539],
      ],
    },
    {
      id: "path-3",
      name: "Tehran-Tabriz Northern Route",
      stations: ["TEH", "TAB"],
      trackSequence: ["TEH-TAB-1"],
      totalDistance: 628.2,
      estimatedTime: 420,
      maxThroughput: 14,
      currentCongestion: 5.8,
      reliabilityScore: 7.9,
      isOptimized: false,
      timeSavings: 0,
      efficiencyGain: 0,
      throughputIncrease: 0,
      coordinates: [
        [51.4215, 35.6944],
        [46.2919, 38.0962],
      ],
    },
    {
      id: "path-4",
      name: "Isfahan-Shiraz Southern Corridor",
      stations: ["ISF", "SHI"],
      trackSequence: ["ISF-SHI-1"],
      totalDistance: 482.1,
      estimatedTime: 285,
      maxThroughput: 15,
      currentCongestion: 2.1,
      reliabilityScore: 9.3,
      isOptimized: true,
      timeSavings: 35,
      efficiencyGain: 24.2,
      throughputIncrease: 18.7,
      coordinates: [
        [51.6746, 32.6539],
        [52.5311, 29.5918],
      ],
    },
  ])

  const currentPath = pathOptions.find((path) => path.id === selectedPath)

  // Convert geographic coordinates to SVG coordinates
  const geoToSVG = (coord: [number, number]): [number, number] => {
    const [lon, lat] = coord
    const minLon = 46.0,
      maxLon = 55.0
    const minLat = 29.0,
      maxLat = 39.0

    const x = ((lon - minLon) / (maxLon - minLon)) * 800 + 50
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600 + 50

    return [x, y]
  }

  const getTrackStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "#10b981"
      case "congested":
        return "#f59e0b"
      case "maintenance":
        return "#f97316"
      case "blocked":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "green":
        return "#10b981"
      case "yellow":
        return "#f59e0b"
      case "red":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getCongestionHeatColor = (utilization: number) => {
    if (utilization >= 90) return "rgba(239, 68, 68, 0.8)"
    if (utilization >= 70) return "rgba(245, 158, 11, 0.6)"
    if (utilization >= 50) return "rgba(34, 197, 94, 0.4)"
    return "rgba(16, 185, 129, 0.2)"
  }

  const renderRealisticTrack = (track: TrackSegment, isSelected: boolean) => {
    const [startX, startY] = geoToSVG(track.coordinates.start)
    const [endX, endY] = geoToSVG(track.coordinates.end)

    // Calculate parallel track offset based on track number
    const angle = Math.atan2(endY - startY, endX - startX)
    const offset = (track.trackNumber - 2) * 8
    const offsetX = Math.cos(angle + Math.PI / 2) * offset
    const offsetY = Math.sin(angle + Math.PI / 2) * offset

    return (
      <g key={track.id}>
        {/* Track bed (ballast) */}
        <line
          x1={startX + offsetX}
          y1={startY + offsetY}
          x2={endX + offsetX}
          y2={endY + offsetY}
          stroke="#8b7355"
          strokeWidth="12"
          opacity="0.6"
        />

        {/* Main track */}
        <line
          x1={startX + offsetX}
          y1={startY + offsetY}
          x2={endX + offsetX}
          y2={endY + offsetY}
          stroke={isSelected ? "#10b981" : getTrackStatusColor(track.status)}
          strokeWidth={isSelected ? 6 : track.trackType === "high_speed" ? 5 : 4}
          strokeDasharray={track.status === "maintenance" ? "8,4" : "none"}
          opacity={isSelected ? 1 : 0.8}
        />

        {/* Rails */}
        <line
          x1={startX + offsetX - 2}
          y1={startY + offsetY - 2}
          x2={endX + offsetX - 2}
          y2={endY + offsetY - 2}
          stroke="#4a5568"
          strokeWidth="1.5"
        />
        <line
          x1={startX + offsetX + 2}
          y1={startY + offsetY + 2}
          x2={endX + offsetX + 2}
          y2={endY + offsetY + 2}
          stroke="#4a5568"
          strokeWidth="1.5"
        />

        {/* Congestion heatmap overlay */}
        {showCongestion && (
          <line
            x1={startX + offsetX}
            y1={startY + offsetY}
            x2={endX + offsetX}
            y2={endY + offsetY}
            stroke={getCongestionHeatColor(track.currentUtilization)}
            strokeWidth="8"
            opacity="0.7"
          />
        )}

        {/* Track type indicator */}
        {track.trackType === "high_speed" && (
          <line
            x1={startX + offsetX}
            y1={startY + offsetY}
            x2={endX + offsetX}
            y2={endY + offsetY}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4,2"
            opacity="0.8"
          />
        )}

        {/* Current trains on track */}
        {showTrains &&
          track.currentTrains > 0 &&
          Array.from({ length: Math.min(track.currentTrains, 3) }).map((_, i) => {
            const progress = (i + 1) / (track.currentTrains + 1)
            const trainX = startX + (endX - startX) * progress + offsetX
            const trainY = startY + (endY - startY) * progress + offsetY

            return (
              <g key={`train-${i}`}>
                <rect x={trainX - 6} y={trainY - 3} width="12" height="6" fill="#1f2937" rx="2" />
                <rect x={trainX - 4} y={trainY - 2} width="8" height="4" fill="#3b82f6" rx="1" />
              </g>
            )
          })}

        <g>
          <rect
            x={startX + (endX - startX) * 0.1 - 25 + offsetX}
            y={startY + (endY - startY) * 0.1 - 20 + offsetY}
            width="50"
            height="16"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="#374151"
            strokeWidth="1"
            rx="3"
          />
          <text
            x={startX + (endX - startX) * 0.1 + offsetX}
            y={startY + (endY - startY) * 0.1 - 8 + offsetY}
            textAnchor="middle"
            fontSize="9"
            fill="#374151"
            fontWeight="bold"
          >
            {track.trackType.toUpperCase()} {track.trackNumber}
          </text>
        </g>
      </g>
    )
  }

  const renderStation = (station: Station) => {
    const [x, y] = geoToSVG(station.coordinates)
    const stationSize = station.type === "terminal" ? 16 : station.type === "junction" ? 12 : 10

    return (
      <g key={station.id}>
        {/* Station platform */}
        <rect
          x={x - stationSize}
          y={y - 4}
          width={stationSize * 2}
          height="8"
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="1"
          rx="2"
        />

        {/* Station building */}
        <rect
          x={x - stationSize / 2}
          y={y - stationSize / 2}
          width={stationSize}
          height={stationSize}
          fill={station.status === "operational" ? "#10b981" : station.status === "maintenance" ? "#f97316" : "#ef4444"}
          stroke="#ffffff"
          strokeWidth="2"
          rx="2"
        />

        {/* Station type indicator */}
        {station.type === "terminal" && <rect x={x - 3} y={y - 3} width="6" height="6" fill="#ffffff" rx="1" />}

        {station.type === "junction" && <circle cx={x} cy={y} r="3" fill="#ffffff" />}

        <g>
          <rect
            x={x - 40}
            y={y + stationSize + 8}
            width="80"
            height="16"
            fill="rgba(255, 255, 255, 0.98)"
            stroke="#374151"
            strokeWidth="1"
            rx="3"
          />
          <text x={x} y={y + stationSize + 18} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#374151">
            {station.name}
          </text>
        </g>

        <g>
          <rect
            x={x - 25}
            y={y + stationSize + 26}
            width="50"
            height="12"
            fill="rgba(255, 255, 255, 0.95)"
            stroke="#6b7280"
            strokeWidth="1"
            rx="2"
          />
          <text x={x} y={y + stationSize + 34} textAnchor="middle" fontSize="8" fill="#6b7280">
            {station.currentTrains}/{station.capacity} | {station.platforms}P
          </text>
        </g>

        {/* Signal indicators */}
        {showSignals &&
          station.tracks.map((track, i) => (
            <circle
              key={`signal-${track.id}`}
              cx={x + (i - station.tracks.length / 2) * 8}
              cy={y - stationSize - 8}
              r="3"
              fill={getSignalColor(track.signalStatus)}
              stroke="#ffffff"
              strokeWidth="1"
            />
          ))}
      </g>
    )
  }

  const runOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
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

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeData) return

    const interval = setInterval(() => {
      stations.forEach((station) => {
        station.tracks.forEach((track) => {
          // Simulate utilization changes
          track.currentUtilization += (Math.random() - 0.5) * 2
          track.currentUtilization = Math.max(0, Math.min(100, track.currentUtilization))

          // Update signal status based on utilization
          if (track.currentUtilization > 85) {
            track.signalStatus = "red"
          } else if (track.currentUtilization > 65) {
            track.signalStatus = "yellow"
          } else {
            track.signalStatus = "green"
          }
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [realTimeData])

  useEffect(() => {
    setActualZoom(zoomLevel[0] / 50) // Convert slider value to zoom factor
  }, [zoomLevel])

  const getViewModeStyles = () => {
    switch (viewMode) {
      case "satellite":
        return "bg-gradient-to-br from-green-100 via-blue-100 to-gray-100"
      case "schematic":
        return "bg-white"
      case "heatmap":
        return "bg-gradient-to-br from-red-100 via-yellow-100 to-green-100"
      default:
        return "bg-gradient-to-br from-green-100 via-blue-100 to-gray-100"
    }
  }

  const getViewModeBackground = () => {
    switch (viewMode) {
      case "satellite":
        return (
          <>
            <defs>
              <pattern id="satellite-terrain" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="#f0f9ff" />
                <circle cx="20" cy="20" r="3" fill="#10b981" opacity="0.3" />
                <circle cx="80" cy="60" r="2" fill="#059669" opacity="0.4" />
                <circle cx="50" cy="80" r="4" fill="#047857" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#satellite-terrain)" />
          </>
        )
      case "schematic":
        return (
          <>
            <defs>
              <pattern id="schematic-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#schematic-grid)" />
          </>
        )
      case "heatmap":
        return (
          <>
            <defs>
              <radialGradient id="heatmap-bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fecaca" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#heatmap-bg)" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="h-auto min-h-[900px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Enhanced Railway Network Map
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 break-words">
              Comprehensive network with optimal path finding and real-time conditions
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={runOptimization} disabled={isOptimizing} size="sm">
              {isOptimizing ? "Optimizing..." : "Optimize Routes"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Control Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">View Mode</label>
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satellite">Satellite View</SelectItem>
                <SelectItem value="schematic">Schematic View</SelectItem>
                <SelectItem value="heatmap">Congestion Heatmap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom Level: {zoomLevel[0]}%</label>
            <Slider value={zoomLevel} onValueChange={setZoomLevel} max={100} min={25} step={25} className="w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Signals</label>
              <Switch checked={showSignals} onCheckedChange={setShowSignals} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Trains</label>
              <Switch checked={showTrains} onCheckedChange={setShowTrains} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Congestion</label>
              <Switch checked={showCongestion} onCheckedChange={setShowCongestion} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Real-time</label>
              <Switch checked={realTimeData} onCheckedChange={setRealTimeData} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="map" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map">Network Map</TabsTrigger>
            <TabsTrigger value="analytics">Track Analytics</TabsTrigger>
            <TabsTrigger value="optimization">Optimization Results</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            {/* Path Selection */}
            <div className="flex items-center gap-4">
              <Select value={selectedPath} onValueChange={setSelectedPath}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select path" />
                </SelectTrigger>
                <SelectContent>
                  {pathOptions.map((path) => (
                    <SelectItem key={path.id} value={path.id}>
                      {path.name}
                      {path.isOptimized && (
                        <Badge variant="secondary" className="ml-2">
                          Optimized
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentPath && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Gauge className="h-4 w-4 text-blue-600" />
                    {currentPath.maxThroughput}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-green-600" />
                    {currentPath.estimatedTime}min
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    {currentPath.reliabilityScore.toFixed(1)}/10
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Realistic Map */}
            <div
              className={`relative h-[500px] ${getViewModeStyles()} rounded-lg overflow-hidden border-2 border-gray-200`}
            >
              {/* Background terrain effect based on view mode */}
              {viewMode === "satellite" && (
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-green-200 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-yellow-100 to-transparent"></div>
                  <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-blue-100 to-transparent"></div>
                </div>
              )}

              {viewMode === "heatmap" && (
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute inset-0 bg-gradient-radial from-red-200 via-yellow-200 to-green-200"></div>
                </div>
              )}

              <div
                className="absolute inset-0 transition-transform duration-300 ease-in-out"
                style={{
                  transform: `scale(${actualZoom})`,
                  transformOrigin: "center center",
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 900 700">
                  {/* View mode specific backgrounds */}
                  {getViewModeBackground()}

                  {/* Render all tracks */}
                  {stations.map((station) =>
                    station.tracks.map((track) =>
                      renderRealisticTrack(track, currentPath?.trackSequence.includes(track.id) || false),
                    ),
                  )}

                  {/* Render stations */}
                  {stations.map((station) => renderStation(station))}

                  {/* Optimized path highlight */}
                  {currentPath && currentPath.isOptimized && (
                    <path
                      d={`M ${currentPath.coordinates
                        .map((coord) => {
                          const [x, y] = geoToSVG(coord)
                          return `${x},${y}`
                        })
                        .join(" L ")}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray="10,5"
                      opacity="0.8"
                    />
                  )}
                </svg>
              </div>

              {/* Enhanced Legend */}
              <div className="absolute bottom-4 left-4 bg-white/98 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-xs">
                <div className="space-y-3 text-xs">
                  <div className="font-semibold mb-2 flex items-center gap-2 text-gray-800">
                    <Layers className="h-4 w-4" />
                    Network Legend
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-700">Track Types</div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-blue-500"></div>
                        <span className="text-gray-600">High Speed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-green-500"></div>
                        <span className="text-gray-600">Express</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-orange-500"></div>
                        <span className="text-gray-600">Freight</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-medium text-gray-700">Status</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Operational</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Congested</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Blocked</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">Current View</div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded ${
                          viewMode === "satellite"
                            ? "bg-green-500"
                            : viewMode === "schematic"
                              ? "bg-blue-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-gray-600 capitalize">{viewMode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Status Indicator */}
              <div className="absolute top-4 right-4 bg-white/98 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${realTimeData ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  ></div>
                  <span className="font-medium text-gray-700">{realTimeData ? "Live Data" : "Static View"}</span>
                  <span className="text-gray-500">| Zoom: {zoomLevel[0]}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Track Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stations
                .filter((station) => station.tracks.length > 0)
                .map((station) => (
                  <Card key={station.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {station.name}
                      </h4>
                      <Badge variant={station.status === "operational" ? "default" : "destructive"}>
                        {station.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Platforms: {station.platforms}</div>
                        <div>Elevation: {station.elevation}m</div>
                        <div>Current Trains: {station.currentTrains}</div>
                        <div>Capacity: {station.capacity}</div>
                      </div>

                      <div className="space-y-2">
                        {station.tracks.map((track) => (
                          <div
                            key={track.id}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full`}
                                style={{ backgroundColor: getTrackStatusColor(track.status) }}
                              />
                              <span className="font-medium">Track {track.trackNumber}</span>
                              <Badge variant="outline" className="text-xs">
                                {track.trackType}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{track.currentUtilization.toFixed(1)}%</div>
                              <div className="text-muted-foreground">{track.speedLimit}km/h</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            {/* Optimization Results */}
            <div className="grid grid-cols-1 gap-4">
              {pathOptions
                .filter((path) => path.isOptimized)
                .map((path) => (
                  <Card key={path.id} className="p-4 border-green-200 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-green-800 flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        {path.name}
                      </h4>
                      <Badge className="bg-green-600">Optimized Route</Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center mb-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">+{path.timeSavings}min</div>
                        <div className="text-xs text-muted-foreground">Time Saved</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">+{path.efficiencyGain.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">+{path.throughputIncrease.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Throughput</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{path.reliabilityScore.toFixed(1)}/10</div>
                        <div className="text-xs text-muted-foreground">Reliability</div>
                      </div>
                    </div>

                    <div className="text-sm text-green-800">
                      <strong>Route:</strong> {path.stations.join(" → ")}
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      <strong>Distance:</strong> {path.totalDistance}km |<strong> Max Speed:</strong> 200km/h |
                      <strong> Congestion Level:</strong> {path.currentCongestion.toFixed(1)}
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Insights Panel */}
        {currentPath && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-blue-900 mb-2">AI-Powered Route Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div className="space-y-2">
                    <p>
                      <strong>Current Analysis:</strong> The selected route shows{" "}
                      {currentPath.currentCongestion > 5
                        ? "high"
                        : currentPath.currentCongestion > 3
                          ? "moderate"
                          : "low"}{" "}
                      congestion levels with {currentPath.reliabilityScore.toFixed(1)}/10 reliability score.
                    </p>
                    <p>
                      <strong>Optimization Potential:</strong>{" "}
                      {currentPath.isOptimized
                        ? `This route is already optimized with ${currentPath.timeSavings}min time savings.`
                        : "This route has optimization potential for improved efficiency."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>Track Utilization:</strong> Multiple parallel tracks provide {currentPath.maxThroughput}{" "}
                      trains/hour capacity with current utilization varying by segment.
                    </p>
                    <p>
                      <strong>Recommendation:</strong>{" "}
                      {currentPath.isOptimized
                        ? "Maintain current routing for optimal performance."
                        : "Consider alternative tracks during peak hours for better throughput."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
