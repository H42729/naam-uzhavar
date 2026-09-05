import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onOpenAuth }) {
  const { t } = useLanguage();

  return (
    <footer id="about" className="bg-white border-top py-5 mt-5">
      <div className="fd-wrapper">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="fd-logo-icon">
                <i className="bi bi-tree-fill"></i>
              </div>
              <span className="fd-logo-text">Naam Uzhavar</span>
            </div>
            <p className="text-muted small mb-3">
              {t('footerDesc')}
            </p>
            <div className="d-flex gap-3 text-muted">
              <i className="bi bi-twitter-x fs-5 cursor-pointer"></i>
              <i className="bi bi-linkedin fs-5 cursor-pointer"></i>
              <i className="bi bi-instagram fs-5 cursor-pointer"></i>
              <i className="bi bi-youtube fs-5 cursor-pointer"></i>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">{t('footerPlatform')}</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><a href="#how-it-works" className="text-decoration-none text-muted">{t('footerHowItWorks')}</a></li>
              <li><a href="#marketplace" className="text-decoration-none text-muted">{t('footerMarketplace')}</a></li>
              <li><a href="#benefits" className="text-decoration-none text-muted">{t('footerFarmerEconomics')}</a></li>
              <li><a href="#traceability" className="text-decoration-none text-muted">{t('footerTraceability')}</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark mb-3">{t('footerJoinUs')}</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
              <li><a href="#farmer" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">{t('footerForFarmers')}</a></li>
              <li><a href="#buyer" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">{t('footerForConsumers')}</a></li>
              <li><a href="#b2b" onClick={(e) => { e.preventDefault(); onOpenAuth('register'); }} className="text-decoration-none text-muted">{t('footerB2BWholesale')}</a></li>
              <li><a href="#partner" className="text-decoration-none text-muted">{t('footerLogisticsPartners')}</a></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <h6 className="fw-bold text-dark mb-3">{t('footerAgriUpdates')}</h6>
            <p className="text-muted small mb-2">{t('footerSubscribeHint')}</p>
            <div className="input-group">
              <input type="email" placeholder={t('footerEmailPlaceholder')} className="form-control form-control-sm" />
              <button className="btn btn-sm btn-success fw-bold" onClick={() => alert('✓ Subscribed to harvest alerts!')}>
                {t('footerJoinBtn')}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>© {new Date().getFullYear()} Naam Uzhavar Inc. {t('footerCopyright', 'All rights reserved.')}</div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>{t('footerPrivacy')}</span>
            <span>{t('footerTerms')}</span>
            <span>{t('footerSecurity')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
