-- FIX RLS Policies for weekly_realizations
-- This script grants permission for authenticated users to Insert/Update data without constraints.

-- 1. Ensure RLS is enabled
ALTER TABLE public.weekly_realizations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts/duplicates
DROP POLICY IF EXISTS "Enable read access for all users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.weekly_realizations;
-- Also drop generic names i might have used
DROP POLICY IF EXISTS "Allow authenticated read" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.weekly_realizations;

-- 3. Create Permissive Policies -> "Authenticated Users can do anything"
-- We rely on the App Logic (Service Layer) to enforce "Sunday Cut-off" and "Status Checks"

-- A. SELECT
CREATE POLICY "Allow authenticated read"
ON public.weekly_realizations
FOR SELECT
TO authenticated
USING (true);

-- B. INSERT
CREATE POLICY "Allow authenticated insert"
ON public.weekly_realizations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- C. UPDATE
CREATE POLICY "Allow authenticated update"
ON public.weekly_realizations
FOR UPDATE
TO authenticated
USING (true);

-- D. DELETE (Optional, but good for cleanup if needed)
CREATE POLICY "Allow authenticated delete"
ON public.weekly_realizations
FOR DELETE
TO authenticated
USING (true);
