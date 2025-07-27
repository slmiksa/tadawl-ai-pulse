
import React, { useState } from 'react';
import StockCard from './StockCard';
import StockDetails from './StockDetails';
import MarketSelector from './MarketSelector';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

const Dashboard = () => {
  const [selectedMarket, setSelectedMarket] = useState<'all' | 'us' | 'saudi'>('all');
  const [favorites, setFavorites] = useState<string[]>(['AAPL', 'SABIC']);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const mockStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 145.30,
      change: 2.45,
      changePercent: 1.71,
      recommendation: 'buy' as const,
      reason: 'تحسن في الأداء المالي للشركة مع توقعات إيجابية لمبيعات iPhone الجديد. المؤشرات الفنية تشير إلى اتجاه صاعد قوي.',
      market: 'us' as const,
    },
    {
      symbol: 'SABIC',
      name: 'Saudi Basic Industries Corp',
      price: 89.50,
      change: -1.20,
      changePercent: -1.32,
      recommendation: 'sell' as const,
      reason: 'ضغط على هوامش الربح بسبب ارتفاع أسعار المواد الخام. التحليل الفني يشير إلى كسر مستوى دعم مهم.',
      market: 'saudi' as const,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 238.85,
      change: 5.67,
      changePercent: 2.43,
      recommendation: 'buy' as const,
      reason: 'نمو قوي في مبيعات السيارات الكهربائية مع توسع في الأسواق الجديدة. المؤشرات تدعم الاتجاه الصاعد.',
      market: 'us' as const,
    },
    {
      symbol: 'RAJHI',
      name: 'Al Rajhi Bank',
      price: 76.20,
      change: 0.80,
      changePercent: 1.06,
      recommendation: 'hold' as const,
      reason: 'أداء مستقر للبنك مع نمو معتدل في الأرباح. ننصح بالانتظار حتى ظهور إشارات أوضح.',
      market: 'saudi' as const,
    },
  ];

  const filteredStocks = selectedMarket === 'all' 
    ? mockStocks 
    : mockStocks.filter(stock => stock.market === selectedMarket);

  const handleToggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(fav => fav !== symbol)
        : [...prev, symbol]
    );
  };

  const handleViewDetails = (stockData: any) => {
    setSelectedStock(stockData);
  };

  const handleBackToDashboard = () => {
    setSelectedStock(null);
  };

  if (selectedStock) {
    return (
      <StockDetails
        {...selectedStock}
        isFavorite={favorites.includes(selectedStock.symbol)}
        onToggleFavorite={handleToggleFavorite}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Calculate statistics
  const totalStocks = filteredStocks.length;
  const positiveStocks = filteredStocks.filter(stock => stock.change > 0).length;
  const negativeStocks = filteredStocks.filter(stock => stock.change < 0).length;
  const buyRecommendations = filteredStocks.filter(stock => stock.recommendation === 'buy').length;

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-400">أسهم صاعدة</p>
              <p className="text-2xl font-bold text-green-400">{positiveStocks}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">أسهم هابطة</p>
              <p className="text-2xl font-bold text-red-400">{negativeStocks}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">توصيات شراء</p>
              <p className="text-2xl font-bold text-yellow-400">{buyRecommendations}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Market Selector */}
      <MarketSelector selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} />

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            {...stock}
            isFavorite={favorites.includes(stock.symbol)}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
