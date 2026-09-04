/**
 * BulkProcurementModal Component
 * Implements the 3-step bulk-ordering and farmer supply-matching workflow:
 *
 * Step 1: Bulk Requirement Specification
 *   - Displays selected product info: Product Name, Category, Default Unit Price (Price/kg), Selected Card Weight (kg).
 *   - Buyer specifies desired bulk quantity (kg) with quick preset chips.
 *   - Action: "Match Supply" CTA button.
 *
 * Step 2: Supply Matching Logic & Display
 *   - Queries active farmer listings with matching inventory.
 *   - Displays allocation breakdown with ANONYMIZED farmer identifiers prior to confirmation (e.g. "Farmer #1 • Dindigul Cluster").
 *   - Shows allocated kg from each farmer, rate/kg, subtotal, and total amount.
 *   - Comprehensive error handling for insufficient supply & shortfall.
 *   - Action: "Confirm Matched Supply" CTA button.
 *
 * Step 3: Contact Reveal & Order Placement
 *   - Unmasks complete seller details for each matched farmer: Full Name, Phone Number, Location/Address.
 *   - Presents final "Confirm Order" button.
 *   - Deducts matched quantities from inventory, records order in My Orders, and routes user to /buyer/orders.
 */

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBuyer } from '../../context/BuyerContext';
import { matchSupplyLocally } from '../../services/bulkProcurementService';

