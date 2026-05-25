import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { lostItemsApi } from '@/api/lostItems';
import { foundItemsApi } from '@/api/foundItems';
import { categoriesApi } from '@/api/categories';
import type { CategoryDto } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

export default function CreateItemPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost';
  const [type, setType] = useState<'lost' | 'found'>(initialType);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(() => {});
  }, []);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    color: '',
    brand: '',
    location: '',
    latitude: '',
    longitude: '',
    date: '',
    rewardAmount: '',
    currentStorageLocation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addImageUrl = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }
    if (imageUrls.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImageUrls((prev) => [...prev, url]);
    setImageInput('');
  };

  const removeImageUrl = (idx: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (type === 'lost') {
        const dto = {
          title: form.title,
          description: form.description,
          categoryId: form.categoryId || undefined,
          color: form.color || undefined,
          brand: form.brand || undefined,
          locationLost: form.location || undefined,
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined,
          lostDate: form.date || undefined,
          rewardAmount: form.rewardAmount ? Number(form.rewardAmount) : undefined,
        };
        const res = await lostItemsApi.create(dto);
        if (res.success && res.data) {
          if (imageUrls.length > 0) {
            await lostItemsApi.addImages(res.data.id, imageUrls);
          }
          toast.success('Lost item reported!');
          navigate(`/lost-items/${res.data.id}`);
        } else {
          toast.error(res.message || 'Failed to create');
        }
      } else {
        const dto = {
          title: form.title,
          description: form.description,
          categoryId: form.categoryId || undefined,
          color: form.color || undefined,
          brand: form.brand || undefined,
          locationFound: form.location || undefined,
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined,
          foundDate: form.date || undefined,
          currentStorageLocation: form.currentStorageLocation || undefined,
        };
        const res = await foundItemsApi.create(dto);
        if (res.success && res.data) {
          if (imageUrls.length > 0) {
            await foundItemsApi.addImages(res.data.id, imageUrls);
          }
          toast.success('Found item reported!');
          navigate(`/found-items/${res.data.id}`);
        } else {
          toast.error(res.message || 'Failed to create');
        }
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create item';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Report an Item</h1>

      {/* Type toggle */}
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 mb-6 bg-gray-50 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setType('lost')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            type === 'lost'
              ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          I Lost Something
        </button>
        <button
          type="button"
          onClick={() => setType('found')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            type === 'found'
              ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          I Found Something
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Black iPhone 15 Pro"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />

        <Textarea
          label="Description"
          placeholder="Describe the item in detail..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          error={errors.description}
        />

        <Select
          label="Category"
          value={form.categoryId}
          onChange={(e) => set('categoryId', e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Select a category"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Color"
            placeholder="e.g. Black"
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
          />
          <Input
            label="Brand"
            placeholder="e.g. Apple"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
          />
        </div>

        <Input
          label={type === 'lost' ? 'Location Lost' : 'Location Found'}
          placeholder="e.g. Mogadishu, Bakara Market"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={type === 'lost' ? 'Date Lost' : 'Date Found'}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
          {type === 'lost' ? (
            <Input
              label="Reward Amount ($)"
              type="number"
              placeholder="0"
              value={form.rewardAmount}
              onChange={(e) => set('rewardAmount', e.target.value)}
            />
          ) : (
            <Input
              label="Current Storage Location"
              placeholder="Where is the item now?"
              value={form.currentStorageLocation}
              onChange={(e) => set('currentStorageLocation', e.target.value)}
            />
          )}
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URLs (up to 5)
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Paste image URL (https://...)"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl(); } }}
              />
            </div>
            <Button type="button" variant="secondary" onClick={addImageUrl} className="shrink-0 gap-1">
              <LinkIcon className="h-4 w-4" /> Add
            </Button>
          </div>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full gap-2" size="lg">
          <Upload className="h-4 w-4" />
          {type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </Button>
      </form>
    </div>
  );
}
