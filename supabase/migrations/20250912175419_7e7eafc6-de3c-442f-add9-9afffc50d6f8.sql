-- Insert the actual subscription packages as shown in the user interface
INSERT INTO packages (name, name_en, description, description_en, price, duration_months, features, features_en, is_active, is_popular, display_order) VALUES 
(
  'الباقة الأساسية',
  'Basic Package',
  'متاحة للمبتدئين في الاستثمار',
  'Available for investment beginners',
  99,
  1,
  '["عرض جميع الأسهم المتاحة", "التوصيات الأساسية اليومية", "إضافة الأسهم للمفضلة", "تقلبات الأسهم", "التحليلات الأساسية"]'::jsonb,
  '["View all available stocks", "Daily basic recommendations", "Add stocks to favorites", "Stock volatility", "Basic analysis"]'::jsonb,
  true,
  false,
  1
),
(
  'باقة البرو',
  'Pro Package',
  'للمتداولين المحترفين والخاصين',
  'For professional and experienced traders',
  299,
  1,
  '["جميع مميزات الباقة الأساسية", "تحليلات تقنية متقدمة", "توقيتات مثالية مع نقاط الدخول والخروج", "مؤشرات الدعم والمقاومة", "مؤشرات RSI و MACD", "توصيات متقدمة محدثة", "إدارة المحفظة الاستثمارية", "تتبع المعاملات والأرباح", "تحليل الأداء التفصيلي", "دعم في أولوية", "تقارير شهرية مفصلة", "وصول مبكر للميزات الجديدة"]'::jsonb,
  '["All basic package features", "Advanced technical analysis", "Perfect timing with entry and exit points", "Support and resistance indicators", "RSI and MACD indicators", "Advanced updated recommendations", "Investment portfolio management", "Track transactions and profits", "Detailed performance analysis", "Priority support", "Detailed monthly reports", "Early access to new features"]'::jsonb,
  true,
  true,
  2
);