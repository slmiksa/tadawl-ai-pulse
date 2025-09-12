-- Fix ambiguous variable names in update_site_settings
CREATE OR REPLACE FUNCTION public.update_site_settings(settings_data jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_key TEXT;
  v_value JSONB;
BEGIN
  -- Check if user is super admin
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin privileges required.';
  END IF;

  -- Update each setting category (e.g., general, appearance, security, seo, notifications)
  FOR v_key, v_value IN SELECT * FROM jsonb_each(settings_data)
  LOOP
    INSERT INTO public.site_settings (setting_key, setting_value)
    VALUES (v_key, v_value)
    ON CONFLICT (setting_key) 
    DO UPDATE SET 
      setting_value = EXCLUDED.setting_value,
      updated_at = now();
  END LOOP;

  RETURN true;
END;
$$;