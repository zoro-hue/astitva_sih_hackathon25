import { type NextRequest, NextResponse } from "next/server"
import { grokAI } from "@/lib/ai/grok-service"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Fetch traffic data from Supabase
    const [{ data: routes }, { data: trainTracking }, { data: stations }] = await Promise.all([
      supabase.from("routes").select("*"),
      supabase.from("train_tracking").select("*").order("timestamp", { ascending: false }).limit(200),
      supabase.from("stations").select("*"),
    ])

    const trafficData = {
      routes: routes,
      tracking: trainTracking,
      stations: stations,
      timestamp: new Date().toISOString(),
    }

    // Generate AI optimization suggestions
    const result = await grokAI.generateTrafficOptimization(trafficData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ optimizations: result.data })
  } catch (error) {
    console.error("Error in traffic optimization API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
