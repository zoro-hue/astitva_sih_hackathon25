"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain } from "lucide-react"

interface TrafficPrediction {
  timeframe: string
  predictedCongestion: number
  confidence: number
  factors: string[]
  recommendation: string
  impact: "low" | "medium" | "high" | "critical"
}

interface PredictionChart {
  time: string
  actual: number
  predicted: number
  confidence: number
}

export function TrafficPredictions() {
  const [predictions, setPredictions] = useState<TrafficPrediction[]>([])
  const [chartData, setChartData] = useState<PredictionChart[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("next_hour")

  useEffect(() => {
    // Mock traffic predictions
    const mockPredictions: TrafficPrediction[] = [
      {
        timeframe: "next_hour",
        predictedCongestion: 85,
        confidence: 92,
        factors: ["Rush hour peak", "Weather conditions", "Event traffic"],
        recommendation: "Implement speed restrictions on Delhi-Mumbai route",
        impact: "high",
      },
      {
        timeframe: "next_4_hours",
        predictedCongestion: 72,
        confidence: 87,
        factors: ["Normal traffic patterns", "Scheduled maintenance"],
        recommendation: "Monitor Kanpur Central junction closely",
        impact: "medium",
      },
      {
        timeframe: "next_24_hours",
        predictedCongestion: 68,
        confidence: 78,
        factors: ["Weekend traffic reduction", "Freight schedule changes"],
        recommendation: "Optimize freight train scheduling",
        impact: "low",
      },
      {
        timeframe: "next_week",
        predictedCongestion: 75,
        confidence: 65,
        factors: ["Festival season", "Increased passenger demand"],
        recommendation: "Prepare additional rolling stock",
        impact: "medium",
      },
    ]

    // Mock prediction chart data
    const mockChartData: PredictionChart[] = []
    for (let i = 0; i < 24; i++) {
      const time = new Date()
      time.setHours(time.getHours() + i)

      const actual = i < 12 ? 60 + Math.sin((i * Math.PI) / 12) * 20 + Math.random() * 10 : null
      const predicted = 60 + Math.sin((i * Math.PI) / 12) * 20 + Math.random() * 5
      const confidence = 95 - Math.abs(i - 12) * 2 + Math.random() * 10

      mockChartData.push({
        time: time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        actual: actual,
        predicted: predicted,
        confidence: Math.min(100, Math.max(60, confidence)),
      })
    }

    setPredictions(mockPredictions)
    setChartData(mockChartData)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-blue-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const selectedPrediction = predictions.find((p) => p.timeframe === selectedTimeframe)

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Traffic Predictions
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {predictions.map((prediction) => (
            <button
              key={prediction.timeframe}
              onClick={() => setSelectedTimeframe(prediction.timeframe)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                selectedTimeframe === prediction.timeframe
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {prediction.timeframe.replace("_", " ").replace("next ", "")}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {selectedPrediction ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm capitalize">
                  {selectedPrediction.timeframe.replace("_", " ")} Prediction
                </div>
                <div className="text-xs text-muted-foreground">
                  Congestion Level: {selectedPrediction.predictedCongestion}%
                </div>
              </div>
              <Badge variant={getImpactColor(selectedPrediction.impact)}>
                {selectedPrediction.impact.toUpperCase()} IMPACT
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{selectedPrediction.predictedCongestion}%</div>
                <div className="text-xs text-muted-foreground">Predicted Congestion</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className={`text-lg font-bold ${getConfidenceColor(selectedPrediction.confidence)}`}>
                  {selectedPrediction.confidence}%
                </div>
                <div className="text-xs text-muted-foreground">Confidence Level</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Key Factors</div>
              <div className="space-y-1">
                {selectedPrediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <span className="text-muted-foreground">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">AI Recommendation</div>
              <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded-lg">
                {selectedPrediction.recommendation}
              </div>
            </div>

            <div className="h-24">
              <div className="text-sm font-medium mb-2">24-Hour Prediction Trend</div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 8 }} domain={[40, 100]} />
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
                    dataKey="actual"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Select a timeframe to view predictions</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
