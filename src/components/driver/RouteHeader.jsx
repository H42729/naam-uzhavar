/**
 * Route Header Component
 * Displays Route / Delivery header, breadcrumbs, back button, and consignment ID
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RouteHeader({ delivery, onRefresh, isRefreshing }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px' }}
          onClick={() => navigate(-1)}
          title="Back"
          aria-label="Go back"
        >
          <i className="bi bi-arrow-left fs-5"></i>
        </button>

        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Route / Delivery
            </span>
            <span className="text-muted">•</span>
            <span className="badge bg-light text-dark font-monospace border small">
              {delivery?.id || 'ORD-1024'}
            </span>
            {delivery?.trackingNumber && (
              <span className="badge bg-secondary-subtle text-secondary font-monospace small d-none d-sm-inline-block">
                {delivery.trackingNumber}
              </span>
            )}
          </div>
          <h1 className="fw-bold text-dark fs-3 mb-0">
            {delivery?.farmer?.district || 'Nilakottai'} to {delivery?.buyer?.district || 'Dindigul'} Route
          </h1>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-between justify-content-md-end">
        <button
          type="button"
          className="drv-btn drv-btn-outline btn-sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Reload route information"
        >
          <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin-icon' : ''}`}></i>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Route'}</span>
        </button>

        <Link
          to="/driver/routes"
          className="drv-btn drv-btn-outline btn-sm"
          title="View all routes and assignments"
        >
          <i className="bi bi-list-task"></i>
          <span>All Consignments</span>
        </Link>
      </div>
    </div>
  );
}
