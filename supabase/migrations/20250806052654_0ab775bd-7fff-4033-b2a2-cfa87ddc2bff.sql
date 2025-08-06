-- Insert some test data and trigger the background update
INSERT INTO public.news_articles (article_id, title, summary, content, source, published_at, image_url, url, category, symbol)
VALUES 
('test-1', 'أخبار الأسواق المالية', 'ملخص الخبر الأول', 'محتوى الخبر الأول بالتفصيل', 'سوق المال', now(), '/placeholder.svg', 'https://example.com', 'general', null)
ON CONFLICT (article_id) DO NOTHING;