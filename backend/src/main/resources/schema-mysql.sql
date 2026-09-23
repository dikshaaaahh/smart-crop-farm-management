-- Smart Crop Decision & Farm Management System
-- MySQL Database Schema Definition (smart_crop_db)

CREATE DATABASE IF NOT EXISTS smart_crop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_crop_db;

-- 1. Farms Table
CREATE TABLE IF NOT EXISTS farms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    total_area_acres DOUBLE NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    irrigation_source VARCHAR(50) NOT NULL,
    water_availability VARCHAR(50) NOT NULL,
    active_crops VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crops Catalog Table
CREATE TABLE IF NOT EXISTS crops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    suitable_seasons VARCHAR(255) NOT NULL,
    suitable_soils VARCHAR(255) NOT NULL,
    water_requirement VARCHAR(50) NOT NULL,
    optimal_min_temp DOUBLE,
    optimal_max_temp DOUBLE,
    duration_days_min INT,
    duration_days_max INT,
    avg_yield_per_acre_quintals DOUBLE,
    market_price_per_quintal DOUBLE,
    cost_of_cultivation_per_acre DOUBLE,
    description TEXT,
    npk_ratio VARCHAR(50),
    standard_fertilizer_note TEXT,
    irrigation_guidance_note TEXT
);

-- 3. Crop Activities Table
CREATE TABLE IF NOT EXISTS crop_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    farm_name VARCHAR(255),
    crop_name VARCHAR(255) NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED',
    cost DOUBLE DEFAULT 0.0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
);

-- 4. Farm Expenses Table
CREATE TABLE IF NOT EXISTS farm_expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farm_id BIGINT,
    farm_name VARCHAR(255),
    crop_name VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    amount DOUBLE NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_farm FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
);
