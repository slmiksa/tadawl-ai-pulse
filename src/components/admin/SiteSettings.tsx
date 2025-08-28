import { useState } from 'react';
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
  Bell
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setSaveLoading] = useState(false);

  const handleSave = async () => {
    setSaveLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "تم حفظ الإعدادات بنجاح",
      description: "تم تطبيق جميع التغييرات على النظام",
    });
    
    setSaveLoading(false);
  };

  const updateConfig = (key: keyof SiteConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedConfig = (parent: keyof SiteConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">إعدادات الموقع</h2>
          <p className="text-muted-foreground">إدارة الإعدادات العامة للمنصة</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="gradient-bg"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="spinner w-4 h-4 mr-2"></div>
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