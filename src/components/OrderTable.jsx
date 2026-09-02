import React, { useState } from 'react';

export default function OrderTable({ orders = [] }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') return true;
    return order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="bd-badge bd-badge-confirmed">
            <i className="bi bi-check-circle-fill"></i> Confirmed
          </span>
        );
      case 'in transit':
      case 'transit':
        return (
          <span className="bd-badge bd-badge-transit">
            <i className="bi bi-truck"></i> In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="bd-badge bd-badge-delivered">
            <i className="bi bi-box2-check-fill"></i> Delivered
          </span>
        );
      default:
        return (
          <span className="bd-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bd-card">
      <div className="bd-card-header flex-wrap gap-2">
        <div>
          <h3 className="bd-card-title">
            <i className="bi bi-receipt-cutoff text-success"></i>
            <span>Aggregated Procurement Orders</span>
          </h3>
          <span className="text-muted small">
            Consolidated purchase orders sourced directly from farmer clusters
          </span>
        </div>

        {/* Filter Badges */}
        <div className="d-flex align-items-center gap-1">
          {['All', 'Confirmed', 'In Transit', 'Delivered'].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${
                statusFilter === st
                  ? 'btn-success fw-bold'
                  : 'btn-outline-secondary'
              } rounded-pill px-3`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox fs-1 text-secondary mb-2 d-block"></i>
          <h5 className="fw-semibold text-dark">No Orders Found</h5>
          <p className="small mb-0">
            {statusFilter !== 'All'
              ? `No orders currently marked as "${statusFilter}".`
              : 'You have not confirmed any procurement orders yet.'}
          </p>
        </div>
      ) : (
        <div className="bd-table-wrap">
          <div className="table-responsive">
            <table className="bd-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Farmers</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-monospace fw-bold text-dark">
                        {order.id}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{order.crop}</div>
                    </td>
                    <td className="font-monospace text-muted">{order.quantity} kg</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-people-fill text-success me-1"></i>
                        {order.farmers} {order.farmers === 1 ? 'farmer' : 'farmers'}
                      </span>
                    </td>
                    <td className="font-monospace fw-bold text-success">
                      ₹{order.amount?.toLocaleString('en-IN')}
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="bd-btn bd-btn-outline bd-btn-sm"
                        onClick={() => setSelectedOrder(order)}
                        title="View Order Lot Breakdown"
                      >
                        <i className="bi bi-eye"></i>
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="bd-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Order Details</span>
                <h5 className="fw-bold mb-0 font-monospace text-success">
                  {selectedOrder.id}
                </h5>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
              ></button>
            </div>

            {/* Status & Key Info */}
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
              <div>
                <div className="text-muted small">Status</div>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <div className="text-muted small">Total Volume</div>
                <div className="fw-bold fs-5 text-dark">{selectedOrder.quantity} kg</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Order Total</div>
                <div className="fw-bold fs-5 text-success">
                  ₹{selectedOrder.amount?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Farm Breakdown */}
            <div className="mb-3">
              <h6 className="fw-bold text-dark mb-2 small text-uppercase">
                Aggregated Farmer Lots ({selectedOrder.farmers} Source{selectedOrder.farmers > 1 ? 's' : ''})
              </h6>
              <div className="d-flex flex-column gap-2">
                {selectedOrder.farmerBreakdown && selectedOrder.farmerBreakdown.length > 0 ? (
                  selectedOrder.farmerBreakdown.map((f, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between align-items-center p-2 rounded-2 border bg-white small"
                    >
                      <div>
                        <span className="fw-semibold text-dark">{f.farmer}</span>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Direct Farm Consignment
                        </div>
                      </div>
                      <div className="text-end font-monospace">
                        <span className="text-muted me-2">{f.qty} kg</span>
                        <strong className="text-success">@ ₹{f.price}/kg</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 border rounded text-muted small">
                    Aggregated across {selectedOrder.farmers} verified regional farm suppliers.
                  </div>
                )}
              </div>
            </div>

            {/* Logistics Details */}
            <div className="p-3 bg-light rounded-3 small mb-4">
              <div className="row g-2">
                <div className="col-6">
                  <span className="text-muted d-block">Delivery Destination:</span>
                  <span className="fw-semibold">{selectedOrder.location || 'Regional Bulk Hub'}</span>
                </div>
                <div className="col-6 text-end">
                  <span className="text-muted d-block">Target Dispatch:</span>
                  <span className="fw-semibold">{selectedOrder.deliveryDate || 'Scheduled'}</span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="bd-btn bd-btn-outline bd-btn-sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
