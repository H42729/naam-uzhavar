import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

export default function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onOpenAuth, onOpenMarketplace }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const effectiveUser = currentUser || user;
  const effectiveIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  const isContactActive = activeTab === 'contact' || location.pathname === '/contact';
  const isMarketplaceActive = activeTab === 'marketplace' || location.pathname.startsWith('/buyer/browse');
  const isHomeActive = !isContactActive && !isMarketplaceActive && (activeTab === 'home' || location.pathname === '/');

  const handleNavClick = (sectionId, tabName) => {
    if (setActiveTab) setActiveTab(tabName);
    if (tabName === 'home' && location.pathname !== '/') {
      navigate('/');
      return;
    }
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleUserDashboardRedirect = () => {
    if (effectiveUser?.roleKey === 'buyer') navigate('/buyer/dashboard');
    else if (effectiveUser?.roleKey === 'admin') navigate('/admin/dashboard');
    else navigate('/farmer/dashboard');
  };

  return (
    <header
      className="fd-navbar-sticky sticky top-0 z-40 bg-white border-b border-[#E5E7EB] transition-colors"
      style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}
    >
      <div className="fd-wrapper">
        <div className="fd-nav-content flex items-center justify-between py-2.5">
          {/* Brand Logo */}
          <div className="fd-logo cursor-pointer flex-shrink-0" onClick={() => handleNavClick('top', 'home')}>
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              className="h-8 sm:h-11 w-auto max-w-[125px] sm:max-w-none object-contain"
              style={{ maxHeight: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex" aria-label="Main Navigation">
            <ul className="flex items-center gap-1.5 list-none m-0 p-0">
              {/* 1. Home */}
              <li>
                <button
                  type="button"
                  id="nav-home-btn"
                  className="px-4 py-2 text-sm font-semibold rounded-pill transition-all border-0 cursor-pointer"
                  style={{
                    backgroundColor: isHomeActive ? '#2563EB' : 'transparent',
                    color: isHomeActive ? '#ffffff' : '#475569'
                  }}
                  onClick={() => handleNavClick('top', 'home')}
                >
                  {t('navHome')}
                </button>
              </li>

              {/* 2. Contact (replaced Marketplace as requested) */}
              <li>
                <button
                  type="button"
                  id="nav-contact-btn"
                  className="px-4 py-2 text-sm font-semibold rounded-pill transition-all border-0 cursor-pointer d-flex align-items-center gap-1.5"
                  style={{
                    backgroundColor: isContactActive ? '#2563EB' : 'transparent',
                    color: isContactActive ? '#ffffff' : '#475569'
                  }}
                  onClick={() => {
                    if (setActiveTab) setActiveTab('contact');
                    navigate('/contact');
                  }}
                >
                  <i className="bi bi-telephone"></i>
                  <span>{t('navContact')}</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Nav Actions (Right) */}
          <div className="fd-nav-actions d-flex align-items-center gap-1.5 gap-sm-2">
            {/* Mobile Contact Quick Nav Button */}
            <nav aria-label="Mobile Navigation" className="d-flex d-md-none">
              <button
                type="button"
                id="mobile-nav-contact-btn"
                className="btn btn-sm rounded-pill px-2.5 py-1 d-flex align-items-center gap-1.5 border-0 shadow-none"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: isContactActive ? '#2563EB' : '#f1f5f9',
                  color: isContactActive ? '#ffffff' : '#334155'
                }}
                onClick={() => {
                  if (setActiveTab) setActiveTab('contact');
                  navigate('/contact');
                }}
                title={t('navContact')}
              >
                <i className="bi bi-telephone-fill" style={{ fontSize: '0.75rem' }}></i>
                <span>{t('navContact')}</span>
              </button>
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Bell */}
            <button
              type="button"
              className="fd-icon-btn d-none d-sm-flex"
              title="Notifications"
              aria-label="View notifications"
              onClick={() => alert('🔔 3 Harvest alerts: Fresh organic produce dispatched in your area!')}
            >
              <i className="bi bi-bell"></i>
              <span className="badge-ping" aria-hidden="true"></span>
            </button>

            {isLoggedIn ? (
              /* If Logged In: User Profile Chip */
              <button
                type="button"
                className="btn btn-light rounded-pill d-flex align-items-center gap-2 py-1 ps-1 pe-3 border shadow-sm"
                onClick={handleUserDashboardRedirect}
                title="Go to Dashboard"
              >
                <img
                  src={currentUser?.avatar || DEFAULT_AVATAR}
                  alt={currentUser?.name || 'User'}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                />
                <span className="small fw-bold text-dark">{currentUser?.name || 'Ravi Kumar'}</span>
              </button>
            ) : (
              /* If Not Logged In: Login & Register Buttons (Desktop & Tablet only; removed on mobile view) */
              <div className="d-none d-md-flex align-items-center gap-2">
                <button
                  type="button"
                  className="fd-btn-login d-inline-flex align-items-center gap-1"
                  onClick={() => navigate('/login')}
                  title={t('signIn')}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>{t('signIn')}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1"
                  onClick={() => navigate('/register')}
                >
                  <span>{t('register', 'Register')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
