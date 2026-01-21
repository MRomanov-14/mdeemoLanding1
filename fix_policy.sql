-- Enable public uploads to the 'mdeemolanding' bucket
-- Run this in your Supabase SQL Editor

-- 1. Ensure the bucket exists (optional, but good practice)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mdeemolanding', 'mdeemolanding', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the policy to allow INSERTs (uploads) for anyone (anon)
-- Note: 'storage.objects' is the table where file metadata lives.
CREATE POLICY "Allow public uploads to mdeemolanding"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'mdeemolanding');

-- 3. (Optional) Allow public to SELECT (view/download) files
CREATE POLICY "Allow public downloads from mdeemolanding"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'mdeemolanding');
