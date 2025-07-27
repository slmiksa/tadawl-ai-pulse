
import React from 'react';
import { BarChart3, TrendingUp, Target, Award, Clock } from 'lucide-react';

const Performance: React.FC = () => {
  const performanceData = [
    { date: '2024-01-27', recommendations: 12, successful: 9, accuracy: 75 },
    { date: '2024-01-26', recommendations: 15, successful: 13, accuracy: 87 },
    { date: '2024-01-25', recommendations: 10, successful: 8, accuracy: 80 },
    { date: '2024-01-24', recommendations: 18, successful: 14, accuracy: 78 },
    { date: '2024-01-23', recommendations: 8, successful: 7, accuracy: 88 },
  ];

  const topPerformers = [
    { symbol: 'AAPL', name: 'Apple Inc.', profit: 12.5, trades: 5 },
    { symbol: '2222.SR', name: 'أرامكو السعودية', profit: 8.3, trades: 3 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', profit: 7.9, trades: 4 },
    { symbol: 'TSLA', name: 'Tesla Inc.', profit: 6.2, trades: 6 },
    { symbol: '1120.SR', name: 'بنك الراجحي', profit: 5.8, trades: 2 },
  ];

  const overallStats = {
    totalRecommendations: 245,
    successfulRecommendations: 186,
    totalProfit: 34.7,
    avgAccuracy: 76,
    bestWeek: 92,
    tradingDays: 30,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">
            أداء التوصيات
          </h1>
        </div>
        <p className="text-gray-400">
          إحصائيات شاملة لأداء الذكاء الاصطناعي
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي التوصيات</p>
              <p className="text-2xl font-bold text-white">{overallStats.totalRecommendations}</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">التوصيات الناجحة</p>
              <p className="text-2xl font-bold text-green-400">{overallStats.successfulRecommendations}</p>
            </div>
            <Award className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">نسبة الدقة</p>
              <p className="text-2xl font-bold text-blue-400">{overallStats.avgAccuracy}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي الربح</p>
              <p className="text-2xl font-bold text-yellow-400">{overallStats.totalProfit}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-purple-400" />
          الأداء خلال الأيام الماضية
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 text-gray-400">التاريخ</th>
                <th className="text-right py-3 px-4 text-gray-400">التوصيات</th>
                <th className="text-right py-3 px-4 text-gray-400">الناجحة</th>
                <th className="text-right py-3 px-4 text-gray-400">نسبة الدقة</th>
                <th className="text-right py-3 px-4 text-gray-400">الأداء</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((day, index) => (
                <tr key={index} className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white">{day.date}</td>
                  <td className="py-3 px-4 text-white">{day.recommendations}</td>
                  <td className="py-3 px-4 text-green-400">{day.successful}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      day.accuracy >= 80 ? 'bg-green-500/20 text-green-400' :
                      day.accuracy >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {day.accuracy}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          day.accuracy >= 80 ? 'bg-green-500' :
                          day.accuracy >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${day.accuracy}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Award className="w-6 h-6 mr-3 text-yellow-400" />
          أفضل الأسهم أداءً هذا الأسبوع
        </h2>
        <div className="space-y-4">
          {topPerformers.map((stock, index) => (
            <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{stock.symbol}</h3>
                  <p className="text-gray-400 text-sm">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-bold text-lg">+{stock.profit}%</p>
                <p className="text-gray-400 text-sm">{stock.trades} توصية</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;
