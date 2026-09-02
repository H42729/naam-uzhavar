import React, { useState, useRef, useEffect } from 'react';

/**
 * SearchableSelect
 * An accessible, keyboard-friendly searchable select component.
 * Allows quick filtering, keyboard selection, reset, and clean visual feedback.
 */
export default function SearchableSelect({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  searchPlaceholder = 'Type to search...',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  disabledHelper = 'Please make previous selection first',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }
  };

  const handleSelect = (val) => {
    if (onChange) {
      onChange({ target: { name, value: val } });
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
  };

  return (
    <div className="mb-3" ref={containerRef}>
      {label && (
        <label
          htmlFor={id || name}
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
          {options.length > 0 && !disabled && (
            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
              {options.length} choices
            </span>
          )}
        </label>
      )}

      <div className="position-relative">
        {/* Trigger Button */}
        <button
          type="button"
          id={id || name}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`form-select text-start d-flex align-items-center justify-content-between py-2 px-3 ${
            error ? 'is-invalid border-danger' : ''
          }`}
          style={{
            backgroundColor: disabled ? '#f8fafc' : '#ffffff',
            borderColor: error ? '#dc3545' : isOpen ? '#198754' : '#cbd5e1',
            boxShadow: isOpen ? '0 0 0 0.2rem rgba(25, 135, 84, 0.15)' : 'none',
            color: selectedOption ? '#0f172a' : '#94a3b8',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.92rem',
            minHeight: '42px',
          }}
        >
          <span className="text-truncate me-2">
            {selectedOption ? selectedOption.label : disabled ? disabledHelper : placeholder}
          </span>
          <div className="d-flex align-items-center gap-1 text-muted">
            {selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                className="btn-close btn-close-xs me-1"
                aria-label="Clear selection"
                onClick={handleClear}
                style={{ fontSize: '0.65rem' }}
              />
            )}
            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} small`}></i>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            className="position-absolute start-0 end-0 bg-white border rounded-3 shadow-lg mt-1 p-2"
            style={{
              zIndex: 1050,
              maxHeight: '300px',
              animation: 'fadeIn 0.15s ease-in-out',
            }}
          >
            {/* Search Input Box */}
            <div className="input-group input-group-sm mb-2">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control border-start-0"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                style={{ outline: 'none', boxShadow: 'none' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            {/* Listbox */}
            <div
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              style={{ maxHeight: '200px', overflowY: 'auto' }}
            >
              {filteredOptions.length === 0 ? (
                <div className="text-center py-3 text-muted small">
                  <i className="bi bi-emoji-neutral me-1"></i> No matching results found
                </div>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2 cursor-pointer small"
                      style={{
                        backgroundColor: isSelected
                          ? '#e8f5e9'
                          : isHighlighted
                          ? '#f1f5f9'
                          : 'transparent',
                        color: isSelected ? '#166534' : '#1e293b',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <i className="bi bi-check2 text-success fw-bold"></i>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
