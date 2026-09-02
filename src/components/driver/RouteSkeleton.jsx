/**
 * Route Skeleton Loading Component
 * Displays animated shimmer placeholders for summary, map, cards, and cargo while data loads.
 */

import React from 'react';

export default function RouteSkeleton() {
  return (
    <div className="w-100">
      {/* Header Skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div className="drv-skeleton" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
          <div>
            <div className="drv-skeleton mb-2" style={{ width: '140px', height: '14px' }}></div>
            <div className="drv-skeleton" style={{ width: '280px', height: '26px' }}></div>
          </div>
        </div>
        <div className="drv-skeleton d-none d-md-block" style={{ width: '120px', height: '38px' }}></div>
      </div>

      {/* Summary Skeleton */}
      <div className="drv-card p-4 mb-4">
        <div className="d-flex justify-content-between mb-3">
          <div className="drv-skeleton" style={{ width: '180px', height: '32px' }}></div>
          <div className="drv-skeleton" style={{ width: '100px', height: '28px', borderRadius: '999px' }}></div>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <div className="drv-skeleton" style={{ height: '80px' }}></div>
          </div>
          <div className="col-12 col-md-6">
            <div className="drv-skeleton" style={{ height: '80px' }}></div>
          </div>
        </div>
        <div className="drv-skeleton" style={{ height: '40px' }}></div>
      </div>

      {/* Map Skeleton */}
      <div className="drv-skeleton mb-4" style={{ height: '420px', borderRadius: '16px' }}></div>

      {/* Progress Tracker Skeleton */}
      <div className="drv-card p-4 mb-4">
        <div className="drv-skeleton mb-3" style={{ width: '200px', height: '20px' }}></div>
        <div className="drv-skeleton" style={{ height: '50px' }}></div>
      </div>

      {/* 2 Column Cards Skeleton */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="drv-card p-4">
            <div className="drv-skeleton mb-3" style={{ width: '140px', height: '20px' }}></div>
            <div className="drv-skeleton mb-2" style={{ height: '24px' }}></div>
            <div className="drv-skeleton mb-3" style={{ height: '40px' }}></div>
            <div className="drv-skeleton" style={{ height: '38px' }}></div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="drv-card p-4">
            <div className="drv-skeleton mb-3" style={{ width: '140px', height: '20px' }}></div>
            <div className="drv-skeleton mb-2" style={{ height: '24px' }}></div>
            <div className="drv-skeleton mb-3" style={{ height: '40px' }}></div>
            <div className="drv-skeleton" style={{ height: '38px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
