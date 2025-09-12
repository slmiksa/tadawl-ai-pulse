-- Allow admins to view all subscriptions in admin dashboard
CREATE POLICY IF NOT EXISTS "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (is_super_admin());