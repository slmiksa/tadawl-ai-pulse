-- Enable pg_cron extension for scheduled tasks
select cron.schedule(
  'update-stocks-every-3-minutes',
  '*/3 * * * *', -- every 3 minutes
  $$
  select
    net.http_post(
        url:='https://snqtnznhmklgyxbthfoc.supabase.co/functions/v1/stock-updater',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucXRuem5obWtsZ3l4YnRoZm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTQxNzgsImV4cCI6MjA2OTI3MDE3OH0.gW3MjBsrv1F4UEBAGYJlz52zws7Mnh8MJaKFN5PfiCs"}'::jsonb
    ) as request_id;
  $$
);