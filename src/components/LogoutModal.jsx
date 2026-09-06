import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LogoutModal({ isOpen, onConfirm, onCancel }) {
  const { t, language } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isTamil = language === 'ta';

  return (
    <div
      className="logout-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'logoutFadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <style>{`
        @keyframes logoutFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes logoutScaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .logout-modal-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .logout-modal-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-sizing: border-box;
        }
        .logout-cancel-btn {
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #334155;
        }
        .logout-cancel-btn:hover {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }
        .logout-confirm-btn {
          border: none;
          background-color: #dc2626;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }
        .logout-confirm-btn:hover {
          background-color: #b91c1c;
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
        }
        @media (min-width: 576px) {
          .logout-modal-actions {
            flex-direction: row;
            gap: 12px;
          }
          .logout-modal-btn {
            flex: 1;
            width: auto;
          }
        }
      `}</style>
      <div
        className="logout-modal-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          animation: 'logoutScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          zIndex: 100000
        }}
      >
        {/* Top Accent Strip */}
        <div
          style={{
            height: '5px',
            width: '100%',
            background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #16a34a 100%)'
          }}
        />

        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: '#f1f5f9',
            color: '#64748b',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={t('cancelBtn') || 'Cancel'}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ padding: '28px 24px 24px 24px' }}>
          {/* Warning Icon Badge */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <LogOut size={26} strokeWidth={2.2} />
          </div>

          {/* Title */}
          <h3
            id="logout-modal-title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              margin: '0 0 8px 0',
              fontFamily: 'inherit'
            }}
          >
            {t('confirmLogoutTitle') || (isTamil ? 'வெளியேறுவதை உறுதிப்படுத்தவும்' : 'Confirm Logout')}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: '0.925rem',
              color: '#475569',
              textAlign: 'center',
              margin: '0 0 24px 0',
              lineHeight: 1.5,
              fontFamily: 'inherit'
            }}
          >
            {t('confirmLogoutDesc') ||
              (isTamil
                ? 'நீங்கள் நாம் உழவர் தளத்திலிருந்து வெளியேற விரும்புகிறீர்களா? நீங்கள் முகப்புப் பக்கத்திற்கு அனுப்பப்படுவீர்கள்.'
                : 'Are you sure you want to log out of Naam Uzhavar? You will be returned to the home page.')}
          </p>

          {/* Action Buttons: Stacked in mobile ("one by one"), side-by-side in desktop */}
          <div className="logout-modal-actions">
            <button
              type="button"
              id="cancel-logout-btn"
              className="logout-modal-btn logout-cancel-btn"
              onClick={onCancel}
            >
              {t('cancelBtn') || (isTamil ? 'ரத்து செய்' : 'Cancel')}
            </button>

            <button
              type="button"
              id="confirm-logout-btn"
              data-testid="confirm-logout-btn"
              className="logout-modal-btn logout-confirm-btn"
              onClick={onConfirm}
            >
              <LogOut size={16} />
              <span>{t('confirmLogoutBtn') || (isTamil ? 'வெளியேறு' : 'Log Out')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
