import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} HalKaadHub &mdash; Somali Lost &amp; Found Community
        </div>
      </footer>
    </div>
  );
}
