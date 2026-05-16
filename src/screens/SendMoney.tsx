import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export function SendMoney() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverUsername: '',
    amount: '',
  });
  const [receiverFound, setReceiverFound] = useState<boolean | null>(null);

  const dailyLimit = 5000;
  const spent = 1800;
  const remaining = dailyLimit - spent;

  const handleUsernameChange = (value: string) => {
    setFormData({ ...formData, receiverUsername: value });
    if (value.length > 3) {
      setTimeout(() => setReceiverFound(true), 500);
    } else {
      setReceiverFound(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);

    if (amount > remaining) {
      alert(`Exceeds daily petty cash limit. Remaining: ৳${remaining.toFixed(2)}`);
      return;
    }

    if (formData.receiverUsername && formData.amount) {
      navigate('/transaction-processing', {
        state: {
          receiverUsername: formData.receiverUsername,
          amount,
        },
      });
    }
  };

  const amountValue = parseFloat(formData.amount) || 0;
  const exceedsLimit = amountValue > remaining;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-[#0D7C66] text-white px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white">Send Money</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Receiver's Username"
                type="text"
                placeholder="Enter bank-assigned username"
                value={formData.receiverUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                helperText="Username must be bank-assigned (not phone number)"
                required
              />
              {receiverFound && (
                <div className="mt-2 flex items-center gap-2 text-emerald-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Receiver found: Vegetable Market Vendor</span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Amount (BDT)"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                error={exceedsLimit ? `Exceeds daily petty cash limit` : undefined}
                required
                min="1"
                step="0.01"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Daily limit remaining: <span className="font-semibold text-[#0D7C66]">৳{remaining.toFixed(2)}</span>
              </div>
            </div>

            {exceedsLimit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Amount exceeds daily petty cash limit
                  </p>
                  <p className="text-xs text-red-800 mt-1">
                    Maximum allowed: ৳{remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" fullWidth disabled={exceedsLimit || !receiverFound}>
              Proceed
            </Button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Transfer Information</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Username-to-username transfer only</li>
            <li>• No phone number or bank account transfer</li>
            <li>• Biometric verification required for each transaction</li>
            <li>• Daily limit resets every 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
