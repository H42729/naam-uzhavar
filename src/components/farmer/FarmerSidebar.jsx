/**
 * Farmer Sidebar Navigation Component
 * Supports dynamic English <-> Tamil translation via useLanguage().
 * Only renders one language at a time.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FarmerSidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { farmerProfile, stats } = useFarmer();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const navItems = [
    {
      to: '/farmer/dashboard',
      key: 'dashboard',
      icon: 'bi-grid-1x2-fill',
      exact: true
    },
    {
      to: '/farmer/harvest',
      key: 'myHarvests',
      icon: 'bi-flower2',
      badge: stats.myHarvest > 0 ? `${stats.myHarvest} ${t('active')}` : null,
      badgeClass: 'bg-success text-white'
    },
    {
      to: '/farmer/requests',
      key: 'buyerRequests',
      icon: 'bi-inbox-fill',
      badge: stats.buyerRequests > 0 ? `${stats.buyerRequests} ${t('new')}` : null,
      badgeClass: 'bg-warning text-dark'
    },
    {
      to: '/farmer/messages',
      key: 'messages',
      icon: 'bi-chat-dots-fill',
      badge: '1',
      badgeClass: 'bg-primary text-white'
    },
    {
      to: '/farmer/demand-forecast',
      key: 'demandForecast',
      icon: 'bi-graph-up-arrow'
    },
    {
      to: '/farmer/deliveries',
      key: 'deliveryStatus',
      icon: 'bi-truck',
      badge: stats.deliveries > 0 ? `${stats.deliveries} ${t('active')}` : null,
      badgeClass: 'bg-info-subtle text-info-emphasis border'
    },
    {
      to: '/farmer/profile',
      key: 'profile',
      icon: 'bi-person-badge-fill'
    }
  ];

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onCloseMobile) onCloseMobile();
    if (logout) logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1035, top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`farm-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="farm-sidebar-header">
          <div
            className="farm-brand-wrap"
            onClick={() => {
              navigate('/farmer/dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          {mobileOpen && (
            <button
              type="button"
              className="btn-close d-lg-none"
              aria-label="Close menu"
              onClick={onCloseMobile}
            ></button>
          )}
        </div>

        {/* Farmer Profile Badge Chip */}
        <NavLink
          to="/farmer/profile"
          className="farm-profile-chip"
          onClick={onCloseMobile}
          title="View Farmer Profile"
        >
          <img
            src={
              farmerProfile?.avatar ||
              user?.avatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
            }
            alt={farmerProfile?.name || 'Farmer'}
            className="farm-profile-avatar"
          />
          <div className="flex-grow-1 overflow-hidden text-start">
            <span className="farm-profile-name d-block text-truncate">
              {farmerProfile?.name || user?.name || 'Arun Kumar'}
            </span>
            <span className="text-success fw-bold d-block" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-patch-check-fill me-1"></i> {t('verifiedFarmer')}
            </span>
            <span className="farm-profile-loc">
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span>{farmerProfile?.district || 'Dindigul'}, TN</span>
            </span>
          </div>
        </NavLink>

        {/* Navigation List (Single language at a time) */}
        <nav className="farm-nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `farm-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={onCloseMobile}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="text-start flex-grow-1 line-height-1">{t(item.key)}</span>
              {item.badge && (
                <span className={`badge rounded-pill ms-auto px-2 py-1 ${item.badgeClass}`} style={{ fontSize: '0.68rem' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Settings */}
          <button
            type="button"
            className="farm-nav-link w-100 text-start border-0 bg-transparent"
            onClick={() => {
              setShowSettingsModal(true);
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <i className="bi bi-gear-fill text-muted"></i>
            <span className="text-start flex-grow-1 line-height-1">{t('settings')}</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="farm-sidebar-footer">
          <button
            type="button"
            className="farm-logout-btn"
            onClick={handleLogout}
            title="Logout from Naam Uzhavar"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal with Language Switcher */}
      {showSettingsModal && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center p-3"
          style={{ zIndex: 1200, top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-white rounded-4 p-4 max-w-md w-100 shadow-xl" style={{ maxWidth: '440px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <strong className="fs-6 text-dark">
                <i className="bi bi-gear-fill me-2 text-success"></i> {t('settingsTitle')}
              </strong>
              <button
                type="button"
                className="btn-close btn-sm"
                onClick={() => setShowSettingsModal(false)}
              ></button>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark mb-1">
                {t('displayLanguage')}
              </label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm flex-fill rounded-pill fw-bold ${
                    language === 'en' ? 'btn-success' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-fill rounded-pill fw-bold ${
                    language === 'ta' ? 'btn-success' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setLanguage('ta')}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="smsSwitchFarmer"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold" htmlFor="smsSwitchFarmer">
                  {t('instantAlerts')}
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-success btn-sm rounded-pill px-4 fw-bold"
                onClick={() => setShowSettingsModal(false)}
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
