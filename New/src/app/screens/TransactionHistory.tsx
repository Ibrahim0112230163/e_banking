import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TransactionCard } from '../components/TransactionCard';
import { ArrowLeft, Filter } from 'lucide-react';

export function TransactionHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'successful' | 'rejected'>('all');

  const allTransactions = [
    {
      receiverUsername: 'vegetable_market_01',
      amount: 250,
      timestamp: '13/05/2026 14:30:22',
      status: 'success' as const,
    },
    {
      receiverUsername: 'bus_service_05',
      amount: 50,
      timestamp: '13/05/2026 12:15:10',
      status: 'success' as const,
    },
    {
      receiverUsername: 'utility_electric',
      amount: 800,
      timestamp: '13/05/2026 09:00:45',
      status: 'success' as const,
    },
    {
      receiverUsername: 'fish_market_03',
      amount: 450,
      timestamp: '12/05/2026 18:45:30',
      status: 'rejected' as const,
    },
    {
      receiverUsername: 'school_fees_dept',
      amount: 1200,
      timestamp: '12/05/2026 10:20:15',
      status: 'success' as const,
    },
    {
      receiverUsername: 'transport_service_02',
      amount: 75,
      timestamp: '11/05/2026 16:30:00',
      status: 'success' as const,
    },
    {
      receiverUsername: 'market_vendor_12',
      amount: 320,
      timestamp: '11/05/2026 14:00:22',
      status: 'rejected' as const,
    },
    {
      receiverUsername: 'utility_water',
      amount: 600,
      timestamp: '11/05/2026 08:15:45',
      status: 'success' as const,
    },
  ];

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
            {filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((transaction, index) => (
                  <TransactionCard key={index} {...transaction} />
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
