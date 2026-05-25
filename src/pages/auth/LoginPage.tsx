import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.login(form);
      if (res.success && res.data) {
        setAuth(res.data);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-2">
            <LogIn className="h-7 w-7" />
            HalKaadHub
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
