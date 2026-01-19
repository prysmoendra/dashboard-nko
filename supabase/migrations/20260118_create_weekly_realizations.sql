-- Create table for WEEKLY DATA
CREATE TABLE IF NOT EXISTS public.weekly_realizations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now(),
    monthly_target_id uuid NOT NULL, -- Link to Parent Target
    week integer NOT NULL CHECK (week BETWEEN 1 AND 5),
    realization_value numeric DEFAULT 0,
    status character varying(20) DEFAULT 'draft', -- draft, pending_review, approved, rejected
    rejection_reason text,
    submitted_at timestamp with time zone,
    
    CONSTRAINT weekly_realizations_pkey PRIMARY KEY (id),
    CONSTRAINT fk_monthly_target FOREIGN KEY (monthly_target_id)
        REFERENCES public.monthly_targets (id) ON DELETE CASCADE,
    CONSTRAINT unique_realization_per_week UNIQUE (monthly_target_id, week)
);

-- Create Index for speed
CREATE INDEX IF NOT EXISTS idx_weekly_realizations_target ON public.weekly_realizations (monthly_target_id);

-- Enable RLS (Optional but recommended)
ALTER TABLE public.weekly_realizations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view
CREATE POLICY "Enable read access for authenticated users" 
ON public.weekly_realizations FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Allow authenticated users to insert/update
CREATE POLICY "Enable insert/user access for authenticated users" 
ON public.weekly_realizations FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
