import { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'received' | 'sent' | 'alert';
  message: string;
  amount?: number;
  username?: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsProps {
  notifications?: Notification[];
}

export function Notifications({ notifications = [] }: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'received',
      message: 'Money received from',
      amount: 500,
      username: 'vegetable_market_01',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: '2',
      type: 'sent',
      message: 'Money sent to',
      amount: 250,
      username: 'bus_service_05',
      timestamp: '5 minutes ago',
      read: false,
    },
    {
      id: '3',
      type: 'alert',
      message: 'Daily limit reached 50% of ৳5,000',
      timestamp: '1 hour ago',
      read: true,
    },
  ];

  const notifList = notifications.length > 0 ? notifications : mockNotifications;

  const typeConfig = {
    received: {
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      dotColor: 'bg-emerald-500',
    },
    sent: {
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500',
    },
    alert: {
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      dotColor: 'bg-amber-500',
    },
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-[#0D7C66] to-[#0B6B57] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="divide-y divide-border">
            {notifList.length > 0 ? (
              notifList.map((notif) => {
                const config = typeConfig[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={`p-4 border-l-4 ${config.color} hover:bg-opacity-80 transition-colors cursor-pointer`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${config.dotColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-medium ${config.textColor}`}>
                              {notif.message}
                              {notif.username && ` @${notif.username}`}
                            </p>
                            {notif.amount && (
                              <p className={`text-sm font-semibold mt-1 ${config.textColor}`}>
                                {notif.type === 'received' ? '+' : '-'}৳{notif.amount.toFixed(2)}
                              </p>
                            )}
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-[#0D7C66] flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notif.timestamp}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
