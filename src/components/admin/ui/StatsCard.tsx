import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'gradient';
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'red' | 'teal' | 'indigo';
}

const colorStyles = {
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
  },
  purple: {
    icon: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    gradient: 'from-purple-500 to-purple-600',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
  },
  red: {
    icon: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    gradient: 'from-red-500 to-red-600',
  },
  teal: {
    icon: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    gradient: 'from-teal-500 to-teal-600',
  },
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-indigo-600',
  },
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  color = 'emerald',
}: StatsCardProps) {
  const styles = colorStyles[color];

  if (variant === 'gradient') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.gradient} p-5 text-white shadow-lg`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && (
            <div className="mt-3 flex items-center gap-1 text-sm">
              <span className={trend.isPositive ? 'text-white/90' : 'text-white/70'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-white/60">vs last month</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <span className={`font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-400 dark:text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`rounded-xl p-3 ${styles.icon} transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
