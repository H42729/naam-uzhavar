/**
 * Driver Dashboard Layout
 * Matches template layout, uses Driver Amber/Gold color theme,
 * and dynamically switches language between English and Tamil via useLanguage().
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DRIVER_PROFILE } from '../../data/driverData';
import LanguageSwitcher from '../LanguageSwitcher';
import '../../styles/driver-route.css';

export default function DriverLayout({
  children,
  activeDeliveryId,
  onRefresh,
  isOnline = true,
  onToggleOnline
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalOnline, setInternalOnline] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_online_status');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const isCurrentOnline = onToggleOnline ? isOnline : internalOnline;

  const handleToggleOnline = () => {
    if (onToggleOnline) {
      onToggleOnline();
    } else {
      setInternalOnline((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('naam_uzhavar_driver_online_status', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const driverName = user?.name || DRIVER_PROFILE.name || 'Murugan S.';
  const driverAvatar = user?.avatar || DRIVER_PROFILE.avatar;

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSidebarOpen(false);
    if (logout) logout();
    navigate('/login');
  };

  const navLinks = [
    {
      key: 'deliveryRequests',
      icon: 'bi-inbox-fill',
      path: '/driver/requests',
      badge: `3 ${t('new')}`,
      badgeClass: 'drv-nav-badge-amber'
    },
    {
      key: 'activeDelivery',
      icon: 'bi-geo-alt-fill',
      path: `/driver/routes/${activeDeliveryId || 'ORD-1024'}`,
      badge: activeDeliveryId || 'ORD-1024',
      badgeClass: 'drv-nav-badge-blue'
    },
    {
      key: 'deliveryHistory',
      icon: 'bi-clock-history',
      path: '/driver/history'
    },
    {
      key: 'tripSummary',
      icon: 'bi-speedometer2',
      path: '/driver/trips'
    },
    {
      key: 'profile',
      icon: 'bi-person-badge-fill',
      path: '/driver/profile'
    }
  ];

  return (
    <div className="drv-layout">
      {/* 1. TOP HEADER (Sticky) */}
      <header className="drv-header sticky-top">
        <div className="drv-header-left">
          {/* Mobile hamburger button */}
          <button
            type="button"
            className="btn btn-sm btn-light border d-lg-none d-flex align-items-center justify-content-center p-2 rounded-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle driver navigation drawer"
          >
            <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
          </button>

          {/* Brand Logo */}
          <Link to="/" className="drv-header-brand">
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
            <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill px-2 py-1 small fw-bold d-none d-sm-inline-block">
              {t('logisticsDriver')}
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          {/* Language Selector: English | தமிழ் */}
          <LanguageSwitcher className="me-1 me-sm-2" />

          {/* Online / Offline status toggle (Kept & Functional) */}
          <div
            className={`drv-online-pill ${isCurrentOnline ? '' : 'offline'}`}
            onClick={handleToggleOnline}
            title={isCurrentOnline ? 'Status: Online (Click to go offline)' : 'Status: Offline (Click to go online)'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleToggleOnline();
            }}
          >
            <span className={`drv-online-dot ${isCurrentOnline ? '' : 'offline'}`}></span>
            <span>{isCurrentOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Driver Avatar & Name */}
          <Link to="/driver/profile" className="d-flex align-items-center gap-2 ps-2 border-start text-decoration-none">
            <img
              src={driverAvatar}
              alt={driverName}
              className="drv-driver-avatar"
            />
            <div className="d-none d-md-block text-start">
              <span className="d-block fw-bold text-dark small leading-tight">{driverName}</span>
              <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                Tata Ace (TN-57-AB-4029)
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* 2. BODY WRAPPER (SIDEBAR + MAIN) */}
      <div className="drv-wrapper">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="drv-sidebar-overlay d-lg-none"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* LEFT SIDEBAR NAVIGATION (Matching Template) */}
        <aside className={`drv-sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Top Brand Logo inside Sidebar */}
          <div className="drv-sidebar-header">
            <Link
              to="/driver/requests"
              className="d-flex align-items-center gap-2 text-decoration-none"
              onClick={() => setSidebarOpen(false)}
            >
              <img
                src="/naam-uzhavar-logo-transparent.png"
                alt="Naam Uzhavar"
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
          </div>

          {/* Driver Profile Chip */}
          <Link
            to="/driver/profile"
            className="drv-profile-chip"
            onClick={() => setSidebarOpen(false)}
            title="View Driver Profile"
          >
            <img
              src={driverAvatar}
              alt={driverName}
              className="drv-profile-avatar"
            />
            <div className="flex-grow-1 overflow-hidden text-start">
              <span className="drv-profile-name d-block text-truncate">
                {driverName}
              </span>
              <span className="drv-profile-role d-block">
                <i className="bi bi-patch-check-fill text-warning"></i>
                <span>{t('verifiedDriver')}</span>
              </span>
              <span className="drv-profile-loc">
                <i className="bi bi-truck text-secondary"></i>
                <span>{t('dindigulHub')}</span>
              </span>
            </div>
          </Link>

          {/* Main Navigation List (Single language at a time) */}
          <nav className="drv-nav-list">
            {navLinks.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `drv-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span className="drv-nav-title flex-grow-1 text-start">{t(item.key)}</span>
                {item.badge && (
                  <span className={`drv-nav-badge ${item.badgeClass || 'drv-nav-badge-amber'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer with Vehicle Specs & Logout */}
          <div className="drv-sidebar-footer">
            <div className="drv-driver-chip mb-2">
              <i className="bi bi-truck fs-4 text-warning"></i>
              <div className="small text-start">
                <strong className="d-block text-dark">TN-57-AB-4029</strong>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>{t('maxPayload')}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>{t('logout')}</span>
            </button>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="drv-main drv-page-fade">
          {children}
        </main>
      </div>

    </div>
  );
}
