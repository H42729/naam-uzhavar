import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RegistrationSuccessModal
 * Displays clean confirmation upon successful frontend validation.
 * Displays the prepared payload ready for backend API integration.
 */
export default function RegistrationSuccessModal({
  isOpen,
  roleTitle = 'Farmer',
  roleKey = 'farmer',
  submittedData = {},
  onReset,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Prepare sanitized payload for backend API (strictly excludes confirmPassword)
  const { confirmPassword, ...apiPayload } = submittedData;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1060,
      }}
    >
      <div
        className="bg-white rounded-4 shadow-xl border overflow-hidden w-100"
        style={{
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="p-4 text-center text-white"
          style={{
            background: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
          }}
        >
          <div
            className="bg-white text-success rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '64px', height: '64px' }}
          >
            <i className="bi bi-check-lg fs-1 text-success"></i>
          </div>
          <h3 className="fw-bold mb-1 fs-4">{roleTitle} Registration Successful!</h3>
          <p className="small mb-0 text-white-75">
            Frontend validation passed. The account data is verified and formatted for backend dispatch.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-auto flex-grow-1" style={{ fontSize: '0.88rem' }}>
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-3 small">
            <i className="bi bi-info-circle-fill fs-5"></i>
            <div>
              <strong>Production Ready State:</strong> Ready to connect to <code>POST /api/auth/register/{roleKey}</code>.
            </div>
          </div>

          <div className="mb-3">
            <h6 className="fw-bold text-dark small text-uppercase mb-2">
              Registration Summary
            </h6>
            <div className="bg-light p-3 rounded-3 border">
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted d-block small">Name</span>
                  <strong className="text-dark">{apiPayload.name || '—'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block small">Phone</span>
                  <strong className="text-dark">{apiPayload.phone || '—'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block small">District</span>
                  <strong className="text-dark">{apiPayload.district || '—'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block small">Taluk</span>
                  <strong className="text-dark">{apiPayload.taluk || '—'}</strong>
                </div>
                {apiPayload.businessType && (
                  <div className="col-12">
                    <span className="text-muted d-block small">Business Type</span>
                    <strong className="text-dark">
                      {apiPayload.businessType}
                      {apiPayload.otherBusinessType ? ` (${apiPayload.otherBusinessType})` : ''}
                    </strong>
                  </div>
                )}
                {apiPayload.vehicleType && (
                  <div className="col-12">
                    <span className="text-muted d-block small">Vehicle</span>
                    <strong className="text-dark">
                      {apiPayload.vehicleType}
                      {apiPayload.otherVehicleType ? ` (${apiPayload.otherVehicleType})` : ''}
                    </strong>
                  </div>
                )}
                {apiPayload.drivingLicenceNumber && (
                  <div className="col-6">
                    <span className="text-muted d-block small">DL Number</span>
                    <strong className="text-dark">{apiPayload.drivingLicenceNumber}</strong>
                  </div>
                )}
                {apiPayload.rcBookNumber && (
                  <div className="col-6">
                    <span className="text-muted d-block small">RC Number</span>
                    <strong className="text-dark">{apiPayload.rcBookNumber}</strong>
                  </div>
                )}
                {apiPayload.pattaNumber && (
                  <div className="col-6">
                    <span className="text-muted d-block small">Patta Number</span>
                    <strong className="text-dark">{apiPayload.pattaNumber}</strong>
                  </div>
                )}
                {apiPayload.landArea && (
                  <div className="col-6">
                    <span className="text-muted d-block small">Land Area</span>
                    <strong className="text-dark">{apiPayload.landArea} Acres</strong>
                  </div>
                )}
                {apiPayload.gstin && (
                  <div className="col-6">
                    <span className="text-muted d-block small">GSTIN</span>
                    <strong className="text-dark">{apiPayload.gstin}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="small text-muted fw-bold text-uppercase">
                API Payload Preview (JSON)
              </span>
              <span className="badge bg-secondary-subtle text-secondary small">
                password hidden
              </span>
            </div>
            <pre
              className="bg-dark text-success p-3 rounded-3 small mb-0"
              style={{ maxHeight: '160px', overflowY: 'auto', fontSize: '0.78rem' }}
            >
              {JSON.stringify(
                {
                  ...apiPayload,
                  password: '••••••••',
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-light border-top d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-3 px-3 fw-semibold"
            onClick={onReset}
          >
            Register Another
          </button>
          <button
            type="button"
            className="btn btn-success btn-sm rounded-3 px-4 fw-bold"
            onClick={() => {
              const loginTarget = roleKey === 'driver' ? '/login' : `/login/${roleKey === 'consumer' ? 'buyer' : roleKey}`;
              navigate(loginTarget);
            }}
          >
            Proceed to Login <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
