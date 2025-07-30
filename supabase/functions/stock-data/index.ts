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
    
    // Handle different request methods and body parsing
    let symbol, market, dataType;
    
    if (req.method === 'POST') {
      const body = await req.text();
      console.log('Request body:', body);
      const params = new URLSearchParams(body);
      symbol = params.get('symbol');
      market = params.get('market') || 'us';
      dataType = params.get('type') || 'quote';
      console.log('Parsed params:', { symbol, market, dataType });
    } else {
      symbol = url.searchParams.get('symbol');
      market = url.searchParams.get('market') || 'us';
      dataType = url.searchParams.get('type') || 'quote';
    }
    
    console.log(`Processing request: type=${dataType}, market=${market}, symbol=${symbol}`);

    // For stocks list endpoint
    if (dataType === 'stocks') {
      console.log('Fetching stocks list...');
      
      const stocksData = [];
      
      // Define stock symbols based on market (reduced for API limits)
      let stockSymbols = [];
      if (market === 'us') {
        stockSymbols = ['AAPL', 'TSLA']; // Only 2 stocks for testing
      } else if (market === 'saudi') {
        stockSymbols = ['2222.SR']; // Only 1 stock for testing  
      } else {
        stockSymbols = ['AAPL', '2222.SR']; // One from each market
      }
      
      for (const stockSymbol of stockSymbols) {
        try {
          console.log(`Fetching data for ${stockSymbol}...`);
          
          const quoteUrl = `${BASE_URL}/quote?symbol=${stockSymbol}&apikey=${TWELVEDATA_API_KEY}`;
          const response = await fetch(quoteUrl);
          
          if (!response.ok) {
            console.error(`HTTP error for ${stockSymbol}: ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log(`API response for ${stockSymbol}:`, data);
          
          if (data && data.symbol && !data.status) {
            const change = parseFloat(data.change || '0');
            const price = parseFloat(data.close || data.price || '0');
            
            if (price > 0) {
              stocksData.push({
                symbol: data.symbol,
                name: data.name || stockSymbol,
                price: price,
                change: change,
                changePercent: parseFloat(data.percent_change || '0'),
                volume: parseInt(data.volume || '0'),
                high: parseFloat(data.high || price.toString()),
                low: parseFloat(data.low || price.toString()),
                open: parseFloat(data.open || price.toString()),
                timestamp: data.datetime || new Date().toISOString(),
                market: stockSymbol.endsWith('.SR') ? 'saudi' : 'us',
                recommendation: change > 1 ? 'buy' : change < -1 ? 'sell' : 'hold',
                reason: change > 1 ? 'اتجاه صاعد إيجابي مع زيادة في الأسعار' : 
                       change < -1 ? 'ضغط هبوطي على السهم مع تراجع في الأسعار' : 
                       'حركة جانبية للسهم، ننصح بالانتظار'
              });
            }
          } else {
            console.warn(`Invalid data for ${stockSymbol}:`, data);
          }
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.error(`Error fetching ${stockSymbol}:`, error);
        }
      }
      
      console.log(`Returning ${stocksData.length} stocks`);
      
      return new Response(
        JSON.stringify({ stocks: stocksData }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // For individual stock data (not stocks list)
    if (dataType !== 'stocks' && !symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required for individual stock data' }),
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
        details: 'Check if the API key is valid and symbol is correct'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});