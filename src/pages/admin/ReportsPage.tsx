import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Flag, AlertTriangle, User, Clock, Search, Filter, CheckCircle, XCircle, Eye } from 'lucide-react';
import { adminApi } from '@/api/admin';
import type { ReportDto } from '@/types';
import Pagination from '@/components/ui/Pagination';
import { PageHeader, Card, EmptyState } from '@/components/admin/ui';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    Reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    Dismissed: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

function TableSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </td>
          <td className="px-5 py-4"><div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" /></td>
          <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" /></td>
        </tr>
      ))}
    </>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getReports(p, 20);
      setReports(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const filteredReports = reports.filter(r =>
    r.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.reportedUserName && r.reportedUserName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingCount = reports.filter(r => r.status === 'Pending').length;

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Review and manage user reports"
        action={
          pendingCount > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{pendingCount} pending</span>
            </div>
          ) : null
        }
      />

      <Card>
        {/* Table Header with Search */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reporter</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reported User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reason</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableSkeleton />
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <EmptyState
                      icon={Flag}
                      title="No reports found"
                      description={reports.length === 0 ? "No reports have been submitted yet." : "Try adjusting your search filters."}
                    />
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{r.reporterName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {r.reportedUserName ? (
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="text-gray-900 dark:text-white">{r.reportedUserName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={r.reason}>
                        {r.reason}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors cursor-pointer" title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {r.status === 'Pending' && (
                          <>
                            <button className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer" title="Resolve">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer" title="Dismiss">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}
