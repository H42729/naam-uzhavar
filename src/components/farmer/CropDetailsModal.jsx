import React, { useState } from 'react';

export default function CropDetailsModal({ product, onClose, onEdit }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'];

  return (
    <div className="nu-modal-backdrop" onClick={onClose}>
      <div
        className="nu-modal-dialog farm-animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '660px' }}
      >
        {/* Header */}
        <div className="nu-modal-header bg-light">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success fw-bold">#{product.id}</span>
            <span className="fw-bold text-dark fs-6">{product.name}</span>
          </div>
          <button type="button" className="nu-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="nu-modal-body">
          {/* Main Image & Gallery Carousel */}
          <div className="mb-3">
            <div
              className="rounded-3 overflow-hidden border mb-2 bg-light position-relative"
              style={{ height: '260px' }}
            >
              <img
                src={images[activeImgIndex]}
                alt={product.name}
                className="w-100 h-100 object-fit-cover"
              />
              <span
                className="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-2"
                style={{ fontSize: '0.75rem' }}
              >
                Photo {activeImgIndex + 1} of {images.length}
              </span>
            </div>

            {images.length > 1 && (
              <div className="d-flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn p-0 rounded-2 border overflow-hidden ${
                      activeImgIndex === idx ? 'border-success border-2 shadow-xs' : 'opacity-75'
                    }`}
                    style={{ width: '60px', height: '60px', flexShrink: 0 }}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt="thumb" className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Overview Card */}
          <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 mb-3 border border-success-subtle">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4 className="fw-bold text-dark mb-1">{product.name}</h4>
                <div className="small text-success fw-semibold">
                  {product.tamilName && `${product.tamilName} • `}
                  {product.category} • {product.grade || 'Grade A Premium'}
                </div>
              </div>
              <div className="text-end">
                <div className="fs-4 fw-bold text-success font-monospace">
                  ₹{product.price} / {product.unit || 'Kg'}
                </div>
                <span className="badge bg-success rounded-pill px-3">
                  {product.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="p-3 bg-light rounded-3 border mb-3">
              <h6 className="fw-bold text-dark small mb-1">Product Description &amp; Quality Notes:</h6>
              <p className="small text-muted mb-0">{product.description}</p>
            </div>
          )}

          {/* Location and Harvest Details Grid */}
          <div className="row g-2 mb-3 text-muted small">
            <div className="col-6 col-sm-4 p-2 bg-light rounded-2 border">
              <strong>Available Quantity:</strong>
              <div className="text-dark fw-bold font-monospace mt-1">
                {product.quantity} {product.unit || 'Kg'}
              </div>
            </div>

            <div className="col-6 col-sm-4 p-2 bg-light rounded-2 border">
              <strong>Harvest Date:</strong>
              <div className="text-dark fw-bold mt-1">{product.harvestDate || 'Fresh Picked'}</div>
            </div>

            <div className="col-6 col-sm-4 p-2 bg-light rounded-2 border">
              <strong>Available From:</strong>
              <div className="text-dark fw-bold mt-1">{product.availableFrom || 'Immediate'}</div>
            </div>

            <div className="col-6 col-sm-6 p-2 bg-light rounded-2 border">
              <strong>District &amp; Taluk:</strong>
              <div className="text-dark fw-bold mt-1">
                {product.district || 'Erode'}{product.taluk ? `, ${product.taluk}` : ''}
              </div>
            </div>

            <div className="col-12 col-sm-6 p-2 bg-light rounded-2 border">
              <strong>Pickup Location:</strong>
              <div className="text-dark fw-bold mt-1 text-truncate">
                {product.address || 'Farm Gate, Erode Cluster'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button type="button" className="btn btn-outline-secondary px-3" onClick={onClose}>
              Close
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn btn-success fw-bold px-4"
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
              >
                <i className="bi bi-pencil me-1"></i>
                Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
