/*
  # Create storage bucket for ML models

  1. Storage
    - Create a new storage bucket named 'models' for storing ML model files
  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to manage their own files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('models', 'models')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload their own model files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'models' AND
  auth.uid() = owner
);

-- Allow authenticated users to read all model files
CREATE POLICY "Users can read all model files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'models');

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own model files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'models' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'models' AND auth.uid() = owner);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own model files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'models' AND auth.uid() = owner);