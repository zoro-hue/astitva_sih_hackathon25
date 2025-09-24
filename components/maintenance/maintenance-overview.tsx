"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface MaintenanceStats {
  totalEquipment: number
  healthyEquipment: number
  needsMaintenance: number
  criticalIssues: number
  scheduledMaintenance: number
  completedToday: number
}

interface MaintenanceData {
  category: string
  scheduled: number
  completed: number
  overdue: number
}

export function MaintenanceOverview() {
  const [stats, setStats] = useState<MaintenanceStats>({
    totalEquipment: 0,
    healthyEquipment: 0,
    needsMaintenance: 0,
    criticalIssues: 0,
    scheduledMaintenance: 0,
    completedToday: 0,
  })

  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from Supabase
    setStats({
      totalEquipment: 1247,
      healthyEquipment: 1089,
      needsMaintenance: 134,
      criticalIssues: 24,
      scheduledMaintenance: 67,
      completedToday: 23,
    })

    setMaintenanceData([
      { category: "Locomotives", scheduled: 15, completed: 12, overdue: 2 },
      { category: "Coaches", scheduled: 28, completed: 18, overdue: 5 },
      { category: "Signals", scheduled: 12, completed: 8, overdue: 1 },
      { category: "Tracks", scheduled: 8, completed: 6, overdue: 0 },
      { category: "Power Systems", scheduled: 4, completed: 3, overdue: 1 },
    ])
  }, [])

  const healthPercentage = (stats.healthyEquipment / stats.totalEquipment) * 100
  const pieData = [
    { name: "Healthy", value: stats.healthyEquipment, color: "#22c55e" },
    { name: "Needs Maintenance", value: stats.needsMaintenance, color: "#f59e0b" },
    { name: "Critical", value: stats.criticalIssues, color: "#ef4444" },
  ]

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Maintenance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.totalEquipment}</div>
            <div className="text-xs text-muted-foreground">Total Equipment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.healthyEquipment}</div>
            <div className="text-xs text-muted-foreground">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsMaintenance}</div>
            <div className="text-xs text-muted-foreground">Needs Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.criticalIssues}</div>
            <div className="text-xs text-muted-foreground">Critical Issues</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Equipment Health</span>
                <span className="text-sm text-muted-foreground">{healthPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={healthPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Completed Today</span>
                </div>
                <Badge variant="outline">{stats.completedToday}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Scheduled</span>
                </div>
                <Badge variant="outline">{stats.scheduledMaintenance}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Critical Issues</span>
                </div>
                <Badge variant="destructive">{stats.criticalIssues}</Badge>
              </div>
            </div>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
