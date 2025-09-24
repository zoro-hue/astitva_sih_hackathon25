import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardGrid } from "@/components/dashboard/dashboard-grid"
import { RealTimeMonitor } from "@/components/monitoring/real-time-monitor"
import { TrainStatusOverview } from "@/components/monitoring/train-status-overview"
import { NetworkTopology } from "@/components/monitoring/network-topology"
import { PerformanceMetrics } from "@/components/monitoring/performance-metrics"
import { IncidentAlerts } from "@/components/monitoring/incident-alerts"
import { TrafficHeatMap } from "@/components/monitoring/traffic-heat-map"
import { AIInsightsPanel } from "@/components/ai/ai-insights-panel"
import { ResponsiveAdLayout } from "@/components/ads/responsive-ad-layout"
import { RailwayAnalyticsProvider } from "@/components/analytics/railway-analytics-provider"
import { PriorityAlertsPanel } from "@/components/control-center/priority-alerts-panel"
import { ActiveIncidentsTable } from "@/components/control-center/active-incidents-table"
import { RealisticTrackMap } from "@/components/monitoring/realistic-track-map"
import { InteractiveRoutePlanner } from "@/components/monitoring/interactive-route-planner"

export default function OperationsControlCenter() {
  return (
    <RailwayAnalyticsProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6">
          <ResponsiveAdLayout section="dashboard">
            <div className="space-y-6">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <PriorityAlertsPanel />
              </Suspense>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <RealTimeMonitor />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <TrainStatusOverview />
                  </Suspense>
                </div>
              </div>

              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <ActiveIncidentsTable />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <InteractiveRoutePlanner />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <RealisticTrackMap />
              </Suspense>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                    <AIInsightsPanel />
                  </Suspense>
                </div>
              </div>

              <DashboardGrid>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <NetworkTopology />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <PerformanceMetrics />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <IncidentAlerts />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <TrafficHeatMap />
                </Suspense>
              </DashboardGrid>
            </div>
          </ResponsiveAdLayout>
        </main>
      </div>
    </RailwayAnalyticsProvider>
  )
}
