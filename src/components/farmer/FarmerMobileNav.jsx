/**
 * FarmerMobileNav Component
 * Modern, responsive bottom navigation bar for the Farmer Module on mobile devices (< lg).
 * Matches the Farmer Module Cobalt Blue theme (#2563EB):
 * - Dashboard (/farmer/dashboard)
 * - My Harvest (/farmer/harvest)
 * - Requests (/farmer/requests)
 * - AI Demand (/farmer/demand-forecast) [Replaced Messages]
 * - Orders (/farmer/orders)
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  Inbox,
  Sparkles,
  PackageCheck
} from 'lucide-react';

export default function FarmerMobileNav() {
  const { stats } = useFarmer();
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/farmer/dashboard',
      label: language === 'ta' ? 'முகப்பு' : 'Dashboard',
      icon: LayoutDashboard,
      matchPatterns: ['/farmer/dashboard', '/farmer']
    },
    {
      to: '/farmer/harvest',
      label: language === 'ta' ? 'விளைச்சல்' : 'Harvest',
      icon: Sprout,
      matchPatterns: ['/farmer/harvest', '/farmer/crops', '/farmer/products', '/farmer/add-harvest', '/farmer/add-product']
    },
    {
      to: '/farmer/requests',
      label: language === 'ta' ? 'கோரிக்கைகள்' : 'Requests',
      icon: Inbox,
      badge: (stats?.buyerRequests || 0) > 0 ? stats.buyerRequests : null,
      badgeColor: 'bg-amber-500 text-white',
      matchPatterns: ['/farmer/requests']
    },
    {
      to: '/farmer/demand-forecast',
      label: language === 'ta' ? 'AI தேவை' : 'AI Demand',
      icon: Sparkles,
      matchPatterns: ['/farmer/demand-forecast', '/farmer/supply-pool']
    },
    {
      to: '/farmer/orders',
      label: language === 'ta' ? 'ஆர்டர்கள்' : 'Orders',
      icon: PackageCheck,
      badge: (stats?.deliveries || 0) > 0 ? stats.deliveries : null,
      badgeColor: 'bg-emerald-600 text-white',
      matchPatterns: ['/farmer/orders', '/farmer/deliveries', '/farmer/history']
    }
  ];

  return (
    <nav
      className="farm-mobile-nav d-lg-none lg:hidden fixed bottom-0 start-0 end-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg z-50"
      style={{ minHeight: '60px' }}
      aria-label="Farmer Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-full py-1 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchPatterns.some((pattern) => {
            if (pattern === '/farmer/dashboard' || pattern === '/farmer') {
              return location.pathname === '/farmer/dashboard' || location.pathname === '/farmer';
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
