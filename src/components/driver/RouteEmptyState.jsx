/**
 * Route Empty State Component
 * Shown when there are no active routes assigned to the driver.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function RouteEmptyState({ onResetDemo }) {
  return (
    <div className="drv-card p-5 text-center my-4 border-2" style={{ borderStyle: 'dashed' }}>
      <div
        className="rounded-circle bg-warning-subtle text-warning mx-auto d-flex align-items-center justify-content-center mb-3"
        style={{ width: '80px', height: '80px' }}
      >
        <i className="bi bi-truck fs-1"></i>
      </div>

      <h2 className="fs-4 fw-bold text-dark mb-2">No Active Deliveries</h2>
      <p className="text-muted max-w-md mx-auto mb-4" style={{ maxWidth: '420px' }}>
        You currently have no active delivery routes assigned. New harvest dispatch orders from FPOs and bulk buyers will appear here.
      </p>

      <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
        <Link to="/driver/routes?tab=requests" className="drv-btn drv-btn-primary">
          <i className="bi bi-inbox-fill"></i>
          <span>View Delivery Requests</span>
        </Link>

        {onResetDemo && (
          <button
            type="button"
            className="drv-btn drv-btn-outline"
            onClick={onResetDemo}
            title="Reload demo lot #ORD-1024"
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            <span>Load Demo Route (ORD-1024)</span>
          </button>
        )}
      </div>
    </div>
  );
}
