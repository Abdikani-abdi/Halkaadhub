import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!email || !token) {
      toast.error('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.resetPassword({ email, token, newPassword: password });
      if (res.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(res.message || 'Reset failed');
      }
    } catch {
      toast.error('Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Invalid Reset Link</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full">Request New Link</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-2">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Password Reset!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            <Button type="submit" loading={loading} className="w-full">
              Reset Password
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-emerald-600 hover:text-emerald-700">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
