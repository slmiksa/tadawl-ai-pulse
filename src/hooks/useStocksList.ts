import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Global cache for stocks data to persist across market changes
const stocksCache = new Map<string, {
  data: Stock[];
  timestamp: number;
  lastDbCheck: number;
}>();

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

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

  // For 'all' market, we need to fetch both US and Saudi stocks separately and combine them
  const handleAllMarketFetch = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check if we have valid cached data for 'all'
    const cachedData = stocksCache.get('all');
    if (cachedData && !forceRefresh) {
      const timeSinceCache = now - cachedData.timestamp;
      
      if (timeSinceCache < CACHE_DURATION) {
        console.log(`Using memory cache for all (${Math.round(timeSinceCache / 1000)}s old)`);
        setStocks(cachedData.data);
        setLoading(false);
        setError(null);
        return;
      }
    }

    if (!cachedData) {
      setLoading(true);
    }
    setError(null);

    try {
      // First try to get data from database - fetch both markets separately
      const [usResult, saudiResult] = await Promise.all([
        supabase.from('stocks').select('*').eq('market', 'us').order('symbol'),
        supabase.from('stocks').select('*').eq('market', 'saudi').order('symbol')
      ]);

      let combinedStocks: Stock[] = [];
      const usStocks = usResult.data || [];
      const saudiStocks = saudiResult.data || [];
      
      // Check if we have enough fresh data in database
      const totalDbStocks = usStocks.length + saudiStocks.length;
      
      if (totalDbStocks >= 20) { // We expect at least 20 stocks total
        const allStocksData = [...usStocks, ...saudiStocks];
        
        combinedStocks = allStocksData.map(stock => ({
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

        // Check data freshness
        if (allStocksData.length > 0) {
          const newestStock = allStocksData.reduce((newest, stock) => {
            const stockTime = new Date(stock.last_updated || 0).getTime();
            const newestTime = new Date(newest.last_updated || 0).getTime();
            return stockTime > newestTime ? stock : newest;
          }, allStocksData[0]);
          
          const dataAge = now - new Date(newestStock.last_updated || 0).getTime();
          const isFreshData = dataAge < CACHE_DURATION;
          
          // Update cache
          const cacheTimestamp = isFreshData ? now : (cachedData?.timestamp || now - CACHE_DURATION + 30000);
          
          stocksCache.set('all', {
            data: combinedStocks,
            timestamp: cacheTimestamp,
            lastDbCheck: now
          });
          
          setStocks(combinedStocks);
          console.log(`Updated cache for all with ${combinedStocks.length} stocks from database (${usStocks.length} US + ${saudiStocks.length} Saudi)`);
          
          // If database data is stale, trigger background refresh but don't block UI
          if (!isFreshData && !forceRefresh) {
            console.log('Database data is stale, triggering background refresh...');
            setTimeout(() => fetchFromAPIForAll(false), 100);
          }
          
          return; // Exit early with database data
        }
      }
      
      // If we don't have enough database data, fetch from API
      console.log(`Insufficient database data (${totalDbStocks} stocks), fetching from API...`);
      await fetchFromAPIForAll(!cachedData);
      
    } catch (err) {
      console.error('Error fetching all stocks:', err);
      
      if (cachedData) {
        console.log('Database error, falling back to cached data');
        setStocks(cachedData.data);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
        setError(`خطأ في جلب البيانات: ${errorMessage}`);
        setStocks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Separate API fetch function for 'all' market
  const fetchFromAPIForAll = async (showLoader = true) => {
    try {
      if (showLoader) {
        console.log('Fetching fresh data from API for all markets...');
      }
      
      // Fetch both markets in parallel
      const [usResponse, saudiResponse] = await Promise.all([
        supabase.functions.invoke('stock-data', {
          body: { type: 'stocks', market: 'us' }
        }),
        supabase.functions.invoke('stock-data', {
          body: { type: 'stocks', market: 'saudi' }
        })
      ]);

      if (usResponse.error) {
        throw new Error(`US API error: ${usResponse.error.message}`);
      }
      if (saudiResponse.error) {
        throw new Error(`Saudi API error: ${saudiResponse.error.message}`);
      }
      
      if (usResponse.data?.error) {
        throw new Error(`US API error: ${usResponse.data.error}`);
      }
      if (saudiResponse.data?.error) {
        throw new Error(`Saudi API error: ${saudiResponse.data.error}`);
      }

      const usStocks = usResponse.data?.stocks || [];
      const saudiStocks = saudiResponse.data?.stocks || [];
      const combinedStocks = [...usStocks, ...saudiStocks];

      if (combinedStocks.length > 0) {
        // Update cache with fresh API data
        stocksCache.set('all', {
          data: combinedStocks,
          timestamp: Date.now(),
          lastDbCheck: Date.now()
        });
        
        setStocks(combinedStocks);
        console.log(`Updated cache for all with fresh API data (${combinedStocks.length} stocks: ${usStocks.length} US + ${saudiStocks.length} Saudi)`);
      } else {
        throw new Error('No stocks returned from either API');
      }
    } catch (err) {
      console.error('Error fetching from API for all markets:', err);
      if (showLoader) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
        setError(`خطأ في جلب البيانات: ${errorMessage}`);
      }
    }
  };

  const fetchStocks = async (forceRefresh = false) => {
    // Handle 'all' market separately
    if (market === 'all') {
      return handleAllMarketFetch(forceRefresh);
    }

    const cacheKey = market;
    const now = Date.now();
    
    // Check if we have valid cached data first
    const cachedData = stocksCache.get(cacheKey);
    if (cachedData && !forceRefresh) {
      const timeSinceCache = now - cachedData.timestamp;
      const timeSinceDbCheck = now - cachedData.lastDbCheck;
      
      // If cache is less than 3 minutes old, use it immediately
      if (timeSinceCache < CACHE_DURATION) {
        console.log(`Using memory cache for ${cacheKey} (${Math.round(timeSinceCache / 1000)}s old)`);
        setStocks(cachedData.data);
        setLoading(false);
        setError(null);
        return;
      }
      
      // If database was checked recently (less than 30 seconds), don't check again
      if (timeSinceDbCheck < 30000) {
        console.log(`Database recently checked for ${cacheKey}, using existing cache`);
        setStocks(cachedData.data);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // If no valid cache, show loader only if we don't have any data to show
    if (!cachedData) {
      setLoading(true);
    }
    setError(null);

    try {
      // Check database for fresh data
      const { data: stocksData, error: dbError } = await supabase
        .from('stocks')
        .select('*')
        .eq('market', market)
        .order('symbol');
      
      if (stocksData && stocksData.length > 0 && !dbError) {
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

        // Check if database data is fresh (less than 3 minutes old)
        const newestStock = stocksData.reduce((newest, stock) => {
          const stockTime = new Date(stock.last_updated || 0).getTime();
          const newestTime = new Date(newest.last_updated || 0).getTime();
          return stockTime > newestTime ? stock : newest;
        }, stocksData[0]);
        
        const dataAge = now - new Date(newestStock.last_updated || 0).getTime();
        const isFreshData = dataAge < CACHE_DURATION;
        
        // Update cache with fresh timestamp only if data is actually fresh
        const cacheTimestamp = isFreshData ? now : (cachedData?.timestamp || now - CACHE_DURATION + 30000);
        
        stocksCache.set(cacheKey, {
          data: transformedStocks,
          timestamp: cacheTimestamp,
          lastDbCheck: now
        });
        
        setStocks(transformedStocks);
        console.log(`Updated cache for ${cacheKey} with ${transformedStocks.length} stocks (data age: ${Math.round(dataAge / 1000)}s)`);
        
        // If database data is stale (older than 3 minutes), trigger background refresh
        if (!isFreshData && !forceRefresh) {
          console.log('Database data is stale, triggering background refresh...');
          setTimeout(() => fetchFromAPI(false), 100);
        }
      } else {
        // No database data, fetch from API
        console.log('No database data found, fetching from API...');
        await fetchFromAPI(!cachedData); // Show loader only if no cached data
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      
      // If we have cached data, use it even if database check failed
      if (cachedData) {
        console.log('Database error, falling back to cached data');
        setStocks(cachedData.data);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks data';
        setError(`خطأ في جلب البيانات: ${errorMessage}`);
        setStocks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFromAPI = async (showLoader = true) => {
    try {
      if (showLoader) {
        console.log('Fetching fresh data from API...');
      }
      
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: {
          type: 'stocks',
          market: market
        }
      });

      if (error) {
        throw new Error(`Edge Function error: ${error.message}`);
      }
      
      if (data?.error) {
        throw new Error(`API error: ${data.error}`);
      }

      if (data?.stocks && Array.isArray(data.stocks)) {
        // Update cache with fresh API data
        stocksCache.set(market, {
          data: data.stocks,
          timestamp: Date.now(),
          lastDbCheck: Date.now()
        });
        
        setStocks(data.stocks);
        console.log(`Updated cache for ${market} with fresh API data (${data.stocks.length} stocks)`);
        
        if (data.stocks.length === 0 && showLoader) {
          console.log('No stocks returned, initializing...');
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
    
    // Start background data update for better performance
    const startBackgroundUpdate = async () => {
      try {
        // Call stock-updater in background - this will update database asynchronously
        supabase.functions.invoke('stock-updater');
        console.log('Background stock update triggered');
      } catch (error) {
        console.log('Background update failed to start:', error);
      }
    };
    
    // Start background update after initial load
    setTimeout(startBackgroundUpdate, 1000);
    
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
    fetchStocks(true); // Force refresh from API
  };

  return {
    stocks,
    loading,
    error,
    refreshStocks
  };
};