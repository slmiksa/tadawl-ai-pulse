-- Add missing columns to stocks table
ALTER TABLE public.stocks 
ADD COLUMN IF NOT EXISTS change DECIMAL(15,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS high DECIMAL(15,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS low DECIMAL(15,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS open DECIMAL(15,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS recommendation TEXT DEFAULT 'hold' CHECK (recommendation IN ('buy', 'sell', 'hold')),
ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT '';

-- Update existing stocks table structure
UPDATE public.stocks SET 
  change = 0 WHERE change IS NULL,
  high = price WHERE high IS NULL,
  low = price WHERE low IS NULL,
  open = price WHERE open IS NULL,
  recommendation = 'hold' WHERE recommendation IS NULL,
  reason = 'لا توجد توصية متاحة' WHERE reason IS NULL OR reason = '';