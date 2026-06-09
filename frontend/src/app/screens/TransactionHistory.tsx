import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TransactionCard } from '../components/TransactionCard';
import { ArrowLeft, Filter } from 'lucide-react';
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
          <div className="border-b border-border">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D7C66]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-3">
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
                <p className="text-muted-foreground">No transactions in this category</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Security Information</h4>
          <p className="text-xs text-blue-800">
            All successful transactions are encrypted with AES and verified with HMAC authentication.
            Each transaction includes a timestamp (T) to prevent replay attacks.
          </p>
        </div>
      </div>
    </div>
  );
}
