import React, { useState, useEffect } from 'react';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { useLanguage } from '../../context/LanguageContext';
import { getStoredVehicleBookings, updateBookingStatus } from '../../services/vehicleBookingService';
import NearbyVehiclesSection from '../../components/buyer/NearbyVehiclesSection';

export default function BuyerDeliveriesPage() {
  const { t, language } = useLanguage();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getStoredVehicleBookings());

    const handleUpdate = (e) => {
      setBookings(e.detail || getStoredVehicleBookings());
    };

    window.addEventListener('naam_uzhavar_bookings_updated', handleUpdate);
    return () => {
      window.removeEventListener('naam_uzhavar_bookings_updated', handleUpdate);
    };
  }, []);

  const latestBooking = bookings[0] || null;

  return (
    <BuyerLayout>
      {/* Top Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold text-uppercase small">
            FarmDirect Logistics Network
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small fw-bold">
            GPS Live Telemetry
          </span>
        </div>
        <h2 className="fw-black text-dark mb-1">
          {language === 'ta' ? 'சரக்கு போக்குவரத்து & வாகன கண்காணிப்பு' : 'Live Delivery & Farmgate Transport'}
        </h2>
        <p className="text-muted small mb-0">
          {language === 'ta'
            ? 'உங்கள் பண்ணை வாங்குதல்களுக்கான நேரடி வாகன முன்பதிவு, ஓட்டுநர் கண்காணிப்பு மற்றும் OTP சரிபார்ப்பு.'
            : 'Track dispatched agricultural freight vehicles, driver locations, gate OTPs, and delivery milestones in real time.'}
        </p>
      </div>

      {/* Active Delivery Highlight Card (If accepted booking exists) */}
      {latestBooking && latestBooking.status === 'ACCEPTED' && (
        <div className="card rounded-4 border border-success shadow-sm mb-5 overflow-hidden">
          <div className="bg-success text-white p-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="spinner-grow spinner-grow-sm text-white" role="status"></span>
              <strong className="fs-6">
                {language === 'ta' ? 'செயலில் உள்ள சரக்கு வாகனம்' : 'Active Freight Run'}: #{latestBooking.id}
              </strong>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-white text-success fw-bold px-3 py-1 rounded-pill">
                ● En Route to Farmgate (~{latestBooking.etaMins || 15} mins ETA)
              </span>
              <span className="small text-white text-opacity-90">
                Gate OTP: <strong className="font-monospace fs-6 text-warning">{latestBooking.pickupOtp}</strong>
              </span>
            </div>
          </div>

          <div className="card-body p-4">
            <div className="row g-4 align-items-center">
              {/* Driver & Vehicle Details */}
              <div className="col-12 col-md-5 border-bottom border-md-bottom-0 border-md-end pb-4 pb-md-0 mb-3 mb-md-0">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={latestBooking.driver.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={latestBooking.driver.name}
                    className="rounded-circle object-fit-cover shadow-xs"
                    style={{ width: '60px', height: '60px', border: '3px solid #16a34a' }}
                  />
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{latestBooking.driver.name}</h5>
                    <div className="text-muted small">
                      {latestBooking.vehicleName} • <span className="font-monospace fw-bold text-dark">{latestBooking.regNumber}</span>
                    </div>
                    <span className="badge bg-warning text-dark px-2 py-0 small fw-bold">
                      ★ {latestBooking.driver.rating || 4.9} Verified Carrier
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <a
                    href={`tel:${latestBooking.driver.phone}`}
                    className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-2"
                  >
                    <i className="bi bi-telephone-fill"></i>
                    <span>Call Driver ({latestBooking.driver.phone})</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-light border btn-sm rounded-pill px-3 text-muted fw-bold"
                    onClick={() => alert(`Direct dispatch hotline for Booking #${latestBooking.id} is active.`)}
                  >
                    <i className="bi bi-chat-dots me-1"></i> SMS Updates
                  </button>
                </div>
              </div>

              {/* Route & Cargo Telemetry */}
              <div className="col-12 col-md-7">
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <span className="text-muted small d-block">PICKUP POINT:</span>
                    <strong className="text-dark small">
                      <i className="bi bi-geo-alt-fill text-success me-1"></i>
                      {latestBooking.pickupLocation}
                    </strong>
                  </div>
                  <div className="col-6">
                    <span className="text-muted small d-block">DELIVERY DESTINATION:</span>
                    <strong className="text-dark small">
                      <i className="bi bi-flag-fill text-danger me-1"></i>
                      {latestBooking.dropoffLocation}
                    </strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">PRODUCE CARGO:</span>
                    <strong className="text-primary small">
                      {latestBooking.cargoName} ({latestBooking.weightKg} kg)
                    </strong>
                  </div>
                  <div className="col-6 mt-2">
                    <span className="text-muted small d-block">TOTAL LOGISTICS FARE:</span>
                    <strong className="text-success font-monospace fs-6">
                      ₹{latestBooking.fare} (Pre-authorized)
                    </strong>
                  </div>
                </div>

                {/* Progress Stages Bar */}
                <div className="p-3 bg-light rounded-3 border">
                  <div className="d-flex justify-content-between small text-muted mb-2 fw-semibold">
                    <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i> Accepted</span>
                    <span className="text-success fw-bold"><i className="bi bi-truck me-1"></i> En Route</span>
                    <span>Farm Weighbridge</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                      style={{ width: '40%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Nearby Vehicle Section */}
      <NearbyVehiclesSection />
    </BuyerLayout>
  );
}
