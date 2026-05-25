import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Public pages
import HomePage from '@/pages/HomePage';
import LostItemsPage from '@/pages/items/LostItemsPage';
import LostItemDetailPage from '@/pages/items/LostItemDetailPage';
import FoundItemsPage from '@/pages/items/FoundItemsPage';
import FoundItemDetailPage from '@/pages/items/FoundItemDetailPage';
import UserProfilePage from '@/pages/UserProfilePage';

// Protected pages
import CreateItemPage from '@/pages/items/CreateItemPage';
import EditLostItemPage from '@/pages/items/EditLostItemPage';
import EditFoundItemPage from '@/pages/items/EditFoundItemPage';
import ProfilePage from '@/pages/ProfilePage';
import ChatsPage from '@/pages/ChatsPage';
import NotificationsPage from '@/pages/NotificationsPage';

// Admin pages
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminLostItemsPage from '@/pages/admin/LostItemsPage';
import AdminFoundItemsPage from '@/pages/admin/FoundItemsPage';
import UsersPage from '@/pages/admin/UsersPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';

// 404 page
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin routes (separate layout) */}
      <Route element={<ProtectedRoute requiredRoles={['Admin', 'Manager']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="lost-items" element={<AdminLostItemsPage />} />
          <Route path="found-items" element={<AdminFoundItemsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Route>

      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/lost-items" element={<LostItemsPage />} />
        <Route path="/lost-items/:id" element={<LostItemDetailPage />} />
        <Route path="/found-items" element={<FoundItemsPage />} />
        <Route path="/found-items/:id" element={<FoundItemDetailPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/items/new" element={<CreateItemPage />} />
          <Route path="/lost-items/:id/edit" element={<EditLostItemPage />} />
          <Route path="/found-items/:id/edit" element={<EditFoundItemPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
