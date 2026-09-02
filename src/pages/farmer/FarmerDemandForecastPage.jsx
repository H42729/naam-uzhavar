import React, { useState } from 'react';
import FarmerLayout from '../../components/farmer/FarmerLayout';

const MANDI_BENCHMARKS = [
  {
    crop: 'Tomato (நாட்டு தக்காளி)',
    erodeRate: 24,
    kovaiRate: 27,
    chennaiRate: 31,
    demandLevel: 'High Surge (+18%)',
    trend: 'up',
    color: 'success',
    advice: 'Good time to harvest & sell. High deficit in Erode & Coimbatore clusters.'
  },
  {
    crop: 'Red Onions (சின்ன வெங்காயம்)',
    erodeRate: 34,
    kovaiRate: 36,
    chennaiRate: 38,
    demandLevel: 'Steady (+7%)',
    trend: 'up',
    color: 'warning',
    advice: 'Demand is increasing. Prime dispatch window in the next 48 to 72 hours.'
  },
  {
    crop: 'Turmeric (ஈரோடு விரலி மஞ்சள்)',
    erodeRate: 140,
    kovaiRate: 146,
    chennaiRate: 155,
    demandLevel: 'Surge Demand (+12%)',
    trend: 'up',
    color: 'success',
    advice: 'Direct export procurement active in Perundurai Agro SEZ.'
  },
  {
    crop: 'Potato (உருளைக்கிழங்கு)',
    erodeRate: 28,
    kovaiRate: 28,
    chennaiRate: 30,
    demandLevel: 'Surplus Influx (-4%)',
    trend: 'down',
    color: 'secondary',
    advice: 'Consider short-term cold storage holding (7 days) until prices recover.'
  },
  {
    crop: 'Banana (பச்சை வாழை)',
    erodeRate: 42,
    kovaiRate: 46,
    chennaiRate: 50,
    demandLevel: 'Growing Demand (+9%)',
    trend: 'up',
    color: 'success',
    advice: 'Festival season arrival boost anticipated next week.'
  }
];

