-- FIX RLS Policies for weekly_realizations (Final Check)
-- This ensures authenticated users can INSERT and UPDATE their performance data.

-- 1. Enable RLS
ALTER TABLE public.weekly_realizations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert/update for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.weekly_realizations;

-- 3. Create Comprehensive Policies
-- We allow Authenticated users to do everything (Business logic in the app prevents abuse)

-- Policy: SELECT
CREATE POLICY "Enable read access for authenticated users"
ON public.weekly_realizations
FOR SELECT
TO authenticated
USING (true);

-- Policy: INSERT / UPDATE (ALL)
CREATE POLICY "Enable insert/update for authenticated users"
ON public.weekly_realizations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Note: The "FOR ALL" covers SELECT, INSERT, UPDATE, DELETE in one go (except checking vs using logic difference).
-- But explicitly separating them or using "FOR ALL" is both fine. Here we use a robust "FOR ALL" for simplicity in permission granting.
