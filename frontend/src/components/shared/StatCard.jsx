import { cn } from "@/lib/utils";

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className,
  testId 
}) => {
  const isPositiveTrend = trend === "up";
  
  return (
    <div 
      className={cn(
        "stat-card group animate-fade-in",
        className
      )}
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="data-label mb-2">{title}</p>
          <p className="text-3xl font-bold font-['Barlow_Condensed'] tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trendValue && (
            <p className={cn(
              "text-xs mt-2 flex items-center gap-1",
              isPositiveTrend ? "text-emerald-400" : "text-red-400"
            )}>
              <span>{isPositiveTrend ? "↑" : "↓"}</span>
              <span>{trendValue}</span>
              <span className="text-muted-foreground">vs last month</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};
