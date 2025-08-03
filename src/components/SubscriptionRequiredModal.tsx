import React from 'react';
import { Crown, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (packageType: 'basic' | 'pro') => void;
}

const SubscriptionRequiredModal = ({ isOpen, onClose, onSubscribe }: SubscriptionRequiredModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">اشتراك مطلوب</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              للوصول إلى هذه الميزة، يجب عليك الاشتراك في إحدى الباقات
            </h3>
            <p className="text-gray-400">
              اختر الباقة المناسبة لاحتياجاتك واستمتع بجميع الميزات المتقدمة
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">الباقة الأساسية</h4>
                <div className="text-2xl font-bold text-white mb-1">
                  99 <span className="text-sm text-gray-400">ريال/شهر</span>
                </div>
                <p className="text-gray-400 text-sm">مثالية للمبتدئين</p>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="text-gray-300">• عرض جميع الأسهم</div>
                <div className="text-gray-300">• التوصيات الأساسية</div>
                <div className="text-gray-300">• إضافة للمفضلة</div>
                <div className="text-gray-300">• التنبيهات الأساسية</div>
              </div>

              <Button
                onClick={() => onSubscribe('basic')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                اشترك في الأساسية
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-700 rounded-xl p-6 border border-yellow-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  الأكثر شعبية
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">باقة البرو</h4>
                <div className="text-2xl font-bold text-white mb-1">
                  299 <span className="text-sm text-gray-400">ريال/شهر</span>
                </div>
                <p className="text-gray-400 text-sm">للمحترفين</p>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="text-gray-300">• جميع مميزات الأساسية</div>
                <div className="text-gray-300">• تحليلات تقنية متقدمة</div>
                <div className="text-gray-300">• مستويات الدعم والمقاومة</div>
                <div className="text-gray-300">• إدارة المحفظة</div>
                <div className="text-gray-300">• تقارير مفصلة</div>
              </div>

              <Button
                onClick={() => onSubscribe('pro')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                اشترك في البرو
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              يمكنك إلغاء الاشتراك في أي وقت من خلال إعدادات الحساب
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequiredModal;