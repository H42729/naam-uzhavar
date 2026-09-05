/**
 * DriverFloatingBuyerRequests Component
 * Floating Action Button (FAB) positioned in the bottom-right corner of the Logistics / Driver module.
 * Displays quick shortcut to Buyer Requests (/driver/buyer-requests) with:
 * - Live pending buyer consignment count badge with subtle pulse animation
 * - ShoppingBag icon with smooth hover scale
 * - Expandable text pill on tablet/desktop, compact circular FAB on ultra-small mobile
 * - Positioned safely above the mobile bottom nav on mobile (bottom-20 right-4) and bottom-8 right-8 on desktop
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function DriverFloatingBuyerRequests() {
  const { language } = useLanguage();
  const location = useLocation();

  // Read current pending buyer requests count from localStorage
  const [pendingCount, setPendingCount] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_buyer_requests');
      if (saved) {
        const list = JSON.parse(saved);
        const p = list.filter((r) => r.status === 'Pending').length;
        return p;
      }
      return 4; // Default initial sample count
    } catch {
      return 4;
    }
  });

  // Sync count when location or storage changes
  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('naam_uzhavar_driver_buyer_requests');
        if (saved) {
          const list = JSON.parse(saved);
          const p = list.filter((r) => r.status === 'Pending').length;
          setPendingCount(p);
        }
      } catch {}
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [location.pathname]);

  const isCurrentPage =
    location.pathname === '/driver/buyer-requests' ||
    location.pathname === '/driver/buyer-request';

  return (
    <aside
      className="driver-floating-requests d-md-none fixed z-40 transition-all duration-300"
      style={{
        /* Positioned above mobile bottom bar (60px) on mobile, hidden on desktop and laptop (>= 768px) */
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)',
        right: '16px'
      }}
      aria-label="Buyer Logistics Requests Quick Access"
    >
      <Link
        to="/driver/buyer-requests"
        className={`group flex items-center gap-2 sm:gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-full text-white no-underline shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 select-none ${
          isCurrentPage
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 ring-4 ring-emerald-300/60 shadow-emerald-900/30'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-600'
        }`}
        title={language === 'ta' ? 'வாங்குபவர் கோரிக்கைகள் காண்க' : 'View Buyer Consignment Requests'}
      >
        {/* Icon & Ping Badge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform group-hover:scale-110" />
          
          {pendingCount > 0 && (
            <span className="absolute -top-2 -right-2.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 text-slate-950 font-black text-[10px] items-center justify-center shadow-xs">
                {pendingCount}
              </span>
            </span>
          )}
        </div>

        {/* Text Label with smooth language transition */}
        <div className="flex flex-col text-left leading-tight hidden xs:flex">
          <span
            key={language}
            className="font-extrabold text-xs sm:text-sm tracking-wide drv-lang-shift whitespace-nowrap text-white"
          >
            {language === 'ta' ? 'வாங்குபவர் கோரிக்கைகள்' : 'Buyer Requests'}
          </span>
          <span className="text-[10px] text-blue-100/90 font-medium hidden sm:inline">
            {language === 'ta' ? 'சரக்கு எடுப்பு வாய்ப்புகள்' : 'New Consignments'}
          </span>
        </div>

        {/* Count pill badge on desktop */}
        <span className="bg-white/25 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-full hidden md:inline-flex items-center gap-1 border border-white/20">
          <span>{pendingCount}</span>
          <span className="text-[10px] font-semibold">{language === 'ta' ? 'புதியது' : 'New'}</span>
        </span>

        {/* Small Arrow indicator on hover */}
        <ArrowRight className="w-3.5 h-3.5 text-white/80 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all hidden sm:inline-block" />
      </Link>
    </aside>
  );
}
