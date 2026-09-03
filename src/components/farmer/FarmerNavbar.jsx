/**
 * Farmer Header / Navbar Component
 * Displays "Welcome, Farmer 👋", Location (Dindigul, Tamil Nadu), verification badge, notification bell, and farmer profile avatar.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';

export default function FarmerNavbar({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const { stats, farmerProfile } = useFarmer();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <header className="farm-top-navbar bg-white border-bottom px-2 px-sm-3 px-md-4 py-2 d-flex align-items-center justify-content-between sticky-top" style={{ zIndex: 1030, minHeight: '62px' }}>
      {/* Left: Mobile Hamburger & Farmer Greeting */}
      <div className="d-flex align-items-center gap-1 gap-sm-2">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="btn btn-light d-lg-none border-0 p-1.5 text-dark rounded-circle d-flex align-items-center justify-content-center"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          style={{ width: '38px', height: '38px' }}
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Small Brand on Mobile */}
        <div
          className="d-flex align-items-center d-lg-none cursor-pointer"
          onClick={() => navigate('/farmer/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <img
            src="/naam-uzhavar-logo-transparent.png"
            alt="Naam Uzhavar"
            style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Welcome Text and Location */}
        <div className="d-none d-sm-block">
          <div className="d-flex align-items-center gap-2">
            <h1 className="fw-bold text-dark fs-5 mb-0" style={{ letterSpacing: '-0.3px' }}>
              {t('welcomeFarmer')}
            </h1>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 fw-bold small">
              <i className="bi bi-patch-check-fill me-1"></i> {t('verifiedBadge')}
            </span>
          </div>
          <span className="text-muted small d-flex align-items-center gap-1 mt-0">
            <i className="bi bi-geo-alt-fill text-danger small"></i>
            <span>{farmerProfile?.district || 'Dindigul'}, {farmerProfile?.state || 'Tamil Nadu'}</span>
            <span className="text-muted mx-1">•</span>
            <span className="text-success fw-semibold">{t('mandiHub')}</span>
          </span>
        </div>
      </div>

      {/* Right: Language Switcher, Notifications & Profile Avatar */}
      <div className="d-flex align-items-center gap-1.5 gap-sm-2 gap-md-3">
        {/* Language Selector: English | தமிழ் */}
        <LanguageSwitcher />

        {/* Quick Harvest CTA for Header */}
        <Link
          to="/farmer/harvest"
          className="btn btn-success fw-bold d-none d-md-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-xs"
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>{t('addMyHarvest')}</span>
        </Link>

        {/* Notification Bell */}
        <div className="position-relative" ref={notifRef}>
          <button
            type="button"
            className="btn btn-light rounded-circle p-0 position-relative border d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px' }}
            title="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <i className="bi bi-bell-fill text-dark"></i>
            {stats.buyerRequests > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.65rem' }}
              >
                {stats.buyerRequests}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-4 border shadow-lg p-3 farm-animate-fade"
              style={{ width: '320px', maxWidth: 'calc(100vw - 32px)', zIndex: 1060 }}
            >
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                <strong className="text-dark small">🔔 {t('notifications')}</strong>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setNotificationsOpen(false)}
                ></button>
              </div>

              <div className="d-flex flex-column gap-2 small">
                <div
                  className="p-2 bg-warning-subtle text-warning-emphasis rounded-3 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/farmer/requests');
                  }}
                >
                  <div className="fw-bold">New Buyer Request!</div>
                  <div>ABC Retail Dindigul requested 150 kg Tomatoes.</div>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>Today, 08:30 AM</span>
                </div>

                <div
                  className="p-2 bg-info-subtle text-info-emphasis rounded-3 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate('/farmer/deliveries');
                  }}
                >
                  <div className="fw-bold">Driver Assigned</div>
                  <div>Driver Raj Kumar assigned for Tomato pickup (#ORD-1024).</div>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>25 mins ago</span>
                </div>
              </div>

              <div className="pt-2 mt-2 border-top text-center">
                <Link
                  to="/farmer/requests"
                  className="text-success text-decoration-none fw-bold small"
                  onClick={() => setNotificationsOpen(false)}
                >
                  View All Requests →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Farmer Profile Avatar Dropdown */}
        <div className="position-relative" ref={profileRef}>
          <div
            className="d-flex align-items-center gap-2 cursor-pointer p-1 rounded-pill hover-bg-light"
            style={{ cursor: 'pointer' }}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <img
              src={farmerProfile?.avatar || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
              alt={farmerProfile?.name || 'Farmer'}
              className="rounded-circle object-fit-cover shadow-xs"
              style={{ width: '40px', height: '40px', border: '2px solid #10b981' }}
            />
            <div className="d-none d-xl-block text-start">
              <span className="fw-bold text-dark d-block small line-height-1">
                {farmerProfile?.name || 'Arun Kumar'}
              </span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                Nilakottai, Dindigul
              </span>
            </div>
            <i className="bi bi-chevron-down small text-muted d-none d-md-inline"></i>
          </div>

          {profileDropdownOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-3 border shadow-lg py-2 farm-animate-fade"
              style={{ width: '220px', zIndex: 1060 }}
            >
              <div className="px-3 py-2 border-bottom">
                <strong className="d-block text-dark small">{farmerProfile?.name || 'Arun Kumar'}</strong>
                <span className="text-muted small d-block">{farmerProfile?.phone || '+91 98421 88920'}</span>
                <span className="badge bg-success-subtle text-success small mt-1">{t('ePattaVerified')}</span>
              </div>

              <Link
                to="/farmer/profile"
                className="dropdown-item px-3 py-2 text-dark small d-flex align-items-center gap-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <i className="bi bi-person-circle text-primary"></i>
                <span>{t('profile')}</span>
              </Link>

              <Link
                to="/farmer/harvest"
                className="dropdown-item px-3 py-2 text-dark small d-flex align-items-center gap-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <i className="bi bi-flower2 text-success"></i>
                <span>{t('myHarvests')}</span>
              </Link>

              <Link
                to="/farmer/deliveries"
                className="dropdown-item px-3 py-2 text-dark small d-flex align-items-center gap-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <i className="bi bi-truck text-warning"></i>
                <span>{t('deliveryStatus')}</span>
              </Link>

              <div className="dropdown-divider my-1"></div>

              <button
                type="button"
                className="dropdown-item px-3 py-2 text-danger small d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
