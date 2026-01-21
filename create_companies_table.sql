-- Create 'companies' table in 'clicklandingpublic' schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS clicklandingpublic.companies (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    job_title TEXT NOT NULL,
    vacancy_count TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
