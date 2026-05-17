import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { SecurityBadge } from '../components/SecurityBadge';
import { DailyLimitIndicator } from '../components/DailyLimitIndicator';
import { TransactionCard } from '../components/TransactionCard';
import { Notifications } from '../components/Notifications';
import { MiniStatement } from '../components/MiniStatement';
import {
  Send,
  Bus,
  Zap,
  ShoppingBag,
  GraduationCap,
  Fish,
  Carrot,
  History,
  User,
  Sparkles,
} from 'lucide-react';

interface Transaction {
  receiverUsername?: string;
  senderUsername?: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed' | 'aborted';
  type: 'sent' | 'received';
}

export function Dashboard() {
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch transactions on component mount
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Fetch fresh data on mount
    fetchUserData();
    fetchTransactions();
    
    // Set up auto-refresh every 2 seconds to catch real-time updates
    const interval = setInterval(() => {
      fetchUserData();
      fetchTransactions();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (!userData.username) return;

      const response = await fetch(`${import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5000'}/user/${userData.username}`);
      const data = await response.json();

      if (data.status === 'success' && data.user) {
        const updatedUser = {
          ...userData,
          balance: data.user.balance,
          daily_limit: data.user.daily_limit,
          today_spent: data.user.today_spent,
        };
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (!user.username) return;

      const response = await fetch(`${import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5000'}/transactions/${user.username}`);
      const data = await response.json();

      if (data.transactions && data.transactions.length > 0) {
        const formattedTransactions: Transaction[] = data.transactions.map((txn: any) => ({
          receiverUsername: txn.receiver_username,
          senderUsername: txn.sender_username,
          amount: txn.amount,
          timestamp: new Date(txn.created_at).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          status: txn.status === 'success' ? 'success' : (txn.status === 'aborted' ? 'aborted' : 'pending'),
          type: txn.type || 'sent',
        }));
        setRecentTransactions(formattedTransactions.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const categories = [
    { icon: Send, label: 'Send Money', color: 'bg-[#0D7C66]', route: '/send-money' },
    { icon: Bus, label: 'Transport', color: 'bg-blue-500', route: '/send-money' },
    { icon: Zap, label: 'Utilities', color: 'bg-amber-500', route: '/send-money' },
    { icon: ShoppingBag, label: 'Market', color: 'bg-purple-500', route: '/send-money' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-[#0D7C66] to-[#0B6B57] text-white px-4 pt-8 pb-20 rounded-b-3xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-white/80">Welcome back</p>
              <h2 className="text-white">@{user?.username || 'user_2024_001'}</h2>
            </div>
            <div className="flex gap-2">
              <Notifications />
              <button
                onClick={() => navigate('/history')}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <History size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <User size={20} />
              </button>
            </div>
          </div>

          <SecurityBadge type="device-verified" className="mb-4" />

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-sm text-white/80 mb-2">Current Balance</p>
            <p className="text-3xl font-bold mb-4">৳{(user?.balance || 3200).toFixed(2)}</p>
            <DailyLimitIndicator spent={user?.today_spent || 1800} limit={user?.daily_limit || 5000} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
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
                </button>
              );
            })}
          </div>
          <MiniStatement activities={recentTransactions.map((t) => ({
            id: t.timestamp,
            type: t.type,
            amount: t.amount,
            username: t.type === 'received' ? (t.senderUsername || 'Unknown') : (t.receiverUsername || 'Unknown'),
            timestamp: t.timestamp,
          }))} onViewAll={() => navigate('/history')} />
        </div>

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
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <TransactionCard key={index} {...transaction} showSecurityBadge={false} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            )}
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
          </div>
        </button>
      </div>
    </div>
  );
}
