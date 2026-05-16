import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Fingerprint, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function BiometricEnrollment() {
  const navigate = useNavigate();
  const [scanCount, setScanCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (scanCount < 3) {
      setIsScanning(true);
      setTimeout(() => {
        setScanCount(scanCount + 1);
        setIsScanning(false);
      }, 1500);
    }
  };

  const isComplete = scanCount === 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="mb-2">Biometric Enrollment</h1>
          <p className="text-muted-foreground">
            Register your fingerprint (BP)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border mb-6">
          <div className="flex flex-col items-center">
            <motion.div
              animate={
                isScanning
                  ? { scale: [1, 1.1, 1], opacity: [1, 0.6, 1] }
                  : isComplete
                  ? { scale: 1.1 }
                  : {}
              }
              transition={
                isScanning
                  ? { repeat: Infinity, duration: 1.5 }
                  : { duration: 0.3 }
              }
              className={`relative cursor-pointer ${
                isComplete
                  ? 'text-emerald-500'
                  : isScanning
                  ? 'text-blue-500'
                  : 'text-[#0D7C66]'
              }`}
              onClick={!isComplete ? handleScan : undefined}
            >
              <Fingerprint size={120} strokeWidth={1.5} />
              {!isComplete && !isScanning && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full border-4 border-[#0D7C66]"
                />
              )}
            </motion.div>

            <div className="mt-6 text-center">
              <p className="font-medium mb-2">
                {isScanning
                  ? 'Scanning...'
                  : isComplete
                  ? 'Enrollment Complete!'
                  : 'Place your finger on the scanner'}
              </p>
              <p className="text-sm text-muted-foreground">
                Scan {scanCount} of 3
              </p>
            </div>

            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i <= scanCount ? 'bg-[#0D7C66]' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900">
              Your fingerprint (BP) will be used to encrypt every transaction.
            </p>
          </div>
        </div>

        <Button
          fullWidth
          disabled={!isComplete}
          onClick={() => navigate('/create-password')}
        >
          {isComplete ? 'Complete Enrollment' : `Scan ${3 - scanCount} more time${3 - scanCount !== 1 ? 's' : ''}`}
        </Button>

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
