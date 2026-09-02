import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      title: 'Farmer / FPO (விவசாயி)',
      subtitle: 'List crops, check AI demand forecast & receive direct UPI payouts.',
      icon: 'bi-flower1',
      badge: 'Most Popular',
      color: '#198754',
      bgLight: '#e8f5e9',
      borderLight: '#c8e6c9',
      route: '/login/farmer',
      demoEmail: 'farmer@naamuzhavar.com',
    },
    {
      id: 'buyer',
      title: 'Buyer (வாங்குவோர்)',
      subtitle: 'Procure bulk farm-fresh produce with cold-chain logistics & traceability.',
      icon: 'bi-cart3',
      badge: 'B2B & Retail',
      color: '#0d6efd',
      bgLight: '#e7f1ff',
      borderLight: '#b6d4fe',
      route: '/login/buyer',
      demoEmail: 'buyer@naamuzhavar.com',
    },
    {
      id: 'driver',
      title: 'Logistics Driver (ஓட்டுநர்)',
      subtitle: 'Manage farm-to-depot consignments, cold-chain pickups & live delivery tracking.',
      icon: 'bi-truck',
      badge: 'Logistics & Fleet',
      color: '#d97706',
      bgLight: '#fef3c7',
      borderLight: '#fde68a',
      route: '/login/driver',
      demoEmail: 'driver@naamuzhavar.com',
    },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar Bar */}
      <header className="bg-white border-bottom py-3 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Role Selection Area */}
      <main className="container flex-grow-1 py-5 d-flex flex-column justify-content-center">
        <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 mb-2 fw-bold text-uppercase">
            SIH 2026 Portal Access
          </span>
          <h1 className="fw-bold text-dark fs-2 mb-2">Select Your Role to Continue</h1>
          <p className="text-muted">
            Choose your account type to access your tailored Naam Uzhavar marketplace experience.
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
                    <span>Login as {role.id.charAt(0).toUpperCase() + role.id.slice(1)}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>

                  <div className="text-center mt-2" style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Demo: <code>{role.demoEmail}</code>
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
