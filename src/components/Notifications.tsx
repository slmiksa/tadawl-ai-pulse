
import React, { useState, useEffect } from 'react';
import { Bell, Settings, Check, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavoriteStocks();
    fetchNotifications();
  }, []);

  const fetchFavoriteStocks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's watchlists
      const { data: watchlists } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', user.id);

      if (watchlists && watchlists.length > 0) {
        // Get stocks in watchlists
        const watchlistIds = watchlists.map(w => w.id);
        const { data: watchlistStocks } = await supabase
          .from('watchlist_stocks')
          .select(`
            stock_id,
            stocks (
              symbol,
              name,
              price,
              change_percent,
              recommendation,
              support_level_1,
              resistance_level_1
            )
          `)
          .in('watchlist_id', watchlistIds);

        if (watchlistStocks) {
          setFavoriteStocks(watchlistStocks.map(ws => ws.stocks));
          generateNotificationsFromStocks(watchlistStocks.map(ws => ws.stocks));
        }
      }
    } catch (error) {
      console.error('Error fetching favorite stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotificationsFromStocks = (stocks) => {
    const notifications = [];
    
    stocks.forEach((stock, index) => {
      if (!stock) return;

      // Recommendation change notifications
      if (stock.recommendation === 'buy') {
        notifications.push({
          id: index * 3 + 1,
          type: 'recommendation',
          title: `توصية شراء: ${stock.symbol}`,
          message: `توصية شراء قوية لسهم ${stock.name} - ${stock.symbol}`,
          time: 'منذ ساعة',
          read: false,
          icon: TrendingUp,
          color: 'text-green-400',
        });
      } else if (stock.recommendation === 'sell') {
        notifications.push({
          id: index * 3 + 2,
          type: 'recommendation',
          title: `توصية بيع: ${stock.symbol}`,
          message: `توصية بيع لسهم ${stock.name} - ${stock.symbol}`,
          time: 'منذ ساعتين',
          read: false,
          icon: TrendingDown,
          color: 'text-red-400',
        });
      }

      // Support/Resistance level alerts
      if (stock.support_level_1 && stock.price && Math.abs(stock.price - stock.support_level_1) / stock.price < 0.02) {
        notifications.push({
          id: index * 3 + 3,
          type: 'alert',
          title: `تنبيه مستوى دعم: ${stock.symbol}`,
          message: `سهم ${stock.name} اقترب من مستوى الدعم عند ${stock.support_level_1?.toFixed(2)}`,
          time: 'منذ 30 دقيقة',
          read: false,
          icon: AlertTriangle,
          color: 'text-yellow-400',
        });
      }

      if (stock.resistance_level_1 && stock.price && Math.abs(stock.price - stock.resistance_level_1) / stock.price < 0.02) {
        notifications.push({
          id: index * 3 + 4,
          type: 'alert',
          title: `تنبيه مستوى مقاومة: ${stock.symbol}`,
          message: `سهم ${stock.name} اقترب من مستوى المقاومة عند ${stock.resistance_level_1?.toFixed(2)}`,
          time: 'منذ 45 دقيقة',
          read: false,
          icon: AlertTriangle,
          color: 'text-orange-400',
        });
      }

      // Strong movement alerts
      if (stock.change_percent && Math.abs(stock.change_percent) > 5) {
        notifications.push({
          id: index * 3 + 5,
          type: 'signal',
          title: `حركة قوية: ${stock.symbol}`,
          message: `سهم ${stock.name} يشهد ${stock.change_percent > 0 ? 'ارتفاع' : 'انخفاض'} قوي بنسبة ${Math.abs(stock.change_percent).toFixed(2)}%`,
          time: 'منذ 15 دقيقة',
          read: false,
          icon: stock.change_percent > 0 ? TrendingUp : TrendingDown,
          color: stock.change_percent > 0 ? 'text-green-400' : 'text-red-400',
        });
      }
    });

    setNotifications(notifications.slice(0, 10)); // Limit to 10 notifications
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedNotifications = data.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          time: new Date(notif.created_at).toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          read: notif.is_read,
          icon: notif.type === 'recommendation' ? TrendingUp : AlertTriangle,
          color: notif.type === 'recommendation' ? 'text-green-400' : 'text-yellow-400',
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const [settings, setSettings] = useState({
    recommendations: true,
    alerts: true,
    signals: true,
    marketNews: false,
    sound: true,
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Bell className="w-8 h-8 text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">
            التنبيهات
          </h1>
        </div>
        <p className="text-gray-400">
          تنبيهات فورية للتحديثات والفرص المهمة
        </p>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-sm text-gray-400">غير مقروءة: </span>
            <span className="text-white font-semibold">{unreadCount}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-sm text-gray-400">المجموع: </span>
            <span className="text-white font-semibold">{notifications.length}</span>
          </div>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>تحديد الكل كمقروء</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4 mb-8">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-gray-800 rounded-lg p-4 border transition-all ${
              notification.read 
                ? 'border-gray-700 opacity-80' 
                : 'border-purple-500/50 bg-gray-800/80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-700/50 ${notification.color}`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                    title="تحديد كمقروء"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="حذف"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-3 text-purple-400" />
          إعدادات التنبيهات
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">تغيير التوصيات</p>
              <p className="text-sm text-gray-400">تنبيهات عند تحديث التوصيات</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.recommendations}
                onChange={(e) => setSettings(prev => ({ ...prev, recommendations: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">تنبيهات الدعم والمقاومة</p>
              <p className="text-sm text-gray-400">تنبيهات عند وصول مستويات مهمة</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts}
                onChange={(e) => setSettings(prev => ({ ...prev, alerts: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">الإشارات الفنية</p>
              <p className="text-sm text-gray-400">تنبيهات للإشارات الفنية الجديدة</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.signals}
                onChange={(e) => setSettings(prev => ({ ...prev, signals: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">أخبار السوق</p>
              <p className="text-sm text-gray-400">تنبيهات للأخبار المهمة</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.marketNews}
                onChange={(e) => setSettings(prev => ({ ...prev, marketNews: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">تنبيهات صوتية</p>
              <p className="text-sm text-gray-400">تشغيل صوت مع التنبيهات</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
