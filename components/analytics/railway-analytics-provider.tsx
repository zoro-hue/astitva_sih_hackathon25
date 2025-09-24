"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { RailwayEvents, trackPageView } from "@/lib/analytics/google-analytics"
import { usePathname } from "next/navigation"

interface RailwayAnalyticsContextType {
  trackEvent: typeof RailwayEvents
}

const RailwayAnalyticsContext = createContext<RailwayAnalyticsContextType | null>(null)

export function useRailwayAnalytics() {
  const context = useContext(RailwayAnalyticsContext)
  if (!context) {
    throw new Error("useRailwayAnalytics must be used within RailwayAnalyticsProvider")
  }
  return context
}

interface RailwayAnalyticsProviderProps {
  children: ReactNode
}

export function RailwayAnalyticsProvider({ children }: RailwayAnalyticsProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views
    const pageTitle = getPageTitle(pathname)
    trackPageView(window.location.href, pageTitle)
  }, [pathname])

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Operations Control Center - Dashboard"
      case "/maintenance":
        return "Predictive Maintenance System"
      case "/traffic":
        return "Traffic Optimization Center"
      default:
        return "Railway Management System"
    }
  }

  const contextValue: RailwayAnalyticsContextType = {
    trackEvent: RailwayEvents,
  }

  return <RailwayAnalyticsContext.Provider value={contextValue}>{children}</RailwayAnalyticsContext.Provider>
}
