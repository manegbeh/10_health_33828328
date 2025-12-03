-- Drop and recreate the database
DROP DATABASE IF EXISTS health;
CREATE DATABASE health;
USE health;

-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    first VARCHAR(255),
    last VARCHAR(255),
    email VARCHAR(255),
    hashedPassword VARCHAR(255) NOT NULL
);

-- MEALS TABLE
CREATE TABLE meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WORKOUTS TABLE (updated for calories + time)
CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    time INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT TABLE 
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);