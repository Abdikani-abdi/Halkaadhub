import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, MapPin, Calendar, Tag, MoreVertical, ExternalLink, Plus } from 'lucide-react';
import { lostItemsApi } from '@/api/lostItems';
import type { LostItemDto } from '@/types';
import Badge, { statusBadgeVariant } from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { PageHeader, Card, EmptyState } from '@/components/admin/ui';

function TableSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </td>
          <td className="px-5 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
          <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" /></td>
        </tr>
      ))}
    </>
  );
}

export default function AdminLostItemsPage() {
  const [items, setItems] = useState<LostItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await lostItemsApi.search({ page: p, pageSize: 20 });
      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = items.filter(i => i.status === 'Active').length;

  return (
    <div>
      <PageHeader
        title="Lost Items"
        description="Manage all lost item reports"
        action={
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">
              {activeCount} active
            </span>
            <Link
              to="/items/new?type=lost"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Lost Item
            </Link>
          </div>
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
                placeholder="Search lost items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Item</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Posted</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableSkeleton />
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
                    <EmptyState
                      icon={Search}
                      title="No lost items found"
                      description={items.length === 0 ? "No lost items have been reported yet." : "Try adjusting your search filters."}
                    />
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                          <img
                            src={item.imageUrls[0]}
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center ring-2 ring-gray-100 dark:ring-gray-800">
                            <Search className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">by {item.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.categoryName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[150px]">{item.locationLost || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/lost-items/${item.id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                          title="View details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" title="More options">
                          <MoreVertical className="h-4 w-4" />
                        </button>
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
