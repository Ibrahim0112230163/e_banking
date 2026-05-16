import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock, User } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      navigate('/dashboard');
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
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <Input
              label="Password"
              showK2Label
              isPassword
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button type="submit" fullWidth>
              Login
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
