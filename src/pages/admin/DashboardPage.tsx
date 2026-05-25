import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Package,
  GitMerge,
  CheckCircle,
  Flag,
  Activity,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { adminApi } from '@/api/admin';
import type { DashboardDto } from '@/types';
import { StatsCard, PageHeader, Card, CardHeader, CardTitle, CardContent, StatsCardSkeleton, ActivityItemSkeleton } from '@/components/admin/ui';

function QuickStatCard({ label, value, change, icon: Icon }: { label: string; value: number; change?: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
      <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</span>
          {change !== undefined && (
            <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ action, userName, timestamp }: { action: string; userName: string; timestamp: string }) {
  const getActivityIcon = (action: string) => {
    if (action.toLowerCase().includes('lost')) return { icon: Search, color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' };
    if (action.toLowerCase().includes('found')) return { icon: Package, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' };
    if (action.toLowerCase().includes('match')) return { icon: GitMerge, color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' };
    if (action.toLowerCase().includes('user') || action.toLowerCase().includes('register')) return { icon: Users, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' };
    return { icon: Activity, color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
  };

  const { icon: Icon, color } = getActivityIcon(action);

  return (
    <div className={`stagger-item flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors`}>
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{userName}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <Clock className="h-3.5 w-3.5" />
        {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[...Array(5)].map((_, i) => (
            <ActivityItemSkeleton key={i} />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.getDashboard();
        if (res.success && res.data) setData(res.data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
          <Flag className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Failed to load dashboard</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your platform."
      />

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <StatsCard
          label="Total Users"
          value={data.totalUsers}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          label="Lost Items"
          value={data.totalLostItems}
          icon={Search}
          color="red"
        />
        <StatsCard
          label="Found Items"
          value={data.totalFoundItems}
          icon={Package}
          color="emerald"
        />
        <StatsCard
          label="Matches"
          value={data.totalMatches}
          icon={GitMerge}
          color="purple"
          variant="gradient"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <QuickStatCard
          label="Recovered Items"
          value={data.totalRecoveredItems}
          icon={CheckCircle}
          change={8}
        />
        <QuickStatCard
          label="Pending Reports"
          value={data.pendingReports}
          icon={Flag}
        />
        <QuickStatCard
          label="Active Today"
          value={data.activeUsersToday}
          icon={Activity}
          change={15}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader
          action={
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          }
        >
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>

        {data.recentActivities.length === 0 ? (
          <CardContent>
            <div className="flex flex-col items-center py-12">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">No recent activity</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Activity will appear here as it happens</p>
            </div>
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.recentActivities.map((a, i) => (
              <ActivityItem
                key={i}
                action={a.action}
                userName={a.userName}
                timestamp={a.timestamp}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
