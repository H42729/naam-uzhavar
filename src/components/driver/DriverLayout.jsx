/**
 * Driver Dashboard Layout
 * Clean, modern layout using two-tier top navigation bar (LogisticsTopNav).
 * Fully responsive with full-width content and no vertical sidebar.
 */

import React from 'react';
import LogisticsTopNav from './LogisticsTopNav';
import '../../styles/driver-route.css';

export default function DriverLayout({
  children,
  activeDeliveryId,
  onRefresh,
  isOnline = true,
  onToggleOnline
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Sticky Two-Tier Horizontal Top Navigation */}
      <LogisticsTopNav
        activeDeliveryId={activeDeliveryId}
        isOnline={isOnline}
        onToggleOnline={onToggleOnline}
      />

      {/* 2. Main Content Canvas */}
      <main className="drv-main flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 drv-page-fade">
        {children}
      </main>
    </div>
  );
}
