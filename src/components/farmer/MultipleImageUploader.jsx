import React, { useState, useRef } from 'react';

const PRESET_PRODUCE_IMAGES = [
  {
    name: 'Fresh Red Tomatoes',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Vine Tomatoes',
    url: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fresh Red Onions',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dry Shallots',
    url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Organic Turmeric',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Farm Potatoes',
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Green Bananas',
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fresh Carrots',
    url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=600&auto=format&fit=crop&q=80'
  }
];

export default function MultipleImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  maxSizeMB = 5
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    setUploadError('');
    if (!files || files.length === 0) return;

    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validation: Type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not a supported image (JPG, PNG, WEBP only).`);
        return;
      }

      // Validation: Size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds ${maxSizeMB}MB size limit.`);
        return;
      }

      validFiles.push(file);
    }

    if (images.length + validFiles.length > maxImages) {
      setUploadError(`You can upload a maximum of ${maxImages} images per product.`);
      return;
    }

    // Simulate progress UI
    setUploadProgress(20);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 35;
      });
    }, 120);

    const newImageUrls = [];
    let processed = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImageUrls.push(e.target.result);
        processed++;
        if (processed === validFiles.length) {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => {
            setUploadProgress(null);
            onChange([...images, ...newImageUrls]);
          }, 300);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const selected = images[indexToPrimary];
    const rest = images.filter((_, idx) => idx !== indexToPrimary);
    onChange([selected, ...rest]);
  };

  const handleAddPreset = (url) => {
    if (images.includes(url)) return;
    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      return;
    }
    setUploadError('');
    onChange([...images, url]);
  };

  return (
    <div className="farm-image-uploader-wrap">
      {/* Upload Zone */}
      <div
        className={`farm-image-dropzone ${isDragging ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp, image/jpg"
          className="d-none"
          onChange={handleFileInputChange}
        />
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div
            className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mb-3 shadow-xs"
            style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}
          >
            <i className="bi bi-cloud-arrow-up-fill"></i>
          </div>
          <h6 className="fw-bold text-dark mb-1">
            Drag &amp; Drop product photos here, or <span className="text-success">Browse Files</span>
          </h6>
          <p className="text-muted small mb-0">
            Supports JPG, PNG, WEBP (Up to {maxSizeMB}MB each • Max {maxImages} images).
            The first photo is your main cover.
          </p>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="mt-3">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Optimizing and uploading images...</span>
            <span className="fw-bold text-success">{uploadProgress}%</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success progress-bar-striped progress-bar-animated"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {uploadError && (
        <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mt-3 rounded-3">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Quick Produce Photo Presets */}
      <div className="mt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="small text-muted">
          <i className="bi bi-camera-fill text-success me-1"></i>
          <span>
            {images.length} of {maxImages} images uploaded
          </span>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold"
          onClick={() => setShowPresets(!showPresets)}
        >
          <i className="bi bi-stars me-1"></i>
          {showPresets ? 'Hide Sample Photos' : 'Choose Sample Produce Photos'}
        </button>
      </div>

      {showPresets && (
        <div className="p-3 bg-light rounded-4 border mt-2 farm-animate-fade">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-dark small">
              ✨ One-Click High-Definition Crop Samples:
            </span>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Click any photo to add
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {PRESET_PRODUCE_IMAGES.map((preset, idx) => {
              const isSelected = images.includes(preset.url);
              return (
                <button
                  key={idx}
                  type="button"
                  className={`btn btn-sm d-flex align-items-center gap-2 rounded-3 border ${
                    isSelected ? 'btn-success fw-bold' : 'btn-white bg-white text-dark'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => handleAddPreset(preset.url)}
                  disabled={isSelected || images.length >= maxImages}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="rounded-2"
                    style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                  />
                  <span>{preset.name}</span>
                  {isSelected && <i className="bi bi-check2"></i>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gallery Grid Preview */}
      {images.length > 0 && (
        <div className="farm-image-gallery">
          {images.map((imgUrl, index) => {
            const isPrimary = index === 0;
            return (
              <div
                key={index}
                className={`farm-image-thumb ${isPrimary ? 'primary-thumb' : ''}`}
              >
                <img src={imgUrl} alt={`Product preview ${index + 1}`} />

                {/* Primary Tag */}
                {isPrimary ? (
                  <span
                    className="badge bg-success position-absolute top-0 start-0 m-1 shadow-xs fw-bold"
                    style={{ fontSize: '0.65rem' }}
                  >
                    ★ Primary Cover
                  </span>
                ) : (
                  <span
                    className="badge bg-dark bg-opacity-75 position-absolute top-0 start-0 m-1 shadow-xs"
                    style={{ fontSize: '0.65rem' }}
                  >
                    #{index + 1}
                  </span>
                )}

                {/* Hover Actions */}
                <div className="farm-thumb-actions">
                  {!isPrimary && (
                    <button
                      type="button"
                      className="btn btn-sm btn-light rounded-circle p-1"
                      title="Set as Primary Cover Image"
                      onClick={() => handleSetPrimary(index)}
                      style={{ width: '32px', height: '32px' }}
                    >
                      <i className="bi bi-star-fill text-warning"></i>
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger rounded-circle p-1"
                    title="Remove Photo"
                    onClick={() => handleRemoveImage(index)}
                    style={{ width: '32px', height: '32px' }}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
