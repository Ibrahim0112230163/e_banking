import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock, AlertCircle } from 'lucide-react';
import { saveUserSession } from '../../utils/session';
import { loginUser } from '../../utils/api';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginUser(formData.username.trim(), formData.password);

      if (result.status !== 'success' || !result.user) {
        setError(result.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      const user = result.user;

      // Save full session
      saveUserSession({
        id: user.id,
        username: user.username,
        k1: user.k1,
        k2: user.k2,
        bp: user.bp,
        t: user.t,
        balance: user.balance,
        accountId: user.accountId,
        daily_limit: user.daily_limit,
        today_spent: user.today_spent,
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0D7C66] rounded-full mb-4">
            <Lock size={40} className="text-white" />
          </div>
          <h1 className="mb-2">E-Payment System</h1>
          <p className="text-muted-foreground">
            Secure petty cash transactions
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-900">{error}</p>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              showK2Label
              isPassword
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
            />

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Forgot password?{' '}
              <button
                onClick={() => alert('Please visit your bank branch for password reset')}
                className="text-[#0D7C66] hover:underline"
              >
                Visit your bank branch
              </button>
            </p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            No phone number • No OTP • No SMS verification
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[#0D7C66] hover:underline"
          >
            New user? Activate your account
          </button>
        </div>
      </div>
    </div>
  );
}
