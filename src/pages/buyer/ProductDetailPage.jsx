import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { INITIAL_PRODUCTS } from '../../data/buyerData';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, setRequirementPrefill, confirmOrder, createRequest, showToast } = useBuyer();

  // Find product by id or slug or fallback to initial catalog
  const product = useMemo(() => {
    const searchId = String(id || '').toLowerCase().trim();
    const cleanSearchId = searchId.replace(/[^a-z0-9]/g, '');

    return (
      products.find(
        (p) =>
          String(p.id).toLowerCase() === searchId ||
          String(p.id).replace(/[^a-z0-9]/gi, '').toLowerCase() === cleanSearchId ||
          p.crop.toLowerCase() === searchId
      ) ||
      INITIAL_PRODUCTS.find(
        (p) =>
          String(p.id).toLowerCase() === searchId ||
          String(p.id).replace(/[^a-z0-9]/gi, '').toLowerCase() === cleanSearchId ||
          p.crop.toLowerCase() === searchId
      ) ||
      null
    );
  }, [id, products]);

  // Image gallery state
  const images = useMemo(() => {
    if (!product) return [FALLBACK_IMAGE];
    if (product.images && product.images.length > 0) return product.images;
    return [product.image || FALLBACK_IMAGE];
  }, [product]);

  const [selectedImg, setSelectedImg] = useState(0);

  // Dynamic Quantity Calculator
  const maxQty = Math.max(Number(product?.quantity) || 500, 50);
  const minQty = Math.min(Number(product?.minOrder) || 50, maxQty);
  const [orderQty, setOrderQty] = useState(minQty);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotePrice, setQuotePrice] = useState(product ? product.price - 2 : 20);
  const [quoteMessage, setQuoteMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!product) {
    return (
      <BuyerLayout>
        <div className="text-center py-5 bg-white rounded-4 border p-5 my-4">
          <i className="bi bi-exclamation-octagon fs-1 text-warning mb-3 d-block"></i>
          <h3 className="fw-bold text-dark">Produce Lot Not Found</h3>
          <p className="text-muted mb-4">
            The requested produce lot <code>{id}</code> may have been completely fulfilled or removed from active farm listings.
          </p>
          <button
            type="button"
            className="bd-btn bd-btn-primary"
            onClick={() => navigate('/buyer/browse')}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back to Browse Produce</span>
          </button>
        </div>
      </BuyerLayout>
    );
  }

  // Financial calculations
  const mandiRate = product.mandiPrice || Math.round(product.price * 1.25);
  const subtotal = orderQty * product.price;
  const mandiCost = orderQty * mandiRate;
  const buyerSavings = mandiCost - subtotal;
  const savingsPct = Math.round((buyerSavings / mandiCost) * 100);

  // Handlers
  const handleAddToRequirement = () => {
    setRequirementPrefill({
      crop: product.crop,
      location: product.location,
      price: product.price,
      quantity: orderQty
    });
    showToast(`✓ Pre-filled requirement form with ${orderQty} kg of ${product.crop}.`);
    navigate('/buyer/requirement');
  };

  const handleExecuteDirectOrder = () => {
    const newOrder = confirmOrder({
      crop: product.crop,
      quantity: orderQty,
      farmers: 1,
      amount: subtotal,
      deliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
      location: `${product.location} to Regional Buyer Hub`,
      farmerBreakdown: [
        { farmer: product.farmer, qty: orderQty, price: product.price }
      ]
    });

    setConfirmedOrder(newOrder);
  };

  const handleSendCustomQuote = (e) => {
    e.preventDefault();
    createRequest({
      crop: product.crop,
      tamilName: product.tamilName,
      productId: product.id,
      farmer: product.farmer,
      farmerPhone: product.farmerPhone,
      location: `${product.location}, Tamil Nadu`,
      quantity: orderQty,
      offeredPrice: Number(quotePrice),
      targetPrice: product.price,
      mandiPrice: mandiRate,
      totalAmount: Number(quotePrice) * orderQty,
      deliveryDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString().split('T')[0],
      image: product.image,
      message: quoteMessage || `Counter-offer of ₹${quotePrice}/kg submitted for ${orderQty}kg direct farm procurement.`
    });

    setShowQuoteModal(false);
    navigate('/buyer/requests');
  };

  return (
    <BuyerLayout>
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small mb-0">
          <li className="breadcrumb-item">
            <Link to="/buyer/dashboard" className="text-decoration-none text-muted">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/buyer/browse" className="text-decoration-none text-muted">Browse Produce</Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
            {product.crop} ({product.id})
          </li>
        </ol>
      </nav>

      {/* Top Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <button
            type="button"
            className="btn btn-sm btn-link text-muted p-0 text-decoration-none mb-1 d-inline-flex align-items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Back</span>
          </button>
          <div className="d-flex align-items-center gap-3">
            <h2 className="fw-bold mb-0 text-dark">{product.crop}</h2>
            {product.tamilName && (
              <span className="badge bg-light text-secondary border fs-6 fw-normal">
                {product.tamilName}
              </span>
            )}
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
              <i className="bi bi-patch-check-fill me-1"></i> Verified Farm Lot
            </span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="bd-btn bd-btn-outline bd-btn-sm"
            onClick={handleAddToRequirement}
          >
            <i className="bi bi-boxes"></i>
            <span>Aggregate in Bulk</span>
          </button>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm"
            onClick={() => setShowOrderModal(true)}
          >
            <i className="bi bi-bag-check-fill"></i>
            <span>Book Lot ({orderQty} kg)</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* ================================================================
            LEFT COLUMN: GALLERY, TRACEABILITY SPECS & FARMER PROFILE
           ================================================================ */}
        <div className="col-12 col-lg-7">
          {/* Main Gallery Card */}
          <div className="bd-card p-3 mb-4">
            <div className="position-relative rounded-4 overflow-hidden mb-3 bg-light" style={{ height: '380px' }}>
              <img
                src={images[selectedImg] || FALLBACK_IMAGE}
                alt={product.crop}
                className="w-100 h-100 object-fit-cover transition-all"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
                <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill backdrop-blur">
                  <i className="bi bi-geo-alt-fill text-warning me-1"></i>
                  {product.location}, Tamil Nadu
                </span>
                <span className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm">
                  {product.grade || 'Grade A Premium'}
                </span>
              </div>
              <div className="position-absolute bottom-0 end-0 m-3">
                <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-3 border">
                  Harvest: <strong>{product.harvestDate}</strong>
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="d-flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`border rounded-3 p-1 bg-transparent overflow-hidden ${selectedImg === idx ? 'border-2 border-success shadow-sm' : 'border-light opacity-75'}`}
                    style={{ width: '70px', height: '60px' }}
                    onClick={() => setSelectedImg(idx)}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-100 h-100 object-fit-cover rounded-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mandi Benchmark Price Comparison */}
          <div className="p-4 rounded-4 mb-4 bg-gradient-mandi border shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                  <i className="bi bi-graph-down-arrow fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Tamil Nadu APMC Mandi Benchmark</h6>
                  <span className="text-muted small">Real-time Oddanchatram & Dindigul wholesale rates</span>
                </div>
              </div>
              <span className="badge bg-success text-white rounded-pill px-3 py-1">
                Save {savingsPct}% Direct
              </span>
            </div>

            <div className="row g-2 text-center">
              <div className="col-6">
                <div className="bg-white p-3 rounded-3 border">
                  <span className="text-muted small d-block mb-1">Local APMC Mandi Rate</span>
                  <span className="fs-5 fw-bold text-secondary text-decoration-line-through">
                    ₹{mandiRate} / kg
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-success-subtle p-3 rounded-3 border border-success-subtle">
                  <span className="text-success small fw-bold d-block mb-1">FarmDirect Direct Price</span>
                  <span className="fs-5 fw-bold text-success">
                    ₹{product.price} / kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Produce Description & Quality Specs */}
          <div className="bd-card p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">Harvest Quality & Traceability Specs</h5>
            <p className="text-secondary mb-4 leading-relaxed">
              {product.description || 'Verified agricultural lot harvested at peak ripeness under direct oversight.'}
            </p>

            <div className="row g-3">
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border-0">
                  <span className="text-muted small d-block">Cultivation / Farming Standard</span>
                  <strong className="text-dark">{product.organicStatus || 'Naturally Cultivated'}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border-0">
                  <span className="text-muted small d-block">Expected Shelf Life</span>
                  <strong className="text-dark">{product.shelfLife || '7 - 10 Days in Ambient'}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border-0">
                  <span className="text-muted small d-block">Cold Chain / Packaging</span>
                  <strong className="text-dark">Ventilated Crates / Mesh Sacks</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border-0">
                  <span className="text-muted small d-block">Lot Verification Protocol</span>
                  <strong className="text-success">SIH 2026 Direct APMC Gate Check</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer & Cluster Info */}
          <div className="bd-card p-4">
            <h5 className="fw-bold text-dark mb-3">Farmer & Regional Cluster</h5>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                style={{ width: '56px', height: '56px' }}
              >
                {product.farmer.charAt(0)}
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark fs-5">{product.farmer}</h6>
                <p className="text-muted small mb-0">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {product.farmAddress || `${product.location}, Tamil Nadu`}
                </p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 pt-2 border-top">
              <a
                href={`tel:${product.farmerPhone || '+919842177234'}`}
                className="bd-btn bd-btn-outline bd-btn-sm"
              >
                <i className="bi bi-telephone-fill text-success"></i>
                <span>{product.farmerPhone || '+91 98421 77234'}</span>
              </a>
              <button
                type="button"
                className="bd-btn bd-btn-outline bd-btn-sm"
                onClick={() => setShowQuoteModal(true)}
              >
                <i className="bi bi-chat-text-fill text-primary"></i>
                <span>Send Quote / Counter Offer</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================
            RIGHT COLUMN: DYNAMIC CALCULATOR & BOOKING CTA
           ================================================================ */}
        <div className="col-12 col-lg-5">
          <div className="bd-card p-4 sticky-top" style={{ top: '88px', zIndex: 10 }}>
            {/* Price Banner */}
            <div className="d-flex justify-content-between align-items-baseline pb-3 border-bottom mb-4">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Direct Farm Rate</span>
                <div className="d-flex align-items-baseline gap-1">
                  <span className="fs-1 fw-bold text-success font-monospace">₹{product.price}</span>
                  <span className="text-muted">/ kg</span>
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-success-subtle text-success border border-success-subtle mb-1">
                  In Stock
                </span>
                <div className="small text-muted font-monospace">{product.quantity} kg available</div>
              </div>
            </div>

            {/* Interactive Quantity Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark d-flex justify-content-between small">
                <span>Select Procurement Volume</span>
                <span className="text-success font-monospace fw-bold">{orderQty} kg</span>
              </label>

              <input
                type="range"
                className="form-range"
                min={minQty}
                max={maxQty}
                step={25}
                value={orderQty}
                onChange={(e) => setOrderQty(Number(e.target.value))}
              />

              <div className="d-flex justify-content-between text-muted small mb-3">
                <span>Min: {minQty} kg</span>
                <span>Max: {maxQty} kg</span>
              </div>

              {/* Quick preset buttons */}
              <div className="d-flex gap-2 flex-wrap mb-3">
                {[50, 100, 200, maxQty]
                  .filter((p, i, a) => p <= maxQty && a.indexOf(p) === i)
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`btn btn-sm ${orderQty === preset ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                      onClick={() => setOrderQty(preset)}
                    >
                      {preset === maxQty ? `Full Lot (${preset}kg)` : `${preset} kg`}
                    </button>
                  ))}
              </div>
            </div>

            {/* Commercial Breakdown */}
            <div className="bg-light p-3 rounded-4 mb-4 small">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Crop Lot Subtotal ({orderQty} kg × ₹{product.price}):</span>
                <span className="fw-bold font-monospace text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Prevailing Mandi Estimate:</span>
                <span className="text-secondary font-monospace text-decoration-line-through">
                  ₹{mandiCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-success fw-bold">
                  <i className="bi bi-piggy-bank-fill me-1"></i> Net Buyer Savings:
                </span>
                <span className="fw-bold font-monospace text-success">
                  + ₹{buyerSavings.toLocaleString('en-IN')} ({savingsPct}%)
                </span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Farmer Direct Escrow:</span>
                <span className="fw-bold text-dark">100% Direct Payout</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">Estimated Transit:</span>
                <span className="fw-semibold text-dark">Within 24 - 48 Hours</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="bd-btn bd-btn-primary w-100 py-3 justify-content-center fs-6"
                onClick={() => setShowOrderModal(true)}
              >
                <i className="bi bi-check2-circle fs-5"></i>
                <span>Confirm & Place Order (₹{subtotal.toLocaleString('en-IN')})</span>
              </button>

              <button
                type="button"
                className="bd-btn bd-btn-outline w-100 justify-content-center"
                onClick={handleAddToRequirement}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Add to Bulk Requirement Aggregator</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-link text-muted text-decoration-none"
                onClick={() => setShowQuoteModal(true)}
              >
                Negotiate / Send Custom Quote Offer →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          CONFIRM ORDER MODAL
         ================================================================ */}
      {showOrderModal &&
        createPortal(
          <div className="bd-modal-backdrop" onClick={() => !confirmedOrder && setShowOrderModal(false)}>
            <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            {!confirmedOrder ? (
              <>
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <h5 className="fw-bold mb-0">Confirm Procurement Order</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowOrderModal(false)}
                  ></button>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
                  <img
                    src={product.image || FALLBACK_IMAGE}
                    alt={product.crop}
                    className="rounded-3"
                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{product.crop}</h6>
                    <span className="text-muted small">
                      {product.farmer} • {product.location}, Tamil Nadu
                    </span>
                    <div className="text-success fw-bold font-monospace mt-1">
                      {orderQty} kg @ ₹{product.price}/kg
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-3 mb-4 small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Payable Amount:</span>
                    <strong className="fs-5 text-success font-monospace">₹{subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Disbursement Channel:</span>
                    <span className="fw-semibold">FarmDirect Escrow Protected</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Estimated Delivery:</span>
                    <span className="fw-semibold">Within 48 hours of dispatch</span>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="bd-btn bd-btn-outline bd-btn-sm"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bd-btn bd-btn-primary bd-btn-sm"
                    onClick={handleExecuteDirectOrder}
                  >
                    <i className="bi bi-shield-check"></i>
                    <span>Confirm Order Now</span>
                  </button>
                </div>
              </>
            ) : (
              /* Celebratory Confirmed State */
              <div className="text-center py-4">
                <div className="celebrate-badge mb-3">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4.5rem' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Order Confirmed!</h4>
                <p className="text-muted mb-3">
                  Your purchase order <strong>{confirmedOrder.id}</strong> for {orderQty} kg of {product.crop} has been registered and dispatched to {product.farmer}.
                </p>

                <div className="bg-success-subtle text-success p-3 rounded-3 mb-4 font-monospace small">
                  Escrow Lock ID: ESC-{Math.floor(100000 + Math.random() * 900000)} • ₹{subtotal.toLocaleString('en-IN')}
                </div>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="bd-btn bd-btn-outline bd-btn-sm"
                    onClick={() => {
                      setShowOrderModal(false);
                      setConfirmedOrder(null);
                    }}
                  >
                    Stay on Product
                  </button>
                  <button
                    type="button"
                    className="bd-btn bd-btn-primary bd-btn-sm"
                    onClick={() => navigate('/buyer/orders')}
                  >
                    <i className="bi bi-receipt-cutoff"></i>
                    <span>Go to Orders Tracking</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ================================================================
          CUSTOM QUOTE MODAL
         ================================================================ */}
      {showQuoteModal &&
        createPortal(
          <div className="bd-modal-backdrop" onClick={() => setShowQuoteModal(false)}>
            <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <h5 className="fw-bold mb-0">Send Custom Quote Offer</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowQuoteModal(false)}
              ></button>
            </div>

            <form onSubmit={handleSendCustomQuote}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Crop Lot</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${product.crop} (${product.farmer})`}
                  disabled
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Volume (kg)</label>
                  <input
                    type="number"
                    className="form-control font-monospace fw-bold"
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                    min={minQty}
                    max={maxQty}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Offered Price (₹/kg)</label>
                  <input
                    type="number"
                    className="form-control font-monospace fw-bold text-success"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    min={10}
                    max={100}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Buyer Note to Farmer</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Specify delivery destination or payment preference..."
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="bd-btn bd-btn-outline bd-btn-sm"
                  onClick={() => setShowQuoteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bd-btn bd-btn-primary bd-btn-sm"
                >
                  <i className="bi bi-send-fill"></i>
                  <span>Submit Sourcing Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </BuyerLayout>
  );
}
