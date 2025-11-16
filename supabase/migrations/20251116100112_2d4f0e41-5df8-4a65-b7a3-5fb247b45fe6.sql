-- Create connection status enum
CREATE TYPE public.connection_status AS ENUM ('pending', 'approved', 'rejected');

-- Add status and timestamps to caregiving_relationships
ALTER TABLE public.caregiving_relationships
  ADD COLUMN status public.connection_status NOT NULL DEFAULT 'pending',
  ADD COLUMN requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ADD COLUMN responded_at TIMESTAMP WITH TIME ZONE;

-- Update existing relationships to be approved (backward compatibility)
UPDATE public.caregiving_relationships SET status = 'approved', responded_at = created_at WHERE status = 'pending';

-- Update is_caregiver_for function to only check approved relationships
CREATE OR REPLACE FUNCTION public.is_caregiver_for(_caregiver_id uuid, _dementia_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.caregiving_relationships
    WHERE caregiver_id = _caregiver_id 
      AND dementia_user_id = _dementia_user_id
      AND status = 'approved'
  )
$$;

-- Add RLS policy for dementia users to update their relationships (approve/reject)
CREATE POLICY "Dementia users can update their relationships"
ON public.caregiving_relationships
FOR UPDATE
USING (auth.uid() = dementia_user_id)
WITH CHECK (auth.uid() = dementia_user_id);

-- Create index for faster lookups
CREATE INDEX idx_caregiving_relationships_status ON public.caregiving_relationships(status);
CREATE INDEX idx_caregiving_relationships_dementia_user ON public.caregiving_relationships(dementia_user_id, status);