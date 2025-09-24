import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { RailwayAnalyticsProvider } from "@/components/analytics/railway-analytics-provider"
import { PerformanceBenchmarking } from "@/components/analytics/performance-benchmarking"
import { RailwayKPIDashboard } from "@/components/analytics/railway-kpi-dashboard"

export default function AnalyticsPage() {
  return (
    <RailwayAnalyticsProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track performance, revenue, and operational efficiency</p>
            </div>
          </div>

          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <RailwayKPIDashboard />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <PerformanceBenchmarking />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <AnalyticsDashboard />
          </Suspense>
        </main>
      </div>
    </RailwayAnalyticsProvider>
  )
}