export default function BulkProcurementModal({ product, onClose }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { products, confirmBulkOrder, showToast } = useBuyer();

  // Wizard Step State: 1 = Requirement Input, 2 = Supply Matching, 3 = Contact Reveal & Placement
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State: Desired Bulk Quantity
  const cardDefaultWeight = Number(product?.quantity) || 200;
  const defaultUnitPrice = Number(product?.price) || 25;
  const [desiredQuantity, setDesiredQuantity] = useState(Math.max(500, cardDefaultWeight * 2));
  const [deliveryLocation, setDeliveryLocation] = useState('Dindigul Central Consolidation Hub');
  const [deliveryPreference, setDeliveryPreference] = useState('Consolidated Regional Hub Delivery');
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState('');

  // Step 2 State: Matching Results
  const [matchResult, setMatchResult] = useState(null);

  // Step 3 State: Order Confirmation Submitting
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!product) return null;

  // Handler: Preset Quantity Chips
  const handleSetPreset = (qty) => {
    setDesiredQuantity(qty);
    setMatchingError('');
  };

  const handleStepQuantity = (delta) => {
    setDesiredQuantity((prev) => Math.max(50, prev + delta));
    setMatchingError('');
  };

  // Step 1 -> Step 2: Trigger Supply Matching Engine
  const handleRunSupplyMatching = () => {
    const targetKg = Number(desiredQuantity);
    if (!targetKg || targetKg <= 0) {
      setMatchingError(
        language === 'ta'
          ? 'தயவுசெய்து சரியான அளவை உள்ளிடவும் (குறைந்தது 50 கிலோ).'
          : 'Please enter a valid desired quantity (minimum 50 kg).'
      );
      return;
    }

    setIsMatchingLoading(true);
    setMatchingError('');

    // Simulate real-time distributed catalog querying
    setTimeout(() => {
      const result = matchSupplyLocally({
        crop: product.crop,
        targetQuantity: targetKg,
        location: 'All',
        activeInventory: products
      });

      setMatchResult(result);
      setIsMatchingLoading(false);
      setCurrentStep(2);
    }, 450);
  };

  // Step 2 -> Step 3: Confirm Matched Supply & Reveal Farmer Contact Details
  const handleProceedToContactReveal = () => {
    if (!matchResult || !matchResult.allocations || matchResult.allocations.length === 0) {
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 -> Order Placement: Final Confirmation
  const handleFinalOrderConfirmation = () => {
    if (!matchResult || isPlacingOrder) return;

    setIsPlacingOrder(true);

    setTimeout(() => {
      const createdOrder = confirmBulkOrder(matchResult, {
        deliveryLocation,
        deliveryPreference,
        deliveryDate: 'Within 48 Hours'
      });

      setIsPlacingOrder(false);
      onClose();

      showToast?.(
        language === 'ta'
          ? `✓ ஆர்டர் #${createdOrder.id} வெற்றிகரமாக உருவாக்கப்பட்டது! விவசாயிகள் விவரங்கள் உறுதிசெய்யப்பட்டன.`
          : `✓ Bulk Order #${createdOrder.id} Placed! Direct contact details confirmed.`
      );

      navigate('/buyer/orders');
    }, 550);
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
          maxWidth: 'min(94vw, 760px)',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================
            MODAL HEADER & PROGRESS STEPPER
            =================================================================== */}
        <div className="p-3.5 px-4 bg-light border-bottom">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 small fw-bold">
                <i className="bi bi-boxes me-1"></i>
                {language === 'ta' ? 'மொத்த கொள்முதல் தொகுப்பு' : 'Bulk Supply Aggregator'}
              </span>
              <span className="text-muted small">
                Lot #{product.id} • {product.crop}
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

          {/* Stepper Breadcrumb */}
          <div className="d-flex align-items-center gap-2 small">
            {/* Step 1 Pill */}
            <div
              className={`d-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill fw-semibold ${
                currentStep === 1
                  ? 'bg-primary text-white'
                  : currentStep > 1
                  ? 'bg-success-subtle text-success'
                  : 'bg-white text-muted border'
              }`}
              style={{ fontSize: '0.76rem' }}
            >
              <span>{currentStep > 1 ? '✓' : '1'}</span>
              <span>{language === 'ta' ? 'தேவை பதிவு' : 'Requirement'}</span>
            </div>

            <i className="bi bi-chevron-right text-muted small"></i>

            {/* Step 2 Pill */}
            <div
              className={`d-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill fw-semibold ${
                currentStep === 2
                  ? 'bg-primary text-white'
                  : currentStep > 2
                  ? 'bg-success-subtle text-success'
                  : 'bg-white text-muted border'
              }`}
              style={{ fontSize: '0.76rem' }}
            >
              <span>{currentStep > 2 ? '✓' : '2'}</span>
              <span>{language === 'ta' ? 'தானியங்கி பொருத்தம்' : 'Supply Matching'}</span>
            </div>

            <i className="bi bi-chevron-right text-muted small"></i>

            {/* Step 3 Pill */}
            <div
              className={`d-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill fw-semibold ${
                currentStep === 3
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted border'
              }`}
              style={{ fontSize: '0.76rem' }}
            >
              <span>3</span>
              <span>{language === 'ta' ? 'விவசாயி விவரங்கள் & ஆர்டர்' : 'Reveal & Order'}</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MODAL BODY (3 CONDITIONAL STEPS)
            =================================================================== */}
        <div className="p-3.5 p-sm-4 overflow-y-auto flex-grow-1" style={{ fontSize: '0.88rem' }}>
          {/* ---------------------------------------------------------------
              STEP 1: BULK REQUIREMENT SPECIFICATION
              --------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="farm-animate-fade">
              {/* 1. Selected Product Information Card */}
              <div
                className="p-3.5 rounded-4 border mb-3.5"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderLeft: '5px solid #2563eb'
                }}
              >
                <span
                  className="text-muted small fw-bold text-uppercase d-block mb-1"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}
                >
                  {language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட விளைபொருள்' : 'Selected Marketplace Produce'}
                </span>

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
                  <div>
                    <h3 className="fs-5 fw-black text-dark mb-0 d-flex align-items-center gap-2">
                      <span>{product.crop}</span>
                      {product.tamilName && (
                        <span className="text-muted fs-6 fw-normal">({product.tamilName})</span>
                      )}
                    </h3>
                    <span className="text-secondary small">
                      {product.farmer || 'Verified Farmgate Producer'} • {product.location || 'Dindigul'}
                    </span>
                  </div>

                  <span
                    className="badge rounded-pill px-3 py-1.5 fw-bold font-monospace"
                    style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                  >
                    {product.grade || 'Grade A Premium'}
                  </span>
                </div>

                {/* 3 Metric Badges: Category, Default Unit Price, Selected Card Weight */}
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-white border h-100 shadow-2xs">
                      <span className="text-muted small d-block mb-1" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                        {language === 'ta' ? 'பிரிவு' : 'Category'}
                      </span>
                      <strong className="text-dark small fw-bold text-truncate d-block">
                        {product.category || 'Vegetables'}
                      </strong>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-white border h-100 shadow-2xs">
                      <span className="text-muted small d-block mb-1" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                        {language === 'ta' ? 'இயல்பு விலை' : 'Unit Price'}
                      </span>
                      <strong className="text-success font-monospace small fw-bold d-block">
                        ₹{defaultUnitPrice} / kg
                      </strong>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-white border h-100 shadow-2xs">
                      <span className="text-muted small d-block mb-1" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                        {language === 'ta' ? 'அட்டை இருப்பு' : 'Card Weight'}
                      </span>
                      <strong className="text-dark font-monospace small fw-bold d-block">
                        {cardDefaultWeight} kg
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Specify Desired Bulk Quantity Input */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark d-flex justify-content-between align-items-center mb-1.5">
                  <span>
                    {language === 'ta' ? 'உங்கள் மொத்த தேவை (கிலோ)' : 'Desired Bulk Procurement Quantity'} <span className="text-danger">*</span>
                  </span>
                  <span className="text-muted small">
                    Estimated @ ₹{defaultUnitPrice}/kg: <strong className="text-primary font-monospace">₹{(Number(desiredQuantity) * defaultUnitPrice).toLocaleString('en-IN')}</strong>
                  </span>
                </label>

                {/* Stepper Input */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handleStepQuantity(-100)}
                    disabled={desiredQuantity <= 100}
                    title="Decrease by 100 kg"
                  >
                    <i className="bi bi-dash fs-5"></i>
                  </button>

                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-box-seam"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control text-center font-monospace fw-bold fs-4 rounded-end-3"
                      value={desiredQuantity}
                      min="50"
                      step="50"
                      onChange={(e) => {
                        setDesiredQuantity(Math.max(0, Number(e.target.value)));
                        setMatchingError('');
                      }}
                      placeholder="e.g. 1000"
                    />
                    <span className="input-group-text bg-white text-dark fw-bold">kg</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handleStepQuantity(100)}
                    title="Increase by 100 kg"
                  >
                    <i className="bi bi-plus fs-5"></i>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="d-flex align-items-center gap-1.5 flex-wrap mb-3">
                  <span className="text-muted small me-1" style={{ fontSize: '0.74rem' }}>
                    Quick Presets:
                  </span>
                  {[300, 500, 1000, 2000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`btn btn-sm rounded-pill px-2.5 py-0.5 font-monospace fw-semibold ${
                        desiredQuantity === preset
                          ? 'btn-primary'
                          : 'btn-outline-secondary text-secondary bg-light'
                      }`}
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSetPreset(preset)}
                    >
                      {preset >= 1000 ? `${preset / 1000}T (${preset}kg)` : `${preset} kg`}
                    </button>
                  ))}
                </div>

                {/* Optional Delivery Destination */}
                <div className="p-3 bg-light rounded-3 border">
                  <label className="form-label small fw-bold text-dark mb-1 d-block">
                    {language === 'ta' ? 'விநியோக மையம் / சேமிப்பு கிடங்கு' : 'Delivery Destination'}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3 bg-white"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Dindigul Central Consolidation Hub / Madurai Retail Warehouse"
                  />
                  <span className="text-muted small d-block mt-1" style={{ fontSize: '0.72rem' }}>
                    The multi-farm matching engine pools nearby smallholders into this target hub.
                  </span>
                </div>

                {matchingError && (
                  <div className="alert alert-danger rounded-3 py-2 px-3 small mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-1.5"></i>
                    {matchingError}
                  </div>
                )}
              </div>

              {/* Step 1 Action: Match Supply CTA */}
              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3.5 fw-semibold"
                  onClick={onClose}
                >
                  {language === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
                </button>

                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4.5 py-2 fw-bold shadow-md d-flex align-items-center gap-2"
                  onClick={handleRunSupplyMatching}
                  disabled={isMatchingLoading || desiredQuantity <= 0}
                >
                  {isMatchingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>{language === 'ta' ? 'பொருத்தப்படுகிறது...' : 'Querying Farmer Stock...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cpu-fill"></i>
                      <span>{language === 'ta' ? 'இருப்பு பொருத்துக' : 'Match Supply'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------
              STEP 2: SUPPLY MATCHING LOGIC & DISPLAY (ANONYMIZED BREAKDOWN)
              --------------------------------------------------------------- */}
          {currentStep === 2 && matchResult && (
            <div className="farm-animate-fade">
              {/* Status Header Banner */}
              {matchResult.isFulfilled ? (
                <div
                  className="rounded-4 p-3 mb-3 d-flex align-items-center gap-2.5 border"
                  style={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
                >
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  <div>
                    <strong className="text-dark d-block">
                      {language === 'ta' ? 'முழுமையான இருப்பு பொருந்தியது!' : '100% Target Requirement Fulfilled!'}
                    </strong>
                    <span className="text-secondary small">
                      Aggregated {matchResult.totalMatchedKg} kg across {matchResult.farmersCount} verified farmer lots.
                    </span>
                  </div>
                </div>
              ) : (
                /* Insufficient Supply Error / Warning Handling */
                <div
                  className="rounded-4 p-3 mb-3 border"
                  style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                >
                  <div className="d-flex align-items-start gap-2.5">
                    <i className="bi bi-exclamation-triangle-fill text-warning fs-5 mt-0.5"></i>
                    <div className="flex-grow-1">
                      <strong className="text-dark d-block">
                        {language === 'ta' ? 'பகுதி இருப்பு மட்டுமே உள்ளது' : 'Partial Supply Available (Shortfall Detected)'}
                      </strong>
                      <span className="text-secondary small d-block mb-2">
                        Requested <strong>{matchResult.targetQuantity} kg</strong>, but only <strong>{matchResult.totalMatchedKg} kg</strong> is currently available across active farmer listings ({matchResult.shortfallKg} kg shortfall).
                      </span>

                      {/* Recovery Actions */}
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-semibold bg-white"
                          onClick={() => setCurrentStep(1)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          {language === 'ta' ? 'அளவை மாற்று' : 'Adjust Target Quantity'}
                        </button>
                        {matchResult.totalMatchedKg > 0 && (
                          <span className="text-muted small">
                            or proceed with available {matchResult.totalMatchedKg} kg below.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consolidated Metrics Grid */}
              <div className="row g-2 mb-3 text-center">
                <div className="col-6 col-sm-3">
                  <div className="p-2.5 bg-light rounded-3 border">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Target Needed</span>
                    <strong className="text-dark font-monospace fs-6">{matchResult.targetQuantity} kg</strong>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="p-2.5 bg-success-subtle rounded-3 border border-success-subtle">
                    <span className="text-success small d-block" style={{ fontSize: '0.72rem' }}>Matched Supply</span>
                    <strong className="text-success font-monospace fs-6">{matchResult.totalMatchedKg} kg</strong>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="p-2.5 bg-light rounded-3 border">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Contributing Farmers</span>
                    <strong className="text-dark font-monospace fs-6">{matchResult.farmersCount} Farmers</strong>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="p-2.5 bg-light rounded-3 border">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Weighted Avg Rate</span>
                    <strong className="text-primary font-monospace fs-6">₹{matchResult.averagePrice} / kg</strong>
                  </div>
                </div>
              </div>

              {/* Supply Matching Allocation Breakdown Table */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h4 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                    <i className="bi bi-shield-lock-fill text-muted"></i>
                    <span>{language === 'ta' ? 'ஒதுக்கப்பட்ட விவசாயிகளின் இருப்பு' : 'Farmer Inventory Allocation'}</span>
                  </h4>
                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-info-circle me-1"></i>
                    {language === 'ta' ? 'உறுதிசெய்யும் முன் அடையாளங்கள் மறைக்கப்பட்டுள்ளன' : 'Seller identities anonymized prior to confirmation'}
                  </span>
                </div>

                {matchResult.allocations.length === 0 ? (
                  <div className="p-4 text-center bg-light rounded-3 border">
                    <i className="bi bi-slash-circle fs-2 text-muted d-block mb-1"></i>
                    <strong className="text-dark d-block">No Active Supply Found</strong>
                    <span className="text-muted small">No farmer has active harvested inventory of {matchResult.crop} currently.</span>
                  </div>
                ) : (
                  <div className="table-responsive rounded-3 border">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>{language === 'ta' ? 'விவசாயி அடையாளம்' : 'Farmer Identifier (Anonymized)'}</th>
                          <th className="text-end">{language === 'ta' ? 'இருப்பு' : 'Stock'}</th>
                          <th className="text-end">{language === 'ta' ? 'ஒதுக்கீடு' : 'Allocated Qty'}</th>
                          <th className="text-end">{language === 'ta' ? 'கிலோ விலை' : 'Rate / kg'}</th>
                          <th className="text-end">{language === 'ta' ? 'துணைத்தொகை' : 'Subtotal'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchResult.allocations.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold"
                                  style={{ width: '28px', height: '28px', fontSize: '0.78rem' }}
                                >
                                  {idx + 1}
                                </div>
                                <div>
                                  <strong className="text-dark d-block">{item.anonymizedLabel}</strong>
                                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                                    ✓ Verified Producer • {item.location}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="text-end font-monospace text-muted">
                              {item.availableKg} kg
                            </td>
                            <td className="text-end font-monospace fw-bold text-success">
                              {item.allocatedKg} kg
                            </td>
                            <td className="text-end font-monospace">
                              ₹{item.pricePerKg} / kg
                            </td>
                            <td className="text-end font-monospace fw-bold text-dark">
                              ₹{item.subtotal.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light fw-bold">
                        <tr>
                          <td colSpan="2">{language === 'ta' ? 'மொத்த தொகுப்பு' : 'Total Consignment Summary'}</td>
                          <td className="text-end text-success font-monospace">
                            {matchResult.totalMatchedKg} kg
                          </td>
                          <td className="text-end font-monospace text-muted">
                            Avg: ₹{matchResult.averagePrice}/kg
                          </td>
                          <td className="text-end font-monospace text-primary fs-6">
                            ₹{matchResult.totalAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Step 2 Actions */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3.5 fw-semibold"
                  onClick={() => setCurrentStep(1)}
                >
                  ← {language === 'ta' ? 'மீண்டும் தேவை மாற்ற' : 'Modify Requirement'}
                </button>

                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4.5 py-2 fw-bold shadow-md d-flex align-items-center gap-2"
                  onClick={handleProceedToContactReveal}
                  disabled={matchResult.totalMatchedKg === 0}
                >
                  <i className="bi bi-unlock-fill"></i>
                  <span>{language === 'ta' ? 'பொருந்திய விநியோகத்தை உறுதிப்படுத்துக' : 'Confirm Matched Supply'}</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------
              STEP 3: CONTACT REVEAL & FINAL ORDER PLACEMENT
              --------------------------------------------------------------- */}
          {currentStep === 3 && matchResult && (
            <div className="farm-animate-fade">
              {/* Contact Reveal Banner */}
              <div
                className="p-3.5 rounded-4 border mb-3.5 shadow-2xs"
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderColor: '#86efac'
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-success text-white rounded-pill px-2.5 py-1 small fw-bold">
                    ✓ Verified Direct Farmgate Contacts
                  </span>
                  <span className="text-success small fw-semibold">
                    Full Seller Details Unlocked
                  </span>
                </div>
                <h4 className="fs-6 fw-black text-dark mb-1">
                  {language === 'ta' ? 'விவசாயிகளின் முழு தொடர்பு விவரங்கள்' : 'Matched Farmers Direct Contact Information'}
                </h4>
                <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                  Below are the verified direct producer details contributing to your {matchResult.totalMatchedKg} kg {matchResult.crop} pooled requirement.
                </p>
              </div>

              {/* Revealed Farmers Cards List */}
              <div className="d-flex flex-column gap-2.5 mb-4">
                {matchResult.allocations.map((item, idx) => {
                  const raw = item._rawFarmer || {};
                  const phoneClean = (raw.phone || '').replace(/[^0-9]/g, '');
                  const whatsappLink = `https://wa.me/${phoneClean.startsWith('91') ? phoneClean : '91' + phoneClean}?text=${encodeURIComponent(`Hello ${raw.name}, I am purchasing ${item.allocatedKg} kg of ${matchResult.crop} on Naam Uzhavar.`)}`;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-4 border bg-white shadow-2xs d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
                    >
                      <div className="d-flex align-items-start gap-3 flex-grow-1">
                        <div
                          className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0"
                          style={{ width: '44px', height: '44px' }}
                        >
                          <i className="bi bi-person-check-fill"></i>
                        </div>

                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap mb-0.5">
                            <strong className="fs-6 text-dark mb-0">
                              {raw.name || 'Verified Farmer'}
                            </strong>
                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-0.5 small fw-semibold">
                              ✓ Verified KYC
                            </span>
                          </div>

                          <div className="text-muted small mb-1.5" style={{ fontSize: '0.76rem' }}>
                            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                            <strong className="text-secondary">{raw.farmAddress || `${raw.location}, Tamil Nadu`}</strong>
                          </div>

                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <a
                              href={`tel:${raw.phone}`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 small fw-semibold text-decoration-none"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <i className="bi bi-telephone-fill"></i>
                              <span>{raw.phone}</span>
                            </a>

                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 small fw-semibold text-decoration-none"
                              style={{ fontSize: '0.75rem' }}
                            >
                              <i className="bi bi-whatsapp text-success"></i>
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Amount Breakdown for this Farmer */}
                      <div
                        className="p-2.5 rounded-3 bg-light border text-sm-end w-100 w-sm-auto flex-shrink-0"
                        style={{ minWidth: '150px' }}
                      >
                        <div className="d-flex justify-content-between justify-content-sm-end gap-2 mb-0.5">
                          <span className="text-muted small">Allocated:</span>
                          <strong className="text-success font-monospace">{item.allocatedKg} kg</strong>
                        </div>
                        <div className="d-flex justify-content-between justify-content-sm-end gap-2 mb-0.5">
                          <span className="text-muted small">Rate:</span>
                          <span className="font-monospace text-secondary">₹{item.pricePerKg}/kg</span>
                        </div>
                        <div className="d-flex justify-content-between justify-content-sm-end gap-2 border-top pt-1">
                          <span className="text-dark fw-bold small">Subtotal:</span>
                          <strong className="text-primary font-monospace">₹{item.subtotal.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Final Summary Box */}
              <div className="p-3 bg-light rounded-4 border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                  <span className="text-muted">Total Quantity to Procure:</span>
                  <strong className="font-monospace text-dark fs-6">{matchResult.totalMatchedKg} kg</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                  <span className="text-muted">Destination Hub:</span>
                  <strong className="text-dark text-truncate" style={{ maxWidth: '280px' }}>{deliveryLocation}</strong>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="fw-bold text-dark fs-6">Total Order Amount:</span>
                  <strong className="fs-4 font-monospace text-success">
                    ₹{matchResult.totalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Step 3 Actions: Final Confirm Order CTA */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3.5 fw-semibold"
                  onClick={() => setCurrentStep(2)}
                  disabled={isPlacingOrder}
                >
                  ← {language === 'ta' ? 'முந்தைய படி' : 'Back to Matching'}
                </button>

                <button
                  type="button"
                  className="btn btn-success btn-lg rounded-pill px-5 py-2.5 fw-bold shadow-md d-flex align-items-center gap-2"
                  onClick={handleFinalOrderConfirmation}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>{language === 'ta' ? 'ஆர்டர் செய்யப்படுகிறது...' : 'Placing Order & Deducting Stock...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bag-check-fill"></i>
                      <span>{language === 'ta' ? 'ஆர்டரை உறுதிப்படுத்துக' : 'Confirm Order'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
