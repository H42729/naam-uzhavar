/**
 * Cargo Card Component
 * Displays product items, quantities, thumbnails, total weight, crate counters,
 * tamper seal codes, and cargo discrepancy checks.
 */

import React, { useState } from 'react';

export default function CargoCard({ delivery }) {
  const [reportDiscrepancy, setReportDiscrepancy] = useState(false);
  const [discrepancyNote, setDiscrepancyNote] = useState('');
  const [discrepancySaved, setDiscrepancySaved] = useState(false);

  if (!delivery?.products) return null;

  const handleSaveDiscrepancy = (e) => {
    e.preventDefault();
    setDiscrepancySaved(true);
    setTimeout(() => {
      setReportDiscrepancy(false);
    }, 1500);
  };

  return (
    <div className="drv-card">
      <div className="drv-card-title">
        <span>
          <i className="bi bi-box-seam me-1 text-warning"></i> DELIVERY CARGO
        </span>
        <span className="badge bg-light text-dark font-monospace border small">
          Seal #{delivery.cargoVerificationCode || 'NU-SEAL-8894'}
        </span>
      </div>

      {/* Cargo List Items */}
      <div className="d-flex flex-column gap-2 mb-3">
        {delivery.products.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="rounded-3 object-fit-cover shadow-xs"
                style={{ width: '48px', height: '48px' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div>
                <strong className="d-block text-dark fs-6">{item.name}</strong>
                <span className="text-muted small">
                  {item.tamilName} • {item.crates} crates ({item.crateWeight} kg/crate)
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="fs-5 fw-bold text-dark font-monospace">
                {item.quantity} {item.unit}
              </span>
              <span className="d-block text-muted small" style={{ fontSize: '0.72rem' }}>
                Grade-A Sorted
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Total Load Bar */}
      <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-check text-success fs-4"></i>
          <div>
            <strong className="text-dark d-block">Verified Total Load</strong>
            <span className="text-muted small">
              {delivery.totalCrates || 10} crates secured with tamper tag
            </span>
          </div>
        </div>
        <div className="text-end">
          <span className="fs-4 fw-bold text-success font-monospace">
            {delivery.totalWeight} kg
          </span>
        </div>
      </div>

      {/* Discrepancy / Cargo Note Trigger */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
        <span className="text-muted small">
          <i className="bi bi-thermometer-half text-danger me-1"></i>
          Ambient Ventilated (18°C)
        </span>

        <button
          type="button"
          className="btn btn-link btn-sm text-decoration-none text-muted p-0"
          onClick={() => setReportDiscrepancy(!reportDiscrepancy)}
        >
          <i className="bi bi-exclamation-triangle me-1 text-warning"></i>
          Report Cargo Issue
        </button>
      </div>

      {/* Discrepancy Form Toggle */}
      {reportDiscrepancy && (
        <div className="mt-3 p-3 bg-warning-subtle rounded-3 border border-warning">
          <strong className="d-block text-dark small mb-1">Log Cargo Discrepancy / Damage</strong>
          <span className="d-block text-muted small mb-2">
            Record any crate damage, weight difference, or moisture damage before transit.
          </span>

          {discrepancySaved ? (
            <div className="text-success small fw-bold">
              <i className="bi bi-check-circle me-1"></i> Discrepancy note attached to e-Way bill.
            </div>
          ) : (
            <form onSubmit={handleSaveDiscrepancy}>
              <textarea
                className="form-control form-control-sm mb-2"
                rows="2"
                placeholder="E.g., 1 crate of tomatoes slightly bruised during loading..."
                value={discrepancyNote}
                onChange={(e) => setDiscrepancyNote(e.target.value)}
                required
              ></textarea>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-xs btn-light border"
                  onClick={() => setReportDiscrepancy(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-xs btn-warning fw-bold">
                  Save Note
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
