import { type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {[...Array(columns)].map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDirection,
  onSort,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.className || ''}`}
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    >
                      {col.header}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableSkeleton columns={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{emptyMessage}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`group transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-4 text-sm ${col.className || ''}`}>
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
