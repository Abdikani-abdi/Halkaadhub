import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Palette, Trash2, Edit, ArrowLeft, Package, Warehouse } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { foundItemsApi } from '@/api/foundItems';
import type { FoundItemDto } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Badge, { statusBadgeVariant } from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

export default function FoundItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [item, setItem] = useState<FoundItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await foundItemsApi.getById(id);
        if (res.success && res.data) setItem(res.data);
        else navigate('/found-items');
      } catch { navigate('/found-items'); }
      setLoading(false);
    })();
  }, [id, navigate]);

  const isOwner = user && item && user.id === item.userId;

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await foundItemsApi.delete(id);
      if (res.success) { toast.success('Item deleted'); navigate('/found-items'); }
      else toast.error(res.message);
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Spinner text="Loading item..." />;
  if (!item) return null;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-3">
            {item.imageUrls?.length > 0 ? (
              <img src={item.imageUrls[imgIdx]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                <Package className="h-20 w-20" />
              </div>
            )}
          </div>
          {item.imageUrls?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {item.imageUrls.map((url, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${i === imgIdx ? 'border-emerald-500' : 'border-transparent'}`}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h1>
              <Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Reported by <Link to={`/users/${item.userId}`} className="text-emerald-600 hover:underline">{item.userName}</Link>
              {' '}&middot; {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>

          <div className="space-y-2">
            {item.categoryName && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Tag className="h-4 w-4" /> {item.categoryName}
              </div>
            )}
            {item.locationFound && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" /> {item.locationFound}
              </div>
            )}
            {item.foundDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" /> Found on {new Date(item.foundDate).toLocaleDateString()}
              </div>
            )}
            {item.color && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Palette className="h-4 w-4" /> {item.color}
              </div>
            )}
            {item.brand && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Tag className="h-4 w-4" /> Brand: {item.brand}
              </div>
            )}
            {item.currentStorageLocation && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Warehouse className="h-4 w-4" /> Stored at: {item.currentStorageLocation}
              </div>
            )}
          </div>

          {isOwner && item.status === 'Active' && (
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Link to={`/found-items/${item.id}/edit`} className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </Link>
              <Button onClick={handleDelete} variant="danger" className="w-full gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
