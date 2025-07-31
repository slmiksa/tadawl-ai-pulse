import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Triggering initial stock data population...');

    // Call the stock-updater function to populate database
    const response = await fetch('https://snqtnznhmklgyxbthfoc.supabase.co/functions/v1/stock-updater', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ source: 'init' })
    });

    const result = await response.json();
    
    console.log('Stock updater response:', result);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'تم تشغيل التحديث الأولي للأسهم',
        updaterResult: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in init-stocks function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to initialize stocks',
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});