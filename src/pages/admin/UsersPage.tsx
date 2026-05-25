import { useEffect, useState } from 'react';
import { Ban, ShieldCheck, Users, Search, Filter, MoreVertical, Mail, Star, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { adminApi } from '@/api/admin';
import type { AdminUserDto } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { PageHeader, Card } from '@/components/admin/ui';

function UserAvatar({ user }: { user: AdminUserDto }) {
  const colors = [
    'from-emerald-400 to-emerald-600',
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-teal-400 to-teal-600',
  ];
  const colorIndex = user.fullName.charCodeAt(0) % colors.length;
  
  return (
    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center ring-2 ring-gray-100 dark:ring-gray-800`}>
      <span className="text-sm font-semibold text-white">
        {user.fullName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles = {
    Admin: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 ring-red-500/20',
    Manager: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 ring-amber-500/20',
    User: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 ring-gray-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset ${styles[role as keyof typeof styles] || styles.User}`}>
      {role}
    </span>
  );
}

function TableSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </td>
          <td className="px-5 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" /></td>
          <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
          <td className="px-5 py-4"><div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
          <td className="px-5 py-4"><div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" /></td>
        </tr>
      ))}
    </>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(p, 20);
      setUsers(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const toggleBan = async (id: string) => {
    try {
      const res = await adminApi.banUser(id);
      if (res.success) {
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
        toast.success('User updated');
      } else {
        toast.error(res.message);
      }
    } catch { toast.error('Action failed'); }
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage and monitor all registered users"
        action={
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {users.length} total users
            </span>
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
                placeholder="Search users..."
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Rep</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableSkeleton />
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Users className="h-7 w-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No users found</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={u} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{u.fullName}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {u.isBanned ? (
                          <Badge variant="danger">Banned</Badge>
                        ) : u.isVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-amber-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{u.reputationScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={u.isBanned ? 'secondary' : 'danger'}
                          size="sm"
                          onClick={() => toggleBan(u.id)}
                          className="gap-1.5"
                        >
                          {u.isBanned ? (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Unban
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              Ban
                            </>
                          )}
                        </Button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
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
