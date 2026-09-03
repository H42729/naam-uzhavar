import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchResult({
  matchData,
  onConfirmOrder,
  onViewOrders
}) {
  const navigate = useNavigate();
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!matchData) return null;

  const {
    crop,
    requiredQty,
    matchedItems = [],
    totalMatchedQty = 0,
    isFullyMatched,
    farmersCount = 0,
    averagePrice = 0,
    estimatedTotalAmount = 0,
    deliveryDate,
    location,
  } = matchData;

  const handleConfirm = () => {
    const orderPayload = {
      crop,
      quantity: totalMatchedQty,
      farmers: farmersCount,
      amount: estimatedTotalAmount,
      status: 'Confirmed',
      deliveryDate: deliveryDate || '2026-10-18',
      location: location || 'Dindigul Hub',
      farmerBreakdown: matchedItems.map((m) => ({
        farmer: m.farmer,
        qty: m.allocatedQty,
        price: m.price,
      })),
    };

    const newOrder = onConfirmOrder(orderPayload);
    setConfirmedOrder(newOrder);
  };

  return (
    <div className="bd-match-card">
      {/* 1. If Order is Confirmed */}
      {confirmedOrder ? (
        <div>
          <div className="bd-match-alert">
            <i className="bi bi-check-circle-fill fs-4 text-success"></i>
            <div>
              <strong>Supply successfully aggregated from {confirmedOrder.farmers} farmers.</strong>
              <div className="small text-muted">
                Order is officially placed and sent to the regional farmer fulfillment coordinator.
              </div>
            </div>
          </div>

          <div className="p-4 bg-light rounded-3 border mb-3">
            <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
              <span className="text-muted small text-uppercase fw-bold">Official Procurement Receipt</span>
              <span className="badge bg-success font-monospace px-3 py-1">
                {confirmedOrder.status}
              </span>
            </div>

            <div className="row g-3">
              <div className="col-6 col-md-3">
                <span className="text-muted small d-block">Order ID</span>
                <span className="fw-bold font-monospace fs-5 text-dark">
                  {confirmedOrder.id}
                </span>
              </div>
              <div className="col-6 col-md-3">
                <span className="text-muted small d-block">Crop</span>
                <span className="fw-bold fs-5 text-dark">{confirmedOrder.crop}</span>
              </div>
              <div className="col-6 col-md-3">
                <span className="text-muted small d-block">Quantity</span>
                <span className="fw-bold fs-5 text-success">{confirmedOrder.quantity} kg</span>
              </div>
              <div className="col-6 col-md-3">
                <span className="text-muted small d-block">Farmers Matched</span>
                <span className="fw-bold fs-5 text-dark">{confirmedOrder.farmers}</span>
              </div>
            </div>

            <div className="row g-3 mt-1 pt-2 border-top">
              <div className="col-6 col-md-6">
                <span className="text-muted small d-block">Delivery Destination</span>
                <span className="fw-semibold text-dark">{confirmedOrder.location}</span>
              </div>
              <div className="col-6 col-md-6 text-md-end">
                <span className="text-muted small d-block">Total Purchase Amount</span>
                <span className="fw-bold text-success fs-4">
                  ₹{confirmedOrder.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <button
              type="button"
              className="bd-btn bd-btn-outline"
              onClick={() => setConfirmedOrder(null)}
            >
              <i className="bi bi-arrow-repeat"></i>
              <span>Match Another Supply</span>
            </button>
            <button
              type="button"
              className="bd-btn bd-btn-primary px-4"
              onClick={onViewOrders}
            >
              <i className="bi bi-receipt"></i>
              <span>View in Orders Table</span>
            </button>
          </div>
        </div>
      ) : (
        /* 2. Before Confirmation: Show Matching Farmers and Metrics */
        <div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
            <div>
              <h4 className="fw-bold mb-0 text-dark">
                Aggregated Supply Breakdown for {crop}
              </h4>
              <p className="text-muted small mb-0">
                Target: <strong>{requiredQty} kg</strong> • Location: <strong>{location}</strong>
              </p>
            </div>

            {isFullyMatched ? (
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6 rounded-pill fw-bold">
                ✓ Requirement Fully Matched
              </span>
            ) : (
              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fs-6 rounded-pill fw-bold">
                Partial Match ({totalMatchedQty} / {requiredQty} kg)
              </span>
            )}
          </div>

          {/* Matched Farmer List */}
          <div className="mb-3">
            <label className="bd-label text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
              Allocated Farmer Inventory Lots
            </label>
            <div className="d-flex flex-column gap-2">
              {matchedItems.map((item, idx) => (
                <div key={idx} className="bd-farmer-strip">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="fw-bold text-dark fs-6">{item.farmer}</div>
                      <div className="text-muted small">
                        <i className="bi bi-geo-alt me-1 text-danger"></i>
                        {item.location} • <span className="text-success">{item.grade || 'Grade A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 gap-md-4 text-end flex-wrap flex-md-nowrap ms-auto">
                    <div>
                      <span className="text-muted small d-block">Allocated Qty</span>
                      <strong className="text-dark font-monospace">{item.allocatedQty} kg</strong>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Rate</span>
                      <strong className="text-success font-monospace">₹{item.price}/kg</strong>
                    </div>
                    <div>
                      <span className="text-muted small d-block">Subtotal</span>
                      <strong className="text-dark font-monospace">
                        ₹{(item.allocatedQty * item.price).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1.5 shadow-xs text-nowrap"
                      onClick={() =>
                        navigate(
                          `/buyer/aggregate-details/${item.id || item.farmer}?qty=${item.allocatedQty}`
                        )
                      }
                      title="View Farmer & Product details on dedicated page"
                    >
                      <i className="bi bi-eye-fill"></i>
                      <span>See Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric Summary Strip */}
          <div className="bd-metrics-grid">
            <div className="bd-mini-metric">
              <div className="bd-mini-metric-lbl">Number of Farmers</div>
              <div className="bd-mini-metric-val">{farmersCount}</div>
            </div>
            <div className="bd-mini-metric">
              <div className="bd-mini-metric-lbl">Total Quantity</div>
              <div className="bd-mini-metric-val text-success">{totalMatchedQty} kg</div>
            </div>
            <div className="bd-mini-metric">
              <div className="bd-mini-metric-lbl">Average Price</div>
              <div className="bd-mini-metric-val">₹{averagePrice.toFixed(2)}/kg</div>
            </div>
            <div className="bd-mini-metric">
              <div className="bd-mini-metric-lbl">Estimated Total Amount</div>
              <div className="bd-mini-metric-val text-success">
                ₹{estimatedTotalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 gap-2">
            <span className="text-muted small">
              <i className="bi bi-shield-lock-fill text-success me-1"></i>
              Consolidated single payment released via FarmDirect Escrow protocol.
            </span>
            <button
              type="button"
              className="bd-btn bd-btn-primary px-4 py-2"
              onClick={handleConfirm}
              disabled={matchedItems.length === 0}
            >
              <i className="bi bi-check2-circle"></i>
              <span>Confirm Order</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
