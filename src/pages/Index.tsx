
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Favorites from '../components/Favorites';
import Performance from '../components/Performance';
import TodayAnalysis from '../components/TodayAnalysis';
import Notifications from '../components/Notifications';
import Profile from '../components/Profile';
import Subscriptions from '../components/Subscriptions';
import SubscriptionRequiredModal from '../components/SubscriptionRequiredModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const navigate = useNavigate();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Check subscription status when user is loaded and not in subscriptions tab
    if (user && !subscriptionLoading && !isSubscribed && activeTab !== 'subscriptions') {
      setShowSubscriptionModal(true);
    }
  }, [user, subscriptionLoading, isSubscribed, activeTab]);

  const handlePaymentGateway = async (packageType: 'basic' | 'pro') => {
    // سيتم ربطها ببوابة الدفع لاحقاً
    toast({
      title: "جاري التحضير",
      description: "سيتم ربط بوابة الدفع قريباً",
    });
    
    // TODO: Integrate with payment gateway API
    console.log('Payment gateway integration for package:', packageType);
  };

  const renderContent = () => {
    // Allow access to subscriptions page even without subscription
    if (activeTab === 'subscriptions') {
      return <Subscriptions />;
    }

    // For other tabs, check subscription status
    if (!subscriptionLoading && !isSubscribed) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">اشتراك مطلوب</h3>
            <p className="text-gray-400 mb-6">للوصول إلى هذه الميزة، يجب عليك الاشتراك في إحدى الباقات</p>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-gradient-to-r from-purple-600 to-yellow-600 hover:from-purple-700 hover:to-yellow-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200"
            >
              عرض الباقات
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'favorites':
        return <Favorites />;
      case 'performance':
        return <Performance />;
      case 'analysis':
        return <TodayAnalysis />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      
      <SubscriptionRequiredModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handlePaymentGateway}
      />
    </div>
  );
};

export default Index;
