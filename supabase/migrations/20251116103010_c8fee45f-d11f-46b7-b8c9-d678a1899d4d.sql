-- Add RLS policies for dementia users to manage their own buddies
CREATE POLICY "Dementia users can insert own buddies"
  ON public.buddy_watch
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = dementia_user_id);

CREATE POLICY "Dementia users can update own buddies"
  ON public.buddy_watch
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = dementia_user_id)
  WITH CHECK (auth.uid() = dementia_user_id);

CREATE POLICY "Dementia users can delete own buddies"
  ON public.buddy_watch
  FOR DELETE
  TO authenticated
  USING (auth.uid() = dementia_user_id);