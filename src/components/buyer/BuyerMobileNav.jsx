/**
 * BuyerMobileNav Component
 * Responsive, 1-thumb mobile bottom navigation bar for Buyer Module (< lg).
 * Matches the exact styling, Cobalt Blue (#2563EB) active indicator, and tokens of the Farmer Module.
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Inbox,
  Boxes,
  PackageCheck
} from 'lucide-react';

export default function BuyerMobileNav() {
  const { pendingRequestsCount, activeOrdersCount } = useBuyer();
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/buyer/dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      icon: LayoutDashboard,
      matchPatterns: ['/buyer/dashboard', '/buyer', '/consumer']
    },
    {
      to: '/buyer/browse',
      label: language === 'ta' ? 'சந்தை' : 'Marketplace',
      icon: ShoppingBag,
      matchPatterns: ['/buyer/browse', '/buyer/marketplace', '/marketplace', '/buyer/products']
    },
    {
      to: '/buyer/requests',
      label: language === 'ta' ? 'கோரிக்கைகள்' : 'Requests',
      icon: Inbox,
      badge: (pendingRequestsCount || 0) > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-amber-500 text-white',
      matchPatterns: ['/buyer/requests', '/buyer/request-status']
    },
    {
      to: '/buyer/requirement',
      label: language === 'ta' ? 'தேவைகள்' : 'Bulk',
      icon: Boxes,
      matchPatterns: ['/buyer/requirement', '/buyer/requirements', '/bulk-requirement']
    },
    {
      to: '/buyer/orders',
      label: language === 'ta' ? 'ஆர்டர்கள்' : 'Orders',
      icon: PackageCheck,
      badge: (activeOrdersCount || 0) > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-emerald-600 text-white',
      matchPatterns: ['/buyer/orders', '/buyer/deliveries', '/my-orders']
    }
  ];

  return (
    <nav
      className="d-lg-none lg:hidden fixed bottom-0 start-0 end-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg z-50 farm-mobile-nav"
      style={{ minHeight: '60px' }}
      aria-label="Buyer Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-full py-1 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchPatterns.some((pattern) => {
            if (pattern === '/buyer/dashboard') {
              return location.pathname === '/buyer/dashboard' || location.pathname === '/buyer' || location.pathname === '/consumer';
            }
            return location.pathname === pattern || location.pathname.startsWith(`${pattern}/`);
          });

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center text-center no-underline py-1 px-1 transition-colors relative min-w-[54px] min-h-[48px] rounded-xl select-none ${
                isActive
                  ? 'text-[#2563EB] font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active top indicator pill */}
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 bg-[#2563EB] rounded-full" />
              )}
              <div className="relative inline-flex items-center justify-center mt-0.5">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-black rounded-full px-1.5 py-0.2 leading-tight shadow-xs ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight mt-1 truncate max-w-[62px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
