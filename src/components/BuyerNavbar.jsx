/**
 * Buyer Portal Sticky Two-Tier Top Navigation Bar
 * 
 * Row 1 (Primary Header):
 * - Left: "Naam Uzhavar" logo, vertical separator line, compact buyer profile card
 *   ("FreshMart Procurement", "✓ Verified Buyer • 📍 Dindigul", blue rounded badge with building icon)
 * - Right: Language switcher (English | தமிழ்), notification bell with unread indicator,
 *   red outline Logout button (border border-rose-200 bg-rose-50 text-rose-600 rounded-xl px-3.5 py-1.5)
 * - Styling: h-16 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6
 * 
 * Row 2 (Secondary Navigation Strip):
 * - Dedicated horizontal scrollable strip directly below Row 1:
 *   - Home (active: bg-blue-600 text-white rounded-lg px-3.5 py-1.5)
 *   - Marketplace ('9' badge)
 *   - My Requests ('3' amber badge)
 *   - My Orders ('6' emerald badge)
 *   - Bulk Requirements ('7' slate badge)
 * - Shifted left with pl-4 sm:pl-10 (natural breathing room closer to left margin)
 * - All items enforce shrink-0 whitespace-nowrap
 * - Styling: h-12 flex items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-50/80 border-b border-slate-200 pl-4 sm:pl-10 pr-4 sm:pr-6
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyer } from '../context/BuyerContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function BuyerNavbar({
  buyerName = 'FreshMart Procurement',
  onLogout
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    products,
    pendingRequestsCount,
    activeOrdersCount,
    activeRequirementsCount
  } = useBuyer();
  const { t, language } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const notifRef = useRef(null);

  // Horizontal scroll state & ref for Row 2
  const navRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(checkScroll, 120);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [language]);

  const scrollNav = (direction) => {
    if (!navRef.current) return;
    const scrollAmount = 240;
    navRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

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

  const notifications = [
    {
      id: 1,
      title: t('farmerAcceptedRequestNotif', 'Farmer Accepted Request'),
      desc: t('farmerAcceptedRequestDesc', '150 kg Tomatoes accepted by Arun Kumar (Dindigul)'),
      time: '10m ago',
      link: '/buyer/requests',
      badge: 'Request Accepted',
      isNew: true
    },
    {
      id: 2,
      title: t('newFarmerMatchNotif', 'New Farmer Matched'),
      desc: t('newFarmerMatchDesc', 'Direct wholesale batch matches your Onion bulk requirement'),
      time: '45m ago',
      link: '/buyer/requirement',
      badge: 'Bulk Match',
      isNew: true
    },
    {
      id: 3,
      title: t('orderConfirmedNotif', 'Order Dispatched'),
      desc: t('orderConfirmedDesc', 'Vehicle TN-57-AB-1234 assigned for consignment #ORD-1024'),
      time: '2h ago',
      link: '/buyer/orders',
      badge: 'Order Confirmed',
      isNew: false
    }
  ];

  // Secondary nav strip items
  const menuItems = [
    {
      to: '/buyer/dashboard',
      key: 'home',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      icon: 'bi-house-door-fill',
      exact: true
    },
    {
      to: '/buyer/browse',
      key: 'marketplace',
      label: language === 'ta' ? 'சந்தை' : 'Marketplace',
      icon: 'bi-shop',
      badge: '9',
      badgeColorInactive: 'bg-blue-100 text-blue-800 border border-blue-200',
      badgeColorActive: 'bg-white text-blue-700'
    },
    {
      to: '/buyer/requests',
      key: 'myRequests',
      label: language === 'ta' ? 'என் கோரிக்கைகள்' : 'My Requests',
      icon: 'bi-inbox-fill',
      badge: '3',
      badgeColorInactive: 'bg-amber-100 text-amber-900 border border-amber-300',
      badgeColorActive: 'bg-amber-400 text-slate-900'
    },
    {
      to: '/buyer/orders',
      key: 'myOrders',
      label: language === 'ta' ? 'என் ஆர்டர்கள்' : 'My Orders',
      icon: 'bi-box-seam-fill',
      badge: '6',
      badgeColorInactive: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      badgeColorActive: 'bg-emerald-300 text-emerald-950'
    },
    {
      to: '/buyer/requirement',
      key: 'bulkRequirements',
      label: language === 'ta' ? 'மொத்த தேவைகள்' : 'Bulk Requirements',
      icon: 'bi-collection-fill',
      badge: '7',
      badgeColorInactive: 'bg-slate-200 text-slate-700 border border-slate-300',
      badgeColorActive: 'bg-white text-slate-900'
    },
    {
      to: '/book-vehicle',
      key: 'bookVehicle',
      label: language === 'ta' ? 'வாகனம் பதிவு' : 'Book Vehicle',
      icon: 'bi-truck',
      badge: '[ 4 ]',
      badgeColorInactive: 'bg-slate-100 text-slate-700 border border-slate-200',
      badgeColorActive: 'bg-white text-blue-700'
    }
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-white shadow-sm"
        style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%' }}
      >
        {/* ===================================================================
            1. PRIMARY HEADER (ROW 1)
            Branding / Profile on Left, Actions on Right
            Styling: h-16 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6
            =================================================================== */}
        <div
          className="h-16 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6"
          style={{
            height: '64px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Left: Naam Uzhavar Logo, Vertical Separator, Compact Buyer Profile Card */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 shrink-0"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}
          >
            {/* Naam Uzhavar Logo */}
            <Link
              to="/buyer/dashboard"
              className="flex items-center gap-2 text-decoration-none shrink-0"
              title="Naam Uzhavar Buyer Portal"
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <img
                src="/naam-uzhavar-logo-transparent.png"
                alt="Naam Uzhavar"
                className="h-9 w-auto object-contain"
                style={{ height: '36px', maxHeight: '36px', width: 'auto', display: 'block' }}
              />
            </Link>

            {/* Subtle Vertical Separator Line */}
            <div
              className="h-6 w-px bg-slate-200 shrink-0 mx-1"
              style={{
                height: '24px',
                width: '1px',
                backgroundColor: '#e2e8f0',
                flexShrink: 0,
                marginLeft: '4px',
                marginRight: '4px'
              }}
              aria-hidden="true"
            />

            {/* Compact Buyer Profile Card */}
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl px-2.5 py-1.5 shrink-0 cursor-pointer hover:bg-blue-100/80 transition-colors"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(239, 246, 255, 0.8)',
                border: '1px solid rgba(191, 219, 254, 0.8)',
                borderRadius: '12px',
                padding: '6px 10px',
                cursor: 'pointer'
              }}
              title={t('viewProfile', 'View Buyer Profile')}
            >
              {/* Avatar / Icon: Blue rounded badge with building icon */}
              <div
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  minHeight: '32px',
                  borderRadius: '9999px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg className="w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                  <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"/>
                </svg>
              </div>

              {/* Text Stack: "FreshMart Procurement" (bold, truncated) with subline "✓ Verified Buyer • 📍 Dindigul" */}
              <div
                className="text-left leading-tight flex flex-col justify-center"
                style={{ lineHeight: 1.15 }}
              >
                <strong
                  className="text-xs font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[190px] block mb-0"
                  style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}
                >
                  {buyerName}
                </strong>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 leading-none mt-0.5 whitespace-nowrap">
                  <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                    ✓ {t('verifiedBuyer', 'Verified Buyer')}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-0.5 text-slate-600">
                    📍 {t('dindigul', 'Dindigul')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Language Switcher, Notification Bell, Red Outline Logout Button */}
          <div
            className="flex items-center gap-2 shrink-0"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
          >
            {/* Language Switcher (English | தமிழ்) */}
            <LanguageSwitcher />

            {/* Notification Bell with Unread Indicator */}
            <div className="relative" ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 relative transition-colors shadow-2xs"
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff'
                }}
                onClick={() => setShowNotifications(!showNotifications)}
                title={t('notifications')}
                aria-label="Notifications"
              >
                <svg className="w-4 h-4 text-slate-700" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                </svg>
                <span
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    fontWeight: 'bold'
                  }}
                >
                  2
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 farm-animate-fade"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '340px',
                    zIndex: 1050
                  }}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 m-0">{t('notifications')}</h3>
                    <span className="text-[11px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      2 {t('newAlerts', 'New')}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        to={n.link}
                        onClick={() => setShowNotifications(false)}
                        className={`block px-4 py-3 text-decoration-none hover:bg-slate-50 transition-colors ${
                          n.isNew ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {n.isNew && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 m-0 line-clamp-2 leading-relaxed">{n.desc}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {n.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50">
                    <Link
                      to="/buyer/requests"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 text-decoration-none"
                    >
                      {t('viewAllNotifications', 'View all updates')} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Red Outline Logout Button */}
            <button
              type="button"
              className="border border-rose-200 bg-rose-50 text-rose-600 rounded-xl px-3.5 py-1.5 text-sm font-bold hover:bg-rose-100 flex items-center gap-1.5 transition-colors shrink-0"
              style={{
                height: '36px',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                border: '1px solid #fecdd3',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                borderRadius: '12px',
                padding: '6px 14px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
              onClick={handleLogoutClick}
              title={t('logout')}
            >
              <svg className="w-4 h-4 text-rose-600" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. SECONDARY NAVIGATION STRIP (ROW 2)
            Horizontal scrollable strip directly below Row 1:
            - Home (active: bg-blue-600 text-white rounded-lg px-3.5 py-1.5)
            - Marketplace ('9' badge)
            - My Requests ('3' amber badge)
            - My Orders ('6' emerald badge)
            - Bulk Requirements ('7' slate badge)
            - Settings & Preferences
            Shifted right with pl-10 sm:pl-20 (left-aligned, not pushed to the far edge)
            All items enforce shrink-0 whitespace-nowrap
            Styling: h-12 flex items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-50/80 border-b border-slate-200 px-4 sm:px-6
            =================================================================== */}
        <div className="relative w-full" style={{ position: 'relative', width: '100%' }}>
          {/* Left Scroll Chevron */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollNav('left')}
              className="farm-nav-scroll-btn absolute left-2 top-1/2 -translate-y-1/2 z-20"
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
              aria-label="Scroll left"
              title="Scroll left"
            >
              <i className="bi bi-chevron-left text-xs font-bold"></i>
            </button>
          )}

          {/* Secondary Nav Container with pl-4 sm:pl-10 */}
          <nav
            ref={navRef}
            onScroll={checkScroll}
            className="h-12 flex items-center gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-50/80 border-b border-slate-200 pl-4 sm:pl-10 pr-4 sm:pr-6 scrollbar-none scroll-smooth"
            style={{
              height: '48px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
              borderBottom: '1px solid #e2e8f0',
              width: '100%',
              paddingLeft: 'clamp(1rem, 2.5vw, 2.5rem)',
              paddingRight: '1.5rem'
            }}
          >
            {/* Primary Navigation Links */}
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  isActive
                    ? 'bg-blue-600 text-white rounded-lg px-3.5 py-1.5 text-sm font-semibold shrink-0 whitespace-nowrap leading-normal flex items-center gap-2 text-decoration-none shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg px-3 py-1.5 text-sm font-medium shrink-0 whitespace-nowrap leading-normal flex items-center gap-2 text-decoration-none transition-colors'
                }
                style={{
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  lineHeight: '1.5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                {({ isActive }) => (
                  <>
                    <i className={`bi ${item.icon} text-sm ${isActive ? 'text-white' : 'text-slate-500'}`}></i>
                    <span
                      className="shrink-0 whitespace-nowrap leading-normal font-medium"
                      style={{ flexShrink: 0, whiteSpace: 'nowrap', lineHeight: '1.5' }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full font-bold leading-none shrink-0 whitespace-nowrap ${
                          isActive ? item.badgeColorActive : item.badgeColorInactive
                        }`}
                        style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Scroll Chevron */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollNav('right')}
              className="farm-nav-scroll-btn absolute right-2 top-1/2 -translate-y-1/2 z-20"
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
              aria-label="Scroll right"
              title="Scroll right"
            >
              <i className="bi bi-chevron-right text-xs font-bold"></i>
            </button>
          )}
        </div>
      </header>

      {/* ===================================================================
          PROFILE INSPECTION MODAL (PORTAL)
          =================================================================== */}
      {showProfileModal &&
        createPortal(
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1200 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden farm-animate-fade">
                <div className="modal-header bg-light border-bottom p-3">
                  <h5 className="modal-title fs-6 fw-bold text-dark d-flex align-items-center gap-2 mb-0">
                    <i className="bi bi-building text-primary"></i>
                    <span>{t('profile')}</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowProfileModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3 shadow-xs"
                    style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}
                  >
                    <i className="bi bi-building"></i>
                  </div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">{buyerName}</h4>
                  <span className="badge bg-primary text-white rounded-pill px-3 py-1 mb-3">
                    Institutional Wholesale Buyer
                  </span>

                  <div className="p-3 bg-light rounded-3 text-start small mb-3">
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">Procurement Hub:</span>
                      <strong className="text-dark">Dindigul Central Hub, TN</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">GSTIN / Udyam:</span>
                      <strong className="text-dark font-monospace">33AAACH1234F1Z8</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Verification Status:</span>
                      <strong className="text-success">✓ Verified Business</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger w-100 rounded-pill fw-bold py-2"
                    onClick={() => {
                      setShowProfileModal(false);
                      handleLogoutClick();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1.5"></i>
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

