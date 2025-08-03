import React, { useState, useEffect } from 'react';
import { Crown, Star, Check, Zap, TrendingUp, Shield, Bell, ChartBar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSubscription {
  package_type: 'basic' | 'pro';
  is_active: boolean;
  end_date: string | null;
}

const Subscriptions = () => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (data) {
        setCurrentSubscription({
          package_type: data.package_type as 'basic' | 'pro',
          is_active: data.is_active,
          end_date: data.end_date
        });
      }
    } catch (error) {
      console.log('No active subscription found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageType: 'basic' | 'pro') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "تسجيل الدخول مطلوب",
          description: "يرجى تسجيل الدخول أولاً للاشتراك",
          variant: "destructive",
        });
        return;
      }

      // Deactivate current subscription
      if (currentSubscription) {
        await supabase
          .from('subscriptions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);
      }

      // Create new subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          package_type: packageType,
          is_active: true,
          end_date: endDate.toISOString(),
        });

      if (error) throw error;

      toast({
        title: "تم الاشتراك بنجاح",
        description: `تم تفعيل باقة ${packageType === 'basic' ? 'الأساسية' : 'البرو'} لمدة شهر`,
      });

      fetchSubscription();
    } catch (error: any) {
      toast({
        title: "خطأ في الاشتراك",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const basicFeatures = [
    'عرض جميع الأسهم المتاحة',
    'التوصيات الأساسية اليومية',
    'إضافة الأسهم للمفضلة',
    'تتبع أداء الأسهم',
    'التنبيهات الأساسية',
  ];

  const proFeatures = [
    'جميع مميزات الباقة الأساسية',
    'تحليلات تقنية متقدمة',
    'توصيات مفصلة مع نقاط الدخول والخروج',
    'مستويات الدعم والمقاومة',
    'مؤشرات RSI و MACD',
    'تنبيهات متقدمة ومخصصة',
    'إدارة المحفظة الاستثمارية',
    'تتبع المعاملات والأرباح',
    'تحليل الأداء التفصيلي',
    'دعم فني أولوية',
    'تقارير شهرية مفصلة',
    'وصول مبكر للميزات الجديدة',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">باقات الاشتراك</h1>
        <p className="text-gray-400 text-lg">اختر الباقة المناسبة لاحتياجاتك الاستثمارية</p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 border border-purple-500/50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-lg flex items-center justify-center">
                {currentSubscription.package_type === 'pro' ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <Star className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  الباقة الحالية: {currentSubscription.package_type === 'basic' ? 'الأساسية' : 'البرو'}
                </h3>
                <p className="text-gray-300">
                  نشطة حتى: {currentSubscription.end_date ? new Date(currentSubscription.end_date).toLocaleDateString('ar-SA') : 'غير محدد'}
                </p>
              </div>
            </div>
            <div className="text-green-400 font-semibold">نشطة</div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className={`bg-gray-800 rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
          currentSubscription?.package_type === 'basic' ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700 hover:border-gray-600'
        }`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">الباقة الأساسية</h3>
            <div className="text-4xl font-bold text-white mb-2">
              99 <span className="text-lg text-gray-400">ريال/شهر</span>
            </div>
            <p className="text-gray-400">مثالية للمبتدئين في التداول</p>
          </div>

          <div className="space-y-4 mb-8">
            {basicFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe('basic')}
            disabled={currentSubscription?.package_type === 'basic'}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
              currentSubscription?.package_type === 'basic'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            {currentSubscription?.package_type === 'basic' ? 'الباقة الحالية' : 'اشترك الآن'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`bg-gray-800 rounded-2xl p-8 border transition-all duration-300 hover:scale-105 relative ${
          currentSubscription?.package_type === 'pro' ? 'border-yellow-500 ring-2 ring-yellow-500/50' : 'border-gray-700 hover:border-gray-600'
        }`}>
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              الأكثر شعبية
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">باقة البرو</h3>
            <div className="text-4xl font-bold text-white mb-2">
              299 <span className="text-lg text-gray-400">ريال/شهر</span>
            </div>
            <p className="text-gray-400">للمتداولين المحترفين والجادين</p>
          </div>

          <div className="space-y-4 mb-8">
            {proFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe('pro')}
            disabled={currentSubscription?.package_type === 'pro'}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
              currentSubscription?.package_type === 'pro'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
            }`}
          >
            {currentSubscription?.package_type === 'pro' ? 'الباقة الحالية' : 'اشترك الآن'}
          </button>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">مقارنة الميزات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-4">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto" />
            <h4 className="text-white font-bold">تحليلات ذكية</h4>
            <p className="text-gray-400 text-sm">تحليلات مدعومة بالذكاء الاصطناعي لاتخاذ قرارات أفضل</p>
          </div>
          <div className="text-center space-y-4">
            <ChartBar className="w-12 h-12 text-blue-400 mx-auto" />
            <h4 className="text-white font-bold">مؤشرات تقنية</h4>
            <p className="text-gray-400 text-sm">مؤشرات متقدمة لتحليل الاتجاهات والفرص</p>
          </div>
          <div className="text-center space-y-4">
            <Bell className="w-12 h-12 text-yellow-400 mx-auto" />
            <h4 className="text-white font-bold">تنبيهات فورية</h4>
            <p className="text-gray-400 text-sm">تنبيهات مخصصة للفرص الاستثمارية المهمة</p>
          </div>
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 text-green-400 mx-auto" />
            <h4 className="text-white font-bold">إدارة المخاطر</h4>
            <p className="text-gray-400 text-sm">أدوات متقدمة لإدارة وتقليل المخاطر</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;