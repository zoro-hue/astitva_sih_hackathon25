"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Train, MapPin, Clock, Users, Gauge, AlertTriangle, RefreshCw } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface TrainData {
  id: string
  name: string
  route: string
  currentLocation: string
  status: string
  speed: number
  capacity: number
  occupancy: number
  nextStation: string
  estimatedArrival: string
  delay: number
  coordinates: { lat: number; lng: number }
}

export function RealTimeTrainMonitor() {
  const [trains, setTrains] = useState<TrainData[]>(iranRailwayData.trains)
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on time":
        return "text-green-600 bg-green-50"
      case "delayed":
        return "text-orange-600 bg-orange-50"
      case "critical delay":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-orange-600"
    return "text-green-600"
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => ({
          ...train,
          speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
          occupancy: Math.min(train.capacity, Math.max(0, train.occupancy + Math.floor((Math.random() - 0.5) * 20))),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Train className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{trains.length}</div>
                <div className="text-sm text-muted-foreground">Active Trains</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{trains.filter((t) => t.status === "On Time").length}</div>
                <div className="text-sm text-muted-foreground">On Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{trains.filter((t) => t.delay > 0).length}</div>
                <div className="text-sm text-muted-foreground">Delayed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((trains.reduce((sum, t) => sum + t.occupancy / t.capacity, 0) / trains.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Train Monitoring Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Real-Time Train Monitoring
              </CardTitle>
              <CardDescription>Live tracking of Iran Railway Network trains</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTrains([...iranRailwayData.trains])}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Train ID</th>
                  <th className="text-left p-3">Route & Location</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Speed</th>
                  <th className="text-left p-3">Occupancy</th>
                  <th className="text-left p-3">Next Station</th>
                  <th className="text-left p-3">ETA</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train) => (
                  <tr
                    key={train.id}
                    className={`border-b hover:bg-muted/50 cursor-pointer ${
                      selectedTrain === train.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
                  >
                    <td className="p-3">
                      <div className="font-mono text-sm font-semibold">{train.id}</div>
                      <div className="text-xs text-muted-foreground">{train.name}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{train.route}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {train.currentLocation}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(train.status)} variant="secondary">
                        {train.status}
                      </Badge>
                      {train.delay > 0 && <div className="text-xs text-red-600 mt-1">+{train.delay} min</div>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{Math.round(train.speed)} km/h</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`font-medium ${getOccupancyColor(train.occupancy, train.capacity)}`}>
                        {train.occupancy}/{train.capacity}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((train.occupancy / train.capacity) * 100)}%
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{train.nextStation}</div>
                      <div className="text-xs text-muted-foreground">ETA: {train.estimatedArrival}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{train.estimatedArrival}</span>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <Button variant="ghost" size="sm">
                        Track
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Train Details */}
      {selectedTrain && (
        <Card>
          <CardHeader>
            <CardTitle>Train Details - {selectedTrain}</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const train = trains.find((t) => t.id === selectedTrain)
              if (!train) return null

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Current Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium">{train.currentLocation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span className="font-medium">{Math.round(train.speed)} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={getStatusColor(train.status)} variant="secondary">
                            {train.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Passenger Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span className="font-medium">{train.capacity} passengers</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Occupancy:</span>
                          <span className={`font-medium ${getOccupancyColor(train.occupancy, train.capacity)}`}>
                            {train.occupancy} passengers
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupancy Rate:</span>
                          <span className="font-medium">{Math.round((train.occupancy / train.capacity) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
