/**
 * DriverMobileNav Component
 * Responsive, 1-thumb mobile bottom navigation bar for Logistics / Driver Module (< lg).
 * Matches the exact styling, Cobalt Blue (#2563EB) active indicator, and tokens of the Buyer and Farmer Modules.
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  MapPin,
  Clock,
  TrendingUp,
  User
} from 'lucide-react';

export default function DriverMobileNav() {
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/driver/requests',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      icon: LayoutDashboard,
      badge: '3',
      badgeColor: 'bg-amber-500 text-white',
      matchPatterns: ['/driver/requests', '/driver/dashboard', '/driver']
    },
    {
      to: '/driver/active',
      label: language === 'ta' ? 'நடப்பு' : 'Active',
      icon: MapPin,
      badge: 'ORD-1030',
      badgeColor: 'bg-emerald-600 text-white',
      matchPatterns: ['/driver/active', '/driver/routes', '/driver/route', '/routes', '/route']
    },
    {
      to: '/driver/history',
      label: language === 'ta' ? 'வரலாறு' : 'History',
      icon: Clock,
      matchPatterns: ['/driver/history']
    },
    {
      to: '/driver/summary',
      label: language === 'ta' ? 'சுருக்கம்' : 'Summary',
      icon: TrendingUp,
      matchPatterns: ['/driver/summary', '/driver/trips']
    },
    {
      to: '/driver/profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      icon: User,
      matchPatterns: ['/driver/profile']
    }
  ];

  return (
    <nav
      className="d-lg-none lg:hidden fixed bottom-0 start-0 end-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg z-50 farm-mobile-nav"
      style={{ minHeight: '60px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Driver Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-full py-1 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchPatterns.some((pattern) => {
            if (pattern === '/driver/requests') {
              return (
                location.pathname === '/driver/requests' ||
                location.pathname === '/driver/dashboard' ||
                location.pathname === '/driver'
              );
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
              <span className="text-[10px] sm:text-xs mt-0.5 leading-none block font-medium truncate max-w-[64px]">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
