import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  ArrowLeft,
  Star,
  DollarSign,
  Calendar,
  Users,
  Check
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number;
  duration_months: number;
  features: any[];
  features_en: any[];
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
}

const PackageManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newFeatureEn, setNewFeatureEn] = useState('');

  const emptyPackage: Package = {
    id: '',
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    price: 0,
    duration_months: 1,
    features: [],
    features_en: [],
    is_active: true,
    is_popular: false,
    display_order: 0
  };

  useEffect(() => {
    checkAdminAccess();
    fetchPackages();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      const processedData = (data || []).map(pkg => ({
        ...pkg,
        features: Array.isArray(pkg.features) ? pkg.features : [],
        features_en: Array.isArray(pkg.features_en) ? pkg.features_en : []
      }));
      setPackages(processedData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الباقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePackage = async () => {
    if (!editPackage) return;

    try {
      const packageData = {
        name: editPackage.name,
        name_en: editPackage.name_en,
        description: editPackage.description,
        description_en: editPackage.description_en,
        price: editPackage.price,
        duration_months: editPackage.duration_months,
        features: editPackage.features,
        features_en: editPackage.features_en,
        is_active: editPackage.is_active,
        is_popular: editPackage.is_popular,
        display_order: editPackage.display_order
      };

      if (isAddingNew) {
        const { error } = await supabase
          .from('packages')
          .insert([packageData]);

        if (error) throw error;
        toast({
          title: "تم الحفظ",
          description: "تم إضافة الباقة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editPackage.id);

        if (error) throw error;
        toast({
          title: "تم التحديث",
          description: "تم تحديث الباقة بنجاح",
        });
      }

      setEditPackage(null);
      setIsAddingNew(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الباقة",
        variant: "destructive"
      });
    }
  };

  const deletePackage = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الباقة بنجاح",
      });
      
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الباقة",
        variant: "destructive"
      });
    }
  };

  const addFeature = (isEnglish = false) => {
    if (!editPackage) return;
    
    const feature = isEnglish ? newFeatureEn : newFeature;
    if (!feature.trim()) return;

    const updatedPackage = { ...editPackage };
    if (isEnglish) {
      updatedPackage.features_en = [...updatedPackage.features_en, feature];
      setNewFeatureEn('');
    } else {
      updatedPackage.features = [...updatedPackage.features, feature];
      setNewFeature('');
    }
    
    setEditPackage(updatedPackage);
  };

  const removeFeature = (index: number, isEnglish = false) => {
    if (!editPackage) return;
    
    const updatedPackage = { ...editPackage };
    if (isEnglish) {
      updatedPackage.features_en = updatedPackage.features_en.filter((_, i) => i !== index);
    } else {
      updatedPackage.features = updatedPackage.features.filter((_, i) => i !== index);
    }
    
    setEditPackage(updatedPackage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة</span>
            </button>
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">إدارة الباقات</h1>
            </div>
          </div>
          <button
            onClick={() => {
              setEditPackage(emptyPackage);
              setIsAddingNew(true);
            }}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة باقة جديدة</span>
          </button>
        </div>

        {/* Packages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-gray-800 rounded-lg p-6 border ${
                pkg.is_popular ? 'border-yellow-500' : 'border-gray-700'
              } relative`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>الأكثر شعبية</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {language === 'ar' ? pkg.name : pkg.name_en}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditPackage(pkg)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePackage(pkg.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 mb-4">
                {language === 'ar' ? pkg.description : pkg.description_en}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">{pkg.price}</span>
                  <span className="text-gray-400">ر.س</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">{pkg.duration_months} شهر</span>
                </div>
              </div>

              <div className="space-y-2">
                {(language === 'ar' ? pkg.features : pkg.features_en).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className={`mt-4 text-sm ${pkg.is_active ? 'text-green-400' : 'text-red-400'}`}>
                {pkg.is_active ? 'نشطة' : 'معطلة'}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isAddingNew ? 'إضافة باقة جديدة' : 'تعديل الباقة'}
                </h2>
                <button
                  onClick={() => {
                    setEditPackage(null);
                    setIsAddingNew(false);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">النسخة العربية</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">اسم الباقة</label>
                    <input
                      type="text"
                      value={editPackage.name}
                      onChange={(e) => setEditPackage({ ...editPackage, name: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الوصف</label>
                    <textarea
                      value={editPackage.description}
                      onChange={(e) => setEditPackage({ ...editPackage, description: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الميزات</label>
                    <div className="space-y-2">
                      {editPackage.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 text-white bg-gray-700 px-3 py-2 rounded">{feature}</span>
                          <button
                            onClick={() => removeFeature(index, false)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="أضف ميزة جديدة"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && addFeature(false)}
                        />
                        <button
                          onClick={() => addFeature(false)}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">English Version</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Package Name</label>
                    <input
                      type="text"
                      value={editPackage.name_en}
                      onChange={(e) => setEditPackage({ ...editPackage, name_en: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editPackage.description_en}
                      onChange={(e) => setEditPackage({ ...editPackage, description_en: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                    <div className="space-y-2">
                      {editPackage.features_en.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 text-white bg-gray-700 px-3 py-2 rounded">{feature}</span>
                          <button
                            onClick={() => removeFeature(index, true)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newFeatureEn}
                          onChange={(e) => setNewFeatureEn(e.target.value)}
                          placeholder="Add new feature"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
                        />
                        <button
                          onClick={() => addFeature(true)}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">السعر (ر.س)</label>
                  <input
                    type="number"
                    value={editPackage.price}
                    onChange={(e) => setEditPackage({ ...editPackage, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">المدة (شهر)</label>
                  <input
                    type="number"
                    value={editPackage.duration_months}
                    onChange={(e) => setEditPackage({ ...editPackage, duration_months: parseInt(e.target.value) || 1 })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ترتيب العرض</label>
                  <input
                    type="number"
                    value={editPackage.display_order}
                    onChange={(e) => setEditPackage({ ...editPackage, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editPackage.is_active}
                      onChange={(e) => setEditPackage({ ...editPackage, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-300">نشطة</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editPackage.is_popular}
                      onChange={(e) => setEditPackage({ ...editPackage, is_popular: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-300">الأكثر شعبية</label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mt-6">
                <button
                  onClick={savePackage}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ</span>
                </button>
                <button
                  onClick={() => {
                    setEditPackage(null);
                    setIsAddingNew(false);
                  }}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageManagement;