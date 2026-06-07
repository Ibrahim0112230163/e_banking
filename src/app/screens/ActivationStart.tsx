import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
<<<<<<< HEAD
import { Shield, FileText } from 'lucide-react';
=======
import { Shield, Key, Landmark, Fingerprint, Sparkles } from 'lucide-react';
>>>>>>> origin/updated

export function ActivationStart() {
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0D7C66] rounded-full mb-4">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="mb-2">Activate Your E-Payment Account</h1>
          <p className="text-muted-foreground">
            Secure digital transactions without OTP
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-2">Bank-Assisted Activation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visit your bank officer with your <strong>NID</strong> or <strong>Birth Registration Certificate (BRC)</strong> to receive an activation code.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            fullWidth
            onClick={() => navigate('/officer-verify')}
          >
            I Have an Activation Code
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={() => alert('Please visit your nearest bank branch')}
          >
            Contact Bank Officer
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={() => navigate('/login')}
            className="mt-4"
          >
            Already have an account? Login
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by AES Encryption + HMAC Authentication
=======
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-full blur-[150px]" />

      <div className="max-w-xl w-full relative z-10 my-8">
        {/* Header Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 shadow-inner">
            <Shield size={14} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Zero-Trust Secured Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
            SecureCore Bank
          </h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Next-Gen Cryptographic E-Banking
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8">
          <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            E-Payment Secure Portal
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-accent">
                <Landmark size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Bank-Assisted Activation</h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Provide your <strong>NID</strong> or <strong>Birth Certificate</strong> to a bank officer at any branch to generate your secure, offline activation code.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-accent">
                <Key size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Zero-OTP Cryptography</h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Say goodbye to SIM-swap vulnerabilities. SecureCore derives hardware-bound private keys directly on your device.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-accent">
                <Fingerprint size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Biometric Verification</h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">
                  Every transaction requires high-security local fingerprint validation to compile client signature blocks.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate('/officer-verify')}
              className="bg-accent text-white hover:bg-accent/90 shadow-accent/20"
            >
              Activate Your Account
            </Button>
            
            <Button
              fullWidth
              variant="glass"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Access Portal (Sign In)
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            AES-256 + HMAC-SHA256 Zero-Knowledge Architecture
>>>>>>> origin/updated
          </p>
        </div>
      </div>
    </div>
  );
}
