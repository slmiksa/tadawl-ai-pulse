
import React, { useState } from 'react';
import StockCard from './StockCard';
import MarketSelector from './MarketSelector';
import { TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<'all' | 'us' | 'saudi'>('all');
  const [favorites, setFavorites] = useState<string[]>(['AAPL', 'TSLA', '2222.SR']);

  // Mock data for stocks
  const stocks = [
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
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.85,
      change: 1.15,
      changePercent: 0.30,
      recommendation: 'hold' as const,
      reason: 'السهم في منطقة تذبذب. انتظار كسر المقاومة عند 380 أو الدعم عند 370.',
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
    {
      symbol: '1120.SR',
      name: 'بنك الراجحي',
      price: 85.20,
      change: -1.80,
      changePercent: -2.07,
      recommendation: 'hold' as const,
      reason: 'تراجع مؤقت بعد الوصول لمستوى مقاومة قوي. انتظار إعادة اختبار الدعم.',
      market: 'saudi' as const,
    },
    {
      symbol: '2030.SR',
      name: 'سابك',
      price: 95.60,
      change: 3.20,
      changePercent: 3.46,
      recommendation: 'buy' as const,
      reason: 'اختراق صاعد لمستوى المقاومة مع زيادة في حجم التداول. إشارة قوية للشراء.',
      market: 'saudi' as const,
    },
  ];

  const filteredStocks = stocks.filter(stock => {
    if (activeMarket === 'all') return true;
    return stock.market === activeMarket;
  });

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleViewDetails = (symbol: string) => {
    console.log('Viewing details for:', symbol);
    // Handle navigation to stock details
  };

  // Calculate stats
  const totalStocks = filteredStocks.length;
  const buyRecommendations = filteredStocks.filter(s => s.recommendation === 'buy').length;
  const sellRecommendations = filteredStocks.filter(s => s.recommendation === 'sell').length;
  const avgChange = filteredStocks.reduce((sum, s) => sum + s.changePercent, 0) / totalStocks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          منصة التوصيات الذكية
        </h1>
        <p className="text-gray-400">
          توصيات فورية مدعومة بالذكاء الاصطناعي للأسواق المالية
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي الأسهم</p>
              <p className="text-2xl font-bold text-white">{totalStocks}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">توصيات شراء</p>
              <p className="text-2xl font-bold text-green-400">{buyRecommendations}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">توصيات بيع</p>
              <p className="text-2xl font-bold text-red-400">{sellRecommendations}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">متوسط التغيير</p>
              <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgChange.toFixed(2)}%
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <div className="flex justify-center mb-6">
        <MarketSelector 
          activeMarket={activeMarket} 
          onMarketChange={setActiveMarket} 
        />
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => (
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
            isFavorite={favorites.includes(stock.symbol)}
            onToggleFavorite={toggleFavorite}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          <span className="font-semibold text-yellow-400">تنبيه:</span> هذه التوصيات لا تعتبر نصيحة استثمارية مباشرة، استخدمها على مسؤوليتك الخاصة.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
