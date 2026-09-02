import React, { useState } from 'react';
import FarmerSidebar from './FarmerSidebar';
import FarmerNavbar from './FarmerNavbar';

export default function FarmerLayout({ children, searchQuery, onSearchChange }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="farm-dashboard-layout">
      {/* Sidebar */}
      <FarmerSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="farm-main-area">
        <FarmerNavbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="farm-content-body farm-animate-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
