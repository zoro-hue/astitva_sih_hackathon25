"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Target, DollarSign, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts"

interface KPIMetric {
  title: string
  value: string
  change: number
  target: string
  status: "achieved" | "on-track" | "at-risk"
  icon: React.ReactNode
  color: string
}

const kpiMetrics: KPIMetric[] = [
  {
    title: "Revenue Impact",
    value: "₹12.4 Crores",
    change: 8.7,
    target: "₹15.0 Cr",
    status: "achieved",
    icon: <DollarSign className="h-5 w-5" />,
    color: "text-green-600",
  },
  {
    title: "Operational Efficiency",
    value: "92.4%",
    change: 5.2,
    target: "95%",
    status: "on-track",
    icon: <Target className="h-5 w-5" />,
    color: "text-blue-600",
  },
  {
    title: "Delay Reduction",
    value: "28.7%",
    change: 12.3,
    target: "30%",
    status: "at-risk",
    icon: <Clock className="h-5 w-5" />,
    color: "text-orange-600",
  },
  {
    title: "Cost Savings",
    value: "₹8.9 Crores",
    change: 2.1,
    target: "₹10.0 Cr",
    status: "on-track",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-purple-600",
  },
]

// Performance trends data over time
const performanceTrends = [
  { month: "Jan", efficiency: 88.2, delays: 32.1, revenue: 10.2, costs: 7.8 },
  { month: "Feb", efficiency: 89.5, delays: 30.8, revenue: 10.8, costs: 8.1 },
  { month: "Mar", efficiency: 90.1, delays: 29.5, revenue: 11.2, costs: 8.3 },
  { month: "Apr", efficiency: 91.3, delays: 28.9, revenue: 11.8, costs: 8.5 },
  { month: "May", efficiency: 91.8, delays: 28.2, revenue: 12.1, costs: 8.7 },
  { month: "Jun", efficiency: 92.4, delays: 28.7, revenue: 12.4, costs: 8.9 },
]

// Failure probability and maintenance data
const maintenanceData = [
  {
    equipment: "Track Section A1-A5",
    failureProbability: 15,
    nextMaintenance: "2024-10-15",
    priority: "high",
    aiPrediction: 18,
    actualCondition: 85,
  },
  {
    equipment: "Signal System B2",
    failureProbability: 8,
    nextMaintenance: "2024-10-20",
    priority: "medium",
    aiPrediction: 12,
    actualCondition: 92,
  },
  {
    equipment: "Power Grid C3",
    failureProbability: 25,
    nextMaintenance: "2024-10-10",
    priority: "critical",
    aiPrediction: 28,
    actualCondition: 75,
  },
  {
    equipment: "Bridge D4",
    failureProbability: 5,
    nextMaintenance: "2024-11-01",
    priority: "low",
    aiPrediction: 7,
    actualCondition: 95,
  },
  {
    equipment: "Station Platform E1",
    failureProbability: 12,
    nextMaintenance: "2024-10-25",
    priority: "medium",
    aiPrediction: 15,
    actualCondition: 88,
  },
]

// Optimal route data
const routeOptimizationData = [
  { route: "Tehran-Isfahan", current: 420, optimized: 385, savings: 35, efficiency: 91.7 },
  { route: "Tehran-Mashhad", current: 926, optimized: 890, savings: 36, efficiency: 96.1 },
  { route: "Isfahan-Shiraz", current: 476, optimized: 445, savings: 31, efficiency: 93.5 },
  { route: "Tehran-Tabriz", current: 736, optimized: 698, savings: 38, efficiency: 94.8 },
  { route: "Mashhad-Kerman", current: 598, optimized: 562, savings: 36, efficiency: 94.0 },
]

