/**
 * Route Summary Card Component
 * Displays essential active delivery details: Order #, Farmer, Pickup, Buyer, Drop, Load, Distance, ETA, Status
 */

import React from 'react';
import { STATUS_LABELS, DELIVERY_STATUSES } from '../../data/driverData';

export default function RouteSummary({ delivery }) {
  if (!delivery) return null;

  const status = delivery.status || DELIVERY_STATUSES.IN_TRANSIT;
  const statusLabel = STATUS_LABELS[status] || status;

  const getStatusClass = (st) => {
    switch (st) {
      case DELIVERY_STATUSES.IN_TRANSIT:
        return 'drv-status-in_transit';
      case DELIVERY_STATUSES.GOING_TO_PICKUP:
        return 'drv-status-going_to_pickup';
      case DELIVERY_STATUSES.ARRIVED_AT_PICKUP:
      case DELIVERY_STATUSES.ARRIVED_AT_DROP:
        return 'drv-status-arrived_at_pickup';
      case DELIVERY_STATUSES.PICKED_UP:
        return 'drv-status-picked_up';
      case DELIVERY_STATUSES.DELIVERED:
        return 'drv-status-delivered';
      case DELIVERY_STATUSES.ASSIGNED:
      default:
        return 'drv-status-assigned';
    }
  };

  return (
    <div className="drv-card border-2" style={{ borderColor: 'var(--drv-slate-200)' }}>
      {/* Top Bar: Active Title + Status Badge */}
      <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-3 p-2 d-flex align-items-center justify-content-center bg-warning-subtle text-dark"
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-truck fs-4 text-warning"></i>
          </div>
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>
              Active Delivery
            </div>
            <strong className="fs-5 text-dark font-monospace">Order #{delivery.id}</strong>
          </div>
        </div>

        <div>
          <span className={`drv-status-badge ${getStatusClass(status)}`}>
            <span className="drv-online-dot" style={{ width: '6px', height: '6px' }}></span>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Grid: Farmer / Pickup & Buyer / Drop */}
      <div className="row g-3 mb-3">
        {/* Farmer & Pickup */}
        <div className="col-12 col-md-6">
          <div className="p-3 bg-light rounded-3 border h-100">
            <div className="text-muted small fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
              <i className="bi bi-person-fill text-success"></i>
              <span>Farmer & Source</span>
            </div>
            <div className="fs-6 fw-bold text-dark mb-1">{delivery?.farmer?.name || 'Local Producer'}</div>
            <div className="text-muted small">
              <i className="bi bi-geo-alt me-1 text-danger"></i>
              <strong>Pickup:</strong> {delivery?.farmer?.address || 'Pickup Hub, Tamil Nadu'}
            </div>
          </div>
        </div>

        {/* Buyer & Drop */}
        <div className="col-12 col-md-6">
          <div className="p-3 bg-light rounded-3 border h-100">
            <div className="text-muted small fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
              <i className="bi bi-shop text-primary"></i>
              <span>Buyer & Destination</span>
            </div>
            <div className="fs-6 fw-bold text-dark mb-1">{delivery?.buyer?.name || 'Commercial Buyer'}</div>
            <div className="text-muted small">
              <i className="bi bi-geo-fill me-1 text-success"></i>
              <strong>Drop:</strong> {delivery?.buyer?.address || 'Wholesale Depot, Tamil Nadu'}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row: Load, Distance, ETA */}
      <div className="row g-2 pt-2 border-top text-center">
        <div className="col-4 border-end">
          <span className="text-muted small d-block">Cargo Load</span>
          <strong className="fs-5 text-dark font-monospace">{delivery.totalWeight} kg</strong>
        </div>
        <div className="col-4 border-end">
          <span className="text-muted small d-block">Total Distance</span>
          <strong className="fs-5 text-dark font-monospace">{delivery.distance} km</strong>
        </div>
        <div className="col-4">
          <span className="text-muted small d-block">Est. Arrival (ETA)</span>
          <strong className="fs-5 text-success font-monospace">{delivery.etaMinutes} mins</strong>
        </div>
      </div>
    </div>
  );
}
