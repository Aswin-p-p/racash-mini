import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isMiniPay, getWalletAddress } from '../utils/minipay';
import { Wallet, Loader } from 'lucide-react';
import './MiniPayLanding.css';

const MiniPayLanding = () => {
  const [status, setStatus] = useState('detecting'); // detecting, connecting, authenticating, error
  const [error, setError] = useState('');
  const { walletLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Start silent authentication
    authenticateWithWallet();
  }, [isAuthenticated]);

  const authenticateWithWallet = async () => {
    try {
      // Step 1: Detect MiniPay
      setStatus('detecting');
      if (!isMiniPay()) {
        setError('Please open this app in MiniPay');
        setStatus('error');
        return;
      }

      // Step 2: Connect wallet
      setStatus('connecting');
      const walletAddress = await getWalletAddress();

      if (!walletAddress) {
        setError('Failed to get wallet address');
        setStatus('error');
        return;
      }

      // Step 3: Authenticate
      setStatus('authenticating');
      await walletLogin(walletAddress);

      // Step 4: Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
      setStatus('error');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'detecting':
        return 'Detecting MiniPay...';
      case 'connecting':
        return 'Connecting to your wallet...';
      case 'authenticating':
        return 'Authenticating...';
      case 'error':
        return error;
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="minipay-landing">
      <div className="minipay-background"></div>
      
      <div className="minipay-card glass-card fade-in">
        <div className="minipay-icon">
          {status === 'error' ? (
            <div className="error-icon">⚠️</div>
          ) : (
            <Wallet size={64} />
          )}
        </div>

        <h1>R-Cash</h1>
        <p className="subtitle">Powered by MiniPay</p>

        <div className="status-container">
          {status !== 'error' && (
            <div className="spinner-large"></div>
          )}
          <p className={`status-message ${status === 'error' ? 'error' : ''}`}>
            {getStatusMessage()}
          </p>
        </div>

        {status === 'error' && (
          <button 
            onClick={authenticateWithWallet}
            className="btn btn-primary retry-btn"
          >
            Try Again
          </button>
        )}

        <div className="minipay-footer">
          <p className="text-muted">
            Secure wallet-based authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniPayLanding;
