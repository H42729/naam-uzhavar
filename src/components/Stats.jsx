import React from 'react';

const statsData = [
  {
    id: 'farmers',
    value: '50,000+',
    label: 'Farmers Connected',
    sub: 'Across 14 States',
    icon: 'bi-people',
  },
  {
    id: 'products',
    value: '200+',
    label: 'Crops & Grains',
    sub: 'Direct from Mandi',
    icon: 'bi-box-seam',
  },
  {
    id: 'orders',
    value: '1,000,000+',
    label: 'Orders Delivered',
    sub: 'Zero Delay Fleet',
    icon: 'bi-truck',
  },
  {
    id: 'savings',
    value: '88%',
    label: 'Direct Kisan Share',
    sub: '+43% vs Middlemen',
    icon: 'bi-graph-up-arrow',
    isGreen: true,
  },
];

export default function Stats({ onSelectStat }) {
  return (
    <section className="fd-stats-section" aria-label="Key Platform Metrics">
      <div className="fd-wrapper">
        <div className="fd-stats-container">
          <div className="row g-3 g-lg-4">
            {statsData.map((stat, idx) => (
              <div key={stat.id} className="col-6 col-lg-3">
                <div
                  className="fd-stat-card"
                  onClick={() => onSelectStat && onSelectStat(stat)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fd-stat-icon-wrap">
                      <i className={`bi ${stat.icon}`}></i>
                    </span>
                    <span className="small text-muted" style={{ fontSize: '0.75rem' }}>{stat.sub}</span>
                  </div>

                  <div className={`fd-stat-number ${stat.isGreen ? 'green-accent' : ''}`}>
                    {stat.value}
                  </div>
                  <div className="fd-stat-title">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
