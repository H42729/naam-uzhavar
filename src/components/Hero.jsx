import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const HERO_ILLUSTRATION_URL = '/naam-uzhavar-hero-illustration.jpg';

export default function Hero({ onStartSelling, onExploreMarketplace, onOpenTraceability }) {
  const { t } = useLanguage();

  return (
    <section className="fd-hero-section" aria-label="Hero Introduction">
      <div className="fd-wrapper">
        <div className="fd-hero-bento-grid">
          {/* Left Column: Clean & Welcoming Proposition */}
          <div className="fd-hero-text-card">
            <div className="fd-trust-chip">
              <span className="fd-pulse-dot" aria-hidden="true"></span>
              <span>{t('heroTrustChip')}</span>
            </div>

            <h1 className="fd-hero-headline">
              {t('heroHeadline1')}<br />
              {t('heroHeadline2')}<br />
              <span className="highlight-text">{t('heroHeadline3')}</span>
            </h1>

            <p className="fd-hero-paragraph">
              {t('heroParagraph')}
            </p>

            <div className="fd-hero-btn-row">
              <button
                type="button"
                className="fd-btn-start-selling"
                onClick={onStartSelling}
              >
                <span>{t('startSellingFarmer')}</span>
                <i className="bi bi-arrow-right"></i>
              </button>

              <button
                type="button"
                className="fd-btn-explore-market"
                onClick={onExploreMarketplace}
              >
                <i className="bi bi-shop"></i>
                <span>{t('exploreMandi')}</span>
              </button>
            </div>

            {/* Clean Feature List */}
            <div className="fd-hero-badges-row">
              <div className="fd-badge-item">
                <i className="bi bi-check2-circle"></i>
                <span>{t('zeroCommission')}</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-lightning-charge"></i>
                <span>{t('sameDayDispatch')}</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-shield-check"></i>
                <span>{t('iotVerifiedQuality')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div
            className="fd-hero-visual-bento"
            onClick={onOpenTraceability}
            title={t('viewSeedToSale')}
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
                <span>{t('seedToSaleTelemetry')}</span>
              </div>

              <button
                type="button"
                className="fd-btn-inspect-batch"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTraceability();
                }}
              >
                <span>{t('liveBatch')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
