/**
 * Buyer Order Detail Page
 * Route: /buyer/orders/:id & /buyer/order/:id
 * Dedicated full-page view for purchase order details, tracking timeline,
 * multi-farmer breakdown with direct contacts, and transparent pricing.
 * Follows Master Prompt Sections 18, 19, 20.
 */

import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { INITIAL_ORDERS } from '../../data/buyerData';

// Crop image helper to ensure rich, beautiful visuals
const CROP_IMAGES = {
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
  chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80'
};

function getCropImage(cropName = '') {
  const lower = cropName.toLowerCase();
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return CROP_IMAGES.onion;
}

export default function BuyerOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, getOrCreateConversationForFarmer } = useBuyer();
  const { t, language } = useLanguage();

  // Find order from context orders or fallback to INITIAL_ORDERS
  const order = useMemo(() => {
    const list = Array.isArray(orders) && orders.length > 0 ? orders : INITIAL_ORDERS;
    return (
      list.find((o) => (o.id || '').toLowerCase() === (id || '').toLowerCase()) ||
      INITIAL_ORDERS.find((o) => (o.id || '').toLowerCase() === (id || '').toLowerCase()) ||
      list[0]
    );
  }, [orders, id]);

  if (!order) {
    return (
      <BuyerLayout>
        <div className="w-100 farm-animate-fade p-5 text-center bg-white rounded-4 border my-4">
          <i className="bi bi-exclamation-circle fs-1 text-warning mb-2 d-block"></i>
          <h2 className="fw-bold text-dark mb-2">
            {language === 'ta' ? 'ஆர்டர் காணப்படவில்லை' : 'Order Not Found'}
          </h2>
          <p className="text-muted small mb-4">
            {language === 'ta'
              ? `ஆர்டர் #${id} காணப்படவில்லை அல்லது அகற்றப்பட்டிருக்கலாம்.`
              : `The order with ID #${id} could not be found.`}
          </p>
          <Link to="/buyer/orders" className="btn btn-primary fw-bold rounded-pill px-4 py-2">
            ← {language === 'ta' ? 'அனைத்து ஆர்டர்களுக்கும் திரும்பு' : 'Back to My Orders'}
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const cropImgUrl = getCropImage(order.crop);
  const status = order.status || 'Confirmed';

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Delivered':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5">
            <span className="w-2 h-2 rounded-circle bg-success"></span>
            <span>✓ {language === 'ta' ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered'}</span>
          </span>
        );
      case 'In Transit':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5">
            <span className="w-2 h-2 rounded-circle bg-primary animate-pulse"></span>
            <span>🚚 {language === 'ta' ? 'பயணத்தில் உள்ளது' : 'In Transit'}</span>
          </span>
        );
      case 'Confirmed':
      default:
        return (
          <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5">
            <span className="w-2 h-2 rounded-circle bg-emerald-600"></span>
            <span>🟢 {language === 'ta' ? 'உறுதி செய்யப்பட்டது' : 'Confirmed'}</span>
          </span>
        );
    }
  };

  const handleMessageFarmer = (farmerName) => {
    const targetName = farmerName || order.farmerBreakdown?.[0]?.farmer || 'Farmer Partner';
    const convId = getOrCreateConversationForFarmer(targetName, order.crop);
    navigate(`/buyer/messages?conv=${convId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Tracking Timeline steps
  const isConfirmed = true;
  const isAggregated = true;
  const isInTransit = status === 'In Transit' || status === 'Delivered';
  const isDelivered = status === 'Delivered';

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade py-2">
        {/* ===================================================================
            1. TOP NAVIGATION & BREADCRUMBS
            =================================================================== */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/buyer/orders"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1.5 text-decoration-none fw-semibold shadow-2xs"
            >
              <i className="bi bi-arrow-left"></i>
              <span>{language === 'ta' ? 'ஆர்டர்களுக்குத் திரும்பு' : 'Back to Orders'}</span>
            </Link>
            <span className="text-muted d-none d-sm-inline">/</span>
            <span className="text-muted small fw-bold font-monospace d-none d-sm-inline">
              #{order.id}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-light border btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1.5 shadow-2xs text-secondary"
            >
              <i className="bi bi-printer"></i>
              <span>{language === 'ta' ? 'அச்சிடு' : 'Print Invoice'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleMessageFarmer()}
              className="btn btn-primary btn-sm rounded-pill px-3.5 fw-bold d-inline-flex align-items-center gap-1.5 shadow-xs"
            >
              <i className="bi bi-chat-dots-fill"></i>
              <span>{t('messageFarmersBtn')}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. HERO ORDER HEADER CARD
            =================================================================== */}
        <div className="bg-white rounded-4 border p-4 p-md-5 mb-4 shadow-xs">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
                  {language === 'ta' ? 'கொள்முதல் ஆர்டர்' : 'DIRECT PROCUREMENT ORDER'}
                </span>
                <span className="badge rounded-pill bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 font-semibold">
                  {order.orderType || 'Bulk Pooled'}
                </span>
              </div>
              <h1 className="fs-2 fw-black text-dark mb-0 font-monospace">
                Order #{order.id}
              </h1>
            </div>

            <div className="d-flex flex-column align-items-start align-items-md-end gap-1.5">
              <div>{getStatusBadge(status)}</div>
              <span className="text-muted small">
                {language === 'ta' ? 'பதிவு செய்யப்பட்ட தேதி' : 'Placed on'}:{' '}
                <strong>{order.orderDate || '2026-10-04'}</strong>
              </span>
            </div>
          </div>

          {/* ===================================================================
              3. VISUAL DELIVERY TRACKER TIMELINE
              =================================================================== */}
          <div className="mb-2">
            <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'டெலிவரி நிலை கண்காணிப்பு' : 'LIVE CONSIGNMENT TRACKING'}
            </span>

            <div className="row g-3">
              {/* Step 1 */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className={`p-3 rounded-3 border h-100 transition ${
                    isConfirmed ? 'bg-emerald-50/70 border-emerald-300' : 'bg-light border-slate-200'
                  }`}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="rounded-circle bg-emerald-600 text-white d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                      ✓
                    </span>
                    <strong className="text-dark small">
                      {language === 'ta' ? 'ஆர்டர் உறுதி செய்யப்பட்டது' : 'Order Confirmed'}
                    </strong>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.76rem' }}>
                    {language === 'ta' ? 'விவசாயிகளுடன் ஒப்பந்தம் செய்யப்பட்டது' : 'Farmers matched & inventory locked'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className={`p-3 rounded-3 border h-100 transition ${
                    isAggregated ? 'bg-emerald-50/70 border-emerald-300' : 'bg-light border-slate-200'
                  }`}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="rounded-circle bg-emerald-600 text-white d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                      ✓
                    </span>
                    <strong className="text-dark small">
                      {language === 'ta' ? 'தரம் சரிபார்ப்பு & தொகுப்பு' : 'Quality Inspected'}
                    </strong>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.76rem' }}>
                    {language === 'ta' ? 'விவசாய நிலத்தில் சேகரிக்கப்பட்டது' : 'Aggregated at Dindigul Farmgate Hub'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className={`p-3 rounded-3 border h-100 transition ${
                    isInTransit
                      ? status === 'In Transit'
                        ? 'bg-blue-50 border-blue-400 shadow-2xs'
                        : 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-light border-slate-200 opacity-60'
                  }`}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        status === 'In Transit'
                          ? 'bg-primary text-white animate-pulse'
                          : isInTransit
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                      style={{ width: '24px', height: '24px', fontSize: '12px' }}
                    >
                      {status === 'In Transit' ? '🚚' : isInTransit ? '✓' : '3'}
                    </span>
                    <strong className="text-dark small">
                      {language === 'ta' ? 'பயணத்தில் உள்ளது' : 'In Transit'}
                    </strong>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.76rem' }}>
                    {order.location || 'Central Distribution Hub'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className={`p-3 rounded-3 border h-100 transition ${
                    isDelivered ? 'bg-emerald-50/70 border-emerald-300' : 'bg-light border-slate-200 opacity-60'
                  }`}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                      style={{ width: '24px', height: '24px', fontSize: '12px' }}
                    >
                      {isDelivered ? '✓' : '4'}
                    </span>
                    <strong className="text-dark small">
                      {language === 'ta' ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered'}
                    </strong>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.76rem' }}>
                    {isDelivered ? (order.deliveryDate || 'Completed') : `Est: ${order.deliveryDate || 'Within 48h'}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            4. MAIN GRID: PRODUCE & FARMER BREAKDOWN + PRICE SUMMARY
            =================================================================== */}
        <div className="row g-4 mb-4">
          {/* LEFT COLUMN: Produce & Multi-Farmer Contribution */}
          <div className="col-12 col-lg-8">
            {/* Produce Card */}
            <div className="bg-white rounded-4 border p-4 shadow-xs mb-4">
              <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ letterSpacing: '0.04em' }}>
                {language === 'ta' ? 'பயிர் விவரங்கள்' : 'PRODUCE SPECIFICATIONS'}
              </span>

              <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
                <div className="rounded-3 overflow-hidden border flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                  <img
                    src={cropImgUrl}
                    alt={order.crop}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CROP_IMAGES.onion;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                    <h2 className="fs-4 fw-bold text-dark mb-0">{order.crop}</h2>
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-bold">
                      Grade A Fresh
                    </span>
                  </div>

                  <p className="text-muted small mb-3">
                    {language === 'ta'
                      ? 'தமிழ்நாடு உழவர்களிடமிருந்து நேரடியாக அறுவடை செய்யப்பட்டு தரம் பிரிக்கப்பட்டது.'
                      : 'Hydro-washed, graded, and packed at farmgate collection hubs for direct delivery.'}
                  </p>

                  <div className="row g-2">
                    <div className="col-6 col-sm-4">
                      <div className="p-2.5 bg-light rounded-3">
                        <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>Total Qty:</span>
                        <strong className="text-success font-monospace fs-6">{order.quantity} kg</strong>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4">
                      <div className="p-2.5 bg-light rounded-3">
                        <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>Avg Price:</span>
                        <strong className="text-dark font-monospace fs-6">
                          ₹{order.quantity > 0 ? (order.amount / order.quantity).toFixed(1) : 0}/kg
                        </strong>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-2.5 bg-light rounded-3">
                        <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>Packaging:</span>
                        <strong className="text-dark small">25kg Mesh / Crates</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Farmer Contribution Breakdown (Section 20) */}
            <div className="bg-white rounded-4 border p-4 shadow-xs">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
                <div>
                  <span className="text-muted small fw-bold text-uppercase d-block" style={{ letterSpacing: '0.04em' }}>
                    {language === 'ta' ? 'விவசாயிகள் பங்களிப்பு' : 'DIRECT FARMGATE POOL'}
                  </span>
                  <h3 className="fs-5 fw-bold text-dark mb-0">
                    {t('farmerBreakdownTitle')} &amp; Direct Contacts
                  </h3>
                </div>

                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold">
                  {order.farmerBreakdown?.length || order.farmers || 1} {language === 'ta' ? 'விவசாயிகள்' : 'Farmers'}
                </span>
              </div>

              <p className="text-muted small mb-3">
                {language === 'ta'
                  ? 'இந்த ஆர்டருக்கு பங்களித்த விவசாயிகளின் உண்மையான தொலைபேசி எண்கள் மற்றும் முகவரிகள் கீழே உள்ளன.'
                  : 'Full contact transparency: You can contact each participating farmer directly for dispatch coordination.'}
              </p>

              <div className="d-flex flex-column gap-3">
                {order.farmerBreakdown && order.farmerBreakdown.length > 0 ? (
                  order.farmerBreakdown.map((item, idx) => {
                    const farmerPhone = item.phone || '+91 98421 77234';
                    const cleanPhone = farmerPhone.replace(/[^0-9]/g, '');
                    return (
                      <div key={idx} className="p-3.5 rounded-3 border bg-light">
                        <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap mb-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                                {(item.fullName || item.farmer || 'F').charAt(0)}
                              </span>
                              <strong className="text-dark fs-6">
                                {item.fullName || item.farmer}
                              </strong>
                            </div>
                            <span className="text-muted small d-block mt-1">
                              📍 {item.address || `${item.location || 'Dindigul'}, Tamil Nadu`}
                            </span>
                          </div>

                          <div className="text-end">
                            <span className="badge bg-success-subtle text-success font-monospace fs-6 px-2.5 py-1">
                              {item.qty} kg
                            </span>
                            <span className="text-muted small d-block mt-1">
                              @ ₹{item.price}/kg = <strong className="text-dark font-monospace">₹{(item.qty * item.price).toLocaleString('en-IN')}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Direct Communication Buttons */}
                        <div className="d-flex flex-wrap align-items-center gap-2 pt-2 border-top">
                          <a
                            href={`tel:${farmerPhone}`}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-2xs"
                          >
                            <i className="bi bi-telephone-fill"></i>
                            <span>{farmerPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Vanakkam ${item.fullName || item.farmer}, regarding Order #${order.id} for ${item.qty}kg ${order.crop}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-2xs"
                          >
                            <i className="bi bi-whatsapp"></i>
                            <span>WhatsApp</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleMessageFarmer(item.fullName || item.farmer)}
                            className="btn btn-sm btn-light border rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 text-secondary shadow-2xs"
                          >
                            <i className="bi bi-chat-dots"></i>
                            <span>{language === 'ta' ? 'செயலியில் பேசு' : 'In-App Chat'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3.5 rounded-3 border bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong className="text-dark fs-6">Ravi Farms (R. Ravi)</strong>
                        <span className="text-muted small d-block">📍 Reddiarchatram, Dindigul - 624622</span>
                      </div>
                      <span className="badge bg-success-subtle text-success font-monospace fs-6">
                        {order.quantity} kg
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 pt-2 border-top">
                      <a href="tel:+919842188920" className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold">
                        <i className="bi bi-telephone-fill me-1"></i> +91 98421 88920
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Transparent Billing & Logistics */}
          <div className="col-12 col-lg-4">
            {/* Transparent Cost Breakdown Card */}
            <div className="bg-white rounded-4 border p-4 shadow-xs mb-4">
              <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ letterSpacing: '0.04em' }}>
                {language === 'ta' ? 'கட்டண விவரம்' : 'TRANSPARENT BILLING SUMMARY'}
              </span>

              <div className="d-flex flex-column gap-2 mb-3 pb-3 border-bottom small">
                <div className="d-flex justify-content-between text-muted">
                  <span>{language === 'ta' ? 'விவசாயிகளுக்கு நேரடி விலை' : 'Farmgate Produce Value'}:</span>
                  <strong className="text-dark font-monospace">₹{Number(order.amount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>{language === 'ta' ? 'நாம் உழவர் கட்டணம் (0%)' : 'Naam Uzhavar Fee (0%)'}:</span>
                  <span className="badge bg-success-subtle text-success fw-bold">₹0 Free</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>{language === 'ta' ? 'தரம் சரிபார்ப்பு & வரிசைப்படுத்தல்' : 'Quality Inspection & Sorting'}:</span>
                  <span className="text-muted">Included</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>{language === 'ta' ? 'சரக்கு போக்குவரத்து' : 'Transit to Central Hub'}:</span>
                  <span className="text-muted">Standard Pool</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="text-dark fs-6">{language === 'ta' ? 'மொத்த தொகை' : 'Net Total Amount'}:</strong>
                <strong className="text-primary font-monospace fs-4">
                  ₹{Number(order.amount).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="p-2.5 bg-success-subtle text-success-emphasis rounded-3 small d-flex align-items-center gap-2">
                <i className="bi bi-shield-check fs-5"></i>
                <span style={{ fontSize: '0.78rem' }}>
                  {language === 'ta'
                    ? '100% இடைத்தரகர்கள் அற்ற நேரடி வர்த்தகம். உழவர்களுக்கு முழு பணமும் சேர்கிறது.'
                    : '100% Direct trade. Verified smallholders receive full price without broker cuts.'}
                </span>
              </div>
            </div>

            {/* Logistics & Hub Card */}
            <div className="bg-white rounded-4 border p-4 shadow-xs mb-4">
              <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ letterSpacing: '0.04em' }}>
                {language === 'ta' ? 'லாஜிஸ்டிக்ஸ் மையம்' : 'DISPATCH & LOGISTICS HUB'}
              </span>

              <div className="small mb-3">
                <div className="mb-2">
                  <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Destination Hub:</span>
                  <strong className="text-dark">{order.location || 'Central Distribution Hub'}</strong>
                </div>
                <div className="mb-2">
                  <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Consignment Status:</span>
                  <span className="text-success fw-bold">Verified & Dispatched</span>
                </div>
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>Scheduled Handover:</span>
                  <span className="text-dark font-monospace fw-semibold">{order.deliveryDate || 'Within 48 Hours'}</span>
                </div>
              </div>

              <Link
                to="/buyer/book-vehicle"
                className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-bold py-2 d-inline-flex align-items-center justify-content-center gap-1.5 shadow-2xs"
              >
                <i className="bi bi-truck"></i>
                <span>{language === 'ta' ? 'வாகனம் முன்பதிவு செய்' : 'Book Logistics Vehicle'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
