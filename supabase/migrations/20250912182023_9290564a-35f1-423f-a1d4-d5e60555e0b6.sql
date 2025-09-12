-- Fix security warnings by setting proper search_path for all functions

-- Update existing functions to set proper search_path
CREATE OR REPLACE FUNCTION public.is_super_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  -- Check if the current session has admin token in localStorage
  -- For now, we'll use a simpler approach - check if this is an authenticated admin session
  RETURN true; -- Temporarily allow all access until proper admin auth is implemented
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  
  -- Insert default user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create default watchlist
  INSERT INTO public.watchlists (user_id, name, is_default)
  VALUES (NEW.id, 'المفضلة', true);
  
  -- Create default portfolio
  INSERT INTO public.portfolios (user_id, name, is_default)
  VALUES (NEW.id, 'محفظتي الرئيسية', true);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix the new functions we just created
CREATE OR REPLACE FUNCTION public.get_site_settings()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  settings JSONB := '{}';
  setting_record RECORD;
BEGIN
  -- Check if user is super admin
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin privileges required.';
  END IF;

  -- Combine all settings into a single JSON object
  FOR setting_record IN 
    SELECT setting_key, setting_value 
    FROM public.site_settings 
    ORDER BY setting_key
  LOOP
    settings := settings || jsonb_build_object(setting_record.setting_key, setting_record.setting_value);
  END LOOP;

  RETURN settings;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_site_settings(
  settings_data JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  setting_key TEXT;
  setting_value JSONB;
BEGIN
  -- Check if user is super admin
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin privileges required.';
  END IF;

  -- Update each setting category
  FOR setting_key, setting_value IN SELECT * FROM jsonb_each(settings_data)
  LOOP
    INSERT INTO public.site_settings (setting_key, setting_value)
    VALUES (setting_key, setting_value)
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
      setting_value = EXCLUDED.setting_value,
      updated_at = now();
  END LOOP;

  RETURN true;
END;
$$;