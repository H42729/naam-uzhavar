import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function MatchedSupply({
  matchedSupplies = [],
  onCreateNewRequirement
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bd-card">
      <div className="bd-card-header d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
        <div>
          <h3 className="bd-card-title">
            <i className="bi bi-diagram-3-fill text-primary"></i>
            <span>{t('activeMatchedSupply')}</span>
          </h3>
          <span className="text-muted small">
            {t('matchedSupplySubtitle')}
          </span>
        </div>
        <button
          type="button"
          className="bd-btn bd-btn-primary bd-btn-sm flex-shrink-0"
          onClick={onCreateNewRequirement}
        >
          <i className="bi bi-plus-lg"></i>
          <span>{t('bulkRequirement')}</span>
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
            {t('createRequirement')}
          </button>
        </div>
      ) : (
        <div className="bd-table-wrap">
          <div className="table-responsive">
            <table className="bd-table">
              <thead>
                <tr>
                  <th>{t('crop')}</th>
                  <th>Required Qty</th>
                  <th>Matched Qty</th>
                  <th>{t('farmers')}</th>
                  <th>{t('avgPrice')}</th>
                  <th>{t('status')}</th>
                  <th className="text-end pe-3">Action</th>
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
                    <td className="text-end pe-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-xs"
                        onClick={() =>
                          navigate(
                            `/buyer/aggregate-details/${item.id || item.crop}?qty=${item.matchedQty}`
                          )
                        }
                      >
                        <i className="bi bi-eye-fill"></i>
                        <span>See Details</span>
                      </button>
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
