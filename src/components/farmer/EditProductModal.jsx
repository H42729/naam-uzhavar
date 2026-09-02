import React, { useState } from 'react';
import { useFarmer } from '../../context/FarmerContext';

export default function EditProductModal({ product, onClose }) {
  const { updateProduct } = useFarmer();

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || 'Vegetables',
    quantity: product?.quantity || '',
    unit: product?.unit || 'Kg',
    price: product?.price || '',
    status: product?.status || 'Active',
    grade: product?.grade || 'Grade A (Premium)',
    description: product?.description || '',
    address: product?.address || ''
  });

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(product.id, formData);
    onClose();
  };

  return (
    <div className="nu-modal-backdrop" onClick={onClose}>
      <div
        className="nu-modal-dialog farm-animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        <div className="nu-modal-header bg-light">
          <div className="nu-modal-title">
            <i className="bi bi-pencil-square text-success"></i>
            <span>Edit Product Listing</span>
          </div>
          <button type="button" className="nu-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="nu-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Product Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-dark">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains & Pulses">Grains &amp; Pulses</option>
                  <option value="Spices & Herbs">Spices &amp; Herbs</option>
                  <option value="Flowers">Flowers</option>
                  <option value="Dairy & Poultry">Dairy &amp; Poultry</option>
                  <option value="Organic Special">Organic Special</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small fw-bold text-dark">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active (In Stock)</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-4">
                <label className="form-label small fw-bold text-dark">Quantity</label>
                <input
                  type="number"
                  required
                  className="form-control font-monospace"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="col-4">
                <label className="form-label small fw-bold text-dark">Unit</label>
                <select
                  className="form-select"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="Kg">Kg</option>
                  <option value="Quintal">Quintal</option>
                  <option value="Ton">Ton</option>
                  <option value="Piece">Piece</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Litre">Litre</option>
                </select>
              </div>

              <div className="col-4">
                <label className="form-label small fw-bold text-dark">Price (₹/unit)</label>
                <input
                  type="number"
                  required
                  className="form-control font-monospace"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Quality Grade</label>
              <select
                className="form-select"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              >
                <option value="Grade A (Premium)">Grade A (Premium)</option>
                <option value="Grade B (Standard)">Grade B (Standard)</option>
                <option value="100% Certified Organic">100% Certified Organic</option>
                <option value="Export Quality">Export Quality</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Pickup Location / Notes</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success fw-bold px-4">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
