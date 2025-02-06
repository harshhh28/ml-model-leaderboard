/*
  # Create ML Models Schema

  1. New Tables
    - `models`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)
      - `file_path` (text)
      - `f1_score` (float)
      - `accuracy` (float)
      - `precision` (float)
      - `recall` (float)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `models` table
    - Add policies for authenticated users to:
      - Read all models
      - Create their own models
      - Update their own models
      - Delete their own models
*/

CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users NOT NULL,
  file_path text NOT NULL,
  f1_score float,
  accuracy float,
  precision float,
  recall float,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT name_length CHECK (char_length(name) >= 3)
);

ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Allow users to view all models
CREATE POLICY "Users can view all models"
  ON models
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own models
CREATE POLICY "Users can create their own models"
  ON models
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own models
CREATE POLICY "Users can update their own models"
  ON models
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own models
CREATE POLICY "Users can delete their own models"
  ON models
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);