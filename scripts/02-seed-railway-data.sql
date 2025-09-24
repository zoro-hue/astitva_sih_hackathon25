-- Seed data for Railway Management System
-- Insert sample data for testing and demonstration

-- Insert sample stations
INSERT INTO stations (name, code, city, state, latitude, longitude, zone, division) VALUES
('New Delhi', 'NDLS', 'New Delhi', 'Delhi', 28.6448, 77.2097, 'Northern', 'Delhi'),
('Mumbai Central', 'BCT', 'Mumbai', 'Maharashtra', 19.0330, 72.8197, 'Western', 'Mumbai'),
('Chennai Central', 'MAS', 'Chennai', 'Tamil Nadu', 13.0827, 80.2707, 'Southern', 'Chennai'),
('Howrah Junction', 'HWH', 'Kolkata', 'West Bengal', 22.5726, 88.3639, 'Eastern', 'Howrah'),
('Bangalore City', 'SBC', 'Bangalore', 'Karnataka', 12.9716, 77.5946, 'South Western', 'Bangalore'),
('Pune Junction', 'PUNE', 'Pune', 'Maharashtra', 18.5204, 73.8567, 'Central', 'Pune'),
('Hyderabad Deccan', 'HYB', 'Hyderabad', 'Telangana', 17.3850, 78.4867, 'South Central', 'Hyderabad'),
('Ahmedabad Junction', 'ADI', 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 'Western', 'Ahmedabad'),
('Kanpur Central', 'CNB', 'Kanpur', 'Uttar Pradesh', 26.4499, 80.3319, 'North Central', 'Kanpur'),
('Nagpur Junction', 'NGP', 'Nagpur', 'Maharashtra', 21.1458, 79.0882, 'Central', 'Nagpur');

-- Insert sample routes
INSERT INTO routes (route_number, name, origin_station_id, destination_station_id, distance_km, electrified, gauge_type, status) VALUES
('R001', 'Delhi-Mumbai Route', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    (SELECT id FROM stations WHERE code = 'BCT'), 
    1384.0, true, 'broad', 'active'),
('R002', 'Delhi-Chennai Route', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    (SELECT id FROM stations WHERE code = 'MAS'), 
    2180.0, true, 'broad', 'active'),
('R003', 'Mumbai-Bangalore Route', 
    (SELECT id FROM stations WHERE code = 'BCT'), 
    (SELECT id FROM stations WHERE code = 'SBC'), 
    1279.0, true, 'broad', 'active'),
('R004', 'Delhi-Kolkata Route', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    (SELECT id FROM stations WHERE code = 'HWH'), 
    1441.0, true, 'broad', 'active'),
('R005', 'Chennai-Hyderabad Route', 
    (SELECT id FROM stations WHERE code = 'MAS'), 
    (SELECT id FROM stations WHERE code = 'HYB'), 
    625.0, true, 'broad', 'active');

-- Insert sample trains
INSERT INTO trains (train_number, name, type, route_id, total_coaches, max_speed, current_status) VALUES
('12951', 'Mumbai Rajdhani Express', 'express', 
    (SELECT id FROM routes WHERE route_number = 'R001'), 
    20, 130, 'running'),
('12615', 'Grand Trunk Express', 'express', 
    (SELECT id FROM routes WHERE route_number = 'R002'), 
    24, 110, 'scheduled'),
('12133', 'Mangalore Express', 'express', 
    (SELECT id FROM routes WHERE route_number = 'R003'), 
    22, 110, 'running'),
('12301', 'Howrah Rajdhani Express', 'express', 
    (SELECT id FROM routes WHERE route_number = 'R004'), 
    18, 130, 'delayed'),
('12759', 'Charminar Express', 'express', 
    (SELECT id FROM routes WHERE route_number = 'R005'), 
    20, 110, 'on_time');

-- Insert sample equipment
INSERT INTO equipment (equipment_type, equipment_id, name, location_station_id, manufacturer, model, year_manufactured, condition_score, status) VALUES
('locomotive', 'WAP7-30281', 'Electric Locomotive WAP7', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    'Chittaranjan Locomotive Works', 'WAP-7', 2018, 8.5, 'operational'),
('locomotive', 'WDM3A-16526', 'Diesel Locomotive WDM3A', 
    (SELECT id FROM stations WHERE code = 'BCT'), 
    'Diesel Locomotive Works', 'WDM-3A', 2015, 7.2, 'operational'),
('signal', 'SIG-NDLS-001', 'Main Line Signal', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    'Indian Railways', 'LED-Multi-Aspect', 2020, 9.1, 'operational'),
('track', 'TRK-R001-KM100', 'Track Section KM 100', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    'Steel Authority of India', '60kg/m Rail', 2019, 8.8, 'operational'),
('coach', 'ICF-AC1-2301', 'AC First Class Coach', 
    (SELECT id FROM stations WHERE code = 'MAS'), 
    'Integral Coach Factory', 'LHB-AC1', 2021, 9.3, 'operational');

-- Insert sample incidents
INSERT INTO incidents (incident_type, severity, title, description, location_station_id, status, priority) VALUES
('signal_failure', 'medium', 'Signal Malfunction at Platform 3', 
    'Signal showing incorrect aspect, causing minor delays', 
    (SELECT id FROM stations WHERE code = 'NDLS'), 
    'in_progress', 2),
('track_obstruction', 'high', 'Fallen Tree on Track', 
    'Large tree fallen across main line due to storm', 
    (SELECT id FROM stations WHERE code = 'PUNE'), 
    'open', 1),
('equipment_failure', 'low', 'Coach Door Malfunction', 
    'Automatic door not closing properly in coach B3', 
    (SELECT id FROM stations WHERE code = 'BCT'), 
    'resolved', 3);

-- Insert sample performance metrics
INSERT INTO performance_metrics (metric_type, entity_type, entity_id, metric_value, unit, additional_data) VALUES
('on_time_performance', 'train', 
    (SELECT id FROM trains WHERE train_number = '12951'), 
    87.5, 'percentage', '{"last_30_days": true}'),
('fuel_efficiency', 'train', 
    (SELECT id FROM trains WHERE train_number = '12615'), 
    4.2, 'km_per_liter', '{"route_type": "long_distance"}'),
('passenger_load', 'train', 
    (SELECT id FROM trains WHERE train_number = '12133'), 
    92.3, 'percentage', '{"capacity": 1200, "current_passengers": 1108}'),
('track_utilization', 'route', 
    (SELECT id FROM routes WHERE route_number = 'R001'), 
    78.5, 'percentage', '{"peak_hours": "06:00-10:00, 18:00-22:00"}');

-- Insert sample traffic optimization data
INSERT INTO traffic_optimization (route_id, optimization_type, current_capacity, optimal_capacity, congestion_level, recommended_actions, implementation_status) VALUES
((SELECT id FROM routes WHERE route_number = 'R001'), 
    'schedule_adjustment', 85, 95, 7.2, 
    '{"action": "increase_frequency", "peak_hours": "reduce_interval_by_15min"}', 
    'pending'),
((SELECT id FROM routes WHERE route_number = 'R002'), 
    'speed_optimization', 78, 88, 5.8, 
    '{"action": "dynamic_speed_control", "sections": ["km_500_600", "km_1200_1300"]}', 
    'in_progress');
