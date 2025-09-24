"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Target, Filter, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"

interface PerformanceMetric {
  route: string
  onTimePercent: number
  capacityPercent: number
  delayReduction: number
  maintenancePercent: number
  revenueImpact: number
  status: "excellent" | "good" | "needs-attention"
  predicted: {
    onTimePercent: number
    capacityPercent: number
    delayReduction: number
    maintenancePercent: number
    revenueImpact: number
  }
  variance: {
    onTimePercent: number
    capacityPercent: number
    delayReduction: number
    maintenancePercent: number
    revenueImpact: number
  }
}

const performanceData: PerformanceMetric[] = [
  {
    route: "Mumbai-Pune Corridor",
    onTimePercent: 94.2,
    capacityPercent: 87.5,
    delayReduction: 32.1,
    maintenancePercent: 91.8,
    revenueImpact: 2.4,
    status: "excellent",
    predicted: {
      onTimePercent: 92.5,
      capacityPercent: 85.2,
      delayReduction: 30.8,
      maintenancePercent: 89.4,
      revenueImpact: 2.2,
    },
    variance: {
      onTimePercent: 1.7,
      capacityPercent: 2.3,
      delayReduction: 1.3,
      maintenancePercent: 2.4,
      revenueImpact: 0.2,
    },
  },
  {
    route: "Delhi-Jaipur Route",
    onTimePercent: 89.7,
    capacityPercent: 82.3,
    delayReduction: 28.9,
    maintenancePercent: 88.4,
    revenueImpact: 1.8,
    status: "good",
    predicted: {
      onTimePercent: 87.2,
      capacityPercent: 80.1,
      delayReduction: 26.5,
      maintenancePercent: 86.8,
      revenueImpact: 1.6,
    },
    variance: {
      onTimePercent: 2.5,
      capacityPercent: 2.2,
      delayReduction: 2.4,
      maintenancePercent: 1.6,
      revenueImpact: 0.2,
    },
  },
  {
    route: "Chennai-Bangalore Line",
    onTimePercent: 91.5,
    capacityPercent: 85.1,
    delayReduction: 25.7,
    maintenancePercent: 93.2,
    revenueImpact: 2.1,
    status: "excellent",
    predicted: {
      onTimePercent: 89.8,
      capacityPercent: 83.4,
      delayReduction: 24.2,
      maintenancePercent: 91.5,
      revenueImpact: 1.9,
    },
    variance: {
      onTimePercent: 1.7,
      capacityPercent: 1.7,
      delayReduction: 1.5,
      maintenancePercent: 1.7,
      revenueImpact: 0.2,
    },
  },
  {
    route: "Kolkata-Bhubaneswar",
    onTimePercent: 86.3,
    capacityPercent: 79.8,
    delayReduction: 22.4,
    maintenancePercent: 85.9,
    revenueImpact: 1.2,
    status: "needs-attention",
    predicted: {
      onTimePercent: 88.1,
      capacityPercent: 81.2,
      delayReduction: 24.8,
      maintenancePercent: 87.3,
      revenueImpact: 1.4,
    },
    variance: {
      onTimePercent: -1.8,
      capacityPercent: -1.4,
      delayReduction: -2.4,
      maintenancePercent: -1.4,
      revenueImpact: -0.2,
    },
  },
  {
    route: "Ahmedabad-Surat Express",
    onTimePercent: 92.8,
    capacityPercent: 88.9,
    delayReduction: 30.5,
    maintenancePercent: 90.7,
    revenueImpact: 2.7,
    status: "excellent",
    predicted: {
      onTimePercent: 91.2,
      capacityPercent: 87.1,
      delayReduction: 29.1,
      maintenancePercent: 89.2,
      revenueImpact: 2.5,
    },
    variance: {
      onTimePercent: 1.6,
      capacityPercent: 1.8,
      delayReduction: 1.4,
      maintenancePercent: 1.5,
      revenueImpact: 0.2,
    },
  },
  {
    route: "Hyderabad-Vijayawada",
    onTimePercent: 88.1,
    capacityPercent: 81.4,
    delayReduction: 26.8,
    maintenancePercent: 87.3,
    revenueImpact: 1.6,
    status: "good",
    predicted: {
      onTimePercent: 86.5,
      capacityPercent: 79.8,
      delayReduction: 25.2,
      maintenancePercent: 85.7,
      revenueImpact: 1.4,
    },
    variance: {
      onTimePercent: 1.6,
      capacityPercent: 1.6,
      delayReduction: 1.6,
      maintenancePercent: 1.6,
      revenueImpact: 0.2,
    },
  },
]