export function RailwayKPIDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "on-track":
        return <Target className="h-4 w-4 text-blue-600" />
      case "at-risk":
        return <XCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "achieved":
        return <Badge className="bg-green-100 text-green-800">Achieved</Badge>
      case "on-track":
        return <Badge className="bg-blue-100 text-blue-800">On Track</Badge>
      case "at-risk":
        return <Badge className="bg-orange-100 text-orange-800">At Risk</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center space-x-1 ${metric.change >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {metric.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span className="text-xs font-medium">{Math.abs(metric.change)}% vs last month</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Target: {metric.target}</span>
                    {getStatusBadge(metric.status)}
                  </div>
                </div>
                <div className={`${metric.color} opacity-20`}>{metric.icon}</div>
              </div>
              <div className="absolute top-4 right-4">{getStatusIcon(metric.status)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="maintenance">Failure Probability & Maintenance</TabsTrigger>
          <TabsTrigger value="routes">Optimal Railway Routes</TabsTrigger>
          <TabsTrigger value="savings">Savings Analytics</TabsTrigger>
        </TabsList>

        {/* Performance Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Operational Metrics Over Time</CardTitle>
              <CardDescription>Track performance trends across critical railway operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "revenue" || name === "costs") return [`₹${value} Cr`, name]
                        return [`${value}%`, name]
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#3b82f6"
                      name="Operational Efficiency"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="delays" stroke="#ef4444" name="Delay Reduction" strokeWidth={2} />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue (Cr)" strokeWidth={2} />
                    <Line type="monotone" dataKey="costs" stroke="#a855f7" name="Cost Savings (Cr)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failure Probability & Maintenance */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failure Probability & Maintenance Schedule</CardTitle>
              <CardDescription>AI-driven predictions with maintenance overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="equipment" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="failureProbability" fill="#ef4444" name="Failure Probability %" />
                      <Bar dataKey="aiPrediction" fill="#f97316" name="AI Prediction %" />
                      <Bar dataKey="actualCondition" fill="#22c55e" name="Actual Condition %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Equipment</th>
                        <th className="text-center p-3">Failure Risk</th>
                        <th className="text-center p-3">AI Prediction</th>
                        <th className="text-center p-3">Next Maintenance</th>
                        <th className="text-center p-3">Priority</th>
                        <th className="text-center p-3">Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenanceData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.equipment}</td>
                          <td className="text-center p-3">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                item.failureProbability > 20
                                  ? "bg-red-100 text-red-800"
                                  : item.failureProbability > 10
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.failureProbability}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="text-sm text-muted-foreground">{item.aiPrediction}%</span>
                          </td>
                          <td className="text-center p-3">
                            <span className="text-sm">{new Date(item.nextMaintenance).toLocaleDateString()}</span>
                          </td>
                          <td className="text-center p-3">
                            <Badge className={getPriorityColor(item.priority)} variant="outline">
                              {item.priority.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex items-center justify-center">
                              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    item.actualCondition > 90
                                      ? "bg-green-500"
                                      : item.actualCondition > 80
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${item.actualCondition}%` }}
                                />
                              </div>
                              <span className="ml-2 text-sm">{item.actualCondition}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimal Railway Routes */}
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Path for Railway Routes</CardTitle>
              <CardDescription>AI algorithm optimization showing current vs optimized routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={routeOptimizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="route" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} km`, "Distance"]} />
                      <Bar dataKey="current" fill="#ef4444" name="Current Route (km)" />
                      <Bar dataKey="optimized" fill="#22c55e" name="Optimized Route (km)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {routeOptimizationData.map((route, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{route.route}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Current:</span>
                              <span>{route.current} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Optimized:</span>
                              <span className="text-green-600">{route.optimized} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Savings:</span>
                              <span className="text-green-600 font-medium">{route.savings} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Efficiency:</span>
                              <span className="font-medium">{route.efficiency}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Savings Analytics */}
        <TabsContent value="savings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Breakdown</CardTitle>
                <CardDescription>Analysis of savings across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Fuel Optimization", value: 3.2, fill: "#3b82f6" },
                          { name: "Maintenance Efficiency", value: 2.8, fill: "#22c55e" },
                          { name: "Route Optimization", value: 1.9, fill: "#f59e0b" },
                          { name: "Energy Savings", value: 1.0, fill: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value}Cr`}
                        outerRadius={80}
                        dataKey="value"
                      ></Pie>
                      <Tooltip formatter={(value) => [`₹${value} Crores`, "Savings"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Savings Trend</CardTitle>
                <CardDescription>Track savings growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value} Crores`, "Savings"]} />
                      <Area type="monotone" dataKey="costs" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
