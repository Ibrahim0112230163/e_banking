import { ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SecurityBadge } from './SecurityBadge';

interface TransactionCardProps {
  receiverUsername: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'rejected' | 'pending';
  showSecurityBadge?: boolean;
}

export function TransactionCard({
  receiverUsername,
  amount,
  timestamp,
  status,
  showSecurityBadge = true,
}: TransactionCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      label: 'Success',
    },
    rejected: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-red-50',
      label: 'Rejected',
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Pending',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${config.bgColor}`}>
            <ArrowUpRight size={20} className={config.color} />
          </div>
          <div>
            <p className="font-medium">@{receiverUsername}</p>
            <p className="text-sm text-muted-foreground">{timestamp}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">-৳{amount.toFixed(2)}</p>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bgColor} mt-1`}>
            <StatusIcon size={12} className={config.color} />
            <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
          </div>
        </div>
      </div>
      {showSecurityBadge && status === 'success' && (
        <div className="flex gap-2 flex-wrap">
          <SecurityBadge type="aes-secured" className="text-xs" />
          <SecurityBadge type="hmac-verified" className="text-xs" />
        </div>
      )}
    </div>
  );
}
