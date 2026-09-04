import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

export default function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onOpenAuth, onOpenMarketplace }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const effectiveUser = currentUser || user;
  const effectiveIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : isAuthenticated;

  const isBookVehicleActive = location.pathname === '/book-vehicle' || activeTab === 'book-vehicle';
  const isMarketplaceActive = !isBookVehicleActive && (activeTab === 'marketplace' || location.pathname.startsWith('/buyer/browse'));
  const isHomeActive = !isBookVehicleActive && !isMarketplaceActive && (activeTab === 'home' || location.pathname === '/');

  const handleNavClick = (sectionId, tabName) => {
    if (setActiveTab) setActiveTab(tabName);
    setMobileMenuOpen(false);
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
          <div className="fd-logo cursor-pointer" onClick={() => handleNavClick('top', 'home')}>
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex" aria-label="Main Navigation">
            <ul className="flex items-center gap-1.5 list-none m-0 p-0">
              {/* 1. Home */}
              <li>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border-0 cursor-pointer ${
                    isHomeActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
                  }`}
                  onClick={() => handleNavClick('top', 'home')}
                >
                  {t('navHome')}
                </button>
              </li>

              {/* 2. Marketplace */}
              <li>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border-0 cursor-pointer flex items-center gap-1.5 ${
                    isMarketplaceActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
                  }`}
                  onClick={() => {
                    if (onOpenMarketplace) onOpenMarketplace();
                    else navigate('/buyer/browse');
                  }}
                >
                  <i className="bi bi-shop"></i>
                  <span>{t('navMarketplace')}</span>
                </button>
              </li>

              {/* 3. Book Vehicle (Active Blue Pill with Soft Slate Badge) */}
              <li>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all border-0 cursor-pointer flex items-center gap-2 ${
                    isBookVehicleActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
                  }`}
                  onClick={() => {
                    if (setActiveTab) setActiveTab('book-vehicle');
                    navigate('/book-vehicle');
                  }}
                >
                  <i className="bi bi-truck"></i>
                  <span>Book Vehicle</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isBookVehicleActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    [ 4 ]
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Nav Actions (Right) */}
          <div className="fd-nav-actions">
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
              /* If Not Logged In: Login & Register Buttons */
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="fd-btn-login d-inline-flex align-items-center gap-1"
                  onClick={() => navigate('/login')}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>{t('signIn')}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-none d-lg-inline-flex align-items-center gap-1"
                  onClick={() => navigate('/register')}
                >
                  <i className="bi bi-person-plus"></i>
                  <span>{t('registerAs')}</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="fd-icon-btn d-md-none"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with 44px+ Accessible Touch Targets */}
        {mobileMenuOpen && (
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-lg mb-3 d-md-none animate__animated animate__fadeIn">
            <div className="d-flex flex-column gap-2">
              {/* Home */}
              <button
                type="button"
                className={`min-h-[44px] h-[48px] w-full text-start px-3.5 rounded-xl font-bold flex items-center justify-between border-0 transition-all cursor-pointer ${
                  isHomeActive ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
                onClick={() => handleNavClick('top', 'home')}
              >
                <span className="flex items-center gap-2">
                  <i className="bi bi-house-door"></i>
                  <span>Home</span>
                </span>
                <i className="bi bi-chevron-right text-xs opacity-60"></i>
              </button>

              {/* Marketplace */}
              <button
                type="button"
                className={`min-h-[44px] h-[48px] w-full text-start px-3.5 rounded-xl font-bold flex items-center justify-between border-0 transition-all cursor-pointer ${
                  isMarketplaceActive ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenMarketplace) onOpenMarketplace();
                  else navigate('/buyer/browse');
                }}
              >
                <span className="flex items-center gap-2">
                  <i className="bi bi-shop"></i>
                  <span>Marketplace</span>
                </span>
                <i className="bi bi-chevron-right text-xs opacity-60"></i>
              </button>

              {/* Book Vehicle (Accessible Touch Target >= 44px) */}
              <button
                type="button"
                className={`min-h-[44px] h-[48px] w-full text-start px-3.5 rounded-xl font-bold flex items-center justify-between border-0 transition-all cursor-pointer ${
                  isBookVehicleActive ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/book-vehicle');
                }}
              >
                <span className="flex items-center gap-2">
                  <i className="bi bi-truck"></i>
                  <span>Book Vehicle</span>
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isBookVehicleActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  [ 4 ]
                </span>
              </button>
              {!isLoggedIn ? (
                <div className="pt-2 border-top d-flex flex-column gap-2">
                  <button
                    className="btn btn-success w-100 fw-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Login to Portal
                  </button>
                  <button
                    className="btn btn-outline-success w-100 fw-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/register');
                    }}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Register New Account
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-top">
                  <button
                    className="btn btn-outline-success w-100 fw-bold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleUserDashboardRedirect();
                    }}
                  >
                    Go to Dashboard ({currentUser?.role || 'Farmer'})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
