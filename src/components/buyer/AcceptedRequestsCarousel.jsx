import React, { useState, useEffect, useRef } from 'react';

/**
 * AcceptedRequestsCarousel Component
 *
 * Provides a smooth animated carousel showcase of Accepted Requests.
 * Displays for each accepted request:
 * - Farmer Details: Name, Contact No, Address / Mandi location, FPO
 * - Product Photo: High resolution realistic crop image
 * - Product Details: Name, Tamil name, Quantity, Price, Total Amount, Delivery destination
 * - Live Accept Request Tracker:
 *     Request Sent ✓ → Farmer Received ✓ → Request Accepted ✓ → Ready for Transport
 * - Action buttons: Direct phone call, View Details Modal, Arrange Delivery
 */
export default function AcceptedRequestsCarousel({
  acceptedRequests = [],
  onSelectRequest,
  onBrowseProducts
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const count = acceptedRequests.length;

  // Auto-advance carousel smoothly every 6 seconds when not hovered
  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 6000);

    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (count === 0) {
    return (
      <div className="p-4 bg-white rounded-4 border shadow-xs text-center mb-4">
        <div
          className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-2"
          style={{ width: '48px', height: '48px' }}
        >
          <i className="bi bi-shield-check fs-4"></i>
        </div>
        <h5 className="fw-bold text-dark mb-1">No Accepted Requests Yet</h5>
        <p className="text-muted small mb-3">
          As soon as farmers accept your procurement requests, they will appear here in the live request tracker.
        </p>
        {onBrowseProducts && (
          <button
            type="button"
            className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold"
            onClick={onBrowseProducts}
          >
            <i className="bi bi-flower2 me-1"></i> Browse Fresh Produce
          </button>
        )}
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current - touchEndXRef.current > 50) {
      handleNext();
    }
    if (touchStartXRef.current - touchEndXRef.current < -50) {
      handlePrev();
    }
  };

  return (
    <div
      className="bd-carousel-wrapper bg-white border shadow-sm p-3 p-md-4 mb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success text-white rounded-pill px-2.5 py-1 small fw-bold d-inline-flex align-items-center gap-1 shadow-xs">
              <i className="bi bi-patch-check-fill"></i>
              <span>Accept Request Tracker</span>
            </span>
            <span className="text-muted small font-monospace">
              ({currentIndex + 1} of {count} Accepted)
            </span>
          </div>
          <h3 className="fs-5 fw-bold text-dark mb-0 mt-1">
            Confirmed Farmer Procurement Tracker
          </h3>
        </div>

        {/* Carousel Navigation Buttons */}
        {count > 1 && (
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              className="bd-carousel-nav-btn"
              onClick={handlePrev}
              aria-label="Previous Request"
              title="Previous accepted request"
            >
              <i className="bi bi-chevron-left fs-6"></i>
            </button>
            <button
              type="button"
              className="bd-carousel-nav-btn"
              onClick={handleNext}
              aria-label="Next Request"
              title="Next accepted request"
            >
              <i className="bi bi-chevron-right fs-6"></i>
            </button>
          </div>
        )}
      </div>

      {/* Carousel Sliding Track */}
      <div
        className="bd-carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="bd-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {acceptedRequests.map((req) => {
            const totalVal = (req.quantity * req.price).toLocaleString('en-IN');

            return (
              <div key={req.id} className="bd-carousel-slide px-1">
                <div className="row g-3 g-md-4 align-items-center">
                  {/* Left Column: Product Photo & Pricing Pill */}
                  <div className="col-12 col-md-4 col-lg-3 text-center">
                    <div className="position-relative d-inline-block w-100" style={{ maxWidth: '280px' }}>
                      <img
                        src={req.productImage}
                        alt={req.productName}
                        className="rounded-4 object-fit-cover w-100 shadow-sm border"
                        style={{ height: '220px' }}
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success text-white shadow-xs fw-bold px-2.5 py-1.5 rounded-pill">
                        <i className="bi bi-check-circle-fill me-1"></i> Request Accepted
                      </span>
                      <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-90 font-monospace text-white px-2.5 py-1.5 rounded-3">
                        #{req.id}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Product Details & Farmer Details */}
                  <div className="col-12 col-md-8 col-lg-9">
                    <div className="row g-3">
                      {/* Product Info */}
                      <div className="col-12 col-lg-6">
                        <div className="p-3 bg-light rounded-3 h-100 border">
                          <div className="d-flex align-items-baseline gap-2 mb-1">
                            <h4 className="fw-bold text-dark fs-5 mb-0">{req.productName}</h4>
                            {req.productTamilName && (
                              <span className="text-muted small">({req.productTamilName})</span>
                            )}
                          </div>

                          <div className="row g-2 mt-1 small">
                            <div className="col-6">
                              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                Requested Quantity:
                              </span>
                              <strong className="text-dark fs-6 font-monospace">
                                {req.quantity} {req.unit || 'kg'}
                              </strong>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                Agreed Price:
                              </span>
                              <strong className="text-success fs-6 font-monospace">
                                ₹{req.price} / {req.unit || 'kg'}
                              </strong>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                Total Value:
                              </span>
                              <span className="text-primary fw-bold font-monospace">
                                ₹{totalVal}
                              </span>
                            </div>

                            <div className="col-6">
                              <span className="text-muted d-block" style={{ fontSize: '0.74rem' }}>
                                Request Date:
                              </span>
                              <span className="text-dark fw-semibold">
                                {req.requestDate}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-top">
                            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                              Delivery Destination:
                            </span>
                            <span className="text-dark small fw-semibold">
                              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                              {req.deliveryLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Farmer Details */}
                      <div className="col-12 col-lg-6">
                        <div className="p-3 bg-light rounded-3 h-100 border">
                          <div className="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                            <div className="d-flex align-items-center gap-1.5">
                              <i className="bi bi-person-badge-fill text-success fs-5"></i>
                              <span className="fw-bold text-dark small text-uppercase">Farmer Details</span>
                            </div>
                            {req.farmerFpo && (
                              <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.68rem' }}>
                                Verified FPO
                              </span>
                            )}
                          </div>

                          <div className="mb-2">
                            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                              Farmer Name:
                            </span>
                            <strong className="text-dark fs-6">
                              {req.farmerName}
                            </strong>
                          </div>

                          <div className="mb-2">
                            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                              Contact Number:
                            </span>
                            <div className="d-flex align-items-center gap-2">
                              <a
                                href={`tel:${req.farmerPhone || '+919842188920'}`}
                                className="text-success fw-bold text-decoration-none font-monospace small d-inline-flex align-items-center gap-1"
                              >
                                <i className="bi bi-telephone-fill"></i>
                                <span>{req.farmerPhone || '+91 98421 88920'}</span>
                              </a>
                              <a
                                href={`tel:${req.farmerPhone || '+919842188920'}`}
                                className="btn btn-xs btn-outline-success rounded-pill px-2 py-0 fw-bold"
                                style={{ fontSize: '0.7rem' }}
                              >
                                Call Now
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                              Address / Mandi Location:
                            </span>
                            <span className="text-dark small">
                              <i className="bi bi-pin-map-fill text-danger me-1"></i>
                              {req.farmerLocation || 'Nilakottai Mandi, Dindigul, Tamil Nadu'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LIVE ACCEPT REQUEST TRACKER PROGRESSION */}
                    <div className="mt-3 p-2.5 bg-white border border-success-subtle rounded-3 shadow-xs">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-success small d-flex align-items-center gap-1">
                          <i className="bi bi-broadcast"></i>
                          <span>Live Deal Tracker:</span>
                        </span>
                        <span className="badge bg-success-subtle text-success small font-monospace">
                          {req.acceptedDate ? `Accepted on ${req.acceptedDate}` : 'Farmer Confirmed'}
                        </span>
                      </div>

                      {/* 4-Step Tracker Progression */}
                      <div className="row g-2 text-center small" style={{ fontSize: '0.74rem' }}>
                        <div className="col-3">
                          <div className="p-1 rounded-2 bg-success text-white fw-bold mb-1">
                            1. Sent ✓
                          </div>
                          <span className="text-muted text-truncate d-block">03 Sep, 08:30 AM</span>
                        </div>

                        <div className="col-3">
                          <div className="p-1 rounded-2 bg-success text-white fw-bold mb-1">
                            2. Received ✓
                          </div>
                          <span className="text-muted text-truncate d-block">Delivered</span>
                        </div>

                        <div className="col-3">
                          <div className="p-1 rounded-2 bg-success text-white fw-bold mb-1 shadow-xs">
                            3. Accepted ✓
                          </div>
                          <span className="text-success fw-bold text-truncate d-block">Confirmed</span>
                        </div>

                        <div className="col-3">
                          <div className="p-1 rounded-2 bg-primary-subtle text-primary fw-bold mb-1">
                            4. Ready 🚚
                          </div>
                          <span className="text-muted text-truncate d-block">Transport Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3 d-flex align-items-center justify-content-end gap-2 flex-wrap">
                      <a
                        href={`tel:${req.farmerPhone || '+919842188920'}`}
                        className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold"
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call {req.farmerName.split(' ')[0]}
                      </a>

                      <button
                        type="button"
                        className="btn btn-sm btn-success rounded-pill px-3.5 fw-bold shadow-xs d-flex align-items-center gap-1.5"
                        onClick={() => onSelectRequest && onSelectRequest(req)}
                      >
                        <span>View Full Tracker Details</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      {count > 1 && (
        <div className="bd-carousel-indicators">
          {acceptedRequests.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`bd-carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
