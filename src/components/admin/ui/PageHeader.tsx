import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
