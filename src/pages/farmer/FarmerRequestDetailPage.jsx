/**
 * Farmer Request Details Page
 * Route: /farmer/requests/:id
 * Dedicated simple page for reviewing buyer procurement offers, 1-click Accept/Decline, and opening direct conversation.
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    buyerRequests,
    acceptRequest,
    declineRequest,
    getOrCreateConversationForBuyer
  } = useFarmer();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  // Match request by id (case-insensitive)
  const request = buyerRequests.find(
    (r) => (r.id || '').toLowerCase() === (id || '').toLowerCase()
  );

  if (!request) {
    return (
      <FarmerLayout>
        <div className="w-100 farm-animate-fade p-5 text-center bg-white rounded-4 border my-4">
          <i className="bi bi-exclamation-circle fs-1 text-warning mb-2 d-block"></i>
          <h3 className="fw-bold text-dark mb-2">
            {language === 'ta' ? 'கோரிக்கை காணப்படவில்லை' : 'Buyer Request Not Found'}
          </h3>
          <p className="text-muted small mb-4">
            {language === 'ta'
              ? `கோரிக்கை எண் #${id} காணப்படவில்லை அல்லது அகற்றப்பட்டிருக்கலாம்.`
              : `The request with ID #${id} could not be found or has expired.`}
          </p>
          <Link to="/farmer/requests" className="btn btn-success fw-bold rounded-pill px-4 py-2">
            ← {language === 'ta' ? 'அனைத்து கோரிக்கைகளுக்கும் திரும்பு' : 'Back to Buyer Requests'}
          </Link>
        </div>
      </FarmerLayout>
    );
  }

  const handleAccept = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      acceptRequest(request.id);
      setIsProcessing(false);
    }, 400);
  };

  const handleDecline = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      declineRequest(request.id);
      setShowDeclineConfirm(false);
      setIsProcessing(false);
    }, 400);
  };

  const handleOpenConversation = () => {
    const convId = getOrCreateConversationForBuyer(
      request.buyerName,
      request.buyerType,
      request.cropRequested || request.productName
    );
    navigate(`/farmer/messages?conv=${convId}`);
  };

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade" style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Back Navigation Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
            style={{ width: '40px', height: '40px' }}
            onClick={() => navigate('/farmer/requests')}
            aria-label="Back to requests"
          >
            <i className="bi bi-arrow-left fs-5 text-dark"></i>
          </button>

          <span className="badge bg-light text-muted border font-monospace px-3 py-1.5 small">
            #{request.id}
          </span>
        </div>

        {/* ===================================================================
            BUYER REQUEST CARD
            =================================================================== */}
        <div className="bg-white rounded-4 border shadow-xs p-4 mb-4">
          {/* Buyer Header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-3 mb-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <img
                src={
                  request.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                }
                alt={request.buyerName}
                className="rounded-circle object-fit-cover border"
                style={{ width: '56px', height: '56px' }}
              />
              <div>
                <h1 className="fs-4 fw-black text-dark mb-0.5">{request.buyerName}</h1>
                <span className="text-muted small">
                  {request.buyerType || 'Wholesale Buyer'} • <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {request.location}
                </span>
              </div>
            </div>

            <div>
              <span
                className={`badge fs-6 rounded-pill px-3 py-1.5 ${
                  request.status === 'Accepted'
                    ? 'bg-success text-white'
                    : request.status === 'Declined'
                    ? 'bg-danger text-white'
                    : 'bg-warning text-dark'
                }`}
              >
                {request.status === 'Accepted'
                  ? `🟢 ${t('accepted')}`
                  : request.status === 'Declined'
                  ? `🔴 ${t('declineBtn')}`
                  : `🟡 ${t('pending')}`}
              </span>
            </div>
          </div>

          {/* Core Structured Details Grid */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('productNameLabel')}</span>
                <strong className="fs-5 text-dark d-block">
                  {request.cropRequested || request.productName}
                </strong>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('quantityLabel')}</span>
                <strong className="fs-5 text-success font-monospace d-block">
                  {request.quantity}
                </strong>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('offeredPriceLabel')}</span>
                <strong className="fs-5 text-dark font-monospace d-block">
                  {request.offerPrice}
                </strong>
                {request.totalValue && (
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    Total Estimated: {request.totalValue}
                  </span>
                )}
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('locationLabel')}</span>
                <strong className="fs-6 text-dark d-block">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {request.location}
                </strong>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('requestedDateLabel')}</span>
                <strong className="fs-6 text-dark d-block">
                  <i className="bi bi-calendar-check text-primary me-1"></i>
                  {request.requestDate}
                </strong>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <span className="text-muted small d-block mb-1">{t('deliveryDetailsLabel')}</span>
                <strong className="fs-6 text-dark d-block">
                  <i className="bi bi-truck text-success me-1"></i>
                  {language === 'ta'
                    ? 'பண்ணை வாயிலில் நேரடி சரக்கு ஏற்றுமதி (டாடா ஏஸ்)'
                    : 'Direct farmgate pickup via Tata Ace'}
                </strong>
              </div>
            </div>
          </div>

          {/* Buyer Note */}
          {request.message && (
            <div className="p-3 bg-warning-subtle text-dark rounded-3 border border-warning-subtle mb-4 small">
              <strong className="d-block mb-1">
                <i className="bi bi-chat-quote-fill text-warning me-1"></i> {t('buyerNoteLabel')}:
              </strong>
              <span>"{request.message}"</span>
            </div>
          )}

          {/* ===================================================================
              ACTION BUTTONS OR STATUS FEEDBACK
              =================================================================== */}
          {request.status === 'Pending' && (
            <div className="pt-3 border-top">
              {showDeclineConfirm ? (
                <div className="p-3 bg-light rounded-3 border text-center">
                  <p className="text-dark fw-bold mb-2">
                    {language === 'ta'
                      ? 'இந்தக் கோரிக்கையை நிச்சயமாக நிராகரிக்க விரும்புகிறீர்களா?'
                      : 'Are you sure you want to decline this buyer request?'}
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm rounded-pill px-3"
                      onClick={() => setShowDeclineConfirm(false)}
                      disabled={isProcessing}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm rounded-pill px-4 fw-bold"
                      onClick={handleDecline}
                      disabled={isProcessing}
                    >
                      {isProcessing ? '...' : t('declineBtn')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column flex-sm-row align-items-stretch justify-content-between gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-danger fw-bold rounded-pill px-4 py-2.5 flex-fill"
                    onClick={() => setShowDeclineConfirm(true)}
                    disabled={isProcessing}
                  >
                    <i className="bi bi-x-circle me-1.5"></i>
                    <span>{t('declineRequestBtn')}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-success fw-bold rounded-pill px-5 py-2.5 flex-fill shadow-sm"
                    onClick={handleAccept}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span>Loading...</span>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1.5 fs-5"></i>
                        <span>{t('acceptRequestBtn')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {request.status === 'Accepted' && (
            <div className="p-4 bg-success-subtle rounded-3 border border-success-subtle text-center pt-4 mt-2">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white mb-2" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-check-lg fs-4"></i>
              </div>
              <h3 className="fs-5 fw-bold text-success-emphasis mb-1">
                {t('requestAcceptedTitle')}
              </h3>
              <p className="text-muted small mb-3">
                {t('requestAcceptedDesc')}
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-success fw-bold rounded-pill px-4 py-2.5 shadow-sm d-inline-flex align-items-center justify-content-center gap-2"
                  onClick={handleOpenConversation}
                >
                  <i className="bi bi-chat-dots-fill"></i>
                  <span>{t('openConversationCTA')}</span>
                </button>
                <Link
                  to="/farmer/orders"
                  className="btn btn-outline-success fw-bold rounded-pill px-4 py-2.5 text-center text-decoration-none"
                >
                  <i className="bi bi-truck me-1"></i>
                  <span>{t('orderTracking')}</span>
                </Link>
              </div>
            </div>
          )}

          {request.status === 'Declined' && (
            <div className="p-3 bg-light rounded-3 border text-center pt-3 mt-2">
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill mb-2">
                {t('requestDeclinedLabel')}
              </span>
              <p className="text-muted small mb-2">
                {language === 'ta'
                  ? 'இந்தக் கோரிக்கை நிராகரிக்கப்பட்டது. மற்ற கோரிக்கைகளை நீங்கள் பரிசீலிக்கலாம்.'
                  : 'You have declined this request. You can review other requests anytime.'}
              </p>
              <Link to="/farmer/requests" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                ← {language === 'ta' ? 'அனைத்து கோரிக்கைகளுக்கும் திரும்பு' : 'Back to Requests'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}
