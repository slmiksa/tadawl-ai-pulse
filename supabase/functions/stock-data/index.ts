import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWELVEDATA_API_KEY = Deno.env.get('TWELVEDATA_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const BASE_URL = 'https://api.twelvedata.com';

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

// Cache for stock data (in-memory for this session)
const stockCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to generate fallback stock data
function generateFallbackStocks(allSymbols: string[], market: string, existingStocks: any[]) {
  const existingSymbols = new Set(existingStocks.map(s => s.symbol));
  const remainingSymbols = allSymbols.filter(symbol => !existingSymbols.has(symbol));
  
  const fallbackStocks = [];
  
  for (const symbol of remainingSymbols) {
    const isUS = !symbol.endsWith('.SR');
    const basePrice = isUS ? Math.random() * 300 + 50 : Math.random() * 100 + 20;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    const stockNames: { [key: string]: string } = {
      'AAPL': 'Apple Inc', 'MSFT': 'Microsoft Corp', 'GOOGL': 'Alphabet Inc', 'AMZN': 'Amazon.com Inc',
      'TSLA': 'Tesla Inc', 'META': 'Meta Platforms', 'NVDA': 'NVIDIA Corp', 'NFLX': 'Netflix Inc',
      'AMD': 'Advanced Micro Devices', 'INTC': 'Intel Corp', 'CRM': 'Salesforce Inc', 'ORCL': 'Oracle Corp',
      'ADBE': 'Adobe Inc', 'PYPL': 'PayPal Holdings', 'SHOP': 'Shopify Inc', 'SPOT': 'Spotify Technology',
      'UBER': 'Uber Technologies', 'LYFT': 'Lyft Inc', 'ZM': 'Zoom Video Communications', 'ROKU': 'Roku Inc',
      'SQ': 'Block Inc', 'SNAP': 'Snap Inc', 'PINS': 'Pinterest Inc', 'DOCU': 'DocuSign Inc',
      'OKTA': 'Okta Inc', 'SNOW': 'Snowflake Inc', 'PLTR': 'Palantir Technologies', 'RBLX': 'Roblox Corp',
      'COIN': 'Coinbase Global', 'TWLO': 'Twilio Inc', 'JPM': 'JPMorgan Chase', 'BAC': 'Bank of America',
      'WFC': 'Wells Fargo', 'GS': 'Goldman Sachs', 'MS': 'Morgan Stanley', 'C': 'Citigroup Inc',
      'USB': 'U.S. Bancorp', 'PNC': 'PNC Financial', 'TFC': 'Truist Financial', 'COF': 'Capital One',
      'JNJ': 'Johnson & Johnson', 'PFE': 'Pfizer Inc', 'UNH': 'UnitedHealth Group', 'ABT': 'Abbott Laboratories',
      'MRK': 'Merck & Co', 'ABBV': 'AbbVie Inc', 'CVS': 'CVS Health', 'LLY': 'Eli Lilly',
      'TMO': 'Thermo Fisher Scientific', 'DHR': 'Danaher Corp', 'KO': 'Coca-Cola Co', 'PEP': 'PepsiCo Inc',
      'WMT': 'Walmart Inc', 'HD': 'Home Depot', 'MCD': 'McDonald\'s Corp', 'DIS': 'Walt Disney',
      'NKE': 'Nike Inc', 'SBUX': 'Starbucks Corp', 'LOW': 'Lowe\'s Companies', 'TGT': 'Target Corp',
      'XOM': 'Exxon Mobil', 'CVX': 'Chevron Corp', 'COP': 'ConocoPhillips', 'SLB': 'Schlumberger',
      'EOG': 'EOG Resources', 'PXD': 'Pioneer Natural Resources', 'MPC': 'Marathon Petroleum', 'VLO': 'Valero Energy',
      'PSX': 'Phillips 66', 'HES': 'Hess Corp', 'CAT': 'Caterpillar Inc', 'DE': 'Deere & Company',
      'MMM': '3M Company', 'HON': 'Honeywell International', 'UPS': 'United Parcel Service', 'FDX': 'FedEx Corp',
      'LMT': 'Lockheed Martin', 'BA': 'Boeing Co', 'GD': 'General Dynamics', 'RTX': 'Raytheon Technologies',
      
      '2222.SR': 'أرامكو السعودية', '2010.SR': 'سابك', '1120.SR': 'الراجحي المصرفية', '2030.SR': 'سافكو',
      '2380.SR': 'بترو رابغ', '7010.SR': 'سابتكو', '1210.SR': 'البنك الأهلي السعودي', '4030.SR': 'أسلاك',
      '2020.SR': 'سابك للمغذيات الزراعية', '1180.SR': 'الأهلي الإتحاد', '1050.SR': 'البنك الأهلي التجاري',
      '2060.SR': 'صدق', '2090.SR': 'الجبس الأهلية', '4002.SR': 'أسمنت حائل', '8230.SR': 'المراكز العربية',
      '2170.SR': 'الخضري'
    };
    
    fallbackStocks.push({
      symbol,
      name: stockNames[symbol] || symbol,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 1000000,
      high: parseFloat((basePrice + Math.abs(change) * 1.2).toFixed(2)),
      low: parseFloat((basePrice - Math.abs(change) * 1.2).toFixed(2)),
      open: parseFloat((basePrice - change * 0.5).toFixed(2)),
      timestamp: new Date().toISOString(),
      market: isUS ? 'us' : 'saudi',
      recommendation: change > 1 ? 'buy' : change < -1 ? 'sell' : 'hold',
      reason: change > 1 ? 'اتجاه صاعد إيجابي مع زيادة في الأسعار' : 
             change < -1 ? 'ضغط هبوطي على السهم مع تراجع في الأسعار' : 
             'حركة جانبية للسهم، ننصح بالانتظار'
    });
  }
  
  return fallbackStocks;
}

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
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const body = await req.json();
        console.log('JSON Request body:', body);
        symbol = body.symbol;
        market = body.market || 'us';
        dataType = body.type || 'quote';
      } else {
        // Handle form-encoded data
        const body = await req.text();
        const params = new URLSearchParams(body);
        symbol = params.get('symbol');
        market = params.get('market') || 'us';
        dataType = params.get('type') || 'quote';
        console.log('Form Request params:', { symbol, market, dataType });
      }
    } else {
      symbol = url.searchParams.get('symbol');
      market = url.searchParams.get('market') || 'us';
      dataType = url.searchParams.get('type') || 'quote';
    }
    
    console.log(`Processing request: type=${dataType}, market=${market}, symbol=${symbol}`);

    // For stocks list endpoint - now reads from database
    if (dataType === 'stocks') {
      console.log('Fetching stocks list from database...');
      
      try {
        let query = supabase.from('stocks').select('*');
        
        if (market !== 'all') {
          query = query.eq('market', market);
        }
        
        const { data: stocksData, error: dbError } = await query.order('symbol');
        
        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
        
        if (!stocksData || stocksData.length === 0) {
          return new Response(
            JSON.stringify({ 
              error: 'لا توجد بيانات في قاعدة البيانات. يرجى انتظار التحديث التلقائي.',
              stocks: []
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        
        console.log(`Returning ${stocksData.length} stocks from database`);
        
        return new Response(
          JSON.stringify({ stocks: stocksData }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
        
      } catch (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ 
            error: `خطأ في قاعدة البيانات: ${error.message}`,
            stocks: []
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
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