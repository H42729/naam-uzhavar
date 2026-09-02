import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';

export default function RequestDetailsModal({ request, onClose }) {
  const { acceptRequest, declineRequest, startConversationWithConsumer } = useFarmer();
  const navigate = useNavigate();

  if (!request) return null;

  const handleAccept = () => {
    acceptRequest(request.id);
    onClose();
  };

  const handleDecline = () => {
    declineRequest(request.id);
    onClose();
  };

  const handleMessageConsumer = () => {
    const convId = startConversationWithConsumer({
      consumerId: request.consumerId,
      consumerName: request.consumerName,
      businessType: request.businessType,
      avatar: request.avatar,
      location: request.location,
      productName: request.productName,
      quantity: request.quantity
    });
    onClose();
    navigate(`/farmer/messages?conv=${convId}`);
  };

  return (
    <div className="nu-modal-backdrop" onClick={onClose}>
      <div
        className="nu-modal-dialog farm-animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        {/* Header */}
        <div className="nu-modal-header bg-light">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`badge rounded-pill px-3 py-1 ${
                request.status === 'Accepted'
                  ? 'bg-success text-white'
                  : request.status === 'Declined'
                  ? 'bg-danger text-white'
                  : 'bg-warning text-dark'
              }`}
            >
              {request.status.toUpperCase()} REQUEST
            </span>
            <span className="text-muted small font-monospace">#{request.id}</span>
          </div>
          <button type="button" className="nu-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="nu-modal-body">
          {/* Buyer Profile Card */}
          <div className="p-3 bg-white rounded-3 border d-flex align-items-center justify-content-between mb-3 shadow-xs">
            <div className="d-flex align-items-center gap-3">
              <img
                src={
                  request.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                }
                alt={request.consumerName}
                className="rounded-circle border"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="fw-bold text-dark mb-0">{request.consumerName}</h5>
                <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                  {request.businessType || 'Direct Buyer'}
                </span>
              </div>
            </div>
            <div className="text-end">
              <div className="small text-muted">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {request.location || 'Tamil Nadu'}
              </div>
              <div className="small text-muted font-monospace mt-1">
                {request.phone || '+91 98400 00000'}
              </div>
            </div>
          </div>

          {/* Deal Highlights Grid */}
          <div className="row g-2 mb-3">
            <div className="col-6 col-sm-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Requested Crop
                </div>
                <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.92rem' }}>
                  {request.productName}
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Quantity
                </div>
                <div className="fw-bold text-success font-monospace mt-1 fs-6">
                  {request.quantity}
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-3">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Offer Price
                </div>
                <div className="fw-bold text-dark font-monospace mt-1 fs-6">
                  {request.offerPrice}
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-3">
              <div className="p-3 bg-success-subtle rounded-3 text-center border border-success-subtle h-100">
                <div className="text-success-emphasis small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                  Estimated Value
                </div>
                <div className="fw-bold text-success font-monospace mt-1 fs-6">
                  {request.totalValue || '₹9,600'}
                </div>
              </div>
            </div>
          </div>

          {/* Key Logistics & Timelines */}
          <div className="p-3 bg-light rounded-3 border mb-3">
            <div className="row g-2 small text-muted">
              <div className="col-sm-6">
                <strong>Request Placed:</strong> {request.requestDate || 'Recent'}
              </div>
              <div className="col-sm-6">
                <strong>Required Delivery / Pickup:</strong>{' '}
                <span className="text-dark fw-bold">{request.deliveryDate || 'Flexible'}</span>
              </div>
              <div className="col-12 mt-2 pt-2 border-top">
                <strong>Delivery Destination:</strong> {request.location}
              </div>
            </div>
          </div>

          {/* Buyer Message / Notes */}
          <div className="p-3 bg-white rounded-3 border mb-4">
            <div className="small fw-bold text-dark mb-1 d-flex align-items-center gap-1">
              <i className="bi bi-chat-left-quote-fill text-success"></i>
              <span>Buyer's Message / Specifications:</span>
            </div>
            <p className="small text-muted mb-0 font-italic">
              "{request.message || 'No additional notes provided by buyer.'}"
            </p>
          </div>

          {/* Actions */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold px-3"
              onClick={handleMessageConsumer}
            >
              <i className="bi bi-chat-dots-fill"></i>
              <span>Message Consumer</span>
            </button>

            <div className="d-flex gap-2">
              {request.status === 'Pending' && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-danger px-3 fw-semibold"
                    onClick={handleDecline}
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    className="btn btn-success px-4 fw-bold shadow-sm"
                    onClick={handleAccept}
                  >
                    Accept Request
                  </button>
                </>
              )}
              {request.status !== 'Pending' && (
                <button
                  type="button"
                  className="btn btn-secondary px-4 fw-bold"
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
