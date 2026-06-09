import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ProcessingStep } from '../components/ProcessingStep';
import { motion } from 'motion/react';
import { getUserSession, updateUserTimestamp, updateUserBalance } from '../../utils/session';
import { cryptoEngine } from '../../utils/crypto';
import { processTransfer } from '../../utils/api';

export function TransactionProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverUsername, amount } = location.state || {};

  const [currentStep, setCurrentStep] = useState(-1);
  const [timestamp, setTimestamp] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'processing' | 'completed' | 'failed'>('processing');

  useEffect(() => {
    if (currentStep === -1) {
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
  }, [currentStep]);

  const startProcessing = async () => {
    const session = getUserSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Validate session has all required crypto fields
    const biometricFingerprint = session.bp || '123456';

    if (!session.k1 || !session.k2 || !session.t) {
      console.error('Missing crypto fields in session:', { 
        k1: !!session.k1, 
        k2: !!session.k2, 
        bp: !!biometricFingerprint,
        t: !!session.t 
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
      const message = `Receiver:${receiverUsername}|Amt:${Math.floor(amount * 100) / 100}`;
      
      // Step 2: Generate HMAC (F1)
      const f1 = cryptoEngine.generateHmac(session.k1, message);
      
      // Step 3: Encrypt data
      const encryptedPayload = cryptoEngine.encryptData(message, f1, session.k2, biometricFingerprint, session.t);

      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Send to backend
      const response = await processTransfer(session.username, encryptedPayload);

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
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
          </div>

          <ProcessingStep currentStep={currentStep} timestamp={timestamp} />

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Methodology: HMAC(K1) + AES(K2+BP+T) → Insecure Channel
            </p>
          </div>
      </motion.div>
    </div>
  );
}
