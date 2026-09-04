/**
 * Buyer Home Dashboard
 * Route: /buyer/dashboard & /buyer
 * Provides a clean, buyer-first landing overview answering:
 * - What produce is available?
 * - What requests are waiting?
 * - What orders are active?
 * - What bulk requirements are active?
 * Follows Master Prompt Section 5.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import ProductCard from '../../components/ProductCard';
import ProduceDetailsModal from '../../components/ProduceDetailsModal';

export default function BuyerDashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuth();
  const {
    products,
    pendingRequestsCount,
    activeOrdersCount,
    activeRequirementsCount
  } = useBuyer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');

  const quickCrops = [
    { name: 'Tomato', tamilName: 'தக்காளி', emoji: '🍅' },
    { name: 'Onion', tamilName: 'வெங்காயம்', emoji: '🧅' },
    { name: 'Potato', tamilName: 'உருளைக்கிழங்கு', emoji: '🥔' },
    { name: 'Carrot', tamilName: 'கேரட்', emoji: '🥕' },
    { name: 'Banana', tamilName: 'வாழைப்பழம்', emoji: '🍌' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      navigate('/buyer/browse');
    } else {
      navigate(`/buyer/browse?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleQuickCropClick = (cropName) => {
    navigate(`/buyer/browse?search=${encodeURIComponent(cropName)}`);
  };

  // Curated recommended produce (first 4 products)
  const recommendedProducts = products.slice(0, 4);

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. WELCOME HEADER & SEARCH BAR
            =================================================================== */}
        {/* ===================================================================
            1. WELCOME HEADER & SEARCH BAR (REFACTORED HERO BANNER)
            =================================================================== */}
        <div
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Left Column: Eyebrow, Greeting, Description, Integrated Search Bar */}
          <div
            className="flex-1 min-w-0 max-w-xl md:max-w-2xl"
            style={{ flex: '1 1 0%', minWidth: 0, maxWidth: '42rem' }}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {language === 'ta' ? 'நேரடி உழவர் சந்தை' : 'DIRECT FARMER MARKETPLACE'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              {t('welcomeBackBuyer')},{' '}
              <span className="whitespace-nowrap">{user?.name || 'FreshMart Procurement'} 👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              {t('findFreshProduceSubtitle')}
            </p>

            {/* Single Cohesive, Integrated Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-xl"
              style={{ position: 'relative', width: '100%', maxWidth: '36rem' }}
            >
              <div className="relative flex items-center w-full" style={{ position: 'relative', width: '100%' }}>
                {/* Search Magnifying Glass Icon */}
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  className="h-12 w-full pl-11 pr-32 rounded-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm text-slate-900 placeholder:text-slate-400 outline-none shadow-2xs"
                  style={{
                    height: '48px',
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '125px',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'rgba(248, 250, 252, 0.5)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder={t('searchVegetablesFruitsPlaceholder', 'Search vegetables, fruits...')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />

                {/* Nested Search Button Aligned Right with Search -> */}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors border-0 cursor-pointer"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '6px',
                    bottom: '6px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    borderRadius: '9999px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                >
                  <span>{language === 'ta' ? 'தேடு' : 'Search'}</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Quick Stats & Action Summary Pills (Balances layout & fills void) */}
          <div
            className="flex flex-col gap-2.5 shrink-0 w-full md:w-80"
            style={{
              flexShrink: 0,
              width: '100%',
              maxWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {/* 1. Active Orders */}
            <Link
              to="/buyer/orders"
              className="flex items-center justify-between gap-3 p-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300 transition-all text-decoration-none group"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                textDecoration: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div className="flex items-center gap-2.5" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg className="w-4 h-4 text-emerald-700" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l6.29 2.518a.5.5 0 0 1 .303.46v9.676a1.5 1.5 0 0 1-.947 1.393l-6.5 2.6a1.5 1.5 0 0 1-1.114 0l-6.5-2.6A1.5 1.5 0 0 1 0 12.838V3.162a.5.5 0 0 1 .303-.46L6.593.184z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                    {language === 'ta' ? 'நடப்பு ஆர்டர்கள்' : 'Active Orders'}
                  </div>
                  <div className="text-[11px] text-slate-500" style={{ fontSize: '11px', color: '#64748b' }}>
                    {language === 'ta' ? 'நேரடி விநியோகம்' : 'In Transit'}
                  </div>
                </div>
              </div>
              <span
                className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs"
                style={{ minWidth: '24px', height: '24px', padding: '0 8px', borderRadius: '9999px', backgroundColor: '#059669', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {activeOrdersCount || 6}
              </span>
            </Link>

            {/* 2. Pending Quotes / Requests */}
            <Link
              to="/buyer/requests"
              className="flex items-center justify-between gap-3 p-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300 transition-all text-decoration-none group"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                textDecoration: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div className="flex items-center gap-2.5" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg className="w-4 h-4 text-amber-800" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .11.312V13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5a.5.5 0 0 1 .11-.312zm-1.81 5.437H1v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9h-3.003a2.5 2.5 0 0 1-4.994 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>
                    {language === 'ta' ? 'நிலுவை கோரிக்கைகள்' : 'Pending Quotes'}
                  </div>
                  <div className="text-[11px] text-slate-500" style={{ fontSize: '11px', color: '#64748b' }}>
                    {language === 'ta' ? 'உழவர் ஏற்பு' : 'Awaiting Farmers'}
                  </div>
                </div>
              </div>
              <span
                className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-2xs"
                style={{ minWidth: '24px', height: '24px', padding: '0 8px', borderRadius: '9999px', backgroundColor: '#f59e0b', color: '#020617', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {pendingRequestsCount || 3}
              </span>
            </Link>

            {/* 3. Direct Mandi Prices */}
            <Link
              to="/buyer/browse"
              className="flex items-center justify-between gap-3 p-2.5 px-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 hover:bg-blue-100/80 hover:border-blue-300 transition-all text-decoration-none group"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 246, 255, 0.8)',
                border: '1px solid rgba(191, 219, 254, 0.8)',
                textDecoration: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div className="flex items-center gap-2.5" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg className="w-4 h-4 text-white" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                    <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 7.586 1zm1 1h4.586l7 7L10 13.586l-7-7z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#172554' }}>
                    {language === 'ta' ? 'நேரடி மண்டி விலை' : 'Direct Mandi Prices'}
                  </div>
                  <div className="text-[11px] text-blue-700/80" style={{ fontSize: '11px', color: 'rgba(29, 78, 216, 0.8)' }}>
                    {language === 'ta' ? 'மண்டியை விட 20-25% குறைவு' : 'Zero Intermediary Cut'}
                  </div>
                </div>
              </div>
              <span
                className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200"
                style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}
              >
                -22%
              </span>
            </Link>
          </div>
        </div>

        {/* ===================================================================
            2. 4 CORE BUYER SUMMARY STAT CARDS
            =================================================================== */}
        <div className="bd-stat-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* 1. Available Produce */}
          <Link
            to="/buyer/browse"
            className="bd-stat-card p-4 sm:p-5 p-md-4 rounded-4 bg-white border shadow-xs text-decoration-none h-100 d-flex flex-column hover-scale transition"
            style={{ padding: '1.25rem' }}
          >
            {/* Top Row: Icon Box & Status Chip in shared flex header */}
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <div
                className="bd-stat-icon-box rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center shadow-2xs flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
              >
                🌾
              </div>
              <span className="bd-stat-badge badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-medium">
                {language === 'ta' ? 'நேரடி சந்தை' : 'Direct Gate'}
              </span>
            </div>

            {/* Card Title */}
            <span className="bd-stat-title text-sm font-medium text-slate-600 mb-1" style={{ fontSize: '0.875rem', color: '#475569' }}>
              {t('availableProduceCount')}
            </span>

            {/* Value & Subtitle Row */}
            <div className="d-flex align-items-baseline gap-2 mt-auto pt-1">
              <strong className="bd-stat-number text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-monospace" style={{ color: '#0f172a' }}>
                {products.length}
              </strong>
              <span className="bd-stat-subtitle text-xs sm:text-sm text-slate-500 font-normal" style={{ color: '#64748b' }}>
                {language === 'ta' ? 'விளைச்சல் பதிவுகள்' : 'Active Lots'}
              </span>
            </div>
          </Link>

          {/* 2. My Requests */}
          <Link
            to="/buyer/requests"
            className="bd-stat-card p-4 sm:p-5 p-md-4 rounded-4 bg-white border shadow-xs text-decoration-none h-100 d-flex flex-column hover-scale transition"
            style={{ padding: '1.25rem' }}
          >
            {/* Top Row: Icon Box & Status Chip in shared flex header */}
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <div
                className="bd-stat-icon-box rounded-3 bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center shadow-2xs flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
              >
                📩
              </div>
              <span className="bd-stat-badge badge bg-warning text-dark rounded-pill px-2.5 py-1 small fw-bold">
                {t('pending')}
              </span>
            </div>

            {/* Card Title */}
            <span className="bd-stat-title text-sm font-medium text-slate-600 mb-1" style={{ fontSize: '0.875rem', color: '#475569' }}>
              {t('pendingRequestsCount')}
            </span>

            {/* Value & Subtitle Row */}
            <div className="d-flex align-items-baseline gap-2 mt-auto pt-1">
              <strong className="bd-stat-number text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-monospace" style={{ color: '#0f172a' }}>
                {pendingRequestsCount}
              </strong>
              <span className="bd-stat-subtitle text-xs sm:text-sm text-slate-500 font-normal" style={{ color: '#64748b' }}>
                {language === 'ta' ? 'நிலுவையில்' : 'Awaiting Farmers'}
              </span>
            </div>
          </Link>

          {/* 3. Active Orders */}
          <Link
            to="/buyer/orders"
            className="bd-stat-card p-4 sm:p-5 p-md-4 rounded-4 bg-white border shadow-xs text-decoration-none h-100 d-flex flex-column hover-scale transition"
            style={{ padding: '1.25rem' }}
          >
            {/* Top Row: Icon Box & Status Chip in shared flex header */}
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <div
                className="bd-stat-icon-box rounded-3 bg-success-subtle text-success d-flex align-items-center justify-content-center shadow-2xs flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
              >
                📦
              </div>
              <span className="bd-stat-badge badge bg-success text-white rounded-pill px-2.5 py-1 small fw-medium">
                {language === 'ta' ? 'நடப்பில்' : 'In Transit'}
              </span>
            </div>

            {/* Card Title */}
            <span className="bd-stat-title text-sm font-medium text-slate-600 mb-1" style={{ fontSize: '0.875rem', color: '#475569' }}>
              {t('activeOrdersCount')}
            </span>

            {/* Value & Subtitle Row */}
            <div className="d-flex align-items-baseline gap-2 mt-auto pt-1">
              <strong className="bd-stat-number text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-monospace" style={{ color: '#0f172a' }}>
                {activeOrdersCount}
              </strong>
              <span className="bd-stat-subtitle text-xs sm:text-sm text-slate-500 font-normal" style={{ color: '#64748b' }}>
                {language === 'ta' ? 'ஆர்டர்கள்' : 'Live Deliveries'}
              </span>
            </div>
          </Link>

          {/* 4. Bulk Requirements */}
          <Link
            to="/buyer/requirement"
            className="bd-stat-card p-4 sm:p-5 p-md-4 rounded-4 bg-white border shadow-xs text-decoration-none h-100 d-flex flex-column hover-scale transition"
            style={{ padding: '1.25rem' }}
          >
            {/* Top Row: Icon Box & Status Chip in shared flex header */}
            <div className="d-flex align-items-center justify-content-between w-100 mb-3">
              <div
                className="bd-stat-icon-box rounded-3 bg-info-subtle text-info-emphasis d-flex align-items-center justify-content-center shadow-2xs flex-shrink-0"
                style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
              >
                📋
              </div>
              <span className="bd-stat-badge badge bg-info-subtle text-info-emphasis rounded-pill px-2.5 py-1 small fw-medium">
                {language === 'ta' ? 'தேவைக்குவிப்பு' : 'Demand Pool'}
              </span>
            </div>

            {/* Card Title */}
            <span className="bd-stat-title text-sm font-medium text-slate-600 mb-1" style={{ fontSize: '0.875rem', color: '#475569' }}>
              {t('activeRequirementsCount')}
            </span>

            {/* Value & Subtitle Row */}
            <div className="d-flex align-items-baseline gap-2 mt-auto pt-1">
              <strong className="bd-stat-number text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-monospace" style={{ color: '#0f172a' }}>
                {activeRequirementsCount}
              </strong>
              <span className="bd-stat-subtitle text-xs sm:text-sm text-slate-500 font-normal" style={{ color: '#64748b' }}>
                {language === 'ta' ? 'செயலில்' : 'Active Pool'}
              </span>
            </div>
          </Link>
        </div>

        {/* ===================================================================
            3. FRESH PRODUCE NEAR YOU (QUICK CROP CHIPS)
            =================================================================== */}
        <div className="bd-near-you-card rounded-4 border bg-white shadow-xs mb-4 p-4 sm:p-5" style={{ padding: '1.25rem 1.5rem' }}>
          {/* Top Title & Location Badge */}
          <div className="bd-near-you-header d-flex align-items-center gap-2 mb-3">
            <h2 className="bd-near-you-title d-inline-flex align-items-center gap-2 text-base sm:text-lg font-bold text-slate-900 fs-6 fs-sm-5 mb-0">
              <span aria-hidden="true">📍</span>
              <span>{t('freshProduceNearYou')}</span>
            </h2>
            <span className="bd-near-you-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              Dindigul & Madurai Clusters
            </span>
          </div>

          {/* Filter Pills & CTA Button Alignment */}
          <div className="bd-near-you-controls d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
            {/* Filter Chips Wrapper */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              {quickCrops.map((crop) => (
                <button
                  key={crop.name}
                  type="button"
                  className="bd-crop-chip inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => handleQuickCropClick(crop.name)}
                >
                  <span aria-hidden="true">{crop.emoji}</span>
                  <span>
                    {language === 'ta' ? crop.tamilName : crop.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Action CTA Button */}
            <Link
              to="/buyer/browse"
              className="bd-crop-cta shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue-600 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-decoration-none"
            >
              <span>{t('viewMarketplaceCTA')}</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* ===================================================================
            4. RECOMMENDED FOR YOU (DIRECT PRODUCT CARDS)
            =================================================================== */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <h2 className="fs-5 fw-black text-dark mb-0">
                ✨ {t('recommendedForYou')}
              </h2>
              <span className="text-muted small">
                {language === 'ta' ? 'சரிபார்க்கப்பட்ட விவசாயிகளின் நேரடி அறுவடை விலைகள்' : 'Verified fresh direct farmgate listings from verified local farmers'}
              </span>
            </div>

            <Link
              to="/buyer/browse"
              className="btn btn-sm btn-outline-primary rounded-pill px-3.5 py-1.5 fw-bold text-decoration-none d-inline-flex align-items-center gap-1.5 shadow-2xs hover-scale transition"
            >
              <span>{language === 'ta' ? 'அனைத்தையும் காண்க' : 'View All'}</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3 g-md-4">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </div>

        {/* View Details Produce Modal */}
        {selectedProduct && (
          <ProduceDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </BuyerLayout>
  );
}
