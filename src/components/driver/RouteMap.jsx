/**
 * Interactive Route Map Component
 * Realistic vector topology map displaying driver position, farm pickup marker,
 * buyer destination marker, animated transit route line, speed gauge, and 1-click Google Navigation.
 */

import React, { useState } from 'react';
import { DELIVERY_STATUSES } from '../../data/driverData';

export default function RouteMap({ delivery }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const status = delivery?.status || DELIVERY_STATUSES.IN_TRANSIT;

  // Calculate truck progress along the road depending on delivery stage
  let truckPositionPercent = 55; // default midway in transit
  if (status === DELIVERY_STATUSES.ASSIGNED || status === DELIVERY_STATUSES.ACCEPTED) {
    truckPositionPercent = 15;
  } else if (status === DELIVERY_STATUSES.GOING_TO_PICKUP) {
    truckPositionPercent = 25;
  } else if (status === DELIVERY_STATUSES.ARRIVED_AT_PICKUP || status === DELIVERY_STATUSES.PICKED_UP) {
    truckPositionPercent = 38;
  } else if (status === DELIVERY_STATUSES.IN_TRANSIT) {
    truckPositionPercent = 65;
  } else if (status === DELIVERY_STATUSES.ARRIVED_AT_DROP || status === DELIVERY_STATUSES.DELIVERED) {
    truckPositionPercent = 90;
  }

  // Generate external Google Maps navigation URL
  const handleOpenGoogleNavigation = () => {
    if (!delivery) return;
    const origin = encodeURIComponent(delivery?.farmer?.address || 'Nilakottai, Tamil Nadu');
    const destination = encodeURIComponent(delivery?.buyer?.address || 'Dindigul, Tamil Nadu');
    const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(navUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="drv-map-container mb-4">
      {/* 1. TOP OVERLAY: LIVE TELEMETRY & ROUTE METRICS */}
      <div className="drv-map-overlay-top">
        <div className="drv-map-glass-card d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="drv-online-dot"></span>
            <span className="small fw-bold font-monospace">GPS LIVE: NH-44 BYPASS</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="small font-monospace text-warning fw-bold">
            <i className="bi bi-speedometer2 me-1"></i>
            {delivery?.speedKmh || 42} km/h
          </div>
        </div>

        {/* Map Zoom Controls */}
        <div className="drv-map-glass-card d-flex align-items-center gap-1 p-1">
          <button
            type="button"
            className="btn btn-sm btn-dark text-white p-1 rounded-2"
            style={{ width: '28px', height: '28px' }}
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
            title="Zoom in"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-dark text-white p-1 rounded-2"
            style={{ width: '28px', height: '28px' }}
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
            title="Zoom out"
          >
            <i className="bi bi-dash-lg"></i>
          </button>
        </div>
      </div>

      {/* 2. MAIN MAP CANVAS (STYLED VECTOR ROAD TOPOLOGY) */}
      <div
        className="drv-map-canvas"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease'
        }}
      >
        <svg
          viewBox="0 0 800 400"
          className="w-100 h-100 position-absolute inset-0"
          style={{ overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          {/* Background Topo Land contours */}
          <path
            d="M 50 120 Q 200 40, 450 110 T 780 80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="38"
            opacity="0.4"
          />
          <path
            d="M 20 280 Q 250 360, 520 290 T 780 320"
            fill="none"
            stroke="#1e293b"
            strokeWidth="42"
            opacity="0.3"
          />

          {/* Secondary Arterial Highways */}
          <path
            d="M 80 400 L 220 220 L 340 280 L 720 50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="5"
            strokeDasharray="4 6"
          />
          <path
            d="M 0 160 L 200 190 L 580 140 L 800 240"
            fill="none"
            stroke="#1e293b"
            strokeWidth="6"
            strokeDasharray="8 8"
          />

          {/* PRIMARY HIGHWAY ROAD ROUTE (Nilakottai to Dindigul via NH-44) */}
          {/* Road casing */}
          <path
            id="mainRoad"
            d="M 120 280 Q 280 290, 420 190 T 680 120"
            fill="none"
            stroke="#047857"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Road inner lane */}
          <path
            d="M 120 280 Q 280 290, 420 190 T 680 120"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Animated dashes indicating transit direction */}
          <path
            d="M 120 280 Q 280 290, 420 190 T 680 120"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="8 12"
            className="drv-road-dash-animation"
          />
        </svg>

        {/* 1. PICKUP PIN (FARM MARKER) */}
        <div
          className="drv-pin-marker"
          style={{ left: '15%', top: '70%' }}
          title={`Pickup: ${delivery?.farmer?.farmName || 'Arun Farm'}`}
        >
          <div className="drv-pin-badge border-start border-success border-3">
            <i className="bi bi-flower1 text-success me-1"></i>
            <span>Farm Pickup (Nilakottai)</span>
          </div>
          <div
            className="rounded-circle bg-success text-white p-2 d-flex align-items-center justify-content-center shadow-lg"
            style={{ width: '38px', height: '38px', border: '3px solid #ffffff' }}
          >
            <i className="bi bi-geo-alt-fill fs-6"></i>
          </div>
        </div>

        {/* 2. DRIVER LIVE TRUCK MARKER */}
        <div
          className="drv-truck-marker"
          style={{
            left: `${truckPositionPercent}%`,
            top: `${Math.round(70 - (truckPositionPercent - 15) * 0.5)}%`,
            transition: 'left 0.8s ease, top 0.8s ease'
          }}
          title={`Current Position: ${delivery?.currentLocation?.name || 'NH-44 Bypass'}`}
        >
          <i className="bi bi-truck fs-5"></i>
        </div>

        {/* 3. DESTINATION PIN (BUYER WAREHOUSE) */}
        <div
          className="drv-pin-marker"
          style={{ left: '85%', top: '30%' }}
          title={`Drop: ${delivery?.buyer?.name || 'ABC Retail'}`}
        >
          <div className="drv-pin-badge border-start border-primary border-3">
            <i className="bi bi-shop text-primary me-1"></i>
            <span>Buyer Drop (Dindigul)</span>
          </div>
          <div
            className="rounded-circle bg-primary text-white p-2 d-flex align-items-center justify-content-center shadow-lg"
            style={{ width: '38px', height: '38px', border: '3px solid #ffffff' }}
          >
            <i className="bi bi-flag-fill fs-6"></i>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM OVERLAY: ROUTE SUMMARY & NAVIGATION ACTION */}
      <div className="drv-map-overlay-bottom">
        <div className="drv-map-glass-card">
          <div className="d-flex align-items-center gap-3">
            <div>
              <span className="text-white-50 small d-block" style={{ fontSize: '0.72rem' }}>
                REMAINING
              </span>
              <strong className="fs-5 text-white font-monospace">
                {delivery?.remainingDistance || 9.5} km
              </strong>
            </div>
            <div className="border-start border-secondary ps-3">
              <span className="text-white-50 small d-block" style={{ fontSize: '0.72rem' }}>
                EST. TIME
              </span>
              <strong className="fs-5 text-warning font-monospace">
                {delivery?.etaToDropMinutes || 17} mins
              </strong>
            </div>
          </div>
        </div>

        {/* Action button: Open External Navigation */}
        <button
          type="button"
          className="drv-btn drv-btn-primary drv-btn-lg pointer-events-auto shadow-lg"
          onClick={handleOpenGoogleNavigation}
          title="Open directions in Google Maps"
        >
          <i className="bi bi-cursor-fill"></i>
          <span>Open Navigation</span>
          <i className="bi bi-box-arrow-up-right small ms-1"></i>
        </button>
      </div>

      {/* Embedded CSS for road animated dash movement */}
      <style>{`
        .drv-road-dash-animation {
          animation: drvRoadDash 2.5s linear infinite;
        }
        @keyframes drvRoadDash {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
