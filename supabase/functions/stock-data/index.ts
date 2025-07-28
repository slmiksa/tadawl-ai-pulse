import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWELVEDATA_API_KEY = Deno.env.get('TWELVEDATA_API_KEY');
const BASE_URL = 'https://api.twelvedata.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol');
    const market = url.searchParams.get('market') || 'us';
    const dataType = url.searchParams.get('type') || 'quote';
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching ${dataType} data for ${symbol} in ${market} market`);

    let apiUrl = '';
    let data = {};

    switch (dataType) {
      case 'quote':
        // Get real-time quote
        apiUrl = `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`;
        const quoteResponse = await fetch(apiUrl);
        const quoteData = await quoteResponse.json();
        
        if (quoteData.status === 'error') {
          throw new Error(quoteData.message);
        }

        data = {
          symbol: quoteData.symbol,
          name: quoteData.name,
          price: parseFloat(quoteData.close),
          change: parseFloat(quoteData.change),
          changePercent: parseFloat(quoteData.percent_change),
          volume: parseInt(quoteData.volume),
          high: parseFloat(quoteData.high),
          low: parseFloat(quoteData.low),
          open: parseFloat(quoteData.open),
          timestamp: quoteData.datetime
        };
        break;

      case 'timeseries':
        // Get intraday time series for candlestick chart
        apiUrl = `${BASE_URL}/time_series?symbol=${symbol}&interval=30min&outputsize=50&apikey=${TWELVEDATA_API_KEY}`;
        const timeseriesResponse = await fetch(apiUrl);
        const timeseriesData = await timeseriesResponse.json();
        
        if (timeseriesData.status === 'error') {
          throw new Error(timeseriesData.message);
        }

        const candlestickData = timeseriesData.values?.map((item: any) => ({
          time: new Date(item.datetime).toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          volume: parseInt(item.volume)
        })).reverse() || [];

        data = { candlestickData };
        break;

      case 'technical':
        // Get technical indicators
        const promises = [
          fetch(`${BASE_URL}/rsi?symbol=${symbol}&interval=1day&time_period=14&apikey=${TWELVEDATA_API_KEY}`),
          fetch(`${BASE_URL}/macd?symbol=${symbol}&interval=1day&apikey=${TWELVEDATA_API_KEY}`),
          fetch(`${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`)
        ];

        const [rsiResponse, macdResponse, currentQuoteResponse] = await Promise.all(promises);
        const [rsiData, macdData, currentQuote] = await Promise.all([
          rsiResponse.json(),
          macdResponse.json(),
          currentQuoteResponse.json()
        ]);

        const technicalIndicators = [];

        // RSI
        if (rsiData.values && rsiData.values.length > 0) {
          const rsiValue = parseFloat(rsiData.values[0].rsi);
          technicalIndicators.push({
            indicator: 'RSI',
            value: rsiValue.toFixed(1),
            status: rsiValue > 70 ? 'مفرط في الشراء' : rsiValue < 30 ? 'مفرط في البيع' : 'محايد'
          });
        }

        // MACD
        if (macdData.values && macdData.values.length > 0) {
          const macdValue = parseFloat(macdData.values[0].macd);
          technicalIndicators.push({
            indicator: 'MACD',
            value: macdValue.toFixed(2),
            status: macdValue > 0 ? 'إيجابي' : 'سلبي'
          });
        }

        // Volume and Price levels
        if (currentQuote && !currentQuote.status) {
          const volume = parseInt(currentQuote.volume);
          const price = parseFloat(currentQuote.close);
          
          technicalIndicators.push(
            {
              indicator: 'حجم التداول',
              value: volume > 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`,
              status: volume > 1000000 ? 'مرتفع' : 'منخفض'
            },
            {
              indicator: 'مستوى الدعم',
              value: `$${(price * 0.95).toFixed(2)}`,
              status: 'قوي'
            },
            {
              indicator: 'مستوى المقاومة',
              value: `$${(price * 1.05).toFixed(2)}`,
              status: 'متوسط'
            }
          );
        }

        data = { technicalIndicators };
        break;

      default:
        throw new Error('Invalid data type requested');
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in stock-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch stock data',
        details: 'Check if the symbol is valid and try again'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});