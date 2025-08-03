-- Create subscription for user monafaisal11
INSERT INTO public.subscriptions (user_id, package_type, is_active, start_date, end_date)
VALUES (
  'f0e8ae22-f6d1-455c-b9f3-eb4a3cf60fd7',
  'pro',
  true,
  now(),
  now() + interval '1 month'
);