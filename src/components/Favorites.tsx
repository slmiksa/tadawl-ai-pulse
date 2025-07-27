
import React, { useState } from 'react';
import StockCard from './StockCard';
import { Star, TrendingUp } from 'lucide-react';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>(['AAPL', 'TSLA', '2222.SR']);

  // Mock data for favorite stocks
  const favoriteStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.84,
      change: 2.34,
      changePercent: 1.35,
      recommendation: 'buy' as const,
      reason: 'مؤشر RSI في منطقة الشراء مع كسر مستوى المقاومة عند 174. حجم التداول مرتفع.',
      market: 'us' as const,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.50,
      change: -5.20,
      changePercent: -2.05,
      recommendation: 'sell' as const,
      reason: 'انخفاض تحت المتوسط المتحرك 50 يوم. مؤشر MACD يظهر إشارة بيع قوية.',
      market: 'us' as const,
    },
    {
      symbol: '2222.SR',
      name: 'أرامكو السعودية',
      price: 28.50,
      change: 0.75,
      changePercent: 2.70,
      recommendation: 'buy' as const,
      reason: 'كسر مستوى المقاومة عند 28.20 بحجم تداول عالي. مؤشر RSI إيجابي.',
      market: 'saudi' as const,
    },
  ];

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => prev.filter(s => s !== symbol));
  };

  const handleViewDetails = (symbol: string) => {
    console.log('Viewing details for:', symbol);
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
        <p className="text-gray-400">
          متابعة سريعة للأسهم التي تهمك
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي المفضلة</p>
              <p className="text-2xl font-bold text-white">{favoriteStocks.length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">أسهم رابحة</p>
              <p className="text-2xl font-bold text-green-400">
                {favoriteStocks.filter(s => s.change > 0).length}
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
                {favoriteStocks.filter(s => s.recommendation === 'buy').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      {favoriteStocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteStocks.map((stock) => (
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
            أضف أسهمًا إلى المفضلة لمتابعتها بسهولة
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
