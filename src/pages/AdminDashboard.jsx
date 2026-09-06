import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [approvedIds, setApprovedIds] = useState(new Set());

  const handleApprove = (id) => {
    setApprovedIds((prev) => new Set([...prev, id]));
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Admin Header */}
      <header className="bg-white border-bottom py-3 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            />
            <span className="badge bg-dark ms-2">{t('admin')} Portal</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <LanguageSwitcher />
            <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-house-door me-1"></i> {t('navHome')}
            </Link>
            <div className="d-flex align-items-center gap-2 ps-2 border-start">
              <span className="fw-bold small text-dark">{user?.name || 'Administrator'}</span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                onClick={handleLogout}
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark fs-3 mb-1">APMC & Platform Operations Control</h1>
            <p className="text-muted small mb-0">Platform Overview, Farmer KYC Verification & Mandi Price Regulation</p>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6">
            ● All 14 Mandi Clusters Live
          </span>
        </div>

        {/* 4 Admin Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="bg-white rounded-4 border p-3 shadow-sm">
              <div className="text-muted small fw-bold text-uppercase">Verified Farmers</div>
              <div className="fs-3 fw-bold text-dark mt-1">{(2840 + approvedIds.size).toLocaleString()}</div>
              <div className="small text-success">+{34 - approvedIds.size} pending KYC approval</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white rounded-4 border p-3 shadow-sm">
              <div className="text-muted small fw-bold text-uppercase">Active B2B Buyers</div>
              <div className="fs-3 fw-bold text-primary mt-1">418</div>
              <div className="small text-muted">Supermarkets & Retailers</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white rounded-4 border p-3 shadow-sm">
              <div className="text-muted small fw-bold text-uppercase">GMV Traded Today</div>
              <div className="fs-3 fw-bold text-success mt-1">₹14.8 Lakhs</div>
              <div className="small text-success">100% Instant UPI Payouts</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white rounded-4 border p-3 shadow-sm">
              <div className="text-muted small fw-bold text-uppercase">AI Price Compliance</div>
              <div className="fs-3 fw-bold text-info-emphasis mt-1">98.4%</div>
              <div className="small text-success">Within Fair Mandi Bands</div>
            </div>
          </div>
        </div>

        {/* Farmer KYC Verification Table */}
        <div className="bg-white rounded-4 border p-4 shadow-sm">
          <h5 className="fw-bold text-dark mb-3">Pending Farmer KYC & Land Record Verifications</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th>Farmer ID</th>
                  <th>Name</th>
                  <th>District / Mandi</th>
                  <th>Patta / Land Size</th>
                  <th>Primary Crop</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-monospace fw-bold">#TN-FRM-8491</td>
                  <td>Murugesan P.</td>
                  <td>Sathyamangalam, Erode</td>
                  <td>4.5 Acres (Verified)</td>
                  <td>Turmeric & Banana</td>
                  <td>
                    {approvedIds.has('TN-FRM-8491') ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-bold">
                        <i className="bi bi-check-circle-fill me-1"></i> KYC Approved
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm btn-success fw-bold px-3 shadow-xs"
                        onClick={() => handleApprove('TN-FRM-8491')}
                      >
                        Approve KYC
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="font-monospace fw-bold">#TN-FRM-8492</td>
                  <td>Kavitha Sundaram</td>
                  <td>Pollachi, Coimbatore</td>
                  <td>6.0 Acres (Verified)</td>
                  <td>Coconut & Spices</td>
                  <td>
                    {approvedIds.has('TN-FRM-8492') ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-bold">
                        <i className="bi bi-check-circle-fill me-1"></i> KYC Approved
                      </span>
                    ) : (
                      <button
                        className="btn btn-sm btn-success fw-bold px-3 shadow-xs"
                        onClick={() => handleApprove('TN-FRM-8492')}
                      >
                        Approve KYC
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
