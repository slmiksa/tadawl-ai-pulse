import React from 'react';
import { ArrowLeft, Star, TrendingUp, TrendingDown, AlertCircle, BarChart3, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
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
  const isPositive = change >= 0;
  const marketLabel = market === 'us' ? 'السوق الأمريكي' : 'السوق السعودي';

  // Mock candlestick data
  const candlestickData = [{
    time: '9:30',
    open: 142.5,
    high: 145.2,
    low: 141.8,
    close: 144.1,
    volume: 1200000
  }, {
    time: '10:00',
    open: 144.1,
    high: 146.5,
    low: 143.2,
    close: 145.8,
    volume: 980000
  }, {
    time: '10:30',
    open: 145.8,
    high: 147.1,
    low: 144.9,
    close: 146.3,
    volume: 1100000
  }, {
    time: '11:00',
    open: 146.3,
    high: 148.0,
    low: 145.5,
    close: 147.2,
    volume: 1350000
  }, {
    time: '11:30',
    open: 147.2,
    high: 148.8,
    low: 146.1,
    close: 147.9,
    volume: 1050000
  }, {
    time: '12:00',
    open: 147.9,
    high: 149.2,
    low: 147.0,
    close: 148.5,
    volume: 1250000
  }, {
    time: '12:30',
    open: 148.5,
    high: 149.8,
    low: 147.8,
    close: 148.2,
    volume: 900000
  }, {
    time: '13:00',
    open: 148.2,
    high: 149.5,
    low: 147.5,
    close: 148.8,
    volume: 1150000
  }, {
    time: '13:30',
    open: 148.8,
    high: 150.1,
    low: 148.0,
    close: 149.3,
    volume: 1300000
  }, {
    time: '14:00',
    open: 149.3,
    high: 150.5,
    low: 148.7,
    close: 149.8,
    volume: 1180000
  }, {
    time: '14:30',
    open: 149.8,
    high: 151.2,
    low: 149.0,
    close: 150.4,
    volume: 1400000
  }, {
    time: '15:00',
    open: 150.4,
    high: 151.8,
    low: 149.8,
    close: 150.9,
    volume: 1220000
  }];
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
  const mockTechnicalData = [{
    indicator: 'RSI',
    value: '65.4',
    status: 'محايد'
  }, {
    indicator: 'MACD',
    value: '0.85',
    status: 'إيجابي'
  }, {
    indicator: 'حجم التداول',
    value: '1.2M',
    status: 'مرتفع'
  }, {
    indicator: 'مستوى الدعم',
    value: '$142.50',
    status: 'قوي'
  }, {
    indicator: 'مستوى المقاومة',
    value: '$148.20',
    status: 'متوسط'
  }];
  const mockHistory = [{
    date: '2024-01-27 10:30',
    recommendation: 'buy',
    result: '+2.5%',
    status: 'ناجح'
  }, {
    date: '2024-01-26 14:15',
    recommendation: 'sell',
    result: '+1.8%',
    status: 'ناجح'
  }, {
    date: '2024-01-25 09:45',
    recommendation: 'hold',
    result: '0.0%',
    status: 'محايد'
  }];
  const CustomCandlestick = ({
    payload,
    x,
    y,
    width,
    height
  }: any) => {
    if (!payload) return null;
    const {
      open,
      high,
      low,
      close
    } = payload;
    const isPositive = close > open;
    const bodyHeight = Math.abs(close - open) * height / (high - low);
    const bodyY = y + Math.max(high - Math.max(open, close), 0) * height / (high - low);
    const wickTop = y + (high - Math.max(open, close)) * height / (high - low);
    const wickBottom = y + (high - Math.min(open, close)) * height / (high - low);
    return <g>
        {/* Upper wick */}
        <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={wickTop} stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth="1" />
        {/* Lower wick */}
        <line x1={x + width / 2} y1={wickBottom} x2={x + width / 2} y2={y + height} stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth="1" />
        {/* Body */}
        <rect x={x + width * 0.2} y={bodyY} width={width * 0.6} height={bodyHeight} fill={isPositive ? '#10b981' : '#ef4444'} stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth="1" />
      </g>;
  };
  return <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
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
          <button onClick={() => onToggleFavorite?.(symbol)} className={cn("p-3 rounded-lg transition-colors", isFavorite ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" : "bg-gray-700 text-gray-400 hover:bg-gray-600")}>
            <Star className={cn("w-6 h-6", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Price Section */}
        <div className="bg-gray-800 rounded-lg p-6 mx-0 py-[22px] px-[7px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold">${price.toFixed(2)}</span>
              <div className={cn("flex items-center space-x-2 px-3 py-1 rounded-lg", isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
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

          <div className={cn("inline-flex items-center space-x-3 px-4 py-2 rounded-lg border text-lg font-medium", getRecommendationColor(recommendation))}>
            <AlertCircle className="w-5 h-5" />
            <span>التوصية الحالية: {getRecommendationText(recommendation)}</span>
          </div>
        </div>

        {/* Candlestick Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            الشموع اليابانية
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={candlestickData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{
                fill: '#9CA3AF',
                fontSize: 12
              }} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} tick={{
                fill: '#9CA3AF',
                fontSize: 12
              }} />
                <YAxis yAxisId="volume" orientation="right" axisLine={false} tickLine={false} tick={{
                fill: '#9CA3AF',
                fontSize: 12
              }} />
                <Tooltip contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }} formatter={(value: any, name: string) => {
                if (name === 'volume') return [value.toLocaleString(), 'الحجم'];
                return [`$${value}`, name === 'open' ? 'الافتتاح' : name === 'high' ? 'الأعلى' : name === 'low' ? 'الأدنى' : 'الإغلاق'];
              }} />
                <Bar dataKey="volume" fill="#6B7280" opacity={0.3} yAxisId="volume" />
                {candlestickData.map((entry, index) => <CustomCandlestick key={index} payload={entry} x={index * (100 / candlestickData.length)} y={0} width={100 / candlestickData.length} height={100} />)}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Analysis */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">التحليل الفني للشموع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">• الاتجاه العام: <span className="text-green-400">صاعد</span></p>
                <p className="text-gray-300">• نمط الشموع: <span className="text-yellow-400">متتالية إيجابية</span></p>
                <p className="text-gray-300">• قوة الحجم: <span className="text-blue-400">مرتفعة</span></p>
              </div>
              <div>
                <p className="text-gray-300">• مستوى الدعم: <span className="text-green-400">$147.50</span></p>
                <p className="text-gray-300">• مستوى المقاومة: <span className="text-red-400">$152.00</span></p>
                <p className="text-gray-300">• التوقع القادم: <span className="text-green-400">استمرار الصعود</span></p>
              </div>
            </div>
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
            {mockTechnicalData.map((item, index) => <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{item.indicator}</span>
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <span className="text-lg font-bold">{item.value}</span>
              </div>)}
          </div>
        </div>

        {/* Recommendation History */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-3" />
            تاريخ التوصيات
          </h2>
          <div className="space-y-3">
            {mockHistory.map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{item.date}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={cn("px-2 py-1 rounded text-xs", item.recommendation === 'buy' ? 'bg-green-500/20 text-green-400' : item.recommendation === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400')}>
                    {getRecommendationText(item.recommendation)}
                  </span>
                  <span className="text-sm font-medium">{item.result}</span>
                  <span className="text-sm text-gray-400">{item.status}</span>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default StockDetails;