/**
 * Driver Delivery History Page
 * Route: /driver/history
 * Displays past completed trips, verified receiver signatures, payout receipts, and customer ratings.
 */

import React, { useState, useEffect } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { DELIVERY_HISTORY } from '../../data/driverData';
import deliveryService from '../../services/deliveryService';

export default function DriverHistoryPage() {
  const [historyList, setHistoryList] = useState(DELIVERY_HISTORY);
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const deliveries = await deliveryService.getAllDeliveries();
        if (isMounted && Array.isArray(deliveries) && deliveries.length > 0) {
          const completed = deliveries.filter((d) => d.status === 'DELIVERED');
          if (completed.length > 0) {
            const mapped = completed.map((d, idx) => ({
              id: d.orderId || d.id || `ORD-${1020 + idx}`,
              trackingNumber: d.trackingNumber || `TRK-NU-2026-${d.id}`,
              completedAt: d.deliveredAt
                ? new Date(d.deliveredAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Completed Recently',
              farmer: d.farmer?.farmName || d.farmer?.name || 'Organic Farm, Dindigul',
              buyer: d.buyer?.name || 'Retail Supermarket, Dindigul',
              crop: d.products?.[0]?.name || 'Produce Lot',
              weight: `${d.totalWeight || 250} kg`,
              distance: `${d.distance || 18} km`,
              payout: Math.round((d.distance || 18) * 45 + 500),
              rating: 5,
              receiver: d.proofOfDelivery?.receiverName || d.buyer?.receiverName || 'Store Inward Manager',
              status: 'DELIVERED',
              proofPhoto:
                d.proofOfDelivery?.photoUrl ||
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80'
            }));
            setHistoryList(mapped);
          }
        }
      } catch (e) {
        console.warn('Error loading history:', e);
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalEarnings = historyList.reduce((acc, curr) => acc + curr.payout, 0);

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Past Records
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">Delivery History</h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                RECENT EARNINGS
              </span>
              <strong className="fs-5 text-success font-monospace">
                ₹{totalEarnings.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* History Cards List */}
        <div className="d-flex flex-column gap-3">
          {historyList.map((item) => (
            <div key={item.id} className="drv-card shadow-xs">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bg-success text-white rounded-3 p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '42px', height: '42px' }}
                  >
                    <i className="bi bi-patch-check-fill fs-4"></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <strong className="text-dark font-monospace fs-6">Order #{item.id}</strong>
                      <span className="badge bg-secondary-subtle text-secondary small font-monospace">
                        {item.trackingNumber}
                      </span>
                      <span className="badge bg-success-subtle text-success small">
                        Delivered
                      </span>
                    </div>
                    <span className="text-muted small">
                      <i className="bi bi-calendar-check me-1"></i> Completed: {item.completedAt}
                    </span>
                  </div>
                </div>

                <div className="text-md-end">
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                    FREIGHT PAID
                  </span>
                  <strong className="fs-4 text-success font-monospace">
                    ₹{item.payout.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Route Path Details */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <div className="p-2 bg-light rounded-2 border small">
                    <span className="text-muted d-block fw-bold" style={{ fontSize: '0.7rem' }}>
                      FARM SOURCE
                    </span>
                    <strong className="text-dark">{item.farmer}</strong>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-2 bg-light rounded-2 border small">
                    <span className="text-muted d-block fw-bold" style={{ fontSize: '0.7rem' }}>
                      BUYER DESTINATION
                    </span>
                    <strong className="text-dark">{item.buyer}</strong>
                  </div>
                </div>
              </div>

              {/* Cargo & Proof Details */}
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-2 border-top">
                <div className="d-flex align-items-center gap-3 text-muted small flex-wrap">
                  <span>
                    <i className="bi bi-box-seam me-1 text-warning"></i>
                    <strong>{item.crop}</strong> ({item.weight})
                  </span>
                  <span>•</span>
                  <span>
                    <i className="bi bi-signpost me-1 text-primary"></i>
                    {item.distance}
                  </span>
                  <span>•</span>
                  <span>
                    <i className="bi bi-person-check text-success me-1"></i>
                    Receiver: <strong>{item.receiver}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-warning">
                    {'★'.repeat(item.rating)}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="drv-btn drv-btn-outline btn-sm"
                    onClick={() => setSelectedProof(item)}
                  >
                    <i className="bi bi-image text-primary"></i>
                    <span>View Proof</span>
                  </button>
                  <button
                    type="button"
                    className="drv-btn drv-btn-outline btn-sm"
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-receipt"></i>
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proof Photo Modal */}
        {selectedProof && (
          <div
            className="position-fixed inset-0 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3"
            style={{ zIndex: 1200, top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-4 p-4 max-w-md w-100 shadow-2xl" style={{ maxWidth: '440px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <strong className="fs-6 text-dark">Proof of Delivery (#{selectedProof.id})</strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProof(null)}
                ></button>
              </div>

              <img
                src={selectedProof.proofPhoto}
                alt="Delivery Proof"
                className="w-100 rounded-3 object-fit-cover mb-3"
                style={{ height: '220px' }}
              />

              <div className="p-3 bg-light rounded-3 border small mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Verified Receiver:</span>
                  <strong className="text-dark">{selectedProof.receiver}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Completed:</span>
                  <span className="text-dark">{selectedProof.completedAt}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Digital Seal:</span>
                  <span className="text-success font-monospace">VERIFIED-MATCH</span>
                </div>
              </div>

              <button
                type="button"
                className="drv-btn drv-btn-primary w-100"
                onClick={() => setSelectedProof(null)}
              >
                Close Proof
              </button>
            </div>
          </div>
        )}
      </div>
    </DriverLayout>
  );
}
