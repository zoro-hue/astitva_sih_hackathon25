export interface Station {
  id: string
  name: string
  code: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  zone?: string
  division?: string
  created_at: string
  updated_at: string
}

export interface Route {
  id: string
  route_number: string
  name: string
  origin_station_id: string
  destination_station_id: string
  distance_km?: number
  electrified: boolean
  gauge_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface Train {
  id: string
  train_number: string
  name: string
  type: string
  route_id?: string
  total_coaches?: number
  max_speed?: number
  current_status: string
  current_location?: any
  last_updated: string
  created_at: string
  updated_at: string
}

export interface TrainTracking {
  id: string
  train_id: string
  current_station_id?: string
  next_station_id?: string
  latitude?: number
  longitude?: number
  speed_kmh?: number
  delay_minutes: number
  status: string
  timestamp: string
  created_at: string
}

export interface Equipment {
  id: string
  equipment_type: string
  equipment_id: string
  name?: string
  location_station_id?: string
  manufacturer?: string
  model?: string
  year_manufactured?: number
  last_maintenance_date?: string
  next_maintenance_due?: string
  condition_score?: number
  status: string
  specifications?: any
  created_at: string
  updated_at: string
}

export interface Incident {
  id: string
  incident_type: string
  severity: string
  title: string
  description?: string
  location_station_id?: string
  affected_train_id?: string
  affected_equipment_id?: string
  reported_by?: string
  status: string
  priority: number
  estimated_resolution_time?: string
  actual_resolution_time?: string
  impact_assessment?: any
  created_at: string
  updated_at: string
}

export interface PerformanceMetric {
  id: string
  metric_type: string
  entity_type: string
  entity_id?: string
  metric_value?: number
  unit?: string
  measurement_time: string
  additional_data?: any
  created_at: string
}

export interface TrafficOptimization {
  id: string
  route_id?: string
  optimization_type: string
  current_capacity?: number
  optimal_capacity?: number
  congestion_level?: number
  recommended_actions?: any
  implementation_status: string
  expected_improvement?: number
  actual_improvement?: number
  created_at: string
  updated_at: string
}
