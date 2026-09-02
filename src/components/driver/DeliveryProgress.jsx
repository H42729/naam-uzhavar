/**
 * Delivery Progress Tracker Component
 * Renders a horizontal step line on desktop and vertical step line on mobile.
 * Highlights the active stage with subtle glow and displays completed checkmarks.
 */

import React from 'react';
import { ROUTE_STAGES, DELIVERY_STATUSES } from '../../data/driverData';

export default function DeliveryProgress({ currentStatus }) {
  // Map currentStatus into stage index (0 to 6)
  const getStageIndex = (status) => {
    switch (status) {
      case DELIVERY_STATUSES.ASSIGNED:
        return -1;
      case DELIVERY_STATUSES.ACCEPTED:
        return 0;
      case DELIVERY_STATUSES.GOING_TO_PICKUP:
        return 1;
      case DELIVERY_STATUSES.ARRIVED_AT_PICKUP:
        return 2;
      case DELIVERY_STATUSES.PICKED_UP:
        return 3;
      case DELIVERY_STATUSES.IN_TRANSIT:
        return 4;
      case DELIVERY_STATUSES.ARRIVED_AT_DROP:
        return 5;
      case DELIVERY_STATUSES.DELIVERED:
        return 6;
      default:
        return 4; // default in transit
    }
  };

  const activeIdx = getStageIndex(currentStatus);
  const totalSteps = ROUTE_STAGES.length;
  // Fill percent for desktop horizontal line
  const fillPercent = activeIdx >= 0 ? Math.min((activeIdx / (totalSteps - 1)) * 100, 100) : 0;

  return (
    <div className="drv-card">
      <div className="drv-card-title mb-3">
        <span>
          <i className="bi bi-clock-history me-1 text-warning"></i> Route Milestones & Progress
        </span>
        <span className="small text-muted fw-semibold">
          Stage {activeIdx + 1} of {totalSteps}
        </span>
      </div>

      {/* Desktop Horizontal View (>= 576px) */}
      <div className="d-none d-sm-block">
        <div className="drv-progress-wrap">
          {/* Background gray connecting line */}
          <div className="drv-progress-line-back"></div>
          {/* Active green connecting line fill */}
          <div
            className="drv-progress-line-fill"
            style={{ width: `calc(${fillPercent}% * 0.9 + 10px)` }}
          ></div>

          {ROUTE_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;

            return (
              <div key={stage.id} className="drv-step-item">
                <div
                  className={`drv-step-node ${
                    isCompleted ? 'completed' : isActive ? 'active' : ''
                  }`}
                >
                  {isCompleted ? (
                    <i className="bi bi-check-lg"></i>
                  ) : isActive ? (
                    <i className="bi bi-circle-fill" style={{ fontSize: '0.65rem' }}></i>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className={`drv-step-label ${isActive ? 'active' : ''}`}>
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical View (< 576px) */}
      <div className="d-block d-sm-none">
        <div className="drv-progress-wrap mobile-vertical">
          <div className="drv-progress-line-back"></div>
          <div
            className="drv-progress-line-fill"
            style={{ height: `${fillPercent}%` }}
          ></div>

          {ROUTE_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;

            return (
              <div key={stage.id} className="drv-step-item">
                <div
                  className={`drv-step-node ${
                    isCompleted ? 'completed' : isActive ? 'active' : ''
                  }`}
                >
                  {isCompleted ? (
                    <i className="bi bi-check-lg"></i>
                  ) : isActive ? (
                    <i className="bi bi-circle-fill" style={{ fontSize: '0.65rem' }}></i>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className={`drv-step-label ${isActive ? 'active' : ''} mb-0`}>
                    {stage.label}
                  </div>
                  {isActive && (
                    <span className="badge bg-warning-subtle text-warning-emphasis small mt-1">
                      Current Live Step
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
