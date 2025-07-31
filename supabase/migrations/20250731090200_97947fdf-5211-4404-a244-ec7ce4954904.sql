-- Create stocks table for caching stock data
CREATE TABLE public.stocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price DECIMAL(15,4) NOT NULL,
  change DECIMAL(15,4) NOT NULL,
  change_percent DECIMAL(8,4) NOT NULL,
  volume BIGINT NOT NULL DEFAULT 0,
  high DECIMAL(15,4) NOT NULL,
  low DECIMAL(15,4) NOT NULL,
  open DECIMAL(15,4) NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('us', 'saudi')),
  recommendation TEXT NOT NULL CHECK (recommendation IN ('buy', 'sell', 'hold')),
  reason TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_stocks_symbol ON public.stocks(symbol);
CREATE INDEX idx_stocks_market ON public.stocks(market);
CREATE INDEX idx_stocks_last_updated ON public.stocks(last_updated);

-- Enable RLS
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Stocks are viewable by everyone" 
ON public.stocks 
FOR SELECT 
USING (true);

-- Create table for stock technical indicators
CREATE TABLE public.stock_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  indicator_name TEXT NOT NULL,
  indicator_value TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol, indicator_name)
);

-- Enable RLS for stock indicators
ALTER TABLE public.stock_indicators ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Stock indicators are viewable by everyone" 
ON public.stock_indicators 
FOR SELECT 
USING (true);

-- Create table for candlestick data
CREATE TABLE public.stock_candlestick (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  time_label TEXT NOT NULL,
  open_price DECIMAL(15,4) NOT NULL,
  high_price DECIMAL(15,4) NOT NULL,
  low_price DECIMAL(15,4) NOT NULL,
  close_price DECIMAL(15,4) NOT NULL,
  volume BIGINT NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol, timestamp)
);

-- Enable RLS for candlestick data
ALTER TABLE public.stock_candlestick ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Stock candlestick data is viewable by everyone" 
ON public.stock_candlestick 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stocks_updated_at
BEFORE UPDATE ON public.stocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stock_indicators_updated_at
BEFORE UPDATE ON public.stock_indicators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();