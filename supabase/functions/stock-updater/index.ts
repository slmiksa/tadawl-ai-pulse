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

    // Stock symbols to update
    const allSymbols = [
      // US stocks
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
      'JPM', 'BAC', 'JNJ', 'PFE', 'KO', 'PEP', 'WMT', 'HD', 'XOM', 'CVX',
      // Saudi stocks
      '2222.SR', '2010.SR', '1120.SR', '2030.SR', '2380.SR', '7010.SR', '1210.SR', '4030.SR',
      '2020.SR', '1180.SR', '1050.SR', '2060.SR', '2090.SR', '4002.SR', '8230.SR', '2170.SR'
    ];

    let successCount = 0;
    let errorCount = 0;

    // Process stocks in batches to respect API limits
    for (let i = 0; i < allSymbols.length; i += 5) {
      const batch = allSymbols.slice(i, i + 5);
      
      for (const symbol of batch) {
        try {
          console.log(`Updating ${symbol}...`);
          
          const quoteUrl = `${BASE_URL}/quote?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`;
          const response = await fetch(quoteUrl);
          
          if (!response.ok) {
            console.error(`HTTP error for ${symbol}: ${response.status}`);
            errorCount++;
            continue;
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
                errorCount++;
              } else {
                successCount++;
                console.log(`Successfully updated ${symbol}`);
              }
            }
          } else if (data.status === 'error' || data.code) {
            console.log(`API error for ${symbol}: ${data.message || data.code}`);
            errorCount++;
          }
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.error(`Error updating ${symbol}:`, error);
          errorCount++;
        }
      }
      
      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
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