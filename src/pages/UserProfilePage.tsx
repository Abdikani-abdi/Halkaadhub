import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Star, Calendar, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usersApi } from '@/api/users';
import type { UserProfileDto } from '@/types';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await usersApi.getUser(id);
        if (res.success && res.data) setProfile(res.data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Spinner text="Loading profile..." />;
  if (!profile) return <p className="text-center text-gray-500 py-16">User not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-28" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {profile.fullName[0]}
                </div>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.fullName}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{profile.email}</span>
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />{profile.city}{profile.district ? `, ${profile.district}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1"><Star className="h-4 w-4" />{profile.reputationScore} rep</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex gap-2 mb-4">
            <Badge variant={profile.role === 'Admin' ? 'danger' : profile.role === 'Manager' ? 'warning' : 'default'}>{profile.role}</Badge>
            {profile.isVerified && <Badge variant="success">Verified</Badge>}
          </div>

          {profile.bio && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
