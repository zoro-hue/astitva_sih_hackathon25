import { type NextRequest, NextResponse } from "next/server"
import { grokAI } from "@/lib/ai/grok-service"

function generateMockEquipmentData() {
  const equipmentTypes = ["locomotive", "passenger_car", "signal_system", "track_switch", "power_system"]
  const statuses = ["operational", "maintenance_due", "critical", "under_repair"]

  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Equipment ${i + 1}`,
    type: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    location: `Station ${Math.floor(Math.random() * 8) + 1}`,
    last_maintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    next_maintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    condition_score: Math.random() * 40 + 60, // 60-100%
    usage_hours: Math.floor(Math.random() * 1000) + 500,
    maintenance_records: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      id: j + 1,
      equipment_id: i + 1,
      type: ["routine", "repair", "inspection"][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      cost: Math.floor(Math.random() * 5000) + 500,
      description: `Maintenance record ${j + 1} for equipment ${i + 1}`,
    })),
  }))
}

export async function POST(request: NextRequest) {
  try {
    let equipment

    try {
      const { createServerClient } = await import("@/lib/supabase/server")
      const supabase = await createServerClient()

      // Fetch equipment data from Supabase
      const { data, error } = await supabase
        .from("equipment")
        .select(`
          *,
          maintenance_records (*)
        `)
        .order("last_maintenance", { ascending: true })

      if (error) {
        throw error
      }

      equipment = data
    } catch (supabaseError) {
      console.log("Supabase not configured, using mock data for maintenance recommendations")
      equipment = generateMockEquipmentData()
    }

    // Generate AI recommendations
    const result = await grokAI.generateMaintenanceRecommendations(equipment)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ recommendations: result.data })
  } catch (error) {
    console.error("Error in maintenance recommendations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
