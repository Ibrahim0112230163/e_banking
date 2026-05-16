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
          </span>
        </div>
      )}

      <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

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
    </div>
  );
}
