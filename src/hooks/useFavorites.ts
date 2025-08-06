import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteStock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  reason: string;
  market: 'us' | 'saudi';
  volume?: number;
  high?: number;
  low?: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavorites([]);
        return;
      }

      // Get user's default watchlist
      const { data: watchlists } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .limit(1);

      if (!watchlists || watchlists.length === 0) {
        setFavorites([]);
        return;
      }

      const watchlistId = watchlists[0].id;

      // Get stocks in the watchlist
      const { data: watchlistStocks } = await supabase
        .from('watchlist_stocks')
        .select(`
          stock_id,
          stocks (
            id,
            symbol,
            name,
            price,
            change,
            change_percent,
            recommendation,
            reason,
            market,
            volume,
            high,
            low
          )
        `)
        .eq('watchlist_id', watchlistId);

      if (watchlistStocks) {
        const formattedFavorites: FavoriteStock[] = watchlistStocks
          .filter(ws => ws.stocks)
          .map(ws => ({
            id: ws.stocks!.id,
            symbol: ws.stocks!.symbol,
            name: ws.stocks!.name,
            price: Number(ws.stocks!.price || 0),
            change: Number(ws.stocks!.change || 0),
            changePercent: Number(ws.stocks!.change_percent || 0),
            recommendation: (ws.stocks!.recommendation as 'buy' | 'sell' | 'hold') || 'hold',
            reason: ws.stocks!.reason || '',
            market: (ws.stocks!.market as 'us' | 'saudi') || 'us',
            volume: ws.stocks!.volume ? Number(ws.stocks!.volume) : undefined,
            high: ws.stocks!.high ? Number(ws.stocks!.high) : undefined,
            low: ws.stocks!.low ? Number(ws.stocks!.low) : undefined,
          }));

        setFavorites(formattedFavorites);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorite stocks');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (symbol: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // Get user's default watchlist
      let { data: watchlists } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .limit(1);

      // Create default watchlist if it doesn't exist
      if (!watchlists || watchlists.length === 0) {
        const { data: newWatchlist } = await supabase
          .from('watchlists')
          .insert({
            user_id: user.id,
            name: 'المفضلة',
            is_default: true
          })
          .select('id')
          .single();

        if (newWatchlist) {
          watchlists = [newWatchlist];
        } else {
          throw new Error('Failed to create watchlist');
        }
      }

      const watchlistId = watchlists[0].id;

      // Get the stock
      const { data: stock } = await supabase
        .from('stocks')
        .select('id')
        .eq('symbol', symbol)
        .single();

      if (!stock) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على السهم",
          variant: "destructive",
        });
        return;
      }

      // Check if stock is already in favorites
      const { data: existingEntry } = await supabase
        .from('watchlist_stocks')
        .select('id')
        .eq('watchlist_id', watchlistId)
        .eq('stock_id', stock.id)
        .single();

      if (existingEntry) {
        // Remove from favorites
        await supabase
          .from('watchlist_stocks')
          .delete()
          .eq('id', existingEntry.id);

        toast({
          title: "تم الإزالة",
          description: "تم إزالة السهم من المفضلة",
        });
      } else {
        // Add to favorites
        await supabase
          .from('watchlist_stocks')
          .insert({
            watchlist_id: watchlistId,
            stock_id: stock.id
          });

        toast({
          title: "تم الإضافة",
          description: "تم إضافة السهم إلى المفضلة",
        });
      }

      // Refresh favorites
      fetchFavorites();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث المفضلة",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (symbol: string) => {
    return favorites.some(fav => fav.symbol === symbol);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
  };
};