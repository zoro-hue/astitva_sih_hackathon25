"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Clock, Fuel, Users } from "lucide-react"

interface MetricData {
  time: string
  onTimePerformance: number
  fuelEfficiency: number
  passengerLoad: number
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [selectedMetric, setSelectedMetric] = useState<"onTimePerformance" | "fuelEfficiency" | "passengerLoad">(
    "onTimePerformance",
  )

  useEffect(() => {
    // Mock performance data for the last 24 hours
    const generateData = () => {
      const data: MetricData[] = []
      for (let i = 23; i >= 0; i--) {
        const time = new Date()
        time.setHours(time.getHours() - i)

        data.push({
          time: time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          onTimePerformance: 85 + Math.random() * 10,
          fuelEfficiency: 3.8 + Math.random() * 0.8,
          passengerLoad: 70 + Math.random() * 25,
        })
      }
      return data
    }

    setMetrics(generateData())
    const interval = setInterval(() => {
      setMetrics(generateData())
    }, 300000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case "onTimePerformance":
        return {
          name: "On-Time Performance",
          icon: Clock,
          color: "#22c55e",
          unit: "%",
          current: metrics[metrics.length - 1]?.onTimePerformance?.toFixed(1) || "0",
        }
      case "fuelEfficiency":
        return {
          name: "Fuel Efficiency",
          icon: Fuel,
          color: "#3b82f6",
          unit: "km/L",
          current: metrics[metrics.length - 1]?.fuelEfficiency?.toFixed(1) || "0",
        }
      case "passengerLoad":
        return {
          name: "Passenger Load",
          icon: Users,
          color: "#f59e0b",
          unit: "%",
          current: metrics[metrics.length - 1]?.passengerLoad?.toFixed(1) || "0",
        }
      default:
        return {
          name: "Metric",
          icon: TrendingUp,
          color: "#6b7280",
          unit: "",
          current: "0",
        }
    }
  }

  const config = getMetricConfig(selectedMetric)
  const IconComponent = config.icon

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
        <div className="flex gap-2">
          {(["onTimePerformance", "fuelEfficiency", "passengerLoad"] as const).map((metric) => {
            const metricConfig = getMetricConfig(metric)
            const MetricIcon = metricConfig.icon
            return (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  selectedMetric === metric
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <MetricIcon className="w-3 h-3" />
                {metricConfig.name}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" style={{ color: config.color }} />
            <span className="text-sm font-medium">{config.name}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: config.color }}>
              {config.current}
              {config.unit}
            </div>
            <div className="text-xs text-muted-foreground">Current</div>
          </div>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
                interval="preserveStartEnd"
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                  fontWeight: "500",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "600",
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={config.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: config.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
