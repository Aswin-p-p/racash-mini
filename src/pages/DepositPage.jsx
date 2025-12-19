import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';
import { ArrowDownCircle, DollarSign } from 'lucide-react';
import './TransactionPages.css';

const DepositPage = () => {
  const { user } = useAuth();
  const [depositMethods, setDepositMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    method_id: '',
  });
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    loadDepositMethods();
  }, []);

  const loadDepositMethods = async () => {
    try {
      const response = await transactionAPI.getDepositMethods();
      const data = Array.isArray(response.data) ? response.data : [];
      setDepositMethods(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, method_id: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load deposit methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await transactionAPI.initiateDeposit({
        amount: formData.amount,
        currency: formData.currency,
        deposit_method: formData.method_id,
      });

      setRedirectUrl(response.data.redirect_url);
      // Redirect to payment gateway
      window.location.href = response.data.redirect_url;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initiate deposit');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show message if no deposit methods available
  if (depositMethods.length === 0) {
    return (
      <div className="transaction-page">
        <Navbar />
        <div className="transaction-container">
          <div className="transaction-header fade-in">
            <div className="header-icon deposit">
              <ArrowDownCircle size={32} />
            </div>
            <h1>Deposit Funds</h1>
            <p className="text-muted">Add money to your R-Cash wallet</p>
          </div>
          <div className="transaction-form-card glass-card fade-in">
            <div className="alert alert-error">
              No deposit methods available. Please contact support or add deposit methods in the admin panel.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-page">
      <Navbar />
      
      <div className="transaction-container">
        <div className="transaction-header fade-in">
          <div className="header-icon deposit">
            <ArrowDownCircle size={32} />
          </div>
          <h1>Deposit Funds</h1>
          <p className="text-muted">Add money to your R-Cash wallet</p>
        </div>

        <div className="transaction-form-card glass-card fade-in">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <div className="input-with-icon">
                <DollarSign size={20} />
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
              >
                <option value="USD">USD - US Dollar</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="ETB">ETB - Ethiopian Birr</option>
                <option value="SOS">SOS - Somali Shilling</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="method">Payment Method</label>
              <select
                id="method"
                value={formData.method_id}
                onChange={(e) => setFormData({ ...formData, method_id: e.target.value })}
                required
              >
                {depositMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownCircle size={20} />
                  Proceed to Payment
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
