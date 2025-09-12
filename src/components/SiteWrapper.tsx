import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { MaintenanceMode } from './MaintenanceMode';

import Index from '../pages/Index';
import Auth from '../pages/Auth';
import SubscriptionPackages from '../pages/SubscriptionPackages';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';

export const SiteWrapper = () => {
  const { settings, loading } = useSiteSettingsContext();

  // Update document title and meta tags based on site settings
  useEffect(() => {
    if (!loading) {
      document.title = settings.seoSettings.metaTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', settings.seoSettings.metaDescription);

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', settings.seoSettings.keywords);

      // Update favicon
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        document.head.appendChild(favicon);
      }
      favicon.href = settings.faviconUrl;

      // Update CSS custom properties for theme colors
      const root = document.documentElement;
      root.style.setProperty('--site-primary', settings.primaryColor);
      root.style.setProperty('--site-secondary', settings.secondaryColor);
    }
  }, [settings, loading]);

  // Show loading state while settings are being loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  // Show maintenance mode if enabled (except for admin routes)
  const isAdminRoute = location.pathname.startsWith('/tadawladmin');
  if (settings.maintenanceMode && !isAdminRoute) {
    return <MaintenanceMode />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/packages" element={<SubscriptionPackages />} />
      <Route path="/tadawladmin" element={<AdminLogin />} />
      <Route path="/tadawladmin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};