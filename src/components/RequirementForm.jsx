import React, { useState, useEffect } from 'react';
import { CROPS_LIST, LOCATIONS_LIST } from '../data/buyerData';

export default function RequirementForm({
  initialValues,
  onSubmitRequirement
}) {
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    quantity: '500',
    maxPrice: '28',
    location: 'Dindigul',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        crop: initialValues.crop || prev.crop,
        location: initialValues.location && initialValues.location !== 'All Locations'
          ? initialValues.location
          : prev.location,
        maxPrice: initialValues.price ? String(initialValues.price + 2) : prev.maxPrice,
      }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDemoValues = () => {
    setFormData({
      crop: 'Tomato',
      quantity: '500',
      maxPrice: '28',
      location: 'Dindigul',
      deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.crop) newErrors.crop = 'Please select a crop.';
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid required quantity in kg.';
    }
    if (!formData.maxPrice || Number(formData.maxPrice) <= 0) {
      newErrors.maxPrice = 'Please enter your maximum acceptable price per kg.';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Please select a target delivery date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmitRequirement({
      crop: formData.crop,
      quantity: Number(formData.quantity),
      maxPrice: Number(formData.maxPrice),
      location: formData.location,
      deliveryDate: formData.deliveryDate,
    });
  };

  return (
    <div className="bd-card">
      <div className="bd-card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h3 className="bd-card-title mb-0">
          <i className="bi bi-layers-fill text-success"></i>
          <span>Create Bulk Produce Sourcing Requirement</span>
        </h3>
        <button
          type="button"
          className="bd-btn bd-btn-outline bd-btn-sm"
          onClick={handleDemoValues}
          title="Autofill SIH 2026 prompt example (Tomato 500kg @ ₹28/kg)"
        >
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          <span>Fill SIH Demo Example</span>
        </button>
      </div>

      <p className="text-muted small mb-4">
        Specify your bulk tonnage and maximum price threshold. FarmDirect's algorithmic aggregator instantly clusters verified regional farmers to fulfill large orders in a single consolidated delivery.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* 1. Crop */}
          <div className="col-12 col-md-6">
            <label className="bd-label">
              Crop Name <span className="text-danger">*</span>
            </label>
            <select
              name="crop"
              className={`form-select bd-input ${errors.crop ? 'is-invalid border-danger' : ''}`}
              value={formData.crop}
              onChange={handleChange}
            >
              {CROPS_LIST.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
            {errors.crop && <div className="text-danger small mt-1">{errors.crop}</div>}
          </div>

          {/* 2. Required Quantity (kg) */}
          <div className="col-12 col-md-6">
            <label className="bd-label">
              Required Quantity (kg) <span className="text-danger">*</span>
            </label>
            <div className="input-group flex-nowrap">
              <input
                type="number"
                name="quantity"
                min="10"
                step="10"
                placeholder="e.g. 500"
                className={`form-control bd-input ${errors.quantity ? 'is-invalid border-danger' : ''}`}
                value={formData.quantity}
                onChange={handleChange}
              />
              <span className="input-group-text bg-light text-muted">kg</span>
            </div>
            {errors.quantity && <div className="text-danger small mt-1">{errors.quantity}</div>}
          </div>

          {/* 3. Maximum Price/kg */}
          <div className="col-12 col-md-4">
            <label className="bd-label">
              Maximum Price / kg <span className="text-danger">*</span>
            </label>
            <div className="input-group flex-nowrap">
              <span className="input-group-text bg-light text-muted">₹</span>
              <input
                type="number"
                name="maxPrice"
                min="1"
                step="0.5"
                placeholder="e.g. 28"
                className={`form-control bd-input ${errors.maxPrice ? 'is-invalid border-danger' : ''}`}
                value={formData.maxPrice}
                onChange={handleChange}
              />
              <span className="input-group-text bg-light text-muted">/kg</span>
            </div>
            {errors.maxPrice && <div className="text-danger small mt-1">{errors.maxPrice}</div>}
          </div>

          {/* 4. Preferred Location */}
          <div className="col-12 col-md-4">
            <label className="bd-label">Preferred Location</label>
            <select
              name="location"
              className="form-select bd-input"
              value={formData.location}
              onChange={handleChange}
            >
              {LOCATIONS_LIST.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="text-muted small d-block mt-1" style={{ fontSize: '0.73rem' }}>
              Nearby farm clusters in Tamil Nadu automatically aggregated.
            </span>
          </div>

          {/* 5. Delivery Date */}
          <div className="col-12 col-md-4">
            <label className="bd-label">
              Required Delivery Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="deliveryDate"
              className={`form-control bd-input ${errors.deliveryDate ? 'is-invalid border-danger' : ''}`}
              value={formData.deliveryDate}
              onChange={handleChange}
            />
            {errors.deliveryDate && (
              <div className="text-danger small mt-1">{errors.deliveryDate}</div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button
            type="submit"
            className="bd-btn bd-btn-primary px-4 py-2 w-100 w-sm-auto justify-content-center"
          >
            <i className="bi bi-search"></i>
            <span>Find Matching Supply</span>
          </button>
        </div>
      </form>

    </div>
  );
}
