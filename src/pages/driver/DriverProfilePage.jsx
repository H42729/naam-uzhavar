/**
 * Driver Profile & Vehicle Credentials Page
 * Route: /driver/profile
 * Manages driver license credentials, commercial badges, vehicle registration, and payout preferences.
 */

import React, { useState } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { DRIVER_PROFILE } from '../../data/driverData';

export default function DriverProfilePage() {
  const [profile, setProfile] = useState(DRIVER_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Credentials & Vehicle
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">Driver Profile</h1>
          </div>

          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-patch-check-fill me-1"></i> RTO & FPO Verified Driver
          </span>
        </div>

        {savedSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3 shadow-xs">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <div>
              <strong>Profile Updated!</strong>
              <div className="small">Changes saved to your Naam Uzhavar driver profile.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Driver Info & License */}
            <div className="col-12 col-lg-6">
              {/* Driver ID Card */}
              <div className="drv-card mb-4">
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{ width: '70px', height: '70px', border: '3px solid #10b981' }}
                  />
                  <div>
                    <h2 className="fs-5 fw-bold text-dark mb-1">
                      {profile.name} <span className="text-muted fs-6 fw-normal">({profile.tamilName})</span>
                    </h2>
                    <span className="badge bg-light text-dark font-monospace border small me-2">
                      ID: {profile.driverId}
                    </span>
                    <span className="badge bg-warning-subtle text-warning-emphasis small">
                      ★ {profile.rating} (184 Trips)
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Commercial DL No.</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={profile.licenseNumber}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">DL Validity</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.licenseValidity}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Payout & Bank Details */}
              <div className="drv-card">
                <div className="drv-card-title">
                  <span>
                    <i className="bi bi-bank me-1 text-primary"></i> PAYOUT & UPI SETTINGS
                  </span>
                  <span className="badge bg-success-subtle text-success small">Direct Deposit</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">Linked Bank Account</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.bankAccount}
                    onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted mb-1">Primary UPI ID for Instant Payouts</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.upiId}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Vehicle & Documents */}
            <div className="col-12 col-lg-6">
              {/* Vehicle Registration Card */}
              <div className="drv-card mb-4">
                <div className="drv-card-title">
                  <span>
                    <i className="bi bi-truck me-1 text-warning"></i> REGISTERED VEHICLE SPECS
                  </span>
                  <span className="badge bg-light text-dark font-monospace border small">
                    TN-57-AB-4029
                  </span>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Vehicle Model</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.vehicleModel}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Payload Capacity</label>
                    <input
                      type="text"
                      className="form-control"
                      value="750 kg Max Payload"
                      disabled
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">Insurance Valid Till</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.insuranceValidity}
                      disabled
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">FC (Fitness Cert.) Valid Till</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.fcValidity}
                      disabled
                    />
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 border mt-3 small">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-muted">Fastag Active:</span>
                    <strong className="text-success">Yes (NHAI Verified)</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">Cold-Chain Ventilator:</span>
                    <strong className="text-dark">Installed & Calibrated</strong>
                  </div>
                </div>
              </div>

              {/* Corridor Preferences */}
              <div className="drv-card">
                <div className="drv-card-title">
                  <span>
                    <i className="bi bi-signpost-split me-1 text-primary"></i> PREFERRED DISTRICT CORRIDORS
                  </span>
                </div>

                <p className="text-muted small mb-3">
                  Choose districts where you wish to receive priority farm pickup dispatch alerts.
                </p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {profile.preferredDistricts.map((dist, idx) => (
                    <span
                      key={idx}
                      className="badge bg-success text-white py-2 px-3 rounded-pill fs-6 fw-semibold"
                    >
                      <i className="bi bi-geo-alt-fill me-1 small"></i> {dist}
                    </span>
                  ))}
                </div>

                <button type="submit" className="drv-btn drv-btn-primary w-100 py-3">
                  <i className="bi bi-save-fill me-1"></i> Save Profile Settings
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DriverLayout>
  );
}
