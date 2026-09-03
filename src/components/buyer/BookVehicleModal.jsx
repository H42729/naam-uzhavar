import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  POPULAR_PICKUP_POINTS,
  POPULAR_DROPOFF_POINTS
} from '../../data/vehicleData';
import {
  createVehicleBookingRequest,
  updateBookingStatus
} from '../../services/vehicleBookingService';

export default function BookVehicleModal({
  vehicle,
  isOpen,
  onClose,
  onBookingSuccess
}) {
  const { t, language } = useLanguage();

  const [pickupLocation, setPickupLocation] = useState(POPULAR_PICKUP_POINTS[0].name);
  const [dropoffLocation, setDropoffLocation] = useState(POPULAR_DROPOFF_POINTS[0].name);
  const [cargoName, setCargoName] = useState('Tomato Grade-A');
  const [weightKg, setWeightKg] = useState(350);
  const [pickupTime, setPickupTime] = useState('immediate');
  const [notes, setNotes] = useState('');

  // Booking Flow States: 'FORM' | 'WAITING' | 'ACCEPTED' | 'DECLINED'
  const [step, setStep] = useState('FORM');
  const [currentBooking, setCurrentBooking] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('FORM');
      setCurrentBooking(null);
      setCountdown(3);
      setErrorMsg('');
      setWeightKg(Math.min(350, vehicle ? vehicle.capacityKg : 500));
    }
  }, [isOpen, vehicle]);

  // Handle automatic driver acceptance simulation after 3s if still in WAITING state
  useEffect(() => {
    let timer;
    if (step === 'WAITING' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 'WAITING' && countdown === 0) {
      // Auto-accept by default for smooth UX
      handleSimulateResponse('ACCEPTED');
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen || !vehicle) return null;

  // Calculate estimated fare
  const selectedDropoff = POPULAR_DROPOFF_POINTS.find((d) => d.name === dropoffLocation);
  const estDistanceKm = selectedDropoff ? selectedDropoff.distanceKm : 25;
  const calculatedFare = vehicle.baseFare + Math.round(estDistanceKm * vehicle.ratePerKm);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(weightKg) > vehicle.capacityKg) {
      setErrorMsg(
        language === 'ta'
          ? `சுமை எடை வாகன கொள்ளளவை விட அதிகமாக உள்ளது (${vehicle.capacityKg} kg).`
          : `Cargo load exceeds vehicle capacity of ${vehicle.capacityKg} kg.`
      );
      return;
    }

    setErrorMsg('');
    const booking = createVehicleBookingRequest({
      vehicle,
      pickupLocation,
      dropoffLocation,
      cargoName,
      weightKg,
      pickupTime: pickupTime === 'immediate' ? 'Immediate Dispatch (15 mins)' : 'Scheduled Morning',
      fare: calculatedFare
    });

    setCurrentBooking(booking);
    setStep('WAITING');
    setCountdown(3);
  };

  const handleSimulateResponse = (status) => {
    if (!currentBooking) return;
    const updated = updateBookingStatus(
      currentBooking.id,
      status,
      status === 'DECLINED' ? 'Driver is currently engaged on another farmgate pickup.' : null
    );
    setCurrentBooking(updated);
    setStep(status);
    if (onBookingSuccess) {
      onBookingSuccess(updated);
    }
  };

  return createPortal(
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        margin: 0,
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg w-100"
        style={{ maxHeight: '92vh', maxWidth: 'min(92vw, 840px)', margin: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden d-flex flex-column" style={{ maxHeight: '92vh' }}>
          {/* Header */}
          <div
            className="modal-header border-0 text-white p-4"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)'
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 bg-white bg-opacity-20 d-flex align-items-center justify-content-center p-2 text-white"
                style={{ width: '48px', height: '48px' }}
              >
                <i className={`bi ${vehicle.icon || 'bi-truck'} fs-3`}></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">
                  {language === 'ta' ? 'சரக்கு வாகனம் முன்பதிவு' : 'Book Farmgate Vehicle'}
                </h5>
                <p className="mb-0 text-white text-opacity-80 small">
                  {language === 'ta' ? vehicle.tamilName : vehicle.name} • {vehicle.regNumber}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-3 p-md-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* ==============================================================
                STEP 1: BOOKING FORM
               ============================================================== */}
            {step === 'FORM' && (
              <form onSubmit={handleSubmit}>
                {/* Vehicle Quick Summary Card */}
                <div className="p-3 bg-light rounded-3 border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={vehicle.driver.avatar}
                      alt={vehicle.driver.name}
                      className="rounded-circle object-fit-cover shadow-xs"
                      style={{ width: '48px', height: '48px', border: '2px solid #2563eb' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <strong className="text-dark fs-6">
                          {language === 'ta' ? vehicle.driver.tamilName : vehicle.driver.name}
                        </strong>
                        <span className="badge bg-warning text-dark px-2 py-0 small fw-bold">
                          ★ {vehicle.driver.rating}
                        </span>
                      </div>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {language === 'ta' ? vehicle.tamilLocationName : vehicle.locationName} ({vehicle.distanceKm} km {language === 'ta' ? 'தொலைவு' : 'away'})
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 text-end">
                    <div>
                      <span className="text-muted small d-block">{language === 'ta' ? 'அதிகபட்ச சுமை' : 'Max Payload'}</span>
                      <strong className="text-primary fs-6">{vehicle.capacityLabel}</strong>
                    </div>
                    {vehicle.isRefrigerated && (
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle p-2">
                        <i className="bi bi-snow me-1"></i> {language === 'ta' ? 'குளிர்பதனம்' : 'Cold-Chain'}
                      </span>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 small fw-bold rounded-3 mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMsg}
                  </div>
                )}

                <div className="row g-3">
                  {/* Pickup Point */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      <i className="bi bi-geo-alt text-success me-1"></i>
                      {language === 'ta' ? 'ஏற்றுமதி இடம் (பண்ணை / மண்டி)' : 'Pickup Point (Farm / Mandi)'}
                    </label>
                    <select
                      className="form-select py-2"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    >
                      {POPULAR_PICKUP_POINTS.map((pt) => (
                        <option key={pt.id} value={pt.name}>
                          {pt.name} ({pt.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropoff Point */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      <i className="bi bi-flag text-danger me-1"></i>
                      {language === 'ta' ? 'இறக்குமதி இடம் (கிடங்கு / வாங்குபவர்)' : 'Delivery Destination (Depot / Warehouse)'}
                    </label>
                    <select
                      className="form-select py-2"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                    >
                      {POPULAR_DROPOFF_POINTS.map((dp) => (
                        <option key={dp.id} value={dp.name}>
                          {dp.name} (~{dp.distanceKm} km)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cargo Produce Name */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'பயிரின் வகை' : 'Produce Cargo'}
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={cargoName}
                      onChange={(e) => setCargoName(e.target.value)}
                      placeholder="e.g. Tomato Country Fresh, Small Onion"
                      required
                    />
                  </div>

                  {/* Cargo Weight */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'சுமை எடை (கிலோ)' : 'Cargo Weight (kg)'}
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        min="50"
                        max={vehicle.capacityKg}
                        className="form-control py-2 font-monospace"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        required
                      />
                      <span className="input-group-text bg-light text-muted">kg</span>
                    </div>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      {language === 'ta' ? 'அதிகபட்சம்:' : 'Max limit:'} {vehicle.capacityKg} kg
                    </span>
                  </div>

                  {/* Dispatch Time */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'வாகன புறப்பாடு நேரம்' : 'Pickup Schedule'}
                    </label>
                    <select
                      className="form-select py-2"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    >
                      <option value="immediate">
                        ⚡ {language === 'ta' ? 'உடனடி புறப்பாடு (15 நிமிடங்களில்)' : 'Immediate Dispatch (within 15 mins)'}
                      </option>
                      <option value="scheduled">
                        📅 {language === 'ta' ? 'நாளை காலை (காலை 6:00 மணி)' : 'Tomorrow Morning (6:00 AM Harvest Batch)'}
                      </option>
                    </select>
                  </div>

                  {/* Fare Estimate Card */}
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'மதிப்பிடப்பட்ட கட்டணம்' : 'Estimated Trip Fare'}
                    </label>
                    <div className="p-2 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25 d-flex align-items-center justify-content-between">
                      <div>
                        <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                          ₹{vehicle.baseFare} base + ~{estDistanceKm}km @ ₹{vehicle.ratePerKm}/km
                        </span>
                        <strong className="text-primary fs-5 font-monospace">₹{calculatedFare}</strong>
                      </div>
                      <span className="badge bg-primary px-3 py-2 rounded-pill">
                        {language === 'ta' ? 'நேரடி கட்டணம்' : 'Zero Surcharge'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light px-4 rounded-pill fw-bold border"
                    onClick={onClose}
                  >
                    {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                    style={{ backgroundColor: '#2563eb' }}
                  >
                    <i className="bi bi-send-fill"></i>
                    <span>{language === 'ta' ? 'முன்பதிவு கோரிக்கையை அனுப்பு' : 'Send Booking Request'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ==============================================================
                STEP 2: WAITING FOR DRIVER CONFIRMATION
               ============================================================== */}
            {step === 'WAITING' && (
              <div className="text-center py-4">
                <div className="position-relative d-inline-block mb-3">
                  <div
                    className="spinner-grow text-primary"
                    style={{ width: '4rem', height: '4rem' }}
                    role="status"
                  ></div>
                  <div
                    className="position-absolute top-50 start-50 translate-middle bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <i className="bi bi-broadcast"></i>
                  </div>
                </div>

                <h4 className="fw-bold text-dark mb-1">
                  {language === 'ta' ? 'ஓட்டுநரின் உறுதிப்படுத்தலுக்காக காத்திருக்கிறது...' : 'Contacting Driver & Waiting for Confirmation...'}
                </h4>
                <p className="text-muted small mb-3">
                  {language === 'ta'
                    ? `${vehicle.driver.tamilName} (${vehicle.tamilName}) அவர்களின் மொபைல் பயன்பாட்டிற்கு முன்பதிவு கோரிக்கை அனுப்பப்பட்டது.`
                    : `Booking request sent to ${vehicle.driver.name} (${vehicle.name}). Auto-confirming in ${countdown}s.`}
                </p>

                {/* Simulation Control Callout */}
                <div className="p-3 bg-light rounded-3 border d-inline-block text-center mb-3" style={{ maxWidth: '480px' }}>
                  <span className="badge bg-secondary text-white text-uppercase px-2 py-1 mb-2 small fw-bold">
                    Demo Interactive Testing Controls
                  </span>
                  <p className="small text-muted mb-2">
                    {language === 'ta'
                      ? 'ஓட்டுநரின் பதிலைப் பரிசோதிக்க கீழே உள்ள பொத்தானை கிளிக் செய்யவும்:'
                      : 'Test both live driver responses by clicking below:'}
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1 shadow-xs"
                      onClick={() => handleSimulateResponse('ACCEPTED')}
                    >
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Simulate Accept (ஏற்கப்பட்டது)</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1 shadow-xs"
                      onClick={() => handleSimulateResponse('DECLINED')}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                      <span>Simulate Decline (நிராகரிக்கப்பட்டது)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 3: DRIVER ACCEPTED
               ============================================================== */}
            {step === 'ACCEPTED' && currentBooking && (
              <div className="text-center py-3">
                <div
                  className="rounded-circle bg-success text-white mx-auto d-flex align-items-center justify-content-center mb-3 shadow-md"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="bi bi-check-lg fs-1"></i>
                </div>

                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mb-2">
                  {language === 'ta' ? 'கோரிக்கை ஏற்கப்பட்டது' : 'Booking Request Accepted!'}
                </span>

                <h3 className="fw-black text-dark mb-1">
                  {language === 'ta' ? 'வாகனம் உறுதி செய்யப்பட்டது' : 'Vehicle Dispatched to Farmgate'}
                </h3>
                <p className="text-muted small mb-4">
                  {language === 'ta'
                    ? `${vehicle.driver.tamilName} உங்கள் முன்பதிவை ஏற்றுக்கொண்டு பண்ணைக்குப் புறப்பட்டுவிட்டார்.`
                    : `${vehicle.driver.name} has accepted your vehicle request and is en route to pickup point.`}
                </p>

                {/* Driver & Consignment Summary Box */}
                <div className="p-3 bg-success bg-opacity-10 rounded-4 border border-success border-opacity-25 text-start mb-4">
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={vehicle.driver.avatar}
                          alt={vehicle.driver.name}
                          className="rounded-circle object-fit-cover shadow-xs"
                          style={{ width: '56px', height: '56px', border: '2px solid #16a34a' }}
                        />
                        <div>
                          <div className="fw-bold text-dark fs-6">
                            {language === 'ta' ? vehicle.driver.tamilName : vehicle.driver.name}
                          </div>
                          <div className="text-muted small">{vehicle.name} • <strong className="text-dark font-monospace">{vehicle.regNumber}</strong></div>
                          <span className="text-success small fw-bold">
                            <i className="bi bi-clock-history me-1"></i> ETA: ~{vehicle.etaMins} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 text-md-end">
                      <div className="small text-muted">{language === 'ta' ? 'ஏற்றுமதி பாதுகாப்பு OTP' : 'Pickup Verification OTP'}</div>
                      <div className="fs-3 fw-black font-monospace text-primary letter-spacing-1">
                        {currentBooking.pickupOtp}
                      </div>
                      <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                        {language === 'ta' ? 'பொருட்கள் ஏற்றும்போது ஓட்டுநரிடம் பகிரவும்' : 'Share with driver at farm weighbridge'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a
                    href={`tel:${vehicle.driver.phone}`}
                    className="btn btn-outline-success fw-bold rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
                  >
                    <i className="bi bi-telephone-fill"></i>
                    <span>{language === 'ta' ? 'ஓட்டுநரை அழைக்கவும்' : 'Call Driver'} ({vehicle.driver.phone})</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary fw-bold rounded-pill px-4 py-2 shadow-xs"
                    onClick={onClose}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    <span>{language === 'ta' ? 'முடிந்தது' : 'Done & View Dashboard'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 4: DRIVER DECLINED
               ============================================================== */}
            {step === 'DECLINED' && (
              <div className="text-center py-4">
                <div
                  className="rounded-circle bg-danger-subtle text-danger mx-auto d-flex align-items-center justify-content-center mb-3 shadow-xs"
                  style={{ width: '64px', height: '64px' }}
                >
                  <i className="bi bi-x-circle fs-1"></i>
                </div>

                <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-bold mb-2">
                  {language === 'ta' ? 'முன்பதிவு நிராகரிக்கப்பட்டது' : 'Booking Request Declined'}
                </span>

                <h4 className="fw-bold text-dark mb-1">
                  {language === 'ta' ? 'ஓட்டுநர் தற்போது வேறு பயணத்தில் உள்ளார்' : 'Driver Is Currently Busy'}
                </h4>
                <p className="text-muted small mb-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
                  {language === 'ta'
                    ? `${vehicle.driver.tamilName} தற்போது மற்றொரு சரக்கு பணியில் உள்ளார். தயவுசெய்து அருகிலுள்ள மற்றொரு வாகனத்தை தேர்வு செய்யவும்.`
                    : `${vehicle.driver.name} is unable to accept this run because they are already loading another lot. Please choose another nearby vehicle.`}
                </p>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
                    onClick={onClose}
                  >
                    {language === 'ta' ? 'மூடுக' : 'Close'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 fw-bold shadow-xs"
                    onClick={() => setStep('FORM')}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>
                    <span>{language === 'ta' ? 'மீண்டும் முயற்சிக்கவும்' : 'Try Another Vehicle'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
