import React from 'react';

const steps = [
  {
    step: '1',
    title: 'Farm Harvest Listing',
    desc: 'Farmers list upcoming crop yields with photo and origin verification.',
    icon: 'bi-flower1',
  },
  {
    step: '2',
    title: 'AI Quality Testing',
    desc: 'Automated sweetness Brix index and zero-residue quality verification.',
    icon: 'bi-cpu',
  },
  {
    step: '3',
    title: 'Smart Cold-Chain',
    desc: 'Temperature-controlled EV transport dispatched straight to doorsteps.',
    icon: 'bi-truck',
  },
  {
    step: '4',
    title: 'Instant Direct Payout',
    desc: '88% of retail value paid directly into the Kisan bank account via UPI.',
    icon: 'bi-credit-card-2-front',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="fd-content-section bg-white" aria-label="How FarmDirect Operates">
      <div className="fd-wrapper">
        <div className="fd-section-head">
          <span className="fd-section-tag">How It Works</span>
          <h2 className="fd-section-heading">From Seed to Table in 4 Simple Steps</h2>
          <p className="fd-section-desc">
            Bypassing 4+ middlemen layers to deliver fresher produce while maximizing farmer earnings.
          </p>
        </div>

        <div className="row g-3 g-lg-4">
          {steps.map((s) => (
            <div key={s.step} className="col-md-6 col-lg-3">
              <div className="fd-workflow-card">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="fd-step-icon-wrap">
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <span className="badge rounded-pill bg-light text-muted border fw-bold px-3 py-1">
                    Step 0{s.step}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-2 fs-5">{s.title}</h5>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
