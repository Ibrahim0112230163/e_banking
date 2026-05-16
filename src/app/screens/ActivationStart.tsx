import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Shield, FileText } from 'lucide-react';

export function ActivationStart() {
  const navigate = useNavigate();

  return (
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
          </p>
        </div>
      </div>
    </div>
  );
}
