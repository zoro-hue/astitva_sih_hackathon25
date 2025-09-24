import type { Metadata } from "next"
import { PerformanceMetricsDashboard } from "@/components/analytics/performance-metrics-dashboard"

export const metadata: Metadata = {
  title: "Performance Metrics",
  description: "Strategic oversight and operational efficiency benchmarking",
}

export default function PerformancePage() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-2 text-pretty">Performance Analytics</h1>
      <p className="text-muted-foreground mb-6">Strategic oversight and operational efficiency benchmarking</p>
      <PerformanceMetricsDashboard />
    </main>
  )
}
