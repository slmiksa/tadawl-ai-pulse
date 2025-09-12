import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Crown, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Star,
  DollarSign,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Users,
  Clock,
  BarChart3,
  TrendingUp
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

interface SubscriptionStats {
  package_id: string;
  package_name: string;
  total_subscribers: number;
  active_subscribers: number;
  expired_subscribers: number;
  revenue: number;
  subscribers: Array<{
    user_id: string;
    user_email: string;
    user_name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    days_remaining: number;
  }>;
}

export const SubscriptionManagement: React.FC = () => {
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [activeView, setActiveView] = useState<'stats' | 'packages'>('stats');

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
    fetchPackages();
    fetchSubscriptionStats();
  }, []);

  const fetchSubscriptionStats = async () => {
    try {
      setStatsLoading(true);
      
      // Get all packages first
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('display_order');

      if (packagesError) throw packagesError;

      const statsPromises = (packagesData || []).map(async (pkg) => {
        // Get subscriptions for this package type
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('package_type', pkg.name); // Assuming package_type matches package name

        if (subscriptionsError) {
          console.error('Error fetching subscriptions:', subscriptionsError);
          return null;
        }

        const now = new Date();
        const subscribersPromises = (subscriptionsData || []).map(async (sub) => {
          // Get user profile data separately
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', sub.user_id)
            .maybeSingle();

          const endDate = new Date(sub.end_date);
          const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          
          return {
            user_id: sub.user_id,
            user_email: 'user@example.com', // Email not available in profiles table
            user_name: profileData?.full_name || 'غير متاح',
            start_date: sub.start_date,
            end_date: sub.end_date,
            is_active: sub.is_active && endDate > now,
            days_remaining: daysRemaining
          };
        });

        const subscribers = await Promise.all(subscribersPromises);
        const activeSubscribers = subscribers.filter(s => s.is_active).length;
        const expiredSubscribers = subscribers.filter(s => !s.is_active).length;

        return {
          package_id: pkg.id,
          package_name: pkg.name,
          total_subscribers: subscribers.length,
          active_subscribers: activeSubscribers,
          expired_subscribers: expiredSubscribers,
          revenue: activeSubscribers * pkg.price,
          subscribers
        };
      });

      const stats = await Promise.all(statsPromises);
      setSubscriptionStats(stats.filter(Boolean) as SubscriptionStats[]);
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل إحصائيات الاشتراكات",
        variant: "destructive"
      });
    } finally {
      setStatsLoading(false);
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
      fetchSubscriptionStats(); // Refresh stats after package changes
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
      fetchSubscriptionStats(); // Refresh stats after deletion
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الباقة",
        variant: "destructive"
      });
    }
  };

  const togglePackageStatus = async (pkg: Package) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ is_active: !pkg.is_active })
        .eq('id', pkg.id);

      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: `تم ${pkg.is_active ? 'إلغاء تفعيل' : 'تفعيل'} الباقة`,
      });
      
      fetchPackages();
      fetchSubscriptionStats(); // Refresh stats after status change
    } catch (error) {
      console.error('Error toggling package status:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الباقة",
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

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = subscriptionStats.reduce((sum, stat) => sum + stat.revenue, 0);
  const totalActiveSubscribers = subscriptionStats.reduce((sum, stat) => sum + stat.active_subscribers, 0);
  const totalSubscribers = subscriptionStats.reduce((sum, stat) => sum + stat.total_subscribers, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">إدارة الاشتراكات</h2>
          <p className="text-muted-foreground">إحصائيات شاملة وإدارة باقات الاشتراك</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveView('stats')}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            الإحصائيات
          </Button>
          <Button
            variant={activeView === 'packages' ? 'default' : 'outline'}
            onClick={() => setActiveView('packages')}
            className="gap-2"
          >
            <Crown className="h-4 w-4" />
            إدارة الباقات
          </Button>
        </div>
      </div>

      {activeView === 'stats' ? (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المشتركين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{totalSubscribers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">المشتركين النشطين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{totalActiveSubscribers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">الاشتراكات المنتهية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">{totalSubscribers - totalActiveSubscribers}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span className="text-2xl font-bold">{totalRevenue.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">ر.س</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Package Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">إحصائيات الباقات</h3>
            <div className="grid gap-6">
              {subscriptionStats.map((stat) => (
                <Card key={stat.package_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-600" />
                        {stat.package_name}
                      </CardTitle>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" />
                          {stat.total_subscribers} مشترك
                        </Badge>
                        <Badge className="gap-1 bg-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {stat.active_subscribers} نشط
                        </Badge>
                        <Badge variant="destructive" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {stat.expired_subscribers} منتهي
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">إيرادات الباقة:</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">{stat.revenue.toLocaleString()} ر.س</span>
                        </div>
                      </div>

                      {stat.subscribers.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">المشتركين:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {stat.subscribers.map((subscriber, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                                <div>
                                  <span className="font-medium">{subscriber.user_name}</span>
                                  <span className="text-muted-foreground ml-2">({subscriber.user_email})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                                    {subscriber.is_active ? 'نشط' : 'منتهي'}
                                  </Badge>
                                  {subscriber.is_active && (
                                    <span className="text-xs text-muted-foreground">
                                      {subscriber.days_remaining} يوم متبقي
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Package Management */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">إدارة محتوى الباقات</h3>
            <Button
              onClick={() => {
                setEditPackage(emptyPackage);
                setIsAddingNew(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة باقة جديدة
            </Button>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.is_popular ? 'border-yellow-500' : ''}`}>
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-black gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePackageStatus(pkg)}
                        className={pkg.is_active ? "text-green-600" : "text-red-600"}
                      >
                        {pkg.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditPackage(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePackage(pkg.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold">{pkg.price}</span>
                      <span className="text-muted-foreground">ر.س</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{pkg.duration_months} شهر</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? 'نشطة' : 'معطلة'}
                    </Badge>
                    
                    {/* Show subscriber count for this package */}
                    {(() => {
                      const stat = subscriptionStats.find(s => s.package_id === pkg.id);
                      return stat ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{stat.active_subscribers} مشترك نشط</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isAddingNew ? 'إضافة باقة جديدة' : 'تعديل الباقة'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditPackage(null);
                    setIsAddingNew(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Fields */}
                <div className="space-y-4">
                  <h3 className="font-semibold">النسخة العربية</h3>
                  
                  <div className="space-y-2">
                    <Label>اسم الباقة</Label>
                    <Input
                      value={editPackage.name}
                      onChange={(e) => setEditPackage({ ...editPackage, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea
                      value={editPackage.description}
                      onChange={(e) => setEditPackage({ ...editPackage, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الميزات</Label>
                    <div className="space-y-2">
                      {editPackage.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={feature} readOnly className="flex-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index, false)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="أضف ميزة جديدة"
                          onKeyPress={(e) => e.key === 'Enter' && addFeature(false)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFeature(false)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Fields */}
                <div className="space-y-4">
                  <h3 className="font-semibold">English Version</h3>
                  
                  <div className="space-y-2">
                    <Label>Package Name</Label>
                    <Input
                      value={editPackage.name_en}
                      onChange={(e) => setEditPackage({ ...editPackage, name_en: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editPackage.description_en}
                      onChange={(e) => setEditPackage({ ...editPackage, description_en: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="space-y-2">
                      {editPackage.features_en.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={feature} readOnly className="flex-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index, true)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newFeatureEn}
                          onChange={(e) => setNewFeatureEn(e.target.value)}
                          placeholder="Add new feature"
                          onKeyPress={(e) => e.key === 'Enter' && addFeature(true)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFeature(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>السعر (ر.س)</Label>
                  <Input
                    type="number"
                    value={editPackage.price}
                    onChange={(e) => setEditPackage({ ...editPackage, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>المدة (شهر)</Label>
                  <Input
                    type="number"
                    value={editPackage.duration_months}
                    onChange={(e) => setEditPackage({ ...editPackage, duration_months: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ترتيب العرض</Label>
                  <Input
                    type="number"
                    value={editPackage.display_order}
                    onChange={(e) => setEditPackage({ ...editPackage, display_order: parseInt(e.target.value) || 0 })}
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
                    <Label>نشطة</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editPackage.is_popular}
                      onChange={(e) => setEditPackage({ ...editPackage, is_popular: e.target.checked })}
                      className="rounded"
                    />
                    <Label>الأكثر شعبية</Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button onClick={savePackage} className="gap-2">
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditPackage(null);
                    setIsAddingNew(false);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};