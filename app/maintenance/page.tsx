import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MaintenanceOverview } from "@/components/maintenance/maintenance-overview"
import { EquipmentHealth } from "@/components/maintenance/equipment-health"
import { MaintenanceSchedule } from "@/components/maintenance/maintenance-schedule"
import { PredictiveAnalytics } from "@/components/maintenance/predictive-analytics"
import { MaintenanceAlerts } from "@/components/maintenance/maintenance-alerts"
import { WorkOrderManagement } from "@/components/maintenance/work-order-management"
import { ResponsiveAdLayout } from "@/components/ads/responsive-ad-layout"
import { RailwayAnalyticsProvider } from "@/components/analytics/railway-analytics-provider"
import { AIWorkOrderQueue } from "@/components/maintenance/ai-work-order-queue"

export default function MaintenancePage() {
  return (
    <RailwayAnalyticsProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Predictive Maintenance</h1>
              <p className="text-muted-foreground">AI-powered maintenance optimization and scheduling</p>
            </div>
          </div>

          <ResponsiveAdLayout section="maintenance">
            <div className="space-y-6">
              <AIWorkOrderQueue />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <MaintenanceOverview />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
                    <MaintenanceAlerts />
                  </Suspense>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <EquipmentHealth />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <PredictiveAnalytics />
                </Suspense>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <MaintenanceSchedule />
                </Suspense>
                <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded-lg" />}>
                  <WorkOrderManagement />
                </Suspense>
              </div>
            </div>
          </ResponsiveAdLayout>
        </main>
      </div>
    </RailwayAnalyticsProvider>
  )
}
