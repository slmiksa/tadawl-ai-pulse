-- Allow admins to view all subscriptions in admin dashboard
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (is_super_admin());