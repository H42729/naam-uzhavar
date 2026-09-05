import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TraceabilityModal({ isOpen, onClose }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fd-modal-backdrop" onClick={onClose}>
      <div className="fd-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="fd-modal-header">
          <div className="fd-modal-title">
            <span>🌱</span> {t('traceabilityTitle')}
          </div>
          <button type="button" className="fd-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="fd-modal-body">
          {/* Header Summary Card */}
          <div className="p-3 mb-4 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-success mb-1">{t('traceabilityBatch')}</span>
                <h5 className="fw-bold mb-0 text-dark">{t('traceabilityProduce')}</h5>
                <p className="small text-muted mb-0">{t('traceabilityOrigin')}</p>
              </div>
              <div className="text-end">
                <span className="badge bg-primary">{t('traceabilityBlockchain')}</span>
                <div className="small text-success fw-bold mt-1">{t('traceabilityGrade')}</div>
              </div>
            </div>
          </div>

          {/* Seed to Sale Interactive Timeline */}
          <h6 className="fw-bold text-dark mb-3">{t('traceabilityTimelineTitle')}</h6>
          <div className="position-relative ps-4 mb-4" style={{ borderLeft: '2.5px solid #22c55e' }}>
            {/* Step 1 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-success rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">{t('traceabilityStep1Title')}</div>
              <div className="small text-muted">{t('traceabilityStep1Desc')}</div>
              <div className="small text-success mt-1">{t('traceabilityStep1Loc')}</div>
            </div>

            {/* Step 2 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-success rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">{t('traceabilityStep2Title')}</div>
              <div className="small text-muted">{t('traceabilityStep2Desc')}</div>
              <div className="small text-primary mt-1">{t('traceabilityStep2Loc')}</div>
            </div>

            {/* Step 3 */}
            <div className="position-relative mb-4">
              <div
                className="position-absolute bg-primary rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">{t('traceabilityStep3Title')}</div>
              <div className="small text-muted">{t('traceabilityStep3Desc')}</div>
              <div className="small text-secondary mt-1">{t('traceabilityStep3Loc')}</div>
            </div>

            {/* Step 4 */}
            <div className="position-relative">
              <div
                className="position-absolute bg-secondary rounded-circle"
                style={{ width: '14px', height: '14px', left: '-23px', top: '4px', border: '3px solid white' }}
              ></div>
              <div className="fw-bold text-dark">{t('traceabilityStep4Title')}</div>
              <div className="small text-muted">{t('traceabilityStep4Desc')}</div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
            <div className="small text-muted">
              {t('traceabilityFarmerPayout')} <strong className="text-success">₹70 / 500g box (88% of retail)</strong>
            </div>
            <button type="button" className="btn btn-outline-success btn-sm px-3" onClick={onClose}>
              {t('closeInspector')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
