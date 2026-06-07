import { ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SecurityBadge } from './SecurityBadge';

interface TransactionCardProps {
<<<<<<< HEAD
  receiverUsername: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'rejected' | 'pending';
=======
  type?: 'sent' | 'received';
  senderUsername?: string;
  receiverUsername?: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'rejected' | 'pending' | 'aborted';
>>>>>>> origin/updated
  showSecurityBadge?: boolean;
}

export function TransactionCard({
<<<<<<< HEAD
=======
  type = 'sent',
  senderUsername,
>>>>>>> origin/updated
  receiverUsername,
  amount,
  timestamp,
  status,
  showSecurityBadge = true,
}: TransactionCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
<<<<<<< HEAD
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
=======
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      label: 'Authorized',
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      label: 'Blocked',
    },
    aborted: {
      icon: XCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      label: 'Aborted',
    },
    pending: {
      icon: Clock,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      label: 'Verifying',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const isReceived = type === 'received';
  const displayUser = isReceived ? senderUsername : receiverUsername;
  const prefix = isReceived ? '+' : '-';
  const amountColor = isReceived ? 'text-emerald-600 font-bold' : 'text-primary font-bold';

  return (
    <div className={`bg-white/5 backdrop-blur-md border ${config.borderColor} rounded-2xl p-5 hover:bg-white/10 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
            <ArrowUpRight size={24} className={`${config.color} ${isReceived ? 'rotate-180' : ''}`} />
          </div>
          <div>
            <p className="font-bold text-white group-hover:text-accent transition-colors">@{displayUser || 'unknown'}</p>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">{timestamp}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-xl tracking-tight ${isReceived ? 'text-emerald-400' : 'text-white'}`}>{prefix}৳{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${config.bgColor} mt-2 shadow-sm border border-white/5`}>
            <StatusIcon size={12} className={config.color} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
>>>>>>> origin/updated
          </div>
        </div>
      </div>
      {showSecurityBadge && status === 'success' && (
<<<<<<< HEAD
        <div className="flex gap-2 flex-wrap">
          <SecurityBadge type="aes-secured" className="text-xs" />
          <SecurityBadge type="hmac-verified" className="text-xs" />
=======
        <div className="flex gap-2 pt-3 border-t border-white/5">
          <SecurityBadge type="aes-secured" className="text-[10px] uppercase font-bold tracking-tighter h-6 px-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
          <SecurityBadge type="hmac-verified" className="text-[10px] uppercase font-bold tracking-tighter h-6 px-2 bg-blue-500/10 text-blue-400 border-blue-500/20" />
>>>>>>> origin/updated
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> origin/updated
