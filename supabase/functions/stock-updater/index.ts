import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TWELVEDATA_API_KEY = Deno.env.get('TWELVEDATA_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const BASE_URL = 'https://api.twelvedata.com';

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting automatic stock update...');

    // Comprehensive stock symbols for all markets
    const allSymbols = [
      // US Tech giants & major stocks
      'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'ORCL', 'CRM', 'ADBE', 'PYPL', 'SHOP', 'SPOT', 'UBER', 'LYFT', 'ZM', 'ROKU', 'SQ', 'SNAP', 'PINS', 'DOCU', 'OKTA', 'SNOW', 'PLTR', 'RBLX', 'COIN', 'TWLO',
      // Banks & Finance
      'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'USB', 'PNC', 'TFC', 'COF', 'AXP', 'BLK', 'SPG', 'V', 'MA',
      // Healthcare & Pharma
      'JNJ', 'PFE', 'UNH', 'ABT', 'MRK', 'ABBV', 'CVS', 'LLY', 'TMO', 'DHR', 'BMY', 'AMGN', 'GILD', 'BIIB', 'REGN',
      // Consumer & Retail
      'KO', 'PEP', 'WMT', 'HD', 'MCD', 'DIS', 'NKE', 'SBUX', 'LOW', 'TGT', 'COST', 'TJX', 'F', 'GM',
      // Energy
      'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'PXD', 'MPC', 'VLO', 'PSX', 'HES', 'OXY',
      // Saudi Banks
      '1120.SR', '1180.SR', '1050.SR', '1210.SR', '1030.SR', '1140.SR', '1150.SR', '1060.SR', '1080.SR', '1020.SR', '1040.SR',
      // Saudi Petrochemicals & Energy
      '2222.SR', '2010.SR', '2020.SR', '2030.SR', '2350.SR', '2380.SR', '2001.SR', '2002.SR', '2060.SR', '2090.SR', '2040.SR', '2170.SR', '2310.SR', '2320.SR', '2330.SR', '2340.SR',
      // Saudi Industrials & Materials
      '1201.SR', '1211.SR', '1301.SR', '1302.SR', '1303.SR', '3001.SR', '3002.SR', '3003.SR', '3004.SR', '3005.SR', '3007.SR', '3008.SR', '3009.SR', '3010.SR', '3020.SR', '3030.SR', '3040.SR', '3050.SR', '3060.SR', '3091.SR',
      // Saudi Consumer & Retail  
      '4001.SR', '4002.SR', '4003.SR', '4004.SR', '4005.SR', '4006.SR', '4007.SR', '4008.SR', '4009.SR', '4010.SR', '4020.SR', '4030.SR', '4040.SR', '4050.SR', '4051.SR', '4061.SR', '4070.SR', '4080.SR', '4090.SR', '4100.SR', '4110.SR', '4140.SR', '4150.SR', '4160.SR', '4162.SR', '4163.SR', '4164.SR', '4170.SR', '4180.SR', '4190.SR', '4191.SR', '4192.SR',
      // Saudi Transport & Communication
      '7010.SR', '7020.SR', '7030.SR', '7040.SR', '7110.SR', '7200.SR', '7201.SR', '7202.SR', '7203.SR'
    ];

    let successCount = 0;
    let errorCount = 0;

    // Process stocks in batches of 10 for optimal speed vs rate limiting
    for (let i = 0; i < allSymbols.length; i += 10) {
      const batch = allSymbols.slice(i, i + 10);
      
      // Process each batch in parallel for maximum speed
      const batchPromises = batch.map(async (symbol) => {
        try {
          console.log(`Updating ${symbol}...`);
          
          const quoteUrl = `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`;
          const response = await fetch(quoteUrl);
          
          if (!response.ok) {
            console.error(`HTTP error for ${symbol}: ${response.status}`);
            return { success: false, symbol };
          }
          
          const data = await response.json();
          
          if (data && data.symbol && !data.status && !data.code) {
            const change = parseFloat(data.change || '0');
            const price = parseFloat(data.close || data.price || '0');
            
            if (price > 0) {
              const stockData = {
                symbol: data.symbol,
                name: data.name || symbol,
                price: price,
                change: change,
                change_percent: parseFloat(data.percent_change || '0'),
                volume: parseInt(data.volume || '0'),
                high: parseFloat(data.high || price.toString()),
                low: parseFloat(data.low || price.toString()),
                open: parseFloat(data.open || price.toString()),
                market: symbol.endsWith('.SR') ? 'saudi' : 'us',
                recommendation: change > 1 ? 'buy' : change < -1 ? 'sell' : 'hold',
                reason: change > 1 ? 'اتجاه صاعد إيجابي مع زيادة في الأسعار' : 
                       change < -1 ? 'ضغط هبوطي على السهم مع تراجع في الأسعار' : 
                       'حركة جانبية للسهم، ننصح بالانتظار',
                last_updated: new Date().toISOString()
              };

              // Upsert to database
              const { error: upsertError } = await supabase
                .from('stocks')
                .upsert(stockData, { 
                  onConflict: 'symbol',
                  ignoreDuplicates: false 
                });

              if (upsertError) {
                console.error(`Database error for ${symbol}:`, upsertError);
                return { success: false, symbol };
              } else {
                console.log(`Successfully updated ${symbol}`);
                return { success: true, symbol };
              }
            }
          } else if (data.status === 'error' || data.code) {
            console.log(`API error for ${symbol}: ${data.message || data.code}`);
            return { success: false, symbol };
          }
          
          return { success: false, symbol };
          
        } catch (error) {
          console.error(`Error updating ${symbol}:`, error);
          return { success: false, symbol };
        }
      });
      
      // Wait for all promises in this batch to complete
      const results = await Promise.all(batchPromises);
      
      // Count successes and errors
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      });
      
      // Short delay between batches to respect API limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Stock update completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Updated ${successCount} stocks with ${errorCount} errors`,
        successCount,
        errorCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in stock-updater function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to update stocks',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});