import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
<<<<<<< HEAD
import { Shield, Smartphone } from 'lucide-react';
=======
import { Shield, Smartphone, ArrowLeft } from 'lucide-react';
>>>>>>> origin/updated

export function OfficerVerify() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nid: '',
    activationCode: '',
    username: '',
<<<<<<< HEAD
=======
    macAddress: 'AA:BB:CC:DD:EE:FF',
>>>>>>> origin/updated
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    if (formData.nid && formData.activationCode && formData.username) {
=======
    if (formData.nid && formData.activationCode && formData.username && formData.macAddress) {
>>>>>>> origin/updated
      navigate('/biometric-enrollment', { state: formData });
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Shield size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Verify Identity</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Generate private key (K1)
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
>>>>>>> origin/updated
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

<<<<<<< HEAD
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Smartphone size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Your device MAC address will be bound to this account for security (K1 generation).
              </p>
            </div>

            <Button type="submit" fullWidth>
=======
            <Input
              label="Device MAC Address"
              type="text"
              placeholder="e.g. AA:BB:CC:DD:EE:FF"
              value={formData.macAddress}
              onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              helperText="Physical MAC address of your device for hardware binding"
              required
            />

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
              <Smartphone size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-primary/70 leading-relaxed">
                Your device MAC address will be bound to this account for security (K1 key generation).
              </p>
            </div>

            <Button type="submit" fullWidth size="lg">
>>>>>>> origin/updated
              Verify & Continue
            </Button>
          </form>
        </div>

        <button
          onClick={() => navigate(-1)}
<<<<<<< HEAD
          className="w-full text-center text-muted-foreground hover:text-foreground underline"
        >
          Back
=======
          className="group flex items-center justify-center gap-2 w-full text-white/60 font-semibold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
>>>>>>> origin/updated
        </button>
      </div>
    </div>
  );
}
