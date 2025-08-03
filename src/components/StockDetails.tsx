
import React, { useEffect } from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, AlertCircle, BarChart3, Calendar, Clock, RefreshCw, Target, AlertTriangle, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { useStockData } from '@/hooks/useStockData';

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
  onBack
}) => {
  const { quote, candlestickData, technicalIndicators, loading, error, refreshData } = useStockData(symbol, market);
  
  // Use real data if available, otherwise fallback to props
  const currentPrice = quote?.price ?? price;
  const currentChange = quote?.change ?? change;
  const currentChangePercent = quote?.changePercent ?? changePercent;
  const isPositive = currentChange >= 0;
  const marketLabel = market === 'us' ? 'السوق الأمريكي' : 'السوق السعودي';
  const usdToSar = 3.75; // سعر صرف تقريبي
  const priceInSar = currentPrice * usdToSar;
  const priceInUsd = market === 'saudi' ? currentPrice / usdToSar : currentPrice;

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

  // Use real technical data if available, otherwise fallback to mock data
  const displayTechnicalData = technicalIndicators.length > 0 ? technicalIndicators : [
    {
      indicator: 'RSI',
      value: '65.4',
      status: 'محايد'
    },
    {
      indicator: 'MACD',
      value: '0.85',
      status: 'إيجابي'
    },
    {
      indicator: 'حجم التداول',
      value: '1.2M',
      status: 'مرتفع'
    },
    {
      indicator: 'مستوى الدعم',
      value: `$${(currentPrice * 0.95).toFixed(2)}`,
      status: 'قوي'
    },
    {
      indicator: 'مستوى المقاومة',
      value: `$${(currentPrice * 1.05).toFixed(2)}`,
      status: 'متوسط'
    }
  ];

  const mockHistory = [
    {
      date: '2024-01-27 10:30',
      recommendation: 'buy',
      result: '+2.5%',
      status: 'ناجح'
    },
    {
      date: '2024-01-26 14:15',
      recommendation: 'sell',
      result: '+1.8%',
      status: 'ناجح'
    },
    {
      date: '2024-01-25 09:45',
      recommendation: 'hold',
      result: '0.0%',
      status: 'محايد'
    }
  ];

  const CustomCandlestick = ({ payload, x, y, width, height }: any) => {
    if (!payload) return null;

    const { open, high, low, close } = payload;
    const isPositive = close > open;
    const bodyHeight = Math.abs(close - open) * height / (high - low);
    const bodyY = y + Math.max(high - Math.max(open, close), 0) * height / (high - low);
    const wickTop = y + (high - Math.max(open, close)) * height / (high - low);
    const wickBottom = y + (high - Math.min(open, close)) * height / (high - low);

    return (
      <g>
        {/* Upper wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={wickTop}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
        {/* Lower wick */}
        <line
          x1={x + width / 2}
          y1={wickBottom}
          x2={x + width / 2}
          y2={y + height}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={bodyY}
          width={width * 0.6}
          height={bodyHeight}
          fill={isPositive ? '#10b981' : '#ef4444'}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1"
        />
      </g>
    );
  };

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
                <h1 className="text-xl sm:text-2xl font-bold">{symbol}</h1>
                <span className="text-xs sm:text-sm px-2 py-1 bg-gray-700 text-gray-300 rounded">
                  {marketLabel}
                </span>
                {loading && <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />}
              </div>
              <p className="text-sm sm:text-base text-gray-400">{quote?.name || name}</p>
              {error && <p className="text-xs text-red-400 mt-1">خطأ في جلب البيانات: {error}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              disabled={loading}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="تحديث البيانات"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => onToggleFavorite?.(symbol)}
              className={cn(
                "p-2 sm:p-3 rounded-lg transition-colors",
                isFavorite
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              )}
            >
              <Star className={cn("w-5 h-5 sm:w-6 sm:h-6", isFavorite && "fill-current")} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Enhanced Price Section with Mobile-Optimized Layout */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          {/* Price and Recommendation Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Price Section */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {market === 'us' ? `$${currentPrice.toFixed(2)}` : `${currentPrice.toFixed(2)} ريال`}
                </span>
                <div className={cn(
                  "flex items-center space-x-2 px-3 py-1 rounded-lg w-fit",
                  isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {isPositive ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                  <span className="text-sm sm:text-lg font-medium">
                    {isPositive ? '+' : ''}{currentChange.toFixed(2)} ({currentChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">
                {market === 'us' ? `≈ ${priceInSar.toFixed(2)} ريال سعودي` : `≈ $${priceInUsd.toFixed(2)} دولار أمريكي`}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                آخر تحديث: {quote?.timestamp ? new Date(quote.timestamp).toLocaleString('ar-SA') : new Date().toLocaleTimeString('ar-SA')}
              </div>
            </div>
            
            {/* Recommendation Section */}
            <div className={cn(
              "flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 text-sm sm:text-lg font-semibold w-fit",
              getRecommendationColor(recommendation)
            )}>
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              <span>التوصية: {getRecommendationText(recommendation)}</span>
            </div>
          </div>

          {/* Quick Stats - Mobile Optimized Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-gray-700">
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">الأعلى اليوم</p>
              <p className="text-sm sm:text-lg font-semibold text-green-400">${quote?.high?.toFixed(2) || (currentPrice * 1.02).toFixed(2)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">الأدنى اليوم</p>
              <p className="text-sm sm:text-lg font-semibold text-red-400">${quote?.low?.toFixed(2) || (currentPrice * 0.98).toFixed(2)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">حجم التداول</p>
              <p className="text-sm sm:text-lg font-semibold text-blue-400">
                {quote?.volume ? quote.volume > 1000000 ? `${(quote.volume / 1000000).toFixed(1)}M` : `${(quote.volume / 1000).toFixed(0)}K` : '1.2M'}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-gray-700/30 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">القيمة السوقية</p>
              <p className="text-sm sm:text-lg font-semibold text-purple-400">2.8B</p>
            </div>
          </div>
        </div>

        {/* Advanced Technical Analysis Section */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
            التحليل الفني المتقدم
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Support and Resistance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">مستويات الدعم والمقاومة</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-red-400">مقاومة 2</span>
                  <span className="text-white font-bold">
                    {market === 'us' ? `$${(currentPrice * 1.15).toFixed(2)}` : `${(currentPrice * 1.15).toFixed(2)} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <span className="text-red-300">مقاومة 1</span>
                  <span className="text-white font-bold">
                    {market === 'us' ? `$${(currentPrice * 1.08).toFixed(2)}` : `${(currentPrice * 1.08).toFixed(2)} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-blue-400">السعر الحالي</span>
                  <span className="text-white font-bold">
                    {market === 'us' ? `$${currentPrice.toFixed(2)}` : `${currentPrice.toFixed(2)} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                  <span className="text-green-300">دعم 1</span>
                  <span className="text-white font-bold">
                    {market === 'us' ? `$${(currentPrice * 0.95).toFixed(2)}` : `${(currentPrice * 0.95).toFixed(2)} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-green-400">دعم 2</span>
                  <span className="text-white font-bold">
                    {market === 'us' ? `$${(currentPrice * 0.88).toFixed(2)}` : `${(currentPrice * 0.88).toFixed(2)} ر.س`}
                  </span>
                </div>
              </div>
            </div>

            {/* Entry Signal and Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">إشارة الدخول والتوقيت</h3>
              <div className="space-y-3">
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">إشارة الدخول</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentChangePercent > 2 ? 'bg-green-500/20 text-green-400' :
                      currentChangePercent > 0 ? 'bg-blue-500/20 text-blue-400' :
                      currentChangePercent < -2 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {currentChangePercent > 2 ? 'شراء قوي' :
                       currentChangePercent > 0 ? 'شراء' :
                       currentChangePercent < -2 ? 'بيع قوي' :
                       currentChangePercent < 0 ? 'بيع' : 'انتظار'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">أفضل توقيت للدخول</span>
                    <span className="text-yellow-400 font-bold">
                      {Math.abs(currentChangePercent) > 3 ? 'دقائق' :
                       Math.abs(currentChangePercent) > 1 ? 'ساعات' :
                       Math.abs(currentChangePercent) > 0.5 ? 'يوم واحد' : 'أسبوع'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">احتمالية النجاح</span>
                    <span className="text-teal-400 font-bold">
                      {Math.abs(currentChangePercent) > 3 ? '85%' :
                       Math.abs(currentChangePercent) > 1 ? '72%' :
                       Math.abs(currentChangePercent) > 0 ? '65%' : '45%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.abs(currentChangePercent) > 3 ? 85 :
                                 Math.abs(currentChangePercent) > 1 ? 72 :
                                 Math.abs(currentChangePercent) > 0 ? 65 : 45}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">المؤشرات الفنية</h3>
              <div className="space-y-3">
                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">RSI</span>
                    <span className="text-indigo-400 font-bold">
                      {(45 + Math.random() * 30).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {45 + Math.random() * 30 > 70 ? 'منطقة تشبع شرائي' :
                     45 + Math.random() * 30 < 30 ? 'منطقة تشبع بيعي' : 'منطقة متوازنة'}
                  </div>
                </div>

                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">MACD</span>
                    <span className="text-orange-400 font-bold">
                      {currentChangePercent > 0 ? 'إيجابي' : currentChangePercent < 0 ? 'سلبي' : 'محايد'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentChangePercent > 0 ? 'إشارة صاعدة' : currentChangePercent < 0 ? 'إشارة هابطة' : 'لا توجد إشارة واضحة'}
                  </div>
                </div>

                <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">التقلب (Volatility)</span>
                    <span className="text-pink-400 font-bold">
                      {((Math.abs(currentChangePercent) + Math.random() * 2)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.abs(currentChangePercent) > 3 ? 'تقلب عالي' :
                     Math.abs(currentChangePercent) > 1 ? 'تقلب متوسط' : 'تقلب منخفض'}
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">قوة الاتجاه</span>
                    <span className="text-cyan-400 font-bold">
                      {Math.abs(currentChangePercent) > 3 ? 'قوي' :
                       Math.abs(currentChangePercent) > 1 ? 'متوسط' : 'ضعيف'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentChangePercent > 0 ? 'اتجاه صاعد' : currentChangePercent < 0 ? 'اتجاه هابط' : 'اتجاه جانبي'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Trading Recommendations */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-3 text-green-400" />
            توصيات التداول الذكي
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">استراتيجية الدخول</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">نقطة الدخول المثلى</span>
                  </div>
                  <p className="text-white text-sm">
                    {market === 'us' ? `$${(currentPrice * 0.98).toFixed(2)}` : `${(currentPrice * 0.98).toFixed(2)} ر.س`} - 
                    {market === 'us' ? `$${(currentPrice * 1.02).toFixed(2)}` : `${(currentPrice * 1.02).toFixed(2)} ر.س`}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    ادخل عند كسر المقاومة أو الارتداد من الدعم
                  </p>
                </div>
                
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-semibold">نقطة وقف الخسارة</span>
                  </div>
                  <p className="text-white text-sm">
                    {market === 'us' ? `$${(currentPrice * 0.92).toFixed(2)}` : `${(currentPrice * 0.92).toFixed(2)} ر.س`}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    حدد وقف الخسارة عند 8% من سعر الدخول
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">أهداف الربح</h3>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 font-semibold">الهدف الأول</span>
                    <span className="text-white">
                      {market === 'us' ? `$${(currentPrice * 1.05).toFixed(2)}` : `${(currentPrice * 1.05).toFixed(2)} ر.س`}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">ربح متوقع: 5%</p>
                </div>
                
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-semibold">الهدف الثاني</span>
                    <span className="text-white">
                      {market === 'us' ? `$${(currentPrice * 1.12).toFixed(2)}` : `${(currentPrice * 1.12).toFixed(2)} ر.س`}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">ربح متوقع: 12%</p>
                </div>
                
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-semibold">الهدف النهائي</span>
                    <span className="text-white">
                      {market === 'us' ? `$${(currentPrice * 1.20).toFixed(2)}` : `${(currentPrice * 1.20).toFixed(2)} ر.س`}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">ربح متوقع: 20%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candlestick Chart - Mobile Optimized */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            الشموع اليابانية {candlestickData.length > 0 && <span className="text-green-400 text-sm mr-2">(بيانات حقيقية)</span>}
          </h2>
          {candlestickData.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-400">
              <p>لا توجد بيانات متاحة للرسم البياني</p>
              <button onClick={refreshData} className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                إعادة المحاولة
              </button>
            </div>
          )}
          {(candlestickData.length > 0 || loading) && (
            <div className="h-64 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={candlestickData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'volume') return [value.toLocaleString(), 'الحجم'];
                    return [`$${value}`, name === 'open' ? 'الافتتاح' : name === 'high' ? 'الأعلى' : name === 'low' ? 'الأدنى' : 'الإغلاق'];
                  }}
                />
                <Bar dataKey="volume" fill="#6B7280" opacity={0.3} yAxisId="volume" />
                {candlestickData.map((entry, index) => (
                  <CustomCandlestick
                    key={index}
                    payload={entry}
                    x={index * (100 / candlestickData.length)}
                    y={0}
                    width={100 / candlestickData.length}
                    height={100}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
            </div>
          )}
          
          {/* Chart Analysis - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-3">التحليل الفني للشموع</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <p className="text-gray-300">• الاتجاه العام: <span className="text-green-400">صاعد</span></p>
                <p className="text-gray-300">• نمط الشموع: <span className="text-yellow-400">متتالية إيجابية</span></p>
                <p className="text-gray-300">• قوة الحجم: <span className="text-blue-400">مرتفعة</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-300">• مستوى الدعم: <span className="text-green-400">$147.50</span></p>
                <p className="text-gray-300">• مستوى المقاومة: <span className="text-red-400">$152.00</span></p>
                <p className="text-gray-300">• التوقع القادم: <span className="text-green-400">استمرار الصعود</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Reason - Mobile Optimized */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            سبب التوصية
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{reason}</p>
        </div>

        {/* Technical Indicators - Mobile Optimized */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">
            المؤشرات الفنية {technicalIndicators.length > 0 && <span className="text-green-400 text-sm">(بيانات حقيقية)</span>}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {displayTechnicalData.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-gray-400">{item.indicator}</span>
                  <span className="text-xs sm:text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-sm sm:text-lg font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation History - Mobile Optimized */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
            تاريخ التوصيات
          </h2>
          <div className="space-y-3">
            {mockHistory.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm">{item.date}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    item.recommendation === 'buy' ? 'bg-green-500/20 text-green-400' : 
                    item.recommendation === 'sell' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  )}>
                    {getRecommendationText(item.recommendation)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{item.result}</span>
                  <span className="text-xs sm:text-sm text-gray-400">{item.status}</span>
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
