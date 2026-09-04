/**
 * BuyerNavbar Component
 * Production-ready, Responsive Two-Tier Navigation Header for Buyer Module.
 * Matches the exact design tokens, theme, and layout of the Farmer Module:
 * - Tier 1: Identity & Utility Controls (Brand Logo, Soft Cream Profile Capsule, Buyer ID tag,
 *   Online/Offline status toggle, Language Switcher, Logout button).
 * - Tier 2: Horizontal Navigation Tabs with Deep Cobalt Blue active pill (#2563EB) & nested badges.
 * - Responsive 2-Row Mobile Header (Zero overlap between profile and controls).
 * - Desktop Tier 2 hidden on mobile (< lg), with dedicated mobile bottom navigation.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyer } from '../context/BuyerContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Inbox,
  PackageCheck,
  Boxes,
  Truck,
  User,
  LogOut,
  Building2
} from 'lucide-react';

export default function BuyerNavbar({
  buyerName = 'FreshMart Procurement',
  onLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const {
    products,
    pendingRequestsCount,
    activeOrdersCount,
    activeRequirementsCount
  } = useBuyer();
  const { t, language, setLanguage } = useLanguage();

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Online / Offline status with localStorage persistence
  const [isOnline, setIsOnline] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_buyer_online_status');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('naam_uzhavar_buyer_online_status', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleLogoutClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onLogout) {
      onLogout();
    } else {
      if (logout) logout();
      navigate('/login');
    }
  };

  // Buyer identity details
  const displayBuyerName =
    language === 'ta'
      ? 'ஃப்ரெஷ்மார்ட் கொள்முதல் (ஆர். குமார்)'
      : user?.name
      ? `${user.name} (R. Kumar)`
      : 'FreshMart Procurement (R. Kumar)';

  const buyerAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80';

  // Tier 2 Navigation Items definition
  const navTabs = [
    {
      id: 'dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      path: '/buyer/dashboard',
      icon: LayoutDashboard,
      matchPatterns: ['/buyer/dashboard', '/buyer', '/consumer']
    },
    {
      id: 'marketplace',
      label: language === 'ta' ? 'சந்தை' : 'Marketplace',
      path: '/buyer/browse',
      icon: ShoppingBag,
      badgeText: language === 'ta' ? `${products?.length || 9} பட்டியல்` : `${products?.length || 9} Listed`,
      badgeInactiveClass: 'bg-[#E2E8F0] text-[#475569] font-bold',
      matchPatterns: ['/buyer/browse', '/buyer/marketplace', '/marketplace', '/buyer/products']
    },
    {
      id: 'requests',
      label: language === 'ta' ? 'என் கோரிக்கைகள்' : 'My Requests',
      path: '/buyer/requests',
      icon: Inbox,
      badgeText: language === 'ta' ? `${pendingRequestsCount || 3} புதியது` : `${pendingRequestsCount || 3} New`,
      badgeInactiveClass: 'bg-[#FEF3C7] text-[#92400E] font-bold',
      matchPatterns: ['/buyer/requests', '/buyer/request-status']
    },
    {
      id: 'orders',
      label: language === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders',
      path: '/buyer/orders',
      icon: PackageCheck,
      badgeText: language === 'ta' ? `${activeOrdersCount || 6} நடப்பு` : `${activeOrdersCount || 6} Active`,
      badgeInactiveClass: 'bg-[#D1FAE5] text-[#065F46] font-bold',
      matchPatterns: ['/buyer/orders', '/buyer/deliveries', '/my-orders']
    },
    {
      id: 'requirement',
      label: language === 'ta' ? 'மொத்த தேவைகள்' : 'Bulk Requirement',
      path: '/buyer/requirement',
      icon: Boxes,
      badgeText: language === 'ta' ? `${activeRequirementsCount || 7} தேவை` : `${activeRequirementsCount || 7} Listed`,
      badgeInactiveClass: 'bg-[#EEF2FF] text-[#4F46E5] font-semibold',
      matchPatterns: ['/buyer/requirement', '/buyer/requirements', '/buyer/aggregate-details', '/buyer/matched-supply', '/bulk-requirement']
    },
    {
      id: 'logistics',
      label: language === 'ta' ? 'வாகனம் பதிவு' : 'Book Vehicle',
      path: '/book-vehicle',
      icon: Truck,
      badgeText: language === 'ta' ? '4 உள்ளது' : '[ 4 ]',
      badgeInactiveClass: 'bg-slate-100 text-slate-700 font-medium',
      matchPatterns: ['/book-vehicle', '/farmer/logistics']
    },
    {
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      icon: User,
      isModalTrigger: true
    }
  ];

  // Helper to determine active state
  const isTabActive = (tab) => {
    if (tab.isModalTrigger) return false;
    const pathname = location.pathname;
    return tab.matchPatterns.some((pattern) => {
      if (pattern === '/buyer/dashboard') {
        return pathname === '/buyer/dashboard' || pathname === '/buyer' || pathname === '/consumer';
      }
      return pathname === pattern || pathname.startsWith(`${pattern}/`);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
        {/* =====================================================================
            TIER 1: IDENTITY, BUYER PROFILE & KEY UTILITY CONTROLS
            ===================================================================== */}
        <div className="w-full bg-white">
          {/* Top Row: Brand Logo, Buyer Profile on Left, Desktop Controls & Logout on Right */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 max-w-7xl mx-auto gap-2 sm:gap-4">
            
            {/* Left Section: Brand Logo, Divider, Buyer Profile Capsule, Buyer ID tag */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Brand Logo */}
              <Link
                to="/buyer/dashboard"
                className="flex items-center gap-1.5 sm:gap-2 no-underline group flex-shrink-0"
                title="Naam Uzhavar Buyer Portal"
              >
                <img
                  src="/naam-uzhavar-logo-transparent.png"
                  alt="Naam Uzhavar"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Vertical Hairline Divider */}
              <div className="h-7 sm:h-8 w-px bg-slate-200 mx-0.5 sm:mx-2 hidden sm:block flex-shrink-0" aria-hidden="true" />

              {/* Buyer Profile Capsule: Soft cream background with amber avatar border */}
              <div
                onClick={() => setShowProfileModal(true)}
                className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs flex items-center gap-2 sm:gap-2.5 no-underline hover:bg-amber-50/80 transition-colors flex-shrink-0 cursor-pointer"
                title={t('viewProfile', 'View Buyer Profile')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowProfileModal(true);
                  }
                }}
              >
                <img
                  src={buyerAvatar}
                  alt={displayBuyerName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
                />
                <div className="flex flex-col text-left leading-tight justify-center">
                  <span className="font-bold text-slate-900 text-xs sm:text-base leading-tight block truncate max-w-[130px] sm:max-w-[200px]">
                    {displayBuyerName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs mt-0.5 flex-wrap">
                    <span className="text-[#D97706] font-semibold">
                      ✔ {language === 'ta' ? 'சரிபார்க்கப்பட்ட வாங்குபவர்' : 'Verified Buyer'}
                    </span>
                    <span className="text-slate-400 hidden lg:inline">•</span>
                    <span className="text-slate-500 text-xs font-medium hidden lg:inline">
                      📍 {language === 'ta' ? 'திண்டுக்கல் மையம்' : 'Dindigul Hub'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer Business Info Capsule (Desktop) */}
              <div className="hidden xl:flex items-center gap-2 bg-[#FFFDF5] border border-[#FDE68A] text-slate-700 text-xs px-3.5 py-1.5 rounded-xl font-medium shadow-2xs flex-shrink-0">
                <span className="font-semibold text-amber-900">🏢 Buyer ID: BY-108-TN</span>
                <span className="text-amber-300">|</span>
                <span>Wholesale Hub: Dindigul Central</span>
              </div>
            </div>

            {/* Right Section: Desktop Utility Controls & Logout Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Desktop Only: Online / Offline Status Toggle */}
              <button
                type="button"
                onClick={handleToggleOnline}
                className={`hidden md:flex px-3.5 py-1.5 rounded-full text-xs font-bold items-center gap-2 transition-all cursor-pointer select-none border shadow-2xs min-h-[38px] ${
                  isOnline
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-800 hover:bg-emerald-200/80'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200/80'
                }`}
                title={isOnline ? 'Status: Online (Accepting Direct Farmer Invoices)' : 'Status: Offline'}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isOnline ? 'bg-[#059669] animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {isOnline
                    ? language === 'ta'
                      ? 'ஆன்லைன்'
                      : 'Online'
                    : language === 'ta'
                    ? 'ஆஃப்லைன்'
                    : 'Offline'}
                </span>
              </button>

              {/* Desktop Only: Language Switcher */}
              <div
                className="hidden md:flex bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1 text-xs font-bold text-slate-700 items-center gap-1.5 min-h-[38px] shadow-2xs"
                role="group"
                aria-label="Language selector"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`border-0 bg-transparent cursor-pointer font-bold transition-colors ${
                    language === 'en' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Switch to English"
                >
                  English
                </button>
                <span className="text-slate-300 font-normal">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`border-0 bg-transparent cursor-pointer font-bold transition-colors ${
                    language === 'ta' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="தமிழுக்கு மாறவும்"
                >
                  தமிழ்
                </button>
              </div>

              {/* Logout Button (Always on top row right side) */}
              <button
                type="button"
                onClick={handleLogoutClick}
                className="border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-[#E11D48] text-xs font-bold px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 min-h-[34px] sm:min-h-[38px]"
                title="Logout from Naam Uzhavar"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Row 2: Online/Offline Button and Language Switcher on dedicated next line (md:hidden) */}
          <div className="md:hidden border-t border-slate-100 bg-slate-50/70 px-3 py-1.5">
            <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
              {/* Mobile Online / Offline Toggle */}
              <button
                type="button"
                onClick={handleToggleOnline}
                className={`flex-1 justify-center px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none border shadow-2xs min-h-[36px] ${
                  isOnline
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
                title={isOnline ? 'Status: Online' : 'Status: Offline'}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isOnline ? 'bg-[#059669] animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {isOnline
                    ? language === 'ta'
                      ? 'ஆன்லைன்'
                      : 'Online'
                    : language === 'ta'
                    ? 'ஆஃப்லைன்'
                    : 'Offline'}
                </span>
              </button>

              {/* Mobile Language Switcher */}
              <div
                className="flex-1 justify-center bg-white border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-700 flex items-center gap-2 min-h-[36px] shadow-2xs"
                role="group"
                aria-label="Language selector"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`border-0 bg-transparent cursor-pointer font-bold transition-colors ${
                    language === 'en' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Switch to English"
                >
                  English
                </button>
                <span className="text-slate-300 font-normal">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`border-0 bg-transparent cursor-pointer font-bold transition-colors ${
                    language === 'ta' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="தமிழுக்கு மாறவும்"
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            TIER 2: HORIZONTAL BUYER NAVIGATION TABS (COBALT BLUE ACTIVE PILL)
            Desktop only (hidden on mobile < lg to avoid duplicate navbars)
            ===================================================================== */}
        <div className="border-t border-slate-100 bg-white hidden lg:block">
          <nav className="px-4 sm:px-6 py-2 flex items-center gap-2 max-w-7xl mx-auto overflow-x-auto no-scrollbar scroll-smooth">
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;

              if (tab.isModalTrigger) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="whitespace-nowrap border-0 bg-transparent cursor-pointer flex items-center gap-2 text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 rounded-full px-4 py-2 font-medium transition-colors"
                  >
                    <IconComponent className="w-4 h-4 flex-shrink-0 text-slate-500" />
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                  </button>
                );
              }

              const active = isTabActive(tab);

              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={`whitespace-nowrap no-underline transition-all cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-[#2563EB] text-white font-semibold rounded-full px-5 py-2 shadow-xs'
                      : 'text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 rounded-full px-4 py-2 font-medium transition-colors'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                  <span className="text-xs sm:text-sm">{tab.label}</span>

                  {/* Badges inside tabs */}
                  {tab.badgeText && (
                    <span
                      className={`transition-colors ${
                        active
                          ? 'bg-white text-[#2563EB] font-black text-xs px-2 py-0.5 rounded-full ml-1.5'
                          : `${tab.badgeInactiveClass} text-xs px-2.5 py-0.5 rounded-full ml-1.5`
                      }`}
                    >
                      {tab.badgeText}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* =====================================================================
          PROFILE INSPECTION MODAL (PORTAL)
          ===================================================================== */}
      {showProfileModal &&
        createPortal(
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1200 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden farm-animate-fade">
                <div className="modal-header bg-light border-bottom p-3">
                  <h5 className="modal-title fs-6 fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                    <Building2 className="w-5 h-5 text-primary text-[#2563EB]" />
                    <span>{t('profile')}</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowProfileModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div className="relative inline-block mb-3">
                    <img
                      src={buyerAvatar}
                      alt={displayBuyerName}
                      className="w-16 h-16 rounded-full border-3 border-[#2563EB] object-cover shadow-sm mx-auto"
                    />
                    <span
                      className="absolute bottom-0 right-0 bg-[#059669] text-white rounded-full p-1 flex items-center justify-center shadow-xs"
                      title="Verified Wholesale Buyer"
                    >
                      ✔
                    </span>
                  </div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">{displayBuyerName}</h4>
                  <span className="badge bg-[#2563EB] text-white rounded-pill px-3 py-1 mb-3">
                    Institutional Wholesale Mandi Trader
                  </span>

                  <div className="p-3 bg-light rounded-3 text-start small mb-3">
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">Procurement Hub:</span>
                      <strong className="text-dark">Dindigul Central Hub, TN</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">GSTIN / Udyam:</span>
                      <strong className="text-dark font-monospace">33AAACH1234F1Z8</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">FSSAI License:</span>
                      <strong className="text-dark font-monospace">12423005000189</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Verification Status:</span>
                      <strong className="text-success">✔ FPO & Mandi Verified</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger w-100 rounded-pill fw-bold py-2"
                    onClick={() => {
                      setShowProfileModal(false);
                      handleLogoutClick();
                    }}
                  >
                    <LogOut className="w-4 h-4 me-1.5 inline-block" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
