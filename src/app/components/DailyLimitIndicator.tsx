import { TrendingDown } from 'lucide-react';

interface DailyLimitIndicatorProps {
  spent: number;
  limit: number;
  showDetails?: boolean;
}

export function DailyLimitIndicator({ spent, limit, showDetails = true }: DailyLimitIndicatorProps) {
  const remaining = limit - spent;
  const percentage = (spent / limit) * 100;

  const getColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-amber-500';
<<<<<<< HEAD
    return 'bg-[#0D7C66]';
  };

  return (
    <div className="space-y-3">
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown size={20} className="text-muted-foreground" />
            <span className="font-medium">Daily Petty Cash Limit</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {percentage.toFixed(0)}% used
=======
    return 'bg-accent shadow-[0_0_12px_rgba(0,194,255,0.4)]';
  };

  return (
    <div className="space-y-4">
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingDown size={16} className="text-accent" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white/90 uppercase">Daily Limit</span>
          </div>
          <span className="text-xs font-bold text-white/60">
            {percentage.toFixed(0)}%
>>>>>>> origin/updated
          </span>
        </div>
      )}

<<<<<<< HEAD
      <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 rounded-full`}
=======
      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-700 ease-out rounded-full`}
>>>>>>> origin/updated
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

<<<<<<< HEAD
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Spent: <span className="font-semibold text-foreground">৳{spent.toFixed(2)}</span>
        </span>
        <span className="text-muted-foreground">
          Remaining: <span className="font-semibold text-[#0D7C66]">৳{remaining.toFixed(2)}</span>
        </span>
      </div>

      {showDetails && (
        <p className="text-xs text-muted-foreground">
          Total daily limit: ৳{limit.toFixed(2)}
        </p>
      )}
=======
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">
          Used: <span className="font-bold text-white">৳{spent.toFixed(0)}</span>
        </span>
        <span className="text-white/60">
          Safe: <span className="font-bold text-accent">৳{remaining.toFixed(0)}</span>
        </span>
      </div>
>>>>>>> origin/updated
    </div>
  );
}
