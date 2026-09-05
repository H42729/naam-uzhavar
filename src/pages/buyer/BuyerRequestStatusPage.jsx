/**
 * Buyer Requests & Request Details Page
 * Routes: /buyer/requests & /buyer/request-status
 * Displays all procurement requests sent to farmers with status filter tabs,
 * clean readable cards, request detail inspection modal with contextual actions,
 * and seamless transition to confirmed purchase orders.
 * Follows Master Prompt Sections 11, 12, 13, 14.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';

export default function BuyerRequestStatusPage() {
  const {
    requests,
    confirmRequest,
    getOrCreateConversationForFarmer,
    showToast
  } = useBuyer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Status Filter Tabs
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filterTabs = ['All', 'Pending', 'Accepted', 'Confirmed', 'Declined'];

  const filteredRequests = requests.filter((r) => {
    const status = (r.status || '').toLowerCase();
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Declined' && (status === 'declined' || status === 'rejected')) ||
      status === activeFilter.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const searchTarget = `${r.id} ${r.productName || r.crop || ''} ${r.farmerName || r.farmer || ''} ${r.farmerLocation || r.location || ''}`.toLowerCase();
    const matchesSearch = !query || searchTarget.includes(query);

    return matchesFilter && matchesSearch;
  });

const CROP_FALLBACKS = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80',
  'small onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
  'banana (robusta)': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80',
  'green chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  'potato (ooty hill)': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  moringa: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80',
  'drumstick / moringa': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80',
  brinjal: '/images/brinjal.jpg'
};

const CROP_TAMIL_MAP = {
  'Tomato': 'தக்காளி',
  'Small Onion': 'சின்ன வெங்காயம்',
  'Onion': 'வெங்காயம்',
  'Potato': 'உருளைக்கிழங்கு',
  'Potato (Ooty Hill)': 'உருளைக்கிழங்கு (ஊட்டி)',
  'Carrot': 'கேரட்',
  'Banana': 'வாழைப்பழம்',
  'Banana (Robusta)': 'வாழைப்பழம் (ரோபஸ்டா)',
  'Drumstick': 'முருங்கைக்காய்',
  'Drumstick / Moringa': 'முருங்கைக்காய்',
  'Green Chilli': 'பச்சை மிளகாய்',
  'Chilli': 'பச்சை மிளகாய்',
  'Brinjal': 'கத்தரிக்காய்',
  'Cabbage': 'முட்டைக்கோஸ்',
  'Beetroot': 'பீட்ரூட்'
};

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'accepted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{language === 'ta' ? 'விவசாயி ஒப்புக்கொண்டார்' : 'Approved by Farmer'}</span>
        </span>
      );
    }
    if (s === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>{language === 'ta' ? 'ஆர்டர் உறுதிசெய்யப்பட்டது' : 'Order Confirmed'}</span>
        </span>
      );
    }
    if (s === 'declined' || s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>{language === 'ta' ? 'விவசாயியால் நிராகரிக்கப்பட்டது' : 'Declined by Farmer'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>{language === 'ta' ? 'பதில் எதிர்பார்க்கப்படுகிறது' : 'Awaiting Farmer Response'}</span>
      </span>
    );
  };

  const handleMessageFarmer = (req) => {
    const farmerName = req.farmerName || req.farmer;
    const cropName = req.productName || req.crop;
    const convId = getOrCreateConversationForFarmer(farmerName, cropName);
    setSelectedRequest(null);
    navigate(`/buyer/messages?conv=${convId}`);
  };

  const handleConfirmOrder = (req) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      confirmRequest(req.id);
      setIsProcessing(false);
      setSelectedRequest(null);
      navigate('/buyer/orders');
    }, 400);
  };

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. PAGE HEADER
            =================================================================== */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'விவசாயி கொள்முதல் கோரிக்கைகள்' : 'FARMER SOURCING PIPELINE'}
            </span>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('myRequests')}</h1>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/buyer/browse" className="btn btn-primary rounded-pill px-3.5 py-2 fw-bold shadow-xs">
              <i className="bi bi-plus-circle-fill me-1.5"></i>
              <span>{t('browseProduceCTA')}</span>
            </Link>
          </div>
        </div>

        {/* ===================================================================
            2. FILTER TABS & SEARCH (STICKY SUB-HEADER)
            =================================================================== */}
        <div className="bd-filter-tabs-container">
          {/* Scroll-free Status Tabs: 2 in one row, another two in next row on mobile */}
          <div className="bd-tabs-scroll-area">
            {filterTabs.map((tab, idx) => {
              const count =
                tab === 'All'
                  ? requests.length
                  : tab === 'Declined'
                  ? requests.filter((r) => r.status === 'Declined' || r.status === 'Rejected').length
                  : requests.filter((r) => (r.status || '').toLowerCase() === tab.toLowerCase()).length;
              const isActive = activeFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  className={`bd-tab-pill ${
                    isActive ? 'bd-tab-pill-active active' : 'bd-tab-pill-inactive'
                  } ${idx === 4 ? 'bd-tab-full-mobile' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  <span>
                    {tab === 'All'
                      ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                      : tab === 'Pending'
                      ? (language === 'ta' ? 'பதில் எதிர்பார்க்கப்படுகிறது' : 'Awaiting Response')
                      : tab === 'Accepted'
                      ? (language === 'ta' ? 'விவசாயி ஒப்புக்கொண்டார்' : 'Approved by Farmer')
                      : tab === 'Confirmed'
                      ? (language === 'ta' ? 'உறுதியானது' : 'Confirmed')
                      : (language === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Declined by Farmer')}
                  </span>
                  <span className="bd-tab-badge">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search: Separated into its own block on mobile, side-by-side on desktop/tablet */}
          <div className="bd-search-wrapper">
            <i
              className="bd-search-icon bi bi-search"
              aria-hidden="true"
            ></i>
            <input
              type="text"
              className="bd-search-input"
              placeholder={language === 'ta' ? 'கோரிக்கை எண் அல்லது பயிர்...' : 'Search request or crop...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ===================================================================
            3. REQUESTS CARDS LIST / EMPTY STATE
            =================================================================== */}
        {filteredRequests.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-4">
            <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">{t('noRequestsYetBuyerTitle')}</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '380px', margin: '0 auto' }}>
              {t('noRequestsYetBuyerDesc')}
            </p>
            <Link to="/buyer/browse" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold shadow-xs">
              {t('browseProduceCTA')}
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {filteredRequests.map((req) => {
              const isAccepted = (req.status || '').toLowerCase() === 'accepted';
              const isPending = (req.status || '').toLowerCase() === 'pending';
              const isDeclined = (req.status || '').toLowerCase() === 'declined' || (req.status || '').toLowerCase() === 'rejected';
              const isConfirmed = (req.status || '').toLowerCase() === 'confirmed';

              const cropName = req.productName || req.crop || 'Produce';
              const cropTamilName = req.productTamilName || CROP_TAMIL_MAP[cropName] || (language === 'ta' ? 'விவசாய விளைபொருள்' : 'Fresh Produce');
              const farmerName = req.farmerName || req.farmer || 'Ramesh Kumar';
              const farmerLocation = req.farmerLocation || req.location || 'Nilakottai, Dindigul';
              const farmerPhone = req.farmerPhone || '+91 98421 88920';
              const cleanPhone = farmerPhone.replace(/[^0-9]/g, '');
              const qty = req.quantity || 50;
              const unit = req.unit || 'kg';
              const price = req.price || req.offeredPrice || 32;
              const total = req.totalAmount || (qty * price);
              const productImage = req.productImage || req.image || CROP_FALLBACKS[cropName.toLowerCase()] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80';

              return (
                <div key={req.id} className="col-12 col-md-6 col-lg-4">
                  <div
                    className={`bg-white rounded-2xl p-5 shadow-xs flex flex-col h-100 transition-all duration-200 ${
                      isAccepted
                        ? 'border-emerald-300 ring-1 ring-emerald-300'
                        : isDeclined
                        ? 'border border-rose-200 bg-rose-50/10'
                        : isConfirmed
                        ? 'border border-blue-200'
                        : 'border border-slate-200 hover:border-slate-300'
                    }`}
                    style={{
                      borderRadius: '1rem',
                      padding: '1.25rem',
                      backgroundColor: isDeclined ? 'rgba(255, 241, 242, 0.2)' : '#ffffff'
                    }}
                  >
                    {/* 1. Status Banner & Acceptance Indicator at Top */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        #{req.id}
                      </span>
                      {getStatusBadge(req.status)}
                    </div>

                    {/* Acceptance / Rejection / Pending Sub-Banner Note */}
                    {isAccepted && (
                      <div className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-3">
                        <span className="flex items-center gap-1.5">
                          <i className="bi bi-check-circle-fill text-emerald-600"></i>
                          <span>{language === 'ta' ? 'விவசாயி கோரிக்கையை ஏற்றுக்கொண்டார்' : 'Farmer Accepted Your Sourcing Request'}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {language === 'ta' ? 'ஒப்புதல்' : 'Approved'}
                        </span>
                      </div>
                    )}

                    {isPending && (
                      <div className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-3">
                        <span className="flex items-center gap-1.5">
                          <i className="bi bi-hourglass-split text-amber-600"></i>
                          <span>{language === 'ta' ? 'உழவர் பதிலுக்காக காத்திருக்கிறது' : 'Awaiting Farmer Response'}</span>
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold">~2-4h SLA</span>
                      </div>
                    )}

                    {isDeclined && (
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 mb-3 text-xs leading-relaxed">
                        <div className="flex items-start gap-2">
                          <i className="bi bi-info-circle-fill text-rose-500 mt-0.5 shrink-0 text-sm"></i>
                          <div>
                            <p className="m-0 font-medium text-rose-900">
                              {language === 'ta'
                                ? 'பங்கு இருப்பு அல்லது தளவாடக் கட்டுப்பாடுகள் காரணமாக விவசாயியால் இக்கோரிக்கையை ஏற்க இயலவில்லை.'
                                : 'The farmer was unable to accept this request due to stock or logistics constraints.'}
                            </p>
                            {req.rejectionReason && (
                              <p className="m-0 mt-1.5 text-[11px] text-rose-700/80 italic border-t border-rose-200/50 pt-1">
                                "{req.rejectionReason}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="flex items-center justify-between p-2 px-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-3">
                        <span className="flex items-center gap-1.5">
                          <i className="bi bi-box-seam text-blue-600"></i>
                          <span>{language === 'ta' ? 'ஆர்டர் உறுதிசெய்யப்பட்டது' : 'Order Confirmed & In Progress'}</span>
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">PO Active</span>
                      </div>
                    )}

                    {/* 2. Produce Header (Crop Name in English + Tamil Translation) */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={productImage}
                        alt={cropName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug m-0 truncate" style={{ fontSize: '1rem', fontWeight: 700 }}>
                          {cropName} <span className="text-slate-500 font-medium">/ {cropTamilName}</span>
                        </h3>
                        <span className="text-xs text-slate-500 block truncate">
                          {req.deliveryLocation ? `${req.deliveryLocation}` : 'Direct Farm Consignment'}
                        </span>
                      </div>
                    </div>

                    {/* 3. Farmer Section Based on Status */}
                    {/* ACCEPTED: Dedicated Verified Farmer Contact & Pickup Info Section */}
                    {isAccepted && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 mb-3.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/70">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <i className="bi bi-patch-check-fill text-emerald-600"></i>
                            <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட உழவர் & சேகரிப்பு' : 'Verified Farmer Contact & Pickup Info'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ✓ Verified
                          </span>
                        </div>

                        {/* Farmer Name & Full Farm Location */}
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                            {farmerName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-900 truncate">{farmerName}</span>
                              <span className="text-emerald-700 font-semibold text-xs" title="Verified Farmer">✓</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-700 mt-0.5">
                              <span aria-hidden="true">📍</span>
                              <span className="font-semibold truncate">{farmerLocation}</span>
                            </div>
                            {req.farmerFpo && (
                              <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                                {req.farmerFpo}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Direct Contact Phone & Call Button & WhatsApp Trigger */}
                        <div className="bd-farmer-contact-actions border-t border-emerald-200/60">
                          <a
                            href={`tel:${farmerPhone}`}
                            className="bd-phone-btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-decoration-none shadow-2xs transition-colors"
                            style={{
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              gap: '6px'
                            }}
                            title={`Call ${farmerName}: ${farmerPhone}`}
                          >
                            <i className="bi bi-telephone-fill text-xs"></i>
                            <span>{farmerPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${farmerName}, regarding our approved order #${req.id} for ${cropName}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bd-whatsapp-btn inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-bold text-decoration-none shadow-2xs transition-colors"
                            style={{
                              backgroundColor: '#25D366',
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              gap: '6px'
                            }}
                            title="Chat on WhatsApp"
                          >
                            <i className="bi bi-whatsapp text-xs"></i>
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* PENDING: Protected Farmer Candidate info with Response SLA */}
                    {isPending && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-3.5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                              {farmerName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">{farmerName}</span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <span>📍</span>
                                <span className="truncate max-w-[130px]">{farmerLocation}</span>
                              </span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                            <i className="bi bi-clock-history"></i>
                            <span>~2-4h SLA</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <i className="bi bi-shield-lock-fill text-amber-600"></i>
                            <span>{language === 'ta' ? 'தொடர்பு எண் மறைக்கப்பட்டுள்ளது' : 'Direct phone hidden until approved'}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {language === 'ta' ? 'பதில் எதிர்பார்க்கப்படுகிறது' : 'Awaiting confirmation'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* DECLINED: Direct contact hidden */}
                    {isDeclined && (
                      <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 mb-3.5 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <i className="bi bi-shield-lock text-slate-400"></i>
                          <span>{language === 'ta' ? 'நேரடி தொடர்பு விவரங்கள் மறைக்கப்பட்டுள்ளன' : 'Direct contact details hidden'}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <span>📍</span>
                          <span className="truncate max-w-[140px]">{farmerLocation}</span>
                        </span>
                      </div>
                    )}

                    {/* CONFIRMED: Verified contact info */}
                    {isConfirmed && (
                      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 mb-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{farmerName}</span>
                            <span className="text-emerald-700 text-xs font-bold">✓ Verified</span>
                          </div>
                          <span className="text-xs text-slate-600">📍 {farmerLocation}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-blue-100 text-xs">
                          <a href={`tel:${farmerPhone}`} className="text-blue-700 font-bold text-decoration-none">
                            <i className="bi bi-telephone-fill me-1"></i>
                            {farmerPhone}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleMessageFarmer(req)}
                            className="text-slate-600 hover:text-slate-900 border-0 bg-transparent cursor-pointer text-xs font-medium"
                          >
                            <i className="bi bi-chat-dots-fill me-1 text-blue-600"></i>
                            Message
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 4. Specifications Table / Breakdown */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 mb-3.5 space-y-2" style={{ borderRadius: '12px', padding: '12px', backgroundColor: 'rgba(248, 250, 252, 0.7)', border: '1px solid #e2e8f0' }}>
                      <div className="flex items-center justify-between text-xs" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span className="text-slate-500 font-medium">
                          {language === 'ta' ? 'கோரப்பட்ட அளவு' : 'Requested Quantity'}:
                        </span>
                        <span className="font-bold text-slate-800 font-mono" style={{ fontWeight: 700, color: '#1e293b' }}>
                          {qty} {unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span className="text-slate-500 font-medium">
                          {language === 'ta' ? 'ஒப்புக்கொள்ளப்பட்ட விலை' : 'Agreed Rate'}:
                        </span>
                        <span className="font-bold text-slate-800 font-mono" style={{ fontWeight: 700, color: '#1e293b' }}>
                          ₹{price} / {unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '0.875rem' }}>
                        <span className="font-bold text-slate-900" style={{ fontWeight: 700, color: '#0f172a' }}>
                          {language === 'ta' ? 'மொத்த தொகை' : 'Total Cost'}:
                        </span>
                        <span className="text-lg font-bold text-blue-700 font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1d4ed8' }}>
                          ₹{Number(total).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Meta Row: Date & Farm Location */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5 px-0.5" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                      <span className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="bi bi-calendar3 text-slate-400"></i>
                        <span>{req.requestDate || '03 Sep 2026'}</span>
                        {req.requestTime && <span className="text-slate-400">• {req.requestTime}</span>}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 truncate max-w-[170px]" title={farmerLocation} style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '170px' }}>
                        <span aria-hidden="true">📍</span>
                        <span className="truncate">{farmerLocation}</span>
                      </span>
                    </div>

                    {/* 5. Contextual Action Buttons (NO BUYER REJECT/CANCEL BUTTONS!) */}
                    <div className="mt-auto pt-2 border-t border-slate-100" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: 'auto' }}>
                      {/* ACCEPTED: Primary CTA: Proceed to Payment / Confirm Delivery */}
                      {isAccepted && (
                        <div className="flex items-center gap-2" style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleConfirmOrder(req)}
                            disabled={isProcessing}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors border-0 cursor-pointer"
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              borderRadius: '12px',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>
                              {language === 'ta'
                                ? 'கட்டணம் செலுத்த / விநியோகத்தை உறுதிசெய் →'
                                : 'Proceed to Payment / Confirm Delivery →'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                            style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer' }}
                            title="View Full Specifications"
                          >
                            <i className="bi bi-info-circle"></i>
                          </button>
                        </div>
                      )}

                      {/* PENDING: Awaiting Farmer Response (Buyer ONLY observes, NO Cancel Button) */}
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 text-amber-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            border: '1px solid #fcd34d',
                            backgroundColor: 'rgba(254, 243, 199, 0.6)',
                            color: '#92400e',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="bi bi-hourglass-split"></i>
                          <span>{language === 'ta' ? 'கோரிக்கை விவரங்கள்' : 'View Request Details'}</span>
                        </button>
                      )}

                      {/* DECLINED: Farmer Unavailable - Disabled or muted View Summary button */}
                      {isDeclined && (
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(req)}
                          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="bi bi-file-earmark-text"></i>
                          <span>{language === 'ta' ? 'சுருக்கம் காண்க' : 'View Summary'}</span>
                        </button>
                      )}

                      {/* CONFIRMED: View Purchase Order */}
                      {isConfirmed && (
                        <div className="flex items-center gap-2" style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            to="/buyer/orders"
                            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 text-decoration-none shadow-sm transition-colors"
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              borderRadius: '12px',
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <i className="bi bi-box-seam"></i>
                            <span>{language === 'ta' ? 'ஆர்டரைக் காண்க' : 'View Purchase Order →'}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                            style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#475569', cursor: 'pointer' }}
                            title="View Details"
                          >
                            <i className="bi bi-info-circle"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            4. REQUEST DETAILS MODAL (Section 13 & 14)
            =================================================================== */}
        {selectedRequest && (
          <div
            className="position-fixed inset-0 bg-dark bg-opacity-65 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
            style={{ zIndex: 1250, top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-4 p-4 max-w-lg w-100 shadow-xl" style={{ maxWidth: '540px' }}>
              {/* Modal Header */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <strong className="fs-5 fw-black text-dark">
                    {language === 'ta' ? 'கோரிக்கை விவரம்' : 'Request'} #{selectedRequest.id}
                  </strong>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>

              {/* Produce & Offer Details */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      {t('productNameLabel', 'Product')}:
                    </span>
                    <strong className="text-dark fs-6">
                      {selectedRequest.productName || selectedRequest.crop}{' '}
                      <span className="text-muted fw-normal">
                        / {selectedRequest.productTamilName || CROP_TAMIL_MAP[selectedRequest.productName || selectedRequest.crop] || ''}
                      </span>
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      {t('quantityLabel', 'Quantity')}:
                    </span>
                    <strong className="text-success font-monospace fs-6">
                      {selectedRequest.quantity} kg
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      {t('offeredPriceLabel', 'Offered Price')}:
                    </span>
                    <strong className="text-dark font-monospace fs-6">
                      ₹{selectedRequest.price || selectedRequest.offeredPrice} / kg
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      {t('totalAmountLabel', 'Total Amount')}:
                    </span>
                    <strong className="text-primary font-monospace fs-6 font-bold text-blue-700">
                      ₹{Number(selectedRequest.totalAmount || (selectedRequest.quantity * (selectedRequest.price || selectedRequest.offeredPrice))).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Farmer Trust Details Section */}
              {(() => {
                const modalIsAccepted = (selectedRequest.status || '').toLowerCase() === 'accepted';
                const modalIsPending = (selectedRequest.status || '').toLowerCase() === 'pending';
                const modalIsDeclined = (selectedRequest.status || '').toLowerCase() === 'declined' || (selectedRequest.status || '').toLowerCase() === 'rejected';
                const modalFarmerPhone = selectedRequest.farmerPhone || '+91 98421 88920';
                const modalCleanPhone = modalFarmerPhone.replace(/[^0-9]/g, '');
                const modalCropName = selectedRequest.productName || selectedRequest.crop || 'Produce';

                return (
                  <>
                    {/* ACCEPTED: Verified Farmer Contact & Pickup Info */}
                    {modalIsAccepted && (
                      <div className="p-3 bg-emerald-50/70 rounded-3 border border-emerald-200 mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom border-emerald-100">
                          <span className="text-emerald-800 small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                            <i className="bi bi-patch-check-fill me-1 text-emerald-600"></i>
                            {language === 'ta' ? 'சரிபார்க்கப்பட்ட உழவர் தொடர்பு & சேகரிப்பு விவரங்கள்' : 'Verified Farmer Contact & Pickup Info'}
                          </span>
                          <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs">
                            ✓ Verified
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div
                            className="rounded-circle bg-emerald-600 text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs"
                            style={{ width: '36px', height: '36px' }}
                          >
                            <i className="bi bi-person-check-fill"></i>
                          </div>
                          <div>
                            <strong className="text-dark d-block mb-0">
                              {selectedRequest.farmerName || selectedRequest.farmer || 'Ramesh Kumar'}
                            </strong>
                            <span className="text-emerald-700 small fw-bold" style={{ fontSize: '0.72rem' }}>
                              ✓ {language === 'ta' ? 'சரிபார்க்கப்பட்ட விவசாயி (இ-பட்டா உறுதி)' : 'Verified Smallholder Farmer (e-Patta Certified)'}
                            </span>
                          </div>
                        </div>
                        <div className="small text-muted mb-2.5">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{language === 'ta' ? 'பண்ணை இருப்பிடம்:' : 'Farm Location:'}</span>
                            <strong className="text-dark">
                              <span className="me-1">📍</span>
                              {selectedRequest.farmerLocation || selectedRequest.deliveryLocation || 'Nilakottai, Dindigul'}
                            </strong>
                          </div>
                          {selectedRequest.farmerFpo && (
                            <div className="d-flex justify-content-between mb-1">
                              <span>FPO Group:</span>
                              <strong className="text-dark">{selectedRequest.farmerFpo}</strong>
                            </div>
                          )}
                        </div>

                        {/* Direct Contact Links */}
                        <div className="bd-farmer-contact-actions border-top border-emerald-100">
                          <a
                            href={`tel:${modalFarmerPhone}`}
                            className="bd-phone-btn btn btn-success btn-sm d-flex align-items-center justify-center gap-1.5 fw-bold text-decoration-none shadow-xs"
                            style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                          >
                            <i className="bi bi-telephone-fill small"></i>
                            <span>{modalFarmerPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${modalCleanPhone}?text=${encodeURIComponent(`Hello ${selectedRequest.farmerName || selectedRequest.farmer}, regarding our approved order #${selectedRequest.id} for ${modalCropName}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bd-whatsapp-btn btn btn-sm d-flex align-items-center justify-center gap-1.5 fw-bold text-white text-decoration-none shadow-xs"
                            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                          >
                            <i className="bi bi-whatsapp small"></i>
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* PENDING: Protected Contact Info with SLA */}
                    {modalIsPending && (
                      <div className="p-3 bg-light rounded-3 border mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                            {t('farmerDetailsTitle')} (Candidate)
                          </span>
                          <span className="badge bg-amber-100 text-amber-800 border border-amber-200 text-xs">
                            ~2-4h Response SLA
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div
                            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs"
                            style={{ width: '36px', height: '36px' }}
                          >
                            <i className="bi bi-person"></i>
                          </div>
                          <div>
                            <strong className="text-dark d-block mb-0">
                              {selectedRequest.farmerName || selectedRequest.farmer || 'Ramesh Kumar'}
                            </strong>
                            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                              📍 {selectedRequest.farmerLocation || selectedRequest.deliveryLocation || 'Nilakottai, Dindigul'}
                            </span>
                          </div>
                        </div>
                        <div className="p-2 bg-warning-subtle border border-warning-subtle rounded-2 small text-dark mt-2">
                          <div className="d-flex align-items-center gap-1.5">
                            <i className="bi bi-shield-lock-fill text-warning"></i>
                            <span>
                              {language === 'ta'
                                ? 'விவசாயி ஒப்புதல் அளிக்கும் வரை நேரடி தொடர்பு எண் மறைக்கப்பட்டுள்ளது.'
                                : 'Direct phone number is hidden to protect farmer privacy until approval.'}
                            </span>
                          </div>
                          <span className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                            {language === 'ta'
                              ? 'மதிப்பிடப்பட்ட பதில் நேரம்: ~2 முதல் 4 மணிநேரம்.'
                              : 'Estimated response time: ~2 to 4 hours.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* DECLINED: Notice & Muted Rejection Message */}
                    {modalIsDeclined && (
                      <div className="mb-3">
                        <div className="p-3 bg-danger-subtle border border-danger-subtle rounded-3 small text-dark mb-2">
                          <div className="d-flex align-items-start gap-2">
                            <i className="bi bi-info-circle-fill text-danger mt-0.5"></i>
                            <div>
                              <strong className="d-block text-danger mb-0.5">
                                {language === 'ta' ? 'விவசாயியால் நிராகரிக்கப்பட்டது' : 'Declined by Farmer'}
                              </strong>
                              <p className="m-0 text-muted">
                                {language === 'ta'
                                  ? 'பங்கு இருப்பு அல்லது தளவாடக் கட்டுப்பாடுகள் காரணமாக விவசாயியால் இக்கோரிக்கையை ஏற்க இயலவில்லை.'
                                  : 'The farmer was unable to accept this request due to stock or logistics constraints.'}
                              </p>
                              {selectedRequest.rejectionReason && (
                                <p className="m-0 mt-1 text-danger small fst-italic">
                                  "{selectedRequest.rejectionReason}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-light rounded-2 border text-muted small d-flex align-items-center gap-2">
                          <i className="bi bi-shield-lock text-muted"></i>
                          <span>
                            {language === 'ta'
                              ? 'நிராகரிக்கப்பட்ட கோரிக்கைகளுக்கு நேரடி தொடர்பு விவரங்கள் மறைக்கப்பட்டுள்ளன.'
                              : 'Farmer direct contact details are hidden for declined requests.'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CONFIRMED: Confirmed Farmer Details */}
                    {!modalIsAccepted && !modalIsPending && !modalIsDeclined && (
                      <div className="p-3 bg-light rounded-3 border mb-3">
                        <span className="text-muted small fw-bold text-uppercase d-block mb-1.5" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                          {t('farmerDetailsTitle')}
                        </span>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs"
                            style={{ width: '36px', height: '36px' }}
                          >
                            <i className="bi bi-person-check-fill"></i>
                          </div>
                          <div>
                            <strong className="text-dark d-block mb-0">
                              {selectedRequest.farmerName || selectedRequest.farmer || 'Ramesh Kumar'}
                            </strong>
                            <span className="text-primary small fw-bold" style={{ fontSize: '0.72rem' }}>
                              ✓ Verified Farmer
                            </span>
                          </div>
                        </div>
                        <div className="small text-muted">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Location:</span>
                            <strong className="text-dark">
                              <span className="me-1">📍</span>
                              {selectedRequest.farmerLocation || selectedRequest.deliveryLocation || 'Nilakottai, Dindigul'}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Contact:</span>
                            <a href={`tel:${modalFarmerPhone}`} className="text-primary font-monospace fw-bold text-decoration-none">
                              <i className="bi bi-telephone-fill me-1 small"></i>
                              {modalFarmerPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Status Message / Context for Accepted */}
              {selectedRequest.status === 'Accepted' && (
                <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 mb-3 small text-dark">
                  <i className="bi bi-check-circle-fill text-success me-1.5"></i>
                  <strong>{language === 'ta' ? 'விவசாயி கோரிக்கையை ஏற்றுக்கொண்டார்!' : 'Farmer has approved your request!'}</strong>
                  <span className="d-block text-muted mt-0.5">
                    {language === 'ta' ? 'இப்போது ஆர்டரை உறுதி செய்து சரக்கு விநியோகத்தைத் தொடங்கலாம்.' : 'You can now proceed to payment and confirm delivery.'}
                  </span>
                </div>
              )}

              {/* ===================================================================
                  CONTEXTUAL ACTIONS (NO BUYER REJECT/CANCEL ACTIONS!)
                  =================================================================== */}
              <div className="d-flex flex-wrap gap-2 justify-content-end pt-2 border-top">
                {/* When Pending: Buyer ONLY observes, NO Cancel button! */}
                {selectedRequest.status === 'Pending' && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm rounded-pill px-4"
                    onClick={() => setSelectedRequest(null)}
                  >
                    {language === 'ta' ? 'மூடு' : 'Close'}
                  </button>
                )}

                {/* When Accepted: Proceed to Payment / Confirm Delivery */}
                {selectedRequest.status === 'Accepted' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1.5"
                      onClick={() => handleMessageFarmer(selectedRequest)}
                    >
                      <i className="bi bi-chat-dots-fill"></i>
                      <span>{t('messageFarmerBtn')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-success btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                      onClick={() => handleConfirmOrder(selectedRequest)}
                      disabled={isProcessing}
                    >
                      <i className="bi bi-check2-circle fs-6"></i>
                      <span>
                        {isProcessing
                          ? 'Processing...'
                          : (language === 'ta'
                            ? 'கட்டணம் செலுத்த / விநியோகத்தை உறுதிசெய் →'
                            : 'Proceed to Payment / Confirm Delivery →')}
                      </span>
                    </button>
                  </>
                )}

                {/* When Confirmed */}
                {selectedRequest.status === 'Confirmed' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1.5"
                      onClick={() => handleMessageFarmer(selectedRequest)}
                    >
                      <i className="bi bi-chat-dots-fill"></i>
                      <span>{t('messageFarmerBtn')}</span>
                    </button>

                    <Link
                      to="/buyer/orders"
                      className="btn btn-primary btn-sm rounded-pill px-4 fw-bold text-decoration-none d-flex align-items-center gap-1.5"
                    >
                      <i className="bi bi-box-seam"></i>
                      <span>{t('viewOrderBtn')}</span>
                    </Link>
                  </>
                )}

                {/* When Declined / Rejected */}
                {(selectedRequest.status === 'Declined' || selectedRequest.status === 'Rejected') && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm rounded-pill px-4"
                    onClick={() => setSelectedRequest(null)}
                  >
                    {language === 'ta' ? 'மூடு' : 'Close'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
