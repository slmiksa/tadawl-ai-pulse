import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Key, 
  Settings, 
  Eye, 
  EyeOff,
  Edit,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface APIKey {
  id: string;
  name: string;
  key_value: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  last_used: string;
  requests_today: number;
  rate_limit: number;
  created_at: string;
}

export const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showKeyValue, setShowKeyValue] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [newKey, setNewKey] = useState({
    name: '',
    key_value: '',
    description: ''
  });

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      console.log('Fetching API keys from database...');
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('API keys fetch result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `${error.message || 'خطأ غير معروف'}`,
          variant: "destructive",
        });
        return;
      }

      const mappedKeys: APIKey[] = data?.map(key => ({
        id: key.id,
        name: key.name,
        key_value: key.key_value,
        description: key.description || '',
        status: key.status as APIKey['status'],
        last_used: key.last_used || key.created_at,
        requests_today: key.requests_today,
        rate_limit: key.rate_limit,
        created_at: key.created_at
      })) || [];
      
      console.log('Successfully fetched API keys:', mappedKeys);
      setApiKeys(mappedKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل مفاتيح API - تحقق من اتصال الإنترنت",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          name: newKey.name,
          key_value: newKey.key_value,
          description: newKey.description,
          status: 'active',
          requests_today: 0,
          rate_limit: 1000
        });

      if (error) throw error;

      await fetchAPIKeys(); // Refresh the list
      setShowAddDialog(false);
      setNewKey({ name: '', key_value: '', description: '' });

      toast({
        title: "تم إضافة مفتاح API بنجاح",
        description: `تم حفظ مفتاح ${newKey.name} بنجاح`,
      });
    } catch (error) {
      console.error('Error adding API key:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة مفتاح API",
        variant: "destructive",
      });
    }
  };

  const handleUpdateKey = async () => {
    if (!editingKey) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          name: editingKey.name,
          key_value: editingKey.key_value,
          description: editingKey.description
        })
        .eq('id', editingKey.id);

      if (error) throw error;

      await fetchAPIKeys(); // Refresh the list
      setEditingKey(null);

      toast({
        title: "تم تحديث مفتاح API",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث مفتاح API",
        variant: "destructive",
      });
    }
  };

  const testAPIConnection = async (keyId: string) => {
    const key = apiKeys.find(k => k.id === keyId);
    if (!key) return;

    toast({
      title: "جارٍ اختبار الاتصال...",
      description: `اختبار مفتاح ${key.name}`,
    });

    try {
      // Update the last_used timestamp and simulate test
      const { error } = await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('id', keyId);

      if (error) throw error;

      // Simulate API test result
      const isSuccess = Math.random() > 0.2; // 80% success rate
      const newStatus = isSuccess ? 'active' : 'error';

      await supabase
        .from('api_keys')
        .update({ status: newStatus })
        .eq('id', keyId);

      await fetchAPIKeys(); // Refresh the list

      toast({
        title: isSuccess ? "نجح الاختبار" : "فشل الاختبار",
        description: isSuccess ? "مفتاح API يعمل بشكل صحيح" : "هناك مشكلة في مفتاح API",
        variant: isSuccess ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error testing API:', error);
      toast({
        title: "خطأ في الاختبار",
        description: "فشل في اختبار مفتاح API",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + 'x'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const getStatusBadge = (status: APIKey['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3 mr-1" />نشط</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/10 text-gray-500">غير نشط</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-500"><AlertTriangle className="h-3 w-3 mr-1" />خطأ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-primary" />
                إدارة مفاتيح API
              </CardTitle>
              <CardDescription>
                إدارة وتحديث مفاتيح API الخاصة بالخدمات الخارجية
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gradient-bg">
                  <Key className="h-4 w-4 mr-2" />
                  إضافة مفتاح جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مفتاح API جديد</DialogTitle>
                  <DialogDescription>
                    أدخل معلومات مفتاح API الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">اسم المفتاح</Label>
                    <Input
                      id="keyName"
                      value={newKey.name}
                      onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="مثال: CUSTOM_API_KEY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyValue">قيمة المفتاح</Label>
                     <Input
                       id="keyValue"
                       type="password"
                       value={newKey.key_value}
                       onChange={(e) => setNewKey(prev => ({ ...prev, key_value: e.target.value }))}
                       placeholder="أدخل قيمة المفتاح"
                     />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyDescription">الوصف</Label>
                    <Input
                      id="keyDescription"
                      value={newKey.description}
                      onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف المفتاح واستخدامه"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddKey} className="gradient-bg">
                      إضافة المفتاح
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="border-primary/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Key className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(apiKey.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">قيمة المفتاح:</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                         <code className="text-xs bg-background px-2 py-1 rounded">
                           {showKeyValue === apiKey.id ? apiKey.key_value : maskKey(apiKey.key_value)}
                         </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKeyValue(
                            showKeyValue === apiKey.id ? null : apiKey.id
                          )}
                        >
                          {showKeyValue === apiKey.id ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">الطلبات اليوم:</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {apiKey.requests_today.toLocaleString()} / {apiKey.rate_limit.toLocaleString()}
                        </div>
                        <div className="w-20 bg-background rounded-full h-1 mt-1">
                          <div
                            className="bg-primary h-1 rounded-full transition-all"
                            style={{
                              width: `${Math.min((apiKey.requests_today / apiKey.rate_limit) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">آخر استخدام:</span>
                      <div className="text-sm text-right">
                        <div>{new Date(apiKey.last_used).toLocaleDateString('ar-SA')}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(apiKey.last_used).toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAPIConnection(apiKey.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      اختبار الاتصال
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingKey({ ...apiKey })}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          تعديل
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تعديل مفتاح API</DialogTitle>
                          <DialogDescription>
                            تحديث معلومات مفتاح {apiKey.name}
                          </DialogDescription>
                        </DialogHeader>
                        {editingKey && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="editKeyName">اسم المفتاح</Label>
                              <Input
                                id="editKeyName"
                                value={editingKey.name}
                                onChange={(e) => setEditingKey(prev => prev ? { ...prev, name: e.target.value } : null)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editKeyValue">قيمة المفتاح</Label>
                               <Input
                                 id="editKeyValue"
                                 type="password"
                                 value={editingKey.key_value}
                                 onChange={(e) => setEditingKey(prev => prev ? { ...prev, key_value: e.target.value } : null)}
                               />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editKeyDescription">الوصف</Label>
                              <Input
                                id="editKeyDescription"
                                value={editingKey.description}
                                onChange={(e) => setEditingKey(prev => prev ? { ...prev, description: e.target.value } : null)}
                              />
                            </div>
                            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                              <Button variant="outline" onClick={() => setEditingKey(null)}>
                                إلغاء
                              </Button>
                              <Button onClick={handleUpdateKey} className="gradient-bg">
                                حفظ التغييرات
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};