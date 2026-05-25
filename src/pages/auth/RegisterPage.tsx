import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    city: '',
    district: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = 'Full name is required';
    if (!form.username) e.username = 'Username is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword: _, ...dto } = form;
      const res = await authApi.register(dto);
      if (res.success && res.data) {
        setAuth(res.data);
        toast.success('Account created!');
        navigate('/');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-2">
            <UserPlus className="h-7 w-7" />
            HalKaadHub
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} error={errors.fullName} />
            <Input label="Username" value={form.username} onChange={(e) => set('username', e.target.value)} error={errors.username} />
          </div>
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} />
            <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} error={errors.confirmPassword} />
          </div>
          <Input label="Phone Number" type="tel" value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} placeholder="Optional" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Optional" />
            <Input label="District" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="Optional" />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
