import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function RoleLoginPage({ defaultRole }) {
  const { role: routeRole } = useParams();
  const currentRoleKey = (defaultRole || routeRole || 'farmer').toLowerCase();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const getRoleDisplayName = (rk) => {
    if (rk === 'farmer') return t('farmer');
    if (rk === 'buyer') return t('buyer');
    if (rk === 'driver') return t('driver');
    if (rk === 'admin') return t('admin');
    return rk;
  };

  const roleConfig = DEMO_CREDENTIALS[currentRoleKey] || DEMO_CREDENTIALS.farmer;

  // Pre-fill with demo credentials so it works instantly without typing
  const [email, setEmail] = useState(roleConfig.email);
  const [password, setPassword] = useState(roleConfig.password);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update fields when role changes
    setEmail(roleConfig.email);
    setPassword(roleConfig.password);
    setErrorMessage('');
  }, [currentRoleKey]);

  const handleAutoFill = () => {
    setEmail(roleConfig.email);
    setPassword(roleConfig.password);
    setErrorMessage('');
  };

  const handleAutoFillAndSubmit = () => {
    setEmail(roleConfig.email);
    setPassword(roleConfig.password);
    setErrorMessage('');
    executeLogin(roleConfig.email, roleConfig.password);
  };

  const executeLogin = (userEmail, userPass) => {
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = login(currentRoleKey, userEmail, userPass);
      setIsLoading(false);

      if (res.success) {
        const destRole = res.redirectedRole || currentRoleKey;
        if (destRole === 'farmer') {
          navigate('/farmer/dashboard');
        } else if (destRole === 'buyer') {
          navigate('/buyer/dashboard');
        } else if (destRole === 'driver') {
          navigate('/driver/routes');
        } else if (destRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Header */}
      <header className="bg-white border-bottom py-2.5 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center text-decoration-none flex-shrink-0">
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              className="h-8 sm:h-10 w-auto max-w-[125px] sm:max-w-none object-contain"
              style={{ maxHeight: '38px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
            <LanguageSwitcher />

            {/* Mobile View: Clean 32px Circular Arrow Button */}
            <Link
              to="/login"
              className="btn btn-outline-secondary rounded-circle d-flex d-sm-none align-items-center justify-content-center p-0 transition-all"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                fontSize: '0.85rem'
              }}
              title={t('switchRole')}
              aria-label={t('switchRole')}
            >
              <i className="bi bi-arrow-left"></i>
            </Link>

            {/* Tablet & Desktop View: Pill with Icon and Text */}
            <Link
              to="/login"
              className="btn btn-outline-secondary rounded-pill fw-bold d-none d-sm-inline-flex align-items-center gap-1.5 transition-all text-nowrap"
              style={{
                padding: '4px 14px',
                fontSize: '0.82rem',
                height: '32px',
                minHeight: '32px',
                lineHeight: 1
              }}
              title={t('switchRole')}
            >
              <i className="bi bi-arrow-left"></i>
              <span>{t('switchRole')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Canvas */}
      <main className="container flex-grow-1 py-5 d-flex align-items-center justify-content-center">
        <div
          className="bg-white rounded-4 border shadow-md overflow-hidden w-100"
          style={{ maxWidth: '480px' }}
        >
          {/* Header Banner */}
          <div
            className="p-4 text-white"
            style={{
              backgroundColor:
                currentRoleKey === 'farmer'
                  ? '#198754'
                  : currentRoleKey === 'buyer'
                  ? '#0d6efd'
                  : currentRoleKey === 'driver'
                  ? '#d97706'
                  : '#6f42c1',
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <span className="badge bg-white text-dark fw-bold text-uppercase px-2 py-1">
                {getRoleDisplayName(currentRoleKey)} {t('login')}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-light fw-bold text-dark rounded-pill px-3 shadow-xs"
                onClick={handleAutoFill}
                title="Reset to demo credentials"
              >
                ⚡ {t('resetDemoInfo')}
              </button>
            </div>

            <h2 className="fs-4 fw-bold mt-3 mb-1">
              {t('welcomeBackRole')}, {getRoleDisplayName(currentRoleKey)}
            </h2>
            <p className="small mb-0 text-white-50">
              {t('signInPrompt')}
            </p>
          </div>

          {/* Form */}
          <div className="p-4">
            {errorMessage && (
              <div className="alert alert-danger py-3 px-3 small rounded-3 mb-3">
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-exclamation-triangle-fill fs-5 mt-1 text-danger"></i>
                  <div>
                    <span style={{ whiteSpace: 'pre-line' }}>{errorMessage}</span>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger fw-bold"
                        onClick={handleAutoFillAndSubmit}
                      >
                        ⚡ 1-Click Login as {getRoleDisplayName(currentRoleKey)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase mb-1">
                  {t('emailUsername')}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    required
                    className="form-control py-2"
                    placeholder={`e.g. ${roleConfig.email} or ${currentRoleKey}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-text text-muted" style={{ fontSize: '0.72rem' }}>
                  {t('accepted', 'Accepted:')} <code>{roleConfig.email}</code> or <code>{currentRoleKey}</code>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-muted text-uppercase mb-0">
                    {t('passwordLabel')}
                  </label>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    {t('demoLabel')} <code>{roleConfig.password}</code>
                  </span>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    required
                    className="form-control py-2"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-text text-muted" style={{ fontSize: '0.72rem' }}>
                  {t('accepted', 'Accepted:')} <code>{roleConfig.password}</code>, <code>{roleConfig.password.toLowerCase()}</code>, or <code>123456</code>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    defaultChecked
                  />
                  <label className="form-check-label small text-muted" htmlFor="rememberMe">
                    {t('rememberMe')}
                  </label>
                </div>
                <span className="small text-muted">SIH 2026 Demo Sandbox</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn w-100 py-2 fw-bold rounded-3 text-white shadow-sm d-flex align-items-center justify-content-center gap-2 mb-2"
                style={{
                  backgroundColor:
                    currentRoleKey === 'farmer'
                      ? '#198754'
                      : currentRoleKey === 'buyer'
                      ? '#0d6efd'
                      : currentRoleKey === 'driver'
                      ? '#d97706'
                      : '#6f42c1',
                  border: 'none',
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    <span>{t('authenticating')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('signIn')} ({getRoleDisplayName(currentRoleKey)})</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              {/* 1-Click Instant Demo Login button */}
              <button
                type="button"
                className={`btn ${
                  currentRoleKey === 'buyer'
                    ? 'btn-outline-primary'
                    : currentRoleKey === 'driver'
                    ? 'btn-outline-warning text-dark'
                    : currentRoleKey === 'admin'
                    ? 'btn-outline-secondary'
                    : 'btn-outline-success'
                } w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2`}
                onClick={handleAutoFillAndSubmit}
              >
                <i className="bi bi-lightning-charge-fill text-warning"></i>
                <span>⚡ {t('instantOneClickLogin')} ({getRoleDisplayName(currentRoleKey)})</span>
              </button>
            </form>

            {/* Link to Registration */}
            <div className="mt-3 text-center">
              <span className="small text-muted">{t('dontHaveAccount')} </span>
              <Link
                to={
                  currentRoleKey === 'buyer'
                    ? '/register/consumer'
                    : currentRoleKey === 'farmer'
                    ? '/register/farmer'
                    : currentRoleKey === 'driver'
                    ? '/register/driver'
                    : '/register'
                }
                className={`small fw-bold text-decoration-none ${
                  currentRoleKey === 'buyer'
                    ? 'text-primary'
                    : currentRoleKey === 'farmer'
                    ? 'text-success'
                    : 'text-dark'
                }`}
              >
                {t('registerAs')} {getRoleDisplayName(currentRoleKey)} →
              </Link>
            </div>

            <div className="mt-3 pt-3 border-top text-center">
              <div className="small text-muted mb-2">{t('needAnotherRole')}</div>
              <div className="btn-group btn-group-sm w-100">
                <Link
                  to="/login/farmer"
                  className={`btn ${currentRoleKey === 'farmer' ? 'btn-success' : 'btn-outline-secondary'}`}
                >
                  {t('farmer')}
                </Link>
                <Link
                  to="/login/buyer"
                  className={`btn ${currentRoleKey === 'buyer' ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {t('buyer')}
                </Link>
                <Link
                  to="/login/driver"
                  className={`btn ${currentRoleKey === 'driver' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                >
                  {t('driver')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
