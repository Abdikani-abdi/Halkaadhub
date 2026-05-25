import { type LucideIcon, Inbox } from 'lucide-react';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-2xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center shadow-lg">
          <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
