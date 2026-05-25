import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, MapPin, Mail, Phone, Star, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import type { UserProfileDto } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', bio: '', city: '', district: '' });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    (async () => {
      try {
        const res = await usersApi.getMyProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setForm({
            fullName: res.data.fullName,
            phoneNumber: res.data.phoneNumber || '',
            bio: res.data.bio || '',
            city: res.data.city || '',
            district: res.data.district || '',
          });
        }
      } catch { toast.error('Failed to load profile'); }
      setLoading(false);
    })();
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersApi.updateProfile(form);
      if (res.success && res.data) {
        setProfile(res.data);
        updateUser({ fullName: res.data.fullName });
        setEditing(false);
        toast.success('Profile updated');
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch { toast.error('Update failed'); }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await usersApi.uploadAvatar(file);
      if (res.success && res.data) {
        setProfile((p) => p ? { ...p, profileImageUrl: res.data! } : p);
        updateUser({ profileImageUrl: res.data });
        toast.success('Avatar updated');
      }
    } catch { toast.error('Upload failed'); }
  };

  if (loading) return <Spinner text="Loading profile..." />;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-28 relative" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {profile.fullName[0]}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-emerald-700 transition-colors">
                <Camera className="h-3.5 w-3.5" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{profile.email}</span>
            {profile.phoneNumber && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{profile.phoneNumber}</span>}
            {profile.city && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profile.city}{profile.district ? `, ${profile.district}` : ''}</span>}
            <span className="flex items-center gap-1"><Star className="h-4 w-4" />{profile.reputationScore} rep</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}</span>
          </div>

          <div className="flex gap-2 mb-6">
            <Badge variant={profile.role === 'Admin' ? 'danger' : profile.role === 'Manager' ? 'warning' : 'default'}>{profile.role}</Badge>
            {profile.isVerified && <Badge variant="success">Verified</Badge>}
          </div>

          {/* Edit form */}
          {editing ? (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <Input label="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} loading={saving} className="gap-1.5"><Save className="h-4 w-4" />Save</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {profile.bio && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>}
              <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