export default function FarmerDemandForecastPage() {
  const [selectedCrop, setSelectedCrop] = useState(MANDI_BENCHMARKS[0]);
  const [acresInput, setAcresInput] = useState('2');

  const calculatedOutputKg = Number(acresInput || 1) * 3500;
  const estimatedRevenue = calculatedOutputKg * selectedCrop.erodeRate;

  return (
    <FarmerLayout>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold">
              📊 Agricultural Market Intelligence
            </span>
            <span className="text-muted small">Updated: Today, 08:00 AM IST</span>
          </div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: '1.85rem' }}>
            Regional Demand Forecast &amp; Mandi Arbitrage
          </h1>
          <p className="text-muted small mb-0">
            Real-time market analytics aggregated from Tamil Nadu APMC Mandis, supermarket order pipelines, and seasonal telemetry.
          </p>
        </div>
      </div>

      {/* Demand Highlights Grid (3 Cards) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="farm-card p-3 border-success border-opacity-50 bg-success-subtle bg-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-success text-uppercase">Top High-Demand Crop</span>
              <span className="badge bg-success text-white">+18% Demand</span>
            </div>
            <h4 className="fw-bold text-dark mb-1">Tomato (நாட்டு தக்காளி)</h4>
            <div className="small text-muted mb-2">
              Erode Mandi Rate: <strong className="text-success font-monospace">₹24 - ₹27/kg</strong>
            </div>
            <p className="small text-dark mb-0">
              High consumer demand in Kovai &amp; Erode retail hubs with supply deficit of 42 tons.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="farm-card p-3 border-warning border-opacity-50 bg-warning-subtle bg-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-warning-emphasis text-uppercase">Rising Trend Crop</span>
              <span className="badge bg-warning text-dark">+12% Export</span>
            </div>
            <h4 className="fw-bold text-dark mb-1">Turmeric (ஈரோடு மஞ்சள்)</h4>
            <div className="small text-muted mb-2">
              Perundurai Mandi: <strong className="text-dark font-monospace">₹140 - ₹155/kg</strong>
            </div>
            <p className="small text-dark mb-0">
              Bulk organic orders arriving for pharmaceutical and retail processing.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="farm-card p-3 border-info border-opacity-50 bg-info-subtle bg-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-primary text-uppercase">Recommended Strategy</span>
              <span className="badge bg-primary text-white">Direct Selling</span>
            </div>
            <h4 className="fw-bold text-dark mb-1">Optimal 48h Window</h4>
            <div className="small text-muted mb-2">
              Avoid intermediary commissions of <strong className="text-danger font-monospace">12-18%</strong>
            </div>
            <p className="small text-dark mb-0">
              Direct B2B delivery to supermarkets yields an extra ₹3-₹5/kg net farmer margin.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Mandi Rate Arbitrage Table & Production Estimator */}
      <div className="row g-4 mb-4">
        {/* Left: Mandi Benchmarks Table (8 cols) */}
        <div className="col-lg-8">
          <div className="farm-card">
            <div className="farm-card-header">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-bar-chart-line-fill text-success fs-5"></i>
                <div>
                  <h3 className="farm-card-title fs-5">Regional Mandi Price Comparison</h3>
                  <span className="text-muted small">Live benchmark rates per kg across key hubs</span>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="nu-table">
                <thead>
                  <tr>
                    <th>CROP / PRODUCE</th>
                    <th>ERODE MANDI</th>
                    <th>COIMBATORE</th>
                    <th>CHENNAI HUB</th>
                    <th>DEMAND TREND</th>
                    <th className="text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {MANDI_BENCHMARKS.map((item, idx) => (
                    <tr
                      key={idx}
                      className={selectedCrop.crop === item.crop ? 'table-success' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCrop(item)}
                    >
                      <td>
                        <div className="fw-bold text-dark">{item.crop}</div>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          {item.advice}
                        </div>
                      </td>
                      <td className="font-monospace fw-bold text-dark">₹{item.erodeRate}/kg</td>
                      <td className="font-monospace fw-bold text-dark">₹{item.kovaiRate}/kg</td>
                      <td className="font-monospace fw-bold text-success">₹{item.chennaiRate}/kg</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            item.trend === 'up'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : 'bg-secondary-subtle text-secondary border'
                          }`}
                        >
                          {item.demandLevel}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCrop(item);
                          }}
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Production & Yield Calculator (4 cols) */}
        <div className="col-lg-4">
          <div className="farm-card">
            <h4 className="fw-bold text-dark fs-6 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-calculator-fill text-success"></i>
              <span>Production Yield &amp; Revenue Planner</span>
            </h4>

            <div className="p-3 bg-light rounded-3 border mb-3">
              <div className="small text-muted fw-bold mb-1">Target Crop:</div>
              <div className="fw-bold text-dark fs-6">{selectedCrop.crop}</div>
              <div className="small text-success mt-1">
                <i className="bi bi-lightbulb-fill me-1 text-warning"></i>
                {selectedCrop.advice}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Your Farm Plot Size (Acres)</label>
              <div className="input-group">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  className="form-control font-monospace"
                  value={acresInput}
                  onChange={(e) => setAcresInput(e.target.value)}
                />
                <span className="input-group-text bg-light text-muted">Acres</span>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="small">Estimated Harvest Yield:</span>
                <span className="fw-bold font-monospace">{calculatedOutputKg.toLocaleString()} Kg</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="small">Mandi Base Benchmark:</span>
                <span className="fw-bold font-monospace">₹{selectedCrop.erodeRate} / Kg</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top border-success-subtle">
                <span className="fw-bold">Estimated Gross Revenue:</span>
                <span className="fs-5 fw-bold text-success font-monospace">
                  ₹{estimatedRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>
              * Yield calculations use standard Tamil Nadu Agricultural University (TNAU) agronomy benchmarks.
            </p>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
