"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, TrendingUp, Activity, Zap, Gauge, Shield } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SimulationScenario {
  id: string
  name: string
  description: string
  status: "ready" | "running" | "completed"
  type: "current" | "optimized" | "peak-hour"
  metrics: {
    delay: number
    throughput: number
    fuelEfficiency: number
    capacity: number
    reliability: number
  }
  improvements?: {
    delay: number
    throughput: number
    fuelEfficiency: number
    capacity: number
  }
  lastUpdated: string
}

const simulationData = [
  { time: "00:00", current: 18.5, optimized: 12.3, peakHour: 15.2 },
  { time: "04:00", current: 15.2, optimized: 10.1, peakHour: 12.8 },
  { time: "08:00", current: 22.1, optimized: 14.5, peakHour: 18.9 },
  { time: "12:00", current: 19.8, optimized: 13.2, peakHour: 16.4 },
  { time: "16:00", current: 25.3, optimized: 16.8, peakHour: 21.1 },
  { time: "20:00", current: 21.4, optimized: 14.9, peakHour: 17.8 },
]

const routeOptimizationData = [
  { route: "Mumbai-Pune", current: 245, optimized: 275, improvement: 12.2 },
  { route: "Delhi-Jaipur", current: 198, optimized: 221, improvement: 11.6 },
  { route: "Chennai-Bangalore", current: 167, optimized: 189, improvement: 13.2 },
  { route: "Kolkata-Bhubaneswar", current: 134, optimized: 152, improvement: 13.4 },
]

const mockScenarios: SimulationScenario[] = [
  {
    id: "current",
    name: "Current State",
    description: "Current network configuration and traffic patterns",
    status: "ready",
    type: "current",
    metrics: {
      delay: 18.5,
      throughput: 245,
      fuelEfficiency: 78,
      capacity: 82,
      reliability: 94,
    },
    lastUpdated: "5m ago",
  },
  {
    id: "optimized",
    name: "Route Optimization",
    description: "Optimized routing with AI-suggested path changes",
    status: "completed",
    type: "optimized",
    metrics: {
      delay: 12.3,
      throughput: 275,
      fuelEfficiency: 85,
      capacity: 75,
      reliability: 97,
    },
    improvements: {
      delay: -33.5,
      throughput: 12.2,
      fuelEfficiency: 8.9,
      capacity: -8.5,
    },
    lastUpdated: "10m ago",
  },
  {
    id: "peak",
    name: "Peak Hour Management",
    description: "Dynamic scheduling for peak hour traffic management",
    status: "completed",
    type: "peak-hour",
    metrics: {
      delay: 15.2,
      throughput: 260,
      fuelEfficiency: 82,
      capacity: 88,
      reliability: 96,
    },
    improvements: {
      delay: -17.8,
      throughput: 6.1,
      fuelEfficiency: 5.1,
      capacity: 7.3,
    },
    lastUpdated: "15m ago",
  },
]

export function DigitalTwinSimulation() {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>(mockScenarios)
  const [selectedScenario, setSelectedScenario] = useState("current")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-blue-500"
      case "running":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "delay":
        return <Activity className="h-4 w-4" />
      case "throughput":
        return <TrendingUp className="h-4 w-4" />
      case "fuelEfficiency":
        return <Zap className="h-4 w-4" />
      case "capacity":
        return <Gauge className="h-4 w-4" />
      case "reliability":
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatImprovement = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getImprovementColor = (value: number, metric: string) => {
    const isPositive = metric === "delay" ? value < 0 : value > 0
    return isPositive ? "text-green-600" : "text-red-600"
  }

  const runSimulation = (scenarioId: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => (scenario.id === scenarioId ? { ...scenario, status: "running" as const } : scenario)),
    )

    // Simulate running for 3 seconds
    setTimeout(() => {
      setScenarios((prev) =>
        prev.map((scenario) => (scenario.id === scenarioId ? { ...scenario, status: "completed" as const } : scenario)),
      )
    }, 3000)
  }

  const currentScenario = scenarios.find((s) => s.id === selectedScenario)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Digital Twin Simulation
        </CardTitle>
        <CardDescription>Real-time network simulation and optimization scenarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Scenario Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedScenario === scenario.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{scenario.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(scenario.status)}`} />
                    <Badge variant="outline" className="text-xs capitalize">
                      {scenario.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>{scenario.metrics.delay} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{scenario.metrics.throughput}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{scenario.metrics.fuelEfficiency}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>{scenario.metrics.reliability}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-muted-foreground">Updated {scenario.lastUpdated}</span>
                  <Button
                    size="sm"
                    variant={scenario.status === "ready" ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (scenario.status === "ready") runSimulation(scenario.id)
                    }}
                    disabled={scenario.status === "running"}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Current Scenario Details */}
          {currentScenario && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentScenario.name}</h3>
                <Badge className={`${getStatusColor(currentScenario.status)} text-white`}>
                  {currentScenario.status}
                </Badge>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(currentScenario.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getMetricIcon(key)}
                      <span className="text-2xl font-bold">
                        {key === "delay" ? value : key === "throughput" ? value : `${value}%`}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key === "fuelEfficiency" ? "Fuel Eff." : key}
                      {key === "delay" && " (min)"}
                    </div>
                    {currentScenario.improvements &&
                      currentScenario.improvements[key as keyof typeof currentScenario.improvements] && (
                        <div
                          className={`text-xs font-medium ${getImprovementColor(currentScenario.improvements[key as keyof typeof currentScenario.improvements], key)}`}
                        >
                          {formatImprovement(
                            currentScenario.improvements[key as keyof typeof currentScenario.improvements],
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Charts */}
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
                  <TabsTrigger value="routes">Route Optimization</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current" />
                        <Line type="monotone" dataKey="optimized" stroke="#22c55e" name="Optimized" />
                        <Line type="monotone" dataKey="peakHour" stroke="#3b82f6" name="Peak Hour" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="routes" className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={routeOptimizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="route" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="current" fill="#ef4444" name="Current" />
                        <Bar dataKey="optimized" fill="#22c55e" name="Optimized" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
