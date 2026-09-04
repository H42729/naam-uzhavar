/**
 * Buyer Mobile Bottom Navigation Bar
 * Provides 1-thumb touch navigation on mobile and tablet devices
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';

export default function BuyerMobileNav() {
  const { pendingRequestsCount, activeOrdersCount } = useBuyer();
  const { t, language } = useLanguage();

  const navItems = [
    {
      to: '/buyer/dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      icon: 'bi-house-door-fill',
      exact: true
    },
    {
      to: '/buyer/browse',
      label: t('marketplace'),
      icon: 'bi-shop'
    },
    {
      to: '/buyer/requests',
      label: language === 'ta' ? 'கோரிக்கைகள்' : 'Requests',
      icon: 'bi-inbox-fill',
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
    },
    {
      to: '/buyer/orders',
      label: language === 'ta' ? 'ஆர்டர்கள்' : 'Orders',
      icon: 'bi-box-seam-fill',
      badge: activeOrdersCount > 0 ? activeOrdersCount : null
    }
  ];

  return (
    <div
      className="d-lg-none position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg py-2 px-1 farm-mobile-nav"
      style={{ zIndex: 1040, height: '62px' }}
    >
      <div className="d-flex align-items-center justify-content-around h-100">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `d-flex flex-column align-items-center justify-content-center text-decoration-none transition px-2 py-1 position-relative ${
                isActive ? 'text-primary fw-bold active' : 'text-muted'
              }`
            }
            style={{ fontSize: '0.72rem', flex: 1, minWidth: 0 }}
          >
            <div className="position-relative">
              <i className={`bi ${item.icon} fs-5 mb-0.5`}></i>
              {item.badge && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                  style={{ fontSize: '0.62rem', padding: '0.2em 0.45em' }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-truncate w-100 text-center" style={{ letterSpacing: '-0.2px' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
