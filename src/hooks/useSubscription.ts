import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserSubscription {
  package_type: 'basic' | 'pro';
  is_active: boolean;
  end_date: string | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSubscribed(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (data) {
        const subscriptionData = {
          package_type: data.package_type as 'basic' | 'pro',
          is_active: data.is_active,
          end_date: data.end_date
        };
        setSubscription(subscriptionData);
        setIsSubscribed(true);
      } else {
        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.log('No active subscription found');
      setSubscription(null);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    isSubscribed,
    loading,
    refetch: fetchSubscription
  };
};