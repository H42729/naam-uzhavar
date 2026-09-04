/**
 * Add Harvest Page
 * Route: /farmer/add-harvest & /farmer/add-product
 * Simple, farmer-friendly form with large touch-friendly controls, quick crop chips,
 * image preview/removal, inline validation, and clear publish success state.
 */

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains & Pulses',
  'Spices & Herbs',
  'Flowers'
];

const UNITS = ['kg', 'Quintal', 'Ton', 'Bags (50kg)', 'Boxes (20kg)'];

export default function AddProductPage() {
  const navigate = useNavigate();
  const { addHarvest, farmerProfile } = useFarmer();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    availableFrom: new Date().toISOString().split('T')[0],
    location: `${farmerProfile?.district || 'Dindigul'}, Tamil Nadu`,
    description: '',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const photoTriggerRef = useRef(null);

  // Field refs for smooth scrolling & focusing first invalid field
  const fieldRefs = {
    images: useRef(null),
    name: useRef(null),
    category: useRef(null),
    quantity: useRef(null),
    price: useRef(null),
    availableFrom: useRef(null),
    location: useRef(null)
  };

  // Photo handlers
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newUrls]
    }));
    // Clear photo error state immediately on snap/select
    setFormErrors((prev) => ({ ...prev, images: '' }));
    e.target.value = '';
  };

  const handleRemovePhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Comprehensive Form Validation
  const validate = () => {
    const errors = {};

    // 1. Photos Array
    if (!formData.images || formData.images.length === 0) {
      errors.images =
        t('atLeastOnePhotoRequired') ||
        (language === 'ta'
          ? 'தயவுசெய்து உங்கள் விளைச்சலின் குறைந்தது ஒரு புகைப்படத்தை எடுக்கவும்'
          : 'Please take at least one photo of your produce');
    }

    // 2. Crop Name
    if (!formData.name || !formData.name.trim()) {
      errors.name =
        t('cropNameRequired') ||
        (language === 'ta' ? 'பயிர் பெயர் தேவை' : 'Crop name is required');
    }

    // 3. Category
    if (!formData.category || !formData.category.trim()) {
      errors.category =
        t('categoryRequired') ||
        (language === 'ta' ? 'பிரிவு தேவை' : 'Category is required');
    }

    // 4. Quantity
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      errors.quantity =
        t('validQuantityRequired') ||
        (language === 'ta' ? 'சரியான அளவை உள்ளிடவும்' : 'Please enter a valid quantity');
    }

    // 5. Price Per Unit
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price =
        t('validPriceRequired') ||
        (language === 'ta'
          ? 'எதிர்பார்க்கப்படும் விலையை உள்ளிடவும்'
          : 'Please enter expected price per unit');
    }

    // 6. Harvest Date (Available From)
    if (!formData.availableFrom || !formData.availableFrom.trim()) {
      errors.availableFrom =
        t('harvestDateRequired') ||
        (language === 'ta' ? 'அறுவடை தேதி தேவை' : 'Harvest date is required');
    }

    // 7. Farm Location
    if (!formData.location || !formData.location.trim()) {
      errors.location =
        t('locationRequired') ||
        (language === 'ta' ? 'பண்ணை இருப்பிடம் தேவை' : 'Farm location is required');
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      // Find first invalid field in visual order, scroll smoothly to it and focus
      const fieldOrder = ['images', 'name', 'category', 'quantity', 'price', 'availableFrom', 'location'];
      const firstInvalidField = fieldOrder.find((field) => errors[field]);

      if (firstInvalidField) {
        if (firstInvalidField === 'images') {
          fieldRefs.images.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          photoTriggerRef.current?.focus();
        } else if (fieldRefs[firstInvalidField]?.current) {
          fieldRefs[firstInvalidField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          fieldRefs[firstInvalidField].current.focus();
        }
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      addHarvest({
        name: language === 'ta' && formData.tamilName ? `${formData.name} (${formData.tamilName})` : formData.name,
        cropName: formData.name,
        tamilName: formData.tamilName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        pricePerKg: Number(formData.price),
        availableFrom: formData.availableFrom,
        location: formData.location,
        description: formData.description,
        images: formData.images
      });
      setIsSubmitting(false);
      setPublishSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade" style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Header Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
              style={{ width: '40px', height: '40px' }}
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <i className="bi bi-arrow-left fs-5 text-dark"></i>
            </button>
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                {language === 'ta' ? 'புதிய விளைச்சல் பதிவு' : 'NEW PRODUCE LISTING'}
              </span>
              <h1 className="fw-black text-dark fs-3 mb-0">{t('addMyHarvest')}</h1>
            </div>
          </div>
        </div>

        {/* Success State View */}
        {publishSuccess ? (
          <div className="bg-white rounded-4 border shadow-sm p-4 p-md-5 text-center my-3 farm-animate-fade">
            <div
              className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow-md"
              style={{ width: '64px', height: '64px' }}
            >
              <i className="bi bi-check-lg fs-2"></i>
            </div>

            <h2 className="fs-3 fw-black text-dark mb-2">
              {t('harvestPublishedSuccessTitle')}
            </h2>
            <p className="text-muted mb-4" style={{ maxWidth: '460px', margin: '0 auto' }}>
              {t('harvestPublishedSuccessDesc')}
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link
                to="/farmer/harvest"
                className="btn btn-success fw-bold rounded-pill px-4 py-2.5 shadow-sm"
              >
                {t('viewInMyHarvestCTA')}
              </Link>
              <Link
                to="/farmer/dashboard"
                className="btn btn-outline-secondary fw-bold rounded-pill px-4 py-2.5"
              >
                {t('backToDashboardCTA')}
              </Link>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-4 border shadow-xs p-3 p-sm-4 p-md-5">
            {/* 1. Product Photos */}
            <div
              ref={fieldRefs.images}
              className={`p-3 rounded-4 transition-all mb-4 pb-3 border-bottom ${
                formErrors.images
                  ? 'border border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                  : 'border border-transparent'
              }`}
              style={
                formErrors.images
                  ? {
                      borderColor: '#f43f5e',
                      boxShadow: '0 0 0 1px #f43f5e',
                      backgroundColor: 'rgba(255, 241, 242, 0.2)'
                    }
                  : {}
              }
            >
              <label className="form-label fw-bold text-dark fs-6 d-flex align-items-center justify-content-between mb-2">
                <span className="d-flex align-items-center gap-1.5">
                  <span>📸 {t('productPhotosLabel')}</span>
                  <span className="text-danger">*</span>
                </span>
                <span className={`small fw-semibold ${formData.images.length > 0 ? 'text-success' : 'text-muted'}`}>
                  {formData.images.length}{' '}
                  {language === 'ta'
                    ? 'புகைப்படங்கள் எடுக்கப்பட்டன'
                    : `${formData.images.length === 1 ? 'photo' : 'photos'} captured`}
                </span>
              </label>

              {/* Upload Drop Zone & Previews */}
              <div className="d-flex flex-wrap gap-3 align-items-center">
                {formData.images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="position-relative rounded-3 overflow-hidden border shadow-2xs"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Captured Photo ${index + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-xs"
                      style={{ width: '22px', height: '22px', zIndex: 5 }}
                      onClick={() => handleRemovePhoto(index)}
                      title={language === 'ta' ? 'படத்தை நீக்கு' : 'Remove photo'}
                      aria-label="Remove photo"
                    >
                      <i className="bi bi-x small fw-bold"></i>
                    </button>
                  </div>
                ))}

                {/* Direct Camera Capture Trigger Button */}
                <button
                  type="button"
                  ref={photoTriggerRef}
                  className={`btn border-2 border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center p-3 fw-bold transition ${
                    formErrors.images
                      ? 'btn-outline-danger border-rose-500 text-rose-600 bg-rose-50/50'
                      : 'btn-outline-success text-success hover-bg-light'
                  }`}
                  style={{ width: '110px', height: '100px', cursor: 'pointer' }}
                  onClick={() => fileInputRef.current?.click()}
                  title={language === 'ta' ? 'புகைப்படம் எடு' : 'Take Photo'}
                >
                  <i className="bi bi-camera-fill fs-3 mb-1"></i>
                  <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {language === 'ta' ? 'புகைப்படம் எடு' : 'Take Photo'}
                  </span>
                </button>

                {/* Hidden input configured for direct rear camera capture */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="d-none"
                  onChange={handlePhotoUpload}
                />
              </div>

              {formErrors.images && (
                <div className="text-rose-600 fw-semibold small mt-2 d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{formErrors.images}</span>
                </div>
              )}
            </div>

            {/* 2. Product Name & Category */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-7">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('productNameLabel')} <span className="text-danger">*</span>
                </label>
                <input
                  ref={fieldRefs.name}
                  type="text"
                  className={`form-control form-control-lg rounded-3 fs-6 transition-all ${
                    formErrors.name
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20 is-invalid'
                      : ''
                  }`}
                  style={
                    formErrors.name
                      ? {
                          borderColor: '#f43f5e',
                          boxShadow: '0 0 0 1px #f43f5e',
                          backgroundColor: 'rgba(255, 241, 242, 0.2)'
                        }
                      : {}
                  }
                  placeholder="e.g. Tomato (நாட்டு தக்காளி)"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
                {formErrors.name && (
                  <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{formErrors.name}</span>
                  </div>
                )}
              </div>

              <div className="col-12 col-sm-5">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('cropCategoryLabel')} <span className="text-danger">*</span>
                </label>
                <select
                  ref={fieldRefs.category}
                  className={`form-select form-select-lg rounded-3 fs-6 transition-all ${
                    formErrors.category
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20 is-invalid'
                      : ''
                  }`}
                  style={
                    formErrors.category
                      ? {
                          borderColor: '#f43f5e',
                          boxShadow: '0 0 0 1px #f43f5e',
                          backgroundColor: 'rgba(255, 241, 242, 0.2)'
                        }
                      : {}
                  }
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: '' }));
                  }}
                >
                  <option value="">
                    {language === 'ta' ? '-- பிரிவைத் தேர்ந்தெடுக்கவும் --' : '-- Select Category --'}
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{formErrors.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Available Quantity & Unit */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-7">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('availableQuantityLabel')} <span className="text-danger">*</span>
                </label>
                <input
                  ref={fieldRefs.quantity}
                  type="number"
                  inputMode="decimal"
                  className={`form-control form-control-lg rounded-3 fs-6 transition-all ${
                    formErrors.quantity
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20 is-invalid'
                      : ''
                  }`}
                  style={
                    formErrors.quantity
                      ? {
                          borderColor: '#f43f5e',
                          boxShadow: '0 0 0 1px #f43f5e',
                          backgroundColor: 'rgba(255, 241, 242, 0.2)'
                        }
                      : {}
                  }
                  placeholder="e.g. 500"
                  value={formData.quantity}
                  onChange={(e) => {
                    setFormData({ ...formData, quantity: e.target.value });
                    if (formErrors.quantity) setFormErrors((prev) => ({ ...prev, quantity: '' }));
                  }}
                  min="1"
                />
                {formErrors.quantity && (
                  <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{formErrors.quantity}</span>
                  </div>
                )}
              </div>

              <div className="col-12 col-sm-5">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('unitLabel')}
                </label>
                <select
                  className="form-select form-select-lg rounded-3 fs-6"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Expected Price */}
            <div className="mb-3">
              <label className="form-label fw-bold text-dark small mb-1">
                {t('expectedPriceLabel')} <span className="text-danger">*</span>
              </label>
              <div
                className={`input-group input-group-lg rounded-3 transition-all ${
                  formErrors.price ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20' : ''
                }`}
                style={
                  formErrors.price
                    ? {
                        borderColor: '#f43f5e',
                        boxShadow: '0 0 0 1px #f43f5e',
                        backgroundColor: 'rgba(255, 241, 242, 0.2)'
                      }
                    : {}
                }
              >
                <span className="input-group-text bg-light text-dark fw-bold">₹</span>
                <input
                  ref={fieldRefs.price}
                  type="number"
                  inputMode="decimal"
                  className={`form-control rounded-end-3 fs-6 ${
                    formErrors.price ? 'is-invalid border-0 bg-transparent' : ''
                  }`}
                  placeholder="e.g. 28"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: '' }));
                  }}
                  min="1"
                />
              </div>
              {formErrors.price && (
                <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-circle-fill"></i>
                  <span>{formErrors.price}</span>
                </div>
              )}
              <span className="text-muted small d-block mt-1" style={{ fontSize: '0.76rem' }}>
                💡 {t('suggestedPrice')}: ₹26 - ₹32 / kg ({language === 'ta' ? 'திண்டுக்கல் மண்டி விகிதம்' : 'Dindigul Mandi benchmark'})
              </span>
            </div>

            {/* 5. Available From & Farm Location */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('availableFromLabel')} <span className="text-danger">*</span>
                </label>
                <input
                  ref={fieldRefs.availableFrom}
                  type="date"
                  className={`form-control form-control-lg rounded-3 fs-6 transition-all ${
                    formErrors.availableFrom
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20 is-invalid'
                      : ''
                  }`}
                  style={
                    formErrors.availableFrom
                      ? {
                          borderColor: '#f43f5e',
                          boxShadow: '0 0 0 1px #f43f5e',
                          backgroundColor: 'rgba(255, 241, 242, 0.2)'
                        }
                      : {}
                  }
                  value={formData.availableFrom}
                  onChange={(e) => {
                    setFormData({ ...formData, availableFrom: e.target.value });
                    if (formErrors.availableFrom) setFormErrors((prev) => ({ ...prev, availableFrom: '' }));
                  }}
                />
                {formErrors.availableFrom && (
                  <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{formErrors.availableFrom}</span>
                  </div>
                )}
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark small mb-1">
                  {t('farmLocationLabel')} <span className="text-danger">*</span>
                </label>
                <input
                  ref={fieldRefs.location}
                  type="text"
                  className={`form-control form-control-lg rounded-3 fs-6 transition-all ${
                    formErrors.location
                      ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20 is-invalid'
                      : ''
                  }`}
                  style={
                    formErrors.location
                      ? {
                          borderColor: '#f43f5e',
                          boxShadow: '0 0 0 1px #f43f5e',
                          backgroundColor: 'rgba(255, 241, 242, 0.2)'
                        }
                      : {}
                  }
                  placeholder="e.g. Nilakottai, Dindigul"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (formErrors.location) setFormErrors((prev) => ({ ...prev, location: '' }));
                  }}
                />
                {formErrors.location && (
                  <div className="text-rose-600 fw-semibold small mt-1 d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{formErrors.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Description */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small mb-1">
                {t('descriptionLabel')} ({language === 'ta' ? 'விருப்பத்திற்குரியது' : 'Optional'})
              </label>
              <textarea
                className="form-control rounded-3"
                rows="3"
                placeholder={language === 'ta' ? 'பயிரின் தரம், பறிப்பு நேரம் போன்ற கூடுதல் தகவல்கள்...' : 'Notes on freshness, grade, sorting, or gate pickup instructions...'}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {/* 7. Main CTA: PUBLISH HARVEST */}
            <div className="pt-3 border-top text-center">
              <button
                type="submit"
                className="btn btn-success fw-black py-3 px-5 rounded-pill shadow-md w-100 max-w-sm hover-scale transition d-inline-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  fontSize: '1.1rem',
                  maxWidth: '380px',
                  minHeight: '52px'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>{t('publishingHarvestText')}</span>
                ) : (
                  <span>{t('publishHarvestCTA')}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </FarmerLayout>
  );
}
