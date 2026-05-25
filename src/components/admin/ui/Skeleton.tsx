interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1rem' : undefined),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
