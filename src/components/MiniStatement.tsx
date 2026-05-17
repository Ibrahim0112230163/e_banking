import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface Activity {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  username: string;
  timestamp: string;
}

interface MiniStatementProps {
  activities?: Activity[];
  onViewAll?: () => void;
}

export function MiniStatement({ activities = [], onViewAll }: MiniStatementProps) {
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'received',
      amount: 500,
      username: 'vegetable_market_01',
      timestamp: 'Today, 2:30 PM',
    },
    {
      id: '2',
      type: 'sent',
      amount: 250,
      username: 'bus_service_05',
      timestamp: 'Today, 1:15 PM',
    },
    {
      id: '3',
      type: 'sent',
      amount: 800,
      username: 'utility_electric',
      timestamp: 'Yesterday, 9:00 AM',
    },
  ];

  const activityList = activities.length > 0 ? activities : mockActivities;

  return (
    <div className="bg-gradient-to-br from-[#E8F5F3] to-blue-50 rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">Mini Statement</h4>
        <button
          onClick={onViewAll}
          className="text-xs text-[#0D7C66] hover:underline font-medium transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activityList.length > 0 ? (
          activityList.map((activity) => {
            const isReceived = activity.type === 'received';
            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isReceived ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}
                  >
                    {isReceived ? (
                      <TrendingDown size={18} className="text-emerald-600" />
                    ) : (
                      <TrendingUp size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      @{activity.username}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      isReceived ? 'text-emerald-600' : 'text-blue-600'
                    }`}
                  >
                    {isReceived ? '+' : '-'}৳{activity.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <ArrowRight size={24} className="mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm">No activities yet</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Transactions:</span>
          <span className="font-semibold text-[#0D7C66]">{activityList.length}</span>
        </div>
      </div>
    </div>
  );
}
