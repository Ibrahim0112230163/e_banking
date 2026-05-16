import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Shield, Smartphone } from 'lucide-react';

export function OfficerVerify() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nid: '',
    activationCode: '',
    username: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nid && formData.activationCode && formData.username) {
      navigate('/biometric-enrollment', { state: formData });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5F3] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0D7C66] rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="mb-2">Verify Your Identity</h1>
          <p className="text-muted-foreground">
            Generate your private key (K1)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="NID / BRC Number"
              type="text"
              placeholder="Enter your NID or BRC number"
              value={formData.nid}
              onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
              required
            />

            <Input
              label="Activation Code"
              type="text"
              placeholder="Code provided by bank officer"
              value={formData.activationCode}
              onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
              required
            />

            <Input
              label="Bank-Assigned Username"
              type="text"
              placeholder="Username provided by officer"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              helperText="This username was assigned by your bank officer"
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Smartphone size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Your device MAC address will be bound to this account for security (K1 generation).
              </p>
            </div>

            <Button type="submit" fullWidth>
              Verify & Continue
            </Button>
          </form>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-center text-muted-foreground hover:text-foreground underline"
        >
          Back
        </button>
      </div>
    </div>
  );
}
