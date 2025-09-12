import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { SiteWrapper } from './components/SiteWrapper';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <SiteSettingsProvider>
          <BrowserRouter>
            <SiteWrapper />
            <Toaster />
          </BrowserRouter>
        </SiteSettingsProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </StrictMode>
);
