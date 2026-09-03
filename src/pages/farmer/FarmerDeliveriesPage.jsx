/**
 * Farmer Delivery Status Page
 * Route: /farmer/deliveries
 * Tracks logistics dispatches from the farmer's gate through:
 * Order Accepted → Driver Assigned → Pickup → In Transit → Delivered
 */

import React, { useState } from 'react';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerDeliveriesPage() {
  const { deliveries } = useFarmer();
  const [selectedDelivery, setSelectedDelivery] = useState(deliveries[0]);

  const stages = ['Order Accepted', 'Driver Assigned', 'Pickup', 'In Transit', 'Delivered'];

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              MANDI LOGISTICS
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">Delivery Status (விநியோக நிலை)</h1>
          </div>

          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-truck me-1"></i> Integrated Tata Ace Logistics Network
          </span>
        </div>

        {/* Deliveries Stream */}
        <div className="d-flex flex-column gap-4">
          {deliveries.map((del) => {
            const currentStageIndex = stages.indexOf(del.currentStage);

            return (
              <div key={del.id} className="farm-card p-4 rounded-4 bg-white border shadow-xs">
                {/* Order Top Summary */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong className="fs-5 text-dark font-monospace">Consignment #{del.id}</strong>
                      <span className="badge bg-light text-muted border font-monospace small">
                        {del.trackingNumber}
                      </span>
                      <span
                        className={`badge ${
                          del.currentStage === 'Delivered'
                            ? 'bg-success text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {del.currentStage}
                      </span>
                    </div>

                    <span className="text-muted small">
                      Crop: <strong className="text-dark">{del.crop}</strong> ({del.quantity}) • Buyer:{' '}
                      <strong className="text-dark">{del.buyerName}</strong>
                    </span>
                  </div>

                  <div className="text-md-end">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      ESTIMATED DESTINATION ARRIVAL
                    </span>
                    <strong className="fs-5 text-success font-monospace">
                      {del.estimatedArrival}
                    </strong>
                  </div>
                </div>

                {/* 5-Step Delivery Progress Tracker */}
                <div className="mb-4 py-2">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    CONSIGNMENT DISPATCH MILESTONES:
                  </span>

                  {/* Desktop Horizontal Tracker */}
                  <div className="position-relative d-none d-md-flex align-items-center justify-content-between my-3">
                    {/* Background line */}
                    <div
                      className="position-absolute bg-secondary-subtle"
                      style={{ height: '4px', left: '20px', right: '20px', zIndex: 1 }}
                    ></div>

                    {/* Active fill line */}
                    <div
                      className="position-absolute bg-success transition"
                      style={{
                        height: '4px',
                        left: '20px',
                        width: `${(currentStageIndex / (stages.length - 1)) * 90}%`,
                        zIndex: 2
                      }}
                    ></div>

                    {stages.map((stage, sIdx) => {
                      const isCompleted = sIdx <= currentStageIndex;
                      const isCurrent = sIdx === currentStageIndex;

                      return (
                        <div
                          key={stage}
                          className="position-relative d-flex flex-column align-items-center text-center"
                          style={{ zIndex: 3, width: '130px' }}
                        >
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition ${
                              isCompleted
                                ? 'bg-success text-white shadow-sm'
                                : 'bg-white text-muted border border-2'
                            }`}
                            style={{
                              width: '40px',
                              height: '40px',
                              border: isCurrent ? '3px solid #10b981' : undefined
                            }}
                          >
                            {isCompleted ? (
                              <i className="bi bi-check-lg fs-5"></i>
                            ) : (
                              <span>{sIdx + 1}</span>
                            )}
                          </div>

                          <span
                            className={`small mt-2 ${
                              isCurrent
                                ? 'fw-bold text-dark'
                                : isCompleted
                                ? 'text-dark'
                                : 'text-muted'
                            }`}
                            style={{ fontSize: '0.8rem' }}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Tracker */}
                  <div className="d-flex d-md-none flex-column gap-3 p-2 bg-light rounded-3">
                    {stages.map((stage, sIdx) => {
                      const isCompleted = sIdx <= currentStageIndex;
                      const isCurrent = sIdx === currentStageIndex;

                      return (
                        <div key={stage} className="d-flex align-items-center gap-3">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center small fw-bold ${
                              isCompleted ? 'bg-success text-white' : 'bg-white text-muted border'
                            }`}
                            style={{ width: '32px', height: '32px', flexShrink: 0 }}
                          >
                            {isCompleted ? <i className="bi bi-check"></i> : sIdx + 1}
                          </div>
                          <div>
                            <strong className={`d-block small ${isCurrent ? 'text-success' : 'text-dark'}`}>
                              {stage}
                            </strong>
                            {isCurrent && (
                              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                Currently active stage
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics Details & Driver Contact */}
                <div className="row g-3 p-3 bg-light rounded-3 align-items-center">
                  <div className="col-12 col-md-4">
                    <span className="text-muted small d-block">ASSIGNED DRIVER & VEHICLE:</span>
                    <strong className="text-dark d-block">
                      <i className="bi bi-person-badge me-1 text-primary"></i>
                      {del.driverName}
                    </strong>
                    <span className="text-muted small font-monospace">{del.vehicleNumber}</span>
                  </div>

                  <div className="col-12 col-md-5">
                    <span className="text-muted small d-block">LIVE STATUS NOTE:</span>
                    <span className="text-dark small fw-semibold">
                      <i className="bi bi-info-circle text-success me-1"></i>
                      {del.statusText}
                    </span>
                  </div>

                  <div className="col-12 col-md-3 text-md-end">
                    <a
                      href={`tel:${del.driverPhone.replace(/[^0-9+]/g, '')}`}
                      className="btn btn-outline-success btn-sm w-100 fw-bold d-inline-flex align-items-center justify-content-center gap-2 py-2"
                    >
                      <i className="bi bi-telephone-fill"></i>
                      <span>Call Driver</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FarmerLayout>
  );
}
