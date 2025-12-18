import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { kycAPI } from '../services/api';
import { Upload, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import './KYCPage.css';

const KYCPage = () => {
  const { user, refreshUser } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_document: null,
    selfie: null,
  });
  const [previews, setPreviews] = useState({
    id_document: null,
    selfie: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await kycAPI.getStatus();
      setKycStatus(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to load KYC status:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      setPreviews({ ...previews, [field]: URL.createObjectURL(file) });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_document || !formData.selfie) {
      setError('Please upload both ID document and selfie');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('id_document', formData.id_document);
      submitData.append('selfie', formData.selfie);

      await kycAPI.submit(submitData);
      setSuccess('KYC documents submitted successfully!');
      await loadKYCStatus();
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit KYC documents');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading KYC status...</p>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (kycStatus?.status) {
      case 'APPROVED':
        return <CheckCircle size={48} color="var(--success)" />;
      case 'REJECTED':
        return <XCircle size={48} color="var(--error)" />;
      case 'PENDING':
        return <Clock size={48} color="var(--warning)" />;
      default:
        return <Shield size={48} color="var(--primary)" />;
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus?.status) {
      case 'APPROVED':
        return <div className="badge badge-success">Approved</div>;
      case 'REJECTED':
        return <div className="badge badge-error">Rejected</div>;
      case 'PENDING':
        return <div className="badge badge-warning">Pending Review</div>;
      default:
        return <div className="badge badge-info">Not Submitted</div>;
    }
  };

  return (
    <div className="kyc-page">
      <Navbar />
      
      <div className="kyc-container">
        <div className="kyc-header fade-in">
          <h1>KYC Verification</h1>
          <p className="text-muted">Verify your identity to unlock all features</p>
        </div>

        {kycStatus && kycStatus.status !== 'NOT_SUBMITTED' ? (
          <div className="kyc-status-card glass-card fade-in">
            <div className="status-icon">{getStatusIcon()}</div>
            <h2>KYC Status</h2>
            {getStatusBadge()}
            
            {kycStatus.status === 'PENDING' && (
              <p className="status-message">
                Your documents are under review. We'll notify you once the verification is complete.
              </p>
            )}
            
            {kycStatus.status === 'APPROVED' && (
              <p className="status-message">
                Your identity has been verified! You can now access all features including withdrawals.
              </p>
            )}
            
            {kycStatus.status === 'REJECTED' && (
              <div>
                <p className="status-message">
                  Your KYC verification was rejected. Please submit new documents.
                </p>
                <button
                  onClick={() => setKycStatus(null)}
                  className="btn btn-primary mt-2"
                >
                  Submit New Documents
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="kyc-form-card glass-card fade-in">
            <h2>Submit KYC Documents</h2>
            <p className="text-muted mb-3">
              Please upload a clear photo of your ID document and a selfie
            </p>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="kyc-form">
              <div className="upload-section">
                <label className="upload-label">
                  <Upload size={24} />
                  <span>ID Document</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, 'id_document')}
                    hidden
                  />
                </label>
                {previews.id_document && (
                  <div className="preview">
                    <img src={previews.id_document} alt="ID Preview" />
                  </div>
                )}
              </div>

              <div className="upload-section">
                <label className="upload-label">
                  <Upload size={24} />
                  <span>Selfie Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'selfie')}
                    hidden
                  />
                </label>
                {previews.selfie && (
                  <div className="preview">
                    <img src={previews.selfie} alt="Selfie Preview" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={submitting || !formData.id_document || !formData.selfie}
              >
                {submitting ? (
                  <>
                    <div className="spinner-small"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Submit KYC Documents
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCPage;
