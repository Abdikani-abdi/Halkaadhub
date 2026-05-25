import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Eye, Package } from 'lucide-react';
import { lostItemsApi } from '@/api/lostItems';
import { foundItemsApi } from '@/api/foundItems';
import type { LostItemDto, FoundItemDto } from '@/types';
import Button from '@/components/ui/Button';
import Badge, { statusBadgeVariant } from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

function ItemCard({ item, type }: { item: LostItemDto | FoundItemDto; type: 'lost' | 'found' }) {
  const location = type === 'lost' ? (item as LostItemDto).locationLost : (item as FoundItemDto).locationFound;
  const linkTo = type === 'lost' ? `/lost-items/${item.id}` : `/found-items/${item.id}`;
  const img = item.imageUrls?.[0];

  return (
    <Link to={linkTo} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {img ? (
          <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <Package className="h-12 w-12" />
          </div>
        )}
        <Badge variant={type === 'lost' ? 'danger' : 'success'} className="absolute top-3 left-3">
          {type === 'lost' ? 'Lost' : 'Found'}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-emerald-600 transition-colors">{item.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {location && <><MapPin className="h-3 w-3" /><span className="truncate max-w-[120px]">{location}</span></>}
          </div>
          <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [lostItems, setLostItems] = useState<LostItemDto[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [lost, found] = await Promise.all([
          lostItemsApi.getAll(1, 4),
          foundItemsApi.getAll(1, 4),
        ]);
        setLostItems(lost.data || []);
        setFoundItems(found.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/lost-items?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Lost something?<br />
          <span className="text-emerald-600">Let&apos;s find it together.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          HalKaadHub connects Somali communities to help recover lost belongings through smart matching and real-time collaboration.
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost or found items..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <Button type="submit" size="lg">Search</Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link to="/items/new">
            <Button variant="outline" size="lg" className="gap-2">
              <Eye className="h-4 w-4" /> Report Lost Item
            </Button>
          </Link>
          <Link to="/items/new?type=found">
            <Button variant="secondary" size="lg" className="gap-2">
              <Package className="h-4 w-4" /> Report Found Item
            </Button>
          </Link>
        </div>
      </section>

      {loading ? (
        <Spinner text="Loading recent items..." />
      ) : (
        <>
          {/* Recent lost */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recently Lost</h2>
              <Link to="/lost-items" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lostItems.map((item) => (
                <ItemCard key={item.id} item={item} type="lost" />
              ))}
            </div>
            {lostItems.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No lost items yet.</p>
            )}
          </section>

          {/* Recent found */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recently Found</h2>
              <Link to="/found-items" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {foundItems.map((item) => (
                <ItemCard key={item.id} item={item} type="found" />
              ))}
            </div>
            {foundItems.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No found items yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
