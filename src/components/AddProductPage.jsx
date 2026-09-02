import React, { useState } from 'react';

export default function AddProductPage({ onBack, onPublish }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [qualityGrade, setQualityGrade] = useState('A');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickupLocation, setPickupLocation] = useState('Farm Plot A (Primary - Erode)');
  const [deliveryRadius, setDeliveryRadius] = useState('50');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyAiRecommendation = () => {
    setExpectedPrice('25');
    setMinPrice('22');
    alert('✓ Applied AI Recommended Pricing (₹25/kg) based on Erode Mandi demand surge (+18%).');
  };

  const handlePublish = (e) => {
    if (e) e.preventDefault();
    if (!productName || !expectedPrice) {
      alert('Please provide a Product Name and Expected Price.');
      return;
    }

    setIsSubmitting(true);
    const newProduct = {
      id: Date.now(),
      product: productName,
      quantity: `${quantity || '100'} ${unit}`,
      price: `₹${expectedPrice}/kg`,
      harvestDate: harvestDate || 'Today',
      status: 'Active',
      grade: `Grade ${qualityGrade}`,
      location: pickupLocation,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`🎉 Listing published successfully! "${productName}" is now active on the FarmDirect Mandi catalog.`);
      if (onPublish) onPublish(newProduct);
      else if (onBack) onBack();
    }, 900);
  };

  const handleSaveDraft = () => {
    alert(`✓ Draft saved for "${productName || 'New Crop Listing'}". You can resume editing anytime.`);
    if (onBack) onBack();
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* ----------------------------------------------------------------------
          TASK HEADER BAR
         ---------------------------------------------------------------------- */}
      <header className="bg-white border-bottom sticky-top shadow-xs" style={{ zIndex: 1040, height: '76px' }}>
        <div className="fd-wrapper h-100 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
              style={{ width: '40px', height: '40px' }}
              onClick={onBack}
              aria-label="Go back to dashboard"
            >
              <i className="bi bi-arrow-left fs-5 text-dark"></i>
            </button>
            <div>
              <h1 className="fs-4 fw-bold text-dark mb-0">Add New Product</h1>
              <p className="text-muted small mb-0 d-none d-sm-block">List fresh harvest directly to buyers with AI price matching.</p>
            </div>
          </div>

          <div className="d-none d-md-flex items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-3 py-2 fw-semibold rounded-3"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="btn btn-success px-4 py-2 fw-bold rounded-3 shadow-sm"
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------------
          MAIN FORM CANVAS
         ---------------------------------------------------------------------- */}
      <main className="flex-grow-1 py-4 py-lg-5">
        <div className="fd-wrapper">
          <form onSubmit={handlePublish}>
            <div className="row g-4 align-items-start">
              {/* Left Column: Form Areas (Bento Grid) */}
              <div className="col-lg-8 d-flex flex-column gap-4">
                {/* Section 1: Basic Info & Inventory */}
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <div className="d-flex align-items-center gap-2 pb-3 border-bottom mb-3">
                    <div className="bg-success-subtle text-success rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-box-seam-fill"></i>
                    </div>
                    <h2 className="fs-5 fw-bold text-dark mb-0">Basic Information</h2>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="fd-form-label mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        className="form-control fd-login-input py-2 ps-3"
                        placeholder="e.g. Organic Cavendish Bananas / Red Tomatoes"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fd-form-label mb-1">Category</label>
                      <select
                        className="form-select fd-login-input py-2 ps-3"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="vegetables">Vegetables</option>
                        <option value="fruits">Fruits</option>
                        <option value="grains">Grains</option>
                        <option value="honey">Honey & Oils</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <div className="row g-2">
                        <div className="col-7">
                          <label className="fd-form-label mb-1">Quantity</label>
                          <input
                            type="number"
                            required
                            className="form-control fd-login-input py-2 ps-3 font-monospace"
                            placeholder="0.00"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                        <div className="col-5">
                          <label className="fd-form-label mb-1">Unit</label>
                          <select
                            className="form-select fd-login-input py-2 ps-3"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                          >
                            <option value="kg">kg</option>
                            <option value="Tons">Tons</option>
                            <option value="Quintal">Quintal</option>
                            <option value="Dozen">Dozen</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Quality Grade & Image Upload */}
                <div className="row g-4">
                  {/* Quality Selector */}
                  <div className="col-md-6">
                    <div className="bg-white rounded-4 border p-4 shadow-sm h-100 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 pb-3 border-bottom mb-3">
                        <div className="bg-success-subtle text-success rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <i className="bi bi-patch-check-fill"></i>
                        </div>
                        <h2 className="fs-5 fw-bold text-dark mb-0">Quality Grade</h2>
                      </div>

                      <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-center">
                        {[
                          { grade: 'A', title: 'Grade A (Premium)', desc: 'Export quality, unblemished.' },
                          { grade: 'B', title: 'Grade B (Standard)', desc: 'Local mandi retail standard.' },
                          { grade: 'C', title: 'Grade C (Processing)', desc: 'Suitable for pulping / processing.' },
                        ].map((item) => (
                          <label
                            key={item.grade}
                            className={`p-3 border rounded-3 cursor-pointer transition-all d-flex align-items-center gap-3 ${
                              qualityGrade === item.grade
                                ? 'border-success bg-success-subtle text-success-emphasis'
                                : 'bg-light text-dark'
                            }`}
                          >
                            <input
                              type="radio"
                              name="qualityGrade"
                              value={item.grade}
                              checked={qualityGrade === item.grade}
                              onChange={() => setQualityGrade(item.grade)}
                              className="form-check-input mt-0"
                            />
                            <div>
                              <div className="fw-bold small">{item.title}</div>
                              <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{item.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="col-md-6">
                    <div className="bg-white rounded-4 border p-4 shadow-sm h-100 d-flex flex-column">
                      <div className="d-flex align-items-center gap-2 pb-3 border-bottom mb-3">
                        <div className="bg-success-subtle text-success rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <i className="bi bi-image"></i>
                        </div>
                        <h2 className="fs-5 fw-bold text-dark mb-0">Product Images</h2>
                      </div>

                      <div
                        className="flex-grow-1 border-2 border-dashed rounded-3 p-4 text-center d-flex flex-column align-items-center justify-content-center bg-light cursor-pointer hover-border-success"
                        style={{ borderColor: '#cbd5e1' }}
                        onClick={() => {
                          setUploadedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAPKVcx3avRLd10FHP4SZL_B_6lSBMy3Oggt69sIifcfrzhMOxZSoUgZxnJNti_Q7f2w11QZqP-gqZFclapLsYtC8tKkxiJLM0-JB1H4t6e3VP6o0eWilyZi9OTkd1p3Nzi0iD4szrjOn8j8M4Yzjq09O_HzdNDsARdqmLQdi5LObw5fZjuBmqXL18dRUyMM6xIl3L3rHggsBJw2gwpyFojR5KoOcmz1u5ry2qvpTrl4kEOY8rK016D2Q');
                          alert('✓ Fresh harvested crop image uploaded!');
                        }}
                      >
                        {uploadedImage ? (
                          <div>
                            <img src={uploadedImage} alt="Uploaded" className="rounded-3 mb-2" style={{ maxHeight: '90px', objectFit: 'cover' }} />
                            <div className="small text-success fw-bold">✓ Image Attached (Click to change)</div>
                          </div>
                        ) : (
                          <>
                            <div className="bg-white rounded-circle p-3 shadow-xs mb-2 text-success">
                              <i className="bi bi-cloud-arrow-up fs-3"></i>
                            </div>
                            <div className="fw-bold small text-dark">Drag & drop photos here</div>
                            <div className="text-muted small">or click to browse from device</div>
                            <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>JPG, PNG up to 5MB</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Pricing & Logistics */}
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <div className="d-flex align-items-center gap-2 pb-3 border-bottom mb-3">
                    <div className="bg-success-subtle text-success rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-truck"></i>
                    </div>
                    <h2 className="fs-5 fw-bold text-dark mb-0">Pricing &amp; Logistics</h2>
                  </div>

                  <div className="row g-4">
                    {/* Pricing */}
                    <div className="col-md-6 pe-md-3 border-end-md">
                      <h3 className="fd-form-label mb-3">Pricing Strategy</h3>

                      <div className="mb-3">
                        <label className="fd-form-label mb-1">Expected Price (₹)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted fw-bold">₹</span>
                          <input
                            type="number"
                            required
                            className="form-control font-monospace"
                            placeholder="0.00"
                            value={expectedPrice}
                            onChange={(e) => setExpectedPrice(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="fd-form-label mb-1">Minimum Acceptable Price (₹)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted fw-bold">₹</span>
                          <input
                            type="number"
                            className="form-control font-monospace"
                            placeholder="0.00"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Logistics */}
                    <div className="col-md-6 ps-md-3">
                      <h3 className="fd-form-label mb-3">Fulfillment Details</h3>

                      <div className="mb-3">
                        <label className="fd-form-label mb-1">Harvest / Availability Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={harvestDate}
                          onChange={(e) => setHarvestDate(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="fd-form-label mb-1">Pickup Location</label>
                        <select
                          className="form-select"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                        >
                          <option>Farm Plot A (Primary - Erode)</option>
                          <option>Warehouse B (Cluster Center)</option>
                          <option>Nashik Cold Storage Hub</option>
                        </select>
                      </div>

                      <div className="mb-2">
                        <label className="fd-form-label mb-1">Delivery Radius (km)</label>
                        <input
                          type="number"
                          className="form-control font-monospace"
                          placeholder="e.g. 50"
                          value={deliveryRadius}
                          onChange={(e) => setDeliveryRadius(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Price Intelligence Sidebar */}
              <div className="col-lg-4 sticky-top" style={{ top: '96px', zIndex: 10 }}>
                <div className="bg-white rounded-4 border p-4 shadow-sm position-relative overflow-hidden">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-success text-white rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                      <i className="bi bi-cpu-fill"></i>
                    </div>
                    <h2 className="fs-5 fw-bold text-dark mb-0">AI Price Intelligence</h2>
                  </div>

                  {/* Recommendation Card */}
                  <div className="p-3 bg-light rounded-3 border text-center mb-3">
                    <span className="fd-form-label mb-1">Recommended Price</span>
                    <div className="d-flex align-items-baseline justify-content-center gap-1">
                      <span className="fs-1 fw-bold text-success">₹25</span>
                      <span className="text-muted">/ kg</span>
                    </div>
                    <div className="badge bg-success-subtle text-success border border-success-subtle rounded-pill mt-2 px-3 py-1 fw-bold">
                      <i className="bi bi-graph-up-arrow me-1"></i>
                      Potential Advantage +₹1/kg
                    </div>
                  </div>

                  {/* Market Context List */}
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-3 small">
                    <li className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-shop text-muted"></i>
                        <span>Current Market Price</span>
                      </div>
                      <span className="fw-bold font-monospace text-dark">₹24/kg</span>
                    </li>

                    <li className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-bar-chart-line text-muted"></i>
                        <span>Local Demand Level</span>
                      </div>
                      <span className="badge bg-danger text-white fw-bold">HIGH</span>
                    </li>

                    <li className="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-arrow-repeat text-muted"></i>
                        <span>30-Day Trend</span>
                      </div>
                      <span className="text-success fw-bold font-monospace">
                        <i className="bi bi-arrow-up-short"></i> +4%
                      </span>
                    </li>
                  </ul>

                  <div className="pt-2 border-top small text-muted text-center mb-3" style={{ fontSize: '0.78rem' }}>
                    Based on real-time mandis data, weather patterns, and historical sales in your delivery radius.
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleApplyAiRecommendation}
                  >
                    <i className="bi bi-magic"></i>
                    <span>Apply Recommendation</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* ----------------------------------------------------------------------
          MOBILE STICKY ACTION BAR
         ---------------------------------------------------------------------- */}
      <div className="d-md-none fixed-bottom bg-white border-top p-3 shadow d-flex gap-2" style={{ zIndex: 1050 }}>
        <button
          type="button"
          className="btn btn-outline-secondary w-50 py-2 fw-semibold"
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>
        <button
          type="button"
          className="btn btn-success w-50 py-2 fw-bold"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
