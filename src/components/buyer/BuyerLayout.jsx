import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBuyer } from '../../context/BuyerContext';
import BuyerNavbar from '../BuyerNavbar';
import BuyerSidebar from '../BuyerSidebar';
import '../../styles/buyer-dashboard.css';

export default function BuyerLayout({ children }) {
  const { user, logout } = useAuth();
  const { toastMessage } = useBuyer();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bd-layout">
      {/* 1. TOP NAVBAR */}
      <BuyerNavbar
        buyerName={user?.name || 'FreshMart Procurement'}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="bd-sidebar-wrapper">
        {/* 2. SIDEBAR WITH SPA NAVLINKS */}
        <BuyerSidebar
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* 3. MAIN CONTENT BODY */}
        <main className="bd-content bd-content-animate">
          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1150 }}>
              <div className="toast show bg-dark text-white shadow-lg p-3 rounded-4 border border-secondary">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check-lg fw-bold"></i>
                  </div>
                  <span className="fw-semibold small">{toastMessage}</span>
                </div>
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
