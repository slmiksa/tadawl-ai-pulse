import React, { createContext, useContext, ReactNode } from 'react';
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const siteSettingsData = useSiteSettings();

  return (
    <SiteSettingsContext.Provider value={siteSettingsData}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettingsContext = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettingsContext must be used within a SiteSettingsProvider');
  }
  return context;
};