-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Optional: Create a policy to allow viewing only public profile information (username, avatar) if needed for app functionality
-- This is commented out for now - uncomment if the app needs to display other users' public info
-- CREATE POLICY "Public profile info viewable" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (true)
-- WITH CHECK (false); -- Only allow viewing specific columns via a view or function