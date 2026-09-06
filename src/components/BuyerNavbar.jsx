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

import React, { useState, useEffect } from 'react';
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
  Building2,
  Cpu
} from 'lucide-react';

// Subcomponent to measure text and smoothly scroll long Tamil names/badges in mobile view without truncation
function CapsuleMarqueeText({ text, className, containerClassName, language, defaultScrollDist = 32 }) {
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);
  const isTamil = language === 'ta';
  const [shouldScroll, setShouldScroll] = React.useState(isTamil && (text || '').length > 8);
  const [scrollDist, setScrollDist] = React.useState(defaultScrollDist);

  React.useLayoutEffect(() => {
    const measure = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        if (textWidth > containerWidth + 2) {
          setShouldScroll(true);
          setScrollDist(Math.ceil(textWidth - containerWidth + 8));
        } else {
          setShouldScroll(false);
          setScrollDist(0);
        }
      }
    };
    measure();
    const timer = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, [text, language]);

  return (
    <div
      ref={containerRef}
      className={`capsule-marquee-container ${containerClassName || ''}`}
      style={{
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        key={`banner-anim-${text}-${language}`}
        className={`capsule-marquee-track capsule-switch-anim ${shouldScroll ? 'capsule-marquee-active' : ''}`}
        style={
          shouldScroll
            ? {
                '--banner-scroll-dist': `-${scrollDist}px`
              }
            : undefined
        }
      >
        <span ref={textRef} className={className} title={text}>
          {text}
        </span>
      </div>
    </div>
  );
}

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

  // Track explicitly clicked tab (Dashboard is unselected by default on initial page load)
  const [clickedTabId, setClickedTabId] = useState(() => {
    try {
      const pathname = window.location.pathname;
      if (pathname === '/buyer/dashboard' || pathname === '/buyer' || pathname === '/consumer') {
        return null; // Not selected by default on dashboard load
      }
      const matched = [
        { id: 'marketplace', patterns: ['/buyer/browse', '/buyer/marketplace', '/marketplace', '/buyer/products'] },
        { id: 'requests', patterns: ['/buyer/requests', '/buyer/request-status'] },
        { id: 'orders', patterns: ['/buyer/orders', '/buyer/deliveries', '/my-orders'] },
        { id: 'requirement', patterns: ['/buyer/requirement', '/buyer/requirements', '/buyer/aggregate-details', '/buyer/matched-supply', '/bulk-requirement'] },
        { id: 'logistics', patterns: ['/buyer/book-vehicle', '/book-vehicle', '/farmer/logistics'] },
        { id: 'profile', patterns: ['/buyer/profile'] }
      ].find(item => item.patterns.some(p => pathname === p || pathname.startsWith(`${p}/`)));
      return matched ? matched.id : null;
    } catch {
      return null;
    }
  });

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
    }
  };

  // Read stored buyer profile from localStorage if user updated it
  const [storedBuyerProfile, setStoredBuyerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_buyer_profile_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_buyer_profile_data');
      if (saved) setStoredBuyerProfile(JSON.parse(saved));
    } catch {}
  }, [location.pathname]);

  // Buyer identity details
  const effectiveBuyerName = storedBuyerProfile?.name || user?.name || buyerName || 'FreshMart Procurement';
  const displayBuyerName =
    language === 'ta'
      ? (storedBuyerProfile?.tamilName || 'ஃப்ரெஷ்மார்ட் கொள்முதல் (ஆர். குமார்)')
      : `${effectiveBuyerName} (${storedBuyerProfile?.contactPerson || 'R. Kumar'})`;

  const buyerAvatar =
    storedBuyerProfile?.avatar ||
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
      matchPatterns: ['/buyer/browse', '/buyer/marketplace', '/marketplace', '/buyer/products']
    },
    {
      id: 'requests',
      label: language === 'ta' ? 'என் கோரிக்கைகள்' : 'My Requests',
      path: '/buyer/requests',
      icon: Inbox,
      badgeText: (pendingRequestsCount || 0) > 0 ? `${pendingRequestsCount}` : null,
      badgeInactiveClass: 'bg-amber-100 text-amber-800 font-bold',
      matchPatterns: ['/buyer/requests', '/buyer/request-status']
    },
    {
      id: 'orders',
      label: language === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders',
      path: '/buyer/orders',
      icon: PackageCheck,
      badgeText: (activeOrdersCount || 0) > 0 ? `${activeOrdersCount}` : null,
      badgeInactiveClass: 'bg-emerald-100 text-emerald-800 font-bold',
      matchPatterns: ['/buyer/orders', '/buyer/deliveries', '/my-orders']
    },
    {
      id: 'requirement',
      label: language === 'ta' ? 'மொத்த தேவைகள்' : 'Bulk Requirement',
      path: '/buyer/requirement',
      icon: Boxes,
      matchPatterns: ['/buyer/requirement', '/buyer/requirements', '/buyer/aggregate-details', '/buyer/matched-supply', '/bulk-requirement']
    },
    {
      id: 'logistics',
      label: language === 'ta' ? 'வாகனம் பதிவு' : 'Book Vehicle',
      path: '/buyer/book-vehicle',
      icon: Truck,
      matchPatterns: ['/buyer/book-vehicle', '/book-vehicle', '/farmer/logistics']
    },
    {
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      path: '/buyer/profile',
      icon: User,
      matchPatterns: ['/buyer/profile']
    }
  ];

  // Sync with location changes when navigating
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname !== '/buyer/dashboard' && pathname !== '/buyer' && pathname !== '/consumer') {
      const matched = navTabs.find(tab => 
        !tab.isModalTrigger && 
        tab.id !== 'dashboard' && 
        tab.matchPatterns?.some(p => pathname === p || pathname.startsWith(`${p}/`))
      );
      if (matched) {
        setClickedTabId(matched.id);
      }
    }
  }, [location.pathname]);

  // Helper to determine active state:
  // - Dashboard is active and white ONLY when user clicked it (clickedTabId === 'dashboard')
  // - Other tabs are active when explicitly clicked or their route matches
  const isTabActive = (tab) => {
    if (tab.isModalTrigger) return false;
    if (tab.id === 'dashboard') {
      return clickedTabId === 'dashboard';
    }
    if (clickedTabId) {
      return clickedTabId === tab.id;
    }
    const pathname = location.pathname;
    return tab.matchPatterns.some((pattern) => {
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
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Brand Logo */}
              <Link
                to="/buyer/dashboard"
                onClick={() => setClickedTabId('dashboard')}
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

              {/* Buyer Profile Capsule: Standardized 42px height on mobile with 32px avatar */}
              <Link
                to="/buyer/profile"
                onClick={() => setClickedTabId('profile')}
                className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs flex items-center gap-2 sm:gap-2.5 no-underline hover:bg-amber-50/80 transition-colors min-w-0 cursor-pointer text-inherit"
                title={t('viewBuyerProfile', 'View Buyer Profile')}
              >
                <img
                  src={buyerAvatar}
                  alt={displayBuyerName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
                />
                <div className="flex flex-col text-left leading-tight justify-center min-w-0">
                  <CapsuleMarqueeText
                    text={displayBuyerName}
                    className="font-bold text-slate-900 text-xs sm:text-base leading-tight block"
                    containerClassName="max-w-[110px] xs:max-w-[140px] sm:max-w-[200px]"
                    language={language}
                  />
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs mt-0.5 min-w-0">
                    <CapsuleMarqueeText
                      text={language === 'ta' ? '✔ சரிபார்க்கப்பட்டவர்' : '✔ Verified Buyer'}
                      className="text-[#D97706] font-semibold block"
                      containerClassName="max-w-[110px] xs:max-w-[140px] sm:max-w-none"
                      language={language}
                    />
                    <span className="text-slate-400 hidden lg:inline">•</span>
                    <span className="text-slate-500 text-xs font-medium hidden lg:inline">
                      📍 {language === 'ta' ? 'திண்டுக்கல் மையம்' : 'Dindigul Hub'}
                    </span>
                  </div>
                </div>
              </Link>
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
        <div className="border-t border-slate-100 bg-white d-none d-lg-block">
          <nav className="px-4 sm:px-6 py-2 flex items-center gap-2 max-w-7xl mx-auto overflow-x-auto no-scrollbar scroll-smooth">
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              const active = isTabActive(tab);

              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setClickedTabId(tab.id)}
                  className={`group whitespace-nowrap no-underline cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                    active
                      ? 'bg-[#2563EB] text-white font-semibold rounded-full px-5 py-2 shadow-xs'
                      : 'text-slate-600 hover:bg-[#2563EB] hover:text-white hover:font-semibold hover:shadow-xs rounded-full px-4 py-2 font-medium'
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-slate-500 group-hover:text-white'
                    }`}
                    style={active ? { color: '#ffffff' } : {}}
                  />
                  <span className="text-xs sm:text-sm">{tab.label}</span>

                  {/* Badges inside tabs */}
                  {tab.badgeText && (
                    <span
                      className={`transition-colors ${
                        active
                          ? 'bg-white text-[#2563EB] font-black text-xs px-2 py-0.5 rounded-full ml-1.5'
                          : `${tab.badgeInactiveClass} group-hover:bg-white group-hover:text-[#2563EB] group-hover:font-black text-xs px-2.5 py-0.5 rounded-full ml-1.5`
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
    </>
  );
}
