import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import { ActivationStart } from './screens/ActivationStart';
import { OfficerVerify } from './screens/OfficerVerify';
import { BiometricEnrollment } from './screens/BiometricEnrollment';
import { CreatePassword } from './screens/CreatePassword';
import { ActivationSuccess } from './screens/ActivationSuccess';
import { Login } from './screens/Login';
import { Dashboard } from './screens/Dashboard';
import { SendMoney } from './screens/SendMoney';
import { TransactionProcessing } from './screens/TransactionProcessing';
import { TransactionResult } from './screens/TransactionResult';
import { TransactionHistory } from './screens/TransactionHistory';
import { AdditionalFeatures } from './screens/AdditionalFeatures';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ActivationStart />} />
        <Route path="/officer-verify" element={<OfficerVerify />} />
        <Route path="/biometric-enrollment" element={<BiometricEnrollment />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/activation-success" element={<ActivationSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send-money" element={<SendMoney />} />
        <Route path="/transaction-processing" element={<TransactionProcessing />} />
        <Route path="/transaction-result" element={<TransactionResult />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/features" element={<AdditionalFeatures />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
