import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

/**
 * RegisterRoleSelectPage
 * Landing hub for registration, enabling users to choose whether they want to
 * register as a Farmer, Consumer/Buyer, or Driver.
 */
export default function RegisterRoleSelectPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const registrationRoles = [
    {
      id: 'farmer',
      title: t('farmerRoleTitle'),
      subtitle: t('farmerRoleSubtitle'),
      icon: 'bi-flower1',
      badge: t('farmer'),
      color: '#198754',
      bgLight: '#e8f5e9',
      borderLight: '#c8e6c9',
      route: '/register/farmer',
      fieldsHint: 'Aadhaar, Patta, Land Area & TN Taluk',
    },
    {
      id: 'consumer',
      title: t('buyerRoleTitle'),
      subtitle: t('buyerRoleSubtitle'),
      icon: 'bi-cart3',
      badge: t('buyer'),
      color: '#0d6efd',
      bgLight: '#e7f1ff',
      borderLight: '#b6d4fe',
      route: '/register/consumer',
      fieldsHint: 'Business Type, GSTIN (optional) & Location',
    },
    {
      id: 'driver',
      title: t('driverRoleTitle'),
      subtitle: t('driverRoleSubtitle'),
      icon: 'bi-truck',
      badge: t('driver'),
      color: '#d97706',
      bgLight: '#fef3c7',
      borderLight: '#fde68a',
      route: '/register/driver',
      fieldsHint: 'Driving Licence, RC Book & Vehicle Category',
    },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar Header */}
      <header className="bg-white border-bottom py-3 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <div className="d-flex align-items-center gap-3">
            <LanguageSwitcher />
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small d-none d-sm-inline">{t('alreadyHaveAccount')}</span>
              <Link
                to="/login"
                className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
              >
                <i className="bi bi-box-arrow-in-right"></i>
                <span>{t('signIn')}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="container flex-grow-1 py-5 d-flex flex-column justify-content-center">
        <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 mb-2 fw-bold text-uppercase">
            {t('sihPortalAccess')}
          </span>
          <h1 className="fw-bold text-dark fs-2 mb-2">{t('registerAs')}</h1>
          <p className="text-muted">
            {t('selectRoleSubtitle')}
          </p>
        </div>

        {/* 3 Registration Cards */}
        <div className="row g-4 justify-content-center" style={{ maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
          {registrationRoles.map((role) => (
            <div key={role.id} className="col-12 col-md-4">
              <div
                className="bg-white rounded-4 border p-4 shadow-sm h-100 d-flex flex-column justify-content-between transition-all"
                style={{
                  cursor: 'pointer',
                  borderTop: `4px solid ${role.color}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(15, 23, 42, 0.05)';
                }}
                onClick={() => navigate(role.route)}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div
                      className="rounded-3 p-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: role.bgLight,
                        color: role.color,
                        border: `1.5px solid ${role.borderLight}`,
                      }}
                    >
                      <i className={`bi ${role.icon} fs-4`}></i>
                    </div>
                    <span className="badge bg-light text-muted border fw-semibold small">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="fw-bold text-dark fs-5 mb-2">{role.title}</h3>
                  <p className="text-muted small mb-3">{role.subtitle}</p>

                  <div className="bg-light p-2 rounded-2 border small text-muted mb-4" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-check text-success me-1"></i>
                    <strong>Key Details:</strong> {role.fieldsHint}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: role.color,
                      color: '#ffffff',
                      border: 'none',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(role.route);
                    }}
                  >
                    <span>Register as {role.id === 'consumer' ? 'Buyer / Consumer' : role.id.charAt(0).toUpperCase() + role.id.slice(1)}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Existing User Assistance Card */}
        <div className="mt-5 p-3 bg-white rounded-3 border text-center shadow-xs" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 small text-muted">
            <span className="fw-bold text-dark">
              <i className="bi bi-info-circle-fill text-success me-1"></i> Looking for Existing Login?
            </span>
            <span>Switch to the login portal anytime:</span>
            <Link to="/login" className="fw-bold text-success text-decoration-none">
              Role Login Portal →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
