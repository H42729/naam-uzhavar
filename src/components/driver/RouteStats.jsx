/**
 * Route Stats & Vehicle Telematics Component
 * Quick driver dashboard stats: Speed, Toll Gate, Fastag, Vehicle Health
 */

import React from 'react';

export default function RouteStats({ delivery }) {
  if (!delivery) return null;

  return (
    <div className="drv-card">
      <div className="drv-card-title">
        <span>
          <i className="bi bi-speedometer2 me-1 text-primary"></i> TRIP TELEMETRY
        </span>
        <span className="badge bg-light text-dark border small">Vehicle Live</span>
      </div>

      <div className="row g-2 text-center">
        <div className="col-6 col-sm-3">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              CURRENT SPEED
            </span>
            <strong className="fs-6 text-dark font-monospace">
              {delivery.speedKmh || 42} km/h
            </strong>
          </div>
        </div>

        <div className="col-6 col-sm-3">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              FASTAG STATUS
            </span>
            <span className="badge bg-success-subtle text-success fw-bold small mt-1">
              Active • ₹480
            </span>
          </div>
        </div>

        <div className="col-6 col-sm-3">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              NEXT TOLL
            </span>
            <strong className="fs-6 text-dark small">
              Kodai Road (4 km)
            </strong>
          </div>
        </div>

        <div className="col-6 col-sm-3">
          <div className="p-2 bg-light rounded-2 border">
            <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
              PAYLOAD USED
            </span>
            <strong className="fs-6 text-dark font-monospace">
              {Math.round((delivery.totalWeight / (delivery.vehicle?.payloadCapacityKg || 750)) * 100)}% (33%)
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
