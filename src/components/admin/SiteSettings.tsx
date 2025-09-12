import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Shield,
  Database,
  Palette,
  Bell,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  twoFactorEnabled: boolean;
  maxUsersPerDay: number;
  sessionTimeout: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  socialMediaLinks: {
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
}

const defaultConfig: SiteConfig = {
  siteName: 'تداول الذكي',
  siteDescription: 'منصة ذكية لتداول الأسهم السعودية',
  contactEmail: 'info@tadawlai.com',
  supportEmail: 'support@tadawlai.com',
  maintenanceMode: false,
  registrationEnabled: true,
  emailVerificationRequired: false,
  twoFactorEnabled: false,
  maxUsersPerDay: 100,
  sessionTimeout: 30,
  primaryColor: '#8B5CF6',
  secondaryColor: '#06B6D4',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  socialMediaLinks: {
    twitter: '',
    linkedin: '',
    facebook: ''
  },
  seoSettings: {
    metaTitle: 'تداول الذكي - منصة ذكية لتداول الأسهم',
    metaDescription: 'منصة متقدمة لتداول الأسهم السعودية مع ميزات الذكاء الاصطناعي والتحليل المتقدم',
    keywords: 'تداول, أسهم, السعودية, ذكي, استثمار'
  },
  notificationSettings: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  }
};

