import React from 'react';

const HERO_ILLUSTRATION_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCRaD6vOUUYuAKFMA8yEr4AfuYl7EF_qLYL9MJoRUYrupwM9NyCv-AI73KNmQWweSob69KY30Ew3DNdNkt_gUqZpho7HF3mp8swMOb3ute2U-3CJ5GwnqZQMwlTEN3Azlo1bSuW8QjUOyC5Rv7DvCX3TIesb3rWDP6YHE7YDls1r9uw93cdtCxHusXsyALuXIKFe3kb6fpV7wnvqoi81fNxZ0NbwyPvkHPhpNB2edD2TnBIYTXKFx6-A';

export default function Hero({ onStartSelling, onExploreMarketplace, onOpenTraceability }) {
  return (
    <section className="fd-hero-section" aria-label="Hero Introduction">
      <div className="fd-wrapper">
        <div className="fd-hero-bento-grid">
          {/* Left Column: Clean & Welcoming Proposition */}
          <div className="fd-hero-text-card">
            <div className="fd-trust-chip">
              <span className="fd-pulse-dot" aria-hidden="true"></span>
              <span>Direct Farm-to-Buyer Ecosystem</span>
            </div>

            <h1 className="fd-hero-headline">
              Connect Directly.<br />
              Earn Better.<br />
              <span className="highlight-text">Buy Smarter.</span>
            </h1>

            <p className="fd-hero-paragraph">
              Empowering farmers & FPOs to sell fresh harvest directly to consumers and businesses. Zero middleman cuts, transparent ₹ INR pricing, and same-day delivery.
            </p>

            <div className="fd-hero-btn-row">
              <button
                type="button"
                className="fd-btn-start-selling"
                onClick={onStartSelling}
              >
                <span>Start Selling as Farmer</span>
                <i className="bi bi-arrow-right"></i>
              </button>

              <button
                type="button"
                className="fd-btn-explore-market"
                onClick={onExploreMarketplace}
              >
                <i className="bi bi-shop"></i>
                <span>Explore Mandi</span>
              </button>
            </div>

            {/* Clean Feature List */}
            <div className="fd-hero-badges-row">
              <div className="fd-badge-item">
                <i className="bi bi-check2-circle"></i>
                <span>0% Commission</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-lightning-charge"></i>
                <span>Same-Day Dispatch</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-shield-check"></i>
                <span>IoT Verified Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div
            className="fd-hero-visual-bento"
            onClick={onOpenTraceability}
            title="Click to view Seed-to-Sale Traceability"
          >
            <div
              className="fd-hero-bg-cover"
              style={{ backgroundImage: `url(${HERO_ILLUSTRATION_URL})` }}
              role="img"
              aria-label="FarmDirect Agricultural Supply Chain"
            ></div>

            <div className="fd-hero-bottom-overlay">
              <div className="fd-tracking-caption">
                <span className="fd-pulse-dot"></span>
                <span>Seed-to-Sale IoT Telemetry</span>
              </div>

              <button
                type="button"
                className="fd-btn-inspect-batch"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTraceability();
                }}
              >
                <span>Live Batch ↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
