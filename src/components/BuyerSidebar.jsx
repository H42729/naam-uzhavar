import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBuyer } from '../context/BuyerContext';

export default function BuyerSidebar({ isOpen, onCloseMobile }) {
  const { pendingRequestsCount } = useBuyer();

  const menuItems = [
    {
      to: '/buyer/dashboard',
      label: 'Dashboard',
      icon: 'bi-grid-1x2-fill'
    },
    {
      to: '/buyer/browse',
      label: 'Browse Produce',
      icon: 'bi-basket-fill'
    },
    {
      to: '/buyer/requests',
      label: 'My Requests',
      icon: 'bi-inbox-fill',
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null
    },
    {
      to: '/buyer/requirement',
      label: 'Bulk Requirement',
      icon: 'bi-plus-circle-fill'
    },
    {
      to: '/buyer/matched-supply',
      label: 'Matched Supply',
      icon: 'bi-diagram-3-fill'
    },
    {
      to: '/buyer/orders',
      label: 'Orders',
      icon: 'bi-receipt-cutoff'
    }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="bd-sidebar-nav">
          <div className="bd-sidebar-label">Procurement Portal</div>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `bd-nav-button ${isActive ? 'active' : ''}`
              }
              onClick={handleNavClick}
            >
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className="badge rounded-pill bg-warning text-dark fw-bold px-2 py-1 small animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer Info */}
        <div className="bd-sidebar-footer">
          <div className="bd-verified-box">
            <div className="d-flex align-items-center gap-2 mb-1 text-success fw-bold">
              <i className="bi bi-patch-check-fill"></i>
              <span>SIH 2026 Smart Aggregator</span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.74rem', lineHeight: '1.4' }}>
              Direct procurement from farmer clusters in Tamil Nadu with 0% intermediary markup.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
