/**
 * LogisticsTopNav Component
 * Ergonomic, High-Usability Two-Tier Navigation Header for Logistics / Driver Module.
 * Strictly designed for field workers and drivers: generous touch targets (≥44px),
 * high contrast outdoors under direct sunlight, warm amber-orange active pill (#D97706),
 * and unambiguous status feedback without decorative clutter.
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DRIVER_PROFILE } from '../../data/driverData';
import {
  PackageCheck,
  MapPin,
  Clock,
  TrendingUp,
  User,
  Bell,
  LogOut,
  Truck
} from 'lucide-react';

export default function LogisticsTopNav({
  activeDeliveryId = 'ORD-1030',
  isOnline = true,
  onToggleOnline
}) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Internal online status with localStorage fallback
  const [internalOnline, setInternalOnline] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_online_status');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const isCurrentOnline = onToggleOnline ? isOnline : internalOnline;

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

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (logout) logout();
    navigate('/login');
  };

  // Driver identity info
  const driverFirm = 'Murugan Logistics';
  const driverAvatar =
    user?.avatar ||
    DRIVER_PROFILE.avatar ||
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80';

  // Tier 2 Navigation Tabs Definition
  const navTabs = [
    {
      id: 'requests',
      label: language === 'ta' ? 'டெலிவரி கோரிக்கைகள்' : 'Delivery Requests',
      path: '/driver/requests',
      icon: PackageCheck,
      badgeText: language === 'ta' ? '3 புதியது' : '3 New',
      matchPatterns: ['/driver/requests', '/driver/dashboard']
    },
    {
      id: 'active',
      label: language === 'ta' ? 'நடப்பு டெலிவரி' : 'Active Delivery',
      path: '/driver/active',
      icon: MapPin,
      badgeText: activeDeliveryId || 'ORD-1030',
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
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      path: '/driver/profile',
      icon: User,
      matchPatterns: ['/driver/profile']
    }
  ];

  // Helper to determine active state across base paths and subroutes
  const isTabActive = (tab) => {
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* =====================================================================
          TIER 1: IDENTITY & KEY OPERATIONAL CONTROLS
          ===================================================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left Side: Clear Identity */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Brand Logo */}
            <Link
              to="/driver/requests"
              className="flex items-center gap-2 no-underline group flex-shrink-0 min-h-[44px]"
              title="Naam Uzhavar Logistics"
            >
              <img
                src="/naam-uzhavar-logo-transparent.png"
                alt="Naam Uzhavar"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Clean vertical divider */}
            <div className="h-8 w-px bg-slate-200 mx-1 sm:mx-2 hidden sm:block flex-shrink-0" />

            {/* Driver Profile Block */}
            <Link
              to="/driver/profile"
              className="flex items-center gap-3 p-1 rounded-2xl hover:bg-amber-50/50 transition-colors no-underline flex-shrink-0 min-h-[44px]"
              title="View Driver Profile"
            >
              <img
                src={driverAvatar}
                alt={driverFirm}
                className="w-11 h-11 rounded-full border-2 border-amber-500 object-cover flex-shrink-0"
              />
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-900 text-base leading-tight block truncate max-w-[140px] sm:max-w-[200px]">
                  {driverFirm}
                </span>
                <div className="flex items-center gap-1.5 text-xs mt-0.5 flex-wrap">
                  <span className="text-[#D97706] font-bold text-xs">
                    ✔ {language === 'ta' ? 'சரிபார்க்கப்பட்ட ஓட்டுநர்' : 'Verified Driver'}
                  </span>
                  <span className="text-slate-300 hidden md:inline">•</span>
                  <span className="text-slate-500 text-xs font-medium hidden md:inline">
                    📍 {language === 'ta' ? 'திண்டுக்கல் மையம்' : 'Dindigul Hub'}
                  </span>
                </div>
              </div>
            </Link>

            {/* Vehicle Quick Info (Visible pill on desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>TN-57-AB-4029</span>
              <span className="text-amber-300">|</span>
              <span>Max: 750 kg</span>
            </div>
          </div>

          {/* Right Side: Daily Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* 1. Online / Offline Work Switch */}
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`min-h-[44px] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer select-none border ${
                isCurrentOnline
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                  : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
              }`}
              title={isCurrentOnline ? 'Online - Accepting Trips' : 'Offline'}
            >
              <span>
                {isCurrentOnline
                  ? language === 'ta'
                    ? '● ஆன்லைன் (பயணங்கள் ஏற்கப்படுகின்றன)'
                    : '● Online (Accepting Trips)'
                  : language === 'ta'
                  ? '○ ஆஃப்லைன்'
                  : '○ Offline'}
              </span>
            </button>

            {/* 2. Language Switcher */}
            <div
              className="bg-slate-100 border border-slate-200 rounded-xl p-1 flex items-center gap-1 min-h-[44px]"
              role="group"
              aria-label="Language selector"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all border-0 cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
                title="Switch to English"
              >
                English
              </button>
              <span className="text-slate-300 text-xs font-bold">|</span>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all border-0 cursor-pointer ${
                  language === 'ta'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
                title="தமிழுக்கு மாறவும்"
              >
                தமிழ்
              </button>
            </div>

            {/* 3. Notification Bell */}
            <Link
              to="/driver/requests"
              className="relative w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-slate-100 hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-[#D97706] flex items-center justify-center transition-colors no-underline flex-shrink-0"
              title="Notifications (2)"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-xs font-extrabold flex items-center justify-center shadow-xs">
                2
              </span>
            </Link>

            {/* 4. Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[44px] text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              title="Log out of driver terminal"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TIER 2: INTUITIVE HORIZONTAL NAVIGATION BAR
          ===================================================================== */}
      <div className="bg-slate-50/50 border-t border-slate-100">
        <nav className="max-w-7xl mx-auto flex items-center gap-2.5 px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          {navTabs.map((tab) => {
            const IconComponent = tab.icon;
            const active = isTabActive(tab);

            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={`whitespace-nowrap no-underline transition-colors cursor-pointer min-h-[44px] flex items-center gap-2 ${
                  active
                    ? 'bg-[#D97706] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs'
                    : 'text-[#0F172A] hover:text-[#D97706] hover:bg-amber-50/70 font-semibold px-4 py-2.5 rounded-xl'
                }`}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-600'}`} />
                <span className="text-sm sm:text-base">{tab.label}</span>

                {/* Badges inside tabs */}
                {tab.badgeText && (
                  <span
                    className={`rounded-full transition-colors ${
                      active
                        ? 'bg-white text-[#D97706] font-extrabold text-xs px-2.5 py-0.5'
                        : 'bg-amber-100 text-[#92400E] font-bold text-xs px-2 py-0.5 rounded-full'
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
