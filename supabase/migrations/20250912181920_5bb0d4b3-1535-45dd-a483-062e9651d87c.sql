-- Create site_settings table to store platform configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies - only super admins can manage site settings
CREATE POLICY "Only super admins can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (is_super_admin());

CREATE POLICY "Only super admins can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (is_super_admin());

CREATE POLICY "Only super admins can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (is_super_admin());

CREATE POLICY "Only super admins can delete site settings" 
ON public.site_settings 
FOR DELETE 
USING (is_super_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES 
('general', '{
  "siteName": "تداول الذكي",
  "siteDescription": "منصة ذكية لتداول الأسهم السعودية",
  "contactEmail": "info@tadawlai.com",
  "supportEmail": "support@tadawlai.com"
}', 'General site configuration'),

('security', '{
  "maintenanceMode": false,
  "registrationEnabled": true,
  "emailVerificationRequired": false,
  "twoFactorEnabled": false,
  "maxUsersPerDay": 100,
  "sessionTimeout": 30
}', 'Security and access control settings'),

('appearance', '{
  "primaryColor": "#8B5CF6",
  "secondaryColor": "#06B6D4",
  "logoUrl": "/logo.png",
  "faviconUrl": "/favicon.ico"
}', 'Visual appearance settings'),

('social_media', '{
  "twitter": "",
  "linkedin": "",
  "facebook": ""
}', 'Social media links'),

('seo', '{
  "metaTitle": "تداول الذكي - منصة ذكية لتداول الأسهم",
  "metaDescription": "منصة متقدمة لتداول الأسهم السعودية مع ميزات الذكاء الاصطناعي والتحليل المتقدم",
  "keywords": "تداول, أسهم, السعودية, ذكي, استثمار"
}', 'SEO optimization settings'),

('notifications', '{
  "emailNotifications": true,
  "pushNotifications": true,
  "smsNotifications": false
}', 'Notification preferences');

-- Create function to get all site settings
CREATE OR REPLACE FUNCTION public.get_site_settings()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create function to update site settings
CREATE OR REPLACE FUNCTION public.update_site_settings(
  settings_data JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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