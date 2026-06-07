import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { CheckCircle, Shield, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export function ActivationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
=======
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
>>>>>>> origin/updated
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
<<<<<<< HEAD
            className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-4"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
          <h1 className="mb-2">Account Activated</h1>
          <p className="text-muted-foreground">
            Your e-payment account is ready to use
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Username</span>
            <span className="font-semibold">@{username || 'user'}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Daily Transaction Limit</span>
            <span className="font-semibold text-[#0D7C66]">৳5,000.00</span>
          </div>

          <div className="bg-[#E8F5F3] rounded-lg p-4">
            <h4 className="mb-3 flex items-center gap-2">
              <Shield size={18} className="text-[#0D7C66]" />
              Security Features Enabled
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>AES Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>HMAC Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Device-Bound Key (K1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Biometric Protection (BP)</span>
=======
            className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-6 shadow-xl"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Activation Complete</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Your e-payment account is secure and active
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account ID</span>
            <span className="font-bold text-primary">@{username || 'user'}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Spending Limit</span>
            <span className="font-bold text-accent">৳5,000.00</span>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <h4 className="mb-3 flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Shield size={16} className="text-accent" />
              Cryptographic Safeguards
            </h4>
            <div className="space-y-2 text-xs font-semibold text-primary/70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>AES-256 Symmetric Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>HMAC-SHA256 Integrity Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Hardware bound Device ID Signature (K1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Local Fingerprint Biometrics (BP)</span>
>>>>>>> origin/updated
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingDown size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Daily Petty Cash System
                </p>
                <p className="text-xs text-blue-800">
                  Your account supports small monetary transactions with a daily limit. The limit resets every 24 hours.
=======
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <TrendingDown size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  Daily Petty Cash Security
                </p>
                <p className="text-xs font-medium text-primary/70 leading-relaxed">
                  Your account supports secure micro-payments with a daily spending cap. The limit automatically resets every 24 hours.
>>>>>>> origin/updated
                </p>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <Button fullWidth onClick={() => navigate('/login')}>
          Go to Login
        </Button>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            No OTP required • Device + Biometric + Password authentication
=======
        <Button fullWidth size="lg" onClick={() => navigate('/login')}>
          Proceed to Login
        </Button>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
            No SMS required • End-to-End Encrypted Authenticity
>>>>>>> origin/updated
          </p>
        </div>
      </div>
    </div>
  );
}
