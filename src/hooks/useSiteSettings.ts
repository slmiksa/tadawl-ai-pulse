import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
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

const defaultSettings: SiteSettings = {
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
  faviconUrl: '/lovable-uploads/site-icon.png',
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

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get settings from Supabase
      const { data, error: supabaseError } = await supabase.rpc('get_site_settings');
      
      if (supabaseError) {
        console.warn('Could not load site settings from database, using defaults:', supabaseError);
        setSettings(defaultSettings);
        return;
      }

      if (data) {
        // Transform database structure to component structure
        const dbData = data as any;
        const transformedSettings: SiteSettings = {
          siteName: dbData?.general?.siteName || defaultSettings.siteName,
          siteDescription: dbData?.general?.siteDescription || defaultSettings.siteDescription,
          contactEmail: dbData?.general?.contactEmail || defaultSettings.contactEmail,
          supportEmail: dbData?.general?.supportEmail || defaultSettings.supportEmail,
          maintenanceMode: dbData?.security?.maintenanceMode || defaultSettings.maintenanceMode,
          registrationEnabled: dbData?.security?.registrationEnabled || defaultSettings.registrationEnabled,
          emailVerificationRequired: dbData?.security?.emailVerificationRequired || defaultSettings.emailVerificationRequired,
          twoFactorEnabled: dbData?.security?.twoFactorEnabled || defaultSettings.twoFactorEnabled,
          maxUsersPerDay: dbData?.security?.maxUsersPerDay || defaultSettings.maxUsersPerDay,
          sessionTimeout: dbData?.security?.sessionTimeout || defaultSettings.sessionTimeout,
          primaryColor: dbData?.appearance?.primaryColor || defaultSettings.primaryColor,
          secondaryColor: dbData?.appearance?.secondaryColor || defaultSettings.secondaryColor,
          logoUrl: dbData?.appearance?.logoUrl || defaultSettings.logoUrl,
          faviconUrl: dbData?.appearance?.faviconUrl || defaultSettings.faviconUrl,
          socialMediaLinks: {
            twitter: dbData?.social_media?.twitter || defaultSettings.socialMediaLinks.twitter,
            linkedin: dbData?.social_media?.linkedin || defaultSettings.socialMediaLinks.linkedin,
            facebook: dbData?.social_media?.facebook || defaultSettings.socialMediaLinks.facebook
          },
          seoSettings: {
            metaTitle: dbData?.seo?.metaTitle || defaultSettings.seoSettings.metaTitle,
            metaDescription: dbData?.seo?.metaDescription || defaultSettings.seoSettings.metaDescription,
            keywords: dbData?.seo?.keywords || defaultSettings.seoSettings.keywords
          },
          notificationSettings: {
            emailNotifications: dbData?.notifications?.emailNotifications || defaultSettings.notificationSettings.emailNotifications,
            pushNotifications: dbData?.notifications?.pushNotifications || defaultSettings.notificationSettings.pushNotifications,
            smsNotifications: dbData?.notifications?.smsNotifications || defaultSettings.notificationSettings.smsNotifications
          }
        };

        setSettings(transformedSettings);
      } else {
        setSettings(defaultSettings);
      }
    } catch (err) {
      console.warn('Error loading site settings, using defaults:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    reload: loadSettings
  };
};