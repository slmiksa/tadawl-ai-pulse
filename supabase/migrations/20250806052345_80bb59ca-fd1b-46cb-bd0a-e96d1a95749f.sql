-- Create news table to store articles
CREATE TABLE public.news_articles (
  id SERIAL PRIMARY KEY,
  article_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  source TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  url TEXT,
  category TEXT,
  symbol TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read news
CREATE POLICY "Everyone can read news articles" 
ON public.news_articles 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_category ON public.news_articles(category);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_articles_updated_at
BEFORE UPDATE ON public.news_articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;