import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
<<<<<<< HEAD
import { Lock, AlertTriangle, Loader2 } from 'lucide-react';
=======
import { Lock, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
>>>>>>> origin/updated
import { registerAccount } from '../../utils/api';

export function CreatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-destructive' };
    if (password.length < 10) return { strength: 'medium', color: 'bg-amber-500' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 'strong', color: 'bg-emerald-500' };
    }
    return { strength: 'medium', color: 'bg-amber-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

<<<<<<< HEAD
    const { username, nid, activationCode } = location.state || {};
    
    if (!username) {
      setError('Missing user information. Please go back to the first step.');
=======
    const { username, nid, activationCode, macAddress, bp_hash } = location.state || {};
    
    if (!username || !nid || !activationCode || !macAddress || !bp_hash) {
      setError('Missing required registration data (username, NID, activation code, MAC address, or biometric signature). Please go back to the first step.');
>>>>>>> origin/updated
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerAccount({
        username,
        password: formData.password,
        nid,
<<<<<<< HEAD
        activationCode
=======
        activationCode,
        macAddress,
        bp_hash
>>>>>>> origin/updated
      });

      if (result.status === 'success') {
        navigate('/activation-success', { state: { username } });
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Lock size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Create Password</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Establish your secret password key (K2)
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
>>>>>>> origin/updated
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
<<<<<<< HEAD
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium capitalize ${
                    passwordStrength.strength === 'strong' ? 'text-emerald-600' :
                    passwordStrength.strength === 'medium' ? 'text-amber-600' :
=======
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground uppercase tracking-wider">Strength</span>
                  <span className={`font-bold capitalize ${
                    passwordStrength.strength === 'strong' ? 'text-emerald-600' :
                    passwordStrength.strength === 'medium' ? 'text-amber-500' :
>>>>>>> origin/updated
                    'text-destructive'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
<<<<<<< HEAD
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
=======
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
>>>>>>> origin/updated
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

<<<<<<< HEAD
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  This password is known ONLY to you.
                </p>
                <p className="text-xs text-red-800">
                  The bank officer cannot reset or view this password. Keep it secure.
=======
            <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-1">
                  Private Key Warning
                </p>
                <p className="text-xs font-medium text-destructive/80 leading-relaxed">
                  This key is known only to you. The bank cannot recover or reset it. Keep it completely secure.
>>>>>>> origin/updated
                </p>
              </div>
            </div>

<<<<<<< HEAD
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
=======
            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
>>>>>>> origin/updated
                  Registering...
                </>
              ) : (
                'Set Password'
              )}
            </Button>
          </form>
        </div>

<<<<<<< HEAD
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            No SMS recovery • No email reset • Visit bank branch if forgotten
=======
        <div className="text-center mb-6">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
            No SMS Recovery • No Email Reset • Branch Recovery Only
>>>>>>> origin/updated
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
<<<<<<< HEAD
          className="w-full mt-4 text-center text-muted-foreground hover:text-foreground underline"
        >
          Back
=======
          className="group flex items-center justify-center gap-2 w-full text-white/60 font-semibold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
>>>>>>> origin/updated
        </button>
      </div>
    </div>
  );
}
