import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import AddProductButton from './AddProductButton';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

export default function FarmerNavbar({ onToggleMobileSidebar, searchQuery = '', onSearchChange }) {
  const { user, logout } = useAuth();
  const { stats } = useFarmer();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="farm-top-navbar">
      {/* Left: Mobile Toggle & Brand/Search */}
      <div className="d-flex align-items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="btn btn-light d-lg-none border-0 p-2 text-dark rounded-circle"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Small Brand on Mobile */}
        <div
          className="d-flex align-items-center d-lg-none cursor-pointer"
          onClick={() => navigate('/farmer/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <img
            src="/naam-uzhavar-logo-transparent.png"
            alt="Naam Uzhavar"
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Search Bar for Desktop/Tablet */}
        <div className="farm-search-box d-none d-md-block">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="farm-search-input"
            placeholder="Search products, consumer requests, orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="farm-top-actions">
        {/* Prominent Primary CTA: Add Product with Click Animation */}
        <AddProductButton responsive={true} />

        {/* Notifications Dropdown */}
        <div className="position-relative">
          <button
            type="button"
            className="nu-icon-btn"
            title="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <i className="bi bi-bell-fill text-muted"></i>
            {stats.pendingRequests > 0 && <span className="nu-notif-badge"></span>}
          </button>

          {notificationsOpen && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded-4 border shadow-lg p-3 farm-animate-fade"
              style={{ width: '320px', zIndex: 1060 }}
            >
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-2">
                <span className="fw-bold text-dark small">🔔 Farmer Alerts &amp; Requests</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                  onClick={() => setNotificationsOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="d-flex flex-column gap-2 small">
                {stats.pendingRequests > 0 ? (
                  <div
                    className="p-2 bg-warning-subtle text-warning-emphasis rounded-3 cursor-pointer"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate('/farmer/requests');
                    }}
                  >
                    <strong>{stats.pendingRequests} New Consumer Request(s)!</strong> Fresh buyers
                    are awaiting your quote or confirmation.
                  </div>
                ) : (
                  <div className="p-2 bg-light text-muted rounded-3 text-center">
                    No pending requests right now.
                  </div>
                )}

                <div className="p-2 bg-success-subtle text-success-emphasis rounded-3">
                  <strong>Market Rate Update:</strong> Erode Mandi Tomato rates surging (+18%).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Public Site Link */}
        <button
          type="button"
          className="nu-btn-public-site d-none d-lg-inline-flex"
          onClick={() => navigate('/')}
        >
          <i className="bi bi-globe2"></i>
          <span>Public Site</span>
        </button>

        {/* User Chip & Logout */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <Link to="/farmer/profile" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt="Farmer avatar"
              className="rounded-circle border"
              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
            />
            <span className="fw-bold small d-none d-xl-inline">
              {user?.name?.split(' ')[0] || 'Ravi'}
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle text-danger p-1"
            title="Log Out"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
