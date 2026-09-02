import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuyerNavbar({
  buyerName = 'FreshMart Procurement',
  onLogout,
  onToggleSidebar,
  sidebarOpen
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Supply Aggregated',
      desc: '3 farmers in Dindigul matched for 500 kg Tomato order.',
      time: '15m ago',
      badge: 'Order #FD1024',
      isNew: true
    },
    {
      id: 2,
      title: 'Consignment Dispatched',
      desc: 'Kumar Agro dispatched 350 kg Red Onions to Chennai Hub.',
      time: '1h ago',
      badge: 'In Transit',
      isNew: true
    },
    {
      id: 3,
      title: 'Fresh Harvest Listed',
      desc: 'Hill Fresh Farm listed 250 kg Grade-A Carrots in Kodaikanal.',
      time: '3h ago',
      badge: 'New Harvest',
      isNew: false
    }
  ];

  return (
    <>
      <header className="bd-navbar">
        {/* Left: Mobile Toggle + FarmDirect Brand Logo */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button
            type="button"
            className="bd-icon-btn d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>

          <div
            className="bd-brand d-flex align-items-center gap-2"
            onClick={() => navigate('/buyer/dashboard')}
            title="Naam Uzhavar Buyer Portal"
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small fw-bold d-none d-sm-inline-block">
              Buyer Portal
            </span>
          </div>
        </div>

        {/* Right: Notifications, Profile, and Logout */}
        <div className="bd-nav-right">
          {/* Notifications dropdown trigger */}
          <div className="position-relative">
            <button
              type="button"
              className="bd-icon-btn"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="bi bi-bell"></i>
              <span className="bd-notif-ping"></span>
            </button>

            {showNotifications && (
              <div
                className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-3"
                style={{ width: '330px', zIndex: 1050 }}
              >
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark small">🔔 Sourcing Notifications</span>
                    <span className="badge bg-success text-white rounded-pill" style={{ fontSize: '0.65rem' }}>
                      2 New
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                    onClick={() => setShowNotifications(false)}
                  >
                    <i className="bi bi-x fs-5"></i>
                  </button>
                </div>

                <div className="d-flex flex-column gap-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-2 border ${n.isNew ? 'bg-success-subtle border-success-subtle text-dark' : 'bg-light text-secondary'}`}
                      style={{ fontSize: '0.82rem' }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-dark">{n.title}</strong>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {n.time}
                        </span>
                      </div>
                      <p className="mb-1 text-secondary" style={{ fontSize: '0.78rem', lineHeight: '1.3' }}>
                        {n.desc}
                      </p>
                      <span className="badge bg-white text-success border border-success-subtle" style={{ fontSize: '0.68rem' }}>
                        {n.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buyer Profile Chip */}
          <div
            className="bd-user-chip"
            onClick={() => setShowProfileModal(true)}
            title="View Buyer KYC & Account Info"
          >
            <div className="bd-user-avatar">
              {buyerName.charAt(0).toUpperCase()}
            </div>
            <div className="d-none d-sm-block text-start">
              <div className="fw-bold text-dark" style={{ fontSize: '0.86rem', lineHeight: '1.2' }}>
                {buyerName}
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                Direct Farm Buyer
              </div>
            </div>
            <i className="bi bi-chevron-down text-muted small d-none d-sm-inline"></i>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="bd-btn bd-btn-outline bd-btn-sm text-danger"
            onClick={onLogout}
            title="Log Out of Buyer Portal"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="d-none d-md-inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Profile Detail Modal */}
      {showProfileModal && (
        <div className="bd-modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <h5 className="fw-bold mb-0">Buyer Account & KYC Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowProfileModal(false)}
              ></button>
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-2"
                style={{ width: '64px', height: '64px' }}
              >
                {buyerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-dark fs-5">{buyerName}</h6>
                <p className="text-muted small mb-1">Institutional Produce Procurement Entity</p>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  <i className="bi bi-shield-check me-1"></i> FSSAI & GST Verified
                </span>
              </div>
            </div>

            <div className="bg-light p-3 rounded-3 mb-3 small">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Primary Receiving Hub:</span>
                <span className="fw-bold text-dark">Chennai & Dindigul Central Distribution</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Procurement Scope:</span>
                <span className="fw-bold text-dark">Direct Farmer Lots (200kg - 10,000kg)</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Settlement Protocol:</span>
                <span className="fw-bold text-success">FarmDirect Escrow Direct Bank Payout</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">Platform Tier:</span>
                <span className="fw-bold text-dark">SIH 2026 Commercial Bulk Buyer</span>
              </div>
            </div>

            <div className="text-end">
              <button
                type="button"
                className="bd-btn bd-btn-outline bd-btn-sm"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
