
import React, { useState } from 'react';
import { User, Settings, LogOut, Edit, Save, Mail, Phone, Calendar, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'أحمد المطيري',
    email: 'ahmed.almutairi@email.com',
    phone: '+966 50 123 4567',
    joinDate: '2024-01-15',
    tradingExperience: 'متوسط',
    favoriteMarkets: ['السوق الأمريكي', 'السوق السعودي'],
  });

  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  const handleSave = () => {
    setUserInfo(tempUserInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUserInfo(userInfo);
    setIsEditing(false);
  };

  const accountStats = {
    totalRecommendations: 152,
    successfulTrades: 89,
    favoriteStocks: 8,
    daysActive: 45,
    accuracy: 78,
  };

  const preferences = {
    language: 'العربية',
    timezone: 'Asia/Riyadh',
    notifications: 'مفعل',
    theme: 'داكن',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <User className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">
            الملف الشخصي
          </h1>
        </div>
        <p className="text-gray-400">
          إدارة حسابك وتخصيص تجربتك
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userInfo.name}</h2>
              <p className="text-gray-400">{userInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'إلغاء' : 'تعديل'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <Mail className="w-4 h-4 inline mr-2" />
                البريد الإلكتروني
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempUserInfo.email}
                  onChange={(e) => setTempUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-white">{userInfo.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <Phone className="w-4 h-4 inline mr-2" />
                رقم الجوال
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempUserInfo.phone}
                  onChange={(e) => setTempUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-white">{userInfo.phone}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <Calendar className="w-4 h-4 inline mr-2" />
                تاريخ الانضمام
              </label>
              <p className="text-white">{userInfo.joinDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <Shield className="w-4 h-4 inline mr-2" />
                مستوى الخبرة
              </label>
              {isEditing ? (
                <select
                  value={tempUserInfo.tradingExperience}
                  onChange={(e) => setTempUserInfo(prev => ({ ...prev, tradingExperience: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                  <option value="خبير">خبير</option>
                </select>
              ) : (
                <p className="text-white">{userInfo.tradingExperience}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>حفظ</span>
            </button>
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">إحصائيات الحساب</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{accountStats.totalRecommendations}</p>
            <p className="text-sm text-gray-400">توصية متابعة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{accountStats.successfulTrades}</p>
            <p className="text-sm text-gray-400">صفقة ناجحة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{accountStats.favoriteStocks}</p>
            <p className="text-sm text-gray-400">أسهم مفضلة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{accountStats.daysActive}</p>
            <p className="text-sm text-gray-400">يوم نشط</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{accountStats.accuracy}%</p>
            <p className="text-sm text-gray-400">دقة المتابعة</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-3 text-purple-400" />
          الإعدادات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">اللغة</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">المنطقة الزمنية</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="Asia/Riyadh">الرياض</option>
              <option value="America/New_York">نيويورك</option>
              <option value="Europe/London">لندن</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">تسجيل الخروج</h3>
            <p className="text-sm text-gray-400">تسجيل الخروج من حسابك</p>
          </div>
          <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
