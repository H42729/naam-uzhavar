/**
 * Main Farmer Dashboard Page
 * Route: /farmer/dashboard
 * Clean farmer-first hierarchy focused on:
 * Add Harvest → Receive Buyer Request → View Request → Accept/Decline → Message Buyer → Track Order
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import AddHarvestModal from '../../components/farmer/AddHarvestModal';
import BuyerRequestsGrid from '../../components/farmer/BuyerRequestsGrid';
import { POPULAR_CROPS } from '../../data/cropsData';

export default function FarmerDashboardPage() {
  const { t, language } = useLanguage();
  const {
    harvests,
    buyerRequests,
    deliveries,
    stats,
    acceptRequest,
    declineRequest,
    removeHarvest,
    farmerProfile
  } = useFarmer();

  const navigate = useNavigate();

  // Add Harvest Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCropForModal, setSelectedCropForModal] = useState(POPULAR_CROPS[0]);

  const pendingRequests = buyerRequests.filter((r) => r.status === 'Pending');
  const activeOrdersCount = deliveries.filter((d) => d.currentStage !== 'Delivered').length;

  const farmerDisplayName =
    language === 'ta'
      ? farmerProfile?.tamilName || farmerProfile?.name || 'விவசாயி'
      : farmerProfile?.name || 'Arun Kumar';

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. FARMER GREETING & ACTIVITY HEADER
            =================================================================== */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h1 className="fw-black text-dark fs-3 mb-1" style={{ letterSpacing: '-0.3px' }}>
                {t('goodMorning')}, {farmerDisplayName} 👋
              </h1>
              <p className="text-muted small mb-0">
                {t('farmActivityAtGlance')}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-muted border rounded-pill px-3 py-1.5 small">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {farmerProfile?.district || 'Dindigul'}, TN
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. NEW BUYER REQUESTS ALERT BANNER (TOP PRIORITY)
            =================================================================== */}
        {pendingRequests.length > 0 && (
          <div
            className="w-full bg-emerald-800 text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 overflow-hidden"
            style={{
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            {/* Left: Typography & Meta Column */}
            <div className="flex-1 min-w-0">
              {/* Top Meta Row */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-900 shadow-xs shrink-0">
                  <span>📩</span>
                  <span>{t('newBuyerRequestsBanner')}</span>
                </span>
                <span className="text-xs font-semibold text-emerald-100 tracking-wide uppercase">
                  {language === 'ta' ? 'உடனடி கவனம் தேவை' : 'Immediate Attention Required'}
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight max-w-xl mb-0">
                {language === 'ta'
                  ? `உங்கள் பதிலுக்காக ${pendingRequests.length} புதிய கோரிக்கைகள் காத்திருக்கின்றன.`
                  : `You have ${pendingRequests.length} ${t('requestsWaitingReply')}`}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl mb-0">
                {language === 'ta'
                  ? 'வாங்குபவர்கள் உங்கள் விளைச்சலுக்கு நேரடி கொள்முதல் விலை வழங்கியுள்ளனர்.'
                  : 'Wholesale buyers have placed direct purchase offers for your produce.'}
              </p>
            </div>

            {/* Right: Fixed-Size Compact CTA Button */}
            <Link
              to="/farmer/requests"
              className="shrink-0 self-start md:self-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold shadow-sm transition-colors text-decoration-none"
              style={{
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{t('viewRequestsCTA')}</span>
            </Link>
          </div>
        )}


        {/* ===================================================================
            3. 3 SUMMARY STAT CARDS
            =================================================================== */}
        <div className="row g-2 g-sm-3 mb-4">
          {/* Card 1: My Harvest */}
          <div className="col-12 col-sm-4">
            <Link to="/farmer/harvest" className="text-decoration-none">
              <div className="farm-card p-3 p-sm-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    {t('myHarvest')}
                  </span>
                  <div className="fs-3 fw-black text-dark font-monospace">
                    {harvests.length} <span className="fs-6 fw-bold text-success">{t('productsCount')}</span>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-check-circle-fill text-success me-1"></i>
                    {language === 'ta' ? 'சந்தையில் செயலில் உள்ளது' : 'Live on marketplace'}
                  </span>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-success-subtle text-success flex-shrink-0"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-flower2 fs-5"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Card 2: Buyer Requests */}
          <div className="col-12 col-sm-4">
            <Link to="/farmer/requests" className="text-decoration-none">
              <div className="farm-card p-3 p-sm-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    {t('buyerRequests')}
                  </span>
                  <div className="fs-3 fw-black text-warning-emphasis font-monospace">
                    {pendingRequests.length} <span className="fs-6 fw-bold text-muted">{t('pendingCount')}</span>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-bell-fill text-warning me-1"></i>
                    {language === 'ta' ? 'பரிசீலனை தேவை' : 'Awaiting your reply'}
                  </span>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis flex-shrink-0"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-inbox-fill fs-5"></i>
                </div>
              </div>
            </Link>
          </div>

          {/* Card 3: Orders */}
          <div className="col-12 col-sm-4">
            <Link to="/farmer/orders" className="text-decoration-none">
              <div className="farm-card p-3 p-sm-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    {t('orders')}
                  </span>
                  <div className="fs-3 fw-black text-primary font-monospace">
                    {activeOrdersCount} <span className="fs-6 fw-bold text-muted">{t('active')}</span>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-truck text-info me-1"></i>
                    {language === 'ta' ? 'விநியோக கண்காணிப்பு' : 'Logistics tracking'}
                  </span>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary flex-shrink-0"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-box-seam-fill fs-5"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ===================================================================
            4. PROMINENT MAIN CTA: + ADD HARVEST
            =================================================================== */}
        <div className="text-center my-3 mb-4">
          <Link
            to="/farmer/add-harvest"
            className="btn btn-success text-white fw-black py-3 px-5 rounded-pill shadow-md d-inline-flex align-items-center justify-content-center gap-2 border-0 hover-scale transition w-100 w-sm-auto"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              fontSize: '1.08rem',
              minHeight: '48px'
            }}
          >
            <i className="bi bi-plus-circle-fill fs-5"></i>
            <span>{t('addHarvestCTA')}</span>
          </Link>
        </div>

        {/* ===================================================================
            5. SUBTLE ACTIONABLE AI PRICE SUGGESTION CHIP (SECTION 22)
            =================================================================== */}
        <div className="p-3 bg-white rounded-4 border shadow-2xs mb-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-lightbulb-fill fs-5"></i>
            </div>
            <div>
              <strong className="text-dark d-block small">💡 {t('suggestedPrice')}</strong>
              <span className="text-muted small">
                {language === 'ta'
                  ? 'தக்காளிக்கான தேவை தற்போது அதிகமாக உள்ளது. பரிந்துரைக்கப்படும் விற்பனை விலை: ₹27–₹30/கிலோ'
                  : 'Current demand for Tomato is high. Suggested selling range: ₹27–₹30/kg'}
              </span>
            </div>
          </div>
          <Link
            to="/farmer/demand-forecast"
            className="btn btn-sm btn-outline-success rounded-pill fw-bold text-nowrap flex-shrink-0"
          >
            {language === 'ta' ? 'முழு விவரம் →' : 'Market Trends →'}
          </Link>
        </div>

        {/* ===================================================================
            6. RECENT BUYER REQUESTS PREVIEW (HIGHEST PRIORITY)
            =================================================================== */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                {language === 'ta' ? 'நேரடி மொத்த விலை ஏலங்கள்' : 'DIRECT WHOLESALE OFFERS'}
              </span>
              <h2 className="fs-4 fw-bold text-dark mb-0">{t('buyerRequests')}</h2>
            </div>

            <Link to="/farmer/requests" className="btn btn-outline-success btn-sm fw-bold rounded-pill px-3">
              {t('viewRequestsCTA')}
            </Link>
          </div>

          <BuyerRequestsGrid
            requests={buyerRequests}
            onAccept={acceptRequest}
            onDecline={declineRequest}
            variant="dashboard"
            limit={3}
          />
        </div>

        {/* ===================================================================
            7. MY HARVEST OVERVIEW SECTION
            =================================================================== */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                {language === 'ta' ? 'பண்ணை விளைச்சல் இருப்பு' : 'ACTIVE PRODUCE INVENTORY'}
              </span>
              <h2 className="fs-4 fw-bold text-dark mb-0">{t('myHarvests')}</h2>
            </div>

            <Link to="/farmer/harvest" className="btn btn-outline-success btn-sm fw-bold rounded-pill px-3">
              {language === 'ta' ? 'அனைத்தையும் பார்' : 'View All'} ({harvests.length}) →
            </Link>
          </div>

          {harvests.length === 0 ? (
            <div className="p-5 text-center bg-white rounded-4 border">
              <i className="bi bi-flower2 fs-1 text-muted mb-2 d-block"></i>
              <strong className="fs-5 fw-bold text-dark d-block mb-1">{t('noHarvestYetTitle')}</strong>
              <p className="text-muted small mb-3">{t('noHarvestYetDesc')}</p>
              <Link to="/farmer/add-harvest" className="btn btn-success fw-bold px-4 py-2 rounded-pill">
                {t('addHarvestCTA')}
              </Link>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {harvests.slice(0, 4).map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                  <div className="farm-card p-3 rounded-4 bg-white border h-100 d-flex flex-column shadow-xs">
                    <div className="rounded-3 overflow-hidden position-relative mb-2" style={{ height: '125px' }}>
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <span
                        className={`position-absolute top-0 end-0 badge m-1.5 ${
                          item.status === 'Available'
                            ? 'bg-success'
                            : item.status === 'Buyer Request'
                            ? 'bg-warning text-dark'
                            : 'bg-secondary'
                        }`}
                      >
                        {item.status === 'Available' ? t('availableStatus') : item.status}
                      </span>
                    </div>

                    <strong className="fs-6 text-dark d-block mb-1 text-truncate">
                      {language === 'ta' ? item.tamilName || item.name : item.name}
                    </strong>

                    <div className="d-flex align-items-center justify-content-between text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
                      <span>
                        {t('quantityLabel')}: <strong className="text-dark font-monospace">{item.quantity} {item.unit || 'kg'}</strong>
                      </span>
                      <span className="text-success font-monospace fw-bold">
                        ₹{item.pricePerKg || item.typicalPricePerKg || 25}/kg
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between text-muted small mb-3" style={{ fontSize: '0.74rem' }}>
                      <span>
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {item.location?.split(',')[0] || 'Dindigul'}
                      </span>
                      {item.buyerRequestCount > 0 ? (
                        <Link to="/farmer/requests" className="badge bg-warning-subtle text-warning-emphasis text-decoration-none">
                          {item.buyerRequestCount} {t('buyerRequests')}
                        </Link>
                      ) : (
                        <span className="text-muted small">0 Requests</span>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-auto pt-2 border-top">
                      <Link
                        to="/farmer/requests"
                        className="btn btn-outline-secondary btn-xs flex-grow-1 rounded-2 text-decoration-none"
                      >
                        {t('viewRequestsForCrop')}
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-xs rounded-2"
                        onClick={() => removeHarvest(item.id, item.name)}
                        title={t('removeHarvestBtn')}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Harvest 4-Step Popup Modal (kept for fast modal flows) */}
      <AddHarvestModal
        show={showAddModal}
        initialCrop={selectedCropForModal}
        onClose={() => setShowAddModal(false)}
      />
    </FarmerLayout>
  );
}
