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

            {/* Plain Informative Messages for Farmers and Buyers */}
            <div className="fd-hero-messages-list">
              <div className="fd-hero-message-item">
                <i className="bi bi-check-circle-fill text-success"></i>
                <span>{t('heroFarmerHint')}</span>
              </div>
              <div className="fd-hero-message-item">
                <i className="bi bi-check-circle-fill text-primary"></i>
                <span>{t('heroBuyerHint')}</span>
              </div>
            </div>

            {/* Clean Feature List */}
            <div className="fd-hero-badges-row">
              <div className="fd-badge-item">
                <i className="bi bi-check2-circle"></i>
                <span>{t('zeroCommission')}</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-truck"></i>
                <span>{t('sameDayDispatch')}</span>
              </div>
              <div className="fd-badge-item">
                <i className="bi bi-shield-check"></i>
                <span>{t('iotVerifiedQuality')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Fully-Visible Hero Illustration Card */}
          <div
            className="fd-hero-visual-bento"
            onClick={onOpenTraceability}
            title={t('viewSeedToSale')}
          >
            <img
              src={HERO_ILLUSTRATION_URL}
              alt="Naam Uzhavar - Grow, Sell, Earn"
              className="fd-hero-illustration-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
