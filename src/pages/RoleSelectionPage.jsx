import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const roles = [
    {
      id: 'farmer',
      title: t('farmerRoleTitle'),
      subtitle: t('farmerRoleSubtitle'),
      icon: 'bi-flower1',
      badge: t('mostPopular'),
      color: '#198754',
      bgLight: '#e8f5e9',
      borderLight: '#c8e6c9',
      route: '/login/farmer',
      demoEmail: 'farmer@naamuzhavar.com',
      buttonText: t('loginAsFarmer')
    },
    {
      id: 'buyer',
      title: t('buyerRoleTitle'),
      subtitle: t('buyerRoleSubtitle'),
      icon: 'bi-cart3',
      badge: t('b2bRetail'),
      color: '#0d6efd',
      bgLight: '#e7f1ff',
      borderLight: '#b6d4fe',
      route: '/login/buyer',
      demoEmail: 'buyer@naamuzhavar.com',
      buttonText: t('loginAsBuyer')
    },
    {
      id: 'driver',
      title: t('driverRoleTitle'),
      subtitle: t('driverRoleSubtitle'),
      icon: 'bi-truck',
      badge: t('logisticsFleet'),
      color: '#d97706',
      bgLight: '#fef3c7',
      borderLight: '#fde68a',
      route: '/login/driver',
      demoEmail: 'driver@naamuzhavar.com',
      buttonText: t('loginAsDriver')
    },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar Bar */}
      <header className="bg-white border-bottom py-2.5 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              className="h-8 sm:h-10 w-auto max-w-[125px] sm:max-w-none object-contain"
              style={{ maxHeight: '38px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div className="d-flex align-items-center gap-2 gap-sm-3 flex-shrink-0">
            <LanguageSwitcher />
            {/* Mobile View: Clean 32px Circular Arrow Button */}
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
              onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
              title={t('backToHome')}
            >
              <i className="bi bi-arrow-left"></i>
              <span>{t('backToHome')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="container flex-grow-1 py-5 d-flex flex-column justify-content-center">
        <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 mb-2 fw-bold text-uppercase">
            {t('sihPortalAccess')}
          </span>
          <h1 className="fw-bold text-dark fs-2 mb-2">{t('selectRoleTitle')}</h1>
          <p className="text-muted">
            {t('selectRoleSubtitle')}
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="row g-4 justify-content-center" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          {roles.map((role) => (
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
                  <p className="text-muted small mb-4">{role.subtitle}</p>
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
                    <span>{role.buttonText}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <div className="text-center mt-2" style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {t('demoLabel')} <code>{role.demoEmail}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
