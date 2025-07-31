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

  const fetchStocks = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    setError(null);

    try {
      // First try to get fresh data from database
      let query = supabase.from('stocks').select('*');
      
      if (market !== 'all') {
        query = query.eq('market', market);
      }
      
      const { data: stocksData, error: dbError } = await query.order('symbol');
      
      // If we have any data in database, use it immediately (for instant display)
      if (stocksData && stocksData.length > 0 && !dbError) {
        console.log('Using cached data from database');
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

        // Check if data is older than 5 minutes - if so, refresh in background
        const now = new Date();
        const hasRecentData = stocksData.some(stock => {
          const lastUpdate = new Date(stock.last_updated || 0);
          const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
          return diffMinutes < 5;
        });

        // If data is stale, refresh in background without showing loader
        if (!hasRecentData) {
          console.log('Data is stale, refreshing in background...');
          setTimeout(() => fetchFromAPI(false), 100);
        }
      } else {
        // No database data, fetch from API with loader
        await fetchFromAPI(true);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
      setError(`خطأ في جلب البيانات: ${errorMessage}`);
      setStocks([]);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const fetchFromAPI = async (showLoader = true) => {
    try {
      console.log('Fetching fresh data from API');
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: {
          type: 'stocks',
          market: market === 'all' ? 'all' : market
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
        if (data.stocks.length === 0 && showLoader) {
          // Try to initialize stocks if empty
          console.log('Initializing stock data...');
          await supabase.functions.invoke('init-stocks');
          setError('يتم تحميل البيانات للمرة الأولى، يرجى الانتظار...');
        }
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching from API:', err);
      if (showLoader) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
        setError(`خطأ في جلب البيانات: ${errorMessage}`);
      }
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Run initial stock population if no data
    const initializeIfNeeded = async () => {
      const { data } = await supabase.from('stocks').select('id').limit(1);
      if (!data || data.length === 0) {
        console.log('No stocks in database, initializing...');
        supabase.functions.invoke('init-stocks');
      }
    };
    
    initializeIfNeeded();
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