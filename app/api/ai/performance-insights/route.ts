import { type NextRequest, NextResponse } from "next/server"
import { grokAI } from "@/lib/ai/grok-service"

function generateMockPerformanceData() {
  const now = new Date()
  const mockMetrics = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    timestamp: new Date(now.getTime() - i * 300000).toISOString(), // 5 min intervals
    on_time_percentage: Math.random() * 20 + 80, // 80-100%
    average_delay: Math.random() * 10 + 2, // 2-12 minutes
    passenger_satisfaction: Math.random() * 20 + 80, // 80-100%
    energy_efficiency: Math.random() * 15 + 85, // 85-100%
    route_id: `R${Math.floor(Math.random() * 5) + 1}`,
  }))

  const mockTracking = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    train_id: `T${Math.floor(Math.random() * 10) + 1}`,
    route_id: `R${Math.floor(Math.random() * 5) + 1}`,
    current_station: `Station ${Math.floor(Math.random() * 8) + 1}`,
    status: ["on_time", "delayed", "early"][Math.floor(Math.random() * 3)],
    delay_minutes: Math.random() * 15,
    timestamp: new Date(now.getTime() - i * 60000).toISOString(),
    speed: Math.random() * 40 + 60, // 60-100 km/h
    passenger_count: Math.floor(Math.random() * 200) + 50,
  }))

  const mockIncidents = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    type: ["signal_failure", "track_maintenance", "weather", "equipment_issue"][Math.floor(Math.random() * 4)],
    severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    location: `Station ${Math.floor(Math.random() * 8) + 1}`,
    description: `Mock incident ${i + 1} description`,
    status: ["active", "resolved"][Math.floor(Math.random() * 2)],
    created_at: new Date(now.getTime() - i * 3600000).toISOString(), // 1 hour intervals
    estimated_resolution: new Date(now.getTime() + Math.random() * 7200000).toISOString(),
  }))

  return {
    metrics: mockMetrics,
    tracking: mockTracking,
    incidents: mockIncidents,
    timestamp: now.toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    let performanceData

    try {
      const { createServerClient } = await import("@/lib/supabase/server")
      const supabase = await createServerClient()

      // Fetch performance data from multiple tables
      const [{ data: performanceMetrics }, { data: trainTracking }, { data: incidents }] = await Promise.all([
        supabase.from("performance_metrics").select("*").order("timestamp", { ascending: false }).limit(50),
        supabase.from("train_tracking").select("*").order("timestamp", { ascending: false }).limit(100),
        supabase.from("incidents").select("*").order("created_at", { ascending: false }).limit(20),
      ])

      performanceData = {
        metrics: performanceMetrics,
        tracking: trainTracking,
        incidents: incidents,
        timestamp: new Date().toISOString(),
      }
    } catch (supabaseError) {
      console.log("Supabase not configured, using mock data for performance insights")
      performanceData = generateMockPerformanceData()
    }

    // Generate AI insights
    const result = await grokAI.generatePerformanceInsights(performanceData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ insights: result.data })
  } catch (error) {
    console.error("Error in performance insights API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
