/**
 * Drop Card Component
 * Displays buyer destination details, drop instructions, and quick actions:
 * Navigate, Call Buyer, Message Buyer, Mark Arrived at Destination.
 */

import React, { useState } from 'react';
import { DELIVERY_STATUSES } from '../../data/driverData';

export default function DropCard({ delivery, onStatusUpdate, isUpdating }) {
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [messageText, setMessageText] = useState('Hello ABC Retail. Consignment #ORD-1024 is approaching Dindigul depot.');
  const [msgSent, setMsgSent] = useState(false);

  if (!delivery?.buyer) return null;
  const { buyer } = delivery;
  const isInTransit = delivery.status === DELIVERY_STATUSES.IN_TRANSIT;
  const isDelivered = delivery.status === DELIVERY_STATUSES.DELIVERED;
  const isArrivedAtDrop = delivery.status === DELIVERY_STATUSES.ARRIVED_AT_DROP;

  const handleNavigate = () => {
    const dest = encodeURIComponent(buyer.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${buyer.phone.replace(/[^0-9+]/g, '')}`;
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
    <div className="drv-card border-start border-4 border-primary">
      <div className="drv-card-title">
        <span className="text-primary">
          <i className="bi bi-shop me-1"></i> DROP LOCATION
        </span>
        {isDelivered && (
          <span className="badge bg-success-subtle text-success small">
            <i className="bi bi-patch-check-fill me-1"></i> Delivered
          </span>
        )}
      </div>

      <div className="mb-3">
        <h3 className="fs-5 fw-bold text-dark mb-1">{buyer.name}</h3>
        <p className="text-muted small mb-2">{buyer.address}</p>
        {buyer.dropInstructions && (
          <div className="p-2 bg-light rounded-2 text-muted small border">
            <i className="bi bi-info-circle me-1 text-primary"></i>
            <strong>Receiving Bay:</strong> {buyer.dropInstructions}
          </div>
        )}
      </div>

      {/* Distance & ETA Row */}
      <div className="row g-2 mb-3 text-center">
        <div className="col-6">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              REMAINING DISTANCE
            </span>
            <strong className="fs-6 text-dark font-monospace">
              {delivery.remainingDistance || 9.5} km
            </strong>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              EST. TIME (ETA)
            </span>
            <strong className="fs-6 text-warning font-monospace">
              {delivery.etaToDropMinutes || 17} mins
            </strong>
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
          <i className="bi bi-telephone-fill text-primary"></i>
          <span>Call Buyer</span>
        </button>

        {isInTransit && (
          <button
            type="button"
            className="drv-btn drv-btn-amber w-100 mt-1"
            disabled={isUpdating}
            onClick={() => onStatusUpdate(DELIVERY_STATUSES.ARRIVED_AT_DROP)}
          >
            <i className="bi bi-geo-alt-fill"></i>
            <span>Mark Arrived at Buyer Depot</span>
          </button>
        )}

        {isArrivedAtDrop && (
          <div className="w-100 alert alert-info py-2 px-3 mb-0 small d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill"></i>
            <span>At delivery destination. Collect signature & submit delivery proof below.</span>
          </div>
        )}
      </div>
    </div>
  );
}
