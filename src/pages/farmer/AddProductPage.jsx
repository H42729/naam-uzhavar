import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { getDistricts, getTaluksByDistrict } from '../../data/tamilNaduLocations';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import MultipleImageUploader from '../../components/farmer/MultipleImageUploader';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains & Pulses',
  'Spices & Herbs',
  'Flowers',
  'Dairy & Poultry',
  'Organic Special'
];

const UNITS = ['Kg', 'Quintal', 'Ton', 'Piece', 'Dozen', 'Litre'];

export default function AddProductPage() {
  const navigate = useNavigate();
  const { addProduct } = useFarmer();

  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    category: 'Vegetables',
    description: '',
    quantity: '',
    unit: 'Kg',
    price: '',
    grade: 'Grade A (Premium)',
    harvestDate: new Date().toISOString().split('T')[0],
    availableFrom: new Date().toISOString().split('T')[0],
    district: 'Erode',
    taluk: 'Modakkurichi',
    address: 'Farm Plot Gate 4, Modakkurichi Road, Erode',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const districts = getDistricts();
  const taluks = getTaluksByDistrict(formData.district);

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    const districtTaluks = getTaluksByDistrict(newDistrict);
    setFormData({
      ...formData,
      district: newDistrict,
      taluk: districtTaluks.length > 0 ? districtTaluks[0] : ''
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Enter valid quantity';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Enter valid price per unit';
    if (!formData.district) errors.district = 'Select district';
    if (!formData.taluk) errors.taluk = 'Select taluk';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // If no images uploaded, assign a default realistic produce image based on category
    let finalImages = [...formData.images];
    if (finalImages.length === 0) {
      if (formData.name.toLowerCase().includes('tomato')) {
        finalImages = ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'];
      } else if (formData.name.toLowerCase().includes('onion')) {
        finalImages = ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'];
      } else if (formData.name.toLowerCase().includes('turmeric')) {
        finalImages = ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'];
      } else {
        finalImages = ['https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80'];
      }
    }

    setTimeout(() => {
      addProduct({
        ...formData,
        images: finalImages
      });
      setIsSubmitting(false);
      navigate('/farmer/products');
    }, 600);
  };

  return (
    <FarmerLayout>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
            style={{ width: '42px', height: '42px' }}
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <i className="bi bi-arrow-left fs-5 text-dark"></i>
          </button>
          <div>
            <h1 className="fw-black text-dark mb-0" style={{ fontSize: '1.75rem' }}>
              Add New Harvest Produce
            </h1>
            <p className="text-muted small mb-0">
              Create a direct marketplace listing for B2B buyers, retailers, and restaurants.
            </p>
          </div>
        </div>

        <div className="d-none d-md-flex items-center gap-2">
          <Link to="/farmer/products" className="btn btn-outline-secondary px-3 py-2 fw-semibold rounded-3">
            Cancel
          </Link>
          <button
            type="button"
            className="farm-btn-primary-cta px-4 py-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="farm-btn-content">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Publishing Produce...</span>
              </span>
            ) : (
              <span className="farm-btn-content">
                <i className="bi bi-cloud-arrow-up-fill"></i>
                <span>Publish Listing</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="row g-4">
        {/* Left Column: Core Product Info (7 cols) */}
        <div className="col-lg-7">
          <div className="farm-card mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-info-circle-fill text-success"></i>
              <span>1. Basic Crop Information</span>
            </h5>

            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Product Name (English) <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Country Tomatoes / Erode Organic Turmeric / Small Red Onions"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

              {/* Tamil Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">
                  Crop Name in Tamil (தமிழ் பெயர்)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="உதாரணம்: நாட்டு தக்காளி / ஈரோடு மஞ்சள் / சின்ன வெங்காயம்"
                  value={formData.tamilName}
                  onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                />
              </div>

              {/* Category & Quality Grade */}
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-6">
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
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Product Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Describe produce freshness, harvesting techniques, sugar/moisture grade, or storage conditions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Quantity, Unit, Price */}
              <h5 className="fw-bold text-dark mb-3 pt-3 pb-2 border-bottom d-flex align-items-center gap-2">
                <i className="bi bi-tag-fill text-success"></i>
                <span>2. Quantity &amp; Pricing</span>
              </h5>

              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <label className="form-label small fw-bold text-dark">
                    Quantity Available <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control font-monospace ${
                      formErrors.quantity ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g. 500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                  {formErrors.quantity && (
                    <div className="invalid-feedback">{formErrors.quantity}</div>
                  )}
                </div>

                <div className="col-sm-4">
                  <label className="form-label small fw-bold text-dark">
                    Unit <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
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

                <div className="col-sm-4">
                  <label className="form-label small fw-bold text-dark">
                    Price per Unit (₹) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light fw-bold text-muted">₹</span>
                    <input
                      type="number"
                      className={`form-control font-monospace ${
                        formErrors.price ? 'is-invalid' : ''
                      }`}
                      placeholder="e.g. 24"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  {formErrors.price && (
                    <div className="text-danger small mt-1">{formErrors.price}</div>
                  )}
                </div>
              </div>

              {/* Harvest Date & Available From */}
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Harvest Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Available From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  />
                </div>
              </div>

              {/* Location Section */}
              <h5 className="fw-bold text-dark mb-3 pt-3 pb-2 border-bottom d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-success"></i>
                <span>3. Farm Location &amp; Pickup</span>
              </h5>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">
                    District <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${formErrors.district ? 'is-invalid' : ''}`}
                    value={formData.district}
                    onChange={handleDistrictChange}
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">
                    Taluk <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${formErrors.taluk ? 'is-invalid' : ''}`}
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                  >
                    {taluks.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-dark">
                    Pickup Address / Farm Gate Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Survey No. 44/2, Modakkurichi Road, Erode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Multiple Images & Live Preview (5 cols) */}
        <div className="col-lg-5">
          <div className="farm-card mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-images text-success"></i>
              <span>Product Photos &amp; Gallery</span>
            </h5>

            <MultipleImageUploader
              images={formData.images}
              onChange={(updatedImages) => setFormData({ ...formData, images: updatedImages })}
              maxImages={5}
              maxSizeMB={5}
            />
          </div>

          {/* Quick Summary Card */}
          <div className="p-3 bg-success-subtle text-success-emphasis rounded-4 border border-success-subtle mb-4">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i>
              <span>Direct Mandi Listing Benefits</span>
            </h6>
            <ul className="small mb-0 ps-3">
              <li>Instant visibility to 500+ verified buyers across Tamil Nadu</li>
              <li>Zero middleman brokerage or commission cuts</li>
              <li>100% direct bank or UPI payment upon pickup confirmation</li>
            </ul>
          </div>

          {/* Mobile Bottom Submit Button */}
          <div className="d-grid d-md-none gap-2">
            <button
              type="button"
              className="farm-btn-primary-cta py-3 fs-6 w-100"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="farm-btn-content">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Publishing Produce...</span>
                </span>
              ) : (
                <span className="farm-btn-content">
                  <i className="bi bi-cloud-arrow-up-fill"></i>
                  <span>Publish Listing</span>
                </span>
              )}
            </button>
            <Link to="/farmer/products" className="btn btn-outline-secondary py-2 fw-semibold rounded-3 text-center">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
