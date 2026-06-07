import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { SecurityBadge } from '../components/SecurityBadge';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export function TransactionResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverUsername, amount, timestamp, status = 'success', newBalance, errorMessage } = location.state || {};

  if (!receiverUsername || !amount) {
    navigate('/dashboard');
    return null;
  }

  const calculatedBalance = newBalance !== undefined ? newBalance : undefined;
  const newTimestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const statusConfig = {
    success: {
      icon: CheckCircle,
<<<<<<< HEAD
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100',
      title: 'Transaction Successful',
      message: 'Your payment has been processed securely',
=======
      color: 'text-success',
      bgColor: 'bg-success/10',
      title: 'Transfer Authorized',
      message: 'Secure payment settled in real-time',
>>>>>>> origin/updated
    },
    hmac_mismatch: {
      icon: XCircle,
      color: 'text-destructive',
<<<<<<< HEAD
      bgColor: 'bg-red-100',
      title: 'HMAC Mismatch — Transaction Rejected',
      message: 'Message integrity check failed (F1 ≠ F2)',
=======
      bgColor: 'bg-destructive/10',
      title: 'Integrity Failure',
      message: 'Protocol rejected due to signature mismatch (F1 ≠ F2)',
>>>>>>> origin/updated
    },
    insufficient_balance: {
      icon: AlertTriangle,
      color: 'text-amber-500',
<<<<<<< HEAD
      bgColor: 'bg-amber-100',
      title: 'Insufficient Balance — Transaction Aborted',
      message: 'Your account balance is insufficient for this transaction',
=======
      bgColor: 'bg-amber-100/50',
      title: 'Liquidity Issue',
      message: 'Account balance insufficient for this authorization',
>>>>>>> origin/updated
    },
    receiver_not_found: {
      icon: XCircle,
      color: 'text-destructive',
<<<<<<< HEAD
      bgColor: 'bg-red-100',
      title: 'Receiver Not Found in Database',
      message: 'The receiver username does not exist in our system',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      title: 'Transaction Failed',
      message: 'An error occurred while processing your transaction. Please try again.',
=======
      bgColor: 'bg-destructive/10',
      title: 'Invalid Identifier',
      message: 'Beneficiary could not be located in secure core',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      title: 'Protocol Error',
      message: 'An unexpected exception occurred during settlement',
>>>>>>> origin/updated
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
  const Icon = config?.icon || AlertTriangle;
  const isSuccess = status === 'success';

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl p-8 shadow-lg border border-border"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={`inline-flex items-center justify-center w-24 h-24 ${config.bgColor} rounded-full mb-4`}
          >
            <Icon size={48} className={config.color} />
          </motion.div>
          <h1 className="mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.message}</p>
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">Details: {errorMessage}</p>
=======
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 overflow-hidden relative z-10 text-primary"
      >
        {isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-success" />}
        {!isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />}

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center justify-center w-24 h-24 ${config.bgColor} rounded-[2rem] mb-6 shadow-inner`}
          >
            <Icon size={48} className={config.color} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-primary mb-2">{config.title}</h1>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">{config.message}</p>
          {errorMessage && (
            <p className="text-xs font-bold text-destructive mt-3 uppercase tracking-wider">Error: {errorMessage}</p>
>>>>>>> origin/updated
          )}
        </div>

        {isSuccess && (
<<<<<<< HEAD
          <div className="mb-6 flex justify-center gap-3">
            <SecurityBadge type="hmac-verified" />
            <SecurityBadge type="aes-secured" />
          </div>
        )}

        <div className="bg-[#E8F5F3] rounded-xl p-6 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-muted-foreground">Sent to:</span>
            <span className="font-semibold">@{receiverUsername}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-lg">৳{amount.toFixed(2)}</span>
          </div>
          {isSuccess && calculatedBalance !== undefined && (
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-muted-foreground">New Balance:</span>
              <span className="font-semibold text-[#0D7C66]">৳{calculatedBalance.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Timestamp {isSuccess ? 'Updated (T)' : ''}:</span>
            <span className="font-mono text-sm">{isSuccess ? newTimestamp : timestamp}</span>
=======
          <div className="mb-8 flex justify-center gap-3">
            <SecurityBadge type="hmac-verified" className="shadow-sm" />
            <SecurityBadge type="aes-secured" className="shadow-sm" />
          </div>
        )}

        <div className="bg-primary/5 rounded-[2rem] p-6 mb-8 border border-primary/5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recipient</span>
            <span className="text-sm font-bold text-primary">@{receiverUsername}</span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount Settled</span>
            <span className="text-xl font-bold text-accent">৳{amount.toFixed(2)}</span>
          </div>
          {isSuccess && calculatedBalance !== undefined && (
            <div className="flex items-center justify-between pb-4 border-b border-primary/10">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Remaining Balance</span>
              <span className="text-sm font-bold text-success">৳{calculatedBalance.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol Stamp (T)</span>
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{isSuccess ? newTimestamp : timestamp}</span>
>>>>>>> origin/updated
          </div>
        </div>

        {isSuccess ? (
<<<<<<< HEAD
          <div className="bg-white border border-border rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-[#0D7C66] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-1">Cryptographic Verification Complete</h4>
                <p className="text-sm text-muted-foreground">
                  Server-side HMAC check passed: <span className="font-mono text-[#0D7C66]">F1 = F2</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Message integrity verified • AES decryption successful • Transaction committed
=======
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Shield size={20} className="text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Atomic Verification</h4>
                <p className="text-[11px] font-medium text-secondary/60 leading-normal">
                  Data integrity signed with dynamic key K1. Decryption validated via AES-256. Transaction immutable.
>>>>>>> origin/updated
                </p>
              </div>
            </div>
          </div>
        ) : (
<<<<<<< HEAD
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-900">
              Only you have been notified of this failure. The transaction was not processed.
=======
          <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-5 mb-8">
            <p className="text-xs font-semibold text-destructive/80 text-center leading-relaxed">
              Security protocol interrupted. No liquidity was moved. Audit log recorded for investigation.
>>>>>>> origin/updated
            </p>
          </div>
        )}

<<<<<<< HEAD
        <Button fullWidth onClick={() => navigate('/dashboard')}>
          Back to Home
        </Button>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/history')}
            className="text-sm text-[#0D7C66] hover:underline"
          >
            View Transaction History
=======
        <div className="space-y-4">
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/dashboard')} className="py-5 font-bold tracking-tight bg-primary text-white hover:bg-secondary">
            Return to Core
          </Button>

          <button
            onClick={() => navigate('/history')}
            className="w-full text-xs font-bold text-accent hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            Access Audit Log
>>>>>>> origin/updated
          </button>
        </div>
      </motion.div>
    </div>
  );
}
