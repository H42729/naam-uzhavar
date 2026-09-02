import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

export default function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onOpenAuth, onOpenMarketplace }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (sectionId, tabName) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
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
    if (currentUser?.roleKey === 'buyer') navigate('/buyer/dashboard');
    else if (currentUser?.roleKey === 'admin') navigate('/admin/dashboard');
    else navigate('/farmer/dashboard');
  };

  return (
    <header className="fd-navbar-sticky">
      <div className="fd-wrapper">
        <div className="fd-nav-content">
          {/* Brand Logo */}
          <div className="fd-logo" onClick={() => handleNavClick('top', 'home')}>
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex" aria-label="Main Navigation">
            <ul className="fd-nav-menu">
              <li>
                <button
                  type="button"
                  className={`fd-nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('top', 'home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fd-nav-item-btn ${activeTab === 'how-it-works' ? 'active' : ''}`}
                  onClick={() => handleNavClick('how-it-works', 'how-it-works')}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fd-nav-item-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
                  onClick={() => {
                    handleNavClick('marketplace', 'marketplace');
                    if (onOpenMarketplace) onOpenMarketplace();
                  }}
                >
                  <i className="bi bi-shop me-1"></i> Marketplace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fd-nav-item-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                  onClick={() => handleNavClick('calculator', 'benefits')}
                >
                  Benefits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fd-nav-item-btn ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => handleNavClick('how-it-works', 'about')}
                >
                  About
                </button>
              </li>
            </ul>
          </nav>

          {/* Nav Actions (Right) */}
          <div className="fd-nav-actions">
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
                  <span>Login</span>
                </button>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-none d-lg-inline-flex align-items-center gap-1"
                  onClick={() => navigate('/register')}
                >
                  <i className="bi bi-person-plus"></i>
                  <span>Register</span>
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="p-3 bg-white rounded-3 border shadow-sm mb-3 d-md-none animate__animated animate__fadeIn">
            <div className="d-flex flex-column gap-2">
              <button
                className={`btn text-start ${activeTab === 'home' ? 'btn-success text-white' : 'btn-outline-light text-dark'}`}
                onClick={() => handleNavClick('top', 'home')}
              >
                Home
              </button>
              <button
                className={`btn text-start ${activeTab === 'marketplace' ? 'btn-success text-white' : 'btn-outline-light text-dark'}`}
                onClick={() => handleNavClick('marketplace', 'marketplace')}
              >
                Marketplace
              </button>
              <button
                className={`btn text-start ${activeTab === 'how-it-works' ? 'btn-success text-white' : 'btn-outline-light text-dark'}`}
                onClick={() => handleNavClick('how-it-works', 'how-it-works')}
              >
                How It Works
              </button>
              <button
                className={`btn text-start ${activeTab === 'benefits' ? 'btn-success text-white' : 'btn-outline-light text-dark'}`}
                onClick={() => handleNavClick('calculator', 'benefits')}
              >
                Benefits & Calculator
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
