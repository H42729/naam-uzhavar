import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const LOGIN_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrp76EbxgKVitgPsUozqIfTg1RY01rtH-xO9jIl_ahdYWzCJ1CubFmQtm05LBODpdqRNo5H5rY1ZgjjKTt_anPsohtKWyWGenyikvOFEL9jKjMZqKGHGtOcJTfyi93ZiVUqhGWgk0wtO9faUaMbD1jpPh5WtUo51hXvwRbyrQUTj74eNrNpEFpxOhaSrR1eNn5EX7I2ume-809p_p1KJXzdmNb_SoyS0eOmT7EGdx3u42NacsXw27F1Q';

export default function LoginPage({ onBackToHome, onLoginSuccess, initialMode = 'login' }) {
  const { login } = useAuth();
  const { t } = useLanguage();
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
        {/* Back to Home & Language Switcher */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Mobile View: 32px Circular Arrow Button */}
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle d-flex d-sm-none align-items-center justify-content-center p-0 transition-all"
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              fontSize: '0.85rem'
            }}
            onClick={onBackToHome}
            title={t('backToHome')}
            aria-label={t('backToHome')}
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          {/* Tablet & Desktop View: Pill with Icon and Text */}
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill fw-bold d-none d-sm-inline-flex align-items-center gap-1.5 transition-all text-nowrap"
            style={{
              padding: '4px 14px',
              fontSize: '0.82rem',
              height: '32px',
              minHeight: '32px',
              lineHeight: 1
            }}
            onClick={onBackToHome}
            title={t('backToHome')}
          >
            <i className="bi bi-arrow-left"></i>
            <span>{t('backToHome')}</span>
          </button>
          <LanguageSwitcher />
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
                  Logging into {selectedRole === 'farmer' ? t('farmer') : selectedRole === 'buyer' ? t('buyer') : t('admin')}...
                </h5>
                <p className="text-muted small">Verifying credentials and loading your crop telemetry.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Role Selection (3 Cards: Farmer/FPO, Buyer, Admin) */}
                <div className="mb-4">
                  <label className="fd-form-label mb-2">{t('selectRoleTitle')}</label>
                  <div className="fd-role-grid">
                    {/* Farmer / FPO Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'farmer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('farmer')}
                    >
                      <i className="bi bi-tree text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">{t('farmer')}</span>
                    </button>

                    {/* Buyer Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'buyer' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('buyer')}
                    >
                      <i className="bi bi-cart3 text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">{t('buyer')}</span>
                    </button>

                    {/* Admin Card */}
                    <button
                      type="button"
                      className={`fd-role-card ${selectedRole === 'admin' ? 'active' : ''}`}
                      onClick={() => setSelectedRole('admin')}
                    >
                      <i className="bi bi-shield-lock text-2xl fd-role-icon"></i>
                      <span className="fd-role-text">{t('admin')}</span>
                    </button>
                  </div>
                </div>

                {/* Full Name / Farm Name (If Register Mode) */}
                {isRegisterMode && (
                  <div className="mb-3">
                    <label className="fd-form-label" htmlFor="fullName">
                      {selectedRole === 'farmer' ? t('farmerFullName') : t('fullName', 'Full Name')}
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
                    {t('emailUsername')}
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
                      {t('passwordLabel')}
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
                    {t('rememberMe')}
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-column gap-2">
                  <button
                    type="submit"
                    className="btn fd-btn-primary-action w-100 py-2 fw-bold"
                  >
                    {isRegisterMode ? t('createAccount', 'Create Account') : `${t('signIn')} (${selectedRole === 'farmer' ? t('farmer') : selectedRole === 'buyer' ? t('buyer') : t('admin')})`}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                    style={{ borderRadius: '8px' }}
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                  >
                    {isRegisterMode ? `${t('alreadyHaveAccount')} ${t('signIn')}` : `${t('registerAs')} (${selectedRole === 'farmer' ? t('farmer') : selectedRole === 'buyer' ? t('buyer') : t('admin')})`}
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
