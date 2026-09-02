import React from 'react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer id="about" className="bg-white border-top py-5 mt-5">
      <div className="fd-wrapper">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="fd-logo-icon">
                <i className="bi bi-tree-fill"></i>
              </div>
              <span className="fd-logo-text">FarmDirect</span>
            </div>
            <p className="text-muted small mb-3">
              Empowering farmers & FPOs with transparent digital agricultural supply chains, cold-chain logistics, and zero-middleman direct consumer pricing.
            </p>
            <div className="d-flex gap-3 text-muted">
              <i className="bi bi-twitter-x fs-5 cursor-pointer"></i>
              <i className="bi bi-linkedin fs-5 cursor-pointer"></i>
              <i className="bi bi-instagram fs-5 cursor-pointer"></i>
              <i className="bi bi-youtube fs-5 cursor-pointer"></i>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">Platform</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><a href="#how-it-works" className="text-decoration-none text-muted">How It Works</a></li>
              <li><a href="#marketplace" className="text-decoration-none text-muted">Marketplace</a></li>
              <li><a href="#benefits" className="text-decoration-none text-muted">Farmer Economics</a></li>
              <li><a href="#traceability" className="text-decoration-none text-muted">IoT Traceability</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">Join Us</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><a href="#farmer" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">For Farmers & FPOs</a></li>
              <li><a href="#buyer" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">For Consumers</a></li>
              <li><a href="#b2b" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">B2B Wholesale</a></li>
              <li><a href="#partner" className="text-decoration-none text-muted">Logistics Partners</a></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <h6 className="fw-bold text-dark mb-3">Agricultural Updates</h6>
            <p className="text-muted small mb-2">Subscribe for harvest alerts and market price insights.</p>
            <div className="input-group">
              <input type="email" placeholder="Your email..." className="form-control form-control-sm" />
              <button className="btn btn-sm btn-success fw-bold" onClick={() => alert('✓ Subscribed to harvest alerts!')}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>© {new Date().getFullYear()} FarmDirect Inc. All rights reserved.</div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
