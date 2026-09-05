/**
 * Language Switcher Component
 * Clean English | தமிழ் switcher using the exact button design from the Farmer Module (FarmerTopNav):
 * - Slate-50 background with fine slate-200 border and rounded-full capsule.
 * - Cobalt Blue (#2563EB font-black) for active language, slate-500 for inactive.
 * - Clean vertical pipe separator with no inner button backgrounds.
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 min-h-[34px] sm:min-h-[36px] shadow-2xs select-none ${className}`}
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '9999px',
        padding: '3px 12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        minHeight: '34px'
      }}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`border-0 bg-transparent cursor-pointer font-bold transition-colors p-0 text-xs sm:text-sm leading-none ${
          language === 'en' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
        }`}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          color: language === 'en' ? '#2563EB' : '#64748b',
          fontWeight: language === 'en' ? 900 : 700,
          fontSize: '13px',
          lineHeight: 1
        }}
        title="Switch to English"
      >
        English
      </button>
      <span
        className="text-slate-300 font-normal select-none leading-none"
        style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1 }}
      >
        |
      </span>
      <button
        type="button"
        onClick={() => setLanguage('ta')}
        className={`border-0 bg-transparent cursor-pointer font-bold transition-colors p-0 text-xs sm:text-sm leading-none ${
          language === 'ta' ? 'text-[#2563EB] font-black' : 'text-slate-500 hover:text-slate-800'
        }`}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          color: language === 'ta' ? '#2563EB' : '#64748b',
          fontWeight: language === 'ta' ? 900 : 700,
          fontSize: '13px',
          lineHeight: 1
        }}
        title="தமிழுக்கு மாறவும்"
      >
        தமிழ்
      </button>
    </div>
  );
}
