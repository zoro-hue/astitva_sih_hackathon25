"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"

interface StatusData {
  onTime: number
  delayed: number
  cancelled: number
  total: number
}

export function TrainStatusOverview() {
  const [statusData, setStatusData] = useState<StatusData>({
    onTime: 0,
    delayed: 0,
    cancelled: 0,
    total: 0,
  })

  useEffect(() => {
    // Simulate real-time data updates
    const updateData = () => {
      setStatusData({
        onTime: 142,
        delayed: 23,
        cancelled: 2,
        total: 167,
      })
    }

    updateData()
    const interval = setInterval(updateData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const onTimePercentage = (statusData.onTime / statusData.total) * 100
  const delayedPercentage = (statusData.delayed / statusData.total) * 100
  const cancelledPercentage = (statusData.cancelled / statusData.total) * 100

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Train Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{statusData.total}</div>
          <div className="text-sm text-muted-foreground">Active Trains</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{statusData.onTime}</span>
              <span className="text-xs text-muted-foreground">({onTimePercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <Progress value={onTimePercentage} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{statusData.delayed}</span>
              <span className="text-xs text-muted-foreground">({delayedPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <Progress value={delayedPercentage} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{statusData.cancelled}</span>
              <span className="text-xs text-muted-foreground">({cancelledPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <Progress value={cancelledPercentage} className="h-2" />
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground text-center">
            System Performance: <span className="font-medium text-green-600">Excellent</span>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-1">
            {onTimePercentage.toFixed(1)}% on-time performance
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
