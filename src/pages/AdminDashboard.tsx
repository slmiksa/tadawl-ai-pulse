import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  LogOut, 
  Activity,
  Database,
  Key,
  UserPlus,
  Eye,
  TrendingUp
} from 'lucide-react';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminManagement } from '@/components/admin/AdminManagement';
import { APIManagement } from '@/components/admin/APIManagement';
import { SiteSettings } from '@/components/admin/SiteSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/tadawladmin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/tadawladmin');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">لوحة التحكم الرئيسية</h1>
                <p className="text-sm text-muted-foreground">إدارة شاملة لمنصة تداول الذكي</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                <Activity className="h-3 w-3 mr-1" />
                متصل
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              المشرفين
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center">
              <Key className="h-4 w-4 mr-2" />
              إدارة APIs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <AdminManagement />
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <APIManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;