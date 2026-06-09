import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { SecurityBadge } from '../components/SecurityBadge';
import { DailyLimitIndicator } from '../components/DailyLimitIndicator';
import { TransactionCard } from '../components/TransactionCard';
import {
  Send,
  Bus,
  Zap,
  ShoppingBag,
  GraduationCap,
  Fish,
  Carrot,
  History,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { getUserSession, clearUserSession } from '../../utils/session';
import { getTransactionHistory } from '../../utils/api';

interface DashboardTransaction {
  receiver_username?: string;
  sender_username?: string;
  receiverUsername?: string;
  amount: number;
  created_at?: string;
  timestamp?: string;
  status: 'success' | 'aborted' | 'futile' | 'rejected';
  type?: 'sent' | 'received';
}

export function Dashboard() {
  const navigate = useNavigate();
  const session = getUserSession();
  const [recentTransactions, setRecentTransactions] = useState<DashboardTransaction[]>([]);

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  const categories = [
    { icon: Send, label: 'Send Money', color: 'bg-[#0D7C66]', route: '/send-money' },
    { icon: Bus, label: 'Transport', color: 'bg-blue-500', route: '/send-money' },
    { icon: Zap, label: 'Utilities', color: 'bg-amber-500', route: '/send-money' },
    { icon: ShoppingBag, label: 'Market', color: 'bg-purple-500', route: '/send-money' },
  ];

  useEffect(() => {
    let cancelled = false;
    async function loadRecentTransactions() {
      if (!session) return;
      const result = await getTransactionHistory(session.username);
      if (!cancelled && result?.transactions) {
        setRecentTransactions(result.transactions.slice(0, 3));
      }
    }
    loadRecentTransactions();
    return () => {
      cancelled = true;
    };
  }, [session?.username]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

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
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

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
                </button>
              );
            })}
          </div>
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
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  receiverUsername={
                    transaction.type === 'received'
                      ? transaction.sender_username || 'Unknown sender'
                      : transaction.receiver_username || transaction.receiverUsername || 'Unknown receiver'
                  }
                  amount={transaction.amount}
                  timestamp={transaction.created_at || transaction.timestamp || ''}
                  status={transaction.status === 'success' ? 'success' : 'rejected'}
                  showSecurityBadge={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          )}
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
