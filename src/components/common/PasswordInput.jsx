import React, { useState } from 'react';

/**
 * PasswordInput
 * Secure password input field with Show/Hide toggle button and error display.
 */
export default function PasswordInput({
  id,
  name,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter password',
  required = true,
  error = '',
  helperText = '',
  autoComplete = 'new-password',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label
          htmlFor={inputId}
          className="form-label mb-0"
          style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}
        >
          {label}
          {required && <span className="text-danger ms-1" title="Required field">*</span>}
        </label>
      </div>

      <div className="input-group">
        <span
          className={`input-group-text bg-light text-muted ${
            error ? 'border-danger' : ''
          }`}
        >
          <i className="bi bi-shield-lock"></i>
        </span>

        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`form-control py-2 px-3 ${error ? 'is-invalid' : ''}`}
          style={{
            fontSize: '0.92rem',
            borderColor: error ? '#dc3545' : '#cbd5e1',
          }}
        />

        <button
          type="button"
          tabIndex={-1}
          className="btn btn-outline-secondary border-start-0 bg-light"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          style={{
            borderColor: error ? '#dc3545' : '#cbd5e1',
          }}
        >
          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
        </button>
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
