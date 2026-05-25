import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/lost-items">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Items
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
