import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TransactionCard } from '../components/TransactionCard';
<<<<<<< HEAD
import { ArrowLeft, Filter } from 'lucide-react';
=======
import { ArrowLeft, Filter, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
>>>>>>> origin/updated
import { getUserSession } from '../../utils/session';
import { getTransactionHistory } from '../../utils/api';

interface Transaction {
  id: string;
  amount: number;
  status: 'success' | 'rejected' | 'pending' | 'aborted';
  created_at: string;
  reference: string;
  type: 'sent' | 'received';
  senderUsername?: string;
  receiverUsername?: string;
  sender_username?: string;
  receiver_username?: string;
}

export function TransactionHistory() {
  const navigate = useNavigate();
  const session = getUserSession();
  const [activeTab, setActiveTab] = useState<'all' | 'successful' | 'rejected'>('all');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      console.error('User session not found');
      navigate('/login');
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const data = await getTransactionHistory(session.username);

        if (data.status === 'success' && data.transactions) {
          setAllTransactions(data.transactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session, navigate]);

  const filteredTransactions = allTransactions.filter((transaction) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'successful') return transaction.status === 'success';
    if (activeTab === 'rejected') return transaction.status === 'rejected';
    return true;
  });

  const tabs = [
    { id: 'all' as const, label: 'All', count: allTransactions.length },
    { id: 'successful' as const, label: 'Successful', count: allTransactions.filter(t => t.status === 'success').length },
    { id: 'rejected' as const, label: 'Rejected', count: allTransactions.filter(t => t.status === 'rejected').length },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background">
      <div className="bg-[#0D7C66] text-white px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white">Transaction History</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-border mb-6 overflow-hidden">
=======
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Header */}
      <div className="bg-primary text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="max-w-2xl mx-auto flex items-center gap-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Transaction History</h1>
            <p className="text-xs text-white/60 font-semibold tracking-wider uppercase">Cryptographic Audit Log</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-white/10 mb-6 overflow-hidden">
>>>>>>> origin/updated
          <div className="border-b border-border">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
<<<<<<< HEAD
                  className={`flex-1 px-4 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#0D7C66]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-[#E8F5F3] text-[#0D7C66]'
=======
                  className={`flex-1 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-accent/10 text-accent'
>>>>>>> origin/updated
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
<<<<<<< HEAD
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D7C66]" />
=======
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
>>>>>>> origin/updated
                  )}
                </button>
              ))}
            </div>
          </div>

<<<<<<< HEAD
          <div className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3">
=======
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground animate-pulse">Loading transaction history...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
>>>>>>> origin/updated
                {filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    type={transaction.type}
                    amount={transaction.amount}
                    status={transaction.status}
                    timestamp={new Date(transaction.created_at).toLocaleString()}
                    senderUsername={transaction['sender_username'] || transaction.senderUsername}
                    receiverUsername={transaction['receiver_username'] || transaction.receiverUsername}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter size={48} className="text-muted-foreground mx-auto mb-4" />
<<<<<<< HEAD
                <p className="text-muted-foreground">No transactions in this category</p>
=======
                <p className="text-sm font-semibold text-muted-foreground">No transactions in this category</p>
>>>>>>> origin/updated
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Security Information</h4>
          <p className="text-xs text-blue-800">
            All successful transactions are encrypted with AES and verified with HMAC authentication.
            Each transaction includes a timestamp (T) to prevent replay attacks.
=======
        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-accent" />
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Security Information</h4>
          </div>
          <p className="text-xs font-medium leading-relaxed text-muted-foreground">
            All successful transactions are encrypted with AES and verified with HMAC authentication.
            Each transaction includes a unique timestamp (T) to prevent replay attacks and secure user account state.
>>>>>>> origin/updated
          </p>
        </div>
      </div>
    </div>
  );
}
