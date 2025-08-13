import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Star, Home, BarChart3, Settings, TrendingUp, X, Crown, LogOut, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchModal from './SearchModal';
interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStockSelect?: (stock: any) => void;
}
const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onStockSelect
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const {
    t
  } = useLanguage();
  const navItems = [{
    id: 'home',
    label: t('nav.home'),
    icon: Home
  }, {
    id: 'favorites',
    label: t('nav.favorites'),
    icon: Star
  }, {
    id: 'performance',
    label: t('performance.title'),
    icon: BarChart3
  }, {
    id: 'analysis',
    label: t('analysis.title'),
    icon: TrendingUp
  }, {
    id: 'news',
    label: t('nav.news'),
    icon: Newspaper
  }, {
    id: 'notifications',
    label: t('nav.notifications'),
    icon: Bell
  }, {
    id: 'subscriptions',
    label: t('nav.subscription'),
    icon: Crown
  }, {
    id: 'profile',
    label: t('nav.profile'),
    icon: User
  }];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleStockSelect = (stock: any) => {
    if (onStockSelect) {
      onStockSelect(stock);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };
  return <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">  TadawlAI   </span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <button onClick={() => setIsSearchModalOpen(true)} className="flex items-center justify-center w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => <button key={item.id} onClick={() => handleTabChange(item.id)} className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors", activeTab === item.id ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white")}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>)}
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && <div className="md:hidden bg-gray-900 border-t border-gray-800" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => <button key={item.id} onClick={() => handleTabChange(item.id)} className={cn("flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-base font-medium transition-colors", activeTab === item.id ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white")}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>)}
            <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>}
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} onSelectStock={handleStockSelect} />
    </nav>;
};
export default Navbar;