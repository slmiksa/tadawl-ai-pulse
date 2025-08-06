import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  isLoading: boolean;
}

const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.favorites': 'المفضلة',
    'nav.performance': 'الأداء',
    'nav.news': 'الأخبار',
    'nav.profile': 'الملف الشخصي',
    'nav.subscription': 'الاشتراك',
    'nav.notifications': 'الإشعارات',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.totalStocks': 'إجمالي الأسهم',
    'dashboard.positiveStocks': 'أسهم صاعدة',
    'dashboard.negativeStocks': 'أسهم هابطة',
    'dashboard.buyRecommendations': 'توصيات شراء',
    'dashboard.loading': 'جارٍ تحميل بيانات الأسهم...',
    'dashboard.error': 'خطأ في جلب البيانات',
    'dashboard.retry': 'إعادة المحاولة',
    'dashboard.noStocks': 'لا توجد أسهم متاحة',
    
    // Stock Card
    'stock.buy': 'شراء',
    'stock.sell': 'بيع',
    'stock.hold': 'انتظار',
    'stock.viewDetails': 'عرض التفاصيل',
    'stock.high': 'عالي',
    'stock.low': 'منخفض',
    'stock.realData': 'حقيقي',
    'stock.demoData': 'تجريبي',
    'stock.lastUpdate': 'آخر تحديث',
    'stock.us': 'أمريكي',
    'stock.saudi': 'سعودي',
    
    // Favorites
    'favorites.title': 'الأسهم المفضلة',
    'favorites.subtitle': 'متابعة سريعة للأسهم التي تهمك',
    'favorites.total': 'إجمالي المفضلة',
    'favorites.profitable': 'أسهم رابحة',
    'favorites.buyRecommendations': 'توصيات شراء',
    'favorites.empty': 'لا توجد أسهم مفضلة',
    'favorites.emptySubtitle': 'أضف أسهماً إلى المفضلة لمتابعتها بسهولة من صفحة الرئيسية',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.subtitle': 'إدارة حسابك وتخصيص تجربتك',
    'profile.edit': 'تعديل',
    'profile.cancel': 'إلغاء',
    'profile.save': 'حفظ',
    'profile.email': 'البريد الإلكتروني',
    'profile.phone': 'رقم الجوال',
    'profile.joinDate': 'تاريخ الانضمام',
    'profile.experience': 'مستوى الخبرة',
    'profile.notSpecified': 'غير محدد',
    'profile.stats': 'إحصائيات الحساب',
    'profile.recommendations': 'توصية متابعة',
    'profile.successfulTrades': 'صفقة ناجحة',
    'profile.favoriteStocks': 'أسهم مفضلة',
    'profile.activeDays': 'يوم نشط',
    'profile.accuracy': 'دقة المتابعة',
    'profile.settings': 'الإعدادات',
    'profile.language': 'اللغة',
    'profile.timezone': 'المنطقة الزمنية',
    'profile.logout': 'تسجيل الخروج',
    'profile.logoutSubtitle': 'تسجيل الخروج من حسابك',
    'profile.beginner': 'مبتدئ',
    'profile.intermediate': 'متوسط',
    'profile.advanced': 'متقدم',
    'profile.expert': 'خبير',
    
    // Market Selector
    'market.all': 'جميع الأسواق',
    'market.us': 'السوق الأمريكي',
    'market.saudi': 'السوق السعودي',
    
    // News
    'news.title': 'آخر أخبار الأسواق',
    'news.subtitle': 'تابع أحدث الأخبار والتحليلات المالية',
    'news.refresh': 'تحديث',
    'news.lastUpdated': 'آخر تحديث',
    'news.readMore': 'اقرأ المزيد',
    'news.loading': 'جارٍ تحميل الأخبار...',
    'news.error': 'خطأ في تحميل الأخبار',
    'news.noNews': 'لا توجد أخبار متاحة',
    
    // Performance
    'performance.title': 'أداء التوصيات',
    'performance.subtitle': 'إحصائيات شاملة لأداء الذكاء الاصطناعي',
    'performance.totalRecommendations': 'إجمالي التوصيات',
    'performance.successfulRecommendations': 'التوصيات الناجحة',
    'performance.accuracy': 'نسبة الدقة',
    'performance.totalProfit': 'إجمالي الربح',
    'performance.recentDays': 'الأداء خلال الأيام الماضية',
    'performance.date': 'التاريخ',
    'performance.recommendations': 'التوصيات',
    'performance.successful': 'الناجحة',
    'performance.performance': 'الأداء',
    'performance.topPerformers': 'أفضل الأسهم أداءً هذا الأسبوع',
    'performance.recommendation': 'توصية',
    
    // Today Analysis
    'analysis.title': 'تحليلات اليوم',
    'analysis.subtitle': 'أقوى الفرص والتحليلات للأسواق المالية اليوم - بيانات حقيقية',
    'analysis.usMarket': 'السوق الأمريكي',
    'analysis.saudiMarket': 'السوق السعودي',
    'analysis.status': 'الحالة',
    'analysis.change': 'التغيير',
    'analysis.volume': 'حجم التداول',
    'analysis.open': 'مفتوح',
    'analysis.closed': 'مغلق',
    'analysis.opportunities': 'أقوى الفرص اليوم - بيانات حقيقية',
    'analysis.loading': 'جارٍ تحميل الفرص...',
    'analysis.systemUpdates': 'تحديثات النظام',
    'analysis.strong': 'قوية',
    'analysis.medium': 'متوسطة',
    'analysis.weak': 'ضعيفة',
    'analysis.positive': 'إيجابي',
    'analysis.negative': 'سلبي',
    'analysis.neutral': 'محايد',
    
    // Subscriptions
    'subscriptions.title': 'باقات الاشتراك',
    'subscriptions.subtitle': 'اختر الباقة المناسبة لاحتياجاتك الاستثمارية',
    'subscriptions.currentPackage': 'الباقة الحالية',
    'subscriptions.active': 'نشطة',
    'subscriptions.activeDntil': 'نشطة حتى',
    'subscriptions.basicPackage': 'الباقة الأساسية',
    'subscriptions.proPackage': 'باقة البرو',
    'subscriptions.perMonth': 'ريال/شهر',
    'subscriptions.ideal': 'مثالية للمبتدئين في التداول',
    'subscriptions.professional': 'للمتداولين المحترفين والجادين',
    'subscriptions.mostPopular': 'الأكثر شعبية',
    'subscriptions.subscribe': 'اشترك الآن',
    'subscriptions.current': 'الباقة الحالية',
    'subscriptions.featuresComparison': 'مقارنة الميزات',
    'subscriptions.smartAnalytics': 'تحليلات ذكية',
    'subscriptions.smartAnalyticsDesc': 'تحليلات مدعومة بالذكاء الاصطناعي لاتخاذ قرارات أفضل',
    'subscriptions.technicalIndicators': 'مؤشرات تقنية',
    'subscriptions.technicalIndicatorsDesc': 'مؤشرات متقدمة لتحليل الاتجاهات والفرص',
    'subscriptions.instantAlerts': 'تنبيهات فورية',
    'subscriptions.instantAlertsDesc': 'تنبيهات مخصصة للفرص الاستثمارية المهمة',
    'subscriptions.riskManagement': 'إدارة المخاطر',
    'subscriptions.riskManagementDesc': 'أدوات متقدمة لإدارة وتقليل المخاطر',
    
    // Common
    'common.loading': 'جارٍ التحميل...',
    'common.error': 'خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.refresh': 'تحديث',
    'common.search': 'البحث',
    'common.logout': 'خروج',
    
    // Search
    'search.placeholder': 'ابحث عن سهم بالرمز أو الاسم...',
    'search.noResults': 'لا توجد نتائج للبحث',
    'search.popular': 'أسهم شائعة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.performance': 'Performance',
    'nav.news': 'News',
    'nav.profile': 'Profile',
    'nav.subscription': 'Subscription',
    'nav.notifications': 'Notifications',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.totalStocks': 'Total Stocks',
    'dashboard.positiveStocks': 'Rising Stocks',
    'dashboard.negativeStocks': 'Falling Stocks',
    'dashboard.buyRecommendations': 'Buy Recommendations',
    'dashboard.loading': 'Loading stock data...',
    'dashboard.error': 'Error fetching data',
    'dashboard.retry': 'Retry',
    'dashboard.noStocks': 'No stocks available',
    
    // Stock Card
    'stock.buy': 'Buy',
    'stock.sell': 'Sell',
    'stock.hold': 'Hold',
    'stock.viewDetails': 'View Details',
    'stock.high': 'High',
    'stock.low': 'Low',
    'stock.realData': 'Real',
    'stock.demoData': 'Demo',
    'stock.lastUpdate': 'Last update',
    'stock.us': 'US',
    'stock.saudi': 'Saudi',
    
    // Favorites
    'favorites.title': 'Favorite Stocks',
    'favorites.subtitle': 'Quick monitoring of your preferred stocks',
    'favorites.total': 'Total Favorites',
    'favorites.profitable': 'Profitable Stocks',
    'favorites.buyRecommendations': 'Buy Recommendations',
    'favorites.empty': 'No favorite stocks',
    'favorites.emptySubtitle': 'Add stocks to favorites to easily track them from the homepage',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account and customize your experience',
    'profile.edit': 'Edit',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.joinDate': 'Join Date',
    'profile.experience': 'Experience Level',
    'profile.notSpecified': 'Not specified',
    'profile.stats': 'Account Statistics',
    'profile.recommendations': 'recommendations followed',
    'profile.successfulTrades': 'successful trades',
    'profile.favoriteStocks': 'favorite stocks',
    'profile.activeDays': 'active days',
    'profile.accuracy': 'follow accuracy',
    'profile.settings': 'Settings',
    'profile.language': 'Language',
    'profile.timezone': 'Timezone',
    'profile.logout': 'Logout',
    'profile.logoutSubtitle': 'Sign out of your account',
    'profile.beginner': 'Beginner',
    'profile.intermediate': 'Intermediate',
    'profile.advanced': 'Advanced',
    'profile.expert': 'Expert',
    
    // Market Selector
    'market.all': 'All Markets',
    'market.us': 'US Market',
    'market.saudi': 'Saudi Market',
    
    // News
    'news.title': 'Latest Market News',
    'news.subtitle': 'Follow the latest news and financial analysis',
    'news.refresh': 'Refresh',
    'news.lastUpdated': 'Last updated',
    'news.readMore': 'Read More',
    'news.loading': 'Loading news...',
    'news.error': 'Error loading news',
    'news.noNews': 'No news available',
    
    // Performance
    'performance.title': 'Recommendation Performance',
    'performance.subtitle': 'Comprehensive AI performance statistics',
    'performance.totalRecommendations': 'Total Recommendations',
    'performance.successfulRecommendations': 'Successful Recommendations',
    'performance.accuracy': 'Accuracy Rate',
    'performance.totalProfit': 'Total Profit',
    'performance.recentDays': 'Performance in Recent Days',
    'performance.date': 'Date',
    'performance.recommendations': 'Recommendations',
    'performance.successful': 'Successful',
    'performance.performance': 'Performance',
    'performance.topPerformers': 'Top Performing Stocks This Week',
    'performance.recommendation': 'recommendation',
    
    // Today Analysis
    'analysis.title': 'Today\'s Analysis',
    'analysis.subtitle': 'Top opportunities and analysis for today\'s financial markets - real data',
    'analysis.usMarket': 'US Market',
    'analysis.saudiMarket': 'Saudi Market',
    'analysis.status': 'Status',
    'analysis.change': 'Change',
    'analysis.volume': 'Volume',
    'analysis.open': 'Open',
    'analysis.closed': 'Closed',
    'analysis.opportunities': 'Top Opportunities Today - Real Data',
    'analysis.loading': 'Loading opportunities...',
    'analysis.systemUpdates': 'System Updates',
    'analysis.strong': 'Strong',
    'analysis.medium': 'Medium',
    'analysis.weak': 'Weak',
    'analysis.positive': 'Positive',
    'analysis.negative': 'Negative',
    'analysis.neutral': 'Neutral',
    
    // Subscriptions
    'subscriptions.title': 'Subscription Plans',
    'subscriptions.subtitle': 'Choose the plan that suits your investment needs',
    'subscriptions.currentPackage': 'Current Plan',
    'subscriptions.active': 'Active',
    'subscriptions.activeDntil': 'Active until',
    'subscriptions.basicPackage': 'Basic Plan',
    'subscriptions.proPackage': 'Pro Plan',
    'subscriptions.perMonth': 'SAR/month',
    'subscriptions.ideal': 'Ideal for trading beginners',
    'subscriptions.professional': 'For professional and serious traders',
    'subscriptions.mostPopular': 'Most Popular',
    'subscriptions.subscribe': 'Subscribe Now',
    'subscriptions.current': 'Current Plan',
    'subscriptions.featuresComparison': 'Features Comparison',
    'subscriptions.smartAnalytics': 'Smart Analytics',
    'subscriptions.smartAnalyticsDesc': 'AI-powered analytics for better decision making',
    'subscriptions.technicalIndicators': 'Technical Indicators',
    'subscriptions.technicalIndicatorsDesc': 'Advanced indicators for trend and opportunity analysis',
    'subscriptions.instantAlerts': 'Instant Alerts',
    'subscriptions.instantAlertsDesc': 'Custom alerts for important investment opportunities',
    'subscriptions.riskManagement': 'Risk Management',
    'subscriptions.riskManagementDesc': 'Advanced tools for managing and reducing risks',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.refresh': 'Refresh',
    'common.search': 'Search',
    'common.logout': 'Logout',
    
    // Search
    'search.placeholder': 'Search for stock by symbol or name...',
    'search.noResults': 'No search results found',
    'search.popular': 'Popular Stocks',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language from user settings or localStorage
    const loadLanguage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: settings } = await supabase
            .from('user_settings')
            .select('language')
            .eq('user_id', user.id)
            .single();
          
          if (settings?.language) {
            setLanguageState(settings.language as Language);
          }
        } else {
          const savedLang = localStorage.getItem('language') as Language;
          if (savedLang) {
            setLanguageState(savedLang);
          }
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    // Save to user settings if logged in, otherwise localStorage
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            language: lang
          });
      } else {
        localStorage.setItem('language', lang);
      }
    } catch (error) {
      console.error('Error saving language:', error);
      localStorage.setItem('language', lang);
    }

    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};