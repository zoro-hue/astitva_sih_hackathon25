"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Train, MapPin, Zap } from "lucide-react"
import { iranRailwayData } from "@/lib/data/iran-railway-dataset"

interface TrainData {
  id: string
  name: string
  route: string
  currentLocation: string
  status: string
  speed: number
  nextStation: string
  delay: number
}

export function RealTimeMonitor() {
  const [trains, setTrains] = useState<TrainData[]>(
    iranRailwayData.trains.map((train) => ({
      id: train.id,
      name: train.name,
      route: train.route,
      currentLocation: train.currentLocation,
      status: train.status,
      speed: train.speed,
      nextStation: train.nextStation,
      delay: train.delay,
    })),
  )
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => ({
          ...train,
          speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
          delay: Math.max(0, train.delay + Math.floor((Math.random() - 0.5) * 5)),
        })),
      )
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string, delay: number) => {
    if (status === "Critical Delay" || delay > 30) return "destructive"
    if (status === "Delayed" || delay > 10) return "secondary"
    return "default"
  }

  const getStatusText = (status: string, delay: number) => {
    if (status === "Critical Delay" || delay > 30) return `Delayed ${delay}min`
    if (delay > 0) return `Late ${delay}min`
    return "On Time"
  }

  if (loading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="w-5 h-5" />
            Real-time Train Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Train className="w-5 h-5" />
          Real-time Train Monitoring - Iran Railway
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</div>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {trains.map((train) => (
          <div
            key={train.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{train.id}</span>
                <Badge variant={getStatusColor(train.status, train.delay)}>
                  {getStatusText(train.status, train.delay)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-1">{train.name}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {train.currentLocation}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {Math.round(train.speed)} km/h
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Next:</div>
              <div className="text-sm font-medium">{train.nextStation}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
