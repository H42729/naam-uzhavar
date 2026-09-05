/**
 * HomeFloatingActions Component
 * Floating Action Buttons (FAB) stacked one by one in the bottom-right corner of the Home Page.
 *
 * Requirements:
 * 1. Mobile View (< 768px): Visible, stacked one by one (Sign In & Register).
 * 2. Desktop Mode & Tablet (>= 768px): Completely removed / hidden.
 * 3. Supports smooth English & Tamil language transitions.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function HomeFloatingActions() {
  const { language } = useLanguage();

  return (
    <aside
      className="home-floating-actions d-md-none md:hidden fixed z-40 transition-all duration-300 flex flex-col items-end gap-2.5 pointer-events-auto select-none"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        right: '16px'
      }}
      aria-label="Home Quick Floating Actions"
    >
      {/* 1. Sign In Floating Button */}
      <Link
        to="/login"
        id="home-fab-signin"
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full text-white no-underline shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-blue-900/30"
        title={language === 'ta' ? 'உள்நுழையவும்' : 'Sign In'}
      >
        <div className="relative flex items-center justify-center flex-shrink-0">
          <LogIn className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
        </div>

        <span
          key={`signin-${language}`}
          className="font-extrabold text-xs tracking-wide whitespace-nowrap text-white"
        >
          {language === 'ta' ? 'உள்நுழையவும்' : 'Sign In'}
        </span>
      </Link>

      {/* 2. Register Floating Button (Stacked below Sign In, one by one) */}
      <Link
        to="/register"
        id="home-fab-register"
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full text-white no-underline shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 shadow-emerald-900/30"
        title={language === 'ta' ? 'பதிவு செய்க' : 'Register'}
      >
        <div className="relative flex items-center justify-center flex-shrink-0">
          <UserPlus className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
        </div>

        <span
          key={`reg-${language}`}
          className="font-extrabold text-xs tracking-wide whitespace-nowrap text-white"
        >
          {language === 'ta' ? 'பதிவு செய்க' : 'Register'}
        </span>
      </Link>
    </aside>
  );
}
