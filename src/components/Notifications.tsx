
import React, { useState } from 'react';
import { Bell, Settings, Check, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'recommendation',
      title: 'تغيير في توصية AAPL',
      message: 'تم تحديث توصية Apple من انتظار إلى شراء',
      time: '10:30 ص',
      read: false,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      id: 2,
      type: 'alert',
      title: 'تنبيه مستوى دعم',
      message: 'سهم TSLA وصل إلى مستوى الدعم عند 245$',
      time: '09:45 ص',
      read: false,
      icon: AlertTriangle,
      color: 'text-yellow-400',
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'توصية بيع جديدة',
      message: 'توصية بيع لسهم META بسبب كسر مستوى الدعم',
      time: '08:20 ص',
      read: true,
      icon: TrendingDown,
      color: 'text-red-400',
    },
    {
      id: 4,
      type: 'signal',
      title: 'إشارة فنية قوية',
      message: 'سهم 2222.SR يظهر نموذج صاعد قوي',
      time: 'أمس',
      read: true,
      icon: TrendingUp,
      color: 'text-green-400',
    },
  ]);

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
