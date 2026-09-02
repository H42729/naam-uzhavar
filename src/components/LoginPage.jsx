import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LOGIN_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrp76EbxgKVitgPsUozqIfTg1RY01rtH-xO9jIl_ahdYWzCJ1CubFmQtm05LBODpdqRNo5H5rY1ZgjjKTt_anPsohtKWyWGenyikvOFEL9jKjMZqKGHGtOcJTfyi93ZiVUqhGWgk0wtO9faUaMbD1jpPh5WtUo51hXvwRbyrQUTj74eNrNpEFpxOhaSrR1eNn5EX7I2ume-809p_p1KJXzdmNb_SoyS0eOmT7EGdx3u42NacsXw27F1Q';

export default function LoginPage({ onBackToHome, onLoginSuccess, initialMode = 'login' }) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('farmer'); // 'farmer', 'buyer', 'admin'
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [identifier, setIdentifier] = useState('farmer@naamuzhavar.com');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('Farmer@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    login(selectedRole, identifier || 'farmer@naamuzhavar.com', password || 'Farmer@123');

    const userObj = {
      name: fullName || (selectedRole === 'farmer' ? 'Ravi Kumar' : selectedRole === 'buyer' ? 'FreshMart Procurement' : 'Admin Officer'),
      role: selectedRole,
      identifier: identifier || 'farmer@naamuzhavar.com',
      location: selectedRole === 'farmer' ? 'Erode, Tamil Nadu' : 'Chennai, Tamil Nadu',
    };

    setTimeout(() => {
      setSubmitted(false);
      if (onLoginSuccess) {
        onLoginSuccess(selectedRole, userObj);
      } else {
        onBackToHome();
      }
    }, 400);
  };

  return (
    <div className="fd-login-page-wrapper">
      <div className="fd-wrapper py-4 py-md-5">
        {/* Back to Home button */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 rounded-pill px-3"
            onClick={onBackToHome}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to FarmDirect Home</span>
          </button>
        </div>

        {/* Main 2-Column Split Card */}
        <main className="fd-login-card-container">
          {/* Left Side: Farm Sunrise Hero Image & Brand Pitch */}
          <div
            className="fd-login-left-banner"
            style={{ backgroundImage: `url(${LOGIN_HERO_IMAGE})` }}
          >
            <div className="fd-login-left-overlay">
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-tree-fill text-success fs-5"></i>
                  </div>
                  <h2 className="fd-login-brand-title mb-0">FarmDirect</h2>
                </div>
                <p className="fd-login-brand-subtitle">
                  Connecting farmers, buyers, and technology for a sustainable agricultural ecosystem.
                </p>
              </div>

              <div className="d-flex gap-3 pt-3 border-top border-white border-opacity-25 small text-white text-opacity-90">
                <span>🛡️ Zero Middleman Commission</span>
                <span>•</span>
                <span>⚡ Same-Day Mandi Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Side: Login & Registration Form */}
          <div className="fd-login-right-form">
            {/* Header */}
            <div className="mb-4 text-center text-md-start">
              <h1 className="fd-login-heading">
                {isRegisterMode ? 'Join FarmDirect Network' : 'Welcome to FarmDirect'}
              </h1>
              <p className="text-muted small mb-0">
                {isRegisterMode
                  ? 'Create your free kisan or buyer account to get started.'
                  : 'Please sign in to access your farm direct dashboard.'}
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <h5 className="fw-bold text-dark">
                  Logging into {selectedRole === 'farmer' ? 'Farmer Dashboard' : selectedRole.toUpperCase() + ' Portal'}...
                </h5>
                <p className="text-muted small">Verifying Kisan credentials and loading your crop telemetry.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Role Selection (3 Cards: Farmer/FPO, Buyer, Admin) */}
                <div className="mb-4">
                  <label className="fd-form-label mb-2">SELECT YOUR ROLE</label>
                  <div className="fd-role-grid">
                    {/* Farmer / FPO Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'farmer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('farmer')}
                    >
                      <i className="bi bi-tree text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">Farmer / FPO</span>
                    </button>

                    {/* Buyer Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'buyer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('buyer')}
                    >
                      <i className="bi bi-cart3 text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">Buyer</span>
                    </button>

                    {/* Admin Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      <i className="bi bi-shield-lock text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">Admin</span>
                    </button>
                  </div>
                </div>

                {/* Full Name / Farm Name (If Register Mode) */}
                {isRegisterMode && (
                  <div className="mb-3">
                    <label className="fd-form-label" htmlFor="fullName">
                      {selectedRole === 'farmer' ? 'Full Name / Farm or FPO Name' : 'Full Name / Business Name'}
                    </label>
                    <div className="position-relative">
                      <i className="bi bi-person position-absolute text-muted" style={{ left: '12px', top: '12px', fontSize: '18px' }}></i>
                      <input
                        type="text"
                        id="fullName"
                        required
                        className="form-control fd-login-input"
                        placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patel / Sahyadri FPO' : 'e.g. Fresh Supermart / Amit'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile / Email Input */}
                <div className="mb-3">
                  <label className="fd-form-label" htmlFor="identifier">
                    Mobile Number or Email
                  </label>
                  <div className="position-relative">
                    <i className="bi bi-person-badge position-absolute text-muted" style={{ left: '12px', top: '12px', fontSize: '18px' }}></i>
                    <input
                      type="text"
                      id="identifier"
                      required
                      className="form-control fd-login-input"
                      placeholder={selectedRole === 'farmer' ? 'Enter 10-digit mobile (+91) or email' : 'Enter mobile or business email'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="fd-form-label mb-0" htmlFor="password">
                      Password
                    </label>
                    {!isRegisterMode && (
                      <a
                        href="#forgot"
                        className="small text-decoration-none fw-semibold"
                        style={{ color: '#004c22' }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('OTP reset link has been sent to your registered mobile number!');
                        }}
                      >
                        Forgot Password?
                      </a>
                    )}
                  </div>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute text-muted" style={{ left: '12px', top: '12px', fontSize: '18px' }}></i>
                    <input
                      type="password"
                      id="password"
                      required
                      className="form-control fd-login-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted cursor-pointer" htmlFor="rememberMe">
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
                    className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                    style={{ borderRadius: '8px' }}
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                  >
                    {isRegisterMode ? 'Already have an account? Sign In' : 'Create New Account'}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Terms */}
            <div className="mt-4 text-center">
              <p className="small text-muted mb-0">
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
        </main>
      </div>
    </div>
  );
}
