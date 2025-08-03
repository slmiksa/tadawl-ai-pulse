-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to update stock data every 3 minutes
SELECT cron.schedule(
  'stock-data-auto-update',
  '*/3 * * * *', -- Every 3 minutes
  $$
  SELECT
    net.http_post(
        url:='https://snqtnznhmklgyxbthfoc.supabase.co/functions/v1/stock-updater',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucXRuem5obWtsZ3l4YnRoZm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTQxNzgsImV4cCI6MjA2OTI3MDE3OH0.gW3MjBsrv1F4UEBAGYJlz52zws7Mnh8MJaKFN5PfiCs"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Add technical analysis fields to stocks table
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS resistance_level_1 numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS resistance_level_2 numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS support_level_1 numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS support_level_2 numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS entry_signal text;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS entry_timing text;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS rsi numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS macd_signal text;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS trading_volume_avg numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS volatility numeric;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS trend_strength text;
ALTER TABLE stocks ADD COLUMN IF NOT EXISTS success_probability numeric;