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
  Loader2,
  Upload,
  Image,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxUsersPerDay: number;
  sessionTimeout: number;
  primaryColor: string;
  secondaryColor: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSMSNotifications: boolean;
}

const defaultConfig: SiteConfig = {
  siteName: 'تداول الذكي',
  siteDescription: 'منصة متقدمة لتداول الأسهم السعودية مع ميزات الذكاء الاصطناعي والتحليل المتقدم',
  contactEmail: 'info@tadawlai.com',
  faviconUrl: '/favicon.ico',
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: true,
  maxUsersPerDay: 1000,
  sessionTimeout: 24,
  primaryColor: '#000000',
  secondaryColor: '#666666',
  metaTitle: 'تداول الذكي - منصة ذكية لتداول الأسهم',
  metaDescription: 'منصة متقدمة لتداول الأسهم السعودية مع ميزات الذكاء الاصطناعي والتحليل المتقدم',
  metaKeywords: 'تداول, أسهم, السعودية, ذكي, استثمار',
  enableEmailNotifications: true,
  enablePushNotifications: true,
  enableSMSNotifications: false
};

export const SiteSettings = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { reload } = useSiteSettingsContext();

  // Load site settings from database
  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_site_settings');
      
      if (error) {
        console.error('Error loading settings:', error);
        toast.error(`خطأ في تحميل الإعدادات: ${error.message}`);
        // Use default config on error
        setConfig(defaultConfig);
      } else {
        // Transform the data from database format (grouped categories) to SiteConfig
        const d: any = data || {};
        const transformedConfig: SiteConfig = {
          siteName: d.general?.siteName ?? defaultConfig.siteName,
          siteDescription: d.general?.siteDescription ?? defaultConfig.siteDescription,
          contactEmail: d.general?.contactEmail ?? defaultConfig.contactEmail,
          faviconUrl: d.appearance?.faviconUrl ?? defaultConfig.faviconUrl,
          maintenanceMode: d.security?.maintenanceMode ?? defaultConfig.maintenanceMode,
          allowRegistration: d.security?.registrationEnabled ?? defaultConfig.allowRegistration,
          requireEmailVerification: d.security?.emailVerificationRequired ?? defaultConfig.requireEmailVerification,
          maxUsersPerDay: d.security?.maxUsersPerDay ?? defaultConfig.maxUsersPerDay,
          sessionTimeout: d.security?.sessionTimeout ?? defaultConfig.sessionTimeout,
          primaryColor: d.appearance?.primaryColor ?? defaultConfig.primaryColor,
          secondaryColor: d.appearance?.secondaryColor ?? defaultConfig.secondaryColor,
          metaTitle: d.seo?.metaTitle ?? defaultConfig.metaTitle,
          metaDescription: d.seo?.metaDescription ?? defaultConfig.metaDescription,
          metaKeywords: d.seo?.keywords ?? defaultConfig.metaKeywords,
          enableEmailNotifications: d.notifications?.emailNotifications ?? defaultConfig.enableEmailNotifications,
          enablePushNotifications: d.notifications?.pushNotifications ?? defaultConfig.enablePushNotifications,
          enableSMSNotifications: d.notifications?.smsNotifications ?? defaultConfig.enableSMSNotifications,
        };
        setConfig(transformedConfig);
      }
    } catch (error: any) {
      console.error('Unexpected error loading settings:', error);
      toast.error('حدث خطأ أثناء تحميل الإعدادات');
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة (PNG, JPG, JPEG, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('يرجى اختيار ملف أصغر من 2 ميجابايت');
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      updateConfig('faviconUrl', publicUrlData.publicUrl);

      toast.success('تم رفع الأيقونة بنجاح');
    } catch (error: any) {
      console.error('Error uploading favicon:', error);
      toast.error(error.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaveLoading(true);
      
      // Transform SiteConfig to database format (grouped categories)
      const dbData = {
        general: {
          siteName: config.siteName,
          siteDescription: config.siteDescription,
          contactEmail: config.contactEmail,
        },
        appearance: {
          faviconUrl: config.faviconUrl,
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
        },
        security: {
          maintenanceMode: config.maintenanceMode,
          registrationEnabled: config.allowRegistration,
          emailVerificationRequired: config.requireEmailVerification,
          maxUsersPerDay: config.maxUsersPerDay,
          sessionTimeout: config.sessionTimeout,
        },
        seo: {
          metaTitle: config.metaTitle,
          metaDescription: config.metaDescription,
          keywords: config.metaKeywords,
        },
        notifications: {
          emailNotifications: config.enableEmailNotifications,
          pushNotifications: config.enablePushNotifications,
          smsNotifications: config.enableSMSNotifications,
        }
      };

      const { data, error } = await supabase.rpc('update_site_settings', {
        settings_data: dbData
      });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error(`خطأ في حفظ الإعدادات: ${error.message}`);
      } else {
        toast.success('تم حفظ الإعدادات بنجاح');
        try { reload(); } catch {}
      }
    } catch (error: any) {
      console.error('Unexpected error saving settings:', error);
      toast.error('حدث خطأ غير متوقع أثناء حفظ الإعدادات');
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateConfig = (key: keyof SiteConfig, value: any) => {
    setConfig(prev => prev ? { ...prev, [key]: value } : null);
  };

  const updateNestedConfig = (parent: keyof SiteConfig, key: string, value: any) => {
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

      {/* Branding Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-primary" />
            العلامة التجارية
          </CardTitle>
          <CardDescription>
            إدارة اسم الموقع وأيقونة علامة التبويب
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandingSiteName">اسم الموقع</Label>
                <Input
                  id="brandingSiteName"
                  value={config.siteName}
                  onChange={(e) => updateConfig('siteName', e.target.value)}
                  placeholder="أدخل اسم الموقع"
                />
                <p className="text-xs text-muted-foreground">
                  سيظهر في عنوان علامة التبويب والشعار
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="favicon">أيقونة علامة التبويب (Favicon)</Label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Input
                        id="faviconUrl"
                        value={config.faviconUrl}
                        onChange={(e) => updateConfig('faviconUrl', e.target.value)}
                        placeholder="رابط الأيقونة أو المسار المحفوظ"
                        className="flex-1"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploading}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>رفع</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ضع رابط الأيقونة أو ارفع ملف من جهازك
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-8 h-8 border border-border rounded-md bg-background p-1">
                      {config.faviconUrl ? (
                        <img 
                          src={config.faviconUrl} 
                          alt="Favicon preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Image className="w-full h-full text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>نصيحة:</strong> استخدم صور PNG أو JPG بحجم 32x32 أو 16x16 بكسل للحصول على أفضل جودة
                </p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                  <strong>مهم:</strong> ملفات ICO غير مدعومة حالياً. يُرجى استخدام PNG أو JPG
                </p>
              </div>

              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  <strong>معاينة مباشرة:</strong> ستظهر التغييرات فوراً في عنوان علامة التبويب الحالية بعد الحفظ
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Label htmlFor="siteDescription">وصف الموقع</Label>
              <Textarea
                id="siteDescription"
                value={config.siteDescription}
                onChange={(e) => updateConfig('siteDescription', e.target.value)}
                rows={3}
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
              <p className="text-sm text-muted-foreground">تفعيل وضع الصيانة يمنع المستخدمين من الوصول للموقع</p>
            </div>
            <Switch
              checked={config.maintenanceMode}
              onCheckedChange={(value) => updateConfig('maintenanceMode', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>السماح بالتسجيل الجديد</Label>
              <p className="text-sm text-muted-foreground">تمكين أو تعطيل التسجيلات الجديدة</p>
            </div>
            <Switch
              checked={config.allowRegistration}
              onCheckedChange={(value) => updateConfig('allowRegistration', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل البريد الإلكتروني مطلوب</Label>
              <p className="text-sm text-muted-foreground">إجبار المستخدمين على تفعيل بريدهم الإلكتروني</p>
            </div>
            <Switch
              checked={config.requireEmailVerification}
              onCheckedChange={(value) => updateConfig('requireEmailVerification', value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsersPerDay">الحد الأقصى للمستخدمين الجدد يومياً</Label>
              <Input
                id="maxUsersPerDay"
                type="number"
                value={config.maxUsersPerDay}
                onChange={(e) => updateConfig('maxUsersPerDay', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">انتهاء الجلسة (ساعة)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value) || 0)}
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
              <Input
                id="primaryColor"
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">اللون الثانوي</Label>
              <Input
                id="secondaryColor"
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateConfig('secondaryColor', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" />
            إعدادات تحسين محركات البحث (SEO)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">عنوان صفحة الموقع</Label>
            <Input
              id="metaTitle"
              value={config.metaTitle}
              onChange={(e) => updateConfig('metaTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">وصف صفحة الموقع</Label>
            <Textarea
              id="metaDescription"
              value={config.metaDescription}
              onChange={(e) => updateConfig('metaDescription', e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">الكلمات المفتاحية</Label>
            <Input
              id="metaKeywords"
              value={config.metaKeywords}
              onChange={(e) => updateConfig('metaKeywords', e.target.value)}
              placeholder="افصل الكلمات بفاصلة"
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
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات عبر البريد الإلكتروني</Label>
              <p className="text-sm text-muted-foreground">تمكين إرسال الإشعارات عبر البريد الإلكتروني</p>
            </div>
            <Switch
              checked={config.enableEmailNotifications}
              onCheckedChange={(value) => updateConfig('enableEmailNotifications', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات المدفوعة</Label>
              <p className="text-sm text-muted-foreground">تمكين الإشعارات المدفوعة عبر المتصفح</p>
            </div>
            <Switch
              checked={config.enablePushNotifications}
              onCheckedChange={(value) => updateConfig('enablePushNotifications', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>الإشعارات عبر الرسائل النصية</Label>
              <p className="text-sm text-muted-foreground">تمكين إرسال الإشعارات عبر SMS</p>
            </div>
            <Switch
              checked={config.enableSMSNotifications}
              onCheckedChange={(value) => updateConfig('enableSMSNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};