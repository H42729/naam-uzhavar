import React from 'react';

export default function MatchedSupply({
  matchedSupplies = [],
  onCreateNewRequirement
}) {
  return (
    <div className="bd-card">
      <div className="bd-card-header">
        <div>
          <h3 className="bd-card-title">
            <i className="bi bi-diagram-3-fill text-success"></i>
            <span>Active Matched Supply Aggregations</span>
          </h3>
          <span className="text-muted small">
            Requirements paired across verified farmer pools and ready for purchase
          </span>
        </div>
        <button
          type="button"
          className="bd-btn bd-btn-primary bd-btn-sm"
          onClick={onCreateNewRequirement}
        >
          <i className="bi bi-plus-lg"></i>
          <span>New Bulk Requirement</span>
        </button>
      </div>

      {matchedSupplies.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-diagram-3 fs-1 text-secondary mb-2 d-block"></i>
          <h5 className="fw-semibold text-dark">No Active Matched Supplies Yet</h5>
          <p className="small mb-3">
            Post a bulk requirement to let our aggregator assemble farmer lots into single consolidated shipments.
          </p>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm"
            onClick={onCreateNewRequirement}
          >
            Create Requirement
          </button>
        </div>
      ) : (
        <div className="bd-table-wrap">
          <div className="table-responsive">
            <table className="bd-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Required Qty</th>
                  <th>Matched Qty</th>
                  <th>Farmers Matched</th>
                  <th>Avg Price / kg</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {matchedSupplies.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>
                      <div className="fw-bold text-dark">{item.crop}</div>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Batch {item.id || `MS-${idx + 101}`}
                      </span>
                    </td>
                    <td className="font-monospace text-muted">{item.requiredQty} kg</td>
                    <td className="font-monospace fw-bold text-success">
                      {item.matchedQty} kg
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-people me-1 text-primary"></i>
                        {item.farmersMatched} farmers
                      </span>
                    </td>
                    <td className="font-monospace fw-semibold text-dark">
                      ₹{typeof item.avgPrice === 'number' ? item.avgPrice.toFixed(2) : item.avgPrice}/kg
                    </td>
                    <td>
                      <span className="bd-badge bd-badge-confirmed">
                        <i className="bi bi-check-circle-fill"></i>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
