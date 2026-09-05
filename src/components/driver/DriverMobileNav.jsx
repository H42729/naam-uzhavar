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

// Subcomponent to measure text and smoothly scroll long Tamil words without truncation
function DriverNavLabel({ label, to, isActive, language }) {
  const containerRef = React.useRef(null);
  const textRef = React.useRef(null);
  const isKnownLong = label === 'சுயவிவரம்' || label.length > 8;
  const [shouldScroll, setShouldScroll] = React.useState(isKnownLong);
  const [scrollDistance, setScrollDistance] = React.useState(isKnownLong ? 20 : 0);

  React.useLayoutEffect(() => {
    const measure = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        if (textWidth > containerWidth + 2) {
          setShouldScroll(true);
          setScrollDistance(Math.ceil(textWidth - containerWidth + 6));
        } else {
          setShouldScroll(false);
          setScrollDistance(0);
        }
      }
    };

    measure();
    const timer = setTimeout(measure, 40);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, [label, language]);

  return (
    <div
      ref={containerRef}
      className="drv-nav-label-container mt-0.5"
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        maxWidth: '72px',
        minHeight: '16px'
      }}
    >
      <div
        key={`anim-${to}-${language}`}
        className="drv-lang-shift w-full flex items-center"
        style={{
          justifyContent: shouldScroll ? 'flex-start' : 'center',
          width: '100%'
        }}
      >
        <span
          ref={textRef}
          className={`text-[10px] sm:text-xs leading-tight whitespace-nowrap inline-block ${
            isActive ? 'text-[#2563EB] font-bold' : 'text-slate-500 font-medium'
          } ${shouldScroll ? 'drv-marquee-scroll' : ''}`}
          style={
            shouldScroll
              ? {
                  '--scroll-dist': `-${scrollDistance}px`,
                  paddingLeft: '1px',
                  paddingRight: '1px'
                }
              : undefined
          }
          title={label}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

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
                <span className="absolute top-0.5 w-6 h-0.5 bg-[#2563EB] rounded-full transition-all duration-300" />
              )}
              <div className="relative inline-flex items-center justify-center mt-0.5 transition-transform duration-200">
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[10px] font-black rounded-full px-1.5 py-0.2 leading-tight shadow-xs ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {/* Smooth scroll animation label ensuring all Tamil letters are visible */}
              <DriverNavLabel
                label={item.label}
                to={item.to}
                isActive={isActive}
                language={language}
              />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
