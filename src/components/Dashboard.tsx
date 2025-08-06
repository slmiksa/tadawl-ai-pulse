import React, { useState } from 'react';
import StockCard from './StockCard';
import StockDetails from './StockDetails';
import MarketSelector from './MarketSelector';
import { useStocksList } from '@/hooks/useStocksList';
import { useFavorites } from '@/hooks/useFavorites';
import { TrendingUp, TrendingDown, DollarSign, Clock, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [selectedMarket, setSelectedMarket] = useState<'all' | 'us' | 'saudi'>('all');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    stocks,
    loading,
    error,
    refreshStocks
  } = useStocksList(selectedMarket);
  const filteredStocks = stocks;
  const handleToggleFavorite = (symbol: string) => {
    toggleFavorite(symbol);
  };
  const handleViewDetails = (stockData: any) => {
    setSelectedStock(stockData);
  };
  const handleBackToDashboard = () => {
    setSelectedStock(null);
  };
  if (selectedStock) {
    return <StockDetails {...selectedStock} isFavorite={isFavorite(selectedStock.symbol)} onToggleFavorite={handleToggleFavorite} onBack={handleBackToDashboard} />;
  }

  // Calculate statistics
  const totalStocks = filteredStocks.length;
  const positiveStocks = filteredStocks.filter(stock => stock.change > 0).length;
  const negativeStocks = filteredStocks.filter(stock => stock.change < 0).length;
  const buyRecommendations = filteredStocks.filter(stock => stock.recommendation === 'buy').length;
  if (loading && stocks.length === 0) {
    return <div className="space-y-6">
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">جارٍ تحميل بيانات الأسهم...</p>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Error Display */}
      {error && <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">خطأ في جلب البيانات: {error}</p>
          <button onClick={refreshStocks} className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm">
            إعادة المحاولة
          </button>
        </div>}
      
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
      <div className="flex items-center justify-between">
        <MarketSelector activeMarket={selectedMarket} onMarketChange={setSelectedMarket} />
        
      </div>

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length === 0 && !loading ? <div className="col-span-full text-center py-12">
            <p className="text-gray-400 mb-4">لا توجد أسهم متاحة</p>
            <button onClick={refreshStocks} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
              إعادة المحاولة
            </button>
          </div> : filteredStocks.map(stock => <StockCard key={stock.symbol} {...stock} isFavorite={isFavorite(stock.symbol)} onToggleFavorite={handleToggleFavorite} onViewDetails={handleViewDetails} />)}
      </div>
    </div>;
};
export default Dashboard;