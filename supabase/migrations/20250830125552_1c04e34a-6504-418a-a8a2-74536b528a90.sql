-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE username = 'admin' AND role IN ('super_admin', 'admin')
  )
);

-- Allow admins to manage all profiles (for future admin features)
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE username = 'admin' AND role IN ('super_admin', 'admin')
  )
);