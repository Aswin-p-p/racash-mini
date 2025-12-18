import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, FileText, ArrowUpCircle, ArrowDownCircle, Shield, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">R</div>
          <span>R-Cash</span>
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/transactions" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FileText size={20} />
            <span>Transactions</span>
          </Link>
          <Link to="/deposit" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <ArrowDownCircle size={20} />
            <span>Deposit</span>
          </Link>
          <Link to="/withdraw" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <ArrowUpCircle size={20} />
            <span>Withdraw</span>
          </Link>
          <Link to="/kyc" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <Shield size={20} />
            <span>KYC</span>
          </Link>
        </div>

        <div className="navbar-actions">
          <div className="user-menu">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              {user?.is_kyc_verified && (
                <span className="badge badge-success">Verified</span>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={20} />
          </button>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
