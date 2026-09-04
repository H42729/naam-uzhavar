/**
 * Farmer Layout Component
 * Standard vertical column layout (flex flex-col min-h-screen w-full):
 * - Sticky top navigation bar (FarmerSidebar)
 * - Full-width main content container below the top navbar
 * - Mobile bottom navigation bar
 */

import React from 'react';
import FarmerTopNav from './FarmerTopNav';
import FarmerMobileNav from './FarmerMobileNav';

export default function FarmerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 farm-dashboard-layout">
      {/* 1. Full-width sticky two-tier top navigation bar */}
      <FarmerTopNav />

      {/* 2. Full-width main content container below the top navbar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 farm-content-body farm-animate-fade pb-24 lg:pb-8">
        {children}
      </main>

      {/* 3. Mobile bottom navigation bar for quick access on smaller screens */}
      <FarmerMobileNav />
    </div>
  );
}
