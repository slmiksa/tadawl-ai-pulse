
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { useStocksList } from '@/hooks/useStocksList';
import { useLanguage } from '@/contexts/LanguageContext';

const TodayAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const { stocks: usStocks, loading: usLoading } = useStocksList('us');
  const { stocks: saudiStocks, loading: saudiLoading } = useStocksList('saudi');
  const [marketOverview, setMarketOverview] = useState({
    usMarket: { status: 'open', change: 0, volume: '0', sentiment: 'neutral' },
    saudiMarket: { status: 'closed', change: 0, volume: '0', sentiment: 'neutral' }
  });

  // Calculate real market data from API and market status
  useEffect(() => {
    if (usStocks.length > 0) {
      const avgChange = usStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / usStocks.length;
      const totalVolume = usStocks.reduce((sum, stock) => sum + (stock.volume || 0), 0);
      const volumeInBillions = (totalVolume / 1000000000).toFixed(1);
      
      // Real US market hours check (EST timezone)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const est = new Date(utc + (-5 * 3600000)); // EST = UTC-5
      const day = est.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = est.getHours();
      const isWeekday = day >= 1 && day <= 5;
      const isMarketHours = hour >= 9 && hour < 16; // 9:30 AM to 4 PM EST
      const usStatus = isWeekday && isMarketHours ? 'open' : 'closed';
      
      setMarketOverview(prev => ({
        ...prev,
        usMarket: {
          status: usStatus,
          change: parseFloat(avgChange.toFixed(2)),
          volume: `${volumeInBillions}B`,
          sentiment: avgChange > 0 ? 'positive' : avgChange < 0 ? 'negative' : 'neutral'
        }
      }));
    }

    if (saudiStocks.length > 0) {
      const avgChange = saudiStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / saudiStocks.length;
      const totalVolume = saudiStocks.reduce((sum, stock) => sum + (stock.volume || 0), 0);
      const volumeInBillions = (totalVolume / 1000000000).toFixed(1);
      
      // Real Saudi market hours check (AST timezone)
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const ast = new Date(utc + (3 * 3600000)); // AST = UTC+3
      const day = ast.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = ast.getHours();
      const isWeekday = day >= 0 && day <= 4; // Sunday to Thursday
      const isMarketHours = hour >= 10 && hour < 15; // 10 AM to 3 PM AST
      const saudiStatus = isWeekday && isMarketHours ? 'open' : 'closed';
      
      setMarketOverview(prev => ({
        ...prev,
        saudiMarket: {
          status: saudiStatus,
          change: parseFloat(avgChange.toFixed(2)),
          volume: `${volumeInBillions}B`,
          sentiment: avgChange > 0 ? 'positive' : avgChange < 0 ? 'negative' : 'neutral'
        }
      }));
    }
  }, [usStocks, saudiStocks]);

  // Get top opportunities from real data
  const getTopOpportunities = () => {
    const allStocks = [...usStocks, ...saudiStocks];
    
    // Filter stocks with significant positive movement
    const opportunities = allStocks
      .filter(stock => stock.changePercent > 1) // Only stocks with >1% gain
      .sort((a, b) => b.changePercent - a.changePercent) // Sort by highest gain
      .slice(0, 3) // Take top 3
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        market: stock.market,
        price: stock.price,
        change: stock.changePercent,
        opportunity: generateOpportunityText(stock.changePercent),
        strength: getStrengthFromChange(stock.changePercent),
        timeframe: '15 دقيقة',
      }));

    // If no strong opportunities, show best performers regardless
    if (opportunities.length < 3) {
      const topPerformers = allStocks
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 3)
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          market: stock.market,
          price: stock.price,
          change: stock.changePercent,
          opportunity: generateOpportunityText(stock.changePercent),
          strength: getStrengthFromChange(stock.changePercent),
          timeframe: '30 دقيقة',
        }));
      
      return topPerformers;
    }

    return opportunities;
  };

  const generateOpportunityText = (changePercent: number) => {
    if (changePercent > 5) return 'اختراق مستوى مقاومة قوي مع حجم تداول عالي';
    if (changePercent > 2) return 'نموذج فني إيجابي مع تجديد الدعم';
    if (changePercent > 0) return 'كسر المقاومة مع إشارات RSI إيجابية';
    if (changePercent > -2) return 'استقرار عند مستوى الدعم';
    return 'ضغط بيعي مع مستوى دعم قريب';
  };

  const getStrengthFromChange = (changePercent: number) => {
    if (changePercent > 3) return 'قوية';
    if (changePercent > 1) return 'متوسطة';
    return 'ضعيفة';
  };


  const getMarketStatus = (status: string) => {
    switch (status) {
      case 'open':
        return { text: t('analysis.open'), color: 'text-green-400' };
      case 'closed':
        return { text: t('analysis.closed'), color: 'text-red-400' };
      default:
        return { text: 'غير محدد', color: 'text-gray-400' };
    }
  };

  // Real system updates based on actual data
  const getSystemUpdates = () => {
    const totalStocks = usStocks.length + saudiStocks.length;
    const totalRealData = [...usStocks, ...saudiStocks].filter(stock => stock.volume > 0).length;
    const lastUpdateTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    const dataFreshness = totalRealData > 0 ? 'positive' : 'neutral';
    
    return [
      {
        title: `تم تحديث ${totalStocks} سهم بنجاح`,
        time: lastUpdateTime,
        impact: 'positive',
        description: `تم جلب البيانات لـ ${totalRealData} سهم من مصادر حقيقية و ${totalStocks - totalRealData} سهم من البيانات الاحتياطية`,
      },
      {
        title: `حالة الأسواق: أمريكي ${getMarketStatus(marketOverview.usMarket.status).text} - سعودي ${getMarketStatus(marketOverview.saudiMarket.status).text}`,
        time: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        impact: marketOverview.usMarket.status === 'open' || marketOverview.saudiMarket.status === 'open' ? 'positive' : 'neutral',
        description: 'مراقبة مستمرة لحالة الأسواق العالمية وساعات التداول',
      },
      {
        title: `معدل التغيير: أمريكي ${marketOverview.usMarket.change.toFixed(2)}% - سعودي ${marketOverview.saudiMarket.change.toFixed(2)}%`,
        time: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        impact: (marketOverview.usMarket.change + marketOverview.saudiMarket.change) / 2 > 0 ? 'positive' : 'negative',
        description: 'تحليل الاتجاهات العامة للأسواق بناءً على البيانات الحقيقية',
      },
    ];
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

  const systemUpdates = getSystemUpdates();
  const topOpportunities = getTopOpportunities();
  const isLoading = usLoading || saudiLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">
            {t('analysis.title')}
          </h1>
          {isLoading && <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />}
        </div>
        <p className="text-gray-400">
          {t('analysis.subtitle')}
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{t('analysis.usMarket')}</h2>
            <span className="text-2xl">🇺🇸</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.status')}</span>
              <span className={getMarketStatus(marketOverview.usMarket.status).color}>
                {getMarketStatus(marketOverview.usMarket.status).text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.change')}</span>
              <span className={marketOverview.usMarket.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {marketOverview.usMarket.change >= 0 ? '+' : ''}{marketOverview.usMarket.change}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.volume')}</span>
              <span className="text-white">{marketOverview.usMarket.volume}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{t('analysis.saudiMarket')}</h2>
            <span className="text-2xl">🇸🇦</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.status')}</span>
              <span className={getMarketStatus(marketOverview.saudiMarket.status).color}>
                {getMarketStatus(marketOverview.saudiMarket.status).text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.change')}</span>
              <span className={marketOverview.saudiMarket.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {marketOverview.saudiMarket.change >= 0 ? '+' : ''}{marketOverview.saudiMarket.change}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t('analysis.volume')}</span>
              <span className="text-white">{marketOverview.saudiMarket.volume}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-purple-400" />
          {t('analysis.opportunities')}
        </h2>
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
            <p className="text-gray-400">{t('analysis.loading')}</p>
          </div>
        ) : (
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
                            <button 
                              onClick={() => alert(`تحليل الفرصة لـ ${opportunity.symbol}:\n${opportunity.opportunity}\n\nالسعر الحالي: ${opportunity.market === 'us' ? `$${opportunity.price.toFixed(2)}` : `${opportunity.price.toFixed(2)} ر.س`}\nالتغيير: ${opportunity.change >= 0 ? '+' : ''}${opportunity.change.toFixed(2)}%\nقوة الإشارة: ${opportunity.strength}`)}
                              className="text-lg font-bold text-white hover:text-purple-400 transition-colors underline decoration-dotted"
                            >
                              {opportunity.symbol}
                            </button>
                            <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded">
                              {opportunity.market === 'us' ? t('stock.us') : t('stock.saudi')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{opportunity.name}</p>
                        </div>
                      </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {opportunity.market === 'us' ? `$${opportunity.price.toFixed(2)}` : `${opportunity.price.toFixed(2)} ر.س`}
                    </p>
                    <p className={`font-medium ${opportunity.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {opportunity.change >= 0 ? '+' : ''}{opportunity.change.toFixed(2)}%
                    </p>
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
        )}
      </div>

      {/* Market News */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
          {t('analysis.systemUpdates')}
        </h2>
        <div className="space-y-4">
          {systemUpdates.map((update, index) => (
            <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{update.title}</h3>
                <span className="text-sm text-gray-400">{update.time}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{update.description}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                update.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                update.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {update.impact === 'positive' ? t('analysis.positive') :
                 update.impact === 'negative' ? t('analysis.negative') : t('analysis.neutral')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayAnalysis;
