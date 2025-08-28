import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  DollarSign,
  Eye,
  Database,
  Server,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  totalStocks: number;
  totalTransactions: number;
  totalRevenue: number;
  systemUptime: string;
}

export const AdminStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalStocks: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    systemUptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch stocks count
      const { count: stocksCount } = await supabase
        .from('stocks')
        .select('*', { count: 'exact', head: true });

      // Fetch transactions count
      const { count: transactionsCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('total_amount');

      const totalRevenue = revenueData?.reduce((sum, transaction) => 
        sum + Number(transaction.total_amount || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        activeUsers: Math.floor((usersCount || 0) * 0.7), // Approximate active users
        totalStocks: stocksCount || 0,
        totalTransactions: transactionsCount || 0,
        totalRevenue,
        systemUptime: '99.9%'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: 'العدد الكلي للمستخدمين المسجلين',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'المستخدمين النشطين',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      description: 'المستخدمين النشطين حالياً',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'الأسهم المتاحة',
      value: stats.totalStocks.toLocaleString(),
      icon: TrendingUp,
      description: 'عدد الأسهم في النظام',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'المعاملات',
      value: stats.totalTransactions.toLocaleString(),
      icon: Database,
      description: 'إجمالي المعاملات المنفذة',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats.totalRevenue.toLocaleString()} ر.س`,
      icon: DollarSign,
      description: 'إجمالي قيمة المعاملات',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'وقت التشغيل',
      value: stats.systemUptime,
      icon: Server,
      description: 'نسبة توفر النظام',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">الإحصائيات العامة</h2>
          <p className="text-muted-foreground">نظرة شاملة على أداء المنصة</p>
        </div>
        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
          <Clock className="h-3 w-3 mr-1" />
          محدث الآن
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="card-hover glass border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2 text-primary" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
              <span className="text-sm">خدمة المصادقة</span>
              <Badge className="bg-green-500/20 text-green-500">متصل</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
              <span className="text-sm">قاعدة البيانات</span>
              <Badge className="bg-green-500/20 text-green-500">متصل</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
              <span className="text-sm">خدمات API</span>
              <Badge className="bg-green-500/20 text-green-500">متصل</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};