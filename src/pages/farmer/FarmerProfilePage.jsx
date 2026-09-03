/**
 * Farmer Profile Page
 * Route: /farmer/profile
 * Displays farmer details, masked Aadhaar, Patta land verification, Dindigul location, and credentials.
 */

import React, { useState } from 'react';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerProfilePage() {
  const { farmerProfile, setFarmerProfile, showToast } = useFarmer();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(farmerProfile);
  const [profileError, setProfileError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!profile.name?.trim()) {
      setProfileError(t('nameRequired'));
      return;
    }
    if (!profile.phone?.trim() || profile.phone.trim().length < 10) {
      setProfileError(t('phoneRequired'));
      return;
    }
    if (!profile.taluk?.trim()) {
      setProfileError(t('talukRequired'));
      return;
    }
    if (!profile.address?.trim()) {
      setProfileError(t('addressRequired'));
      return;
    }

    setProfileError('');
    setFarmerProfile(profile);
    setIsEditing(false);
    showToast(t('profileUpdatedTitle'), t('profileUpdatedDesc'), 'success');
  };

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {t('accountLandHoldings')}
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('farmerProfileTitle')}</h1>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
              <i className="bi bi-patch-check-fill me-1"></i> {t('fpoVerifiedFarmer')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Farmer Credentials */}
            <div className="col-12 col-lg-5">
              {/* Profile Card */}
              <div className="p-4 bg-white rounded-4 border shadow-xs text-center mb-4">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{ width: '100px', height: '100px', border: '3px solid #10b981' }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-xs"
                    style={{ width: '28px', height: '28px' }}
                    title="Verified Farmer"
                  >
                    <i className="bi bi-check-lg small"></i>
                  </span>
                </div>

                <h2 className="fs-4 fw-bold text-dark mb-1">
                  {language === 'ta' ? profile.tamilName : profile.name}
                </h2>

                <span className="text-muted small d-block mb-3">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {profile.village}, {profile.district}, {profile.state}
                </span>

                <div className="p-3 bg-light rounded-3 border text-start small mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t('verificationStatus')}</span>
                    <strong className="text-success">{t('govFpoVerified')}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t('maskedAadhaar')}</span>
                    <strong className="text-dark font-monospace">{profile.maskedAadhaar}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{t('pattaLandStatus')}</span>
                    <span className="badge bg-success-subtle text-success">{profile.pattaStatus || 'e-Patta Verified'}</span>
                  </div>
                </div>

                <div className="text-muted small">
                  {t('memberOf')} <strong>{profile.fpoMembership}</strong>
                </div>
              </div>

              {/* Bank & Payout Summary */}
              <div className="p-4 bg-white rounded-4 border shadow-xs">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <strong className="text-dark fs-6">
                    <i className="bi bi-bank me-2 text-primary"></i> {t('directMandiSettlement')}
                  </strong>
                  <span className="badge bg-success-subtle text-success small">{t('impsActive')}</span>
                </div>

                <div className="small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t('linkedBankAccount')}</span>
                    <strong className="text-dark font-monospace">SBI Nilakottai (**** 5542)</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t('primaryUpiId')}</span>
                    <strong className="text-dark font-monospace">arun.farmer@oksbi</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{t('paymentGuarantee')}</span>
                    <strong className="text-success">{t('escrowProtected')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editable Profile Fields */}
            <div className="col-12 col-lg-7">
              <div className="p-4 bg-white rounded-4 border shadow-xs">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <strong className="text-dark fs-5">{t('personalFarmDetails')}</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil'} me-1`}></i>
                    <span>{isEditing ? t('cancel') : t('editProfile')}</span>
                  </button>
                </div>

                {/* Profile Validation Error */}
                {profileError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 py-2 px-3 small fw-bold">
                    <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                    <span>{profileError}</span>
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('farmerFullName')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('primaryPhone')}</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('district')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.district}
                      disabled
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('taluk')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.taluk}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, taluk: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">{t('farmGateAddress')}</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={profile.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('maskedAadhaarGovt')}</label>
                    <input
                      type="text"
                      className="form-control font-monospace bg-light"
                      value={profile.maskedAadhaar}
                      disabled
                    />
                    <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                      {t('aadhaarSecurityNote')}
                    </span>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">{t('pattaVerification')}</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={profile.pattaStatus}
                      disabled
                    />
                    <span className="text-success small" style={{ fontSize: '0.7rem' }}>
                      <i className="bi bi-check-circle-fill me-1"></i> {t('pattaPortalVerified')}
                    </span>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">{t('cultivatedLand')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.landSize}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, landSize: e.target.value })}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light border px-4 rounded-pill fw-bold"
                      onClick={() => setIsEditing(false)}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success px-4 rounded-pill fw-bold shadow-xs"
                    >
                      <i className="bi bi-save-fill me-1"></i> {t('saveChanges')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </FarmerLayout>
  );
}
