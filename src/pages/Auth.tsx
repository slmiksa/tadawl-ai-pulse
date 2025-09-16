import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff, TrendingUp, ArrowRight, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { 
    toast 
  } = useToast();
  const location = useLocation();
  const [showLogoutMessage, setShowLogoutMessage] = useState<boolean>(Boolean((location.state as any)?.showLogoutMessage));
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة TadawlAI Trading"
        });

        // Mark that user should see welcome modal
        localStorage.setItem('showWelcomeModal', 'true');
        navigate('/');
      } else {
        // Sign up
        if (password !== confirmPassword) {
          throw new Error('كلمات المرور غير متطابقة');
        }
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "تحقق من بريدك الإلكتروني لتأكيد الحساب"
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في العملية",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const features = ['تحليلات ذكية بالذكاء الاصطناعي', 'توصيات استثمارية يومية', 'متابعة أداء المحفظة', 'تنبيهات فورية للفرص', 'تحليل تقني متقدم', 'إدارة المخاطر الذكية'];
  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="text-white space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 bg-white shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in">
              <img src="/lovable-uploads/tadawl-ai-transparent-logo.png" alt="TadawlAI Logo" className="w-40 h-40 object-contain" />
            </div>
            <div className="text-center">
              
              <p className="text-xl text-gray-300">منصة التداول الذكي</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">استثمر بذكاء مع الذكاء الاصطناعي</h2>
            <p className="text-lg text-gray-300">
              منصة متقدمة تستخدم الذكاء الاصطناعي لتقديم تحليلات دقيقة وتوصيات استثمارية موثوقة
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>)}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h3>
            <p className="text-gray-400">
              {isLogin ? 'ادخل إلى حسابك للمتابعة' : 'انضم إلى آلاف المستثمرين الناجحين'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="أدخل اسمك الكامل" required={!isLogin} />
                </div>
              </div>}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="أدخل بريدك الإلكتروني" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="أدخل كلمة المرور" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="أعد إدخال كلمة المرور" required={!isLogin} />
                </div>
              </div>}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>
                  <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 hover:text-purple-300 font-medium mr-1 transition-colors">
                {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </p>
          </div>
          </div>
        </div>

        {showLogoutMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 bg-gray-900/95 border border-gray-700 rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowLogoutMessage(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h4 className="text-xl font-bold text-white mb-2">لا تغيب عنا كثير</h4>
              <p className="text-gray-300 mb-4">ننتظر عودتك بفارغ الصبر 💜</p>
              <button
                onClick={() => setShowLogoutMessage(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>;
};
export default Auth;