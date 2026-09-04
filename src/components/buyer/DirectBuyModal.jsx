/**
 * DirectBuyModal Component
 * Implements the standard direct purchase flow for the default listed weight/quantity on the card.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBuyer } from '../../context/BuyerContext';

export default function DirectBuyModal({ product, onClose }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { confirmDirectBuyOrder, showToast } = useBuyer();

  const defaultQty = Number(product?.quantity) || 100;
  const unitPrice = Number(product?.price) || 25;
  const totalAmount = defaultQty * unitPrice;

  const [deliveryPreference, setDeliveryPreference] = useState('Consolidated Regional Hub Delivery');
  const [deliveryLocation, setDeliveryLocation] = useState(
    product?.location ? `${product.location} Regional Central Bay` : 'Dindigul Central Consolidation Hub'
  );
  const [buyerNotes, setBuyerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = confirmDirectBuyOrder(product, {
        deliveryPreference,
        deliveryLocation,
        deliveryDate: 'Within 24-48 Hours',
        notes: buyerNotes
      });

      setIsSubmitting(false);
      onClose();

      showToast?.(
        language === 'ta'
          ? `✓ ஆர்டர் #${createdOrder.id} நேரடியாக உறுதிசெய்யப்பட்டது!`
          : `✓ Direct Purchase Order #${createdOrder.id} Placed Successfully!`
      );

      navigate('/buyer/orders');
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
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-2xl border overflow-hidden w-100 my-auto"
        style={{
          maxWidth: 'min(92vw, 540px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 px-4 bg-light border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success text-white rounded-pill px-2.5 py-1 small fw-bold">
              <i className="bi bi-lightning-charge-fill me-1"></i>
              {language === 'ta' ? 'உடனடி நேரடி கொள்முதல்' : 'Direct Farmgate Purchase'}
            </span>
            <span className="text-muted small">#{product.id}</span>
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

        {/* Modal Body */}
        <form onSubmit={handleConfirmPurchase} className="p-3.5 p-sm-4 overflow-y-auto flex-grow-1" style={{ fontSize: '0.88rem' }}>
          {/* Produce Details Card */}
          <div className="p-3 bg-light rounded-4 border mb-3 d-flex align-items-center gap-3">
            {product.image && (
              <img
                src={product.image}
                alt={product.crop}
                className="rounded-3 object-fit-cover flex-shrink-0"
                style={{ width: '64px', height: '64px' }}
              />
            )}
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-baseline gap-1.5 flex-wrap">
                <strong className="fs-6 text-dark text-truncate mb-0">{product.crop}</strong>
                {product.tamilName && (
                  <span className="text-muted small">({product.tamilName})</span>
                )}
              </div>
              <span className="text-secondary small d-block mb-1">
                {product.farmer || 'Verified Farmer'} • {product.location || 'Dindigul'}
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-0.5 small fw-semibold">
                ✓ {product.grade || 'Grade A'}
              </span>
            </div>
          </div>

          {/* Pricing & Weight Breakdown (Default Listed Lot) */}
          <div className="p-3.5 bg-success-subtle bg-opacity-25 rounded-4 border border-success border-opacity-25 mb-3">
            <span className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.7rem' }}>
              {language === 'ta' ? 'கொள்முதல் விவரங்கள் (அட்டை அளவு)' : 'Listed Card Purchase Details'}
            </span>

            <div className="d-flex justify-content-between align-items-center py-1 border-bottom small">
              <span className="text-secondary">
                {language === 'ta' ? 'விற்பனை இருப்பு (Default Listed Weight)' : 'Default Listed Lot Weight'}:
              </span>
              <strong className="font-monospace text-dark fs-6">{defaultQty} kg</strong>
            </div>

            <div className="d-flex justify-content-between align-items-center py-1 border-bottom small">
              <span className="text-secondary">{language === 'ta' ? 'கிலோ விலை' : 'Unit Price'}:</span>
              <strong className="font-monospace text-dark">₹{unitPrice} / kg</strong>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 mt-1">
              <span className="fw-bold text-dark fs-6">
                {language === 'ta' ? 'மொத்த தொகை' : 'Total Payable'}:
              </span>
              <strong className="fs-4 font-monospace text-success">
                ₹{totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Delivery Preference */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1">
              {language === 'ta' ? 'விநியோக முறை' : 'Delivery Preference'}
            </label>
            <select
              className="form-select form-select-sm rounded-3"
              value={deliveryPreference}
              onChange={(e) => setDeliveryPreference(e.target.value)}
            >
              <option value="Consolidated Regional Hub Delivery">
                Consolidated Regional Hub Delivery (Recommended)
              </option>
              <option value="Direct Farmgate Pickup">
                Direct Farmgate Pickup (Buyer arranges transport)
              </option>
            </select>
          </div>

          {/* Delivery Destination Hub */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1">
              {language === 'ta' ? 'விநியோக மையம் / இடம்' : 'Delivery Destination Hub'}
            </label>
            <input
              type="text"
              className="form-control form-control-sm rounded-3"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="e.g. Dindigul Central Consolidation Hub"
              required
            />
          </div>

          {/* Optional Notes */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-dark mb-1">
              {language === 'ta' ? 'கூடுதல் குறிப்புகள் (விருப்பத்தேர்வு)' : 'Procurement Notes (Optional)'}
            </label>
            <input
              type="text"
              className="form-control form-control-sm rounded-3"
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="e.g. Request early morning dispatch"
            />
          </div>

          {/* Modal Actions */}
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-light rounded-pill px-3.5 fw-semibold"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="btn btn-success rounded-pill px-4.5 py-2 fw-bold shadow-md d-flex align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>{language === 'ta' ? 'செயலாக்கப்படுகிறது...' : 'Confirming...'}</span>
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle fs-5"></i>
                  <span>{language === 'ta' ? 'வாங்குதலை உறுதிப்படுத்துக' : 'Confirm Purchase'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
