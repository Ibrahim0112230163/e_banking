import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
<<<<<<< HEAD
import { Fingerprint, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
=======
import { Fingerprint, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import CryptoJS from 'crypto-js';
>>>>>>> origin/updated

export function BiometricEnrollment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scanCount, setScanCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (scanCount < 3) {
      setIsScanning(true);
      setTimeout(() => {
        setScanCount(scanCount + 1);
        setIsScanning(false);
<<<<<<< HEAD
      }, 1500);
=======
      }, 1200);
>>>>>>> origin/updated
    }
  };

  const isComplete = scanCount === 3;

<<<<<<< HEAD
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
=======
  const handleComplete = () => {
    // Simulate fingerprint template string
    const fingerprintSim = "123456";
    const bpHash = CryptoJS.SHA256(fingerprintSim).toString();
    
    navigate('/create-password', { 
      state: { 
        ...location.state, 
        bp_hash: bpHash,
        macAddress: location.state?.macAddress || "AA:BB:CC:DD:EE:FF"
      } 
    });
  };

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Fingerprint size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Biometric Registry</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Register your hardware signature key (BP)
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary">
>>>>>>> origin/updated
          <div className="flex flex-col items-center">
            <motion.div
              animate={
                isScanning
<<<<<<< HEAD
                  ? { scale: [1, 1.1, 1], opacity: [1, 0.6, 1] }
                  : isComplete
                  ? { scale: 1.1 }
=======
                  ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }
                  : isComplete
                  ? { scale: 1.05 }
>>>>>>> origin/updated
                  : {}
              }
              transition={
                isScanning
<<<<<<< HEAD
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
=======
                  ? { repeat: Infinity, duration: 1.2 }
                  : { duration: 0.3 }
              }
              className={`relative cursor-pointer w-32 h-32 rounded-3xl flex items-center justify-center border-2 border-dashed ${
                isComplete
                  ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                  : isScanning
                  ? 'text-accent border-accent/30 bg-accent/5'
                  : 'text-primary border-primary/20 hover:border-accent hover:text-accent transition-colors'
              }`}
              onClick={!isComplete ? handleScan : undefined}
            >
              <Fingerprint size={80} strokeWidth={1.5} />
              {!isComplete && !isScanning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-3xl border-2 border-accent"
>>>>>>> origin/updated
                />
              )}
            </motion.div>

            <div className="mt-6 text-center">
<<<<<<< HEAD
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
=======
              <p className="font-bold text-lg mb-1">
                {isScanning
                  ? 'Capturing Signature...'
                  : isComplete
                  ? 'Enrollment Verified!'
                  : 'Tap fingerprint to scan'}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Scan progress: {scanCount} of 3
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= scanCount ? 'bg-accent w-6' : 'bg-muted'
>>>>>>> origin/updated
                  }`}
                />
              ))}
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900">
              Your fingerprint (BP) will be used to encrypt every transaction.
=======
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-8">
            <p className="text-xs font-semibold text-primary/70 leading-relaxed text-center">
              Your biometric pattern (BP) is cryptographically combined with your secret password keys locally on this device.
>>>>>>> origin/updated
            </p>
          </div>
        </div>

        <Button
          fullWidth
<<<<<<< HEAD
          disabled={!isComplete}
          onClick={() => navigate('/create-password', { state: location.state })}
        >
          {isComplete ? 'Complete Enrollment' : `Scan ${3 - scanCount} more time${3 - scanCount !== 1 ? 's' : ''}`}
=======
          size="lg"
          disabled={!isComplete}
          onClick={handleComplete}
          className={isComplete ? 'bg-accent text-white shadow-accent/20' : ''}
        >
          {isComplete ? 'Complete Registration' : `Scan ${3 - scanCount} more time${3 - scanCount !== 1 ? 's' : ''}`}
>>>>>>> origin/updated
        </Button>

        <button
          onClick={() => navigate(-1)}
<<<<<<< HEAD
          className="w-full mt-4 text-center text-muted-foreground hover:text-foreground underline"
        >
          Back
=======
          className="group flex items-center justify-center gap-2 w-full mt-6 text-white/60 font-semibold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
>>>>>>> origin/updated
        </button>
      </div>
    </div>
  );
}
