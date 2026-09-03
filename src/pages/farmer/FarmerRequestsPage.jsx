/**
 * Farmer Buyer Requests Page
 * Route: /farmer/requests
 * Displays direct purchase offers from supermarkets, hotels, and retail chains with 1-click Accept / Decline and direct messaging.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerRequestsPage() {
  const { buyerRequests, acceptRequest, declineRequest } = useFarmer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Accepted', 'Declined'
  const filterTabs = ['All', 'Pending', 'Accepted', 'Declined'];

  const filteredRequests = buyerRequests.filter((r) => {
    if (statusFilter === 'All') return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

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
              {buyerRequests.filter((r) => r.status === 'Pending').length} Pending Review
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 overflow-x-auto pb-2 mb-4">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? buyerRequests.length
                : buyerRequests.filter((r) => r.status.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                  statusFilter === tab
                    ? 'btn-success text-white shadow-xs'
                    : 'btn-light text-muted border'
                }`}
                onClick={() => setStatusFilter(tab)}
              >
                <span>{tab}</span>
                <span className="badge bg-white bg-opacity-25 ms-1 rounded-pill small">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border">
            <i className="bi bi-inbox-fill fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark">No requests found under "{statusFilter}"</h3>
            <p className="text-muted small">New buyer requests will appear here when buyers view your harvests.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-4 bg-white rounded-4 border shadow-xs">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                  {/* Buyer Avatar & Title */}
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={req.avatar}
                      alt={req.buyerName}
                      className="rounded-circle object-fit-cover shadow-xs border"
                      style={{ width: '52px', height: '52px' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <strong className="fs-5 text-dark">{req.buyerName}</strong>
                        <span className="badge bg-success-subtle text-success small">
                          {req.buyerType}
                        </span>
                        <span className="text-muted small font-monospace">#{req.id}</span>
                      </div>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {req.location} • <i className="bi bi-clock me-1"></i> {req.requestDate}
                      </span>
                    </div>
                  </div>

                  {/* Offer Price Badge */}
                  <div className="text-md-end">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      TOTAL OFFER VALUE
                    </span>
                    <strong className="fs-4 text-success font-monospace">
                      {req.totalValue || '₹4,200'}
                    </strong>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                      ({req.offerPrice})
                    </span>
                  </div>
                </div>

                {/* Crop & Message Box */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small">
                      <span className="text-muted d-block fw-bold" style={{ fontSize: '0.7rem' }}>
                        CROP REQUESTED
                      </span>
                      <strong className="fs-6 text-dark">{req.cropRequested}</strong>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small">
                      <span className="text-muted d-block fw-bold" style={{ fontSize: '0.7rem' }}>
                        QUANTITY NEEDED
                      </span>
                      <strong className="fs-6 text-success font-monospace">{req.quantity}</strong>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border small">
                      <span className="text-muted d-block fw-bold" style={{ fontSize: '0.7rem' }}>
                        REQUEST STATUS
                      </span>
                      <span
                        className={`badge ${
                          req.status === 'Accepted'
                            ? 'bg-success'
                            : req.status === 'Declined'
                            ? 'bg-danger'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message From Buyer */}
                <div className="p-3 bg-warning-subtle text-dark rounded-3 border border-warning-subtle mb-3 small">
                  <i className="bi bi-chat-left-quote-fill me-2 text-warning"></i>
                  <strong>Buyer Note:</strong> "{req.message}"
                </div>

                {/* Actions Row */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top">
                  <span className="text-muted small">
                    <i className="bi bi-shield-check text-success me-1"></i> FPO Escrow Payment Protected
                  </span>

                  <div className="d-flex align-items-center gap-2">
                    {/* Message Buyer */}
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill fw-bold px-3"
                      onClick={() => navigate('/farmer/messages')}
                    >
                      <i className="bi bi-chat-dots-fill me-1 text-primary"></i> Message Buyer
                    </button>

                    {req.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-3"
                          onClick={() => declineRequest(req.id)}
                        >
                          <i className="bi bi-x-circle me-1"></i> Decline
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm rounded-pill fw-bold px-4 shadow-xs"
                          onClick={() => acceptRequest(req.id)}
                        >
                          <i className="bi bi-check2-circle me-1"></i> Accept Order
                        </button>
                      </>
                    ) : req.status === 'Accepted' ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                        <i className="bi bi-check2-all me-1"></i> Order Accepted • Ready for Pickup
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill">
                        Order Declined
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
