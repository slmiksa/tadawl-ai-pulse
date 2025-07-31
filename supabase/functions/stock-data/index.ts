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

    // For stocks list endpoint - hybrid approach: database cache + API fallback
    if (dataType === 'stocks') {
      console.log('Fetching stocks list...');
      
      try {
        let query = supabase.from('stocks').select('*');
        
        if (market !== 'all') {
          query = query.eq('market', market);
        }
        
        const { data: stocksData, error: dbError } = await query.order('symbol');
        
        // Check if we have recent data (less than 3 minutes old)
        const now = new Date();
        const hasRecentData = stocksData && stocksData.length > 0 && 
          stocksData.some(stock => {
            const lastUpdate = new Date(stock.last_updated || 0);
            const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
            return diffMinutes < 3;
          });

        if (hasRecentData && !dbError) {
          console.log(`Returning ${stocksData.length} stocks from database cache`);
          
          // Transform database data to API format
          const apiFormatStocks = stocksData.map(stock => ({
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
            market: stock.market,
            recommendation: stock.recommendation || 'hold',
            reason: stock.reason || 'لا توجد توصية متاحة'
          }));
          
          return new Response(
            JSON.stringify({ stocks: apiFormatStocks }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        
        // If no recent data, fall back to API and update cache
        console.log('No recent cached data, fetching from API...');
        
        // Stock symbols based on market - EXPANDED LISTS
        let stockSymbols = [];
        if (market === 'us') {
          stockSymbols = [
            // Tech giants
            'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'ORCL', 'CRM', 'ADBE', 'PYPL', 'SHOP', 'SPOT', 'UBER', 'LYFT', 'ZM', 'ROKU', 'SQ', 'SNAP', 'PINS', 'DOCU', 'OKTA', 'SNOW', 'PLTR', 'RBLX', 'COIN', 'TWLO',
            // Banks & Finance
            'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'USB', 'PNC', 'TFC', 'COF', 'AXP', 'BLK', 'SPG', 'V', 'MA', 'BRK.B',
            // Healthcare & Pharma
            'JNJ', 'PFE', 'UNH', 'ABT', 'MRK', 'ABBV', 'CVS', 'LLY', 'TMO', 'DHR', 'BMY', 'AMGN', 'GILD', 'BIIB', 'REGN',
            // Consumer & Retail
            'KO', 'PEP', 'WMT', 'HD', 'MCD', 'DIS', 'NKE', 'SBUX', 'LOW', 'TGT', 'COST', 'TJX', 'F', 'GM', 'TSLA',
            // Energy & Utilities
            'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'PXD', 'MPC', 'VLO', 'PSX', 'HES', 'OXY', 'KMI', 'WMB', 'EPD',
            // Industrials
            'CAT', 'DE', 'MMM', 'HON', 'UPS', 'FDX', 'LMT', 'BA', 'GD', 'RTX', 'NOC', 'GE', 'EMR', 'ITW'
          ];
        } else if (market === 'saudi') {
          stockSymbols = [
            // البنوك
            '1120.SR', '1180.SR', '1050.SR', '1210.SR', '1030.SR', '1140.SR', '1150.SR', '1060.SR', '1080.SR', '1020.SR', '1040.SR',
            // البتروكيماويات والطاقة
            '2222.SR', '2010.SR', '2020.SR', '2030.SR', '2350.SR', '2380.SR', '2001.SR', '2002.SR', '2060.SR', '2090.SR', '2040.SR', '2170.SR', '2310.SR', '2320.SR', '2330.SR', '2340.SR', '1201.SR', '1211.SR', '1301.SR', '1302.SR', '1303.SR',
            // الاسمنت
            '3001.SR', '3002.SR', '3003.SR', '3004.SR', '3005.SR', '3007.SR', '3008.SR', '3009.SR', '3010.SR', '3020.SR', '3030.SR', '3040.SR', '3050.SR', '3060.SR', '3091.SR',
            // التجزئة والاستهلاك
            '4001.SR', '4002.SR', '4003.SR', '4004.SR', '4005.SR', '4006.SR', '4007.SR', '4008.SR', '4009.SR', '4010.SR', '4020.SR', '4030.SR', '4040.SR', '4050.SR', '4051.SR', '4061.SR', '4070.SR', '4080.SR', '4090.SR', '4100.SR', '4110.SR', '4140.SR', '4150.SR', '4160.SR', '4162.SR', '4163.SR', '4164.SR', '4170.SR', '4180.SR', '4190.SR', '4191.SR', '4192.SR', '4200.SR', '4210.SR', '4220.SR', '4230.SR', '4240.SR', '4250.SR', '4260.SR', '4261.SR', '4262.SR', '4270.SR', '4280.SR', '4290.SR', '4291.SR', '4292.SR', '4300.SR', '4310.SR', '4320.SR', '4321.SR', '4322.SR', '4323.SR', '4330.SR', '4331.SR', '4332.SR', '4333.SR', '4334.SR', '4335.SR', '4336.SR', '4337.SR', '4338.SR', '4339.SR', '4340.SR',
            // الطيران والنقل
            '7010.SR', '7020.SR', '7030.SR', '7040.SR', '7200.SR', '7201.SR', '7202.SR', '7203.SR',
            // الاتصالات والتقنية
            '7010.SR', '7020.SR', '7030.SR', '7040.SR', '7110.SR', '7200.SR', '7201.SR', '7202.SR', '7203.SR',
            // الرعاية الصحية
            '2140.SR', '4004.SR', '2070.SR', '4005.SR',
            // المرافق العامة
            '2082.SR', '2083.SR', '5110.SR', '2082.SR',
            // الصناعات
            '1301.SR', '1302.SR', '1303.SR', '2001.SR', '2002.SR', '2040.SR', '2170.SR', '2310.SR', '2320.SR', '2330.SR', '2340.SR'
          ];
        } else {
          // Combined markets with top performers
          stockSymbols = [
            // Top US stocks
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'JPM', 'BAC', 'JNJ', 'PFE', 'KO', 'PEP', 'WMT', 'HD', 'XOM', 'CVX', 'V', 'MA', 'UNH', 'DIS', 'COST', 'CRM', 'PYPL', 'ADBE', 'ORCL', 'TJX',
            // Top Saudi stocks
            '2222.SR', '2010.SR', '1120.SR', '2030.SR', '2380.SR', '7010.SR', '1210.SR', '4030.SR', '2020.SR', '1180.SR', '1050.SR', '2060.SR', '2090.SR', '4002.SR', '8230.SR', '2170.SR', '1140.SR', '2001.SR', '2040.SR', '1301.SR'
          ];
        }
        
        // Fetch fresh data from API
        const freshStocks = [];
        let apiCallsCount = 0;
        
        for (const stockSymbol of stockSymbols.slice(0, 20)) { // Increased to 20 calls for more stocks
          try {
            console.log(`Fetching data for ${stockSymbol}...`);
            apiCallsCount++;
            
            const quoteUrl = `${BASE_URL}/quote?symbol=${stockSymbol}&apikey=${TWELVEDATA_API_KEY}`;
            const response = await fetch(quoteUrl);
            
            if (!response.ok) {
              console.error(`HTTP error for ${stockSymbol}: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            
            if (data && data.symbol && !data.status && !data.code) {
              const change = parseFloat(data.change || '0');
              const price = parseFloat(data.close || data.price || '0');
              
              if (price > 0) {
                const stockData = {
                  symbol: data.symbol,
                  name: data.name || stockSymbol,
                  price: price,
                  change: change,
                  change_percent: parseFloat(data.percent_change || '0'),
                  volume: parseInt(data.volume || '0'),
                  high: parseFloat(data.high || price.toString()),
                  low: parseFloat(data.low || price.toString()),
                  open: parseFloat(data.open || price.toString()),
                  market: stockSymbol.endsWith('.SR') ? 'saudi' : 'us',
                  recommendation: change > 1 ? 'buy' : change < -1 ? 'sell' : 'hold',
                  reason: change > 1 ? 'اتجاه صاعد إيجابي مع زيادة في الأسعار' : 
                         change < -1 ? 'ضغط هبوطي على السهم مع تراجع في الأسعار' : 
                         'حركة جانبية للسهم، ننصح بالانتظار',
                  last_updated: new Date().toISOString()
                };

                // Update database cache
                await supabase
                  .from('stocks')
                  .upsert(stockData, { 
                    onConflict: 'symbol',
                    ignoreDuplicates: false 
                  });

                freshStocks.push({
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
            } else if (data.status === 'error' || data.code) {
              console.log(`API error for ${stockSymbol}: ${data.message || data.code}`);
              continue;
            }
            
            // Reduced rate limiting delay for faster response
            await new Promise(resolve => setTimeout(resolve, 150));
            
          } catch (error) {
            console.error(`Error fetching ${stockSymbol}:`, error);
            continue;
          }
        }
        
        console.log(`Returning ${freshStocks.length} fresh stocks from API`);
        
        return new Response(
          JSON.stringify({ stocks: freshStocks }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
        
      } catch (error) {
        console.error('Error in stocks endpoint:', error);
        return new Response(
          JSON.stringify({ 
            error: `خطأ في جلب البيانات: ${error.message}`,
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