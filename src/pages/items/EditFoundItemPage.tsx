import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { foundItemsApi } from '@/api/foundItems';
import { categoriesApi } from '@/api/categories';
import { useAuthStore } from '@/stores/authStore';
import type { FoundItemDto, CategoryDto } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';

export default function EditFoundItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<FoundItemDto | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    color: '',
    brand: '',
    locationFound: '',
    foundDate: '',
    currentStorageLocation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          foundItemsApi.getById(id),
          categoriesApi.getAll(),
        ]);
        if (itemRes.success && itemRes.data) {
          const data = itemRes.data;
          if (user && data.userId !== user.id) {
            toast.error('You can only edit your own items');
            navigate('/found-items');
            return;
          }
          setItem(data);
          setForm({
            title: data.title,
            description: data.description,
            categoryId: data.categoryId || '',
            color: data.color || '',
            brand: data.brand || '',
            locationFound: data.locationFound || '',
            foundDate: data.foundDate ? data.foundDate.split('T')[0] : '',
            currentStorageLocation: data.currentStorageLocation || '',
          });
        } else {
          navigate('/found-items');
        }
        setCategories(catRes.data || []);
      } catch {
        navigate('/found-items');
      }
      setLoading(false);
    })();
  }, [id, navigate, user]);

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
    if (newImageUrls.length >= 5) {
      toast.error('Maximum 5 new images allowed');
      return;
    }
    setNewImageUrls((prev) => [...prev, url]);
    setImageInput('');
  };

  const removeNewImageUrl = (idx: number) => {
    setNewImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;
    setSaving(true);

    try {
      const dto = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId || undefined,
        color: form.color || undefined,
        brand: form.brand || undefined,
        locationFound: form.locationFound || undefined,
        foundDate: form.foundDate || undefined,
        currentStorageLocation: form.currentStorageLocation || undefined,
      };
      const res = await foundItemsApi.update(id, dto);
      if (res.success) {
        if (newImageUrls.length > 0) {
          await foundItemsApi.addImages(id, newImageUrls);
        }
        toast.success('Item updated!');
        navigate(`/found-items/${id}`);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner text="Loading item..." />;
  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Edit Found Item</h1>

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
          options={[
            { value: '', label: 'Select a category' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
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
          label="Location Found"
          placeholder="e.g. Mogadishu, Bakara Market"
          value={form.locationFound}
          onChange={(e) => set('locationFound', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date Found"
            type="date"
            value={form.foundDate}
            onChange={(e) => set('foundDate', e.target.value)}
          />
          <Input
            label="Current Storage Location"
            placeholder="Where is the item now?"
            value={form.currentStorageLocation}
            onChange={(e) => set('currentStorageLocation', e.target.value)}
          />
        </div>

        {/* Existing images */}
        {item.imageUrls?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Photos
            </label>
            <div className="flex flex-wrap gap-3">
              {item.imageUrls.map((url, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new image URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add More Images (up to 5)
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
          {newImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {newImageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                  <button
                    type="button"
                    onClick={() => removeNewImageUrl(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
