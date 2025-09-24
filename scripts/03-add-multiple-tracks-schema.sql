-- Add multiple tracks support to railway management system
-- This script adds tables and modifications to support multiple tracks between stations

-- Track segments table - represents individual track segments between stations
CREATE TABLE IF NOT EXISTS track_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_name VARCHAR(255) NOT NULL,
    origin_station_id UUID REFERENCES stations(id),
    destination_station_id UUID REFERENCES stations(id),
    track_number INTEGER NOT NULL, -- Track 1, 2, 3, etc.
    track_type VARCHAR(50) DEFAULT 'main', -- main, loop, siding, freight
    direction VARCHAR(20) DEFAULT 'bidirectional', -- up, down, bidirectional
    electrified BOOLEAN DEFAULT false,
    gauge_type VARCHAR(50) DEFAULT 'broad',
    max_speed_kmh INTEGER DEFAULT 120,
    length_km DECIMAL(8, 3),
    capacity_trains_per_hour INTEGER DEFAULT 12,
    current_utilization DECIMAL(5, 2) DEFAULT 0.00, -- percentage
    status VARCHAR(50) DEFAULT 'operational', -- operational, maintenance, closed
    signal_system VARCHAR(100), -- automatic, manual, centralized
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(origin_station_id, destination_station_id, track_number)
);

-- Track capacity and throughput metrics
CREATE TABLE IF NOT EXISTS track_capacity_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_segment_id UUID REFERENCES track_segments(id),
    measurement_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trains_per_hour_actual INTEGER,
    trains_per_hour_capacity INTEGER,
    utilization_percentage DECIMAL(5, 2),
    average_speed_kmh DECIMAL(5, 2),
    delay_minutes_avg DECIMAL(5, 2),
    throughput_efficiency DECIMAL(5, 2), -- percentage
    bottleneck_factor DECIMAL(5, 2), -- 1.0 = no bottleneck, >1.0 = bottleneck
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-path route options
CREATE TABLE IF NOT EXISTS route_path_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES routes(id),
    path_name VARCHAR(255) NOT NULL,
    path_sequence JSONB NOT NULL, -- array of track_segment_ids in order
    total_distance_km DECIMAL(8, 3),
    estimated_time_minutes INTEGER,
    max_throughput_trains_per_hour INTEGER,
    current_congestion_level DECIMAL(3, 2), -- 0.00 to 10.00
    reliability_score DECIMAL(3, 2), -- 0.00 to 10.00
    cost_factor DECIMAL(5, 2), -- relative cost multiplier
    priority_level INTEGER DEFAULT 3, -- 1-5, 1 = highest priority
    is_optimized_path BOOLEAN DEFAULT false,
    weather_dependency VARCHAR(50) DEFAULT 'low', -- low, medium, high
    maintenance_window_compatible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time track occupancy
CREATE TABLE IF NOT EXISTS track_occupancy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_segment_id UUID REFERENCES track_segments(id),
    train_id UUID REFERENCES trains(id),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exit_time TIMESTAMP WITH TIME ZONE,
    direction VARCHAR(20), -- up, down
    block_section VARCHAR(100),
    signal_status VARCHAR(50) DEFAULT 'clear', -- clear, caution, stop
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Path optimization results
CREATE TABLE IF NOT EXISTS path_optimization_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES routes(id),
    optimization_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_path_id UUID REFERENCES route_path_options(id),
    recommended_path_id UUID REFERENCES route_path_options(id),
    time_savings_minutes INTEGER,
    efficiency_improvement_percentage DECIMAL(5, 2),
    throughput_increase_percentage DECIMAL(5, 2),
    congestion_reduction_percentage DECIMAL(5, 2),
    optimization_reason TEXT,
    implementation_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, implemented, rejected
    expected_benefits JSONB,
    actual_benefits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_track_segments_stations ON track_segments(origin_station_id, destination_station_id);
