import { useState } from 'react';
import { Plus, FolderTree, Sparkles, Tag, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin';
import type { CategoryDto } from '@/types';
import Button from '@/components/ui/Button';
import { PageHeader, Card, CardHeader, CardTitle, CardContent } from '@/components/admin/ui';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const res = await adminApi.createCategory({ name: name.trim(), icon: icon.trim() || undefined });
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data as CategoryDto]);
        setName('');
        setIcon('');
        toast.success('Category created');
      } else {
        toast.error(res.message || 'Failed');
      }
    } catch { toast.error('Failed to create category'); }
    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage item categories for lost and found items"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Category Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle>Create Category</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Add a new category for items</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Electronics, Jewelry, Documents"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 📱, 💍, 📄"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Newly Created Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/20">
                <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Newly Created</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Categories added this session</p>
              </div>
            </div>
          </CardHeader>
          
          {categories.length === 0 ? (
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <FolderTree className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">No new categories</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Categories you create will appear here
                </p>
              </div>
            </CardContent>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((c) => (
                <div 
                  key={c.id} 
                  className="stagger-item flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-500/20 dark:to-purple-500/10 flex items-center justify-center text-xl">
                    {c.icon || '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Just created</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                    New
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Info Banner */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Default Categories</p>
          <p className="text-sm text-blue-700 dark:text-blue-400/80 mt-0.5">
            12 categories are automatically seeded when the backend runs for the first time. New categories created here will be added to the existing list.
          </p>
        </div>
      </div>
    </div>
  );
}
