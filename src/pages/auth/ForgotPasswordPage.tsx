import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Reset instructions sent');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-2">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Forgot password?</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your email and we&apos;ll send you reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              If an account with that email exists, you&apos;ll receive reset instructions shortly.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" loading={loading} className="w-full">
              Send reset link
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
