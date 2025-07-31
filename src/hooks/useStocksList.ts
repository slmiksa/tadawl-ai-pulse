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
      // Read from Supabase database directly
      let query = supabase.from('stocks').select('*');
      
      if (market !== 'all') {
        query = query.eq('market', market);
      }
      
      const { data: stocksData, error: dbError } = await query.order('symbol');
      
      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }
      
      if (stocksData && stocksData.length > 0) {
        // Transform database data to match expected format
        const transformedStocks = stocksData.map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: parseFloat(stock.price || '0'),
          change: parseFloat(stock.change || '0'),
          changePercent: parseFloat(stock.change_percent || '0'),
          volume: parseInt(stock.volume || '0'),
          high: parseFloat(stock.high || '0'),
          low: parseFloat(stock.low || '0'),
          open: parseFloat(stock.open || '0'),
          timestamp: stock.last_updated || new Date().toISOString(),
          market: stock.market,
          recommendation: stock.recommendation,
          reason: stock.reason
        }));
        
        setStocks(transformedStocks);
      } else {
        setStocks([]);
        setError('لا توجد بيانات متاحة. يتم تحديث البيانات كل 3 دقائق تلقائياً.');
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
      setError(`خطأ في جلب البيانات: ${errorMessage}`);
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