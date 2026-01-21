-- Add the missing cv_url column to the candidates table
-- Run this in your Supabase SQL Editor

ALTER TABLE clicklandingpublic.candidates 
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'clicklandingpublic' 
AND table_name = 'candidates';
