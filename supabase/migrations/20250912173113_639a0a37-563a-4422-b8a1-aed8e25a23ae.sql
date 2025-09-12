-- Create packages table for managing subscription packages
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_months INTEGER NOT NULL DEFAULT 1,
  features JSONB DEFAULT '[]'::jsonb,
  features_en JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies for packages
CREATE POLICY "Packages are viewable by everyone" 
ON public.packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage packages" 
ON public.packages 
FOR ALL 
USING (public.is_super_admin());

-- Add trigger for timestamps
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default packages
INSERT INTO public.packages (name, name_en, description, description_en, price, duration_months, features, features_en, is_popular, display_order) VALUES
('الباقة الأساسية', 'Basic Package', 'باقة مناسبة للمبتدئين', 'Perfect for beginners', 29.99, 1, 
 '["تحليلات أساسية", "توصيات يومية", "دعم فني"]'::jsonb, 
 '["Basic Analytics", "Daily Recommendations", "Technical Support"]'::jsonb, 
 false, 1),
('الباقة المتقدمة', 'Pro Package', 'باقة شاملة للمحترفين', 'Complete package for professionals', 59.99, 1, 
 '["تحليلات متقدمة", "توصيات فورية", "تحليل المحفظة", "دعم أولوية"]'::jsonb, 
 '["Advanced Analytics", "Real-time Recommendations", "Portfolio Analysis", "Priority Support"]'::jsonb, 
 true, 2),
('الباقة الاحترافية', 'Premium Package', 'أفضل باقة لأقصى استفادة', 'Best package for maximum benefits', 99.99, 1, 
 '["جميع الميزات", "تحليل AI متقدم", "استشارات شخصية", "دعم 24/7"]'::jsonb, 
 '["All Features", "Advanced AI Analysis", "Personal Consultations", "24/7 Support"]'::jsonb, 
 false, 3);