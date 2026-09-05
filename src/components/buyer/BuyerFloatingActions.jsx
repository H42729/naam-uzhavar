/**
 * BuyerFloatingActions Component
 * Floating Action Buttons (FAB) stacked one by one in the bottom-right corner of the Buyer Module.
 * Features:
 * 1. Book Vehicle Floating Button (/book-vehicle)
 * 2. Profile Floating Button (/buyer/profile)
 *
 * Positioned cleanly above the mobile bottom nav on mobile screens, and at the bottom-right on desktop.
 * Includes smooth language transition when switching between English and Tamil.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Truck, User, ArrowRight } from 'lucide-react';

export default function BuyerFloatingActions() {
  const { language } = useLanguage();
  const location = useLocation();

  const isBookVehicleActive =
    location.pathname === '/book-vehicle' ||
    location.pathname === '/buyer/book-vehicle';

  const isProfileActive =
    location.pathname === '/buyer/profile';

  return (
    <aside
      className="buyer-floating-actions d-md-none fixed z-40 transition-all duration-300 flex flex-col items-end gap-2.5 pointer-events-auto select-none"
      style={{
        /* Positioned above mobile bottom bar (60px) on mobile, hidden on desktop and laptop (>= 768px) */
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)',
        right: '16px'
      }}
      aria-label="Buyer Quick Floating Actions"
    >
      {/* 1. Book Vehicle Floating Button */}
      <Link
        to="/buyer/book-vehicle"
        className={`group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-white no-underline shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer ${
          isBookVehicleActive
            ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 ring-4 ring-blue-300/60 shadow-blue-950/40'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-600'
        }`}
        title={language === 'ta' ? 'வாகனம் பதிவு செய்க' : 'Book Logistics Vehicle'}
      >
        <div className="relative flex items-center justify-center flex-shrink-0">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:scale-110" />
        </div>

        <div className="flex flex-col text-left leading-tight hidden xs:flex">
          <span
            key={`bv-${language}`}
            className="font-extrabold text-xs sm:text-sm tracking-wide buyer-nav-scroll-anim whitespace-nowrap text-white"
          >
            {language === 'ta' ? 'வாகனம் பதிவு' : 'Book Vehicle'}
          </span>
          <span className="text-[10px] text-blue-100/90 font-medium hidden sm:inline">
            {language === 'ta' ? 'சரக்கு வாகனம்' : 'Logistics Dispatch'}
          </span>
        </div>

        <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full hidden md:inline-flex items-center border border-white/15">
          {language === 'ta' ? 'சரக்கு' : 'Transport'}
        </span>

        <ArrowRight className="w-3 h-3 text-white/80 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all hidden sm:inline-block" />
      </Link>

      {/* 2. Profile Floating Button (Stacked below Book Vehicle, one by one) */}
      <Link
        to="/buyer/profile"
        className={`group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-white no-underline shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer ${
          isProfileActive
            ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 ring-4 ring-emerald-300/60 shadow-emerald-950/40'
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-900/30 hover:from-emerald-500 hover:to-teal-600'
        }`}
        title={language === 'ta' ? 'சுயவிவரத்தைக் காண்க' : 'View Buyer Profile'}
      >
        <div className="relative flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:scale-110" />
        </div>

        <div className="flex flex-col text-left leading-tight hidden xs:flex">
          <span
            key={`pf-${language}`}
            className="font-extrabold text-xs sm:text-sm tracking-wide buyer-nav-scroll-anim whitespace-nowrap text-white"
          >
            {language === 'ta' ? 'சுயவிவரம்' : 'Profile'}
          </span>
          <span className="text-[10px] text-emerald-100/90 font-medium hidden sm:inline">
            {language === 'ta' ? 'கணக்கு விவரங்கள்' : 'Buyer Account'}
          </span>
        </div>

        <span className="bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full hidden md:inline-flex items-center border border-white/15">
          {language === 'ta' ? 'வாங்குபவர்' : 'Buyer'}
        </span>

        <ArrowRight className="w-3 h-3 text-white/80 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all hidden sm:inline-block" />
      </Link>
    </aside>
  );
}
