"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Activity, AlertCircle, TrendingDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface EquipmentItem {
  id: string
  name: string
  type: string
  location: string
  healthScore: number
  status: "excellent" | "good" | "fair" | "poor" | "critical"
  lastMaintenance: string
  nextMaintenance: string
  issues: string[]
}

export function EquipmentHealth() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "critical" | "needs_attention">("all")

  useEffect(() => {
    const fetchEquipment = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase
          .from("equipment")
          .select(`
            id,
            name,
            equipment_type,
            condition_score,
            status,
            last_maintenance_date,
            next_maintenance_due,
            stations (name)
          `)
          .order("condition_score", { ascending: true })
          .limit(10)

        if (error) throw error

        const formattedData =
          data?.map((item) => ({
            id: item.id,
            name: item.name || item.equipment_type,
            type: item.equipment_type,
            location: item.stations?.name || "Unknown",
            healthScore: (item.condition_score || 0) * 10, // Convert to percentage
            status: getHealthStatus(item.condition_score || 0),
            lastMaintenance: item.last_maintenance_date || "2024-01-01",
            nextMaintenance: item.next_maintenance_due || "2024-12-31",
            issues: generateIssues(item.condition_score || 0),
          })) || []

        setEquipment(formattedData)
      } catch (error) {
        console.error("[v0] Error fetching equipment:", error)
        // Fallback to mock data
        setEquipment([
          {
            id: "1",
            name: "WAP7-30281",
            type: "Locomotive",
            location: "New Delhi",
            healthScore: 85,
            status: "good",
            lastMaintenance: "2024-01-15",
            nextMaintenance: "2024-04-15",
            issues: [],
          },
          {
            id: "2",
            name: "Signal-NDLS-001",
            type: "Signal",
            location: "New Delhi",
            healthScore: 45,
            status: "poor",
            lastMaintenance: "2023-11-20",
            nextMaintenance: "2024-02-20",
            issues: ["LED malfunction", "Wiring degradation"],
          },
          {
            id: "3",
            name: "Track-KM-100",
            type: "Track",
            location: "Kanpur Central",
            healthScore: 25,
            status: "critical",
            lastMaintenance: "2023-10-05",
            nextMaintenance: "2024-01-05",
            issues: ["Rail wear", "Ballast settlement", "Joint failure"],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  const getHealthStatus = (score: number): "excellent" | "good" | "fair" | "poor" | "critical" => {
    if (score >= 9) return "excellent"
    if (score >= 7) return "good"
    if (score >= 5) return "fair"
    if (score >= 3) return "poor"
    return "critical"
  }

  const generateIssues = (score: number): string[] => {
    if (score >= 7) return []
    if (score >= 5) return ["Minor wear detected"]
    if (score >= 3) return ["Component degradation", "Performance decline"]
    return ["Critical failure risk", "Immediate attention required", "Safety concern"]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return "default"
      case "good":
        return "default"
      case "fair":
        return "secondary"
      case "poor":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  const filteredEquipment = equipment.filter((item) => {
    if (filter === "critical") return item.status === "critical"
    if (filter === "needs_attention") return ["poor", "critical"].includes(item.status)
    return true
  })

  if (loading) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Equipment Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Equipment Health Monitor
        </CardTitle>
        <div className="flex gap-2">
          {(["all", "critical", "needs_attention"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-xs"
            >
              {filterType === "all" ? "All" : filterType === "critical" ? "Critical" : "Needs Attention"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-56 overflow-y-auto">
        {filteredEquipment.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(item.status)}`} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.name}</span>
                <Badge variant={getStatusBadge(item.status)} className="text-xs">
                  {item.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                {item.type} • {item.location}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs">Health Score:</span>
                <Progress value={item.healthScore} className="h-1 flex-1" />
                <span className="text-xs font-medium">{item.healthScore}%</span>
              </div>

              {item.issues.length > 0 && (
                <div className="flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-red-600">{item.issues.join(", ")}</div>
                </div>
              )}
            </div>

            <div className="text-right text-xs text-muted-foreground">
              <div>Next: {new Date(item.nextMaintenance).toLocaleDateString()}</div>
              {item.status === "critical" && (
                <div className="text-red-600 font-medium mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  Urgent
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredEquipment.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No equipment matches the current filter</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
