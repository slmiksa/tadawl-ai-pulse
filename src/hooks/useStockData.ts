import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StockQuote {
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
}

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicator {
  indicator: string;
  value: string;
  status: string;
}

export const useStockData = (symbol: string, market: 'us' | 'saudi' = 'us') => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockQuote = async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: new URLSearchParams({
          symbol,
          market,
          type: 'quote'
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setQuote(data);
    } catch (err) {
      console.error('Error fetching stock quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandlestickData = async () => {
    if (!symbol) return;

    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: new URLSearchParams({
          symbol,
          market,
          type: 'timeseries'
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCandlestickData(data.candlestickData || []);
    } catch (err) {
      console.error('Error fetching candlestick data:', err);
    }
  };

  const fetchTechnicalIndicators = async () => {
    if (!symbol) return;

    try {
      const { data, error } = await supabase.functions.invoke('stock-data', {
        body: new URLSearchParams({
          symbol,
          market,
          type: 'technical'
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setTechnicalIndicators(data.technicalIndicators || []);
    } catch (err) {
      console.error('Error fetching technical indicators:', err);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchStockQuote();
      fetchCandlestickData();
      fetchTechnicalIndicators();
    }
  }, [symbol, market]);

  const refreshData = () => {
    fetchStockQuote();
    fetchCandlestickData();
    fetchTechnicalIndicators();
  };

  return {
    quote,
    candlestickData,
    technicalIndicators,
    loading,
    error,
    refreshData
  };
};