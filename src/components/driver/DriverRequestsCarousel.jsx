/**
 * Driver Logistics Smooth Carousel Component
 *
 * Provides a high-impact, smooth animated carousel showcase of
 * active delivery dispatch opportunities for drivers.
 *
 * Features:
 * - Smooth transition animations with cubic-bezier easing
 * - Cargo & Crop preview with weight and crates
 * - Origin (Farmer Farm/Mandi) to Destination (Buyer Market Depot) route info
 * - Guaranteed Driver Payout with distance and ETA
 * - 1-Click Accept Delivery action button
 * - Direct farmer phone contact button
 * - Auto-play with pause-on-hover & touch swipe support
 */

import React, { useState, useEffect, useRef } from 'react';

const CROP_IMAGES = {
  'Cauliflower & Drumstick': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
  'Cumbum Valley Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80',
  'Hill Garlic (Kodaikanal Malai Poondu)': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=80',
  'Country Tomato (Grade-A)': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  'Small Onion (Oddanchatram)': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
};

export default function DriverRequestsCarousel({ requests = [], onAcceptRequest }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const count = requests.length;

  // Auto-advance carousel smoothly every 5.5 seconds when not hovered
  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 5500);

    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (count === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % count);
  };

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
      className="drv-carousel-wrapper bg-white border shadow-sm p-3 p-md-4 mb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Top Header */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill px-2.5 py-1 small fw-bold d-inline-flex align-items-center gap-1.5 shadow-2xs">
              <i className="bi bi-lightning-charge-fill text-dark"></i>
              <span>High-Priority Dispatch Opportunities</span>
            </span>
            <span className="text-muted small font-monospace">
              ({currentIndex + 1} of {count})
            </span>
          </div>
          <h3 className="fs-5 fw-bold text-dark mb-0 mt-1">
            Fast Delivery Dispatches • Instant Driver Assignment
          </h3>
        </div>

        {/* Carousel Navigation Buttons */}
        {count > 1 && (
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              className="drv-carousel-nav-btn"
              onClick={handlePrev}
              aria-label="Previous dispatch"
              title="Previous delivery opportunity"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              type="button"
              className="drv-carousel-nav-btn"
              onClick={handleNext}
              aria-label="Next dispatch"
              title="Next delivery opportunity"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Carousel Sliding Track */}
      <div
        className="drv-carousel-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="drv-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {requests.map((req) => {
            const cropImage =
              CROP_IMAGES[req.crop] ||
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80';

            return (
              <div key={req.id} className="drv-carousel-slide px-1">
                <div className="row g-3 g-md-4 align-items-center">
                  {/* Left Column: Produce & Cargo Image */}
                  <div className="col-12 col-md-4 col-lg-3 text-center">
                    <div className="position-relative d-inline-block w-100" style={{ maxWidth: '280px' }}>
                      <img
                        src={cropImage}
                        alt={req.crop}
                        className="rounded-4 object-fit-cover w-100 shadow-sm border"
                        style={{ height: '210px' }}
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success text-white shadow-xs fw-bold px-2.5 py-1.5 rounded-pill font-monospace">
                        <i className="bi bi-currency-rupee me-0.5"></i>
                        {req.payout.toLocaleString('en-IN')} Net Pay
                      </span>
                      <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-90 font-monospace text-white px-2.5 py-1.5 rounded-3">
                        {req.distance}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Route Details & Driver Actions */}
                  <div className="col-12 col-md-8 col-lg-9">
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-2">
                      <div>
                        <h4 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                          <span>{req.crop}</span>
                          <span className="badge bg-light text-dark border font-monospace small">
                            {req.orderId}
                          </span>
                        </h4>
                        {req.tamilCrop && (
                          <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
                            {req.tamilCrop}
                          </span>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill small fw-semibold">
                          <i className="bi bi-truck me-1"></i>
                          {req.vehicleRequired || 'Tata Ace'}
                        </span>
                      </div>
                    </div>

                    {/* Route Flow Card (Pickup -> Drop) */}
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="row g-2">
                        {/* Pickup */}
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-start gap-2">
                            <div
                              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                              style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}
                            >
                              <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <div className="min-w-0">
                              <span className="text-muted d-block" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Pickup • {req.farmer}
                              </span>
                              <strong className="text-dark d-block text-truncate small" title={req.farmLocation}>
                                {req.farmLocation}
                              </strong>
                              <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                                Ready: {req.pickupTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Drop */}
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-start gap-2">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                              style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}
                            >
                              <i className="bi bi-shop"></i>
                            </div>
                            <div className="min-w-0">
                              <span className="text-muted d-block" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Delivery • {req.buyer}
                              </span>
                              <strong className="text-dark d-block text-truncate small" title={req.dropLocation}>
                                {req.dropLocation}
                              </strong>
                              <span className="text-success fw-semibold small" style={{ fontSize: '0.72rem' }}>
                                Direct Mandi Unloading Bay
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cargo Specs & Financial Highlights */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 small">
                      <div className="d-flex align-items-center gap-3">
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Total Weight</span>
                          <strong className="text-dark font-monospace">{req.weight}</strong>
                        </div>
                        <div className="border-start ps-3">
                          <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Crates</span>
                          <strong className="text-dark font-monospace">{req.crates} Standard Crates</strong>
                        </div>
                        <div className="border-start ps-3">
                          <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Trip Distance</span>
                          <strong className="text-dark font-monospace">{req.distance}</strong>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Guaranteed Driver Payout</span>
                        <span className="fs-5 fw-black text-success font-monospace">
                          ₹{req.payout.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex align-items-center justify-content-end gap-2 flex-wrap pt-2 border-top">
                      <a
                        href="tel:+919443211099"
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                        title="Call Farmer Contact"
                      >
                        <i className="bi bi-telephone-fill me-1 text-success"></i>
                        <span>Call Farmer</span>
                      </a>

                      <button
                        type="button"
                        className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm d-flex align-items-center gap-1.5"
                        onClick={() => onAcceptRequest && onAcceptRequest(req)}
                      >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Accept Delivery ({req.distance})</span>
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
        <div className="drv-carousel-indicators">
          {requests.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`drv-carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
