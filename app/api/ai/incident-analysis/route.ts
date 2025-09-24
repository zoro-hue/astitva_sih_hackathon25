import { type NextRequest, NextResponse } from "next/server"
import { grokAI } from "@/lib/ai/grok-service"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Fetch incident data from Supabase
    const { data: incidents, error } = await supabase
      .from("incidents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch incident data" }, { status: 500 })
    }

    // Generate AI analysis
    const result = await grokAI.generateIncidentAnalysis(incidents)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ analysis: result.data })
  } catch (error) {
    console.error("Error in incident analysis API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
