-- Migration: Create used_car_images table for uploaded used car images
CREATE TABLE IF NOT EXISTS used_car_images (
    id SERIAL PRIMARY KEY,
    used_car_id INTEGER REFERENCES used_cars(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_used_car_images_used_car_id ON used_car_images(used_car_id);
