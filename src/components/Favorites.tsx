
import React from 'react';
import StockCard from './StockCard';
import { Star, TrendingUp, RefreshCw } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';

const Favorites: React.FC = () => {
  const { favorites, loading, error, fetchFavorites, toggleFavorite } = useFavorites();

  const handleViewDetails = (symbol: string) => {
    console.log('Viewing details for:', symbol);
  };

  const handleRefresh = () => {
    fetchFavorites();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Star className="w-8 h-8 text-yellow-400 fill-current" />
          <h1 className="text-3xl font-bold text-white">
            الأسهم المفضلة
          </h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-gray-400">
            متابعة سريعة للأسهم التي تهمك
          </p>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm"
            disabled={loading}
            className="h-8 px-3"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي المفضلة</p>
              <p className="text-2xl font-bold text-white">{favorites.length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">أسهم رابحة</p>
              <p className="text-2xl font-bold text-green-400">
                {favorites.filter(s => s.change > 0).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">توصيات شراء</p>
              <p className="text-2xl font-bold text-purple-400">
                {favorites.filter(s => s.recommendation === 'buy').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            إعادة المحاولة
          </Button>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              recommendation={stock.recommendation}
              reason={stock.reason}
              market={stock.market}
              volume={stock.volume}
              high={stock.high}
              low={stock.low}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            لا توجد أسهم مفضلة
          </h3>
          <p className="text-gray-500">
            أضف أسهمًا إلى المفضلة لمتابعتها بسهولة من صفحة الرئيسية
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
