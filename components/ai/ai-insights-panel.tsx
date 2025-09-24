"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, AlertTriangle, Zap, RefreshCw } from "lucide-react"

interface AIInsight {
  type: "maintenance" | "traffic" | "performance" | "incident"
  title: string
  description: string
  confidence: number
  priority: "low" | "medium" | "high" | "urgent"
  recommendations: string[]
}

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [performanceInsights, setPerformanceInsights] = useState<string>("")

  const fetchInsights = async () => {
    setLoading(true)
    try {
      // Fetch performance insights
      const performanceResponse = await fetch("/api/ai/performance-insights")
      if (performanceResponse.ok) {
        const { insights: perfInsights } = await performanceResponse.json()
        setPerformanceInsights(perfInsights)
      }

      // Fetch maintenance recommendations
      const maintenanceResponse = await fetch("/api/ai/maintenance-recommendations", {
        method: "POST",
      })
      if (maintenanceResponse.ok) {
        const { recommendations } = await maintenanceResponse.json()
        const maintenanceInsights: AIInsight[] = recommendations.map((rec: any) => ({
          type: "maintenance",
          title: `${rec.equipmentType} Maintenance Alert`,
          description: rec.reasoning,
          confidence: rec.confidence,
          priority: rec.riskLevel === "critical" ? "urgent" : rec.riskLevel,
          recommendations: rec.recommendations.map((r: any) => r.action),
        }))
        setInsights((prev) => [...prev, ...maintenanceInsights])
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />
      case "traffic":
        return <TrendingUp className="h-4 w-4" />
      case "performance":
        return <Zap className="h-4 w-4" />
      case "incident":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Insights
          </CardTitle>
          <CardDescription>AI-powered analytics and recommendations</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInsights} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(insight.type)}
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="space-y-1">
                      <h5 className="text-xs font-medium text-muted-foreground">Recommendations:</h5>
                      {insight.recommendations.map((rec, recIndex) => (
                        <div key={recIndex} className="text-xs bg-muted p-2 rounded">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No insights available</div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {performanceInsights ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{performanceInsights}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No performance insights available</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
