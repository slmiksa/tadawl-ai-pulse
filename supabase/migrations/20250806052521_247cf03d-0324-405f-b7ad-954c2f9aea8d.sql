-- Create a cron job to update news every 30 minutes
SELECT cron.schedule(
  'update-financial-news',
  '*/30 * * * *', -- Every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://snqtnznhmklgyxbthfoc.supabase.co/functions/v1/financial-news?background=true',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucXRuem5obWtsZ3l4YnRoZm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTQxNzgsImV4cCI6MjA2OTI3MDE3OH0.gW3MjBsrv1F4UEBAGYJlz52zws7Mnh8MJaKFN5PfiCs"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);