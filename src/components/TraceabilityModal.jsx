import React from 'react';

export default function TraceabilityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fd-modal-backdrop" onClick={onClose}>
      <div className="fd-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="fd-modal-header">
          <div className="fd-modal-title">
            <span>🌱</span> FarmDirect IoT Traceability Engine
          </div>
          <button type="button" className="fd-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="fd-modal-body">
          {/* Header Summary Card */}
          <div className="p-3 mb-4 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-success mb-1">Batch #FD-89241-IN-ORG</span>
                <h5 className="fw-bold mb-0 text-dark">Hydroponic Cherry Tomatoes (नाशिक)</h5>
                <p className="small text-muted mb-0">Harvest Origin: Unit 4B, Sahyadri Agro Cluster, Nashik, Maharashtra</p>
              </div>
              <div className="text-end">
                <span className="badge bg-primary">Blockchain Verified</span>
                <div className="small text-success fw-bold mt-1">✓ Grade A+ Export Quality</div>
              </div>
            </div>
          </div>

          {/* Seed to Sale Interactive Timeline */}
          <h6 className="fw-bold text-dark mb-3">Live Journey from Seed to Sale (बीज से बिक्री तक):</h6>
          <div className="position-relative ps-4 mb-4" style={{ borderLeft: '2.5px solid #22c55e' }}>
            {/* Step 1 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-success rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">1. Non-GMO Certified Seed Sowing & Organic Nutrition</div>
              <div className="small text-muted">14 May • 100% Organic Soil Enrichment • Zero Synthetic Chemicals</div>
              <div className="small text-success mt-1">Geo-Location: Nashik Agro Cluster (Lat 19.9975° N, Long 73.7898° E)</div>
            </div>

            {/* Step 2 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-success rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">2. AI Spectral Quality & Ripeness Scan</div>
              <div className="small text-muted">Today at 05:30 AM • Optical Sugar Brix Index: 8.5 (Optimal Sweetness)</div>
              <div className="small text-primary mt-1">Automated Grading: Grade A+ (0 Bruises Detected)</div>
            </div>

            {/* Step 3 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-primary rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">3. Smart Cold-Chain Dispatch (EV Delivery Fleet)</div>
              <div className="small text-muted">Today at 07:15 AM • Sensor Temp: 4.2°C • Humidity: 88%</div>
              <div className="small text-secondary mt-1">Driver: Smart Electric Van #MH-15-EV-042 (Zero Carbon Transit)</div>
            </div>

            {/* Step 4 */}
            <div className="position-relative">
              <div
                className="position-absolute bg-secondary rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">4. Direct Doorstep / Retail Delivery</div>
              <div className="small text-muted">Estimated: Within 2 Hours • Middleman Bypassed: 100%</div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <div className="small text-muted">
              Direct Farmer Payout: <strong className="text-success">₹70 / 500g box (88% of retail)</strong>
            </div>
            <button type="button" className="btn btn-outline-success btn-sm px-3" onClick={onClose}>
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
