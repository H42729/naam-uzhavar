import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBuyer } from '../../context/BuyerContext';
import BuyerNavbar from '../BuyerNavbar';
import BuyerMobileNav from './BuyerMobileNav';
import BuyerFloatingActions from './BuyerFloatingActions';
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
      className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 relative"
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

      {/* 2. FULL-WIDTH MAIN CONTENT BODY WITH RESPONSIVE CONTAINER PADDING */}
      <main
        className="flex-1 w-full bd-content-body farm-animate-fade pb-24 lg:pb-8 min-w-0"
        style={{ flex: '1 1 0%', width: '100%', minWidth: 0 }}
      >
        {/* Toast Notification Alert (Positioned above mobile bottom nav) */}
        {toastMessage && (
          <div
            className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 pointer-events-auto"
            style={{ zIndex: 1150 }}
          >
            <div className="bg-slate-900 text-white shadow-xl px-4 py-3 rounded-2xl border border-slate-700 farm-animate-fade flex items-center gap-3">
              <div
                className="bg-emerald-500 text-white rounded-full p-1.5 flex items-center justify-center flex-shrink-0"
                style={{ width: '28px', height: '28px' }}
              >
                <i className="bi bi-check-lg fw-bold text-sm"></i>
              </div>
              <span className="font-semibold text-xs sm:text-sm text-slate-100">{toastMessage}</span>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* 3. FLOATING ACTION BUTTONS (Book Vehicle & Profile, stacked one by one in right down) */}
      <BuyerFloatingActions />

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <BuyerMobileNav />
    </div>
  );
}

