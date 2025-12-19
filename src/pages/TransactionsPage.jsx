import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { transactionAPI } from '../services/api';
import { FileText, Filter, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getTypeColor } from '../utils/formatters';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    currency: '',
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.currency) params.currency = filters.currency;

      const response = await transactionAPI.getTransactions(params);
      const data = Array.isArray(response.data) ? response.data : [];
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="transactions-page">
      <Navbar />
      
      <div className="transactions-container">
        <div className="transactions-header fade-in">
          <div className="header-content">
            <h1>Transaction History</h1>
            <p className="text-muted">View all your deposits and withdrawals</p>
          </div>
          <div className="header-icon">
            <FileText size={32} />
          </div>
        </div>

        <div className="filters-card glass-card fade-in">
          <div className="filters-header">
            <Filter size={20} />
            <span>Filters</span>
          </div>
          <div className="filters-grid">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposits</option>
              <option value="WITHDRAWAL">Withdrawals</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>

            <select
              value={filters.currency}
              onChange={(e) => handleFilterChange('currency', e.target.value)}
            >
              <option value="">All Currencies</option>
              <option value="USD">USD</option>
              <option value="KES">KES</option>
              <option value="ETB">ETB</option>
              <option value="SOS">SOS</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="transactions-list fade-in">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card glass-card">
                <div className="transaction-icon" style={{ background: getTypeColor(transaction.transaction_type) }}>
                  {transaction.transaction_type === 'DEPOSIT' ? (
                    <ArrowDownCircle size={24} />
                  ) : (
                    <ArrowUpCircle size={24} />
                  )}
                </div>

                <div className="transaction-details">
                  <div className="transaction-main">
                    <h3>{transaction.transaction_type}</h3>
                    <span className="transaction-amount">
                      {transaction.transaction_type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                  <div className="transaction-meta">
                    <span className="text-muted">{formatDate(transaction.created_at)}</span>
                    <span className="text-muted">via {transaction.payment_method}</span>
                  </div>
                </div>

                <div className="transaction-status">
                  <span
                    className="status-badge"
                    style={{ background: `${getStatusColor(transaction.status)}20`, color: getStatusColor(transaction.status) }}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card">
            <FileText size={64} />
            <h3>No Transactions Found</h3>
            <p className="text-muted">
              {filters.type || filters.status || filters.currency
                ? 'Try adjusting your filters'
                : 'Start by making a deposit or withdrawal'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
