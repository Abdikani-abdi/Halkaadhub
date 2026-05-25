import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageCircle,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Plus,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { authApi } from '@/api/auth';
import { notificationsApi } from '@/api/notifications';
import { useSignalR } from '@/hooks/useSignalR';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { isAuthenticated, user, logout, refreshToken } = useAuthStore();
  const { unreadCount, setUnreadCount, increment } = useNotificationStore();
  const { on } = useSignalR('notifications');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch initial unread count
  useEffect(() => {
    if (!isAuthenticated) return;
    notificationsApi.getAll(1, 1).then((res) => {
      const unread = res.data?.filter((n) => !n.isRead).length ?? 0;
      setUnreadCount(unread);
    }).catch(() => {});
  }, [isAuthenticated, setUnreadCount]);

  // Listen for real-time notifications
  useEffect(() => {
    const off = on('ReceiveNotification', () => {
      increment();
    });
    return off;
  }, [on, increment]);

  const handleLogout = async () => {
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <Search className="h-6 w-6" />
            <span>HalKaadHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/lost-items" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Lost Items
            </Link>
            <Link to="/found-items" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Found Items
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/items/new">
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Report Item
                  </Button>
                </Link>
                <Link to="/chats" className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link to="/notifications" className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Shield className="h-5 w-5" />
                  </Link>
                )}
                <div className="relative ml-1 flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <User className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                      {user?.fullName}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pb-4">
          <nav className="flex flex-col px-4 pt-2 gap-1">
            <Link to="/lost-items" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Lost Items
            </Link>
            <Link to="/found-items" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              Found Items
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/items/new" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-emerald-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Report Item
                </Link>
                <Link to="/chats" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Messages
                </Link>
                <Link to="/notifications" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Notifications
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="px-3 py-2 text-sm font-medium text-red-500 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-emerald-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
