/**
 * Buyer Sidebar Navigation
 * Dynamic English <-> Tamil translations via useLanguage().
 * Displays one single language at a time.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyer } from '../context/BuyerContext';
import { useLanguage } from '../context/LanguageContext';

export default function BuyerSidebar({ isOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { products, orders, pendingRequestsCount } = useBuyer();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const menuItems = [
    {
      to: '/buyer/dashboard',
      key: 'dashboard',
      icon: 'bi-grid-fill',
      exact: true
    },
    {
      to: '/buyer/browse',
      key: 'browseProduce',
      icon: 'bi-flower2',
      badge: `${products?.length || 6} ${t('active')}`,
      badgeClass: 'bd-nav-badge-blue'
    },
    {
      to: '/buyer/request-status',
      key: 'requestStatus',
      label: 'Request Status',
      icon: 'bi-clock-history',
      badge: 'Accepted Tracker ✓',
      badgeClass: 'bd-nav-badge-green'
    },
    {
      to: '/buyer/requirement',
      key: 'bulkRequirement',
      icon: 'bi-plus-circle-fill'
    },
    {
      to: '/buyer/orders',
      key: 'myOrders',
      icon: 'bi-receipt-cutoff',
      badge: `${orders?.length || 5} ${t('myOrders')}`,
      badgeClass: 'bd-nav-badge-blue'
    },
    {
      to: '/buyer/deliveries',
      key: 'deliveryStatus',
      icon: 'bi-truck',
      badge: `1 ${t('active')}`,
      badgeClass: 'bd-nav-badge-cyan'
    }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate('/login');
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
        {/* 1. Header with Naam Uzhavar Brand Logo */}
        <div className="bd-sidebar-header">
          <NavLink
            to="/buyer/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none"
            onClick={handleNavClick}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </NavLink>
        </div>

        {/* 2. Buyer Profile Chip */}
        <div className="bd-profile-chip">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            }
            alt={user?.name || 'Buyer'}
            className="bd-profile-avatar"
          />
          <div className="flex-grow-1 overflow-hidden text-start">
            <span className="bd-profile-name d-block text-truncate">
              {user?.name || 'Priya Senthil'}
            </span>
            <span className="bd-profile-role d-block">
              <i className="bi bi-patch-check-fill text-primary"></i>
              <span>{t('verifiedBuyer')}</span>
            </span>
            <span className="bd-profile-loc">
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span>{t('coimbatoreTN')}</span>
            </span>
          </div>
        </div>

        {/* 3. Main Navigation List (Single language at a time) */}
        <nav className="bd-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `bd-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="bd-nav-title flex-grow-1 text-start">{t(item.key) || item.label || item.key}</span>
              {item.badge && (
                <span className={`bd-nav-badge ${item.badgeClass}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 4. Footer with Logout */}
        <div className="bd-sidebar-footer">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
