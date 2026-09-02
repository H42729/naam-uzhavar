import React from 'react';

/**
 * FormInput
 * Reusable input for text, tel, number, and textarea fields.
 * Includes clear labels, required/optional badges, error display, and accessible attributes.
 */
export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  helperText = '',
  icon = '',
  suffix = '',
  rows = 3,
  min,
  max,
  maxLength,
  disabled = false,
  autoComplete,
}) {
  const inputId = id || name;

  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor={inputId}
          className="form-label d-flex align-items-center justify-content-between mb-1"
          style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}
        >
          <span>
            {label}
            {required ? (
              <span className="text-danger ms-1" title="Required field">*</span>
            ) : (
              <span className="badge bg-light text-muted ms-2 fw-normal" style={{ fontSize: '0.72rem' }}>
                Optional
              </span>
            )}
          </span>
          {maxLength && (
            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
              {(value || '').length}/{maxLength}
            </span>
          )}
        </label>
      )}

      <div className="input-group">
        {icon && (
          <span
            className={`input-group-text bg-light text-muted ${
              error ? 'border-danger' : ''
            }`}
          >
            <i className={`bi ${icon}`}></i>
          </span>
        )}

        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            className={`form-control py-2 px-3 ${error ? 'is-invalid' : ''}`}
            style={{
              fontSize: '0.92rem',
              borderColor: error ? '#dc3545' : '#cbd5e1',
              resize: 'vertical',
            }}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            maxLength={maxLength}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`form-control py-2 px-3 ${error ? 'is-invalid' : ''}`}
            style={{
              fontSize: '0.92rem',
              borderColor: error ? '#dc3545' : '#cbd5e1',
            }}
          />
        )}

        {suffix && (
          <span className="input-group-text bg-light text-muted small">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <div className="text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
