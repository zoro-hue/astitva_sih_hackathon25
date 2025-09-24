-- Railway Management System Database Schema
-- Create comprehensive tables for railway operations management

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    zone VARCHAR(50),
    division VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    origin_station_id UUID REFERENCES stations(id),
    destination_station_id UUID REFERENCES stations(id),
    distance_km DECIMAL(8, 2),
    electrified BOOLEAN DEFAULT false,
    gauge_type VARCHAR(50) DEFAULT 'broad',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trains table
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- express, passenger, freight, etc.
    route_id UUID REFERENCES routes(id),
    total_coaches INTEGER,
    max_speed INTEGER,
    current_status VARCHAR(50) DEFAULT 'scheduled',
    current_location JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train schedules table
CREATE TABLE IF NOT EXISTS train_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id),
    station_id UUID REFERENCES stations(id),
    arrival_time TIME,
    departure_time TIME,
    platform_number VARCHAR(10),
    halt_duration INTEGER, -- in minutes
    distance_from_origin DECIMAL(8, 2),
    sequence_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time train tracking
CREATE TABLE IF NOT EXISTS train_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id),
    current_station_id UUID REFERENCES stations(id),
    next_station_id UUID REFERENCES stations(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    speed_kmh DECIMAL(5, 2),
    delay_minutes INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'on_time',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment and assets for maintenance
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_type VARCHAR(100) NOT NULL, -- locomotive, coach, signal, track, etc.
    equipment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    location_station_id UUID REFERENCES stations(id),
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    year_manufactured INTEGER,
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    condition_score DECIMAL(3, 2), -- 0.00 to 10.00
    status VARCHAR(50) DEFAULT 'operational',
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance records
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id),
    maintenance_type VARCHAR(100) NOT NULL, -- preventive, corrective, emergency
    description TEXT,
    technician_name VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    cost DECIMAL(10, 2),
    parts_used JSONB,
    condition_before DECIMAL(3, 2),
    condition_after DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents and alerts
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL, -- signal_failure, track_obstruction, equipment_failure, etc.
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location_station_id UUID REFERENCES stations(id),
    affected_train_id UUID REFERENCES trains(id),
    affected_equipment_id UUID REFERENCES equipment(id),
    reported_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, closed
    priority INTEGER DEFAULT 3, -- 1-5 scale
    estimated_resolution_time TIMESTAMP WITH TIME ZONE,
    actual_resolution_time TIMESTAMP WITH TIME ZONE,
    impact_assessment JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(100) NOT NULL, -- on_time_performance, fuel_efficiency, passenger_load, etc.
    entity_type VARCHAR(50) NOT NULL, -- train, route, station, system
    entity_id UUID,
    metric_value DECIMAL(10, 4),
    unit VARCHAR(50),
    measurement_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic optimization data
CREATE TABLE IF NOT EXISTS traffic_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES routes(id),
    optimization_type VARCHAR(100) NOT NULL, -- schedule_adjustment, route_change, speed_optimization
    current_capacity INTEGER,
    optimal_capacity INTEGER,
    congestion_level DECIMAL(3, 2), -- 0.00 to 10.00
    recommended_actions JSONB,
    implementation_status VARCHAR(50) DEFAULT 'pending',
    expected_improvement DECIMAL(5, 2),
    actual_improvement DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trains_current_status ON trains(current_status);
CREATE INDEX IF NOT EXISTS idx_train_tracking_train_id ON train_tracking(train_id);
CREATE INDEX IF NOT EXISTS idx_train_tracking_timestamp ON train_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_next_maintenance ON equipment(next_maintenance_due);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_time ON performance_metrics(measurement_time);

-- Enable Row Level Security
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_optimization ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Allow public read access" ON stations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON routes FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON trains FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON train_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON train_tracking FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON maintenance_records FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON incidents FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON performance_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON traffic_optimization FOR SELECT USING (true);
