import { useState, useEffect } from 'react';
import { Fingerprint, X } from 'lucide-react';
import { motion } from 'motion/react';

interface FingerprintOverlayProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export function FingerprintOverlay({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Verify Your Identity',
  subtitle = 'Place your finger to generate the AES encryption key.',
}: FingerprintOverlayProps) {
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'success'>('waiting');

  useEffect(() => {
    if (isOpen) {
      setStatus('waiting');
    }
  }, [isOpen]);

  const handleScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 800);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl p-8 max-w-md w-full text-center relative"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X size={24} />
        </button>

        <h2 className="mb-2">{title}</h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>

        <div className="flex flex-col items-center">
          <motion.div
            animate={
              status === 'scanning'
                ? { scale: [1, 1.1, 1], opacity: [1, 0.6, 1] }
                : status === 'success'
                ? { scale: 1.2, rotate: 360 }
                : {}
            }
            transition={
              status === 'scanning'
                ? { repeat: Infinity, duration: 1.5 }
                : { duration: 0.5 }
            }
            className={`relative cursor-pointer ${
              status === 'success'
                ? 'text-emerald-500'
                : status === 'scanning'
                ? 'text-blue-500'
                : 'text-[#0D7C66]'
            }`}
            onClick={status === 'waiting' ? handleScan : undefined}
          >
            <Fingerprint size={120} strokeWidth={1.5} />
            {status === 'waiting' && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-4 border-[#0D7C66]"
              />
            )}
          </motion.div>

          <p className="mt-6 text-sm text-muted-foreground">
            {status === 'waiting' && 'Tap the fingerprint to scan'}
            {status === 'scanning' && 'Scanning...'}
            {status === 'success' && 'Verified!'}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="mt-8 text-muted-foreground hover:text-foreground underline"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
