import React from 'react';

/**
 * FormSection
 * Visual container for grouping related form fields with icon, title, description and divider.
 */
export default function FormSection({ icon, title, description, children }) {
  return (
    <div className="mb-4 pt-2">
      <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
        {icon && (
          <div
            className="rounded-2 p-1 d-flex align-items-center justify-content-center"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#e8f5e9',
              color: '#166534',
              fontSize: '0.9rem',
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
        )}
        <div>
          <h4
            className="mb-0 text-dark"
            style={{ fontSize: '0.96rem', fontWeight: 700, letterSpacing: '-0.2px' }}
          >
            {title}
          </h4>
          {description && (
            <p className="text-muted small mb-0" style={{ fontSize: '0.76rem' }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}
