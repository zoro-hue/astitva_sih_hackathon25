"use client"

import type React from "react"

import { RailwayAdBanner, RailwayAdSlots } from "./railway-ad-banner"
import { useEffect, useState } from "react"

interface ResponsiveAdLayoutProps {
  section: "dashboard" | "maintenance" | "traffic" | "incidents"
  children: React.ReactNode
}

export function ResponsiveAdLayout({ section, children }: ResponsiveAdLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getAdSlot = () => {
    switch (section) {
      case "maintenance":
        return RailwayAdSlots.MAINTENANCE_SECTION
      case "traffic":
        return RailwayAdSlots.TRAFFIC_SECTION
      case "incidents":
        return RailwayAdSlots.INCIDENT_SECTION
      default:
        return RailwayAdSlots.DASHBOARD_SIDEBAR
    }
  }

  return (
    <div className="space-y-6">
      {/* Top banner ad for mobile */}
      {isMobile && <RailwayAdBanner slot={RailwayAdSlots.DASHBOARD_HEADER} format="horizontal" className="w-full" />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">{children}</div>

        {/* Sidebar ads for desktop */}
        {!isMobile && (
          <div className="space-y-6">
            <RailwayAdBanner slot={getAdSlot()} format="vertical" className="sticky top-6" />

            {/* Additional sidebar ad */}
            <RailwayAdBanner slot={RailwayAdSlots.AI_INSIGHTS_SECTION} format="rectangle" />
          </div>
        )}
      </div>

      {/* Bottom banner ad for mobile */}
      {isMobile && <RailwayAdBanner slot={RailwayAdSlots.DASHBOARD_SIDEBAR} format="horizontal" className="w-full" />}
    </div>
  )
}
