
import React from 'react';
import { TrendingUp, TrendingDown, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  reason: string;
  market: 'us' | 'saudi';
  isFavorite?: boolean;
  onToggleFavorite?: (symbol: string) => void;
  onViewDetails?: (stockData: any) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  recommendation,
  reason,
  market,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
}) => {
  const isPositive = change >= 0;
  const marketLabel = market === 'us' ? 'أمريكي' : 'سعودي';

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
        return 'شراء';
      case 'sell':
        return 'بيع';
      case 'hold':
        return 'انتظار';
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
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white">{symbol}</h3>
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                {marketLabel}
              </span>
            </div>
            <p className="text-sm text-gray-400">{name}</p>
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

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            ${price.toFixed(2)}
          </span>
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded",
            isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className={cn(
          "inline-flex items-center space-x-2 px-3 py-1 rounded-lg border text-sm font-medium",
          getRecommendationColor(recommendation)
        )}>
          <AlertCircle className="w-4 h-4" />
          <span>{getRecommendationText(recommendation)}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-300 leading-relaxed">{reason}</p>
      </div>

      <button
        onClick={handleViewDetails}
        className="w-full bg-gradient-to-r from-purple-600 to-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-yellow-700 transition-all"
      >
        عرض التفاصيل
      </button>
    </div>
  );
};

export default StockCard;
