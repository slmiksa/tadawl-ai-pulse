import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { 
  Users, 
  Search, 
  Eye, 
  UserX, 
  UserCheck,
  Calendar,
  Activity,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  full_name: string | null;
  username: string | null;
  created_at: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
}

interface UserStats {
  totalTransactions: number;
  portfolioValue: number;
  watchlistCount: number;
  lastActive: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // Fetch user transactions
      const { count: transactionsCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch user portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('total_value')
        .eq('user_id', userId);

      // Fetch user watchlists
      const { count: watchlistCount } = await supabase
        .from('watchlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const totalPortfolioValue = portfolios?.reduce((sum, portfolio) => 
        sum + Number(portfolio.total_value || 0), 0) || 0;

      setUserStats({
        totalTransactions: transactionsCount || 0,
        portfolioValue: totalPortfolioValue,
        watchlistCount: watchlistCount || 0,
        lastActive: new Date().toISOString() // This would be real data in production
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    fetchUserStats(user.id);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                إدارة المستخدمين
              </CardTitle>
              <CardDescription>
                عرض وإدارة جميع مستخدمي المنصة
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {users.length} مستخدم
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث عن المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>اسم المستخدم</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.full_name || 'غير محدد'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.phone || 'لا يوجد رقم'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.username || 'غير محدد'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 space-x-reverse text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500">
                        <Activity className="h-3 w-3 mr-1" />
                        نشط
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              عرض
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل المستخدم</DialogTitle>
                              <DialogDescription>
                                معلومات شاملة عن المستخدم وأنشطته
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">المعلومات الشخصية</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">الاسم:</span>
                                        <span className="text-sm">{selectedUser.full_name || 'غير محدد'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">اسم المستخدم:</span>
                                        <span className="text-sm">{selectedUser.username || 'غير محدد'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">الهاتف:</span>
                                        <span className="text-sm">{selectedUser.phone || 'غير محدد'}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">الإحصائيات</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {userStats ? (
                                        <>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">المعاملات:</span>
                                            <span className="text-sm">{userStats.totalTransactions}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">قيمة المحفظة:</span>
                                            <span className="text-sm">{userStats.portfolioValue.toLocaleString()} ر.س</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">قوائم المراقبة:</span>
                                            <span className="text-sm">{userStats.watchlistCount}</span>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="text-sm text-muted-foreground">جارٍ التحميل...</div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                {selectedUser.bio && (
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">النبذة التعريفية</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm">{selectedUser.bio}</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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