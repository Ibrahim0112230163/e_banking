import { useNavigate, Navigate } from 'react-router';
<<<<<<< HEAD
=======
import { useState, useEffect } from 'react';
>>>>>>> origin/updated
import { Button } from '../components/Button';
import { SecurityBadge } from '../components/SecurityBadge';
import { DailyLimitIndicator } from '../components/DailyLimitIndicator';
import { TransactionCard } from '../components/TransactionCard';
import {
  Send,
<<<<<<< HEAD
  Bus,
  Zap,
  ShoppingBag,
  GraduationCap,
  Fish,
  Carrot,
  History,
  User,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { getUserSession, clearUserSession } from '../../utils/session';
=======
  History,
  Sparkles,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  Plus,
  CreditCard,
  PieChart,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { getUserSession, clearUserSession } from '../../utils/session';
import { getUser, getTransactionHistory } from '../../utils/api';
>>>>>>> origin/updated

export function Dashboard() {
  const navigate = useNavigate();
  const session = getUserSession();
<<<<<<< HEAD
=======
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(session);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
>>>>>>> origin/updated

  if (!session) {
    return <Navigate to="/login" replace />;
  }

<<<<<<< HEAD
=======
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Fetch latest balance and limits from database
        const userRes = await getUser(session.username);
        if (isMounted && userRes && userRes.status === 'success' && userRes.user) {
          setProfile(prev => ({
            ...prev,
            balance: userRes.user.balance,
            daily_limit: userRes.user.daily_limit,
            today_spent: userRes.user.today_spent,
          }));
        }

        // Fetch transaction history
        const txRes = await getTransactionHistory(session.username);
        if (isMounted && txRes && txRes.status === 'success' && txRes.transactions) {
          // Sort transactions by date descending and get top 3
          const sorted = [...txRes.transactions]
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setRecentTransactions(sorted);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [session.username]);

>>>>>>> origin/updated
  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

<<<<<<< HEAD
  const categories = [
    { icon: Send, label: 'Send Money', color: 'bg-[#0D7C66]', route: '/send-money' },
    { icon: Bus, label: 'Transport', color: 'bg-blue-500', route: '/send-money' },
    { icon: Zap, label: 'Utilities', color: 'bg-amber-500', route: '/send-money' },
    { icon: ShoppingBag, label: 'Market', color: 'bg-purple-500', route: '/send-money' },
  ];

  const recentTransactions = [
    {
      receiverUsername: 'vegetable_market_01',
      amount: 250,
      timestamp: '2026-05-13 14:30:22',
      status: 'success' as const,
    },
    {
      receiverUsername: 'bus_service_05',
      amount: 50,
      timestamp: '2026-05-13 12:15:10',
      status: 'success' as const,
    },
    {
      receiverUsername: 'utility_electric',
      amount: 800,
      timestamp: '2026-05-13 09:00:45',
      status: 'success' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-[#0D7C66] to-[#0B6B57] text-white px-4 pt-8 pb-20 rounded-b-3xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-white/80">Welcome back</p>
              <h2 className="text-white">@{session.username}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/history')}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <History size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
=======
  const quickActions = [
    { icon: Send, label: 'Transfer', color: 'bg-accent/20 border border-accent/30 text-accent', route: '/send-money' },
    { icon: CreditCard, label: 'Cards', color: 'bg-blue-500/20 border border-blue-500/30 text-blue-400', route: '/features' },
    { icon: PieChart, label: 'Insights', color: 'bg-purple-500/20 border border-purple-500/30 text-purple-400', route: '/features' },
    { icon: Plus, label: 'Top-up', color: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400', route: '/features' },
  ];

  return (
    <div className="min-h-screen bg-primary text-white pb-20 relative overflow-hidden">
      {/* Decorative floating blur backdrops */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium Header */}
      <div className="relative overflow-hidden pb-16 pt-10">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-xl font-bold text-accent">{session.username[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Verified Secure Account</p>
                <h2 className="text-xl font-bold">@{session.username}</h2>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/features')}
                className="w-11 h-11 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-xl"
              >
                <Bell size={20} className="text-white/80" />
              </button>
              <button
                onClick={handleLogout}
                className="w-11 h-11 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-destructive/80 hover:text-white transition-all shadow-xl text-white/80"
>>>>>>> origin/updated
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

<<<<<<< HEAD
          <SecurityBadge type="device-verified" className="mb-4" />

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-sm text-white/80 mb-2">Current Balance</p>
            <p className="text-3xl font-bold mb-4">৳{session.balance.toFixed(2)}</p>
            <DailyLimitIndicator spent={session.today_spent} limit={session.daily_limit} />
          </div>

        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(cat.route)}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-[#0D7C66] hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">{cat.label}</span>
=======
          <div className="flex flex-col gap-8">
             <div className="space-y-1">
                <p className="text-xs font-bold text-white/50 tracking-widest uppercase">Available Balance</p>
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
                    {showBalance ? `৳${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                  </h1>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {showBalance ? <EyeOff size={24} className="text-white/40" /> : <Eye size={24} className="text-white/40" />}
                  </button>
                </div>
             </div>
             
             <div className="max-w-xs bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <DailyLimitIndicator spent={profile?.today_spent ?? 0} limit={profile?.daily_limit ?? 5000} />
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 relative z-20">
        {/* Quick Actions Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-10">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-lg font-bold tracking-tight text-white uppercase tracking-wider">Core Services</h3>
            <ShieldCheck className="text-accent" size={24} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-16 h-16 ${action.color} rounded-[1.75rem] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent group-hover:ring-accent/10`}>
                    <Icon size={26} />
                  </div>
                  <span className="text-[10px] font-bold text-white/70 group-hover:text-accent uppercase tracking-widest transition-colors">
                    {action.label}
                  </span>
>>>>>>> origin/updated
                </button>
              );
            })}
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Activity</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-[#0D7C66] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <TransactionCard key={index} {...transaction} showSecurityBadge={false} />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#E8F5F3] to-blue-50 rounded-2xl p-6 mb-6 border border-border">
          <h4 className="mb-2">Supported Categories</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Carrot, label: 'Vegetable Market' },
              { icon: Fish, label: 'Fish Market' },
              { icon: GraduationCap, label: 'School & College' },
              { icon: Bus, label: 'Public Transport' },
              { icon: Zap, label: 'Utility Service' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm"
                >
                  <Icon size={16} className="text-[#0D7C66]" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/features')}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} />
                <h4 className="text-white">Additional Features</h4>
              </div>
              <p className="text-sm text-white/80">Email, QR, NFC, Cards & Social Login</p>
            </div>
            <div className="text-2xl">→</div>
=======
        {/* Transactions Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-lg font-bold tracking-tight text-white uppercase tracking-wider">Authorizations</h3>
            <button
              onClick={() => navigate('/history')}
              className="group flex items-center gap-2 text-xs font-bold text-accent hover:text-white transition-colors uppercase tracking-widest"
            >
              <span>Audit Log</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center shadow-sm">
                <p className="text-sm text-white/50 animate-pulse">Loading transaction records...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard 
                  key={transaction.id} 
                  type={transaction.type}
                  amount={transaction.amount}
                  status={transaction.status}
                  timestamp={new Date(transaction.created_at).toLocaleString()}
                  senderUsername={transaction.sender_username || transaction.senderUsername}
                  receiverUsername={transaction.receiver_username || transaction.receiverUsername}
                  showSecurityBadge={true} 
                />
              ))
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-accent" size={24} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">No Transactions Yet</h4>
                <p className="text-xs text-white/60 max-w-xs mx-auto">
                  Your recent transaction logs and cryptographic authorizations will show up here.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/send-money')}
                  className="mt-5 border-accent/30 text-accent hover:bg-accent/10 hover:text-accent"
                >
                  Send First Payment
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Teaser */}
        <button
          onClick={() => navigate('/features')}
          className="w-full relative overflow-hidden bg-gradient-to-br from-secondary to-primary text-white rounded-[2.5rem] p-8 shadow-2xl hover:shadow-accent/20 border border-white/10 transition-all duration-500 group text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                  <Sparkles size={20} className="text-accent" />
                </div>
                <h4 className="text-lg font-bold tracking-tight">Premium Expansion</h4>
              </div>
              <p className="text-white/60 text-sm font-medium max-w-[240px]">
                Unlock global transfers, smart cards, and advanced portfolio analytics.
              </p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors border border-white/10 text-white">
              <ArrowRight size={24} />
            </div>
>>>>>>> origin/updated
          </div>
        </button>
      </div>
    </div>
  );
}
