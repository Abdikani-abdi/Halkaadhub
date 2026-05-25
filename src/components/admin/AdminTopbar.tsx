import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Home,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { authApi } from '@/api/auth';
import { notificationsApi } from '@/api/notifications';
import { useSignalR } from '@/hooks/useSignalR';
import { useTheme } from '@/hooks/useTheme';

interface AdminTopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function AdminTopbar({ onMenuClick, sidebarCollapsed }: AdminTopbarProps) {
  const { user, logout, refreshToken } = useAuthStore();
  const { unreadCount, setUnreadCount, increment } = useNotificationStore();
  const { on } = useSignalR('notifications');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsApi.getAll(1, 1).then((res) => {
      const unread = res.data?.filter((n) => !n.isRead).length ?? 0;
      setUnreadCount(unread);
    }).catch(() => {});
  }, [setUnreadCount]);

  useEffect(() => {
    const off = on('ReceiveNotification', () => {
      increment();
    });
    return off;
  }, [on, increment]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300
        ${sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-64'} left-0`}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors lg:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 lg:w-80 pl-10 pr-4 py-2 text-sm bg-gray-100/80 dark:bg-gray-800/80 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-200/80 dark:bg-gray-700/80 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt=""
                  className="h-8 w-8 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-2 ring-gray-100 dark:ring-gray-800">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user?.fullName}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {user?.role}
                </p>
              </div>
              <ChevronDown className={`hidden sm:block h-4 w-4 text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Home className="h-4 w-4 text-gray-400" />
                    Back to Site
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    Profile
                  </Link>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      )}
    </header>
  );
}
