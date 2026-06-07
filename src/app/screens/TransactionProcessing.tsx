import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { FingerprintOverlay } from '../components/FingerprintOverlay';
import { ProcessingStep } from '../components/ProcessingStep';
import { motion } from 'motion/react';
<<<<<<< HEAD
=======
import { Sparkles, Shield } from 'lucide-react';
>>>>>>> origin/updated
import { getUserSession, updateUserTimestamp, updateUserBalance } from '../../utils/session';
import { cryptoEngine } from '../../utils/crypto';
import { processTransfer } from '../../utils/api';

export function TransactionProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverUsername, amount } = location.state || {};

  const [showBiometric, setShowBiometric] = useState(true);
  const [currentStep, setCurrentStep] = useState(-1);
  const [timestamp, setTimestamp] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'processing' | 'completed' | 'failed'>('processing');

  useEffect(() => {
    if (!showBiometric && currentStep === -1) {
      const now = new Date();
      setTimestamp(now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
      startProcessing();
    }
  }, [showBiometric, currentStep]);

  const startProcessing = async () => {
    const session = getUserSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Validate session has all required crypto fields
<<<<<<< HEAD
    if (!session.k1 || !session.k2 || !session.bp || !session.t) {
=======
    if (!session.k1 || !session.k2 || !session.bp || session.last_t === undefined || session.last_t === null) {
>>>>>>> origin/updated
      console.error('Missing crypto fields in session:', { 
        k1: !!session.k1, 
        k2: !!session.k2, 
        bp: !!session.bp, 
<<<<<<< HEAD
        t: !!session.t 
=======
        t: session.last_t !== undefined && session.last_t !== null
>>>>>>> origin/updated
      });
      setTransactionStatus('failed');
      setTimeout(() => {
        navigate('/transaction-result', {
          state: {
            receiverUsername,
            amount,
            timestamp,
            status: 'error',
            errorMessage: 'User profile missing required cryptographic credentials. Please login again.',
          },
        });
      }, 1000);
      return;
    }

    setCurrentStep(0);

    try {
      // Step 1: Prepare message
<<<<<<< HEAD
      const message = `Receiver:${receiverUsername}|Amt:${Math.floor(amount * 100) / 100}`;
=======
      const t_unix = Math.floor(Date.now() / 1000);
      const message = `Receiver:${receiverUsername}|Amt:${Math.floor(amount * 100) / 100}|T:${t_unix}`;
>>>>>>> origin/updated
      
      // Step 2: Generate HMAC (F1)
      const f1 = cryptoEngine.generateHmac(session.k1, message);
      
<<<<<<< HEAD
      // Step 3: Encrypt data
      const encryptedPayload = cryptoEngine.encryptData(message, f1, session.k2, session.bp, session.t);
=======
      // Step 3: Encrypt data (using current timestamp T for key derivation)
      const { payload, iv } = cryptoEngine.encryptData(message, f1, session.k2, session.bp, t_unix);
>>>>>>> origin/updated

      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Send to backend
<<<<<<< HEAD
      const response = await processTransfer(session.username, encryptedPayload);
=======
      const response = await processTransfer(session.username, payload, iv, t_unix);
>>>>>>> origin/updated

      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 5: Handle response
      if (response.status === 'success' && response.new_t) {
        updateUserTimestamp(response.new_t);
        updateUserBalance(session.balance - amount);
        setTransactionStatus('completed');
        
        setTimeout(() => {
          navigate('/transaction-result', {
            state: {
              receiverUsername,
              amount,
              timestamp,
              status: 'success',
              newBalance: session.balance - amount,
            },
          });
        }, 1000);
      } else if (response.status === 'futile') {
        setTransactionStatus('failed');
        setTimeout(() => {
          navigate('/transaction-result', {
            state: {
              receiverUsername,
              amount,
              timestamp,
              status: 'insufficient_balance',
            },
          });
        }, 1000);
      } else {
        setTransactionStatus('failed');
        const statusMap: Record<string, string> = {
          'HMAC mismatch': 'hmac_mismatch',
          'User not found': 'receiver_not_found',
        };
        const mappedStatus = Object.keys(statusMap).find(key => response.message.includes(key)) 
          ? statusMap[Object.keys(statusMap).find(key => response.message.includes(key))!]
          : 'error';
        
        setTimeout(() => {
          navigate('/transaction-result', {
            state: {
              receiverUsername,
              amount,
              timestamp,
              status: mappedStatus,
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionStatus('failed');
      setTimeout(() => {
        navigate('/transaction-result', {
          state: {
            receiverUsername,
            amount,
            timestamp,
            status: 'error',
          },
        });
      }, 1000);
    }
  };

  if (!receiverUsername || !amount) {
    navigate('/dashboard');
    return null;
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
=======
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />

>>>>>>> origin/updated
      <FingerprintOverlay
        isOpen={showBiometric}
        onSuccess={() => setShowBiometric(false)}
        onCancel={() => navigate('/send-money')}
      />

      {!showBiometric && (
        <motion.div
<<<<<<< HEAD
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-2xl p-8 shadow-lg border border-border"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
            <h2 className="mb-2">Processing Transaction</h2>
            <p className="text-muted-foreground">
              Cryptographic operations in progress
            </p>
          </div>

          <div className="bg-[#E8F5F3] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">To:</span>
              <span className="font-semibold">@{receiverUsername}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-[#0D7C66]">৳{amount.toFixed(2)}</span>
            </div>
            {timestamp && (
              <div className="flex items-center justify-between text-xs border-t border-border pt-2">
                <span className="text-muted-foreground">Transaction Time (T):</span>
                <span className="font-mono text-[#0D7C66]">{timestamp}</span>
              </div>
            )}
=======
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl relative z-10"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/5 rounded-3xl mb-6 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="absolute inset-0 border-2 border-accent/20 border-t-accent rounded-3xl"
              />
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Sparkles size={32} className="text-accent" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-primary">Protocol Authorization</h2>
            <p className="text-muted-foreground text-sm font-medium">
              Signing payload with dynamic keys
            </p>
          </div>

          <div className="bg-primary/5 rounded-[1.75rem] p-6 border border-primary/5 mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              <span>Transaction Summary</span>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary/60">Beneficiary</span>
                <span className="text-sm font-bold text-primary">@{receiverUsername}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary/60">Amount</span>
                <span className="text-xl font-bold text-accent">৳{amount.toFixed(2)}</span>
              </div>
              {timestamp && (
                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Auth Timestamp</span>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">{timestamp}</span>
                </div>
              )}
            </div>
>>>>>>> origin/updated
          </div>

          <ProcessingStep currentStep={currentStep} timestamp={timestamp} />

<<<<<<< HEAD
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Methodology: HMAC(K1) + AES(K2+BP+T) → Insecure Channel
=======
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
              <Shield size={12} className="text-accent" />
              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground text-center uppercase tracking-tighter">
              Methodology: HMAC-SHA256(K1) + AES-CBC(K2 ⊕ BP ⊕ T)
>>>>>>> origin/updated
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
