
import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Clock, DollarSign } from 'lucide-react';

const TodayAnalysis: React.FC = () => {
  const marketOverview = {
    usMarket: {
      status: 'open',
      change: 0.85,
      volume: '2.4B',
      sentiment: 'positive',
    },
    saudiMarket: {
      status: 'closed',
      change: -0.23,
      volume: '1.2B',
      sentiment: 'neutral',
    },
  };

  const topOpportunities = [
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      market: 'us',
      price: 875.20,
      change: 12.5,
      opportunity: 'اختراق مستوى مقاومة قوي مع حجم تداول عالي',
      strength: 'قوية',
      timeframe: '15 دقيقة',
    },
    {
      symbol: '2030.SR',
      name: 'سابك',
      market: 'saudi',
      price: 95.60,
      change: 8.3,
      opportunity: 'نموذج فني إيجابي مع تجديد الدعم',
      strength: 'متوسطة',
      timeframe: '1 ساعة',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      market: 'us',
      price: 145.30,
      change: 5.7,
      opportunity: 'كسر المقاومة مع إشارات RSI إيجابية',
      strength: 'قوية',
      timeframe: '30 دقيقة',
    },
  ];

  const marketNews = [
    {
      title: 'ارتفاع أسعار النفط يدعم الأسهم السعودية',
      time: '10:30',
      impact: 'positive',
      description: 'أسعار النفط تتجاوز 85 دولار للبرميل مما يدعم أسهم الطاقة',
    },
    {
      title: 'تحديث أرباح شركات التكنولوجيا الأمريكية',
      time: '09:15',
      impact: 'neutral',
      description: 'نتائج متباينة لشركات التكنولوجيا في الربع الأول',
    },
    {
      title: 'قرار البنك المركزي الأمريكي بشأن الفائدة',
      time: '08:00',
      impact: 'negative',
      description: 'توقعات برفع الفائدة قد تؤثر على السوق',
    },
  ];

  const getMarketStatus = (status: string) => {
    switch (status) {
      case 'open':
        return { text: 'مفتوح', color: 'text-green-400' };
      case 'closed':
        return { text: 'مغلق', color: 'text-red-400' };
      default:
        return { text: 'غير محدد', color: 'text-gray-400' };
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'قوية':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'متوسطة':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ضعيفة':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">
            تحليلات اليوم
          </h1>
        </div>
        <p className="text-gray-400">
          أقوى الفرص والتحليلات للأسواق المالية اليوم
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">السوق الأمريكي</h2>
            <span className="text-2xl">🇺🇸</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">الحالة</span>
              <span className={getMarketStatus(marketOverview.usMarket.status).color}>
                {getMarketStatus(marketOverview.usMarket.status).text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">التغيير</span>
              <span className={marketOverview.usMarket.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {marketOverview.usMarket.change >= 0 ? '+' : ''}{marketOverview.usMarket.change}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">حجم التداول</span>
              <span className="text-white">{marketOverview.usMarket.volume}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">السوق السعودي</h2>
            <span className="text-2xl">🇸🇦</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">الحالة</span>
              <span className={getMarketStatus(marketOverview.saudiMarket.status).color}>
                {getMarketStatus(marketOverview.saudiMarket.status).text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">التغيير</span>
              <span className={marketOverview.saudiMarket.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {marketOverview.saudiMarket.change >= 0 ? '+' : ''}{marketOverview.saudiMarket.change}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">حجم التداول</span>
              <span className="text-white">{marketOverview.saudiMarket.volume}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-purple-400" />
          أقوى الفرص اليوم
        </h2>
        <div className="space-y-4">
          {topOpportunities.map((opportunity, index) => (
            <div key={opportunity.symbol} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{opportunity.symbol}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                        {opportunity.market === 'us' ? 'أمريكي' : 'سعودي'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{opportunity.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">${opportunity.price}</p>
                  <p className="text-green-400 font-medium">+{opportunity.change}%</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-300">{opportunity.opportunity}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${getStrengthColor(opportunity.strength)}`}>
                  {opportunity.strength}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{opportunity.timeframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market News */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
          أخبار السوق
        </h2>
        <div className="space-y-4">
          {marketNews.map((news, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{news.title}</h3>
                <span className="text-sm text-gray-400">{news.time}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{news.description}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                news.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                news.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {news.impact === 'positive' ? 'إيجابي' :
                 news.impact === 'negative' ? 'سلبي' : 'محايد'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayAnalysis;
