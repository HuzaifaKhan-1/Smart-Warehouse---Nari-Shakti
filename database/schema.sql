-- AgriFresh Database Schema

-- Users & Authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'FARMER', 'DISTRIBUTOR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouse Structure
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(255),
    total_capacity DECIMAL, -- in Metric Tons
    manager_id INT REFERENCES users(id)
);

CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(id),
    name VARCHAR(50),
    type VARCHAR(20), -- COLD, AMBIENT, DRY
    current_temp DECIMAL,
    current_humidity DECIMAL
);

-- Inventory
CREATE TABLE inventory_batches (
    id SERIAL PRIMARY KEY,
    zone_id INT REFERENCES zones(id),
    produce_type VARCHAR(50),
    farmer_id INT REFERENCES users(id),
    quantity DECIMAL,
    unit VARCHAR(10) DEFAULT 'kg',
    harvest_date DATE,
    storage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    qr_code_uid VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'STORED' -- STORED, DISPATCHED, SPOILED
);

-- Logs & Measurements
CREATE TABLE sensor_logs (
    id BIGSERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(id),
    zone_id INT REFERENCES zones(id),
    temperature DECIMAL,
    humidity DECIMAL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Predictions & Intelligence
CREATE TABLE spoilage_predictions (
    id SERIAL PRIMARY KEY,
    batch_id INT REFERENCES inventory_batches(id),
    risk_level VARCHAR(20),
    remaining_days INT,
    confidence DECIMAL,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_decisions (
    id SERIAL PRIMARY KEY,
    query_text TEXT,
    response_text TEXT,
    action_taken VARCHAR(100),
    confidence DECIMAL,
    user_id INT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispatch & Logistics
CREATE TABLE dispatch_logs (
    id SERIAL PRIMARY KEY,
    batch_id INT REFERENCES inventory_batches(id),
    distributor_id INT REFERENCES users(id),
    dispatch_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    destination VARCHAR(100),
    revenue DECIMAL
);

-- Indices for performance
CREATE INDEX idx_sensor_time ON sensor_logs(timestamp);
CREATE INDEX idx_batch_status ON inventory_batches(status);
CREATE INDEX idx_qr_uid ON inventory_batches(qr_code_uid);
