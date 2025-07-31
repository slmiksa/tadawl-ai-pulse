-- Add missing columns to stocks table
ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS change DECIMAL(15,4) DEFAULT 0;

ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS high DECIMAL(15,4) DEFAULT 0;

ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS low DECIMAL(15,4) DEFAULT 0;

ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS open DECIMAL(15,4) DEFAULT 0;

ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS recommendation TEXT DEFAULT 'hold';

ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT '';

-- Add check constraint for recommendation
ALTER TABLE public.stocks 
ADD CONSTRAINT check_recommendation CHECK (recommendation IN ('buy', 'sell', 'hold'));