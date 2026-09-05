/**
 * LogisticsTopNav Component
 * Two-Tier Navigation Header for Logistics / Driver Module.
 * Matches the exact template, design tokens, styling, and behavior of the Buyer and Farmer Modules:
 * - Tier 1: Brand Logo, Soft Cream Profile Capsule (Driver firm & verified badge),
 *   Online/Offline status toggle, Language Switcher, and Logout button.
 * - Tier 2: Horizontal Navigation Tabs with Cobalt Blue active pill (#2563EB) & nested badges.
 * - Responsive 2-Row Mobile Header (Zero overlap between driver capsule and utility controls).
 * - Desktop Tier 2 hidden on mobile (< lg), with dedicated mobile bottom navigation (DriverMobileNav).
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DRIVER_PROFILE } from '../../data/driverData';
import {
  LayoutDashboard,
  MapPin,
  Clock,
  TrendingUp,
  Truck,
  User,
  LogOut,
  ShoppingBag
} from 'lucide-react';

export default function LogisticsTopNav({
  activeDeliveryId = 'ORD-1030',
  isOnline = true,
  onToggleOnline,
  onLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // Track explicitly clicked tab (Dashboard is unselected by default on initial page load)
  const [clickedTabId, setClickedTabId] = useState(() => {
    try {
      const pathname = window.location.pathname;
      if (pathname === '/driver/requests' || pathname === '/driver/dashboard' || pathname === '/driver') {
        return null; // Not selected by default on initial load
      }
      const matched = [
        { id: 'active', patterns: ['/driver/active', '/driver/routes', '/driver/route', '/routes', '/route'] },
        { id: 'buyer-requests', patterns: ['/driver/buyer-requests', '/driver/buyer-request'] },
        { id: 'history', patterns: ['/driver/history'] },
        { id: 'summary', patterns: ['/driver/summary', '/driver/trips'] },
        { id: 'profile', patterns: ['/driver/profile'] }
      ].find(item => item.patterns.some(p => pathname === p || pathname.startsWith(`${p}/`)));
      return matched ? matched.id : null;
    } catch {
      return null;
    }
  });

  // Online / Offline status with localStorage persistence
  const [internalOnline, setInternalOnline] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_online_status');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const effectiveOnline = onToggleOnline ? isOnline : internalOnline;

  const handleToggleOnline = () => {
    if (onToggleOnline) {
      onToggleOnline();
    } else {
      setInternalOnline((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('naam_uzhavar_driver_online_status', JSON.stringify(next));
        } catch {}
        return next;
      });
    }
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

  // Read stored driver profile from localStorage if user updated it
  const [storedDriverProfile, setStoredDriverProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_profile_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_profile_data');
      if (saved) setStoredDriverProfile(JSON.parse(saved));
    } catch {}
  }, [location.pathname]);

  // Driver identity details
  const effectiveDriverName = storedDriverProfile?.name || user?.name || DRIVER_PROFILE.name || 'Raj Kumar';
  const effectiveFirm = 'Murugan Logistics';
  const displayDriverName =
    language === 'ta'
      ? `${effectiveFirm} (${storedDriverProfile?.tamilName || DRIVER_PROFILE.tamilName || 'ராஜ்குமார்'})`
      : `${effectiveFirm} (${effectiveDriverName})`;

  const driverAvatar =
    storedDriverProfile?.avatar ||
    user?.avatar ||
    DRIVER_PROFILE.avatar ||
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80';

  // Tier 2 Navigation Items definition matching Buyer template
  const navTabs = [
    {
      id: 'dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      path: '/driver/requests',
      icon: LayoutDashboard,
      badgeText: '3',
      badgeInactiveClass: 'bg-amber-100 text-amber-800 font-bold',
      matchPatterns: ['/driver/requests', '/driver/dashboard', '/driver']
    },
    {
      id: 'active',
      label: language === 'ta' ? 'நடப்பு டெலிவரி' : 'Active Delivery',
      path: '/driver/active',
      icon: MapPin,
      badgeText: activeDeliveryId || 'ORD-1030',
      badgeInactiveClass: 'bg-emerald-100 text-emerald-800 font-bold',
      matchPatterns: ['/driver/active', '/driver/routes', '/driver/route', '/routes', '/route']
    },
    {
      id: 'history',
      label: language === 'ta' ? 'டெலிவரி வரலாறு' : 'Delivery History',
      path: '/driver/history',
      icon: Clock,
      matchPatterns: ['/driver/history']
    },
    {
      id: 'summary',
      label: language === 'ta' ? 'பயணச் சுருக்கம்' : 'Trip Summary',
      path: '/driver/summary',
      icon: TrendingUp,
      matchPatterns: ['/driver/summary', '/driver/trips']
    },
    {
      id: 'buyer-requests',
      label: language === 'ta' ? 'வாங்குபவர் கோரிக்கைகள்' : 'Buyer Requests',
      path: '/driver/buyer-requests',
      icon: ShoppingBag,
      badgeText: '4 New',
      badgeInactiveClass: 'bg-emerald-100 text-emerald-800 font-bold',
      matchPatterns: ['/driver/buyer-requests', '/driver/buyer-request']
    },
    {
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      path: '/driver/profile',
      icon: User,
      matchPatterns: ['/driver/profile']
    }
  ];

  // Sync with location changes when navigating
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname !== '/driver/requests' && pathname !== '/driver/dashboard' && pathname !== '/driver') {
      const matched = navTabs.find(tab => 
        tab.id !== 'dashboard' && 
        tab.matchPatterns?.some(p => pathname === p || pathname.startsWith(`${p}/`))
      );
      if (matched) {
        setClickedTabId(matched.id);
      }
    }
  }, [location.pathname]);

  // Helper to determine active state:
  // - Dashboard is active ONLY when user clicked it (clickedTabId === 'dashboard')
  // - Other tabs are active when explicitly clicked or their route matches
  const isTabActive = (tab) => {
    if (tab.id === 'dashboard') {
      return clickedTabId === 'dashboard';
    }
    if (clickedTabId) {
      return clickedTabId === tab.id;
    }
    const pathname = location.pathname;
    return tab.matchPatterns.some((pattern) => {
      if (pattern === '/driver/active' || pattern === '/driver/routes' || pattern === '/driver/route') {
        return (
          pathname === '/driver/active' ||
          pathname.startsWith('/driver/active/') ||
          pathname.startsWith('/driver/routes') ||
          pathname.startsWith('/driver/route') ||
          pathname.startsWith('/routes') ||
          pathname.startsWith('/route')
        );
      }
      return pathname === pattern || pathname.startsWith(`${pattern}/`);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
        {/* =====================================================================
            TIER 1: IDENTITY, DRIVER PROFILE & KEY UTILITY CONTROLS
            ===================================================================== */}
        <div className="w-full bg-white">
          {/* Top Row: Brand Logo, Driver Profile on Left, Desktop Controls & Logout on Right */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 max-w-7xl mx-auto gap-2 sm:gap-4">
            
            {/* Left Section: Brand Logo, Divider, Driver Profile Capsule */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Brand Logo */}
              <Link
                to="/driver/requests"
                onClick={() => setClickedTabId('dashboard')}
                className="flex items-center gap-1.5 sm:gap-2 no-underline group flex-shrink-0"
                title="Naam Uzhavar Logistics"
              >
                <img
                  src="/naam-uzhavar-logo-transparent.png"
                  alt="Naam Uzhavar"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Vertical Hairline Divider */}
              <div className="h-7 sm:h-8 w-px bg-slate-200 mx-0.5 sm:mx-2 hidden sm:block flex-shrink-0" aria-hidden="true" />

              {/* Driver Profile Capsule: Standardized 42px height on mobile with 32px avatar */}
              <Link
                to="/driver/profile"
                onClick={() => setClickedTabId('profile')}
                className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs flex items-center gap-2 sm:gap-2.5 no-underline hover:bg-amber-50/80 transition-colors min-w-0 cursor-pointer text-inherit"
                title={language === 'ta' ? 'ஓட்டுநர் சுயவிவரத்தைக் காண்க' : 'View Driver Profile'}
              >
                <img
                  src={driverAvatar}
                  alt={displayDriverName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
                />
                <div className="flex flex-col text-left leading-tight justify-center min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-base leading-tight block truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[200px]">
                    {displayDriverName}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs mt-0.5 min-w-0">
                    <span className="text-[#D97706] font-semibold truncate block max-w-[110px] xs:max-w-[140px] sm:max-w-none">
                      ✔ {language === 'ta' ? 'சரிபார்க்கப்பட்ட ஓட்டுநர்' : 'Verified Driver'}
                    </span>
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
                  effectiveOnline
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-800 hover:bg-emerald-200/80'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200/80'
                }`}
                title={effectiveOnline ? 'Status: Online (Accepting Direct Logistics Trips)' : 'Status: Offline'}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    effectiveOnline ? 'bg-[#059669] animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {effectiveOnline
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
                title="Logout from Naam Uzhavar Logistics"
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
                  effectiveOnline
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
                title={effectiveOnline ? 'Status: Online' : 'Status: Offline'}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    effectiveOnline ? 'bg-[#059669] animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {effectiveOnline
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
            TIER 2: HORIZONTAL LOGISTICS NAVIGATION TABS (COBALT BLUE ACTIVE PILL)
            Desktop only (hidden on mobile < lg to avoid duplicate navbars)
            ===================================================================== */}
        <div className="border-t border-slate-100 bg-white hidden lg:block">
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
