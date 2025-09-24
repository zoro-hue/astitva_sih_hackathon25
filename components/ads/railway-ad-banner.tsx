"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface RailwayAdBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  className?: string
}

export function RailwayAdBanner({ slot, format = "auto", responsive = true, className = "" }: RailwayAdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
      try {
        // Push ad to AdSense queue
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error("AdSense error:", error)
      }
    }
  }, [])

  // Don't render ads in development
  if (process.env.NODE_ENV === "development") {
    return (
      <Card className={`p-4 bg-muted border-dashed ${className}`}>
        <div className="text-center text-sm text-muted-foreground">
          Railway Ad Banner - Slot: {slot}
          <br />
          <span className="text-xs">Ads disabled in development</span>
        </div>
      </Card>
    )
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}

// Predefined ad slots for different sections
export const RailwayAdSlots = {
  DASHBOARD_HEADER: "1234567890",
  DASHBOARD_SIDEBAR: "1234567891",
  MAINTENANCE_SECTION: "1234567892",
  TRAFFIC_SECTION: "1234567893",
  INCIDENT_SECTION: "1234567894",
  AI_INSIGHTS_SECTION: "1234567895",
}
