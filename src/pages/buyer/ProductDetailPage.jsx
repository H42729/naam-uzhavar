/**
 * Product Detail Page
 * Route: /buyer/products/:id
 * Implements the clean details page and request submission flow matching Master Prompt Sections 9 & 10:
 * - Multi-image gallery with thumbnails
 * - Produce name (English & Tamil)
 * - Current price vs Mandi reference
 * - Grade, available quantity, shelf life
 * - Farmer trust credentials (verified badge, location, FPO)
 * - Interactive quantity selector with dynamic total calculation
 * - Validation & double-submission prevention
 * - SEND REQUEST modal / form submitting to BuyerContext.requests
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import BulkProcurementModal from '../../components/buyer/BulkProcurementModal';
import DirectBuyModal from '../../components/buyer/DirectBuyModal';
import { INITIAL_PRODUCTS } from '../../data/buyerData';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, createRequest, showToast } = useBuyer();
  const { t, language } = useLanguage();

  // Find product by id
  const product = useMemo(() => {
    const searchId = String(id || '').toLowerCase().trim();
    return (
      products.find(
        (p) =>
          String(p.id).toLowerCase() === searchId ||
          p.crop.toLowerCase() === searchId
      ) ||
      INITIAL_PRODUCTS.find(
        (p) =>
          String(p.id).toLowerCase() === searchId ||
          p.crop.toLowerCase() === searchId
      ) ||
      null
    );
  }, [id, products]);

  // Image gallery state
  const images = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE];
    if (product.crop?.toLowerCase().includes('brinjal')) {
      return [
        '/images/brinjal.jpg',
        '/images/brinjal-2.jpg'
      ];
    }
    if (product.images && product.images.length > 0) return product.images;
    return [product.image || FALLBACK_IMAGE];
  }, [product]);

  const [selectedImg, setSelectedImg] = useState(0);

  // Dynamic Quantity Selector
  const maxAvailable = Math.max(Number(product?.quantity) || 500, 10);
  const minOrder = Math.min(Number(product?.minOrder) || 50, maxAvailable);
  const [requestedQty, setRequestedQty] = useState(minOrder);

  // Request Form State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDirectBuyModal, setShowDirectBuyModal] = useState(false);
  const [deliveryPreference, setDeliveryPreference] = useState('hub');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState('');

  if (!product) {
    return (
      <BuyerLayout>
        <div className="text-center py-5 bg-white rounded-4 border p-5 my-4">
          <i className="bi bi-exclamation-octagon fs-1 text-warning mb-3 d-block"></i>
          <h3 className="fw-bold text-dark">
            {language === 'ta' ? 'விளைச்சல் பதிவு காணப்படவில்லை' : 'Produce Lot Not Found'}
          </h3>
          <p className="text-muted mb-4">
            {language === 'ta'
              ? `தேடப்பட்ட விளைச்சல் #${id} சந்தையிலிருந்து அகற்றப்பட்டிருக்கலாம்.`
              : `The requested produce lot #${id} may have expired or been fulfilled.`}
          </p>
          <Link to="/buyer/browse" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
            ← {t('backToMarketplace')}
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  // Dynamic total calculation
  const unitPrice = Number(product.price) || 25;
  const calculatedTotal = requestedQty * unitPrice;

  // Quantity Stepper Handlers
  const handleQuantityChange = (val) => {
    const num = Number(val);
    if (isNaN(num)) return;
    if (num > maxAvailable) {
      setRequestedQty(maxAvailable);
      setRequestError(t('maxQuantityExceeded'));
    } else if (num < 1) {
      setRequestedQty(1);
      setRequestError('');
    } else {
      setRequestedQty(num);
      setRequestError('');
    }
  };

  const handleStepQty = (delta) => {
    const next = requestedQty + delta;
    if (next > maxAvailable) {
      setRequestedQty(maxAvailable);
      setRequestError(t('maxQuantityExceeded'));
    } else if (next < 1) {
      setRequestedQty(1);
      setRequestError('');
    } else {
      setRequestedQty(next);
      setRequestError('');
    }
  };

  // Submit Sourcing Request Handler
  const handleSendRequest = (e) => {
    e.preventDefault();
    if (requestedQty <= 0) {
      setRequestError(t('minQuantityRequired'));
      return;
    }
    if (requestedQty > maxAvailable) {
      setRequestError(t('maxQuantityExceeded'));
      return;
    }

    setIsSubmitting(true);
    setRequestError('');

    setTimeout(() => {
      createRequest({
        farmerName: product.farmer || 'Verified Farmer',
        farmerPhone: product.farmerPhone || '+91 98421 77234',
        farmerLocation: product.location || 'Dindigul',
        farmerFpo: product.fpo || 'Dindigul Farmers Producer Co-op',
        productId: product.id,
        harvestId: product.id,
        productName: product.crop || product.name || 'Farmgate Produce',
        productTamilName: product.tamilName || 'நாட்டு விளைச்சல்',
        productImage: images[0],
        quantity: requestedQty,
        unit: 'kg',
        price: unitPrice,
        offeredPrice: unitPrice,
        totalAmount: calculatedTotal,
        deliveryPreference:
          deliveryPreference === 'farmgate'
            ? 'Direct Farmgate Pickup'
            : 'Consolidated Regional Hub Delivery',
        deliveryLocation: product.location || 'Dindigul Central Hub',
        message: buyerMessage.trim() || null
      });

      setIsSubmitting(false);
      setShowRequestModal(false);
      navigate('/buyer/requests');
    }, 500);
  };

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade" style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <Link
            to="/buyer/browse"
            className="btn btn-light rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 border text-decoration-none text-dark"
          >
            <i className="bi bi-arrow-left"></i>
            <span>{t('backToMarketplace')}</span>
          </Link>

          <span className="badge bg-light text-muted border font-monospace px-3 py-1.5 small">
            #{product.id}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="row g-4 mb-4">
          {/* ===================================================================
              LEFT: PRODUCT IMAGE GALLERY
              =================================================================== */}
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 border shadow-xs p-3 sticky-md-top" style={{ top: '80px' }}>
              {/* Large Image Preview */}
              <div className="rounded-3 overflow-hidden position-relative mb-2.5" style={{ height: '320px', backgroundColor: '#f8fafc' }}>
                <img
                  src={images[selectedImg]}
                  alt={product.crop}
                  className="w-100 h-100 object-fit-cover"
                />
                <span className="position-absolute top-0 end-0 m-2 badge bg-success text-white fw-bold shadow-xs">
                  {product.grade || 'Grade A'}
                </span>
              </div>

              {/* Thumbnails if multiple images exist */}
              {images.length > 1 && (
                <div className="d-flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn p-0 rounded-3 overflow-hidden border-2 transition ${
                        selectedImg === idx ? 'border-primary shadow-xs' : 'border-light opacity-75'
                      }`}
                      style={{ width: '64px', height: '64px', flexShrink: 0 }}
                      onClick={() => setSelectedImg(idx)}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-100 h-100 object-fit-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality & Freshness Guarantee Notes */}
              <div className="p-3 bg-light rounded-3 mt-3 small">
                <strong className="d-block text-dark mb-1">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  {language === 'ta' ? 'தர உத்தரவாதம்' : 'Quality Verification'}:
                </strong>
                <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>
                  {product.description || 'Freshly sorted country produce harvested at optimal maturity for institutional retail & culinary supply.'}
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT: SPECIFICATIONS & SEND REQUEST CARD
              =================================================================== */}
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 border shadow-xs p-4 d-flex flex-column h-100">
              {/* Header Title & Badges */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h1 className="fs-3 fw-black text-dark mb-0">{product.crop}</h1>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-bold small">
                    ✓ {t('verifiedLotBadge')}
                  </span>
                </div>
                <span className="text-muted fs-6 d-block mb-2">
                  {product.tamilName ? product.tamilName : 'நாட்டு விளைபொருள்'}
                </span>

                {/* Direct Farmgate Pricing Box (Mandi Reference completely removed) */}
                <div
                  className="rounded-3 p-3 mb-2 bg-slate-50 border border-slate-200/80 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                >
                  <span className="text-slate-600 small fw-semibold" style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {language === 'ta' ? 'பண்ணை விலை' : 'Listing Price'}:
                  </span>
                  <div className="d-flex align-items-baseline text-end">
                    <strong className="fs-3 font-monospace fw-bold text-dark" style={{ color: '#0f172a' }}>
                      ₹{unitPrice}
                    </strong>
                    <span className="text-muted small ms-1 font-medium"> / kg</span>
                  </div>
                </div>
              </div>

              {/* ===================================================================
                  FARMER & HARVEST INFORMATION SECTION
                  =================================================================== */}
              <div className="border rounded-4 p-3.5 p-sm-4 mb-3 bg-light bg-opacity-50 shadow-2xs">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <span className="text-muted small fw-bold text-uppercase d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                    <span aria-hidden="true">🌾</span>
                    <span>{language === 'ta' ? 'உழவர் மற்றும் அறுவடை விவரங்கள்' : 'Farmer & Harvest Information'}</span>
                  </span>
                  <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-2.5 py-1 small fw-bold d-inline-flex align-items-center gap-1">
                    <i className="bi bi-patch-check-fill text-success"></i>
                    <span>{language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified Listing'}</span>
                  </span>
                </div>

                {/* 1. Farmer / Farm Name with green ✓ Verified badge */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2.5 border-bottom">
                  <div className="d-flex align-items-center gap-2.5">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs flex-shrink-0"
                      style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block fs-6 mb-0">
                        {product.farmer || 'Ravi Farms (R. Ravi)'}
                      </strong>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {product.fpo || 'Dindigul Smallholder Producer Cluster'}
                      </span>
                    </div>
                  </div>

                  <span
                    className="badge bg-success text-white rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 shadow-2xs fw-bold"
                    style={{ fontSize: '0.75rem', backgroundColor: '#10b981' }}
                  >
                    <span>✓</span>
                    <span>{language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</span>
                  </span>
                </div>

                {/* 2. Full Farm Location with map pin icon (📍) */}
                <div className="d-flex align-items-start gap-2 mb-3 pb-2.5 border-bottom">
                  <span className="fs-5 flex-shrink-0 mt-0.5" aria-hidden="true">📍</span>
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase d-block mb-0.5" style={{ fontSize: '0.7rem' }}>
                      {language === 'ta' ? 'பண்ணை முழு முகவரி' : 'Full Farm Location'}:
                    </span>
                    <strong className="text-dark small fs-6 d-block" style={{ lineHeight: '1.45' }}>
                      {product.farmAddress || `${product.location || 'South Street, Reddiarchatram, Dindigul - 624622'}`}
                    </strong>
                  </div>
                </div>

                {/* 3. Contact Number with Active Call Trigger & WhatsApp Chat Option */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2.5 border-bottom">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase d-block mb-0.5" style={{ fontSize: '0.7rem' }}>
                      {language === 'ta' ? 'நேரடி தொடர்பு எண்' : 'Contact Number'}:
                    </span>
                    <strong className="text-dark font-monospace fs-6">
                      {product.farmerPhone || '+91 98421 77234'}
                    </strong>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`tel:${(product.farmerPhone || '+919842177234').replace(/\s+/g, '')}`}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-2xs transition hover-scale"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <i className="bi bi-telephone-outbound-fill"></i>
                      <span>{language === 'ta' ? 'அழைக்க' : 'Call Farmer'}</span>
                    </a>
                    <a
                      href={`https://wa.me/${(product.farmerPhone || '+919842177234').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${product.farmer || 'Farmer'}, I am inquiring about your ${product.crop} listed on Naam Uzhavar (Lot #${product.id}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-2xs transition hover-scale"
                      style={{ backgroundColor: '#25D366', borderColor: '#25D366', fontSize: '0.8rem' }}
                    >
                      <i className="bi bi-whatsapp"></i>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* 4. Harvest Specifications (4 tiles: Available Qty, Grade, Harvest Window, Price / kg) */}
                <div>
                  <span className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.7rem' }}>
                    {language === 'ta' ? 'அறுவடை விவரக்குறிப்புகள்' : 'Harvest Specifications'}
                  </span>
                  <div className="row g-2 text-center">
                    <div className="col-6 col-sm-3">
                      <div className="p-2.5 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center shadow-2xs">
                        <span className="text-muted small d-block mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                          {language === 'ta' ? 'இருப்பு' : 'Available Qty'}
                        </span>
                        <strong className="text-success font-monospace small fw-bold fs-6">
                          {product.quantity || maxAvailable} kg
                        </strong>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-2.5 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center shadow-2xs">
                        <span className="text-muted small d-block mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                          {language === 'ta' ? 'தரம்' : 'Quality Grade'}
                        </span>
                        <strong className="text-dark small fw-bold text-truncate">
                          {product.grade || 'Grade A Premium'}
                        </strong>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-2.5 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center shadow-2xs">
                        <span className="text-muted small d-block mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                          {language === 'ta' ? 'அறுவடை காலம்' : 'Harvest Window'}
                        </span>
                        <strong className="text-dark small fw-bold font-monospace">
                          {product.shelfLife || '8 - 10 Days'}
                        </strong>
                      </div>
                    </div>
                    <div className="col-6 col-sm-3">
                      <div className="p-2.5 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center shadow-2xs">
                        <span className="text-muted small d-block mb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                          {language === 'ta' ? 'கிலோ விலை' : 'Price / kg'}
                        </span>
                        <strong className="text-dark small fw-bold font-monospace">
                          ₹{unitPrice} / kg
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price Calculation */}
              <div className="p-3 bg-primary-subtle bg-opacity-25 rounded-3 border border-primary-subtle mb-3">
                <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1.5">
                  <span>{language === 'ta' ? 'தேவைப்படும் அளவு' : 'Purchase Quantity'}:</span>
                  <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Max: {maxAvailable} kg
                  </span>
                </label>

                {/* Stepper Input */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px' }}
                    onClick={() => handleStepQty(-25)}
                    disabled={requestedQty <= 10}
                  >
                    <i className="bi bi-dash fs-5"></i>
                  </button>

                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control text-center font-monospace fw-bold fs-5 rounded-3"
                      value={requestedQty}
                      min="1"
                      max={maxAvailable}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                    />
                    <span className="input-group-text bg-white text-muted fw-bold">kg</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '38px', height: '38px' }}
                    onClick={() => handleStepQty(25)}
                    disabled={requestedQty >= maxAvailable}
                  >
                    <i className="bi bi-plus fs-5"></i>
                  </button>
                </div>

                {requestError && (
                  <span className="text-danger small d-block mb-2" style={{ fontSize: '0.76rem' }}>
                    {requestError}
                  </span>
                )}

                {/* Live Total Calculation */}
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="text-dark small fw-semibold">
                    {t('calculatedTotal')}:
                  </span>
                  <div>
                    <span className="text-muted small me-1">({requestedQty} kg × ₹{unitPrice}) =</span>
                    <strong className="fs-5 text-primary font-monospace">
                      ₹{calculatedTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Direct Buyer CTAs: "Buy Now", "Add Bulk Requirement", and "Place Request" */}
              <div className="mt-auto pt-2 d-flex flex-column gap-2">
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    type="button"
                    className="btn btn-success fw-bold py-2.5 px-3 rounded-pill shadow-xs d-flex align-items-center justify-content-center gap-2 flex-grow-1 transition hover-scale"
                    style={{ fontSize: '0.9rem', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                    onClick={() => setShowDirectBuyModal(true)}
                  >
                    <i className="bi bi-lightning-charge-fill"></i>
                    <span>{language === 'ta' ? 'உடனடி வாங்குதல்' : 'Buy Now'} ({product.quantity} kg)</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-primary fw-bold py-2.5 px-3 rounded-pill shadow-xs d-flex align-items-center justify-content-center gap-2 flex-grow-1 transition hover-scale"
                    style={{ fontSize: '0.9rem' }}
                    onClick={() => setShowBulkModal(true)}
                  >
                    <i className="bi bi-boxes"></i>
                    <span>{language === 'ta' ? 'மொத்த தேவை சேர்க்க' : 'Add Bulk Requirement'}</span>
                  </button>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <a
                    href={`tel:${(product.farmerPhone || '+919842177234').replace(/\s+/g, '')}`}
                    className="btn btn-outline-secondary fw-bold py-2 px-3 rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 text-decoration-none"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <i className="bi bi-telephone-fill"></i>
                    <span>{language === 'ta' ? 'விவசாயிக்கு அழைக்க' : 'Call Farmer'}</span>
                  </a>

                  <button
                    type="button"
                    className="btn btn-light border fw-bold py-2 px-3 rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 text-secondary"
                    style={{ fontSize: '0.84rem' }}
                    onClick={() => setShowRequestModal(true)}
                  >
                    <i className="bi bi-chat-left-text-fill"></i>
                    <span>{language === 'ta' ? 'தனிப்பயன் கோரிக்கை' : 'Custom Request'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            PLACE PURCHASE REQUEST MODAL
            =================================================================== */}
        {showRequestModal && (
          <div
            className="position-fixed inset-0 bg-dark bg-opacity-65 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
            style={{ zIndex: 1250, top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-4 p-4 max-w-lg w-100 shadow-xl" style={{ maxWidth: '520px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <strong className="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
                  <span>📩 {language === 'ta' ? 'கொள்முதல் கோரிக்கை வைக்க' : 'Place Purchase Request'}</span>
                </strong>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setShowRequestModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSendRequest}>
                {/* Summary Recap */}
                <div className="p-3 bg-light rounded-3 mb-3 small">
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">{language === 'ta' ? 'விளைபொருள்' : 'Product'}:</span>
                    <strong className="text-dark">{product.crop}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">{language === 'ta' ? 'விவசாயி' : 'Farmer'}:</span>
                    <strong className="text-dark">{product.farmer || 'Ravi Farms (R. Ravi)'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">{language === 'ta' ? 'பண்ணை அமைவிடம்' : 'Farm Location'}:</span>
                    <strong className="text-dark text-truncate ms-2" style={{ maxWidth: '260px' }}>
                      {product.farmAddress || `${product.location || 'Dindigul'}, Tamil Nadu`}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">{language === 'ta' ? 'அளவு' : 'Quantity'}:</span>
                    <strong className="text-success font-monospace">{requestedQty} kg</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1.5">
                    <span className="text-muted">{language === 'ta' ? 'பண்ணை விலை' : 'Listing Price'}:</span>
                    <strong className="text-dark font-monospace">₹{unitPrice} / kg</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-1 border-top">
                    <span className="text-dark fw-bold">{language === 'ta' ? 'மொத்த தொகை' : 'Total Amount'}:</span>
                    <strong className="text-primary font-monospace fs-6">₹{calculatedTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Delivery Preference */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('deliveryPreferenceLabel')}
                  </label>
                  <select
                    className="form-select rounded-3 text-dark small"
                    value={deliveryPreference}
                    onChange={(e) => setDeliveryPreference(e.target.value)}
                  >
                    <option value="hub">{t('regionalHubDispatch')}</option>
                    <option value="farmgate">{t('directFarmgatePickup')}</option>
                  </select>
                </div>

                {/* Optional Message to Farmer */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('messageToFarmerOptional')}
                  </label>
                  <textarea
                    className="form-control rounded-3 small"
                    rows="2"
                    placeholder={language === 'ta' ? 'வாகன வருகை நேரம், பேக்கிங் தேவைகள் போன்ற கூடுதல் குறிப்புகள்...' : 'e.g. Need morning delivery at our retail distribution point.'}
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                  ></textarea>
                </div>

                {/* Modal Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-3 fw-semibold"
                    onClick={() => setShowRequestModal(false)}
                    disabled={isSubmitting}
                  >
                    {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>{t('sendingRequestText')}</span>
                    ) : (
                      <span>{language === 'ta' ? 'கொள்முதல் கோரிக்கை வைக்க' : 'Place Purchase Request'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Bulk Procurement Multi-Farmer Matching Modal */}
        {showBulkModal && (
          <BulkProcurementModal
            product={product}
            onClose={() => setShowBulkModal(false)}
          />
        )}

        {/* Standard Direct Buy Now Modal */}
        {showDirectBuyModal && (
          <DirectBuyModal
            product={product}
            onClose={() => setShowDirectBuyModal(false)}
          />
        )}
      </div>
    </BuyerLayout>
  );
}
