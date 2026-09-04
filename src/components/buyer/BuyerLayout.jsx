import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBuyer } from '../../context/BuyerContext';
import BuyerNavbar from '../BuyerNavbar';
import BuyerMobileNav from './BuyerMobileNav';
import '../../styles/buyer-dashboard.css';

export default function BuyerLayout({ children }) {
  const { user, logout } = useAuth();
  const { toastMessage } = useBuyer();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}
    >
      {/* 1. STICKY TWO-TIER TOP NAVBAR */}
      <BuyerNavbar
        buyerName={user?.name || 'FreshMart Procurement'}
        onLogout={handleLogout}
      />

      {/* 2. FULL-WIDTH MAIN CONTENT BODY */}
      <main
        className="flex-1 w-full min-w-0 pb-24 lg:pb-8"
        style={{ flex: '1 1 0%', width: '100%', minWidth: 0 }}
      >
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1150 }}>
            <div className="toast show bg-dark text-white shadow-lg p-3 rounded-4 border border-secondary farm-animate-fade">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '32px', height: '32px' }}
                >
                  <i className="bi bi-check-lg fw-bold"></i>
                </div>
                <span className="fw-semibold small">{toastMessage}</span>
              </div>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <BuyerMobileNav />
    </div>
  );
}

