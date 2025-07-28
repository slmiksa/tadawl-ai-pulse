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

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStocks(data.stocks || []);
    } catch (err) {
      console.error('Error fetching stocks list:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks data');
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