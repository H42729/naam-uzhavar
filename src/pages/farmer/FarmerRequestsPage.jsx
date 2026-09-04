/**
 * Farmer Buyer Requests Page
 * Route: /farmer/requests
 * Displays direct wholesale purchase requests from supermarkets, hotels, and bulk buyers
 * with structured spec rows, buyer notes, escrow security badge, 1-click Accept/Decline, and chat linkage.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerRequestsPage() {
  const {
    buyerRequests,
    acceptRequest,
    declineRequest,
    getOrCreateConversationForBuyer
  } = useFarmer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('All');
  const filterTabs = ['All', 'Pending', 'Accepted', 'Declined'];

  const filteredRequests = (Array.isArray(buyerRequests) ? buyerRequests : []).filter((r) => {
    if (statusFilter === 'All') return true;
    return (r.status || '').toLowerCase() === statusFilter.toLowerCase();
  });

  const handleMessageBuyer = (req) => {
    const convId = getOrCreateConversationForBuyer(
      req.buyerName,
      req.buyerType,
      req.cropRequested || req.productName
    );
    navigate(`/farmer/messages?conv=${convId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1.5 fw-bold">
            🟢 {t('accepted')}
          </span>
        );
      case 'Declined':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1.5 fw-bold">
            🔴 {t('declineBtn')}
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1.5 fw-bold">
            🟡 {t('pending')}
          </span>
        );
    }
  };

  const pendingCount = (Array.isArray(buyerRequests) ? buyerRequests : []).filter(
    (r) => r.status === 'Pending'
  ).length;

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'நேரடி மொத்த விலை ஏலங்கள்' : 'DIRECT WHOLESALE BIDS'}
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('buyerRequests')}</h1>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 rounded-pill fw-bold">
              {pendingCount} {t('pending')}
            </span>
          </div>
        </div>

        {/* Filter Tabs (Sticky Sub-Header) */}
        <div className="farm-sticky-sub-header bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xs">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? buyerRequests.length
                : buyerRequests.filter((r) => (r.status || '').toLowerCase() === tab.toLowerCase()).length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm shrink-0 whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 font-medium border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setStatusFilter(tab)}
              >
                <span>
                  {tab === 'All'
                    ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                    : tab === 'Pending'
                    ? t('pending')
                    : tab === 'Accepted'
                    ? t('accepted')
                    : t('declineBtn')}
                </span>
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Requests Cards List */}
        {filteredRequests.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-3">
            <i className="bi bi-inbox-fill fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">
              {language === 'ta'
                ? `"${statusFilter}" பிரிவில் கோரிக்கைகள் இல்லை`
                : `No requests found under "${statusFilter}"`}
            </h3>
            <p className="text-muted small mb-0">
              {t('noRequestsYetDesc') || 'New buyer requests will appear here when buyers view your harvests.'}
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="farm-card p-4 rounded-4 bg-white border shadow-xs hover-shadow transition"
              >
                {/* Top Row: Buyer Profile & Total Offer */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                  {/* Buyer Avatar & Info */}
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={
                        req.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={req.buyerName}
                      className="rounded-circle object-fit-cover shadow-xs border flex-shrink-0"
                      style={{ width: '52px', height: '52px' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <strong className="fs-5 text-dark">{req.buyerName}</strong>
                        <span className="badge bg-success-subtle text-success small">
                          {req.buyerType}
                        </span>
                        <span className="text-muted small font-monospace">#{req.id}</span>
                      </div>
                      <span className="text-muted small d-flex align-items-center gap-1 flex-wrap">
                        <span>
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {req.location}
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          <i className="bi bi-clock me-1"></i>
                          {req.requestDate}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Offer Price Value */}
                  <div className="text-md-end d-flex flex-md-column justify-content-between align-items-end w-100 w-md-auto">
                    <div>
                      <span className="text-muted small d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                        {language === 'ta' ? 'மொத்த ஏல மதிப்பு' : 'TOTAL OFFER VALUE'}
                      </span>
                      <strong className="fs-4 text-success font-monospace">
                        {req.totalValue || '₹4,200'}
                      </strong>
                    </div>
                    <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                      ({req.offerPrice})
                    </span>
                  </div>
                </div>

                {/* Structured Specs 3-Box Grid */}
                <div className="row g-2 g-md-3 mb-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small h-100">
                      <span className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                        {language === 'ta' ? 'கோரப்பட்ட பயிர்' : 'CROP REQUESTED'}
                      </span>
                      <strong className="fs-6 text-dark break-words">
                        {req.cropRequested || req.productName}
                      </strong>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small h-100">
                      <span className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                        {language === 'ta' ? 'தேவைப்படும் அளவு' : 'QUANTITY NEEDED'}
                      </span>
                      <strong className="fs-6 text-success font-monospace">
                        {req.quantity}
                      </strong>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small h-100">
                      <span className="text-muted d-block fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                        {language === 'ta' ? 'கோரிக்கை நிலை' : 'REQUEST STATUS'}
                      </span>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>
                  </div>
                </div>

                {/* Message From Buyer */}
                {req.message && (
                  <div className="p-3 bg-warning-subtle text-dark rounded-3 border border-warning-subtle mb-3 small">
                    <i className="bi bi-chat-left-quote-fill me-2 text-warning"></i>
                    <strong>{language === 'ta' ? 'வாங்குபவர் குறிப்பு' : 'Buyer Note'}:</strong> "{req.message}"
                  </div>
                )}

                {/* Bottom Actions Row */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">
                      <i className="bi bi-shield-check text-success me-1"></i>
                      {language === 'ta' ? 'உழவர் உற்பத்தியாளர் எஸ்க்ரோ உத்தரவாதம்' : 'FPO Escrow Payment Protected'}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {/* View Details Link */}
                    <Link
                      to={`/farmer/requests/${req.id}`}
                      className="btn btn-outline-secondary btn-sm rounded-pill fw-bold px-3 text-decoration-none"
                    >
                      <i className="bi bi-eye me-1"></i>
                      {language === 'ta' ? 'விவரங்கள்' : 'Details'}
                    </Link>

                    {/* Message Buyer */}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold px-3"
                      onClick={() => handleMessageBuyer(req)}
                    >
                      <i className="bi bi-chat-dots-fill me-1 text-primary"></i>
                      {t('messages')}
                    </button>

                    {req.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-3"
                          onClick={() => declineRequest(req.id)}
                        >
                          <i className="bi bi-x-circle me-1"></i> {t('declineBtn')}
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm rounded-pill fw-bold px-4 shadow-xs"
                          onClick={() => acceptRequest(req.id)}
                        >
                          <i className="bi bi-check2-circle me-1"></i> {t('acceptBtn')}
                        </button>
                      </>
                    ) : req.status === 'Accepted' ? (
                      <Link
                        to="/farmer/deliveries"
                        className="btn btn-outline-success btn-sm rounded-pill fw-bold px-3 text-decoration-none"
                      >
                        <i className="bi bi-truck me-1"></i> {t('deliveryStatus')}
                      </Link>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill">
                        {t('declineBtn')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
