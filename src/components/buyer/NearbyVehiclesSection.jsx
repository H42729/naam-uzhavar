import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getVehicles,
  fetchVehicleBookings,
  getStoredVehicleBookings,
  updateBookingStatus
} from '../../services/vehicleBookingService';
import BookVehicleModal from './BookVehicleModal';

export default function NearbyVehiclesSection({ onNavigateToDeliveries }) {
  const { t, language } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalVehicle, setActiveModalVehicle] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch live vehicles and sync bookings
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [vehList, bkList] = await Promise.all([
          getVehicles(),
          fetchVehicleBookings()
        ]);
        if (isMounted) {
          if (Array.isArray(vehList) && vehList.length > 0) {
            setVehicles(vehList);
          }
          if (Array.isArray(bkList)) {
            setBookings(bkList);
          }
          setLoadingVehicles(false);
        }
      } catch (err) {
        if (isMounted) setLoadingVehicles(false);
      }
    }
    loadData();

    const handleUpdate = (e) => {
      setBookings(e.detail || getStoredVehicleBookings());
    };

    window.addEventListener('naam_uzhavar_bookings_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('naam_uzhavar_bookings_updated', handleUpdate);
    };
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'mini') return v.category === 'mini';
    if (selectedCategory === 'pickup') return v.category === 'pickup';
    if (selectedCategory === 'reefer') return v.isRefrigerated;
    if (selectedCategory === 'heavy') return v.category === 'heavy' || v.category === 'large';
    return true;
  });

  // Get most recent active or latest booking
  const latestBooking = bookings.length > 0 ? bookings[0] : null;

  const handleSimulateStatus = (bookingId, newStatus) => {
    const updated = updateBookingStatus(
      bookingId,
      newStatus,
      newStatus === 'DECLINED' ? 'Driver is already loaded with previous farmer batch' : null
    );
    setBookings(getStoredVehicleBookings());
  };

  return (
    <section className="mb-5">
      {/* Section Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold text-uppercase">
              <i className="bi bi-geo-alt-fill me-1"></i>
              {language === 'ta' ? 'அருகிலுள்ள வாகனங்கள்' : 'Nearby Vehicles'}
            </span>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small fw-bold">
              ● {vehicles.length} {language === 'ta' ? 'செயலில்' : 'Available Now'}
            </span>
          </div>
          <h4 className="fw-black text-dark mb-1 mt-2">
            {language === 'ta' ? 'பண்ணை சரக்கு போக்குவரத்து முன்பதிவு' : 'Book Farmgate Transport Vehicle'}
          </h4>
          <p className="text-muted small mb-0">
            {language === 'ta'
              ? 'ஒட்டன்சத்திரம், திண்டுக்கல் & நிலக்கோட்டை மண்டிகளில் கிடைக்கும் சரக்கு வாகனங்கள்'
              : 'Directly dispatch mini-trucks, pickups, & reefers stationed near Oddanchatram & Nilakottai mandis.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="d-flex flex-wrap gap-1.5 p-1 bg-white border rounded-4 shadow-xs">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold ${selectedCategory === 'all' ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setSelectedCategory('all')}
            >
              {language === 'ta' ? 'அனைத்தும்' : 'All'}
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold ${selectedCategory === 'mini' ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setSelectedCategory('mini')}
            >
              Tata Ace (750kg)
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold ${selectedCategory === 'pickup' ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setSelectedCategory('pickup')}
            >
              Pickup (1.2T)
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold ${selectedCategory === 'reefer' ? 'btn-primary text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setSelectedCategory('reefer')}
            >
              ❄️ {language === 'ta' ? 'குளிர்பதனம்' : 'Cold-Chain'}
            </button>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 shadow-xs"
            onClick={() => setShowHistory(!showHistory)}
          >
            <i className="bi bi-clock-history"></i>
            <span>{language === 'ta' ? 'முன்பதிவுகள்' : 'My Bookings'} ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* ==============================================================
          LIVE BOOKING STATUS BANNER (If recent booking is active)
         ============================================================== */}
      {latestBooking && (latestBooking.status === 'PENDING' || latestBooking.status === 'ACCEPTED' || latestBooking.status === 'DECLINED') && (
        <div
          className={`p-3 rounded-4 mb-4 border shadow-sm transition-all ${
            latestBooking.status === 'PENDING'
              ? 'bg-warning bg-opacity-10 border-warning'
              : latestBooking.status === 'ACCEPTED'
              ? 'bg-success bg-opacity-10 border-success'
              : 'bg-danger bg-opacity-10 border-danger'
          }`}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className={`rounded-circle p-2 text-white d-flex align-items-center justify-content-center ${
                  latestBooking.status === 'PENDING'
                    ? 'bg-warning'
                    : latestBooking.status === 'ACCEPTED'
                    ? 'bg-success'
                    : 'bg-danger'
                }`}
                style={{ width: '44px', height: '44px' }}
              >
                <i
                  className={`bi fs-4 ${
                    latestBooking.status === 'PENDING'
                      ? 'bi-hourglass-split'
                      : latestBooking.status === 'ACCEPTED'
                      ? 'bi-check-circle-fill'
                      : 'bi-x-circle-fill'
                  }`}
                ></i>
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong className="text-dark fs-6">
                    {language === 'ta' ? 'முன்பதிவு எண்' : 'Booking'} #{latestBooking.id}:{' '}
                    {language === 'ta' ? latestBooking.tamilVehicleName || latestBooking.vehicleName : latestBooking.vehicleName}
                  </strong>
                  <span
                    className={`badge rounded-pill px-2 py-1 small fw-bold ${
                      latestBooking.status === 'PENDING'
                        ? 'bg-warning text-dark'
                        : latestBooking.status === 'ACCEPTED'
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                    }`}
                  >
                    {latestBooking.status === 'PENDING'
                      ? (language === 'ta' ? 'ஓட்டுநர் பதிலுக்காக காத்திருக்கிறது' : 'Pending Confirmation')
                      : latestBooking.status === 'ACCEPTED'
                      ? (language === 'ta' ? '✓ ஏற்கப்பட்டது (வாகனம் புறப்பட்டது)' : '✓ Accepted by Driver')
                      : (language === 'ta' ? '✕ நிராகரிக்கப்பட்டது' : '✕ Declined by Driver')}
                  </span>
                </div>

                <div className="text-muted small mt-1">
                  <span>
                    <strong>{latestBooking.driver.name}</strong> ({latestBooking.regNumber}) • {latestBooking.cargoName} ({latestBooking.weightKg} kg) • {latestBooking.pickupLocation} → {latestBooking.dropoffLocation}
                  </span>
                  {latestBooking.status === 'ACCEPTED' && (
                    <span className="ms-2 text-success fw-bold">
                      • Pickup OTP: <span className="font-monospace fs-6 text-primary">{latestBooking.pickupOtp}</span>
                    </span>
                  )}
                  {latestBooking.status === 'DECLINED' && (
                    <span className="ms-2 text-danger fw-bold">
                      • {latestBooking.declineReason}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {latestBooking.status === 'PENDING' && (
                <div className="d-flex align-items-center gap-2 bg-white px-2 py-1 rounded-pill border">
                  <span className="small text-muted fw-semibold">Simulator:</span>
                  <button
                    type="button"
                    className="btn btn-success btn-sm rounded-pill px-2 py-0 fw-bold small"
                    onClick={() => handleSimulateStatus(latestBooking.id, 'ACCEPTED')}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm rounded-pill px-2 py-0 fw-bold small"
                    onClick={() => handleSimulateStatus(latestBooking.id, 'DECLINED')}
                  >
                    Decline
                  </button>
                </div>
              )}

              {latestBooking.status === 'ACCEPTED' && (
                <a
                  href={`tel:${latestBooking.driver.phone}`}
                  className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1"
                >
                  <i className="bi bi-telephone-fill"></i>
                  <span>Call {latestBooking.driver.name}</span>
                </a>
              )}

              {latestBooking.status === 'DECLINED' && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                  onClick={() => setActiveModalVehicle(vehicles[0])}
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  <span>{language === 'ta' ? 'வேறு வாகனம் தேடுக' : 'Rebook Another Vehicle'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          NEARBY VEHICLES CARDS GRID
         ============================================================== */}
      <div className="row g-3">
        {filteredVehicles.map((veh) => {
          const isBooked = latestBooking && latestBooking.vehicleId === veh.id && (latestBooking.status === 'PENDING' || latestBooking.status === 'ACCEPTED');

          return (
            <div key={veh.id} className="col-12 col-md-6 col-xl-4">
              <div
                className={`card h-100 rounded-4 border p-3 shadow-sm hover-shadow transition-all bg-white position-relative ${
                  isBooked ? 'border-primary border-2' : ''
                }`}
              >
                {/* Top Row: Vehicle Type & Live Badge */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center p-2"
                      style={{ width: '38px', height: '38px' }}
                    >
                      <i className={`bi ${veh.icon || 'bi-truck'} fs-5`}></i>
                    </span>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">
                        {language === 'ta' ? veh.tamilName : veh.name}
                      </h6>
                      <span className="font-monospace text-muted small" style={{ fontSize: '0.72rem' }}>
                        {veh.regNumber}
                      </span>
                    </div>
                  </div>

                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small fw-bold">
                    <i className="bi bi-broadcast me-1"></i>
                    {language === 'ta' ? 'அருகில்' : 'Near Mandi'}
                  </span>
                </div>

                {/* Driver Profile Strip */}
                <div className="p-2 bg-light rounded-3 border d-flex align-items-center justify-content-between my-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={veh.driver.avatar}
                      alt={veh.driver.name}
                      className="rounded-circle object-fit-cover shadow-xs"
                      style={{ width: '34px', height: '34px', border: '2px solid #2563eb' }}
                    />
                    <div>
                      <div className="fw-bold text-dark small">
                        {language === 'ta' ? veh.driver.tamilName : veh.driver.name}
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.70rem' }}>
                        {veh.driver.totalTrips} trips • {veh.driver.badge}
                      </span>
                    </div>
                  </div>

                  <span className="badge bg-warning text-dark px-2 py-1 fw-bold small">
                    ★ {veh.driver.rating}
                  </span>
                </div>

                {/* Location & Distance */}
                <div className="mb-3">
                  <div className="d-flex align-items-center text-muted small mb-1">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    <span className="text-truncate">
                      {language === 'ta' ? veh.tamilLocationName : veh.locationName}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.78rem' }}>
                    <span>
                      <i className="bi bi-signpost-2 me-1 text-primary"></i>
                      <strong>{veh.distanceKm} km</strong> {language === 'ta' ? 'தூரம்' : 'away'}
                    </span>
                    <span className="text-success fw-bold">
                      <i className="bi bi-lightning-fill text-warning me-1"></i>
                      ETA: ~{veh.etaMins} mins
                    </span>
                  </div>
                </div>

                {/* Specs Bar */}
                <div className="row g-1 text-center py-2 border-top border-bottom mb-3" style={{ fontSize: '0.75rem' }}>
                  <div className="col-4 border-end">
                    <span className="text-muted d-block">{language === 'ta' ? 'கொள்ளளவு' : 'Capacity'}</span>
                    <strong className="text-dark">{veh.capacityLabel}</strong>
                  </div>
                  <div className="col-4 border-end">
                    <span className="text-muted d-block">{language === 'ta' ? 'கட்டணம்' : 'Rate'}</span>
                    <strong className="text-primary font-monospace">₹{veh.ratePerKm}/km</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-muted d-block">{language === 'ta' ? 'குளிர்பதனம்' : 'Cold-Chain'}</span>
                    <strong className={veh.isRefrigerated ? 'text-info' : 'text-muted'}>
                      {veh.isRefrigerated ? 'Yes (4-8°C)' : 'Standard'}
                    </strong>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-auto">
                  <button
                    type="button"
                    className={`btn w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 ${
                      isBooked
                        ? 'btn-success text-white shadow-xs'
                        : 'btn-primary text-white shadow-xs'
                    }`}
                    style={{ backgroundColor: isBooked ? '#16a34a' : '#2563eb' }}
                    onClick={() => setActiveModalVehicle(veh)}
                  >
                    <i className={`bi ${isBooked ? 'bi-patch-check-fill' : 'bi-send-plus'}`}></i>
                    <span>
                      {isBooked
                        ? (language === 'ta' ? 'முன்பதிவு விவரம்' : 'Booking Active')
                        : (language === 'ta' ? 'வாகனம் முன்பதிவு செய்' : 'Book This Vehicle')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==============================================================
          OPTIONAL: MY RECENT VEHICLE BOOKINGS HISTORY DRAWER / TABLE
         ============================================================== */}
      {showHistory && (
        <div className="mt-4 p-4 bg-white rounded-4 border shadow-sm">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0">
              <i className="bi bi-journal-text me-2 text-primary"></i>
              {language === 'ta' ? 'எனது சரக்கு வாகன முன்பதிவு வரலாறு' : 'My Farmgate Vehicle Bookings'}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-light border rounded-pill px-3"
              onClick={() => setShowHistory(false)}
            >
              {language === 'ta' ? 'மறைக்க' : 'Hide'}
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small text-uppercase text-muted">
                <tr>
                  <th>Booking ID</th>
                  <th>Vehicle & Driver</th>
                  <th>Pickup → Dropoff</th>
                  <th>Cargo</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="font-monospace fw-bold text-primary">{b.id}</span>
                      <div className="text-muted" style={{ fontSize: '0.70rem' }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{b.vehicleName}</div>
                      <div className="text-muted small">
                        {b.driver.name} • <span className="font-monospace">{b.regNumber}</span>
                      </div>
                    </td>
                    <td className="small">
                      <div className="text-truncate" style={{ maxWidth: '220px' }}>
                        <i className="bi bi-geo-alt text-success me-1"></i>
                        {b.pickupLocation}
                      </div>
                      <div className="text-truncate text-muted" style={{ maxWidth: '220px' }}>
                        <i className="bi bi-flag text-danger me-1"></i>
                        {b.dropoffLocation}
                      </div>
                    </td>
                    <td className="small">
                      <span className="fw-semibold text-dark">{b.cargoName}</span>
                      <div className="text-muted">{b.weightKg} kg</div>
                    </td>
                    <td>
                      <span className="fw-bold font-monospace text-dark">₹{b.fare}</span>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-2 py-1 small fw-bold ${
                          b.status === 'PENDING'
                            ? 'bg-warning text-dark'
                            : b.status === 'ACCEPTED'
                            ? 'bg-success text-white'
                            : b.status === 'DECLINED'
                            ? 'bg-danger text-white'
                            : 'bg-primary text-white'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'PENDING' && (
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm py-0 px-2"
                            title="Simulate driver accept"
                            onClick={() => handleSimulateStatus(b.id, 'ACCEPTED')}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-0 px-2"
                            title="Simulate driver decline"
                            onClick={() => handleSimulateStatus(b.id, 'DECLINED')}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {b.status === 'ACCEPTED' && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                          OTP: <strong>{b.pickupOtp}</strong>
                        </span>
                      )}
                      {b.status === 'DECLINED' && (
                        <span className="small text-danger">{b.declineReason || 'Declined'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {activeModalVehicle && (
        <BookVehicleModal
          vehicle={activeModalVehicle}
          isOpen={!!activeModalVehicle}
          onClose={() => setActiveModalVehicle(null)}
          onBookingSuccess={(b) => {
            setBookings(getStoredVehicleBookings());
          }}
        />
      )}
    </section>
  );
}
