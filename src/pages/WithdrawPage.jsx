import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';
import { ArrowUpCircle, DollarSign, Phone } from 'lucide-react';
import './TransactionPages.css';

const WithdrawPage = () => {
  const { user } = useAuth();
  const [payoutPartners, setPayoutPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    payout_partner: '',
    phone_number: user?.phone_number || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    loadPayoutPartners();
  }, []);

  const loadPayoutPartners = async () => {
    try {
      const response = await transactionAPI.getPayoutPartners();
      const data = Array.isArray(response.data) ? response.data : [];
      setPayoutPartners(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, payout_partner: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load payout partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWalletBalance = () => {
    const wallet = user?.wallets?.find(w => w.currency === formData.currency);
    return wallet ? parseFloat(wallet.balance) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const balance = getWalletBalance();
    if (parseFloat(formData.amount) > balance) {
      setError(`Insufficient balance. Available: ${balance} ${formData.currency}`);
      setSubmitting(false);
      return;
    }

    try {
      const response = await transactionAPI.initiateWithdrawal({
        amount: formData.amount,
        currency: formData.currency,
        partner_id: formData.payout_partner,
        phone_number: formData.phone_number,
      });

      setSuccess('Withdrawal initiated successfully!');
      setWhatsappLink(response.data.whatsapp_link);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.amount?.[0] || 'Failed to initiate withdrawal');
    } finally {
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

  return (
    <div className="transaction-page">
      <Navbar />
      
      <div className="transaction-container">
        <div className="transaction-header fade-in">
          <div className="header-icon withdraw">
            <ArrowUpCircle size={32} />
          </div>
          <h1>Withdraw Funds</h1>
          <p className="text-muted">Send money from your R-Cash wallet</p>
        </div>

        <div className="transaction-form-card glass-card fade-in">
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              {success}
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-success mt-2">
                  Verify on WhatsApp
                </a>
              )}
            </div>
          )}

          <div className="balance-info">
            <span className="text-muted">Available Balance:</span>
            <span className="balance-amount">
              {getWalletBalance().toFixed(2)} {formData.currency}
            </span>
          </div>

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
                  max={getWalletBalance()}
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
              <label htmlFor="partner">Payout Partner</label>
              <select
                id="partner"
                value={formData.payout_partner}
                onChange={(e) => setFormData({ ...formData, payout_partner: e.target.value })}
                required
              >
                {payoutPartners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} - {partner.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={20} />
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+254712345678"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="spinner-small"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpCircle size={20} />
                  Withdraw Funds
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
