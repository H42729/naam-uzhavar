/**
 * Driver Profile & Vehicle Credentials Page
 * Route: /driver/profile
 * Manages driver license credentials, commercial badges, vehicle registration, and payout preferences.
 * Includes interactive View/Edit mode with an explicit Edit Profile button and persistent storage.
 */

import React, { useState, useEffect } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { DRIVER_PROFILE } from '../../data/driverData';
import { useLanguage } from '../../context/LanguageContext';

export default function DriverProfilePage() {
  const { language } = useLanguage();

  // Load profile from localStorage with fallback
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_profile_data');
      return saved ? JSON.parse(saved) : DRIVER_PROFILE;
    } catch {
      return DRIVER_PROFILE;
    }
  });

  // Stored baseline for cancel reset
  const [savedBaseline, setSavedBaseline] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatar presets for quick selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ];

  const handleStartEdit = () => {
    setSavedBaseline({ ...profile });
    setIsEditing(true);
    setSavedSuccess(false);
  };

  const handleCancel = () => {
    setProfile({ ...savedBaseline });
    setIsEditing(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('naam_uzhavar_driver_profile_data', JSON.stringify(profile));
      setSavedBaseline({ ...profile });
      setSavedSuccess(true);
      setIsEditing(false);
      // Dispatch storage event to immediately update LogisticsTopNav capsule
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save driver profile:', err);
    }
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar with explicit Edit Profile button */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'சான்றுகள் மற்றும் வாகனம்' : 'Credentials & Vehicle'}
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">
              {language === 'ta' ? 'ஓட்டுநர் சுயவிவரம்' : 'Driver Profile'}
            </h1>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
              <i className="bi bi-patch-check-fill me-1"></i> RTO & FPO Verified
            </span>

            {/* Edit / Save Action Buttons */}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-xs transition"
                title="Edit driver profile details"
              >
                <i className="bi bi-pencil-square"></i>
                <span>{language === 'ta' ? 'சுயவிவரத்தைத் திருத்து' : 'Edit Profile'}</span>
              </button>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1.5 transition"
                >
                  <i className="bi bi-x-circle"></i>
                  <span>{language === 'ta' ? 'ரத்து செய்' : 'Cancel'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-success text-white rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-xs transition"
                >
                  <i className="bi bi-check2-circle"></i>
                  <span>{language === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3 shadow-xs">
            <i className="bi bi-check-circle-fill fs-5 text-success"></i>
            <div>
              <strong>{language === 'ta' ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது!' : 'Profile Updated Successfully!'}</strong>
              <div className="small">
                {language === 'ta'
                  ? 'உங்கள் விவரங்கள் மாற்றப்பட்டு சேமிக்கப்பட்டுள்ளன.'
                  : 'Changes have been saved to your Naam Uzhavar driver profile and header.'}
              </div>
            </div>
          </div>
        )}

        {/* Editing indicator pill */}
        {isEditing && (
          <div className="alert alert-info d-flex align-items-center justify-content-between gap-2 mb-4 rounded-3 border-info-subtle">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-info-circle-fill text-primary"></i>
              <span className="small">
                {language === 'ta'
                  ? 'நீங்கள் தற்போது திருத்தும் பயன்முறையில் உள்ளீர்கள். மாற்றங்களைச் செய்துவிட்டு "சேமிக்கவும்" பொத்தானைக் கிளிக் செய்யவும்.'
                  : 'You are in Edit Mode. Update any credentials, contact, or payout fields below and click "Save Changes".'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-sm btn-primary rounded-pill px-3 fw-bold flex-shrink-0"
            >
              {language === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}
            </button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Driver Info & License */}
            <div className="col-12 col-lg-6">
              {/* Driver ID Card */}
              <div className="drv-card mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="rounded-circle object-fit-cover shadow-sm"
                      style={{ width: '72px', height: '72px', border: '3px solid #10b981' }}
                    />
                    <div>
                      <h2 className="fs-5 fw-bold text-dark mb-1">
                        {profile.name} <span className="text-muted fs-6 fw-normal">({profile.tamilName})</span>
                      </h2>
                      <div className="d-flex align-items-center gap-1.5 flex-wrap">
                        <span className="badge bg-light text-dark font-monospace border small">
                          ID: {profile.driverId}
                        </span>
                        <span className="badge bg-warning-subtle text-warning-emphasis small">
                          ★ {profile.rating || 4.9} (184 Trips)
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      {language === 'ta' ? 'திருத்து' : 'Edit'}
                    </button>
                  )}
                </div>

                {/* Avatar selector when editing */}
                {isEditing && (
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <label className="form-label small fw-bold text-dark mb-2">
                      <i className="bi bi-image me-1"></i>
                      {language === 'ta' ? 'சுயவிவரப் படம் தேர்வு' : 'Choose Profile Avatar'}
                    </label>
                    <div className="d-flex items-center gap-2 mb-2">
                      {avatarPresets.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Preset"
                          onClick={() => setProfile({ ...profile, avatar: img })}
                          className={`rounded-circle cursor-pointer object-fit-cover transition-all ${
                            profile.avatar === img ? 'ring-3 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="Or enter custom image URL..."
                      value={profile.avatar}
                      onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                    />
                  </div>
                )}

                <div className="row g-3">
                  {/* Name (English) */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'ஓட்டுநர் பெயர் (ஆங்கிலம்)' : 'Driver Name (English)'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  {/* Name (Tamil) */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'ஓட்டுநர் பெயர் (தமிழ்)' : 'Driver Name (Tamil)'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.tamilName}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, tamilName: e.target.value })}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>

                  {/* License */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'வணிக ஓட்டுநர் உரிம எண்' : 'Commercial DL No.'}
                    </label>
                    <input
                      type="text"
                      className={`form-control font-monospace ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.licenseNumber}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                    />
                  </div>

                  {/* DL Validity */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'உரிம செல்லுபடியாகும் காலம்' : 'DL Validity'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.licenseValidity}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, licenseValidity: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payout & Bank Details */}
              <div className="drv-card">
                <div className="drv-card-title">
                  <span>
                    <i className="bi bi-bank me-1 text-primary"></i>{' '}
                    {language === 'ta' ? 'வங்கி மற்றும் UPI அமைப்புகள்' : 'PAYOUT & UPI SETTINGS'}
                  </span>
                  <span className="badge bg-success-subtle text-success small">Direct Deposit</span>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted mb-1">
                    {language === 'ta' ? 'இணைக்கப்பட்ட வங்கிக் கணக்கு' : 'Linked Bank Account'}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                    value={profile.bankAccount}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small fw-bold text-muted mb-1">
                    {language === 'ta' ? 'முதன்மை UPI ஐடி' : 'Primary UPI ID for Instant Payouts'}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                    value={profile.upiId}
                    disabled={!isEditing}
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
                    <i className="bi bi-truck me-1 text-warning"></i>{' '}
                    {language === 'ta' ? 'பதிவு செய்யப்பட்ட வாகன விவரங்கள்' : 'REGISTERED VEHICLE SPECS'}
                  </span>
                  <span className="badge bg-light text-dark font-monospace border small">
                    TN-57-AB-4029
                  </span>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'வாகன மாதிரி' : 'Vehicle Model'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.vehicleModel}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, vehicleModel: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'சுமை திறன்' : 'Payload Capacity'}
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value="750 kg Max Payload"
                      disabled
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'காப்பீடு செல்லுபடியாகும் காலம்' : 'Insurance Valid Till'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.insuranceValidity}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, insuranceValidity: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      {language === 'ta' ? 'தகுதிச் சான்றிதழ் (FC)' : 'FC (Fitness Cert.) Valid Till'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${isEditing ? 'bg-white border-primary' : 'bg-light'}`}
                      value={profile.fcValidity}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, fcValidity: e.target.value })}
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
                    <i className="bi bi-signpost-split me-1 text-primary"></i>{' '}
                    {language === 'ta' ? 'விருப்பமான மாவட்ட வழிகள்' : 'PREFERRED DISTRICT CORRIDORS'}
                  </span>
                </div>

                <p className="text-muted small mb-3">
                  {language === 'ta'
                    ? 'முன்னுரிமை பண்ணை எடுப்பு எச்சரிக்கைகளைப் பெற விரும்பும் மாவட்டங்களைத் தேர்ந்தெடுக்கவும்.'
                    : 'Choose districts where you wish to receive priority farm pickup dispatch alerts.'}
                </p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {(profile.preferredDistricts || ['Dindigul', 'Madurai', 'Theni', 'Trichy']).map((dist, idx) => (
                    <span
                      key={idx}
                      className="badge bg-success text-white py-2 px-3 rounded-pill fs-6 fw-semibold"
                    >
                      <i className="bi bi-geo-alt-fill me-1 small"></i> {dist}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <button type="button" onClick={handleSave} className="drv-btn drv-btn-primary w-100 py-3">
                    <i className="bi bi-save-fill me-1"></i>{' '}
                    {language === 'ta' ? 'அமைப்புகளைச் சேமிக்கவும்' : 'Save Profile Settings'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </DriverLayout>
  );
}
