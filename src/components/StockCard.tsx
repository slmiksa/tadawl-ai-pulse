
import React from 'react';
import { TrendingUp, TrendingDown, Star, AlertCircle, Eye, Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  recommendation: 'buy' | 'sell' | 'hold';
  reason: string;
  market: 'us' | 'saudi';
  isFavorite?: boolean;
  isRealData?: boolean;
  lastUpdated?: string;
  onToggleFavorite?: (symbol: string) => void;
  onViewDetails?: (stockData: any) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  high,
  low,
  recommendation,
  reason,
  market,
  isFavorite = false,
  isRealData = false,
  lastUpdated,
  onToggleFavorite,
  onViewDetails,
}) => {
  const { t } = useLanguage();
  const isPositive = change >= 0;
  const marketLabel = market === 'us' ? t('stock.us') : t('stock.saudi');
  const usdToSar = 3.75; // سعر صرف تقريبي
  const priceInSar = price * usdToSar;
  const priceInUsd = market === 'saudi' ? price / usdToSar : price;

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'buy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sell':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'buy':
        return t('stock.buy');
      case 'sell':
        return t('stock.sell');
      case 'hold':
        return t('stock.hold');
      default:
        return 'غير محدد';
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails({
        symbol,
        name,
        price,
        change,
        changePercent,
        recommendation,
        reason,
        market,
        isFavorite
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Header with symbol, market label, and favorite */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold text-white">{symbol}</h3>
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                {marketLabel}
              </span>
              {/* Real data indicator */}
              <div className={cn(
                "flex items-center space-x-1 text-xs px-2 py-1 rounded-full",
                isRealData ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isRealData ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                )} />
                <span>{isRealData ? t('stock.realData') : t('stock.demoData')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 truncate max-w-[200px]">{name}</p>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite?.(symbol)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isFavorite
              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          )}
        >
          <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Price section */}
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {market === 'us' ? `$${price.toFixed(2)}` : `${price.toFixed(2)} ر.س`}
          </span>
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium",
            isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(2)}</span>
            <span>({changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        
        {/* Currency conversion */}
        <div className="text-sm text-gray-400">
          ≈ {market === 'us' ? `${priceInSar.toFixed(2)} ر.س` : `$${priceInUsd.toFixed(2)}`}
        </div>
        
        {/* Additional data row */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-3">
            {high && (
              <span>{t('stock.high')}: {market === 'us' ? '$' : 'ر.س'}{high.toFixed(2)}</span>
            )}
            {low && (
              <span>{t('stock.low')}: {market === 'us' ? '$' : 'ر.س'}{low.toFixed(2)}</span>
            )}
          </div>
          {volume && (
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>{volume > 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}K`}</span>
            </div>
          )}
        </div>
        
        {/* Last updated */}
        {lastUpdated && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{t('stock.lastUpdate')}: {new Date(lastUpdated).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      {/* Recommendation badge */}
      <div className="mb-3">
        <div className={cn(
          "inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium",
          getRecommendationColor(recommendation)
        )}>
          <AlertCircle className="w-4 h-4" />
          <span>{getRecommendationText(recommendation)}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{reason}</p>
      </div>

      {/* View details button */}
      <button
        onClick={handleViewDetails}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200"
      >
        <Eye className="w-4 h-4" />
        <span>{t('stock.viewDetails')}</span>
      </button>
    </div>
  );
};

export default StockCard;
