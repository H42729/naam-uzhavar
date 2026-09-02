/**
 * Driver Dashboard Layout
 * Naam Uzhavar / FarmDirect Platform
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DRIVER_PROFILE } from '../../data/driverData';
import '../../styles/driver-route.css';

export default function DriverLayout({ children, activeDeliveryId, onRefresh, isOnline = true, onToggleOnline }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const driverName = user?.name || DRIVER_PROFILE.name;
  const driverAvatar = user?.avatar || DRIVER_PROFILE.avatar;

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Delivery Requests', icon: 'bi-inbox', path: '/driver/requests', badge: '3 New', exact: false },
    { label: 'Active Delivery', icon: 'bi-geo-alt-fill', path: `/driver/routes/${activeDeliveryId || 'ORD-1024'}`, exact: false },
    { label: 'Routes', icon: 'bi-signpost-split', path: '/driver/routes', exact: true },
    { label: 'Delivery History', icon: 'bi-clock-history', path: '/driver/history', exact: false },
    { label: 'Trip Summary', icon: 'bi-speedometer2', path: '/driver/trips', exact: false },
    { label: 'Notifications', icon: 'bi-bell', path: '/driver/notifications', badge: '2', exact: false },
    { label: 'Profile', icon: 'bi-person', path: '/driver/profile', exact: false },
  ];

  return (
    <div className="drv-layout">
      {/* 1. TOP HEADER */}
      <header className="drv-header">
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
              Logistics Driver
            </span>
          </Link>
        </div>

        {/* Header Right Actions */}
        <div className="d-flex align-items-center gap-3">
          {/* Online / Offline status toggle */}
          <div
            className="drv-online-pill cursor-pointer"
            onClick={onToggleOnline}
            title="Click to toggle driver availability status"
            style={{ cursor: 'pointer' }}
          >
            <span className={`drv-online-dot ${isOnline ? '' : 'bg-secondary'}`}></span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Notification dropdown icon */}
          <div className="position-relative">
            <Link
              to="/driver/notifications"
              className="btn btn-sm btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center position-relative"
              style={{ width: '38px', height: '38px' }}
              title="Notifications"
            >
              <i className="bi bi-bell text-secondary"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </Link>
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

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className={`drv-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul className="drv-nav-list">
            {navLinks.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `drv-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`drv-nav-badge ${
                        item.badge.includes('New')
                          ? 'bg-danger text-white'
                          : 'bg-warning-subtle text-warning-emphasis'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Sidebar Footer with Logout & Driver Vehicle Specs */}
          <div className="drv-sidebar-footer">
            <div className="drv-driver-chip mb-3">
              <i className="bi bi-truck fs-4 text-warning"></i>
              <div className="small">
                <strong className="d-block text-dark">TN-57-AB-4029</strong>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Payload: 750 kg Max</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
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
