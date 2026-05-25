import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Flag,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  ChevronDown,
  X,
  Package,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  children?: { to: string; label: string }[];
}

const navItems: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/lost-items', icon: Search, label: 'Lost Items' },
  { to: '/admin/found-items', icon: Package, label: 'Found Items' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/reports', icon: Flag, label: 'Reports' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
            <Search className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">HalKaadHub</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={`${collapsed ? '' : 'mb-2'}`}>
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Main Menu
            </span>
          )}
        </div>

        {navItems.map((item) => (
          <div key={item.to}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer
                    ${isActive(item.to)
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive(item.to) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedItems.includes(item.label) ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                {!collapsed && expandedItems.includes(item.label) && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={onMobileClose}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-800/50">
        {!collapsed && (
          <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Admin Access</span>
            </div>
            <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60">
              You have full administrative privileges
            </p>
          </div>
        )}

        {/* Collapse toggle - Desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col transform transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-300 ease-out
          ${collapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <NavContent />
      </aside>
    </>
  );
}
