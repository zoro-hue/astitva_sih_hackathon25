"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain, TrendingDown, AlertTriangle, Zap } from "lucide-react"

interface PredictionData {
  equipment: string
  currentHealth: number
  predictedFailure: string
  confidence: number
  recommendedAction: string
  riskLevel: "low" | "medium" | "high" | "critical"
}

interface HealthTrendData {
  date: string
  health: number
  predicted: number
}

export function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [healthTrend, setHealthTrend] = useState<HealthTrendData[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string>("")

  useEffect(() => {
    // Mock predictive analytics data
    const mockPredictions: PredictionData[] = [
      {
        equipment: "WAP7-30281",
        currentHealth: 72,
        predictedFailure: "2024-03-15",
        confidence: 87,
        recommendedAction: "Schedule bearing replacement",
        riskLevel: "medium",
      },
      {
        equipment: "Signal-NDLS-001",
        currentHealth: 45,
        predictedFailure: "2024-02-08",
        confidence: 94,
        recommendedAction: "Replace LED modules immediately",
        riskLevel: "high",
      },
      {
        equipment: "Track-KM-100",
        currentHealth: 28,
        predictedFailure: "2024-01-30",
        confidence: 96,
        recommendedAction: "Emergency rail replacement required",
        riskLevel: "critical",
      },
    ]

    // Mock health trend data
    const mockHealthTrend: HealthTrendData[] = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      mockHealthTrend.push({
        date: date.toISOString().split("T")[0],
        health: 85 - i * 1.5 + Math.random() * 5,
        predicted: 85 - i * 1.8 - Math.random() * 2,
      })
    }

    setPredictions(mockPredictions)
    setHealthTrend(mockHealthTrend)
    setSelectedEquipment(mockPredictions[0]?.equipment || "")
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "high":
        return <TrendingDown className="w-4 h-4 text-orange-500" />
      case "medium":
        return <Zap className="w-4 h-4 text-yellow-500" />
      case "low":
        return <div className="w-4 h-4 rounded-full bg-green-500" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
    }
  }

  const selectedPrediction = predictions.find((p) => p.equipment === selectedEquipment)

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Predictive Analytics
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {predictions.map((prediction) => (
            <button
              key={prediction.equipment}
              onClick={() => setSelectedEquipment(prediction.equipment)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                selectedEquipment === prediction.equipment
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {getRiskIcon(prediction.riskLevel)}
              {prediction.equipment}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedPrediction ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{selectedPrediction.equipment}</div>
                <div className="text-xs text-muted-foreground">Current Health: {selectedPrediction.currentHealth}%</div>
              </div>
              <Badge variant={getRiskColor(selectedPrediction.riskLevel)}>
                {selectedPrediction.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Predicted Failure</div>
                <div className="font-medium">{new Date(selectedPrediction.predictedFailure).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Confidence</div>
                <div className="font-medium">{selectedPrediction.confidence}%</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Recommended Action</div>
              <div className="text-sm font-medium text-foreground">{selectedPrediction.recommendedAction}</div>
            </div>

            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrend.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 8 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="health"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    name="Actual Health"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted Trend"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select equipment to view predictions</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
