import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Check, 
  Star,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number;
  duration_months: number;
  features: string[];
  features_en: string[];
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
}

const SubscriptionPackages: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchPackages();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      const processedData = (data || []).map(pkg => ({
        ...pkg,
        features: Array.isArray(pkg.features) ? pkg.features.map(f => String(f)) : [],
        features_en: Array.isArray(pkg.features_en) ? pkg.features_en.map(f => String(f)) : []
      }));
      
      setPackages(processedData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الباقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (pkg: Package) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubscribing(pkg.id);
    
    try {
      // Check if user already has an active subscription
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (existingSubscription) {
        toast({
          title: "لديك اشتراك فعال",
          description: "لديك اشتراك فعال بالفعل. يمكنك إدارته من صفحة الملف الشخصي.",
          variant: "destructive"
        });
        return;
      }

      // Calculate end date
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + pkg.duration_months);

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: user.id,
          package_type: pkg.name,
          is_active: true,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }]);

      if (subscriptionError) throw subscriptionError;

      toast({
        title: "تم الاشتراك بنجاح!",
        description: `تم تفعيل اشتراكك في ${pkg.name} لمدة ${pkg.duration_months} شهر`,
      });

      // Navigate back to main app
      navigate('/');
      
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "خطأ في الاشتراك",
        description: "حدث خطأ أثناء عملية الاشتراك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button - Fixed positioning with better visibility */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            <span className="font-medium">العودة</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            باقات الاشتراك
          </h1>
          <p className="text-xl text-gray-300">
            اختر الباقة المناسبة لاحتياجاتك الاستثمارية
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                pkg.is_popular 
                  ? 'border-yellow-500 shadow-xl shadow-yellow-500/20' 
                  : 'border-gray-700/50 hover:border-purple-500/50'
              }`}
            >
              {/* Popular Badge */}
              {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                    <Crown className="w-4 h-4 fill-current" />
                    <span>المختارة</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  pkg.is_popular 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-br from-purple-600 to-blue-600'
                }`}>
                  {pkg.is_popular ? (
                    <Crown className="w-8 h-8 text-white fill-current" />
                  ) : (
                    <Star className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'ar' ? pkg.name : pkg.name_en}
                </h3>
                
                <p className="text-gray-400 mb-6">
                  {language === 'ar' ? pkg.description : pkg.description_en}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-white">{pkg.price}</span>
                    <div className="text-gray-400">
                      <span>ر.س</span>
                      <span className="text-sm block">/{pkg.duration_months} شهر</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {(language === 'ar' ? pkg.features : pkg.features_en).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      pkg.is_popular ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(pkg)}
                disabled={subscribing === pkg.id}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                  pkg.is_popular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg shadow-yellow-500/25'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                } ${subscribing === pkg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {subscribing === pkg.id ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>اشترك الآن</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">
            جميع الباقات تشمل ضمان استرداد المال خلال 30 يوم
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>إلغاء في أي وقت</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>دعم فني 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>تحديثات مجانية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPackages;