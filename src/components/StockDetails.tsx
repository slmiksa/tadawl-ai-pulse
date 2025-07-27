
import React from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, AlertCircle, BarChart3, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockDetailsProps {
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
  onBack?: () => void;
}

const StockDetails: React.FC<StockDetailsProps> = ({
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
  onBack,
}) => {
  const isPositive = change >= 0;
  const marketLabel = market === 'us' ? 'السوق الأمريكي' : 'السوق السعودي';

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

  const mockTechnicalData = [
    { indicator: 'RSI', value: '65.4', status: 'محايد' },
    { indicator: 'MACD', value: '0.85', status: 'إيجابي' },
    { indicator: 'حجم التداول', value: '1.2M', status: 'مرتفع' },
    { indicator: 'مستوى الدعم', value: '$142.50', status: 'قوي' },
    { indicator: 'مستوى المقاومة', value: '$148.20', status: 'متوسط' },
  ];

  const mockHistory = [
    { date: '2024-01-27 10:30', recommendation: 'buy', result: '+2.5%', status: 'ناجح' },
    { date: '2024-01-26 14:15', recommendation: 'sell', result: '+1.8%', status: 'ناجح' },
    { date: '2024-01-25 09:45', recommendation: 'hold', result: '0.0%', status: 'محايد' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">{symbol}</h1>
                <span className="text-sm px-2 py-1 bg-gray-700 text-gray-300 rounded">
                  {marketLabel}
                </span>
              </div>
              <p className="text-gray-400">{name}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite?.(symbol)}
            className={cn(
              "p-3 rounded-lg transition-colors",
              isFavorite
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            )}
          >
            <Star className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Price Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">${price.toFixed(2)}</span>
              <div className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg",
                isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-medium">
                  {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">آخر تحديث</p>
              <p className="text-sm">{new Date().toLocaleTimeString('ar-SA')}</p>
            </div>
          </div>

          <div className={cn(
            "inline-flex items-center space-x-3 px-4 py-2 rounded-lg border text-lg font-medium",
            getRecommendationColor(recommendation)
          )}>
            <AlertCircle className="w-5 h-5" />
            <span>التوصية الحالية: {getRecommendationText(recommendation)}</span>
          </div>
        </div>

        {/* Analysis Reason */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            سبب التوصية
          </h2>
          <p className="text-gray-300 leading-relaxed">{reason}</p>
        </div>

        {/* Technical Indicators */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">المؤشرات الفنية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTechnicalData.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{item.indicator}</span>
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-lg font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-3" />
            تاريخ التوصيات
          </h2>
          <div className="space-y-3">
            {mockHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{item.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    item.recommendation === 'buy' ? 'bg-green-500/20 text-green-400' :
                    item.recommendation === 'sell' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  )}>
                    {getRecommendationText(item.recommendation)}
                  </span>
                  <span className="text-sm font-medium">{item.result}</span>
                  <span className="text-sm text-gray-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
