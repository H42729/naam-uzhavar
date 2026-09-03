import React, { useState } from 'react';

/**
 * RequestTrackingModal Component
 * Displays comprehensive details of a buyer's request to a farmer.
 * Shows farmer details, product details, quantity, pricing, delivery location,
 * buyer contact info, current status badge, and an interactive 3-step status timeline:
 * Request Sent → Farmer Received → Farmer Accepted/Rejected.
 */
export default function RequestTrackingModal({
  request,
  onClose,
  onUpdateStatus,
  onBrowseProducts
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [customReason, setCustomReason] = useState('');

  if (!request) return null;

  const isPending = request.status === 'Pending';
  const isAccepted = request.status === 'Accepted';
  const isRejected = request.status === 'Rejected' || request.status === 'Declined';

  const handleSimulateAccept = () => {
    const now = new Date();
    const timeString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onUpdateStatus(request.id, 'Accepted', { acceptedDate: timeString, rejectionReason: null });
    setShowRejectInput(false);
  };

  const handleSimulateReject = (reason) => {
    onUpdateStatus(request.id, 'Rejected', {
      rejectionReason: reason || customReason || 'Stock committed to another wholesale buyer.',
      acceptedDate: null
    });
    setShowRejectInput(false);
    setCustomReason('');
  };

  const handleSimulatePending = () => {
    onUpdateStatus(request.id, 'Pending', { acceptedDate: null, rejectionReason: null });
    setShowRejectInput(false);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-xl border overflow-hidden w-100 farm-animate-fade"
        style={{
          maxWidth: '740px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
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
          {/* 1. PRODUCT & DEAL BANNER */}
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
                      Total Expected Value
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

          {/* 2. STATUS TIMELINE (Request Sent → Farmer Received → Farmer Accepted/Rejected) */}
          <div className="p-3.5 bg-light rounded-4 border mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fw-bold text-uppercase small text-muted" style={{ letterSpacing: '0.04em' }}>
                Status Timeline
              </span>
              <span className="small text-muted">
                {isPending && '⚡ Awaiting Farmer Decision'}
                {isAccepted && '✓ Confirmed by Farmer'}
                {isRejected && '✕ Declined by Farmer'}
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
                        1. Request Sent
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {request.requestDate} {request.requestTime || ''}
                      </span>
                      <span className="text-success small fw-semibold" style={{ fontSize: '0.74rem' }}>
                        ✓ Dispatched by Buyer
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
                        2. Farmer Received
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {request.farmerName}'s portal
                      </span>
                      <span className="text-success small fw-semibold" style={{ fontSize: '0.74rem' }}>
                        ✓ Notification Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Farmer Decision (Accepted / Rejected / Pending) */}
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
                        {isAccepted
                          ? '3. Farmer Accepted'
                          : isRejected
                          ? '3. Farmer Rejected'
                          : '3. Waiting for Farmer Response'}
                      </strong>
                      <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                        {isAccepted && (request.acceptedDate ? `Accepted on ${request.acceptedDate}` : 'Request Accepted')}
                        {isRejected && (request.rejectionReason ? `Reason: ${request.rejectionReason}` : 'Request Rejected')}
                        {isPending && 'Farmer reviewing inventory & schedule'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Banner for Accepted or Rejected details */}
            {isAccepted && (
              <div className="mt-3 p-2.5 bg-success-subtle border border-success-subtle rounded-3 text-success small d-flex align-items-center gap-2">
                <i className="bi bi-patch-check-fill fs-5"></i>
                <div>
                  <strong>Farmer accepted this request on {request.acceptedDate || request.requestDate}.</strong>
                  <div className="text-success-emphasis" style={{ fontSize: '0.78rem' }}>
                    Stock has been allocated. Transport coordination can proceed.
                  </div>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="mt-3 p-2.5 bg-danger-subtle border border-danger-subtle rounded-3 text-danger small d-flex align-items-start gap-2">
                <i className="bi bi-exclamation-octagon-fill fs-5 mt-0.5"></i>
                <div>
                  <strong>Farmer rejected this request.</strong>
                  <div className="text-danger-emphasis" style={{ fontSize: '0.78rem' }}>
                    {request.rejectionReason ? (
                      <span><strong>Reason:</strong> {request.rejectionReason}</span>
                    ) : (
                      <span>Farmer was unable to fulfill this request at this time.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isPending && (
              <div className="mt-3 p-2.5 bg-warning-subtle border border-warning-subtle rounded-3 text-warning-emphasis small d-flex align-items-center gap-2">
                <i className="bi bi-clock-history fs-5"></i>
                <div>
                  <strong>Waiting for Farmer Response</strong>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                    The farmer has received your request and is verifying farm inventory and harvesting schedule.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. FARMER & BUYER INFORMATION (Side by Side) */}
          <div className="row g-3 mb-4">
            {/* Farmer Card */}
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white rounded-3 border h-100">
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="bi bi-person-fill text-success fs-5"></i>
                  <span className="fw-bold text-dark small text-uppercase">Farmer Information</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Farmer Name</span>
                  <strong className="text-dark fs-6">{request.farmerName}</strong>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Contact Phone</span>
                  <a
                    href={`tel:${request.farmerPhone || '+919842188920'}`}
                    className="text-success fw-semibold text-decoration-none font-monospace small"
                  >
                    <i className="bi bi-telephone-fill me-1"></i>
                    {request.farmerPhone || '+91 98421 88920'}
                  </a>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Farm Location / Mandi Hub</span>
                  <span className="text-dark small">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {request.farmerLocation || 'Nilakottai, Dindigul'}
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

            {/* Buyer Card */}
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white rounded-3 border h-100">
                <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="bi bi-building text-primary fs-5"></i>
                  <span className="fw-bold text-dark small text-uppercase">Buyer Information</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Buyer Entity Name</span>
                  <strong className="text-dark fs-6">{request.buyerName}</strong>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Contact Phone</span>
                  <a
                    href={`tel:${request.buyerPhone}`}
                    className="text-primary fw-semibold text-decoration-none font-monospace small"
                  >
                    <i className="bi bi-telephone-fill me-1"></i>
                    {request.buyerPhone}
                  </a>
                </div>
                <div className="mb-2">
                  <span className="text-muted small d-block">Business Category</span>
                  <span className="badge bg-primary-subtle text-primary small">
                    {request.buyerType || 'Procurement Buyer'}
                  </span>
                </div>
                <div>
                  <span className="text-muted small d-block">Delivery Destination Location</span>
                  <span className="text-dark small fw-semibold">
                    <i className="bi bi-truck text-dark me-1"></i>
                    {request.deliveryLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BUYER SPECIFICATIONS / NOTES */}
          {request.message && (
            <div className="p-3 bg-light rounded-3 border mb-4">
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                Buyer Message / Notes
              </span>
              <p className="text-dark small mb-0 fst-italic">
                "{request.message}"
              </p>
            </div>
          )}

          {/* 5. INTERACTIVE DEMO TESTING CONTROLS */}
          <div className="p-3 bg-white rounded-3 border shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold text-dark small">
                ⚡ Interactive Demo Controls (Simulate Farmer Decision)
              </span>
              <span className="badge bg-secondary-subtle text-secondary small">
                Status Testing
              </span>
            </div>
            <p className="text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
              Test how the dashboard, timeline, and badges react when the farmer updates their response:
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 ${
                  isAccepted ? 'btn-success' : 'btn-outline-success'
                }`}
                onClick={handleSimulateAccept}
              >
                <i className="bi bi-check-lg me-1"></i> Set Accepted
              </button>

              <button
                type="button"
                className={`btn btn-sm fw-bold rounded-pill px-3 ${
                  isRejected ? 'btn-danger' : 'btn-outline-danger'
                }`}
                onClick={() => setShowRejectInput(!showRejectInput)}
              >
                <i className="bi bi-x-lg me-1"></i> Set Rejected
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

            {/* Optional Rejection Reason Form */}
            {showRejectInput && (
              <div className="mt-3 p-2.5 bg-light rounded-3 border farm-animate-fade">
                <label className="form-label small fw-bold text-dark mb-1">
                  Specify Rejection Reason:
                </label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Stock committed to another buyer / Price below mandi minimum"
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
              className="btn btn-outline-success btn-sm rounded-pill fw-bold"
              onClick={() => {
                onClose();
                onBrowseProducts();
              }}
            >
              <i className="bi bi-flower2 me-1"></i> Browse Other Harvests
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm rounded-pill px-4 fw-bold ms-auto"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
