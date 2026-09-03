/**
 * Language Switcher Component
 * Clean English | தமிழ் switcher fitting naturally into headers and settings.
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ className = '', variant = 'header' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`d-inline-flex align-items-center bg-light border rounded-pill p-1 shadow-xs ${className}`}
      style={{
        fontSize: '0.82rem',
        fontWeight: 600,
        userSelect: 'none',
        lineHeight: 1
      }}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        className={`btn btn-sm border-0 rounded-pill py-1 px-2.5 transition-all ${
          language === 'en'
            ? 'btn-white bg-white text-dark fw-bold shadow-xs'
            : 'text-muted hover-text-dark bg-transparent'
        }`}
        onClick={() => setLanguage('en')}
        style={{ fontSize: '0.8rem', padding: '3px 9px' }}
        title="Switch to English"
      >
        English
      </button>

      <span className="text-secondary opacity-50 px-1" style={{ fontSize: '0.75rem' }}>|</span>

      <button
        type="button"
        className={`btn btn-sm border-0 rounded-pill py-1 px-2.5 transition-all ${
          language === 'ta'
            ? 'btn-white bg-white text-dark fw-bold shadow-xs'
            : 'text-muted hover-text-dark bg-transparent'
        }`}
        onClick={() => setLanguage('ta')}
        style={{ fontSize: '0.8rem', padding: '3px 9px' }}
        title="தமிழுக்கு மாறவும்"
      >
        தமிழ்
      </button>
    </div>
  );
}
