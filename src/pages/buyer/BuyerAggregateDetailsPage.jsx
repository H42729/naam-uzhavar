import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { INITIAL_PRODUCTS } from '../../data/buyerData';

export default function BuyerAggregateDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, activeMatch, confirmOrder, showToast } = useBuyer();
  const { t } = useLanguage();

  const [selectedImg, setSelectedImg] = useState(0);
  const [lotConfirmed, setLotConfirmed] = useState(false);

  // Scroll to the very top immediately whenever this page loads or route parameters change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id, searchParams]);

  // Retrieve lot from activeMatch if available, or find matching product in catalog
  const lotData = useMemo(() => {
    // 1. Try matching in activeMatch items
    if (activeMatch && activeMatch.matchedItems) {
      const matchFound = activeMatch.matchedItems.find(
        (m) => String(m.id).toLowerCase() === String(id).toLowerCase() || m.farmer === id
      );
      if (matchFound) return matchFound;
    }

    // 2. Try finding in products catalog
    const paramCrop = searchParams.get('crop');
    const paramFarmer = searchParams.get('farmer');
    const paramQty = Number(searchParams.get('qty')) || 200;
    const paramPrice = Number(searchParams.get('price'));
    const paramLocation = searchParams.get('location');

    const productFound =
      products?.find(
        (p) =>
          String(p.id).toLowerCase() === String(id).toLowerCase() ||
          p.farmer.toLowerCase() === String(id).toLowerCase() ||
          (paramCrop && p.crop.toLowerCase() === paramCrop.toLowerCase())
      ) ||
      INITIAL_PRODUCTS.find(
        (p) =>
          String(p.id).toLowerCase() === String(id).toLowerCase() ||
          p.farmer.toLowerCase() === String(id).toLowerCase() ||
          (paramCrop && p.crop.toLowerCase() === paramCrop.toLowerCase())
      );

    if (productFound) {
      return {
        ...productFound,
        allocatedQty: paramQty,
        crop: paramCrop || productFound.crop,
        farmer: paramFarmer || productFound.farmer,
        price: paramPrice || productFound.price,
        location: paramLocation || productFound.location
      };
    }

    // 3. Fallback default realistic aggregated lot
    const effectiveCrop = paramCrop || 'Tomato';
    const effectiveFarmer = paramFarmer || 'Muthuvel Farmers Collective';
    const effectivePrice = paramPrice || 24;

    return {
      id: id || 'LOT-AGR-101',
      crop: effectiveCrop,
      tamilName: effectiveCrop === 'Tomato' ? 'நாட்டு தக்காளி' : `${effectiveCrop} பண்ணை விளைச்சல்`,
      farmer: effectiveFarmer,
      farmerPhone: '+91 98421 77234',
      farmAddress: `Survey No. 44/2, Agro Cluster, ${paramLocation || 'Dindigul'}`,
      location: paramLocation || 'Dindigul',
      fpoName: `${paramLocation || 'Regional'} Vegetable Growers Producer Company (FPO)`,
      allocatedQty: paramQty,
      quantity: paramQty * 2,
      price: effectivePrice,
      mandiPrice: Math.round(effectivePrice * 1.35),
      grade: 'Grade A (Premium)',
      organicStatus: 'Naturally Grown (Pesticide-Free)',
      harvestDate: new Date().toISOString().split('T')[0],
      shelfLife: '8 - 10 Days',
      packaging: '25 kg aerated crates with foam separation',
      rating: 4.9,
      reviewsCount: 38,
      experience: '14 Years Direct Cultivation',
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'
      ],
      description:
        `Harvested directly from prime red soil farms in ${paramLocation || 'Oddanchatram'} cluster. Sized uniformly with optimum firm brix sweetness. Zero storage ripening chemicals used.`
    };
  }, [id, activeMatch, products, searchParams]);

  const images =
    lotData.images && lotData.images.length > 0
      ? lotData.images
      : [lotData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'];

  const allocatedQty = lotData.allocatedQty || 200;
  const unitPrice = lotData.price || 25;
  const subtotal = allocatedQty * unitPrice;
  const mandiRate = lotData.mandiPrice || Math.round(unitPrice * 1.28);
  const mandiSubtotal = allocatedQty * mandiRate;
  const buyerSavings = mandiSubtotal - subtotal;
  const savingsPercent = Math.max(5, Math.round((buyerSavings / mandiSubtotal) * 100));

  const handleConfirmLot = () => {
    setLotConfirmed(true);
    if (confirmOrder) {
      confirmOrder({
        crop: lotData.crop,
        quantity: allocatedQty,
        farmers: 1,
        amount: subtotal,
        deliveryDate: 'Within 48 Hours',
        location: `${lotData.location} Consolidation Hub`,
        farmerBreakdown: [
          {
            farmer: lotData.farmer,
            qty: allocatedQty,
            price: unitPrice
          }
        ]
      });
    }
    showToast?.(`✓ Confirmed allocation of ${allocatedQty} kg from ${lotData.farmer}!`);
  };

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade pb-5" style={{ minWidth: 0, overflowX: 'clip' }}>
        {/* ===================================================================
            1. BREADCRUMBS & NAVIGATION
            =================================================================== */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2 small text-muted flex-wrap" style={{ minWidth: 0 }}>
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 small fw-semibold"
              style={{ color: '#047857' }}
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </button>
            <span className="text-muted">/</span>
            <span className="text-secondary">Procurement</span>
            <span className="text-muted">/</span>
            <span className="text-dark fw-bold text-truncate" style={{ maxWidth: '220px' }}>
              {lotData.farmer}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span
              className="badge rounded-pill px-3 py-1.5 fw-bold small d-flex align-items-center gap-1.5"
              style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
            >
              <i className="bi bi-shield-fill-check"></i> Verified Farmgate Sourcing
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold"
              onClick={() => navigate('/buyer/requests')}
            >
              Request Status
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. GRAND FARMER & PRODUCE HERO OVERVIEW CARD (TOP OF THE PAGE)
            =================================================================== */}
        <div
          className="rounded-4 border p-4 shadow-sm mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            borderTop: '5px solid #10b981',
            minWidth: 0
          }}
        >
          <div className="row g-3 align-items-center">
            {/* Farmer Profile Identity */}
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-black fs-3 shadow-sm flex-shrink-0"
                  style={{
                    width: '68px',
                    height: '68px',
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                  }}
                >
                  {lotData.farmer.charAt(0).toUpperCase()}
                </div>

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span
                      className="badge rounded-pill small fw-bold"
                      style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}
                    >
                      <i className="bi bi-patch-check-fill me-1"></i> KYC Certified Farmer
                    </span>
                    <span
                      className="badge rounded-pill small fw-bold"
                      style={{ backgroundColor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}
                    >
                      <i className="bi bi-star-fill me-1 text-warning"></i> {lotData.rating || 4.9} Rating
                    </span>
                  </div>

                  <h2 className="fs-4 fw-black text-dark mb-1 text-truncate" title={lotData.farmer}>
                    {lotData.farmer}
                  </h2>

                  <div className="text-secondary small d-flex align-items-center gap-2 flex-wrap mb-2">
                    <span className="text-dark fw-semibold">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {lotData.farmAddress || `${lotData.location}, Tamil Nadu`}
                    </span>
                    <span>•</span>
                    <span className="text-muted">{lotData.experience || '14 Yrs Direct Cultivation'}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <a
                      href={`tel:${lotData.farmerPhone || '+919842177234'}`}
                      className="btn btn-sm btn-success rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 shadow-xs text-decoration-none"
                    >
                      <i className="bi bi-telephone-fill"></i>
                      <span>{lotData.farmerPhone || '+91 98421 77234'}</span>
                    </a>
                    <a
                      href={`https://wa.me/${(lotData.farmerPhone || '919842177234').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-success rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5"
                    >
                      <i className="bi bi-whatsapp"></i>
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Produce Lot Quick Summary & Action */}
            <div className="col-12 col-lg-6">
              <div
                className="p-3.5 rounded-4 bg-white border shadow-2xs d-flex flex-column gap-3"
                style={{ minWidth: 0 }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <span className="badge bg-light text-dark border font-monospace me-1.5">
                      #{lotData.id || 'LOT-AGR-101'}
                    </span>
                    <strong className="fs-5 text-dark">
                      {lotData.crop} ({lotData.grade || 'Grade A'})
                    </strong>
                    {lotData.tamilName && (
                      <span className="text-muted small ms-2 d-none d-sm-inline">
                        • {lotData.tamilName}
                      </span>
                    )}
                  </div>
                  <span
                    className="badge rounded-pill px-3 py-1.5 font-monospace fw-bold fs-6"
                    style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}
                  >
                    ₹{unitPrice}/kg
                  </span>
                </div>

                {/* 3 Metric Chips */}
                <div className="row g-2 text-center small">
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light border">
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Allocated Lot</span>
                      <strong className="text-dark font-monospace fs-6">{allocatedQty} kg</strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light border">
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Total Amount</span>
                      <strong className="text-success font-monospace fs-6">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div
                      className="p-2 rounded-3 border"
                      style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                    >
                      <span className="d-block" style={{ fontSize: '0.72rem', color: '#047857' }}>Direct Savings</span>
                      <strong className="font-monospace fs-6" style={{ color: '#065f46' }}>
                        Save {savingsPercent}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  type="button"
                  className="btn btn-success rounded-pill fw-bold py-2.5 w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  onClick={handleConfirmLot}
                  disabled={lotConfirmed}
                >
                  <i className="bi bi-lock-fill"></i>
                  <span>
                    {lotConfirmed
                      ? `Allocation Confirmed ✓ (${allocatedQty} kg Locked)`
                      : `Confirm & Lock Lot Allocation (${allocatedQty} kg • ₹${subtotal.toLocaleString('en-IN')})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Success Banner */}
        {lotConfirmed && (
          <div
            className="rounded-4 shadow-sm border p-3.5 mb-4 d-flex align-items-center gap-3"
            style={{ backgroundColor: '#dcfce7', borderColor: '#86efac' }}
          >
            <div
              className="rounded-circle bg-success text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '38px', height: '38px' }}
            >
              <i className="bi bi-check-lg fs-5"></i>
            </div>
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <strong className="d-block text-dark">Lot Allocation Successfully Locked!</strong>
              <span className="text-secondary small">
                {allocatedQty} kg of {lotData.crop} from {lotData.farmer} is reserved in your consolidated procurement pool.
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-success rounded-pill px-3 ms-auto fw-bold"
              onClick={() => navigate('/buyer/orders')}
            >
              View Orders
            </button>
          </div>
        )}

        {/* ===================================================================
            3. MAIN CONTENT GRID (2 COLUMNS: PRODUCT DETAILS & LOGISTICS)
            =================================================================== */}
        <div className="row g-4">
          {/* LEFT COLUMN: PRODUCT SPECS & PHOTO GALLERY */}
          <div className="col-12 col-lg-7">
            <div className="bg-white rounded-4 border p-4 shadow-xs mb-4" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3 flex-wrap gap-2">
                <h5 className="fw-bold text-dark fs-6 mb-0">
                  <i className="bi bi-camera-fill text-success me-2"></i>
                  Field Lot Photography &amp; Origin
                </h5>
                <span className="badge bg-light text-secondary border small">
                  Cluster: {lotData.location || 'Tamil Nadu'}
                </span>
              </div>

              {/* Main Image Showcase */}
              <div
                className="position-relative rounded-4 overflow-hidden border bg-light mb-3"
                style={{ height: '320px', width: '100%' }}
              >
                <img
                  src={images[selectedImg] || images[0]}
                  alt={lotData.crop}
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  className="position-absolute bottom-0 start-0 m-3 badge px-3 py-1.5 rounded-pill"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#ffffff' }}
                >
                  <i className="bi bi-camera-fill me-1 text-success"></i> Farmgate Photo • {lotData.farmer}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="d-flex gap-2 mb-4 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn p-0 rounded-3 overflow-hidden border-2 ${
                        selectedImg === idx ? 'border-success shadow-sm' : 'border-light opacity-75'
                      }`}
                      style={{ width: '64px', height: '64px', flexShrink: 0 }}
                      onClick={() => setSelectedImg(idx)}
                    >
                      <img src={imgUrl} alt="thumbnail" className="w-100 h-100 object-fit-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product Specifications Grid */}
              <h5 className="fw-bold text-dark fs-6 mb-3">
                <i className="bi bi-list-check text-success me-2"></i>
                Produce Lot Specifications
              </h5>

              <div className="row g-2.5 mb-4 small">
                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Quality Grade</span>
                    <strong className="text-dark">{lotData.grade || 'Grade A (Export)'}</strong>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Allocated Lot</span>
                    <strong className="text-success font-monospace fs-6">{allocatedQty} kg</strong>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Cultivation Method</span>
                    <strong className="text-dark">{lotData.organicStatus || 'Naturally Grown'}</strong>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Harvest Date</span>
                    <strong className="text-dark">{lotData.harvestDate || 'Fresh Today'}</strong>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Expected Shelf Life</span>
                    <strong className="text-dark">{lotData.shelfLife || '8 - 10 Days'}</strong>
                  </div>
                </div>

                <div className="col-6 col-sm-4">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <span className="text-muted d-block small mb-0.5">Packaging Standard</span>
                    <strong className="text-dark">{lotData.packaging || 'Aerated 25kg Crates'}</strong>
                  </div>
                </div>
              </div>

              {/* Quality Assurance Notes */}
              <div
                className="p-3 rounded-3 border"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <span className="fw-bold d-block mb-1 small" style={{ color: '#166534' }}>
                  <i className="bi bi-info-circle-fill me-1"></i> Quality Assurance &amp; Grading Standards:
                </span>
                <p className="text-secondary small mb-0" style={{ lineHeight: '1.55' }}>
                  {lotData.description ||
                    'Produce undergoes 3-stage sorting at regional aggregation center: sizing, defect removal, and weighing. Compliant with institutional grocery chain acceptance standards.'}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FINANCIAL BENCHMARK & TRANSPORT SCHEDULE */}
          <div className="col-12 col-lg-5">
            {/* Financial & Savings Matrix */}
            <div className="bg-white rounded-4 border p-4 shadow-xs mb-4" style={{ minWidth: 0 }}>
              <h5 className="fw-bold text-dark fs-6 mb-3">
                <i className="bi bi-currency-rupee text-success me-1"></i>
                Aggregated Pricing &amp; Savings Benchmark
              </h5>

              <div className="p-3 rounded-3 bg-light border mb-3">
                <div className="d-flex justify-content-between py-1.5 border-bottom small">
                  <span className="text-muted">Allocated Quantity:</span>
                  <strong className="font-monospace text-dark">{allocatedQty} kg</strong>
                </div>
                <div className="d-flex justify-content-between py-1.5 border-bottom small">
                  <span className="text-muted">Direct Farmgate Rate:</span>
                  <strong className="font-monospace text-success">₹{unitPrice} / kg</strong>
                </div>
                <div className="d-flex justify-content-between py-1.5 border-bottom small">
                  <span className="text-muted">Local Mandi Benchmark:</span>
                  <span className="font-monospace text-secondary text-decoration-line-through">
                    ₹{mandiRate} / kg
                  </span>
                </div>
                <div className="d-flex justify-content-between py-2 mt-1">
                  <span className="fw-bold text-dark">Lot Total Value:</span>
                  <span className="fw-black text-success font-monospace fs-5">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-between p-3 rounded-3 border small flex-wrap gap-2"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              >
                <div>
                  <strong className="d-block" style={{ color: '#166534' }}>
                    Estimated Buyer Savings: ₹{buyerSavings.toLocaleString('en-IN')} ({savingsPercent}%)
                  </strong>
                  <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                    By bypassing mandi middlemen &amp; commission agents.
                  </span>
                </div>
                <span
                  className="badge rounded-pill px-3 py-1 font-monospace fw-bold"
                  style={{ backgroundColor: '#15803d', color: '#ffffff' }}
                >
                  Save {savingsPercent}%
                </span>
              </div>
            </div>

            {/* Farmgate Logistics & Transport Schedule */}
            <div className="bg-white rounded-4 border p-4 shadow-xs" style={{ minWidth: 0 }}>
              <h5 className="fw-bold text-dark fs-6 mb-3">
                <i className="bi bi-truck text-primary me-2"></i>
                Consolidated Transport Schedule
              </h5>

              <div className="d-flex flex-column gap-3 small">
                <div className="d-flex gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '28px', height: '28px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                  >
                    1
                  </div>
                  <div>
                    <strong className="text-dark d-block">Farmgate Lot Verification</strong>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Field officer inspects lot weight, moisture, and grading at {lotData.location}.
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '28px', height: '28px', backgroundColor: '#e0f2fe', color: '#0369a1' }}
                  >
                    2
                  </div>
                  <div>
                    <strong className="text-dark d-block">Consolidated Assembly Hub</strong>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Lots from matched farmers are combined into a single vehicle to minimize transport friction.
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: '28px', height: '28px', backgroundColor: '#dcfce7', color: '#15803d' }}
                  >
                    3
                  </div>
                  <div>
                    <strong className="text-dark d-block">Direct Buyer Doorstep Dispatch</strong>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Delivered within 24 to 48 hours directly to buyer central store or distribution point.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
