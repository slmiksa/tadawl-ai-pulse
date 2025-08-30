import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  UserPlus, 
  Settings, 
  Trash2,
  Edit,
  Crown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  created_at: string;
  last_active: string;
  status: 'active' | 'inactive';
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as Admin['role'],
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      console.log('Fetching admins from database...');
      
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Admins fetch result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "خطأ في قاعدة البيانات",
          description: `${error.message || 'خطأ غير معروف'}`,
          variant: "destructive",
        });
        return;
      }
      
      const mappedAdmins: Admin[] = data?.map(admin => ({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role as Admin['role'],
        permissions: Array.isArray(admin.permissions) ? admin.permissions as string[] : [],
        created_at: admin.created_at,
        last_active: admin.last_active || admin.created_at,
        status: admin.status as Admin['status']
      })) || [];
      
      console.log('Successfully fetched admins:', mappedAdmins);
      setAdmins(mappedAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المشرفين - تحقق من اتصال الإنترنت",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      // In a real app, you'd hash the password properly
      const hashedPassword = `$2b$10$${newAdmin.password}`;
      
      const { error } = await supabase
        .from('admins')
        .insert({
          username: newAdmin.username,
          email: newAdmin.email,
          password_hash: hashedPassword,
          role: newAdmin.role,
          permissions: newAdmin.permissions
        });

      if (error) throw error;

      await fetchAdmins(); // Refresh the list
      setShowAddDialog(false);
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: []
      });

      toast({
        title: "تم إضافة المشرف بنجاح",
        description: `تم إنشاء حساب جديد للمشرف ${newAdmin.username}`,
      });
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة المشرف الجديد",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      await fetchAdmins(); // Refresh the list
      toast({
        title: "تم حذف المشرف",
        description: "تم حذف حساب المشرف بنجاح",
      });
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف المشرف",
        variant: "destructive",
      });
    }
  };

const availablePermissions: Permission[] = [
  { id: 'users_view', name: 'عرض المستخدمين', description: 'عرض قائمة المستخدمين وتفاصيلهم' },
  { id: 'users_edit', name: 'تعديل المستخدمين', description: 'تعديل بيانات المستخدمين' },
  { id: 'users_delete', name: 'حذف المستخدمين', description: 'حذف حسابات المستخدمين' },
  { id: 'stocks_manage', name: 'إدارة الأسهم', description: 'إضافة وتعديل وحذف الأسهم' },
  { id: 'transactions_view', name: 'عرض المعاملات', description: 'عرض جميع المعاملات المالية' },
  { id: 'analytics_view', name: 'عرض التحليلات', description: 'الوصول للتقارير والإحصائيات' },
  { id: 'settings_manage', name: 'إدارة الإعدادات', description: 'تعديل إعدادات النظام' },
  { id: 'apis_manage', name: 'إدارة APIs', description: 'إدارة مفاتيح واعدادات APIs' }
];

  const togglePermission = (permissionId: string) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleLabel = (role: Admin['role']) => {
    switch (role) {
      case 'super_admin': return 'مدير عام';
      case 'admin': return 'مشرف';
      case 'moderator': return 'مراقب';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: Admin['role']) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/10 text-red-500';
      case 'admin': return 'bg-blue-500/10 text-blue-500';
      case 'moderator': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                إدارة المشرفين
              </CardTitle>
              <CardDescription>
                إضافة وإدارة المشرفين وتحديد صلاحياتهم
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gradient-bg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  إضافة مشرف جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة مشرف جديد</DialogTitle>
                  <DialogDescription>
                    أدخل معلومات المشرف الجديد وحدد صلاحياته
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">اسم المستخدم</Label>
                      <Input
                        id="username"
                        value={newAdmin.username}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="أدخل اسم المستخدم"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="أدخل البريد الإلكتروني"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="أدخل كلمة المرور"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">الدور</Label>
                    <select
                      id="role"
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value as Admin['role'] }))}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="admin">مشرف</option>
                      <option value="moderator">مراقب</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>الصلاحيات</Label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2 space-x-reverse">
                          <Checkbox
                            id={permission.id}
                            checked={newAdmin.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddAdmin} className="gradient-bg">
                      إضافة المشرف
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المشرف</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead>آخر نشاط</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {admin.role === 'super_admin' ? (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Shield className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{admin.username}</div>
                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(admin.role)}>
                        {getRoleLabel(admin.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions.includes('all') ? (
                          <Badge variant="secondary" className="text-xs">
                            جميع الصلاحيات
                          </Badge>
                        ) : (
                          admin.permissions.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {availablePermissions.find(p => p.id === permission)?.name}
                            </Badge>
                          ))
                        )}
                        {admin.permissions.length > 2 && !admin.permissions.includes('all') && (
                          <Badge variant="outline" className="text-xs">
                            +{admin.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(admin.last_active).toLocaleDateString('ar-SA')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={admin.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                        {admin.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          تعديل
                        </Button>
                        {admin.role !== 'super_admin' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            حذف
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};