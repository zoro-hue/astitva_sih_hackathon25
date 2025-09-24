-- Seed data for multiple tracks and path optimization

-- Insert route path options for Tehran-Isfahan route
INSERT INTO route_path_options (route_id, path_name, path_sequence, total_distance_km, estimated_time_minutes, max_throughput_trains_per_hour, current_congestion_level, reliability_score, cost_factor, is_optimized_path) VALUES
(
    (SELECT id FROM routes WHERE route_number = 'IR-001'),
    'Tehran-Isfahan Express Path',
    '["TEH-QOM-Main-1", "QOM-KAS-Main-1", "KAS-ISF-Express"]'::jsonb,
    344.5,
    185,
    14,
    3.2,
    9.1,
    1.0,
    true
),
(
    (SELECT id FROM routes WHERE route_number = 'IR-001'),
    'Tehran-Isfahan Standard Path',
    '["TEH-QOM-Main-2", "QOM-KAS-Main-2", "KAS-ISF-Main"]'::jsonb,
    344.5,
    205,
    14,
    4.1,
    8.7,
    0.9,
    false
),
(
    (SELECT id FROM routes WHERE route_number = 'IR-001'),
    'Tehran-Isfahan Mixed Path',
    '["TEH-QOM-Main-1", "QOM-KAS-Main-2", "KAS-ISF-Local"]'::jsonb,
    346.3,
    225,
    12,
    2.8,
    8.9,
    0.8,
    false
);

-- Insert route path options for Tehran-Mashhad route
INSERT INTO route_path_options (route_id, path_name, path_sequence, total_distance_km, estimated_time_minutes, max_throughput_trains_per_hour, current_congestion_level, reliability_score, cost_factor, is_optimized_path) VALUES
(
    (SELECT id FROM routes WHERE route_number = 'IR-002'),
    'Tehran-Mashhad Direct Path',
    '["TEH-SEM-Main-1", "SEM-SHA-Main", "SHA-MAS-Main-1"]'::jsonb,
    782.4,
    420,
    8,
    8.5,
    6.2,
    1.0,
    false
),
(
    (SELECT id FROM routes WHERE route_number = 'IR-002'),
    'Tehran-Mashhad Alternative Path',
    '["TEH-QOM-Main-1", "QOM-KAS-Main-1", "KAS-ISF-Express"]'::jsonb,
    890.3,
    380,
    12,
    4.1,
    8.8,
    1.3,
    true
);

-- Insert track capacity metrics
INSERT INTO track_capacity_metrics (track_segment_id, trains_per_hour_actual, trains_per_hour_capacity, utilization_percentage, average_speed_kmh, delay_minutes_avg, throughput_efficiency, bottleneck_factor) 
SELECT 
    id,
    FLOOR(capacity_trains_per_hour * current_utilization / 100),
    capacity_trains_per_hour,
    current_utilization,
    max_speed_kmh * 0.85, -- Average speed is typically 85% of max
    CASE 
        WHEN current_utilization > 90 THEN 15 + RANDOM() * 10
        WHEN current_utilization > 70 THEN 5 + RANDOM() * 8
        ELSE RANDOM() * 3
    END,
    CASE 
        WHEN current_utilization > 90 THEN 60 + RANDOM() * 20
        WHEN current_utilization > 70 THEN 75 + RANDOM() * 15
        ELSE 85 + RANDOM() * 10
    END,
    CASE 
        WHEN current_utilization > 90 THEN 1.5 + RANDOM() * 0.8
        WHEN current_utilization > 70 THEN 1.1 + RANDOM() * 0.3
        ELSE 1.0 + RANDOM() * 0.1
    END
FROM track_segments;

-- Insert path optimization results
INSERT INTO path_optimization_results (route_id, current_path_id, recommended_path_id, time_savings_minutes, efficiency_improvement_percentage, throughput_increase_percentage, congestion_reduction_percentage, optimization_reason, expected_benefits) VALUES
(
    (SELECT id FROM routes WHERE route_number = 'IR-001'),
    (SELECT id FROM route_path_options WHERE path_name = 'Tehran-Isfahan Standard Path'),
    (SELECT id FROM route_path_options WHERE path_name = 'Tehran-Isfahan Express Path'),
    20,
    12.5,
    18.2,
    25.8,
    'Switch to express tracks to reduce congestion and improve throughput',
    '{"fuel_savings": "8%", "passenger_satisfaction": "15%", "on_time_performance": "22%"}'::jsonb
),
(
    (SELECT id FROM routes WHERE route_number = 'IR-002'),
    (SELECT id FROM route_path_options WHERE path_name = 'Tehran-Mashhad Direct Path'),
    (SELECT id FROM route_path_options WHERE path_name = 'Tehran-Mashhad Alternative Path'),
    40,
    28.3,
    35.7,
    52.1,
    'Avoid bottleneck at Semnan-Shahroud section by using Isfahan alternative route',
    '{"reliability_improvement": "45%", "capacity_increase": "35%", "maintenance_flexibility": "60%"}'::jsonb
);

-- Insert some real-time track occupancy data
INSERT INTO track_occupancy (track_segment_id, train_id, direction, block_section, signal_status) 
SELECT 
    ts.id,
    t.id,
    CASE WHEN RANDOM() > 0.5 THEN 'up' ELSE 'down' END,
    'BLOCK-' || FLOOR(RANDOM() * 100 + 1),
    CASE 
        WHEN RANDOM() > 0.8 THEN 'caution'
        WHEN RANDOM() > 0.95 THEN 'stop'
        ELSE 'clear'
    END
FROM track_segments ts
CROSS JOIN trains t
WHERE RANDOM() > 0.7 -- Only some tracks are occupied
LIMIT 15;
