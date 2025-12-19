import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Shield, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { formatWalletAddress, getMiniPayBalance } from '../utils/minipay';
import './Dashboard.css';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [miniPayBalance, setMiniPayBalance] = useState('0.00'); // Default to 0.00 so card shows
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Use separate effect to fetch balance
  useEffect(() => {
    if (user?.wallet_address || user?.username?.startsWith('0x')) {
        const fetchBalance = async () => {
            setIsBalanceLoading(true);
            const address = user?.wallet_address || user?.username;
            try {
                const bal = await getMiniPayBalance(address);
                setMiniPayBalance(bal);
            } catch (e) {
                console.error("Balance fetch failed", e);
            } finally {
                setIsBalanceLoading(false);
            }
        };
        fetchBalance();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const wallets = user?.wallets || [];
  
  // Format username if it's a wallet address
  const displayName = user?.username?.startsWith('0x') 
    ? formatWalletAddress(user.username)
    : user?.username;

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header fade-in">
          <div>
            <h1>Welcome back, {displayName}!</h1>
            <p className="text-muted">Manage your finances with R-Cash</p>
          </div>
          <div className="kyc-status">{user?.is_kyc_verified ? (
              <div className="badge badge-success">
                <CheckCircle size={16} />
                KYC Verified
              </div>
            ) : (
              <div className="badge badge-warning">
                <Clock size={16} />
                KYC Pending
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions fade-in">
          <Link to="/deposit" className="action-card">
            <div className="action-icon deposit">
              <ArrowDownCircle size={24} />
            </div>
            <h3>Deposit</h3>
            <p>Add funds to your wallet</p>
          </Link>

          <Link to="/withdraw" className="action-card">
            <div className="action-icon withdraw">
              <ArrowUpCircle size={24} />
            </div>
            <h3>Withdraw</h3>
            <p>Send money to your account</p>
          </Link>

          <Link to="/kyc" className="action-card">
            <div className="action-icon kyc">
              <Shield size={24} />
            </div>
            <h3>KYC</h3>
            <p>Verify your identity</p>
          </Link>
        </div>

        <div className="wallets-section">
          <h2>Your Wallets</h2>
          <div className="wallets-grid fade-in">
            {/* MiniPay Wallet Card - Always Show */}
            <div className="wallet-card minipay-card">
                <div className="wallet-header">
                <div className="wallet-icon">
                    <Wallet size={24} />
                </div>
                <span className="wallet-currency">MiniPay (cUSD)</span>
                </div>
                <div className="wallet-balance">
                {isBalanceLoading ? "..." : formatCurrency(miniPayBalance, 'USD')}
                </div>
                <div className="wallet-footer">
                <span className="text-muted">In Your Pocket</span>
                </div>
            </div>

            {wallets.length > 0 ? (
              wallets.map((wallet) => (
                <div key={wallet.id} className="wallet-card glass-card">
                  <div className="wallet-header">
                    <div className="wallet-icon">
                      <Wallet size={24} />
                    </div>
                    <span className="wallet-currency">{wallet.currency}</span>
                  </div>
                  <div className="wallet-balance">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </div>
                  <div className="wallet-footer">
                    <span className="text-muted">Available Balance</span>
                  </div>
                </div>
              ))
            ) : (
              !miniPayBalance && (
                  <div className="empty-state">
                    <Wallet size={48} />
                    <p>No wallets found</p>
                  </div>
              )
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card glass-card">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{user?.phone_number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Country</span>
                <span className="info-value">{user?.country}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {new Date(user?.date_joined).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