const trendData = [
  { month: "Jan", predicted: 88.5, actual: 89.2, variance: 0.7 },
  { month: "Feb", predicted: 89.1, actual: 87.8, variance: -1.3 },
  { month: "Mar", predicted: 90.2, actual: 91.5, variance: 1.3 },
  { month: "Apr", predicted: 91.8, actual: 90.4, variance: -1.4 },
  { month: "May", predicted: 92.5, actual: 93.1, variance: 0.6 },
  { month: "Jun", predicted: 93.2, actual: 92.8, variance: -0.4 },
]

export function PerformanceBenchmarking() {
  const [selectedMetric, setSelectedMetric] = useState<keyof PerformanceMetric>("onTimePercent")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "needs-attention":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "needs-attention":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getVarianceColor = (variance: number) => {
    return variance >= 0 ? "text-green-600" : "text-red-600"
  }

  const getVarianceIcon = (variance: number) => {
    return variance >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const formatMetric = (value: number, metric: string) => {
    if (metric === "revenueImpact") return `₹${value}Cr`
    return `${value}%`
  }

  const filteredData = performanceData.filter((item) => filterStatus === "all" || item.status === filterStatus)

  const scatterData = performanceData.map((item) => ({
    name: item.route,
    predicted: item.predicted[selectedMetric],
    actual: item[selectedMetric],
    status: item.status,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Benchmarking
            </CardTitle>
            <CardDescription>Predicted vs Actual outcomes with AI algorithm analysis</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Section-wise Performance</TabsTrigger>
            <TabsTrigger value="trends">Prediction Accuracy</TabsTrigger>
            <TabsTrigger value="analysis">Variance Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Status
              </Button>
              <Button
                variant={filterStatus === "excellent" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("excellent")}
              >
                Excellent
              </Button>
              <Button
                variant={filterStatus === "good" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("good")}
              >
                Good
              </Button>
              <Button
                variant={filterStatus === "needs-attention" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("needs-attention")}
              >
                Needs Attention
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Section/Route</th>
                    <th className="text-center p-3">On-Time %</th>
                    <th className="text-center p-3">Capacity %</th>
                    <th className="text-center p-3">Delay Reduction %</th>
                    <th className="text-center p-3">Maintenance %</th>
                    <th className="text-center p-3">Revenue Impact</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{item.route}</td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          <div>{item.onTimePercent}%</div>
                          <div
                            className={`text-xs flex items-center justify-center gap-1 ${getVarianceColor(item.variance.onTimePercent)}`}
                          >
                            {getVarianceIcon(item.variance.onTimePercent)}
                            {Math.abs(item.variance.onTimePercent).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          <div>{item.capacityPercent}%</div>
                          <div
                            className={`text-xs flex items-center justify-center gap-1 ${getVarianceColor(item.variance.capacityPercent)}`}
                          >
                            {getVarianceIcon(item.variance.capacityPercent)}
                            {Math.abs(item.variance.capacityPercent).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          <div>{item.delayReduction}%</div>
                          <div
                            className={`text-xs flex items-center justify-center gap-1 ${getVarianceColor(item.variance.delayReduction)}`}
                          >
                            {getVarianceIcon(item.variance.delayReduction)}
                            {Math.abs(item.variance.delayReduction).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          <div>{item.maintenancePercent}%</div>
                          <div
                            className={`text-xs flex items-center justify-center gap-1 ${getVarianceColor(item.variance.maintenancePercent)}`}
                          >
                            {getVarianceIcon(item.variance.maintenancePercent)}
                            {Math.abs(item.variance.maintenancePercent).toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <div className="space-y-1">
                          <div>₹{item.revenueImpact}Cr</div>
                          <div
                            className={`text-xs flex items-center justify-center gap-1 ${getVarianceColor(item.variance.revenueImpact)}`}
                          >
                            {getVarianceIcon(item.variance.revenueImpact)}₹
                            {Math.abs(item.variance.revenueImpact).toFixed(1)}Cr
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant={getStatusBadgeVariant(item.status)} className="capitalize">
                          {item.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Analyze
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="predicted" stroke="#3b82f6" name="Predicted" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="actual" stroke="#22c55e" name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">92.3%</div>
                  <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">±1.2%</div>
                  <div className="text-sm text-muted-foreground">Avg Variance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">0.8%</div>
                  <div className="text-sm text-muted-foreground">Model Drift</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={selectedMetric === "onTimePercent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("onTimePercent")}
              >
                On-Time %
              </Button>
              <Button
                variant={selectedMetric === "capacityPercent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("capacityPercent")}
              >
                Capacity %
              </Button>
              <Button
                variant={selectedMetric === "delayReduction" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("delayReduction")}
              >
                Delay Reduction %
              </Button>
              <Button
                variant={selectedMetric === "revenueImpact" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("revenueImpact")}
              >
                Revenue Impact
              </Button>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="predicted" name="Predicted" />
                  <YAxis dataKey="actual" name="Actual" />
                  <Tooltip />
                  <Scatter dataKey="actual" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
