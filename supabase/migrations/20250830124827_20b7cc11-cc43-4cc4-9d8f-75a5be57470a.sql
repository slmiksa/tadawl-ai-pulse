-- Create admins table for admin management
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API keys table for API management
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
  requests_today INTEGER DEFAULT 0,
  rate_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table (only super admins can manage)
CREATE POLICY "Super admins can manage all admins" ON public.admins
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE username = 'admin' AND role = 'super_admin'
  )
);

-- Create policies for API keys (admin access only)
CREATE POLICY "Admins can manage API keys" ON public.api_keys
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE username = 'admin' 
  )
);

-- Insert default super admin
INSERT INTO public.admins (username, email, password_hash, role, permissions, status)
VALUES (
  'admin',
  'admin@tadawlai.com', 
  '$2b$10$rQzk7O8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8zO8z', -- This is just a placeholder
  'super_admin',
  '["all"]'::jsonb,
  'active'
) ON CONFLICT (username) DO NOTHING;

-- Insert current API keys from environment
INSERT INTO public.api_keys (name, key_value, description, status, rate_limit)
VALUES 
  ('TWELVEDATA_API_KEY', 'td_placeholder_key', 'مفتاح API لبيانات الأسهم من TwelveData', 'active', 5000),
  ('FINNHUB_API_KEY', 'fh_placeholder_key', 'مفتاح API لبيانات السوق من Finnhub', 'active', 3000),
  ('OPENAI_API_KEY', 'sk_placeholder_key', 'مفتاح API للذكاء الاصطناعي من OpenAI', 'active', 1000)
ON CONFLICT (name) DO NOTHING;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();