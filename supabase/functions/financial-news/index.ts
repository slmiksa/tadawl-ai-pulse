import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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

interface TranslatedNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  category: string;
  symbol?: string | null;
}

async function translateNews(articles: FinnhubNews[]): Promise<TranslatedNews[]> {
  if (!openaiApiKey) {
    console.log('⚠️ OpenAI API key not found, returning original news');
    return articles.slice(0, 10).map(article => ({
      id: article.id.toString(),
      title: article.headline,
      summary: article.summary,
      content: article.summary,
      source: article.source || 'Finnhub',
      publishedAt: new Date(article.datetime * 1000).toISOString(),
      imageUrl: article.image,
      url: article.url,
      category: article.category || 'general',
      symbol: article.related || null
    }));
  }

  const translatedArticles: TranslatedNews[] = [];
  
  // Process articles in batches of 3 to avoid rate limits
  for (let i = 0; i < Math.min(articles.length, 9); i += 3) {
    const batch = articles.slice(i, i + 3);
    
    try {
      const prompt = `Please translate the following financial news to Arabic. Keep the translation professional and accurate. Return only a JSON array with the same structure but translated text:

${JSON.stringify(batch.map(article => ({
  id: article.id,
  headline: article.headline,
  summary: article.summary,
  category: article.category,
  source: article.source
})))}

Requirements:
- Translate headline and summary to professional Arabic
- Keep financial terms accurate
- Maintain the JSON structure exactly
- Don't add any explanation, just return the JSON array`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional financial news translator. Translate to Arabic maintaining accuracy and professionalism.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        continue;
      }

      const data = await response.json();
      const translatedBatch = JSON.parse(data.choices[0].message.content);
      
      // Create detailed content for each article
      for (let j = 0; j < batch.length; j++) {
        const original = batch[j];
        const translated = translatedBatch[j];
        
        if (translated) {
          translatedArticles.push({
            id: original.id.toString(),
            title: translated.headline || original.headline,
            summary: translated.summary || original.summary,
            content: `${translated.summary || original.summary}\n\nهذا الخبر مصدره ${translated.source || original.source} ويمكنك قراءة المقال الأصلي للحصول على تفاصيل أكثر.`,
            source: translated.source || original.source || 'Finnhub',
            publishedAt: new Date(original.datetime * 1000).toISOString(),
            imageUrl: original.image,
            url: original.url,
            category: translated.category || original.category || 'general',
            symbol: original.related || null
          });
        }
      }
      
      // Add delay between batches to respect rate limits
      if (i + 3 < Math.min(articles.length, 9)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (error) {
      console.error('Translation error for batch:', error);
      // Add original articles if translation fails
      batch.forEach(article => {
        translatedArticles.push({
          id: article.id.toString(),
          title: article.headline,
          summary: article.summary,
          content: article.summary,
          source: article.source || 'Finnhub',
          publishedAt: new Date(article.datetime * 1000).toISOString(),
          imageUrl: article.image,
          url: article.url,
          category: article.category || 'general',
          symbol: article.related || null
        });
      });
    }
  }
  
  return translatedArticles;
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

    // Filter valid news data
    const validNews = newsData
      .filter(article => 
        article.headline && 
        article.summary && 
        article.image && 
        article.datetime > 0
      )
      .slice(0, 15); // Get more articles for better selection

    console.log(`🔄 Translating ${validNews.length} articles to Arabic...`);
    
    // Translate news to Arabic
    const translatedNews = await translateNews(validNews);

    console.log(`📰 Returning ${translatedNews.length} translated news articles`);

    return new Response(JSON.stringify({ 
      success: true,
      news: translatedNews,
      total: translatedNews.length 
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