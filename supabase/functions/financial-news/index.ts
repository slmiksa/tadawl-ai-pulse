import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📰 Fetching financial news from Finnhub...');
    
    if (!finnhubApiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    // Fetch general market news
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${finnhubApiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
    }

    const newsData: FinnhubNews[] = await response.json();
    
    console.log(`✅ Retrieved ${newsData.length} news articles`);

    // Filter and format news data
    const formattedNews = newsData
      .filter(article => 
        article.headline && 
        article.summary && 
        article.image && 
        article.datetime > 0
      )
      .slice(0, 20) // Limit to 20 articles
      .map(article => ({
        id: article.id.toString(),
        title: article.headline,
        summary: article.summary,
        source: article.source || 'Finnhub',
        publishedAt: new Date(article.datetime * 1000).toISOString(),
        imageUrl: article.image,
        url: article.url,
        category: article.category || 'general',
        symbol: article.related || null
      }));

    console.log(`📰 Returning ${formattedNews.length} formatted news articles`);

    return new Response(JSON.stringify({ 
      success: true,
      news: formattedNews,
      total: formattedNews.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error fetching financial news:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      news: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});