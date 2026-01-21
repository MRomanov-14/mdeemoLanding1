-- Add cedula column and unique constraint
-- Run this in Supabase SQL Editor

-- 1. Add cedula column
ALTER TABLE clicklandingpublic.candidates 
ADD COLUMN IF NOT EXISTS cedula TEXT;

-- 2. Add unique constraint to avoid duplicate applications for the same area
-- This ensures a user (cedula) can only apply once to 'Operario Logístico', etc.
CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_cedula_area 
ON clicklandingpublic.candidates (cedula, area_interest);
