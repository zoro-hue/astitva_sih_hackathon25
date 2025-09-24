// Google Analytics 4 configuration for railway management system
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"

// Custom event types for railway operations
export interface RailwayAnalyticsEvent {
  action: string
  category: "dashboard" | "maintenance" | "traffic" | "incidents" | "ai_insights"
  label?: string
  value?: number
  custom_parameters?: {
    train_id?: string
    route_id?: string
    station_id?: string
    equipment_id?: string
    incident_type?: string
    ai_confidence?: number
    optimization_type?: string
  }
}

// Track railway-specific events
export const trackRailwayEvent = (event: RailwayAnalyticsEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    })
  }
}

// Predefined railway events
export const RailwayEvents = {
  // Dashboard interactions
  DASHBOARD_VIEW: (section: string) =>
    trackRailwayEvent({
      action: "view_dashboard_section",
      category: "dashboard",
      label: section,
    }),

  REAL_TIME_MONITOR_INTERACTION: (action: string, trainId?: string) =>
    trackRailwayEvent({
      action: "real_time_monitor_interaction",
      category: "dashboard",
      label: action,
      custom_parameters: { train_id: trainId },
    }),

  // Maintenance events
  MAINTENANCE_ALERT_VIEWED: (equipmentId: string, severity: string) =>
    trackRailwayEvent({
      action: "maintenance_alert_viewed",
      category: "maintenance",
      label: severity,
      custom_parameters: { equipment_id: equipmentId },
    }),

  MAINTENANCE_SCHEDULED: (equipmentId: string, type: string) =>
    trackRailwayEvent({
      action: "maintenance_scheduled",
      category: "maintenance",
      label: type,
      custom_parameters: { equipment_id: equipmentId },
    }),

  PREDICTIVE_MAINTENANCE_TRIGGERED: (equipmentId: string, confidence: number) =>
    trackRailwayEvent({
      action: "predictive_maintenance_triggered",
      category: "maintenance",
      custom_parameters: { equipment_id: equipmentId, ai_confidence: confidence },
    }),

  // Traffic optimization events
  TRAFFIC_OPTIMIZATION_APPLIED: (routeId: string, type: string) =>
    trackRailwayEvent({
      action: "traffic_optimization_applied",
      category: "traffic",
      label: type,
      custom_parameters: { route_id: routeId, optimization_type: type },
    }),

  ROUTE_CONGESTION_VIEWED: (routeId: string, congestionLevel: string) =>
    trackRailwayEvent({
      action: "route_congestion_viewed",
      category: "traffic",
      label: congestionLevel,
      custom_parameters: { route_id: routeId },
    }),

  // Incident management
  INCIDENT_REPORTED: (incidentType: string, severity: string) =>
    trackRailwayEvent({
      action: "incident_reported",
      category: "incidents",
      label: `${incidentType}_${severity}`,
      custom_parameters: { incident_type: incidentType },
    }),

  INCIDENT_RESOLVED: (incidentType: string, resolutionTime: number) =>
    trackRailwayEvent({
      action: "incident_resolved",
      category: "incidents",
      label: incidentType,
      value: resolutionTime,
      custom_parameters: { incident_type: incidentType },
    }),

  // AI insights events
  AI_RECOMMENDATION_VIEWED: (recommendationType: string, confidence: number) =>
    trackRailwayEvent({
      action: "ai_recommendation_viewed",
      category: "ai_insights",
      label: recommendationType,
      custom_parameters: { ai_confidence: confidence },
    }),

  AI_RECOMMENDATION_IMPLEMENTED: (recommendationType: string, confidence: number) =>
    trackRailwayEvent({
      action: "ai_recommendation_implemented",
      category: "ai_insights",
      label: recommendationType,
      custom_parameters: { ai_confidence: confidence },
    }),

  PREDICTIVE_ALERT_TRIGGERED: (alertType: string, confidence: number) =>
    trackRailwayEvent({
      action: "predictive_alert_triggered",
      category: "ai_insights",
      label: alertType,
      custom_parameters: { ai_confidence: confidence },
    }),
}

// Page view tracking
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    })
  }
}

// User engagement tracking
export const trackUserEngagement = (engagementTime: number, section: string) => {
  trackRailwayEvent({
    action: "user_engagement",
    category: "dashboard",
    label: section,
    value: engagementTime,
  })
}
