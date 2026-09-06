/**
 * Buyer Sidebar Navigation
 * Strict 5+1 item buyer-first hierarchy:
 * 1. Home (/buyer/dashboard)
 * 2. Marketplace (/buyer/browse)
 * 3. My Requests (/buyer/requests)
 * 4. My Orders (/buyer/orders)
 * 5. Bulk Requirements (/buyer/requirement)
 * 6. Messages (/buyer/messages)
 * + Profile, Settings modal, and Logout
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyer } from '../context/BuyerContext';
import { useLanguage } from '../context/LanguageContext';

export default function BuyerSidebar({ isOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const {
    products,
    pendingRequestsCount,
    activeOrdersCount,
    activeRequirementsCount
  } = useBuyer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const menuItems = [
    {
      to: '/buyer/dashboard',
      key: 'navHome',
      icon: 'bi-house-door-fill',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      exact: true
    },
    {
      to: '/buyer/browse',
      key: 'marketplace',
      icon: 'bi-shop',
      label: t('marketplace'),
      badge: `${products?.length || 0}`,
      badgeClass: 'bg-primary'
    },
    {
      to: '/buyer/requests',
      key: 'myRequests',
      icon: 'bi-inbox-fill',
      label: t('myRequests'),
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : null,
      badgeClass: 'bg-warning text-dark'
    },
    {
      to: '/buyer/orders',
      key: 'myOrders',
      icon: 'bi-box-seam-fill',
      label: t('myOrders'),
      badge: activeOrdersCount > 0 ? `${activeOrdersCount}` : null,
      badgeClass: 'bg-success'
    },
    {
      to: '/buyer/requirement',
      key: 'bulkRequirements',
      icon: 'bi-collection-fill',
      label: t('bulkRequirements'),
      badge: activeRequirementsCount > 0 ? `${activeRequirementsCount}` : null,
      badgeClass: 'bg-secondary'
    }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onCloseMobile) onCloseMobile();
    logout();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="bd-sidebar-overlay d-lg-none"
          onClick={onCloseMobile}
          aria-hidden="true"
        ></div>
      )}

      <aside className={`bd-sidebar ${isOpen ? 'open' : ''}`}>
        {/* 1. Brand Logo Header */}
        <div className="bd-sidebar-header">
          <NavLink
            to="/buyer/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none"
            onClick={handleNavClick}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
          </NavLink>
        </div>

        {/* 2. Buyer Profile Summary Chip */}
        <div className="p-2.5 mx-2 my-2 rounded-3 bg-light border d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold shadow-2xs flex-shrink-0"
            style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}
          >
            <i className="bi bi-building"></i>
          </div>
          <div className="overflow-hidden">
            <strong className="text-dark small d-block text-truncate mb-0">
              {user?.name || 'FreshMart Procurement'}
            </strong>
            <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.72rem' }}>
              ✓ Verified Buyer • Dindigul
            </span>
          </div>
        </div>

        {/* 3. Main Navigation Items */}
        <nav className="bd-sidebar-nav flex-grow-1">
          <ul className="bd-nav-list list-unstyled p-0 m-0 d-flex flex-column gap-1">
            {menuItems.map((item) => (
              <li key={item.to} className="p-0 m-0">
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => `bd-nav-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <i className={`bi ${item.icon} bd-nav-icon fs-5`}></i>
                  <span className="bd-nav-text flex-grow-1">{item.label}</span>
                  {item.badge && (
                    <span className={`badge rounded-pill small ms-2 ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 4. Bottom Controls: Settings & Logout */}
        <div className="p-2.5 border-top mt-auto">
          <button
            type="button"
            className="btn btn-light w-100 text-start text-dark small fw-semibold d-flex align-items-center gap-2 py-2 mb-2 rounded-3 border"
            onClick={() => setShowSettingsModal(true)}
          >
            <i className="bi bi-gear-fill text-secondary"></i>
            <span>{t('settingsTitle', 'Settings')}</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-danger w-100 text-start small fw-bold d-flex align-items-center gap-2 py-2 rounded-3"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal (Portal to document.body) */}
      {showSettingsModal &&
        createPortal(
          <div
            className="position-fixed inset-0 bg-dark bg-opacity-60 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
            style={{ zIndex: 1250, top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-4 p-4 max-w-md w-100 shadow-xl" style={{ maxWidth: '420px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <strong className="fs-6 text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-gear-fill text-primary"></i>
                  {t('settingsTitle', 'Settings')}
                </strong>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setShowSettingsModal(false)}
                ></button>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  {t('displayLanguage', 'Display Language')}
                </label>
                <div className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <span className="small text-muted">
                    {language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                  </span>
                  <span className="badge bg-primary text-white">Active</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="buyerSmsAlerts"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-dark" htmlFor="buyerSmsAlerts">
                    {t('smsAlertsLabel', 'SMS & WhatsApp Sourcing Alerts')}
                  </label>
                </div>
                <span className="text-muted small d-block" style={{ fontSize: '0.74rem' }}>
                  Receive instant notifications when farmers accept requests or dispatch consignments.
                </span>
              </div>

              <div className="d-flex justify-content-end pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-primary btn-sm rounded-pill px-4 fw-bold"
                  onClick={() => setShowSettingsModal(false)}
                >
                  {t('done', 'Done')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
