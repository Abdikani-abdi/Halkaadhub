import { useEffect, useState } from 'react';
import { Bell, Check, Info, AlertTriangle, MessageCircle, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { notificationsApi } from '@/api/notifications';
import type { NotificationDto } from '@/types';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

function getIcon(type: string) {
  switch (type) {
    case 'MatchFound': return <Award className="h-5 w-5 text-emerald-500" />;
    case 'MatchAccepted': return <Check className="h-5 w-5 text-green-500" />;
    case 'NewMessage': return <MessageCircle className="h-5 w-5 text-blue-500" />;
    case 'ItemRecovered': return <Award className="h-5 w-5 text-emerald-600" />;
    case 'ReportUpdate': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    default: return <Info className="h-5 w-5 text-gray-400" />;
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await notificationsApi.getAll(p, 20);
      setNotifications(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Notifications</h1>

      {loading ? (
        <Spinner text="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up!" icon={<Bell className="h-16 w-16" />} />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                n.isRead
                  ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <div className="mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.isRead && (
                <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="shrink-0">
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
