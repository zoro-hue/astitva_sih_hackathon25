"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Wrench, Route, AlertCircle } from "lucide-react"

interface SmartRecommendation {
  id: string
  type: "maintenance" | "traffic" | "efficiency" | "safety"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  confidence: number
  estimatedSavings?: string
  implementationTime?: string
}

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI-generated recommendations
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: "1",
        type: "maintenance",
        title: "Preventive Maintenance for Track Section A-12",
        description: "AI analysis indicates potential rail wear issues. Recommend inspection within 7 days.",
        impact: "high",
        confidence: 87,
        estimatedSavings: "₹2.5L",
        implementationTime: "2 days",
      },
      {
        id: "2",
        type: "traffic",
        title: "Optimize Peak Hour Scheduling",
        description: "Redistribute 3 trains during 8-10 AM slot to reduce congestion by 23%.",
        impact: "medium",
        confidence: 92,
        estimatedSavings: "15 min avg delay reduction",
        implementationTime: "1 day",
      },
      {
        id: "3",
        type: "efficiency",
        title: "Energy Optimization Route B-7",
        description: "Adjust speed profiles to reduce energy consumption by 12% without affecting schedule.",
        impact: "medium",
        confidence: 78,
        estimatedSavings: "₹1.2L/month",
        implementationTime: "3 days",
      },
      {
        id: "4",
        type: "safety",
        title: "Signal System Upgrade Priority",
        description: "Junction J-15 shows pattern indicating potential signal failure risk.",
        impact: "high",
        confidence: 95,
        estimatedSavings: "Risk mitigation",
        implementationTime: "5 days",
      },
    ]

    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1500)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "traffic":
        return <Route className="h-4 w-4" />
      case "efficiency":
        return <TrendingUp className="h-4 w-4" />
      case "safety":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "text-orange-500"
      case "traffic":
        return "text-blue-500"
      case "efficiency":
        return "text-green-500"
      case "safety":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>AI-powered insights and optimization suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={getTypeColor(rec.type)}>{getTypeIcon(rec.type)}</span>
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getImpactColor(rec.impact)}>{rec.impact} impact</Badge>
                  <Badge variant="outline">{rec.confidence}% confidence</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{rec.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {rec.estimatedSavings && <span>Savings: {rec.estimatedSavings}</span>}
                  {rec.implementationTime && <span>Time: {rec.implementationTime}</span>}
                </div>
                <Button size="sm" variant="outline">
                  Implement
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
