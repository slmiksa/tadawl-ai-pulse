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
          price: Number(stock.price || 0),
          change: Number(stock.change || 0),
          changePercent: Number(stock.change_percent || 0),
          volume: Number(stock.volume || 0),
          high: Number(stock.high || stock.price || 0),
          low: Number(stock.low || stock.price || 0),
          open: Number(stock.open || stock.price || 0),
          timestamp: stock.last_updated || new Date().toISOString(),
          market: (stock.market === 'us' || stock.market === 'saudi') ? stock.market : 'us' as 'us' | 'saudi',
          recommendation: (stock.recommendation === 'buy' || stock.recommendation === 'sell' || stock.recommendation === 'hold') ? stock.recommendation : 'hold' as 'buy' | 'sell' | 'hold',
          reason: stock.reason || 'لا توجد توصية متاحة'
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