/**
 * Contextual Delivery Actions Component
 * Shows sticky bottom action bar on mobile and prominent action box on desktop.
 * Dynamically shifts according to delivery state machine.
 */

import React from 'react';
import { DELIVERY_STATUSES } from '../../data/driverData';

export default function DeliveryActions({
  delivery,
  onStatusUpdate,
  onOpenProofModal,
  isUpdating
}) {
  if (!delivery) return null;

  const status = delivery.status || DELIVERY_STATUSES.IN_TRANSIT;

  const handleOpenNav = () => {
    let dest = delivery.buyer?.address;
    if (status === DELIVERY_STATUSES.GOING_TO_PICKUP || status === DELIVERY_STATUSES.ACCEPTED) {
      dest = delivery.farmer?.address;
    }
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCall = () => {
    const phone =
      status === DELIVERY_STATUSES.GOING_TO_PICKUP || status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP
        ? delivery.farmer?.phone
        : delivery.buyer?.phone;
    if (phone) {
      window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    }
  };

  return (
    <>
      {/* Desktop In-Card Action Box */}
      <div className="drv-card bg-light border-2 d-none d-md-block overflow-hidden">
        <div className="mb-3">
          <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            CURRENT REQUIRED DRIVER ACTION
          </span>
          <strong className="fs-5 text-dark d-block mt-1">
            {status === DELIVERY_STATUSES.ASSIGNED && 'Review and Accept New Delivery Consignment.'}
            {status === DELIVERY_STATUSES.ACCEPTED && 'Proceed to Nilakottai Farm for Pickup.'}
            {status === DELIVERY_STATUSES.GOING_TO_PICKUP && 'En Route to Farmer. Mark arrival upon reaching gate.'}
            {status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP && 'Inspect crates, verify weight, and confirm pickup.'}
            {status === DELIVERY_STATUSES.PICKED_UP && 'Start trip to Dindigul Buyer Hub.'}
            {status === DELIVERY_STATUSES.IN_TRANSIT && 'Navigating to ABC Retail Dindigul.'}
            {status === DELIVERY_STATUSES.ARRIVED_AT_DROP && 'Consignment arrived at buyer. Collect signature to finish.'}
            {status === DELIVERY_STATUSES.DELIVERED && 'Delivery completed successfully.'}
          </strong>
        </div>

        <div className="d-flex flex-column gap-2 w-100">
          {/* Status: ASSIGNED */}
          {status === DELIVERY_STATUSES.ASSIGNED && (
            <div className="d-flex gap-2 w-100 flex-wrap">
              <button
                type="button"
                className="drv-btn drv-btn-outline flex-grow-1"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(DELIVERY_STATUSES.CANCELLED)}
              >
                <i className="bi bi-x-circle"></i>
                <span>Decline</span>
              </button>
              <button
                type="button"
                className="drv-btn drv-btn-primary flex-grow-1 py-3"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(DELIVERY_STATUSES.ACCEPTED)}
              >
                <i className="bi bi-check2-circle"></i>
                <span>Accept Delivery</span>
              </button>
            </div>
          )}

          {/* Status: ACCEPTED or GOING_TO_PICKUP */}
          {(status === DELIVERY_STATUSES.ACCEPTED || status === DELIVERY_STATUSES.GOING_TO_PICKUP) && (
            <>
              <button
                type="button"
                className="drv-btn drv-btn-amber w-100 py-3 fs-6"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_PICKUP)}
              >
                <i className="bi bi-geo-alt-fill"></i>
                <span>Mark Arrived at Farm</span>
              </button>
              <button
                type="button"
                className="drv-btn drv-btn-outline w-100"
                onClick={handleOpenNav}
              >
                <i className="bi bi-cursor-fill"></i>
                <span>Open Navigation to Farm</span>
              </button>
            </>
          )}

          {/* Status: ARRIVED_AT_PICKUP */}
          {status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP && (
            <button
              type="button"
              className="drv-btn drv-btn-primary w-100 py-3 fs-6"
              disabled={isUpdating}
              onClick={() => onStatusUpdate(DELIVERY_STATUSES.IN_TRANSIT)}
            >
              <i className="bi bi-box-seam-fill"></i>
              <span>Confirm Pickup & Start Transit</span>
            </button>
          )}

          {/* Status: PICKED_UP or IN_TRANSIT */}
          {(status === DELIVERY_STATUSES.PICKED_UP || status === DELIVERY_STATUSES.IN_TRANSIT) && (
            <>
              {/* Primary dominant action */}
              <button
                type="button"
                className="drv-btn drv-btn-amber w-100 py-3 fs-6"
                disabled={isUpdating}
                onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_DROP)}
              >
                <i className="bi bi-geo-fill"></i>
                <span>Mark Arrived at Buyer</span>
              </button>

              {/* Secondary helper actions */}
              <div className="d-flex gap-2 w-100 flex-wrap">
                <button
                  type="button"
                  className="drv-btn drv-btn-primary flex-grow-1"
                  onClick={handleOpenNav}
                >
                  <i className="bi bi-cursor-fill"></i>
                  <span>Open Navigation</span>
                </button>
                <button
                  type="button"
                  className="drv-btn drv-btn-outline flex-grow-1"
                  onClick={handleCall}
                >
                  <i className="bi bi-telephone-fill text-primary"></i>
                  <span>Contact Buyer</span>
                </button>
              </div>
            </>
          )}

          {/* Status: ARRIVED_AT_DROP */}
          {status === DELIVERY_STATUSES.ARRIVED_AT_DROP && (
            <button
              type="button"
              className="drv-btn drv-btn-primary w-100 py-3 fs-6"
              onClick={onOpenProofModal}
            >
              <i className="bi bi-pen-fill"></i>
              <span>Upload Delivery Proof & Confirm</span>
            </button>
          )}

          {/* Status: DELIVERED */}
          {status === DELIVERY_STATUSES.DELIVERED && (
            <div className="d-flex flex-column gap-2 w-100">
              <span className="badge bg-success-subtle text-success p-3 fs-6 fw-bold text-center">
                <i className="bi bi-patch-check-fill me-1"></i> Delivery Completed
              </span>
              <button
                type="button"
                className="drv-btn drv-btn-outline w-100"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer"></i>
                <span>Print e-Way Bill</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (< 768px) */}
      <div className="drv-sticky-actions d-md-none">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <button
            type="button"
            className="drv-btn drv-btn-outline p-2 px-3"
            onClick={handleOpenNav}
            title="Directions"
          >
            <i className="bi bi-cursor-fill fs-5"></i>
          </button>
          <button
            type="button"
            className="drv-btn drv-btn-outline p-2 px-3"
            onClick={handleCall}
            title="Call"
          >
            <i className="bi bi-telephone-fill fs-5 text-success"></i>
          </button>
        </div>

        <div className="flex-grow-1 text-end">
          {status === DELIVERY_STATUSES.ASSIGNED && (
            <button
              type="button"
              className="drv-btn drv-btn-primary w-100 py-3"
              disabled={isUpdating}
              onClick={() => onStatusUpdate(DELIVERY_STATUSES.ACCEPTED)}
            >
              Accept Delivery
            </button>
          )}

          {(status === DELIVERY_STATUSES.ACCEPTED || status === DELIVERY_STATUSES.GOING_TO_PICKUP) && (
            <button
              type="button"
              className="drv-btn drv-btn-amber w-100 py-3"
              disabled={isUpdating}
              onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_PICKUP)}
            >
              Arrived at Farm
            </button>
          )}

          {status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP && (
            <button
              type="button"
              className="drv-btn drv-btn-primary w-100 py-3"
              disabled={isUpdating}
              onClick={() => onStatusUpdate(DELIVERY_STATUSES.IN_TRANSIT)}
            >
              Confirm Pickup
            </button>
          )}

          {(status === DELIVERY_STATUSES.PICKED_UP || status === DELIVERY_STATUSES.IN_TRANSIT) && (
            <button
              type="button"
              className="drv-btn drv-btn-amber w-100 py-3"
              disabled={isUpdating}
              onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_DROP)}
            >
              Arrived at Buyer
            </button>
          )}

          {status === DELIVERY_STATUSES.ARRIVED_AT_DROP && (
            <button
              type="button"
              className="drv-btn drv-btn-primary w-100 py-3"
              onClick={onOpenProofModal}
            >
              Confirm Delivery
            </button>
          )}

          {status === DELIVERY_STATUSES.DELIVERED && (
            <button
              type="button"
              className="drv-btn drv-btn-outline w-100 py-3 text-success fw-bold"
              disabled
            >
              ✓ Completed
            </button>
          )}
        </div>
      </div>
    </>
  );
}
