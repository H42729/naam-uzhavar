import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

export default function FarmerSidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { stats, notify } = useFarmer();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const navItems = [
    {
      to: '/farmer/dashboard',
      label: 'Dashboard',
      tamil: 'முகப்பு',
      icon: 'bi-grid-1x2-fill'
    },
    {
      to: '/farmer/products',
      label: 'Products',
      tamil: 'பயிர்கள்',
      icon: 'bi-box-seam-fill',
      badge: stats.activeProducts > 0 ? stats.activeProducts : null,
      badgeClass: 'bg-light text-dark border'
    },
    {
      to: '/farmer/add-product',
      label: 'Add Product',
      tamil: 'பயிர் சேர்க்க',
      icon: 'bi-plus-circle-fill',
      isCta: true
    },
    {
      to: '/farmer/requests',
      label: 'Consumer Requests',
      tamil: 'வாங்குவோர் கோரிக்கைகள்',
      icon: 'bi-inbox-fill',
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : null,
      badgeClass: 'bg-warning text-dark'
    },
    {
      to: '/farmer/demand-forecast',
      label: 'Demand Forecast',
      tamil: 'சந்தை தேவை கணிப்பு',
      icon: 'bi-graph-up-arrow'
    },
    {
      to: '/farmer/profile',
      label: 'Farmer Profile',
      tamil: 'விவசாயி சுயவிவரம்',
      icon: 'bi-person-badge-fill'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
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

      {/* Farmer Profile Chip */}
      <NavLink
        to="/farmer/profile"
        className="farm-profile-chip"
        onClick={onCloseMobile}
        title="View Farmer Profile"
      >
        <img
          src={user?.avatar || DEFAULT_AVATAR}
          alt={user?.name || 'Farmer'}
          className="farm-profile-avatar"
        />
        <div className="overflow-hidden flex-grow-1">
          <div className="farm-profile-name text-truncate">
            {user?.name || 'Ravi Kumar'}
          </div>
          <div className="farm-profile-loc text-truncate">
            <i className="bi bi-geo-alt-fill text-success"></i>
            <span>{user?.location || 'Erode, Tamil Nadu'}</span>
          </div>
        </div>
        <i className="bi bi-chevron-right text-muted small"></i>
      </NavLink>

      {/* Navigation List */}
      <nav className="farm-nav-list">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `farm-nav-link ${item.isCta ? 'farm-nav-cta' : ''} ${
                isActive ? 'active' : ''
              }`
            }
            onClick={onCloseMobile}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{language === 'ta' ? item.tamil : item.label}</span>
            {item.badge && (
              <span className={`farm-nav-badge ${item.badgeClass}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="farm-sidebar-footer">
        {/* Language Selector */}
        <div className="d-flex align-items-center justify-content-between p-2 bg-white rounded-3 border">
          <span className="small text-muted fw-bold">மொழி / Lang:</span>
          <div className="btn-group btn-group-sm">
            <button
              type="button"
              className={`btn btn-sm ${
                language === 'en' ? 'btn-success fw-bold' : 'btn-light'
              }`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                language === 'ta' ? 'btn-success fw-bold' : 'btn-light'
              }`}
              onClick={() => setLanguage('ta')}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="btn btn-sm text-start text-danger border-0 p-2 d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left"></i>
          <span className="small fw-bold">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
