import React, { useState } from 'react';

export default function SavingsCalculator({ onStartSelling }) {
  const [harvestKg, setHarvestKg] = useState(4000);
  const [cropCategory, setCropCategory] = useState('fruits');

  const priceMap = {
    fruits: { name: 'Alphonso Mangoes', basePrice: 85, middlemanShare: 0.42, directShare: 0.88 },
    vegetables: { name: 'Fresh Tomatoes & Greens', basePrice: 28, middlemanShare: 0.38, directShare: 0.86 },
    grains: { name: 'Sharbati Whole Wheat', basePrice: 42, middlemanShare: 0.50, directShare: 0.90 },
  };

  const selectedCrop = priceMap[cropCategory];
  const grossRevenue = harvestKg * selectedCrop.basePrice;
  const middlemanIncome = Math.round(grossRevenue * selectedCrop.middlemanShare);
  const farmDirectIncome = Math.round(grossRevenue * selectedCrop.directShare);
  const extraFarmerProfit = farmDirectIncome - middlemanIncome;
  const percentageIncrease = Math.round((extraFarmerProfit / middlemanIncome) * 100);

  return (
    <section id="benefits" className="fd-content-section" aria-label="Farmer Savings Calculator">
      <div className="fd-wrapper">
        <div className="fd-section-head">
          <span className="fd-section-tag">Direct Income Advantage</span>
          <h2 className="fd-section-heading">Farmer Profit Calculator</h2>
          <p className="fd-section-desc">
            Calculate how much more you earn every month by selling directly without Mandi middleman deductions.
          </p>
        </div>

        <div className="fd-calc-box">
          <div className="row g-4 align-items-center">
            {/* Left Inputs */}
            <div className="col-lg-6">
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '0.05em' }}>
                  Select Crop:
                </label>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                      cropCategory === 'fruits' ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCropCategory('fruits')}
                  >
                    🥭 Fruits (₹85/kg)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                      cropCategory === 'vegetables' ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCropCategory('vegetables')}
                  >
                    🍅 Veggies (₹28/kg)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold ${
                      cropCategory === 'grains' ? 'btn-success text-white shadow-sm' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCropCategory('grains')}
                  >
                    🌾 Wheat (₹42/kg)
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold small text-muted text-uppercase mb-0" style={{ letterSpacing: '0.05em' }}>
                    Monthly Harvest Yield:
                  </label>
                  <span className="badge bg-success fs-6 rounded-pill px-3 py-1">
                    {harvestKg.toLocaleString('en-IN')} kg ({ (harvestKg / 100).toFixed(0) } Quintals)
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="500"
                  max="20000"
                  step="500"
                  value={harvestKg}
                  onChange={(e) => setHarvestKg(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>500 kg (Smallholding)</span>
                  <span>10,000 kg (FPO Cluster)</span>
                  <span>20,000 kg (Cooperative)</span>
                </div>
              </div>
            </div>

            {/* Right Comparison Display */}
            <div className="col-lg-6">
              <div className="p-4 bg-white rounded-4 border shadow-sm">
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                  <div>
                    <div className="text-muted small">Traditional Mandi Middleman</div>
                    <div className="small text-danger">~50% lost in cuts</div>
                  </div>
                  <span className="fw-bold fs-5 text-dark">₹{middlemanIncome.toLocaleString('en-IN')}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                  <div>
                    <div className="text-success fw-bold">FarmDirect Direct Payout</div>
                    <div className="small text-success">88% Direct to Bank Account</div>
                  </div>
                  <span className="fw-bold fs-4 text-success">₹{farmDirectIncome.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 text-center mb-3">
                  <div className="small fw-bold">🌱 Extra Farmer Income Every Month</div>
                  <div className="fs-3 fw-bold text-success">
                    +₹{extraFarmerProfit.toLocaleString('en-IN')} <span className="fs-6">(+{percentageIncrease}%)</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-success w-100 py-2 fw-bold rounded-3"
                  onClick={onStartSelling}
                >
                  Start Selling at 88% Direct Margin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
