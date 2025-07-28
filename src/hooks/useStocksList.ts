import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  timestamp: string;
  market: 'us' | 'saudi';
  recommendation: 'buy' | 'sell' | 'hold';
  reason: string;
}

export const useStocksList = (market: 'all' | 'us' | 'saudi' = 'all') => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: new URLSearchParams({
          type: 'stocks',
          market: market === 'all' ? 'all' : market
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (error) {
        throw new Error(`Edge Function error: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(`API error: ${data.error}`);
      }

      if (data?.stocks && Array.isArray(data.stocks)) {
        setStocks(data.stocks);
        if (data.stocks.length === 0) {
          setError('لا توجد بيانات متاحة من API');
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching stocks list:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
      setError(`خطأ في جلب البيانات الحقيقية: ${errorMessage}`);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [market]);

  const refreshStocks = () => {
    fetchStocks();
  };

  return {
    stocks,
    loading,
    error,
    refreshStocks
  };
};