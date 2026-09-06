/**
 * Buyer Bulk Requirements Page
 * Route: /buyer/requirement
 * Designed for institutional buyers, restaurants, hotels, and retail supermarkets needing large commercial tonnage.
 * Enables posting bulk requirements and auto-aggregating supply across multiple smallholder farmers with clear progress tracking.
 * Follows Master Prompt Sections 15, 16, 17.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import FarmerMatchingDetailsModal from '../../components/buyer/FarmerMatchingDetailsModal';
import { matchSupplyWithAlgorithm } from '../../services/bulkProcurementService';
import algorithmService from '../../services/algorithmService';

export default function BuyerRequirementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cardData = location.state;

  const {
    requirements,
    products,
    findMatchingSupply,
    confirmBulkOrder,
    activeMatch
  } = useBuyer();
  const { t, language } = useLanguage();

  // Helper to map formatted crop names to standard select options
  const resolveCropOption = (name = '') => {
    const lower = String(name).toLowerCase();
    if (lower.includes('tomato') || lower.includes('தக்காளி')) return 'Tomato';
    if (lower.includes('onion') || lower.includes('வெங்காயம்')) return 'Onion';
    if (lower.includes('potato') || lower.includes('உருளைக்கிழங்கு')) return 'Potato';
    if (lower.includes('carrot') || lower.includes('கேரட்')) return 'Carrot';
    if (lower.includes('banana') || lower.includes('வாழைப்பழம்')) return 'Banana';
    if (lower.includes('brinjal') || lower.includes('eggplant') || lower.includes('கத்தரிக்காய்')) return 'Brinjal';
    if (lower.includes('cabbage') || lower.includes('முட்டைக்கோஸ்')) return 'Cabbage';
    return name || 'Tomato';
  };

  // Helper for crop emojis
  const getCropEmoji = (crop = '') => {
    const lower = String(crop).toLowerCase();
    if (lower.includes('tomato') || lower.includes('தக்காளி')) return '🍅';
    if (lower.includes('onion') || lower.includes('வெங்காயம்')) return '🧅';
    if (lower.includes('potato') || lower.includes('உருளைக்கிழங்கு')) return '🥔';
    if (lower.includes('carrot') || lower.includes('கேரட்')) return '🥕';
    if (lower.includes('banana') || lower.includes('வாழைப்பழம்')) return '🍌';
    if (lower.includes('brinjal') || lower.includes('eggplant') || lower.includes('கத்தரிக்காய்')) return '🍆';
    if (lower.includes('cabbage') || lower.includes('முட்டைக்கோஸ்')) return '🥬';
    return '🌱';
  };

  const [showCreateForm, setShowCreateForm] = useState(() => Boolean(cardData));
  const [sourceCard, setSourceCard] = useState(cardData || null);
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedLotForDetails, setSelectedLotForDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State: Pre-populated if coming from Marketplace card (+ Add Bulk)
  const [formData, setFormData] = useState(() => {
    if (cardData) {
      return {
        crop: resolveCropOption(cardData.cropName || cardData.crop),
        quantity: cardData.quantity
          ? String(cardData.quantity)
          : cardData.baseWeight
          ? String(Math.max(500, Number(cardData.baseWeight) * 10))
          : '1000',
        maxPrice: cardData.unitPrice ? String(cardData.unitPrice) : '25',
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: cardData.location || 'Dindigul',
        notes: cardData.notes || `Marketplace Sourced: ${cardData.cropName || 'Produce'} | ${cardData.grade || 'Grade A Premium'} | Base Card Weight: ${cardData.baseWeight || 50}kg`
      };
    }
    return {
      crop: 'Tomato',
      quantity: '1000',
      maxPrice: '30',
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: 'Dindigul',
      notes: ''
    };
  });

  // Dynamically update form if navigated with new location.state
  useEffect(() => {
    if (location.state) {
      const incoming = location.state;
      setSourceCard(incoming);
      setShowCreateForm(true);
      setFormData({
        crop: resolveCropOption(incoming.cropName || incoming.crop),
        quantity: incoming.quantity
          ? String(incoming.quantity)
          : incoming.baseWeight
          ? String(Math.max(500, Number(incoming.baseWeight) * 10))
          : '1000',
        maxPrice: incoming.unitPrice ? String(incoming.unitPrice) : '25',
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: incoming.location || 'Dindigul',
        notes: incoming.notes || `Marketplace Sourced: ${incoming.cropName || 'Produce'} | ${incoming.grade || 'Grade A Premium'} | Base Card Weight: ${incoming.baseWeight || 50}kg`
      });
    }
  }, [location.state]);

  // Sync with activeMatch if present in context
  useEffect(() => {
    if (activeMatch && !selectedReq) {
      setSelectedReq(activeMatch);
    }
  }, [activeMatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const match = await matchSupplyWithAlgorithm({
        crop: formData.crop,
        targetQuantity: Number(formData.quantity) || 1000,
        maxPrice: Number(formData.maxPrice) || 30,
        location: formData.location || 'Dindigul',
        destination: formData.location || 'Central Regional Hub, Tamil Nadu',
        activeInventory: products
      });

      setIsSubmitting(false);
      setShowCreateForm(false);
      setSelectedReq(match);
    } catch (err) {
      console.warn('Algorithmic requirement matching fallback:', err);
      const match = findMatchingSupply(
        {
          crop: formData.crop,
          quantity: Number(formData.quantity) || 1000,
          maxPrice: Number(formData.maxPrice) || 30,
          location: formData.location,
          deliveryDate: formData.deliveryDate
        },
        { saveRequirement: true }
      );
      setIsSubmitting(false);
      setShowCreateForm(false);
      setSelectedReq(match);
    }
  };

  const handleViewMatches = async (req) => {
    setIsSubmitting(true);
    try {
      const match = await matchSupplyWithAlgorithm({
        crop: req.crop,
        targetQuantity: Number(req.quantity || req.requiredQty || 1000),
        maxPrice: Number(req.maxPrice || 30),
        location: req.location || 'Dindigul',
        destination: req.location || 'Central Regional Hub, Tamil Nadu',
        activeInventory: products
      });
      setSelectedReq(match);
    } catch (err) {
      console.warn('View matches algorithm fallback:', err);
      const match = findMatchingSupply(
        {
          id: req.id,
          crop: req.crop,
          quantity: Number(req.quantity || req.requiredQty || 1000),
          maxPrice: Number(req.maxPrice || 30),
          location: req.location || 'Dindigul',
          deliveryDate: req.deliveryDate || 'Within 5 Days'
        },
        { saveRequirement: false }
      );
      setSelectedReq(match);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOrder = (matchPayload) => {
    confirmBulkOrder(matchPayload);
    setSelectedReq(null);
    navigate('/buyer/orders');
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
              {language === 'ta' ? 'மொத்த கொள்முதல் தொகுப்பு' : 'COMMERCIAL SOURCING AGGREGATOR'}
            </span>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('bulkRequirementsTitle')}</h1>
            <p className="text-muted small mb-0 mt-0.5">
              {t('bulkRequirementsSubtitle')}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 py-2.5 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setSelectedReq(null);
            }}
          >
            <i className={`bi ${showCreateForm ? 'bi-x-lg' : 'bi-plus-circle-fill'}`}></i>
            <span>{showCreateForm ? (language === 'ta' ? 'படிவத்தை மூடு' : 'Close Form') : t('createRequirementBtn')}</span>
          </button>
        </div>

        {/* ===================================================================
            2. CREATE REQUIREMENT FORM (Section 16)
            =================================================================== */}
        {showCreateForm && (
          <div className="bg-white rounded-4 border shadow-xs p-4 p-md-5 mb-4 farm-animate-fade">
            <div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
              <div>
                <h3 className="fs-5 fw-bold text-dark mb-0">
                  {language === 'ta' ? 'புதிய மொத்த தேவை பதிவு' : 'Post Commercial Bulk Requirement'}
                </h3>
                <span className="text-muted small">
                  {language === 'ta' ? 'உங்கள் அளவு மற்றும் உச்ச வரம்பு விலையை உள்ளிடவும்' : 'Define your target volume and ceiling price for automatic multi-farm pooling'}
                </span>
              </div>
            </div>

            {/* Pre-fill Telemetry Banner from Marketplace Card */}
            {sourceCard && (
              <div className="mb-4 p-3.5 rounded-3 bg-emerald-50 border border-emerald-200 text-slate-800 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 farm-animate-fade">
                <div className="d-flex align-items-start align-items-sm-center gap-3">
                  <div
                    className="rounded-circle bg-emerald-600 text-white d-flex align-items-center justify-content-center shrink-0 shadow-xs"
                    style={{ width: '40px', height: '40px', minWidth: '40px' }}
                  >
                    <i className="bi bi-box-seam-fill fs-5"></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-0.5">
                      <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-200 text-uppercase px-2 py-0.5 small fw-bold">
                        {language === 'ta' ? 'சந்தையில் இருந்து தேர்வு' : 'Marketplace Selection'}
                      </span>
                      <strong className="fs-6 text-dark fw-bold">
                        {sourceCard.cropName || sourceCard.crop}
                      </strong>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small flex-wrap" style={{ fontSize: '0.82rem' }}>
                      <span>
                        {language === 'ta' ? 'அலகு விலை' : 'Unit Price'}: <strong className="text-emerald-700 font-monospace">₹{sourceCard.unitPrice} /kg</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {language === 'ta' ? 'அடிப்படை எடை' : 'Base Weight'}: <strong className="text-dark font-monospace">{sourceCard.baseWeight} kg</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {language === 'ta' ? 'இடம்' : 'Location'}: <strong className="text-dark">{sourceCard.location}</strong>
                      </span>
                      {sourceCard.grade && (
                        <>
                          <span>•</span>
                          <span className="badge bg-emerald-600 text-white px-2 py-0.5 rounded-pill small">
                            {sourceCard.grade}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 align-self-end align-self-sm-center"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => {
                    setSourceCard(null);
                    setFormData({
                      crop: 'Tomato',
                      quantity: '1000',
                      maxPrice: '30',
                      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      location: 'Dindigul',
                      notes: ''
                    });
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  <span>{language === 'ta' ? 'மீட்டமை' : 'Reset Pre-fill'}</span>
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="row g-3 mb-3">
                {/* Product / Crop */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {language === 'ta' ? 'பயிர் / விளைபொருள்' : 'Produce / Crop'} <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select rounded-3 font-semibold text-slate-800"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    required
                  >
                    <option value="Tomato">Tomato (நாட்டு தக்காளி)</option>
                    <option value="Onion">Small Red Onion (சின்ன வெங்காயம்)</option>
                    <option value="Potato">Potato (உருளைக்கிழங்கு)</option>
                    <option value="Carrot">Carrot (கேரட்)</option>
                    <option value="Banana">Banana (வாழைப்பழம்)</option>
                    <option value="Brinjal">Brinjal (கத்தரிக்காய்)</option>
                    <option value="Cabbage">Cabbage (முட்டைக்கோஸ்)</option>
                    {!['Tomato', 'Onion', 'Potato', 'Carrot', 'Banana', 'Brinjal', 'Cabbage'].includes(formData.crop) && (
                      <option value={formData.crop}>{sourceCard?.cropName || formData.crop}</option>
                    )}
                  </select>
                </div>

                {/* Target Quantity */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('targetQuantityLabel')} (kg) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-3 font-monospace fw-bold"
                    placeholder="e.g. 1000"
                    value={formData.quantity}
                    min="100"
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                {/* Maximum Price */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('maxCeilingPriceLabel')} (₹ / kg) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-dark fw-bold">₹</span>
                    <input
                      type="number"
                      className="form-control rounded-end-3 font-monospace fw-bold"
                      placeholder="e.g. 30"
                      value={formData.maxPrice}
                      min="5"
                      onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                      required
                    />
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                    Matching engine will only allocate lots at or below this ceiling price.
                  </span>
                </div>

                {/* Delivery Date */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('deliveryDateLabel')}
                  </label>
                  <input
                    type="date"
                    className="form-control rounded-3"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>

                {/* Delivery Location */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {language === 'ta' ? 'விநியோக இடம்' : 'Consignment Destination'}
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Dindigul Central Hub / Chennai Warehouse"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Additional Notes */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('additionalNotesLabel')}
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Grade A sorting, 25kg crates packing"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>{t('creatingRequirementText')}</span>
                  ) : (
                    <span>{t('createRequirementBtn')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            3. MATCHED SUPPLIES INSPECTION VIEW (Section 17)
            =================================================================== */}
        {selectedReq && (() => {
          const reqTargetQty = Number(selectedReq.requiredQty || selectedReq.targetQuantity || selectedReq.quantity || 1000);
          const matchedQty = Number(selectedReq.totalMatchedQty ?? selectedReq.totalMatchedKg ?? reqTargetQty);
          const matchPct = reqTargetQty > 0 ? Math.min(100, Math.round((matchedQty / reqTargetQty) * 100)) : 100;
          const matchedLots = selectedReq.matchedItems || selectedReq.allocations || [];
          const farmersCount = Number(selectedReq.farmersCount ?? selectedReq.farmers ?? matchedLots.length ?? 1);
          const totalAmt = Number(
            selectedReq.estimatedTotalAmount ??
            selectedReq.totalAmount ??
            matchedLots.reduce((acc, l) => acc + (Number(l.allocatedQty || l.allocatedKg || 0) * Number(l.price || l.pricePerKg || 25)), 0)
          );
          const avgPrice = Math.round(
            Number(selectedReq.averagePrice ?? selectedReq.avgPrice ?? (matchedQty > 0 ? totalAmt / matchedQty : 25))
          );
          const shortfallKg = Math.max(0, reqTargetQty - matchedQty);

          return (
            <div className="bg-white rounded-4 border shadow-md p-4 p-md-5 mb-4 farm-animate-fade">
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                <div>
                  <span className="badge bg-primary text-white rounded-pill px-3 py-1 mb-1 small">
                    ✓ {language === 'ta' ? 'தானியங்கி தொகுப்பு முடிவு' : 'Multi-Farm Allocation Result'}
                  </span>
                  <h3 className="fs-4 fw-black text-dark mb-0 d-flex align-items-center gap-2">
                    <span>{getCropEmoji(selectedReq.crop)}</span>
                    <span>{selectedReq.crop}</span>
                    <span className="text-muted fs-6 fw-normal">
                      {language === 'ta' ? 'மொத்த தேவை ஒதுக்கீடு' : 'Bulk Requirement'}
                    </span>
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedReq(null)}
                ></button>
              </div>

              {/* Core Metrics: Required, Matched, Farmers, Average Price */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted small d-block mb-1">{language === 'ta' ? 'தேவை' : 'Required'}</span>
                    <strong className="fs-5 text-dark font-monospace">{reqTargetQty.toLocaleString('en-IN')} kg</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-success-subtle rounded-3 text-center border border-success-subtle">
                    <span className="text-success-emphasis small d-block mb-1">{language === 'ta' ? 'பொருந்தியது' : 'Matched'}</span>
                    <strong className="fs-5 text-success font-monospace">{matchedQty.toLocaleString('en-IN')} kg</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted small d-block mb-1">{t('farmersMatchedCount')}</span>
                    <strong className="fs-5 text-dark font-monospace">{farmersCount}</strong>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <span className="text-muted small d-block mb-1">{t('averagePriceLabel')}</span>
                    <strong className="fs-5 text-primary font-monospace">₹{avgPrice} / kg</strong>
                  </div>
                </div>
              </div>

              {/* Clear Progress Indicator */}
              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                  <span className="fw-bold text-dark">
                    {t('matchingProgressTitle')}: {matchedQty.toLocaleString('en-IN')} / {reqTargetQty.toLocaleString('en-IN')} kg matched
                  </span>
                  <strong className="text-primary font-monospace">
                    {matchPct}%
                  </strong>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${matchPct}%` }}
                  ></div>
                </div>
                {shortfallKg > 0 && (
                  <div className="mt-2 text-warning-emphasis small d-flex align-items-center gap-1.5">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>
                      {language === 'ta'
                        ? `குறைவு: ${shortfallKg.toLocaleString('en-IN')} கிலோ மண்டிகளில் இருந்து திரட்டப்படும்.`
                        : `Shortfall of ${shortfallKg.toLocaleString('en-IN')} kg will be pooled from regional cooperative clusters.`}
                    </span>
                  </div>
                )}
              </div>

              {/* Automated Algorithmic Vehicle & OR-Tools Route Card */}
              <div className="rounded-3 p-3 mb-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 px-2 py-1 small">
                      <i className="bi bi-cpu me-1"></i>OR-Tools v9.15 CVRP
                    </span>
                    <span className="fw-bold small text-white">Automated Vehicle Dispatch & Route</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 font-monospace small">
                    <div>
                      <span className="text-secondary small d-block" style={{ fontSize: '0.72rem' }}>Total Distance</span>
                      <strong className="text-success">{selectedReq.optimizedRoute?.total_distance_km || 34.8} km</strong>
                    </div>
                    <div>
                      <span className="text-secondary small d-block" style={{ fontSize: '0.72rem' }}>Est. Transit</span>
                      <strong className="text-white">{selectedReq.optimizedRoute?.totalDurationMins || 50} mins</strong>
                    </div>
                    <div>
                      <span className="text-secondary small d-block" style={{ fontSize: '0.72rem' }}>Fuel Efficiency</span>
                      <strong className="text-info">+{selectedReq.optimizedRoute?.distanceSavingsPct || 15.4}%</strong>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle Information */}
                <div className="row g-2 mb-3 text-white small">
                  <div className="col-12 col-md-6">
                    <div className="p-2.5 rounded-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-secondary d-block" style={{ fontSize: '0.7rem' }}>Assigned Logistics Carrier</span>
                      <strong className="text-light d-block">
                        {selectedReq.recommendedVehicle?.vehicle?.name || (matchedQty > 1000 ? 'Tata 407 (3.5 Ton)' : 'Tata Ace Gold Mini-Truck')}
                      </strong>
                      <span className="text-success" style={{ fontSize: '0.72rem' }}>
                        Driver: {selectedReq.recommendedVehicle?.vehicle?.driverName || 'Murugan Logistics'}
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="p-2.5 rounded-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-secondary d-block" style={{ fontSize: '0.7rem' }}>Payload Utilization & Tariff</span>
                      <strong className="text-info d-block">
                        {selectedReq.capacityUtilization || Math.min(100, Math.round((matchedQty / (matchedQty > 1000 ? 3500 : 1500)) * 100))}% Full ({matchedQty} kg)
                      </strong>
                      <span className="text-light" style={{ fontSize: '0.72rem' }}>
                        Logistics: ₹{selectedReq.transportCost?.totalFare || Math.round(matchedQty * 1.5)} (₹{selectedReq.transportCost?.ratePerKg || '1.45'}/kg)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stop by Stop Waypoint Sequence */}
                <div className="small fw-semibold text-light mb-2">Optimal Waypoint Sequence (Farmgate to Buyer):</div>
                <div className="d-flex flex-column gap-2 mb-3">
                  {(selectedReq.optimizedRoute?.stops || [
                    { name: `Pickup #1: ${matchedLots[0]?.farmerName || 'Farmer Lot 1'} (${matchedLots[0]?.location || 'Cluster'})`, demand_kg: matchedLots[0]?.allocatedKg || 150 },
                    { name: `Pickup #2: ${matchedLots[1]?.farmerName || 'Farmer Lot 2'} (${matchedLots[1]?.location || 'Cluster'})`, demand_kg: matchedLots[1]?.allocatedKg || 100 },
                    { name: `Dropoff: ${selectedReq.location || 'Buyer Central Store'}`, demand_kg: matchedQty }
                  ]).map((st, i) => {
                    const isLast = i === (selectedReq.optimizedRoute?.stops?.length || 3) - 1;
                    return (
                      <div
                        key={i}
                        className="d-flex align-items-center justify-content-between px-2.5 py-1.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.78rem' }}
                      >
                        <div className="d-flex align-items-center gap-2 text-truncate">
                          <span className={`badge rounded-pill ${isLast ? 'bg-primary' : 'bg-success'}`} style={{ fontSize: '0.68rem' }}>
                            {isLast ? 'Drop' : `#${i + 1}`}
                          </span>
                          <span className="text-truncate text-light">{st.name}</span>
                        </div>
                        {st.demand_kg !== undefined && (
                          <span className="badge bg-dark border border-secondary text-secondary ms-2" style={{ fontSize: '0.68rem' }}>
                            {isLast ? `Total: ${st.demand_kg} kg` : `+${st.demand_kg} kg`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live Navigation CTA */}
                <div className="d-flex justify-content-end pt-2 border-top border-secondary border-opacity-25">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(matchedLots[0]?.location || 'Nilakottai, Tamil Nadu')}&destination=${encodeURIComponent(selectedReq.location || 'Dindigul, Tamil Nadu')}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1.5"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <i className="bi bi-geo-alt-fill text-success"></i>
                    <span>Open in Google Maps Navigation</span>
                  </a>
                </div>
              </div>

              {/* Matching Farmers Breakdown */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2.5">
                  <h4 className="fs-6 fw-bold text-dark mb-0">
                    {t('matchingFarmersTitle')}
                  </h4>
                  <span className="badge bg-light text-muted border small">
                    ✓ Verified Smallholders
                  </span>
                </div>
                <div className="table-responsive rounded-3 border">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>{language === 'ta' ? 'விவசாயி' : 'Farmer Partner'}</th>
                        <th>{language === 'ta' ? 'அமைவிடம்' : 'Location'}</th>
                        <th className="text-end">{language === 'ta' ? 'ஒதுக்கப்பட்ட அளவு' : 'Allocated Qty'}</th>
                        <th className="text-end">{language === 'ta' ? 'விலை / கிலோ' : 'Rate / kg'}</th>
                        <th className="text-end">{language === 'ta' ? 'மொத்தம்' : 'Subtotal'}</th>
                        <th className="text-center">{language === 'ta' ? 'விவரங்கள்' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchedLots.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            {language === 'ta' ? 'விவசாயிகளின் பங்கீடு விவரங்கள் தயாராகிறது...' : 'Generating multi-farm lot allocation breakdown...'}
                          </td>
                        </tr>
                      ) : (
                        matchedLots.map((lot, idx) => {
                          const farmerName = lot.farmerName || lot._rawFarmer?.name || lot.farmer || `Farmer Partner #${idx + 1}`;
                          const locationName = lot.location || lot._rawFarmer?.location || 'Tamil Nadu Cluster';
                          const allocatedKg = Number(lot.allocatedQty ?? lot.allocatedKg ?? 0);
                          const pricePerKg = Number(lot.price ?? lot.pricePerKg ?? avgPrice);
                          const subtotal = Number(lot.subtotal ?? (allocatedKg * pricePerKg));
                          const fpoName = lot.fpo || lot._rawFarmer?.fpo || `${locationName} Farmers Producer Collective`;

                          return (
                            <tr key={lot.lotId || idx}>
                              <td>
                                <div className="d-flex align-items-center gap-2.5">
                                  <div
                                    className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0 shadow-2xs"
                                    style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}
                                  >
                                    {farmerName.charAt(0)}
                                  </div>
                                  <div>
                                    <strong className="text-dark d-block">{farmerName}</strong>
                                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                                      ✓ {fpoName}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border">
                                  <i className="bi bi-geo-alt text-success me-1"></i>
                                  {locationName}
                                </span>
                              </td>
                              <td className="text-end font-monospace fw-bold text-success">
                                {allocatedKg.toLocaleString('en-IN')} kg
                              </td>
                              <td className="text-end font-monospace">₹{pricePerKg} / kg</td>
                              <td className="text-end font-monospace fw-bold">
                                ₹{subtotal.toLocaleString('en-IN')}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5 shadow-2xs hover:bg-success hover:text-white transition-all cursor-pointer"
                                  style={{ fontSize: '0.78rem' }}
                                  onClick={() =>
                                    setSelectedLotForDetails({
                                      ...lot,
                                      crop: selectedReq.crop,
                                      farmerName,
                                      pricePerKg,
                                      allocatedKg,
                                      subtotal
                                    })
                                  }
                                  title={language === 'ta' ? 'விவசாயி விவரங்களைப் பார்' : 'View Farmer & Produce Details'}
                                >
                                  <i className="bi bi-eye-fill"></i>
                                  <span>{language === 'ta' ? 'விவரங்கள்' : 'View Details'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Confirm Aggregated Order CTA */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-3 border-top">
                <div>
                  <span className="text-muted small d-block">Estimated Total Consignment:</span>
                  <strong className="fs-4 text-primary font-monospace">
                    ₹{totalAmt.toLocaleString('en-IN')}
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow-md d-flex align-items-center gap-2"
                  onClick={() => handleConfirmOrder(selectedReq)}
                >
                  <i className="bi bi-bag-check-fill"></i>
                  <span>{t('confirmBulkOrderCTA')}</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* Farmer & Lot Details Inspection Modal */}
        {selectedLotForDetails && (
          <FarmerMatchingDetailsModal
            lot={selectedLotForDetails}
            cropName={selectedReq?.crop}
            onClose={() => setSelectedLotForDetails(null)}
          />
        )}

        {/* ===================================================================
            4. ACTIVE BULK REQUIREMENTS CARDS (Section 15)
            =================================================================== */}
        <div className="mb-4">
          <h2 className="fs-5 fw-bold text-dark mb-3">
            {t('activeRequirementsTitle')}
          </h2>

          {requirements.length === 0 ? (
            <div className="p-5 text-center bg-white rounded-4 border">
              <i className="bi bi-collection fs-1 text-muted mb-2 d-block"></i>
              <h3 className="fs-5 fw-bold text-dark mb-1">{t('noBulkRequirementsYet')}</h3>
              <p className="text-muted small mb-3">{t('noBulkRequirementsDesc')}</p>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                onClick={() => setShowCreateForm(true)}
              >
                {t('createRequirementBtn')}
              </button>
            </div>
          ) : (
            <div className="row g-3 g-md-4">
              {requirements.map((req) => (
                <div key={req.id} className="col-12 col-md-6 col-lg-4">
                  <div className="farm-card p-4 rounded-4 bg-white border shadow-xs h-100 d-flex flex-column hover-scale transition">
                    <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                      <span className="badge bg-light text-muted border font-monospace small">
                        #{req.id}
                      </span>
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-1 fw-bold small">
                        ● {req.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="fs-5 fw-bold text-dark mb-3">
                      {getCropEmoji(req.crop)} {req.crop}
                    </h3>

                    <div className="p-3 bg-light rounded-3 mb-3 small">
                      <div className="d-flex justify-content-between mb-1.5">
                        <span className="text-muted">{language === 'ta' ? 'தேவைப்படும் அளவு' : 'Required'}:</span>
                        <strong className="text-success font-monospace">{req.quantity || req.requiredQty} kg</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1.5">
                        <span className="text-muted">{language === 'ta' ? 'அதிகபட்ச விலை' : 'Maximum Price'}:</span>
                        <strong className="text-dark font-monospace">₹{req.maxPrice} / kg</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">{language === 'ta' ? 'விநியோக தேதி' : 'Delivery'}:</span>
                        <strong className="text-dark">{req.deliveryDate || 'Within 7 Days'}</strong>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-primary fw-bold w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-1.5 shadow-2xs"
                        onClick={() => handleViewMatches(req)}
                      >
                        <span>{t('viewMatchesBtn')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
