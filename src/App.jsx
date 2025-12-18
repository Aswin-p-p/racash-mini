import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import KYCPage from './pages/KYCPage';
import TransactionsPage from './pages/TransactionsPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import MiniPayLanding from './pages/MiniPayLanding';
import { isMiniPay } from './utils/minipay';
import './index.css';

function App() {
  const inMiniPay = isMiniPay();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* MiniPay uses silent auth, browser uses traditional login */}
          <Route path="/login" element={inMiniPay ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={inMiniPay ? <Navigate to="/" replace /> : <RegisterPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <KYCPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/withdraw"
            element={
              <ProtectedRoute requireKYC>
                <WithdrawPage />
              </ProtectedRoute>
            }
          />
          
          {/* Root route: MiniPay shows landing, browser redirects to dashboard */}
          <Route path="/" element={inMiniPay ? <MiniPayLanding /> : <Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
