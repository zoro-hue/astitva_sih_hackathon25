import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TrafficOverview } from "@/components/traffic/traffic-overview"
import { RouteOptimization } from "@/components/traffic/route-optimization"
import { CapacityManagement } from "@/components/traffic/capacity-management"
import { ScheduleOptimizer } from "@/components/traffic/schedule-optimizer"
import { CongestionAnalysis } from "@/components/traffic/congestion-analysis"
import { TrafficPredictions } from "@/components/traffic/traffic-predictions"
import { ResponsiveAdLayout } from "@/components/ads/responsive-ad-layout"
import { RailwayAnalyticsProvider } from "@/components/analytics/railway-analytics-provider"
import { DigitalTwinSimulation } from "@/components/traffic/digital-twin-simulation"
import { MultiTrackOptimizationMap } from "@/components/monitoring/multi-track-optimization-map"
import { TrackThroughputAnalyzer } from "@/components/monitoring/track-throughput-analyzer"

export default function TrafficOptimizationPage() {
  return (
    <RailwayAnalyticsProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Traffic Optimization</h1>
              <p className="text-muted-foreground">AI-powered traffic flow optimization and capacity management</p>
            </div>
          </div>

          <ResponsiveAdLayout section="traffic">
            <div className="space-y-6">
              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <MultiTrackOptimizationMap />
              </Suspense>

              <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                <TrackThroughputAnalyzer />
              </Suspense>

              <DigitalTwinSimulation />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <TrafficOverview />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <TrafficPredictions />
                  </Suspense>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <RouteOptimization />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <CapacityManagement />
                </Suspense>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <ScheduleOptimizer />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <CongestionAnalysis />
                </Suspense>
              </div>
            </div>
          </ResponsiveAdLayout>
        </main>
      </div>
    </RailwayAnalyticsProvider>
  )
}
