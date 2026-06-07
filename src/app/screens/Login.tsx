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
        token: result.token || '',
        k1: user.k1,
        k2: user.k2,
        bp: user.bp,
<<<<<<< HEAD
        t: user.t,
=======
        last_t: user.last_t,
>>>>>>> origin/updated
        balance: user.balance,
        accountId: user.accountId,
        daily_limit: user.daily_limit,
        today_spent: user.today_spent,
<<<<<<< HEAD
=======
        last_spent_reset_date: user.last_spent_reset_date,
>>>>>>> origin/updated
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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Lock size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Secure Core</h1>
          <p className="text-white/60 font-medium">
            Premium Digital Banking Experience
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-destructive">{error}</p>
>>>>>>> origin/updated
              </div>
            )}

            <Input
<<<<<<< HEAD
              label="Username"
              type="text"
              placeholder="Enter your username"
=======
              label="Account Identifier"
              type="text"
              placeholder="Username or ID"
>>>>>>> origin/updated
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isLoading}
            />

            <Input
<<<<<<< HEAD
              label="Password"
=======
              label="Security Key"
>>>>>>> origin/updated
              showK2Label
              isPassword
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
            />

<<<<<<< HEAD
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
=======
            <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading} className="mt-2">
              {isLoading ? 'Authenticating...' : 'Sign In Securely'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => alert('Please visit your bank branch for password reset')}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              Forgotten your security key?
            </button>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-white/20" />
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Zero-Trust Protocol
            </p>
            <div className="h-px w-8 bg-white/20" />
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="group flex items-center justify-center gap-2 w-full text-white font-semibold hover:text-accent transition-colors"
          >
            <span>New client? Join the future of banking</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
>>>>>>> origin/updated
          </button>
        </div>
      </div>
    </div>
  );
}
