import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

/**
 * BuyerRequestDetailsModal Component
 *
 * Detailed inspection modal for a buyer's request sent to a farmer.
 * Displays:
 * - Farmer information (Name, phone, location, FPO)
 * - Product details (Name, Tamil name, Image, quantity, price, total value)
 * - Request date & time
 * - Delivery location
 * - Current status badge (Pending: yellow/orange, Accepted: green, Rejected: red)
 * - Farmer response message & Rejection reason
 * - 3-Step Status Timeline:
 *     Request Sent → Farmer Received → Farmer Response
 *     (Accepted ✓ / Waiting for Response / Rejected ✕)
 * - Interactive prototype controls to test farmer status transitions live
 */
export default function BuyerRequestDetailsModal({
  request,
  onClose,
  onUpdateStatus,
  onBrowseProducts
}) {
  const navigate = useNavigate();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [customReason, setCustomReason] = useState('');

  if (!request) return null;

  const isPending = request.status === 'Pending';
  const isAccepted = request.status === 'Accepted';
  const isRejected = request.status === 'Rejected' || request.status === 'Declined';

  const handleSimulateAccept = () => {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onUpdateStatus(request.id, 'Accepted', {
      acceptedDate: timeStr,
      responseMessage: 'Farmer confirmed availability. Stock will be ready for transport as requested.',
      rejectionReason: null
    });
    setShowRejectInput(false);
  };

  const handleSimulateReject = (reason) => {
    onUpdateStatus(request.id, 'Rejected', {
      rejectionReason: reason || customReason || 'Quantity unavailable - lot already committed to another buyer.',
      responseMessage: null,
      acceptedDate: null
    });
    setShowRejectInput(false);
    setCustomReason('');
  };

  const handleSimulatePending = () => {
    onUpdateStatus(request.id, 'Pending', {
      acceptedDate: null,
      responseMessage: null,
      rejectionReason: null
    });
    setShowRejectInput(false);
  };

  return createPortal(
    <div
      className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        margin: 0,
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-xl border overflow-hidden w-100 farm-animate-fade m-auto"
        style={{
          maxWidth: 'min(92vw, 740px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 px-4 bg-light border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2.5">
            <span className="badge bg-dark font-monospace px-2.5 py-1.5 fs-6">
              #{request.id}
            </span>

            {/* Status Chip */}
            {isPending && (
              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-bold">
                <i className="bi bi-hourglass-split"></i>
                <span>Waiting for Farmer Response</span>
              </span>
            )}
            {isAccepted && (
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-bold">
                <i className="bi bi-check-circle-fill"></i>
                <span>Request Accepted</span>
              </span>
            )}
            {isRejected && (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-bold">
                <i className="bi bi-x-circle-fill"></i>
                <span>Request Rejected</span>
              </span>
            )}
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

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {/* 1. PRODUCT BANNER */}
          <div className="p-3 bg-white rounded-4 border shadow-xs mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-sm-auto text-center text-sm-start">
                <img
                  src={request.productImage}
                  alt={request.productName}
                  className="rounded-3 object-fit-cover shadow-xs border"
                  style={{ width: '96px', height: '96px' }}
                />
              </div>

              <div className="col-12 col-sm">
                <div className="d-flex flex-wrap align-items-baseline gap-2 mb-1">
                  <h4 className="fw-bold text-dark mb-0 fs-5">{request.productName}</h4>
                  {request.productTamilName && (
                    <span className="text-muted small">({request.productTamilName})</span>
                  )}
                </div>

                <div className="row g-2 mt-1">
                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.74rem' }}>
                      Requested Quantity
                    </span>
                    <strong className="text-dark fs-6 font-monospace">
                      {request.quantity} {request.unit || 'kg'}
                    </strong>
                  </div>

                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.74rem' }}>
                      Offer Price
                    </span>
                    <strong className="text-dark fs-6 font-monospace">
                      ₹{request.price} / {request.unit || 'kg'}
                    </strong>
                  </div>

                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.74rem' }}>
                      Total Estimated Value
                    </span>
                    <strong className="text-success fs-6 font-monospace">
                      ₹{(request.quantity * request.price).toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="col-6 col-md-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.74rem' }}>
                      Request Date
                    </span>
                    <span className="text-dark fw-semibold small">
                      {request.requestDate} {request.requestTime ? `• ${request.requestTime}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STATUS TIMELINE */}
          {/* Requirement: Request Sent → Farmer Received → Farmer Response */}
          <div className="p-3.5 bg-light rounded-4 border mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fw-bold text-uppercase small text-muted" style={{ letterSpacing: '0.04em' }}>
                Status Timeline
              </span>
              <span className="small text-muted font-monospace">
                {isPending && '⚡ Waiting for Farmer Response'}
                {isAccepted && '✓ Farmer Accepted'}
                {isRejected && '✕ Farmer Rejected'}
              </span>
            </div>

            {/* Visual Timeline Track */}
            <div className="position-relative py-2">
              <div className="row g-3">
                {/* Step 1: Request Sent */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-2.5">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <i className="bi bi-check-lg fs-5"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block" style={{ fontSize: '0.88rem' }}>
                        1. Request Sent ✓
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {request.timeline?.sentAt || `${request.requestDate} ${request.requestTime || ''}`}
                      </span>
                      <span className="text-success small fw-semibold" style={{ fontSize: '0.74rem' }}>
                        Submitted by You
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Farmer Received */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-2.5">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                      style={{ width: '36px', height: '36px' }}
                    >
                      <i className="bi bi-check-lg fs-5"></i>
                    </div>
                    <div>
                      <strong className="text-dark d-block" style={{ fontSize: '0.88rem' }}>
                        2. Farmer Received ✓
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {request.timeline?.receivedAt || 'Delivered to Farmer Dashboard'}
                      </span>
                      <span className="text-success small fw-semibold" style={{ fontSize: '0.74rem' }}>
                        Delivered to {request.farmerName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Farmer Response */}
                <div className="col-12 col-md-4">
                  <div className="d-flex align-items-start gap-2.5">
                    <div
                      className={`rounded-circle text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0 ${
                        isAccepted
                          ? 'bg-success'
                          : isRejected
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                      style={{ width: '36px', height: '36px' }}
                    >
                      {isAccepted && <i className="bi bi-check-circle-fill fs-5"></i>}
                      {isRejected && <i className="bi bi-x-circle-fill fs-5"></i>}
                      {isPending && <i className="bi bi-hourglass-split fs-6"></i>}
                    </div>
                    <div>
                      <strong
                        className={`d-block ${
                          isAccepted
                            ? 'text-success'
                            : isRejected
                            ? 'text-danger'
                            : 'text-warning-emphasis'
                        }`}
                        style={{ fontSize: '0.88rem' }}
                      >
                        3.{' '}
                        {isAccepted
                          ? 'Accepted ✓'
                          : isRejected
                          ? 'Rejected ✕'
                          : 'Waiting for Response'}
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {isAccepted && (request.acceptedDate || 'Farmer accepted your request')}
                        {isRejected && 'Farmer rejected your request'}
                        {isPending && 'Farmer reviewing availability'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Details Strip */}
            {isAccepted && (
              <div className="mt-3 p-3 bg-success-subtle border border-success-subtle rounded-3 text-success small d-flex align-items-start gap-2.5">
                <i className="bi bi-patch-check-fill fs-4 mt-0.5"></i>
                <div>
                  <strong className="fs-6 d-block mb-1">Farmer has accepted your request.</strong>
                  <div className="text-success-emphasis" style={{ fontSize: '0.82rem' }}>
                    {request.responseMessage || 'The farmer has agreed to the requested quantity and price. You can now arrange dispatch with local drivers.'}
                  </div>
                  {request.acceptedDate && (
                    <div className="text-muted small mt-1 font-monospace" style={{ fontSize: '0.74rem' }}>
                      Accepted on: {request.acceptedDate}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isRejected && (
              <div className="mt-3 p-3 bg-danger-subtle border border-danger-subtle rounded-3 text-danger small d-flex align-items-start gap-2.5">
                <i className="bi bi-exclamation-octagon-fill fs-4 mt-0.5"></i>
                <div>
                  <strong className="fs-6 d-block mb-1">Farmer has rejected your request.</strong>
                  <div className="text-danger-emphasis fw-semibold" style={{ fontSize: '0.84rem' }}>
                    Reason: {request.rejectionReason || 'Quantity unavailable'}
                  </div>
                  <div className="text-muted small mt-1" style={{ fontSize: '0.76rem' }}>
                    You can browse other verified farmers with active harvest listings for {request.productName}.
                  </div>
                </div>
              </div>
            )}

            {isPending && (
              <div className="mt-3 p-3 bg-warning-subtle border border-warning-subtle rounded-3 text-warning-emphasis small d-flex align-items-center gap-2.5">
                <i className="bi bi-clock-history fs-4"></i>
                <div>
                  <strong className="fs-6 d-block mb-0.5">Waiting for Farmer Response</strong>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {request.farmerName} has received your request and is verifying farm inventory and harvesting schedule.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. FARMER & DELIVERY DETAILS (Side by Side) */}
          <div className="row g-3 mb-4">
            {/* Farmer Info */}
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white rounded-3 border h-100">
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="bi bi-person-fill text-success fs-5"></i>
                  <span className="fw-bold text-dark small text-uppercase">Farmer Details</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Farmer Name</span>
                  <strong className="text-dark fs-6">{request.farmerName}</strong>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Contact No</span>
                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`tel:${request.farmerPhone || '+919842188920'}`}
                      className="text-success fw-semibold text-decoration-none font-monospace small"
                    >
                      <i className="bi bi-telephone-fill me-1"></i>
                      {request.farmerPhone || '+91 98421 88920'}
                    </a>
                    <a
                      href={`tel:${request.farmerPhone || '+919842188920'}`}
                      className="btn btn-xs btn-outline-success rounded-pill px-2 py-0 fw-bold"
                      style={{ fontSize: '0.72rem' }}
                    >
                      Call
                    </a>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Farmer Address / Mandi Hub</span>
                  <span className="text-dark small">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {request.farmerLocation || 'Dindigul, Tamil Nadu'}
                  </span>
                </div>
                {request.farmerFpo && (
                  <div>
                    <span className="text-muted small d-block">FPO Association</span>
                    <span className="badge bg-success-subtle text-success small">
                      {request.farmerFpo}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Destination Info */}
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white rounded-3 border h-100">
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="bi bi-truck text-primary fs-5"></i>
                  <span className="fw-bold text-dark small text-uppercase">Delivery & Logistics</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Delivery Location</span>
                  <strong className="text-dark fs-6">
                    <i className="bi bi-geo-alt-fill text-danger me-1 small"></i>
                    {request.deliveryLocation}
                  </strong>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Buyer Profile</span>
                  <span className="text-dark small fw-semibold">{request.buyerName || 'FreshMart Procurement'}</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Buyer Contact Phone</span>
                  <span className="text-primary font-monospace small">{request.buyerPhone || '+91 98765 43210'}</span>
                </div>
                <div>
                  <span className="text-muted small d-block">Current Deal Status</span>
                  <span className="badge bg-light text-dark border small">
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE SIMULATION CONTROLS */}
          <div className="p-3 bg-white rounded-3 border shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold text-dark small">
                ⚡ Test Farmer Response (Demo Simulator)
              </span>
              <span className="badge bg-secondary-subtle text-secondary small">
                Prototype Testing
              </span>
            </div>
            <p className="text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
              Simulate how the dashboard and timeline react when the farmer updates their decision:
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 ${
                  isAccepted ? 'btn-success' : 'btn-outline-success'
                }`}
                onClick={handleSimulateAccept}
              >
                <i className="bi bi-check-lg me-1"></i> Accept Request
              </button>

              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 ${
                  isRejected ? 'btn-danger' : 'btn-outline-danger'
                }`}
                onClick={() => setShowRejectInput(!showRejectInput)}
              >
                <i className="bi bi-x-lg me-1"></i> Reject Request
              </button>

              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 ${
                  isPending ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'
                }`}
                onClick={handleSimulatePending}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset to Pending
              </button>
            </div>

            {/* Rejection reason form */}
            {showRejectInput && (
              <div className="mt-3 p-2.5 bg-light rounded-3 border farm-animate-fade">
                <label className="form-label small fw-bold text-dark mb-1">
                  Specify Reason for Rejection:
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Quantity unavailable / Price below mandi floor rate"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger fw-bold"
                    onClick={() => handleSimulateReject(customReason)}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 px-4 bg-light border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          {onBrowseProducts && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill fw-semibold"
              onClick={() => {
                onClose();
                onBrowseProducts();
              }}
            >
              <i className="bi bi-arrow-left me-1"></i> Browse Products
            </button>
          )}

          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              className="btn btn-secondary btn-sm rounded-pill px-3 fw-semibold"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="btn btn-success btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-1.5 shadow-xs"
              onClick={() => {
                onClose();
                navigate(
                  `/buyer/aggregate-details/${request.id}?crop=${encodeURIComponent(request.productName)}&farmer=${encodeURIComponent(request.farmerName)}&qty=${request.quantity}&price=${request.price}&location=${encodeURIComponent(request.farmerLocation)}`
                );
              }}
            >
              <i className="bi bi-box-arrow-up-right"></i>
              <span>Open Farmer &amp; Product Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
