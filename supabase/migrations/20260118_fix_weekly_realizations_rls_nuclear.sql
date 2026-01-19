-- NUCLEAR OPTION: Fix Persistent RLS Error (42501)
-- This script ensures weekly_realizations is writable by ANYONE (Public/Anon/Auth).
-- Use this for development to unblock the "Violates RLS Policy" error.

-- 1. Ensure RLS is ON (Structure is correct)
ALTER TABLE public.weekly_realizations ENABLE ROW LEVEL SECURITY;

-- 2. NUCLEAR CLEANUP: Drop every possible policy name we might have created
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert/update for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow all" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.weekly_realizations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.weekly_realizations;

-- 3. THE "GOD MODE" POLICY (Allow Public Access for Dev)
-- Using "TO public" ensures it works even if the auth token is flaky/expired or user is anon.
CREATE POLICY "weekly_realizations_allow_all_public"
ON public.weekly_realizations
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 4. Verify Grants (Just in case)
GRANT ALL ON TABLE public.weekly_realizations TO postgres;
GRANT ALL ON TABLE public.weekly_realizations TO anon;
GRANT ALL ON TABLE public.weekly_realizations TO authenticated;
GRANT ALL ON TABLE public.weekly_realizations TO service_role;

-- Confirmation
DO $$
BEGIN
    RAISE NOTICE 'Nuclear RLS Fix applied. weekly_realizations is now open to public.';
END $$;
