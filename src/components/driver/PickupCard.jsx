/**
 * Pickup Card Component
 * Displays dedicated farm pickup details, instructions, and quick actions:
 * Navigate, Call Farmer, Message Farmer, Mark Arrived.
 */

import React, { useState } from 'react';
import { DELIVERY_STATUSES } from '../../data/driverData';

export default function PickupCard({ delivery, onStatusUpdate, isUpdating }) {
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [messageText, setMessageText] = useState('Vanakkam Arun sir. I am en route to your farm for pickup.');
  const [msgSent, setMsgSent] = useState(false);

  if (!delivery?.farmer) return null;
  const { farmer } = delivery;
  const isGoingToPickup = delivery.status === DELIVERY_STATUSES.GOING_TO_PICKUP;
  const hasArrivedAtPickup =
    delivery.status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP ||
    delivery.status === DELIVERY_STATUSES.PICKED_UP ||
    delivery.status === DELIVERY_STATUSES.IN_TRANSIT ||
    delivery.status === DELIVERY_STATUSES.ARRIVED_AT_DROP ||
    delivery.status === DELIVERY_STATUSES.DELIVERED;

  const handleNavigate = () => {
    const dest = encodeURIComponent(farmer.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${farmer.phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => {
      setShowMsgModal(false);
      setMsgSent(false);
    }, 1500);
  };

  return (
    <div className="drv-card border-start border-4 border-success">
      <div className="drv-card-title">
        <span className="text-success">
          <i className="bi bi-geo-alt-fill me-1"></i> PICKUP LOCATION
        </span>
        {hasArrivedAtPickup && (
          <span className="badge bg-success-subtle text-success small">
            <i className="bi bi-check-circle me-1"></i> Picked Up
          </span>
        )}
      </div>

      <div className="mb-3">
        <h3 className="fs-5 fw-bold text-dark mb-1">{farmer.farmName || farmer.name}</h3>
        <p className="text-muted small mb-2">{farmer.address}</p>
        {farmer.pickupInstructions && (
          <div className="p-2 bg-light rounded-2 text-muted small border">
            <i className="bi bi-info-circle me-1 text-primary"></i>
            <strong>Gate Instructions:</strong> {farmer.pickupInstructions}
          </div>
        )}
      </div>

      {/* Distance & ETA Row */}
      <div className="row g-2 mb-3 text-center">
        <div className="col-6">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              DISTANCE TO PICKUP
            </span>
            <strong className="fs-6 text-dark font-monospace">
              {delivery.distanceToPickup || 8.5} km
            </strong>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              ETA TO PICKUP
            </span>
            <strong className="fs-6 text-success font-monospace">15 mins</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap gap-2 pt-2 border-top">
        <button
          type="button"
          className="drv-btn drv-btn-primary flex-grow-1"
          onClick={handleNavigate}
        >
          <i className="bi bi-cursor-fill"></i>
          <span>Navigate</span>
        </button>

        <button
          type="button"
          className="drv-btn drv-btn-outline flex-grow-1"
          onClick={handleCall}
        >
          <i className="bi bi-telephone-fill text-success"></i>
          <span>Call Farmer</span>
        </button>

        {isGoingToPickup && (
          <button
            type="button"
            className="drv-btn drv-btn-amber w-100 mt-1"
            disabled={isUpdating}
            onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_PICKUP)}
          >
            <i className="bi bi-geo-fill"></i>
            <span>Mark Arrived at Farm</span>
          </button>
        )}
      </div>
    </div>
  );
}
