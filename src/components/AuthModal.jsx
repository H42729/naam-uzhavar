import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LOGIN_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrp76EbxgKVitgPsUozqIfTg1RY01rtH-xO9jIl_ahdYWzCJ1CubFmQtm05LBODpdqRNo5H5rY1ZgjjKTt_anPsohtKWyWGenyikvOFEL9jKjMZqKGHGtOcJTfyi93ZiVUqhGWgk0wtO9faUaMbD1jpPh5WtUo51hXvwRbyrQUTj74eNrNpEFpxOhaSrR1eNn5EX7I2ume-809p_p1KJXzdmNb_SoyS0eOmT7EGdx3u42NacsXw27F1Q';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('farmer'); // 'farmer', 'buyer', 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [identifier, setIdentifier] = useState('farmer@naamuzhavar.com');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('Farmer@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    login(selectedRole, identifier || 'farmer@naamuzhavar.com', password || 'Farmer@123');

    const userObj = {
      name: fullName || (selectedRole === 'farmer' ? 'Ravi Kumar' : selectedRole === 'buyer' ? 'FreshMart Procurement' : 'Admin Officer'),
      role: selectedRole,
      identifier: identifier || 'farmer@naamuzhavar.com',
      location: selectedRole === 'farmer' ? 'Erode, Tamil Nadu' : 'Bangalore, KA',
    };

    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(selectedRole, userObj);
      }
    }, 400);
  };

  return (
    <div className="fd-modal-backdrop" onClick={onClose}>
      <div
        className="fd-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', padding: 0, overflow: 'hidden' }}
      >
        <div className="row g-0">
          {/* Left Side: Indian Farm Sunrise Image Banner */}
          <div
            className="col-md-5 d-none d-md-flex fd-login-left-banner"
            style={{
              backgroundImage: `url(${LOGIN_HERO_IMAGE})`,
              minHeight: '520px',
              borderRadius: '22px 0 0 22px'
            }}
          >
            <div className="fd-login-left-overlay p-4">
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-tree-fill text-success fs-5"></i>
                  </div>
                  <h3 className="fd-login-brand-title mb-0">FarmDirect</h3>
                </div>
                <p className="fd-login-brand-subtitle small mb-0">
                  Connecting farmers, buyers, and technology for a sustainable agricultural ecosystem.
                </p>
              </div>

              <div className="pt-3 border-top border-white border-opacity-25 small text-white text-opacity-90">
                <p className="mb-1">✓ 100% Direct Mandi Payouts</p>
                <p className="mb-0">✓ Real-time IoT Cold-chain</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="col-md-7 p-4 p-lg-5 bg-white position-relative">
            {/* Close Button Top Right */}
            <button
              type="button"
              className="fd-close-btn position-absolute"
              style={{ top: '16px', right: '16px', zIndex: 10 }}
              onClick={onClose}
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-3">
              <h3 className="fd-login-heading fs-4 mb-1">
                {isRegisterMode ? 'Join FarmDirect Network' : 'Welcome to FarmDirect'}
              </h3>
              <p className="text-muted small mb-0">
                {isRegisterMode
                  ? 'Create your free kisan or buyer account to get started.'
                  : 'Please sign in to access your account.'}
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-3" role="status"></div>
                <h6 className="fw-bold text-dark">
                  Logging into {selectedRole === 'farmer' ? 'Farmer Dashboard' : selectedRole.toUpperCase() + ' Portal'}...
                </h6>
                <p className="text-muted small">Loading your live mandi listings and orders.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Role Selection Grid */}
                <div className="mb-3">
                  <label className="fd-form-label mb-2">SELECT YOUR ROLE</label>
                  <div className="fd-role-grid">
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'farmer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('farmer')}
                    >
                      <i className="bi bi-tree text-xl fd-role-icon"></i>
                      <span className="fd-role-text">Farmer / FPO</span>
                    </button>

                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'buyer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('buyer')}
                    >
                      <i className="bi bi-cart3 text-xl fd-role-icon"></i>
                      <span className="fd-role-text">Buyer</span>
                    </button>

                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      <i className="bi bi-shield-lock text-xl fd-role-icon"></i>
                      <span className="fd-role-text">Admin</span>
                    </button>
                  </div>
                </div>

                {isRegisterMode && (
                  <div className="mb-2">
                    <label className="fd-form-label" htmlFor="modalFullName">
                      Full Name / Farm or FPO Name
                    </label>
                    <div className="position-relative">
                      <i className="bi bi-person position-absolute text-muted" style={{ left: '10px', top: '10px', fontSize: '16px' }}></i>
                      <input
                        type="text"
                        id="modalFullName"
                        required
                        className="form-control fd-login-input py-2"
                        placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patel / Sahyadri FPO' : 'e.g. Fresh Mart'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile / Email Input */}
                <div className="mb-2">
                  <label className="fd-form-label" htmlFor="modalIdentifier">
                    Mobile Number or Email
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-person-badge position-absolute text-muted" style={{ left: '10px', top: '10px', fontSize: '16px' }}></i>
                    <input
                      type="text"
                      id="modalIdentifier"
                      required
                      className="form-control fd-login-input py-2"
                      placeholder="Enter mobile (+91) or email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="fd-form-label mb-0" htmlFor="modalPassword">
                      Password
                    </label>
                    {!isRegisterMode && (
                      <a
                        href="#forgot"
                        className="small text-decoration-none fw-semibold"
                        style={{ color: '#004c22', fontSize: '0.8rem' }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('OTP password reset link sent to your registered mobile number!');
                        }}
                      >
                        Forgot Password?
                      </a>
                    )}
                  </div>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute text-muted" style={{ left: '10px', top: '10px', fontSize: '16px' }}></i>
                    <input
                      type="password"
                      id="modalPassword"
                      required
                      className="form-control fd-login-input py-2"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="modalRememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted cursor-pointer" htmlFor="modalRememberMe">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column gap-2">
                  <button
                    type="submit"
                    className="btn fd-btn-primary-action w-100 py-2 fw-bold"
                  >
                    {isRegisterMode ? 'Create Account & Open Dashboard' : `Login as ${selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'buyer' ? 'Buyer' : 'Admin'}`}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 py-2 fw-semibold btn-sm"
                    style={{ borderRadius: '8px' }}
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                  >
                    {isRegisterMode ? 'Already have an account? Sign In' : 'Create New Account'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-3 text-center">
              <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                By logging in, you agree to our{' '}
                <a href="#terms" className="text-decoration-none fw-semibold" style={{ color: '#004c22' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-decoration-none fw-semibold" style={{ color: '#004c22' }}>
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
