/**
 * Main Farmer Dashboard Page
 * Route: /farmer/dashboard
 * Features:
 * - Welcome Hero: "Your Harvest. Your Buyers. Your Price."
 * - 4 Summary Cards (My Harvest, Buyer Requests, Accepted, Deliveries)
 * - "What did you harvest today?" crop selector with large realistic images
 * - 4-Step "Add My Harvest" Modal
 * - "My Harvest" Section preview with real-time add/remove
 * - Recent Buyer Requests with instant Accept/Decline actions
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import AddHarvestModal from '../../components/farmer/AddHarvestModal';
import { POPULAR_CROPS, MORE_CROPS } from '../../data/cropsData';

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

  // More Crops Picker Modal
  const [showMoreCropsModal, setShowMoreCropsModal] = useState(false);

  // Edit Harvest Modal
  const [editingHarvest, setEditingHarvest] = useState(null);

  const handleCropCardClick = (crop) => {
    setSelectedCropForModal(crop);
    setShowAddModal(true);
  };

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. WELCOME SECTION (HERO CARD)
            =================================================================== */}
        <div
          className="rounded-4 p-3 p-sm-4 p-md-5 mb-4 position-relative overflow-hidden text-white shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          {/* Decorative Leaf / Ambient Glow */}
          <div
            className="position-absolute end-0 top-0 bottom-0 opacity-15 d-none d-md-block pointer-events-none"
            style={{ width: '380px', overflow: 'hidden' }}
          >
            <i className="bi bi-flower1" style={{ fontSize: '20rem', transform: 'rotate(25deg) translateY(-20%)', display: 'block' }}></i>
          </div>

          <div className="position-relative" style={{ zIndex: 2, maxWidth: '640px' }}>
            <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 bg-white bg-opacity-20 rounded-pill mb-2.5 backdrop-blur small" style={{ fontSize: '0.78rem' }}>
              <span className="text-warning">★</span>
              <span className="fw-semibold">Direct Mandi Platform • Dindigul Hub</span>
            </div>

            <h1 className="fw-black mb-2 text-white" style={{ fontSize: 'clamp(1.4rem, 4.5vw, 2.25rem)', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
              {t('farmerHeroTitle')}
            </h1>

            <p className="text-white text-opacity-90 mb-3 mb-md-4 fw-normal" style={{ fontSize: 'clamp(0.88rem, 2.2vw, 1.15rem)', lineHeight: 1.4 }}>
              {t('farmerHeroSubtitle')}
            </p>

            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 gap-sm-3">
              {/* Primary strongest visual button */}
              <button
                type="button"
                className="btn btn-warning text-dark fw-black py-2.5 py-sm-3 px-3 px-sm-4 rounded-pill shadow-lg d-inline-flex align-items-center justify-content-center gap-2 border-0 hover-scale transition text-truncate"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                  fontSize: 'clamp(0.92rem, 2vw, 1.15rem)'
                }}
                onClick={() => {
                  setSelectedCropForModal(POPULAR_CROPS[0]);
                  setShowAddModal(true);
                }}
              >
                <i className="bi bi-plus-circle-fill fs-5"></i>
                <span>+ {t('addMyHarvest')}</span>
              </button>

              {/* Secondary button */}
              <Link
                to="/farmer/harvest"
                className="btn btn-outline-light fw-bold py-2.5 py-sm-3 px-3 px-sm-4 rounded-pill hover-bg-white hover-text-dark transition text-center text-truncate"
                style={{ fontSize: 'clamp(0.88rem, 2vw, 1rem)' }}
              >
                {t('myHarvests')}
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. SUMMARY CARDS (4 SIMPLE CARDS)
            =================================================================== */}
        <div className="row g-2 g-sm-3 mb-4 mb-md-5">
          {/* Card 1: My Harvest */}
          <div className="col-6 col-lg-3">
            <Link to="/farmer/harvest" className="text-decoration-none">
              <div className="farm-card p-2.5 p-sm-3 p-md-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-bold text-uppercase text-truncate me-1" style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    {t('myHarvest')}
                  </span>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-success-subtle text-success flex-shrink-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-flower2 fs-6"></i>
                  </div>
                </div>
                <div className="fs-3 fs-md-2 fw-black text-dark font-monospace mb-1">
                  {stats.myHarvest} <span className="fs-6 fw-bold text-success">{t('active')}</span>
                </div>
                <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-check-circle-fill text-success me-1"></i> Live for wholesale buyers
                </span>
              </div>
            </Link>
          </div>

          {/* Card 2: Buyer Requests */}
          <div className="col-6 col-lg-3">
            <Link to="/farmer/requests" className="text-decoration-none">
              <div className="farm-card p-2.5 p-sm-3 p-md-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-bold text-uppercase text-truncate me-1" style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    {t('buyerRequests')}
                  </span>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis flex-shrink-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-inbox-fill fs-6"></i>
                  </div>
                </div>
                <div className="fs-3 fs-md-2 fw-black text-warning-emphasis font-monospace mb-1">
                  {stats.buyerRequests} <span className="fs-6 fw-bold text-muted">{t('pending')}</span>
                </div>
                <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-bell-fill text-warning me-1"></i> Requires review
                </span>
              </div>
            </Link>
          </div>

          {/* Card 3: Accepted Orders */}
          <div className="col-6 col-lg-3">
            <Link to="/farmer/requests" className="text-decoration-none">
              <div className="farm-card p-2.5 p-sm-3 p-md-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-bold text-uppercase text-truncate me-1" style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    {t('accepted')}
                  </span>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary flex-shrink-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-patch-check-fill fs-6"></i>
                  </div>
                </div>
                <div className="fs-3 fs-md-2 fw-black text-primary font-monospace mb-1">
                  {stats.accepted} <span className="fs-6 fw-bold text-muted">{t('myOrders')}</span>
                </div>
                <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-wallet2 text-primary me-1"></i> Direct settlement
                </span>
              </div>
            </Link>
          </div>

          {/* Card 4: Deliveries */}
          <div className="col-6 col-lg-3">
            <Link to="/farmer/deliveries" className="text-decoration-none">
              <div className="farm-card p-2.5 p-sm-3 p-md-4 rounded-4 bg-white border h-100 shadow-xs hover-shadow transition">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small fw-bold text-uppercase text-truncate me-1" style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    {t('deliveries')}
                  </span>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-info-subtle text-info-emphasis flex-shrink-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-truck fs-6"></i>
                  </div>
                </div>
                <div className="fs-3 fs-md-2 fw-black text-dark font-monospace mb-1">
                  {stats.deliveries} <span className="fs-6 fw-bold text-info">{t('active')}</span>
                </div>
                <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i> Tata Ace assigned
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* ===================================================================
            3. MAIN FEATURE: "What did you harvest today?"
            =================================================================== */}
        <div className="mb-4 mb-md-5">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">
            <div>
              <h2 className="fw-black text-dark fs-4 fs-md-3 mb-1" style={{ letterSpacing: '-0.3px' }}>
                {t('whatDidYouHarvestToday')}
              </h2>
              <p className="text-muted small mb-0">
                {t('harvestSubtitle')}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success fw-bold rounded-pill px-3 py-1.5 btn-sm flex-shrink-0"
              onClick={() => setShowMoreCropsModal(true)}
            >
              <i className="bi bi-grid-3x3-gap-fill me-1"></i> {t('viewAllCrops')}
            </button>
          </div>

          {/* Crop Cards Grid (2 cols on mobile, 3 on tablet, 4 on desktop, 9 total with + More) */}
          <div className="row g-2 g-sm-3 g-md-4">
            {POPULAR_CROPS.map((crop) => (
              <div key={crop.id} className="col-6 col-md-4 col-lg-3">
                <div
                  className="bg-white rounded-4 border overflow-hidden shadow-xs hover-shadow transition cursor-pointer h-100 d-flex flex-column text-center p-2 p-sm-3"
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                  onClick={() => handleCropCardClick(crop)}
                >
                  <div className="rounded-3 overflow-hidden mb-2 mb-sm-3 position-relative" style={{ height: '115px' }}>
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-100 h-100 object-fit-cover hover-scale transition"
                    />
                    <span
                      className="position-absolute bottom-0 end-0 badge bg-dark bg-opacity-75 m-1.5 small"
                      style={{ fontSize: '0.64rem' }}
                    >
                      ₹{crop.typicalPricePerKg}/kg
                    </span>
                  </div>

                  <strong className="fs-6 text-dark d-block mb-1 text-truncate">
                    {language === 'ta' ? crop.tamilName : crop.name}
                  </strong>

                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm w-100 rounded-pill fw-bold mt-auto py-1 py-sm-1.5 px-1 text-truncate"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <i className="bi bi-plus me-1"></i> {t('addMyHarvest')}
                  </button>
                </div>
              </div>
            ))}

            {/* "+ More Crops" Card */}
            <div className="col-6 col-md-4 col-lg-3">
              <div
                className="bg-light rounded-4 border-2 border-dashed border-success-subtle overflow-hidden h-100 d-flex flex-column align-items-center justify-content-center text-center p-3 cursor-pointer hover-bg-white transition"
                style={{ minHeight: '210px', cursor: 'pointer' }}
                onClick={() => setShowMoreCropsModal(true)}
              >
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-2 shadow-sm"
                  style={{ width: '48px', height: '48px' }}
                >
                  <i className="bi bi-plus-lg fs-4"></i>
                </div>

                <strong className="fs-6 text-dark d-block mb-1">+ More Crops</strong>
                <p className="text-muted small mb-2 d-none d-sm-block" style={{ fontSize: '0.75rem' }}>
                  Brinjal, Cabbage, Moringa & more
                </p>

                <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill small fw-bold" style={{ fontSize: '0.72rem' }}>
                  Browse All →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            4. "MY HARVEST" SECTION PREVIEW
            =================================================================== */}
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                ACTIVE MARKETPLACE LISTINGS
              </span>
              <h2 className="fs-3 fw-bold text-dark mb-0">My Harvest</h2>
            </div>

            <Link to="/farmer/harvest" className="btn btn-outline-success btn-sm fw-bold rounded-pill px-3">
              View All ({harvests.length}) →
            </Link>
          </div>

          {harvests.length === 0 ? (
            <div className="p-5 text-center bg-white rounded-4 border">
              <i className="bi bi-flower2 fs-1 text-muted mb-2 d-block"></i>
              <h3 className="fs-5 fw-bold text-dark">No Harvests Published Yet</h3>
              <p className="text-muted small mb-3">
                Tap on any crop above to publish your first harvest directly to buyers!
              </p>
              <button
                type="button"
                className="btn btn-success fw-bold px-4 py-2 rounded-pill"
                onClick={() => {
                  setSelectedCropForModal(POPULAR_CROPS[0]);
                  setShowAddModal(true);
                }}
              >
                + Add My Harvest
              </button>
            </div>
          ) : (
            <div className="row g-2 g-sm-3">
              {harvests.slice(0, 4).map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                  <div className="farm-card p-2.5 p-sm-3 rounded-4 bg-white border h-100 d-flex flex-column shadow-xs">
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
                            : item.status === 'Sold'
                            ? 'bg-secondary'
                            : 'bg-info text-dark'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <strong className="fs-6 text-dark d-block mb-1 text-truncate">
                      {item.name}
                    </strong>

                    <div className="d-flex align-items-center justify-content-between text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
                      <span>
                        Qty: <strong className="text-dark font-monospace">{item.quantity} {item.unit || 'kg'}</strong>
                      </span>
                      <span className="badge bg-light text-dark border">
                        {item.isEstimated ? 'Estimated' : 'Exact'}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between text-muted small mb-3" style={{ fontSize: '0.78rem' }}>
                      <span>
                        Quality: <strong className="text-dark">{item.quality || 'Good / Fresh'}</strong>
                      </span>
                      <span className="text-success small fw-semibold">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>Dindigul
                      </span>
                    </div>

                    <div className="d-flex gap-2 mt-auto pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-xs btn-outline-secondary flex-grow-1 rounded-2"
                        onClick={() => {
                          setSelectedCropForModal({
                            name: item.cropName || item.name,
                            tamilName: item.tamilName || '',
                            image: item.images?.[0] || ''
                          });
                          setShowAddModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline-danger rounded-2"
                        onClick={() => removeHarvest(item.id, item.name)}
                        title="Remove Harvest"
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

        {/* ===================================================================
            5. BUYER REQUESTS PREVIEW
            =================================================================== */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
            <div>
              <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                {language === 'ta' ? 'நேரடி மொத்த விலை ஏலங்கள்' : 'DIRECT WHOLESALE BIDS'}
              </span>
              <h2 className="fs-4 fs-md-3 fw-bold text-dark mb-0">{t('buyerRequests')}</h2>
            </div>

            <Link to="/farmer/requests" className="btn btn-outline-warning text-dark btn-sm fw-bold rounded-pill px-3">
              {language === 'ta' ? 'அனைத்தையும் பார்க்க' : 'View All'} ({buyerRequests.length}) →
            </Link>
          </div>

          <div className="row g-2 g-sm-3">
            {buyerRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="col-12 col-md-6 col-lg-4">
                <div className="p-3 bg-white rounded-4 border shadow-xs h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <img
                      src={req.avatar}
                      alt={req.buyerName}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '42px', height: '42px' }}
                    />
                    <div>
                      <strong className="text-dark d-block small">{req.buyerName}</strong>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {req.buyerType}
                      </span>
                    </div>
                    <span
                      className={`badge ms-auto ${
                        req.status === 'Accepted'
                          ? 'bg-success-subtle text-success'
                          : req.status === 'Declined'
                          ? 'bg-danger-subtle text-danger'
                          : 'bg-warning-subtle text-warning-emphasis'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="p-2 bg-light rounded-3 mb-2 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Crop:</span>
                      <strong className="text-dark">{req.cropRequested}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Quantity:</span>
                      <strong className="text-success font-monospace">{req.quantity}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Offer:</span>
                      <strong className="text-dark font-monospace">{req.offerPrice}</strong>
                    </div>
                  </div>

                  <p className="text-muted small mb-3 text-truncate" style={{ fontSize: '0.78rem' }}>
                    "{req.message}"
                  </p>

                  <div className="d-flex gap-2 mt-auto">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-success fw-bold flex-grow-1"
                          onClick={() => acceptRequest(req.id)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => declineRequest(req.id)}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="badge bg-light text-muted border w-100 py-2">
                        Status: {req.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================
          ADD HARVEST 4-STEP POPUP MODAL
          =================================================================== */}
      <AddHarvestModal
        show={showAddModal}
        initialCrop={selectedCropForModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* ===================================================================
          MORE CROPS CATALOG MODAL
          =================================================================== */}
      {showMoreCropsModal && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-60 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
          style={{ zIndex: 1200, top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-white rounded-4 p-4 max-w-lg w-100 shadow-2xl" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <strong className="fs-5 text-dark">
                  {language === 'ta' ? 'தமிழ்நாடு பயிர்கள் பட்டியல்' : 'Tamil Nadu Crops Catalog'}
                </strong>
                <span className="text-muted small d-block">
                  {language === 'ta' ? 'உங்கள் அறுவடையைச் சேர்க்க எந்தப் பயிரையும் தேர்ந்தெடுக்கவும்' : 'Select any crop to add your harvest'}
                </span>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowMoreCropsModal(false)}
              ></button>
            </div>

            <div className="row g-3">
              {[...POPULAR_CROPS, ...MORE_CROPS].map((crop) => (
                <div key={crop.id} className="col-6 col-sm-4">
                  <div
                    className="p-2 border rounded-3 text-center cursor-pointer hover-bg-light transition h-100 d-flex flex-column align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowMoreCropsModal(false);
                      setSelectedCropForModal(crop);
                      setShowAddModal(true);
                    }}
                  >
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="rounded-3 object-fit-cover mb-2"
                      style={{ width: '100%', height: '85px' }}
                    />
                    <strong className="text-dark small d-block mb-1">{crop.name}</strong>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      {crop.tamilName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}