CREATE INDEX IF NOT EXISTS idx_track_segments_status ON track_segments(status);
CREATE INDEX IF NOT EXISTS idx_track_capacity_time ON track_capacity_metrics(measurement_time);
CREATE INDEX IF NOT EXISTS idx_track_occupancy_segment ON track_occupancy(track_segment_id);
CREATE INDEX IF NOT EXISTS idx_track_occupancy_train ON track_occupancy(train_id);
CREATE INDEX IF NOT EXISTS idx_route_path_options_route ON route_path_options(route_id);
CREATE INDEX IF NOT EXISTS idx_path_optimization_route ON path_optimization_results(route_id);

-- Enable Row Level Security for new tables
ALTER TABLE track_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_capacity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_path_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_optimization_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON track_segments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON track_capacity_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON route_path_options FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON track_occupancy FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON path_optimization_results FOR SELECT USING (true);

-- Add some sample track segments data
INSERT INTO track_segments (segment_name, origin_station_id, destination_station_id, track_number, track_type, max_speed_kmh, length_km, capacity_trains_per_hour, current_utilization) VALUES
-- Tehran to Qom (multiple tracks)
('TEH-QOM-Main-1', (SELECT id FROM stations WHERE code = 'TEH'), (SELECT id FROM stations WHERE code = 'QOM'), 1, 'main', 160, 156.5, 16, 75.5),
('TEH-QOM-Main-2', (SELECT id FROM stations WHERE code = 'TEH'), (SELECT id FROM stations WHERE code = 'QOM'), 2, 'main', 160, 156.5, 16, 68.2),
('TEH-QOM-Freight', (SELECT id FROM stations WHERE code = 'TEH'), (SELECT id FROM stations WHERE code = 'QOM'), 3, 'freight', 100, 158.2, 8, 45.0),

-- Qom to Kashan (dual tracks)
('QOM-KAS-Main-1', (SELECT id FROM stations WHERE code = 'QOM'), (SELECT id FROM stations WHERE code = 'KAS'), 1, 'main', 140, 98.3, 14, 82.1),
('QOM-KAS-Main-2', (SELECT id FROM stations WHERE code = 'QOM'), (SELECT id FROM stations WHERE code = 'KAS'), 2, 'main', 140, 98.3, 14, 71.8),

-- Kashan to Isfahan (triple tracks)
('KAS-ISF-Express', (SELECT id FROM stations WHERE code = 'KAS'), (SELECT id FROM stations WHERE code = 'ISF'), 1, 'main', 180, 89.7, 18, 91.3),
('KAS-ISF-Main', (SELECT id FROM stations WHERE code = 'KAS'), (SELECT id FROM stations WHERE code = 'ISF'), 2, 'main', 160, 89.7, 16, 78.5),
('KAS-ISF-Local', (SELECT id FROM stations WHERE code = 'KAS'), (SELECT id FROM stations WHERE code = 'ISF'), 3, 'loop', 120, 92.1, 12, 55.2),

-- Tehran to Semnan (dual tracks)
('TEH-SEM-Main-1', (SELECT id FROM stations WHERE code = 'TEH'), (SELECT id FROM stations WHERE code = 'SEM'), 1, 'main', 160, 216.8, 14, 45.2),
('TEH-SEM-Main-2', (SELECT id FROM stations WHERE code = 'TEH'), (SELECT id FROM stations WHERE code = 'SEM'), 2, 'main', 160, 216.8, 14, 38.7),

-- Semnan to Shahroud (single track - bottleneck)
('SEM-SHA-Main', (SELECT id FROM stations WHERE code = 'SEM'), (SELECT id FROM stations WHERE code = 'SHA'), 1, 'main', 120, 167.4, 8, 95.8),

-- Shahroud to Mashhad (dual tracks)
('SHA-MAS-Main-1', (SELECT id FROM stations WHERE code = 'SHA'), (SELECT id FROM stations WHERE code = 'MAS'), 1, 'main', 160, 398.2, 12, 87.4),
('SHA-MAS-Main-2', (SELECT id FROM stations WHERE code = 'SHA'), (SELECT id FROM stations WHERE code = 'MAS'), 2, 'main', 160, 398.2, 12, 79.1);
