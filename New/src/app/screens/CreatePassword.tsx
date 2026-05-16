import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock, AlertTriangle } from 'lucide-react';

export function CreatePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-destructive' };
    if (password.length < 10) return { strength: 'medium', color: 'bg-amber-500' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 'strong', color: 'bg-emerald-500' };
    }
    return { strength: 'medium', color: 'bg-amber-500' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    navigate('/activation-success');
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D7C66] rounded-full mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="mb-2">Create Your Password</h1>
          <p className="text-muted-foreground">
            Establish your secret key (K2)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Create Password"
              showK2Label
              isPassword
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {passwordStrength && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium capitalize ${
                    passwordStrength.strength === 'strong' ? 'text-emerald-600' :
                    passwordStrength.strength === 'medium' ? 'text-amber-600' :
                    'text-destructive'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{
                      width: passwordStrength.strength === 'strong' ? '100%' :
                             passwordStrength.strength === 'medium' ? '66%' : '33%'
                    }}
                  />
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              isPassword
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={error}
              required
            />

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  This password is known ONLY to you.
                </p>
                <p className="text-xs text-red-800">
                  The bank officer cannot reset or view this password. Keep it secure.
                </p>
              </div>
            </div>

            <Button type="submit" fullWidth>
              Set Password
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            No SMS recovery • No email reset • Visit bank branch if forgotten
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-center text-muted-foreground hover:text-foreground underline"
        >
          Back
        </button>
      </div>
    </div>
  );
}