export const SiteSettings = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load site settings from database
  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_site_settings');
      
      if (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "خطأ في تحميل الإعدادات",
          description: "حدث خطأ أثناء تحميل إعدادات الموقع",
          variant: "destructive"
        });
        // Fallback to default config
        setConfig(defaultConfig);
        return;
      }

      // Transform database structure to component structure
      const dbData = data as any; // Type assertion for complex JSON structure
      const transformedConfig: SiteConfig = {
        siteName: dbData?.general?.siteName || defaultConfig.siteName,
        siteDescription: dbData?.general?.siteDescription || defaultConfig.siteDescription,
        contactEmail: dbData?.general?.contactEmail || defaultConfig.contactEmail,
        supportEmail: dbData?.general?.supportEmail || defaultConfig.supportEmail,
        maintenanceMode: dbData?.security?.maintenanceMode || defaultConfig.maintenanceMode,
        registrationEnabled: dbData?.security?.registrationEnabled || defaultConfig.registrationEnabled,
        emailVerificationRequired: dbData?.security?.emailVerificationRequired || defaultConfig.emailVerificationRequired,
        twoFactorEnabled: dbData?.security?.twoFactorEnabled || defaultConfig.twoFactorEnabled,
        maxUsersPerDay: dbData?.security?.maxUsersPerDay || defaultConfig.maxUsersPerDay,
        sessionTimeout: dbData?.security?.sessionTimeout || defaultConfig.sessionTimeout,
        primaryColor: dbData?.appearance?.primaryColor || defaultConfig.primaryColor,
        secondaryColor: dbData?.appearance?.secondaryColor || defaultConfig.secondaryColor,
        logoUrl: dbData?.appearance?.logoUrl || defaultConfig.logoUrl,
        faviconUrl: dbData?.appearance?.faviconUrl || defaultConfig.faviconUrl,
        socialMediaLinks: {
          twitter: dbData?.social_media?.twitter || defaultConfig.socialMediaLinks.twitter,
          linkedin: dbData?.social_media?.linkedin || defaultConfig.socialMediaLinks.linkedin,
          facebook: dbData?.social_media?.facebook || defaultConfig.socialMediaLinks.facebook
        },
        seoSettings: {
          metaTitle: dbData?.seo?.metaTitle || defaultConfig.seoSettings.metaTitle,
          metaDescription: dbData?.seo?.metaDescription || defaultConfig.seoSettings.metaDescription,
          keywords: dbData?.seo?.keywords || defaultConfig.seoSettings.keywords
        },
        notificationSettings: {
          emailNotifications: dbData?.notifications?.emailNotifications || defaultConfig.notificationSettings.emailNotifications,
          pushNotifications: dbData?.notifications?.pushNotifications || defaultConfig.notificationSettings.pushNotifications,
          smsNotifications: dbData?.notifications?.smsNotifications || defaultConfig.notificationSettings.smsNotifications
        }
      };

      setConfig(transformedConfig);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع",
        variant: "destructive"
      });
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to database
  const handleSave = async () => {
    if (!config) return;
    
    setSaveLoading(true);
    
    try {
      // Transform component structure to database structure
      const settingsData = {
        general: {
          siteName: config.siteName,
          siteDescription: config.siteDescription,
          contactEmail: config.contactEmail,
          supportEmail: config.supportEmail
        },
        security: {
          maintenanceMode: config.maintenanceMode,
          registrationEnabled: config.registrationEnabled,
          emailVerificationRequired: config.emailVerificationRequired,
          twoFactorEnabled: config.twoFactorEnabled,
          maxUsersPerDay: config.maxUsersPerDay,
          sessionTimeout: config.sessionTimeout
        },
        appearance: {
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
          logoUrl: config.logoUrl,
          faviconUrl: config.faviconUrl
        },
        social_media: {
          twitter: config.socialMediaLinks.twitter,
          linkedin: config.socialMediaLinks.linkedin,
          facebook: config.socialMediaLinks.facebook
        },
        seo: {
          metaTitle: config.seoSettings.metaTitle,
          metaDescription: config.seoSettings.metaDescription,
          keywords: config.seoSettings.keywords
        },
        notifications: {
          emailNotifications: config.notificationSettings.emailNotifications,
          pushNotifications: config.notificationSettings.pushNotifications,
          smsNotifications: config.notificationSettings.smsNotifications
        }
      };

      const { error } = await supabase.rpc('update_site_settings', {
        settings_data: settingsData
      });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "خطأ في حفظ الإعدادات",
          description: "حدث خطأ أثناء حفظ إعدادات الموقع",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تطبيق جميع التغييرات على النظام",
      });
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ إعدادات الموقع",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const updateConfig = (key: keyof SiteConfig, value: any) => {
    if (!config) return;
    setConfig(prev => prev ? { ...prev, [key]: value } : null);
  };

  const updateNestedConfig = (parent: keyof SiteConfig, key: string, value: any) => {
    if (!config) return;
    setConfig(prev => prev ? ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value
      }
    }) : null);
  };

  // Show loading state
  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جارٍ تحميل إعدادات الموقع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">إعدادات الموقع</h2>
          <p className="text-muted-foreground">إدارة الإعدادات العامة للمنصة</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saveLoading}
          className="gradient-bg"
        >
          {saveLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جارٍ الحفظ...
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      {/* General Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            الإعدادات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">اسم الموقع</Label>
              <Input
                id="siteName"
                value={config.siteName}
                onChange={(e) => updateConfig('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">البريد الإلكتروني للتواصل</Label>
              <Input
                id="contactEmail"
                type="email"
                value={config.contactEmail}
                onChange={(e) => updateConfig('contactEmail', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">وصف الموقع</Label>
            <Textarea
              id="siteDescription"
              value={config.siteDescription}
              onChange={(e) => updateConfig('siteDescription', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            إعدادات الأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>وضع الصيانة</Label>
              <p className="text-sm text-muted-foreground">
                تعطيل الوصول للموقع مؤقتاً للصيانة
              </p>
            </div>
            <Switch
              checked={config.maintenanceMode}
              onCheckedChange={(checked) => updateConfig('maintenanceMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل التسجيل</Label>
              <p className="text-sm text-muted-foreground">
                السماح للمستخدمين الجدد بالتسجيل
              </p>
            </div>
            <Switch
              checked={config.registrationEnabled}
              onCheckedChange={(checked) => updateConfig('registrationEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تأكيد البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">
                طلب تأكيد البريد الإلكتروني عند التسجيل
              </p>
            </div>
            <Switch
              checked={config.emailVerificationRequired}
              onCheckedChange={(checked) => updateConfig('emailVerificationRequired', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">الحد الأقصى للمستخدمين الجدد يومياً</Label>
              <Input
                id="maxUsers"
                type="number"
                value={config.maxUsersPerDay}
                onChange={(e) => updateConfig('maxUsersPerDay', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">انتهاء الجلسة (بالدقائق)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            إعدادات المظهر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">اللون الأساسي</Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => updateConfig('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={config.primaryColor}
                  onChange={(e) => updateConfig('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">اللون الثانوي</Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={config.secondaryColor}
                  onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            إعدادات SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">عنوان الصفحة (Meta Title)</Label>
            <Input
              id="metaTitle"
              value={config.seoSettings.metaTitle}
              onChange={(e) => updateNestedConfig('seoSettings', 'metaTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">وصف الصفحة (Meta Description)</Label>
            <Textarea
              id="metaDescription"
              value={config.seoSettings.metaDescription}
              onChange={(e) => updateNestedConfig('seoSettings', 'metaDescription', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">الكلمات المفتاحية</Label>
            <Input
              id="keywords"
              value={config.seoSettings.keywords}
              onChange={(e) => updateNestedConfig('seoSettings', 'keywords', e.target.value)}
              placeholder="افصل بين الكلمات بفاصلة"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات بالبريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">
                إرسال إشعارات عبر البريد الإلكتروني
              </p>
            </div>
            <Switch
              checked={config.notificationSettings.emailNotifications}
              onCheckedChange={(checked) => 
                updateNestedConfig('notificationSettings', 'emailNotifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات المنبثقة</Label>
              <p className="text-sm text-muted-foreground">
                إرسال إشعارات منبثقة في المتصفح
              </p>
            </div>
            <Switch
              checked={config.notificationSettings.pushNotifications}
              onCheckedChange={(checked) => 
                updateNestedConfig('notificationSettings', 'pushNotifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات النصية</Label>
              <p className="text-sm text-muted-foreground">
                إرسال إشعارات عبر الرسائل النصية
              </p>
            </div>
            <Switch
              checked={config.notificationSettings.smsNotifications}
              onCheckedChange={(checked) => 
                updateNestedConfig('notificationSettings', 'smsNotifications', checked)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};