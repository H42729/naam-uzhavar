import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBuyer } from '../context/BuyerContext';
import BulkProcurementModal from './buyer/BulkProcurementModal';

/**
 * ProduceDetailsModal
 * Interactive "View Details" modal for produce cards.
 * Displays:
 * 1. Clean Direct Farmgate Price: Listing Price: ₹25 / kg (no Mandi Reference)
 * 2. Complete "Farmer & Harvest Information" section:
 *    - Farmer / Farm Name: e.g., "Ravi Farms (R. Ravi)" with green ✓ Verified badge
 *    - Full Farm Location: Full village, taluk, and district address with 📍 icon
 *    - Contact Number: Direct phone number with active call trigger (href="tel:+91...") & WhatsApp chat
 *    - Harvest Specifications: Available quantity, Quality grade, Harvest window, Price / kg
 * 3. Direct Buyer CTAs: "Contact Farmer" and "Place Purchase Request"
 */
export default function ProduceDetailsModal({ product, onClose }) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { createRequest, showToast } = useBuyer();

  // Quantity selection & purchase request form state
  const maxAvailable = Math.max(Number(product?.quantity) || 500, 10);
  const minOrder = Math.min(Number(product?.minOrder) || 50, maxAvailable);
  const [requestedQty, setRequestedQty] = useState(minOrder);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [deliveryPreference, setDeliveryPreference] = useState('hub');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qtyError, setQtyError] = useState('');

  if (!product) return null;

  const unitPrice = Number(product.price) || 25;
  const calculatedTotal = requestedQty * unitPrice;
  const farmerName = product.farmer || 'Ravi Farms (R. Ravi)';
  const phone = product.farmerPhone || '+91 98421 77234';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const farmAddress = product.farmAddress || `${product.location || 'South Street, Reddiarchatram, Dindigul - 624622'}`;
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hello ${farmerName}, I am inquiring about your ${product.crop} listed on Naam Uzhavar (Lot #${product.id}).`)}`;

  const handleStepQty = (delta) => {
    const next = requestedQty + delta;
    if (next > maxAvailable) {
      setRequestedQty(maxAvailable);
      setQtyError(t('maxQuantityExceeded') || 'Max quantity exceeded');
    } else if (next < 1) {
      setRequestedQty(1);
      setQtyError('');
    } else {
      setRequestedQty(next);
      setQtyError('');
    }
  };

  const handleQtyChange = (val) => {
    const num = Number(val);
    if (isNaN(num)) return;
    if (num > maxAvailable) {
      setRequestedQty(maxAvailable);
      setQtyError(t('maxQuantityExceeded') || 'Max quantity exceeded');
    } else if (num < 1) {
      setRequestedQty(1);
      setQtyError('');
    } else {
      setRequestedQty(num);
      setQtyError('');
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (requestedQty <= 0 || requestedQty > maxAvailable) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createRequest({
        farmerName: farmerName,
        farmerPhone: phone,
        farmerLocation: product.location || 'Dindigul',
        farmerFpo: product.fpo || 'Dindigul Farmers Producer Co-op',
        productName: product.crop,
        productTamilName: product.tamilName || 'நாட்டு விளைச்சல்',
        productImage: product.image || product.images?.[0],
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
      onClose();
      if (showToast) {
        showToast(
          language === 'ta'
            ? 'கொள்முதல் கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!'
            : 'Purchase request sent to farmer successfully!',
          'success'
        );
      }
      navigate('/buyer/requests');
    }, 450);
  };

  return createPortal(
    <div
      className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
      style={{
        zIndex: 99999,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-2xl border overflow-hidden w-100 my-auto"
        style={{
          maxWidth: 'min(94vw, 680px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 px-4 bg-light border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark font-monospace px-2.5 py-1">
              #{product.id}
            </span>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-bold">
              ✓ {language === 'ta' ? 'சரிபார்க்கப்பட்ட விளைச்சல்' : 'Verified Lot'}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 p-sm-4 overflow-y-auto flex-grow-1" style={{ fontSize: '0.88rem' }}>
          {/* Produce Title & Direct Listing Price Row */}
          <div className="d-flex flex-column flex-sm-row sm:items-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
            <div>
              <div className="d-flex align-items-baseline gap-2">
                <h3 className="fs-4 fw-black text-dark mb-0">{product.crop}</h3>
                {product.tamilName && (
                  <span className="text-muted small">({product.tamilName})</span>
                )}
              </div>
              <span className="text-muted small d-block mt-0.5">
                {product.description || 'Direct farmgate fresh produce harvested at optimal maturity.'}
              </span>
            </div>

            {/* Direct Farmgate Price Container */}
            <div
              className="rounded-3 p-2.5 px-3 bg-slate-50 border border-slate-200/80 d-flex flex-sm-column justify-content-between align-items-end text-end shrink-0"
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}
            >
              <span className="text-slate-600 small fw-semibold" style={{ fontSize: '0.78rem', color: '#475569' }}>
                {language === 'ta' ? 'பண்ணை விலை' : 'Listing Price'}:
              </span>
              <div className="d-flex align-items-baseline">
                <strong className="fs-4 font-monospace fw-bold text-dark" style={{ color: '#0f172a' }}>
                  ₹{unitPrice}
                </strong>
                <span className="text-muted small ms-1 font-medium"> / kg</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              FARMER & HARVEST INFORMATION SECTION
              =================================================================== */}
          <div className="border rounded-4 p-3.5 mb-3 bg-light bg-opacity-60 shadow-2xs">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <span className="text-muted small fw-bold text-uppercase d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                <span aria-hidden="true">🌾</span>
                <span>{language === 'ta' ? 'விவசாயி & அறுவடை விவரங்கள்' : 'Farmer & Harvest Information'}</span>
              </span>
              <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-2.5 py-0.5 small fw-bold d-inline-flex align-items-center gap-1">
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
                    {farmerName}
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
                  {farmAddress}
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
                  {phone}
                </strong>
              </div>

              <div className="d-flex align-items-center gap-2">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-2xs transition hover-scale"
                  style={{ fontSize: '0.8rem' }}
                >
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>{language === 'ta' ? 'அழைக்க' : 'Call Farmer'}</span>
                </a>
                <a
                  href={whatsappUrl}
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

          {/* Place Purchase Request Inline Panel (when active) */}
          {showPurchaseForm && (
            <form onSubmit={handleSubmitRequest} className="p-3.5 bg-primary-subtle bg-opacity-20 border border-primary-subtle rounded-4 mb-3 farm-animate-fade">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <strong className="fs-6 text-dark d-flex align-items-center gap-1.5">
                  <span>📩</span>
                  <span>{language === 'ta' ? 'கொள்முதல் கோரிக்கை விவரங்கள்' : 'Purchase Request Details'}</span>
                </strong>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                  onClick={() => setShowPurchaseForm(false)}
                >
                  {language === 'ta' ? 'மூடு' : 'Close'}
                </button>
              </div>

              {/* Quantity Stepper */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1.5">
                  <span>{language === 'ta' ? 'தேவைப்படும் அளவு' : 'Purchase Quantity'}:</span>
                  <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Max: {maxAvailable} kg
                  </span>
                </label>

                <div className="d-flex align-items-center gap-2 mb-1.5">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '36px', height: '36px' }}
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
                      onChange={(e) => handleQtyChange(e.target.value)}
                    />
                    <span className="input-group-text bg-white text-muted fw-bold">kg</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '36px', height: '36px' }}
                    onClick={() => handleStepQty(25)}
                    disabled={requestedQty >= maxAvailable}
                  >
                    <i className="bi bi-plus fs-5"></i>
                  </button>
                </div>

                {qtyError && (
                  <span className="text-danger small d-block mb-1" style={{ fontSize: '0.75rem' }}>
                    {qtyError}
                  </span>
                )}

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="text-dark small fw-semibold">
                    {language === 'ta' ? 'மொத்த கணக்கீடு' : 'Total Amount'}:
                  </span>
                  <div>
                    <span className="text-muted small me-1">({requestedQty} kg × ₹{unitPrice}) =</span>
                    <strong className="fs-5 text-primary font-monospace">
                      ₹{calculatedTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Delivery Preference */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  {t('deliveryPreferenceLabel') || (language === 'ta' ? 'டெலிவரி வகை' : 'Delivery Preference')}
                </label>
                <select
                  className="form-select form-select-sm rounded-3"
                  value={deliveryPreference}
                  onChange={(e) => setDeliveryPreference(e.target.value)}
                >
                  <option value="hub">{t('regionalHubDispatch') || 'Consolidated Regional Hub Delivery'}</option>
                  <option value="farmgate">{t('directFarmgatePickup') || 'Direct Farmgate Pickup'}</option>
                </select>
              </div>

              {/* Optional Buyer Note */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">
                  {language === 'ta' ? 'விவசாயிக்கான குறிப்பு (விருப்பத்தேர்வு)' : 'Optional Note to Farmer'}
                </label>
                <textarea
                  className="form-control form-control-sm rounded-3"
                  rows="2"
                  placeholder={language === 'ta' ? 'வாகன வருகை நேரம், பேக்கிங் தேவைகள் போன்ற கூடுதல் குறிப்புகள்...' : 'e.g. Need morning delivery at our retail distribution point.'}
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-pill px-3 fw-semibold"
                  onClick={() => setShowPurchaseForm(false)}
                  disabled={isSubmitting}
                >
                  {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>{language === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Submitting...'}</span>
                  ) : (
                    <span>{language === 'ta' ? 'கோரிக்கை சமர்ப்பிக்க' : 'Submit Purchase Request'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Direct Buyer CTAs: "Contact Farmer", "Place Purchase Request", & "Add Bulk Requirement" */}
          <div className="d-flex flex-column gap-2 pt-2 border-top">
            <div className="d-flex flex-column flex-sm-row gap-2">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="btn btn-outline-success fw-bold py-2.5 px-3 rounded-pill shadow-xs d-flex align-items-center justify-content-center gap-2 flex-grow-1 text-decoration-none transition hover-scale"
                style={{ fontSize: '0.9rem' }}
              >
                <i className="bi bi-telephone-fill"></i>
                <span>{language === 'ta' ? 'விவசாயியை தொடர்பு கொள்ள' : 'Contact Farmer'}</span>
              </a>

              <button
                type="button"
                className="btn btn-primary fw-bold py-2.5 px-3 rounded-pill shadow-md d-flex align-items-center justify-content-center gap-2 flex-grow-1 hover-scale transition"
                style={{ fontSize: '0.9rem' }}
                onClick={() => setShowPurchaseForm(true)}
              >
                <i className="bi bi-bag-check-fill fs-5"></i>
                <span>{language === 'ta' ? 'கொள்முதல் கோரிக்கை வைக்க' : 'Place Purchase Request'}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary fw-bold py-2 px-3 rounded-pill shadow-xs d-flex align-items-center justify-content-center gap-2 w-100 transition hover-scale"
              style={{ fontSize: '0.86rem' }}
              onClick={() => setShowBulkModal(true)}
            >
              <i className="bi bi-boxes"></i>
              <span>{language === 'ta' ? 'மொத்த தேவை சேர்க்க (Multi-Farmer Supply Match)' : 'Add Bulk Requirement (Multi-Farmer Match)'}</span>
            </button>
          </div>

          {/* Link to Full Page View */}
          <div className="text-center mt-3 pt-2 border-top">
            <Link
              to={`/buyer/products/${product.id}`}
              className="text-decoration-none text-primary small fw-semibold d-inline-flex align-items-center gap-1 hover:underline"
              onClick={onClose}
            >
              <span>{language === 'ta' ? 'முழு பக்க விவரங்களைப் பார்க்க →' : 'View Full Details Page →'}</span>
            </Link>
          </div>
        </div>
      </div>

      {showBulkModal && (
        <BulkProcurementModal
          product={product}
          onClose={() => setShowBulkModal(false)}
        />
      )}
    </div>,
    document.body
  );
}
