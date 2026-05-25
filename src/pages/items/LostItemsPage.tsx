import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Package, Plus } from 'lucide-react';
import { lostItemsApi } from '@/api/lostItems';
import type { LostItemDto } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge, { statusBadgeVariant } from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function LostItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<LostItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const fetchItems = async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = q
        ? await lostItemsApi.search({ query: q, page: p, pageSize: 12 })
        : await lostItemsApi.getAll(p, 12);
      setItems(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(page, query);
  }, [page, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const q = query.trim();
    setSearchParams(q ? { q } : {});
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (p > 1) params.page = String(p);
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lost Items</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse items reported as lost</p>
        </div>
        <Link to="/items/new">
          <Button className="gap-1.5"><Plus className="h-4 w-4" />Report Lost Item</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, description, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {loading ? (
        <Spinner text="Loading lost items..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No lost items found"
          description={query ? 'Try adjusting your search terms.' : 'No lost items have been reported yet.'}
          action={
            <Link to="/items/new">
              <Button>Report a Lost Item</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/lost-items/${item.id}`}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  {item.imageUrls?.[0] ? (
                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                      <Package className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                    <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    {item.locationLost && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.locationLost}</span>
                    )}
                    {item.categoryName && (
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{item.categoryName}</span>
                    )}
                  </div>
                  {item.rewardAmount != null && item.rewardAmount > 0 && (
                    <p className="text-sm font-medium text-emerald-600 mt-2">${item.rewardAmount} Reward</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
