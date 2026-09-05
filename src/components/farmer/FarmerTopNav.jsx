/**
 * FarmerTopNav Component
 * Responsive Two-Tier Top Navigation Header for Farmer Module.
 * Preserves the exact Farmer Module tokens & color scheme:
 * - Deep Cobalt Blue active navigation pill (#2563EB)
 * - Navigation: Dashboard, My Harvest, Delivery Requests, Active Orders,
 *   AI Demand, Profile.
 * - Online / Offline toggle button with emerald/slate styling.
 * - Farmer profile metadata, Farmgate ID & Active Land tag, Language Switcher,
 *   and Logout button (notification icon removed).
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  Inbox,
  PackageCheck,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';

export default function FarmerTopNav() {
  const { user, logout } = useAuth();
  const { farmerProfile } = useFarmer();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Farmgate online/offline status with localStorage persistence
  const [isOnline, setIsOnline] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_farmgate_status');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('naam_uzhavar_farmgate_status', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (logout) logout();
    navigate('/login');
  };

  // Farmer identity details
  const farmerName =
    language === 'ta'
      ? 'ரவி பண்ணை (ஆர். ரவி)'
      : farmerProfile?.name
      ? `${farmerProfile.name} Farms (R. Ravi)`
      : 'Ravi Farms (R. Ravi)';

  const farmerAvatar =
    farmerProfile?.avatar ||
    user?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80';

  // Tier 2 Navigation Items: Dashboard, My Harvest, Requests, Orders, AI Demand, Profile
  const navTabs = [
    {
      id: 'dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      path: '/farmer/dashboard',
      icon: LayoutDashboard,
      matchPatterns: ['/farmer/dashboard']
    },
    {
      id: 'harvest',
      label: language === 'ta' ? 'என் விளைச்சல்' : 'My Harvest',
      path: '/farmer/harvest',
      icon: Sprout,
      badgeText: language === 'ta' ? '9 பட்டியல்' : '9 Listed',
      badgeInactiveClass: 'bg-[#E2E8F0] text-[#475569] font-bold',
      matchPatterns: ['/farmer/harvest', '/farmer/crops', '/farmer/products', '/farmer/add-harvest', '/farmer/add-product']
    },
    {
      id: 'requests',
      label: language === 'ta' ? 'டெலிவரி கோரிக்கைகள்' : 'Delivery Requests',
      path: '/farmer/requests',
      icon: Inbox,
      badgeText: language === 'ta' ? '3 புதியது' : '3 New',
      badgeInactiveClass: 'bg-[#FEF3C7] text-[#92400E] font-bold',
      matchPatterns: ['/farmer/requests']
    },
    {
      id: 'orders',
      label: language === 'ta' ? 'நடப்பு ஆர்டர்கள்' : 'Active Orders',
      path: '/farmer/orders',
      icon: PackageCheck,
      badgeText: language === 'ta' ? '6 நடப்பு' : '6 Active',
      badgeInactiveClass: 'bg-[#D1FAE5] text-[#065F46] font-bold',
      matchPatterns: ['/farmer/orders', '/farmer/deliveries', '/farmer/history']
    },
    {
      id: 'ai-demand',
      label: language === 'ta' ? 'AI தேவை' : 'AI Demand',
      path: '/farmer/demand-forecast',
      icon: Sparkles,
      badgeText: 'ORD-1030',
      badgeInactiveClass: 'bg-[#EEF2FF] text-[#4F46E5] font-semibold',
      matchPatterns: ['/farmer/demand-forecast', '/farmer/supply-pool']
    },
    {
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      path: '/farmer/profile',
      icon: User,
      matchPatterns: ['/farmer/profile']
    }
  ];

  // Helper to determine active state
  const isTabActive = (tab) => {
    const pathname = location.pathname;
    return tab.matchPatterns.some((pattern) => {
      if (pattern === '/farmer/dashboard') {
        return pathname === '/farmer/dashboard' || pathname === '/farmer';
      }
      return pathname === pattern || pathname.startsWith(`${pattern}/`);
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      {/* =====================================================================
          TIER 1: IDENTITY, FARMER PROFILE & KEY UTILITY CONTROLS
          ===================================================================== */}
      <div className="w-full bg-white">
        {/* Top Row: Brand Logo, Farmer Profile on Left, Desktop Utilities & Logout on Right */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 max-w-7xl mx-auto gap-2 sm:gap-4">
          
          {/* Left Section: Brand Identity, Divider, Farmer Profile Capsule */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Brand Identity */}
            <Link
              to="/farmer/dashboard"
              className="flex items-center gap-1.5 sm:gap-2 no-underline group flex-shrink-0"
              title="Naam Uzhavar Farmer Portal"
            >
              <img
                src="/naam-uzhavar-logo-transparent.png"
                alt="Naam Uzhavar"
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Vertical Hairline Divider */}
            <div className="h-7 sm:h-8 w-px bg-slate-200 mx-0.5 sm:mx-2 hidden sm:block flex-shrink-0" aria-hidden="true" />

            {/* Farmer Profile Capsule: Standardized 42px height on mobile with 32px avatar */}
            <Link
              to="/farmer/profile"
              className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-2xs flex items-center gap-2 sm:gap-2.5 no-underline hover:bg-amber-50/80 transition-colors min-w-0 cursor-pointer text-inherit"
              title={farmerName}
            >
              <img
                src={farmerAvatar}
                alt={farmerName}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
              />
              <div className="flex flex-col text-left leading-tight justify-center min-w-0">
                <span className="font-bold text-slate-900 text-xs sm:text-base leading-tight block truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[200px]">
                  {farmerName}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs mt-0.5 flex-wrap min-w-0">
                  <span className="text-[#D97706] font-semibold truncate max-w-[110px] xs:max-w-[140px] sm:max-w-none">
                    ✔ {language === 'ta' ? 'சரிபார்க்கப்பட்ட விவசாயி' : 'Verified Farmer'}
                  </span>
                  <span className="text-slate-400 hidden lg:inline">•</span>
                  <span className="text-slate-500 text-xs font-medium hidden lg:inline">
                    📍 {language === 'ta' ? 'திண்டுக்கல் மையம்' : 'Dindigul Hub'}
                  </span>
                </div>
              </div>
            </Link>

            {/* Farm Information Capsule (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 bg-[#FFFDF5] border border-[#FDE68A] text-slate-700 text-xs px-3.5 py-1.5 rounded-xl font-medium shadow-2xs flex-shrink-0">
              <span className="font-semibold text-amber-900">🌾 Farmgate ID: FG-57-TN</span>
              <span className="text-amber-300">|</span>
              <span>Active Land: 4.5 Acres</span>
            </div>
          </div>

          {/* Right Section: Desktop Controls & Logout Button */}
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
              onClick={handleLogout}
              className="border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-[#E11D48] text-xs font-bold px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 min-h-[34px] sm:min-h-[38px]"
              title="Logout from Naam Uzhavar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Row 2: Online/Offline Button and Language Switcher brought to the next line */}
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
          TIER 2: HORIZONTAL FARMER NAVIGATION TABS (DESKTOP ONLY - HIDDEN ON MOBILE)
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
  );
}
