import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDistricts, getTaluksByDistrict } from '../../data/tamilNaduLocations';
import SearchableSelect from '../../components/common/SearchableSelect';
import FormInput from '../../components/common/FormInput';
import PasswordInput from '../../components/common/PasswordInput';
import FormSection from '../../components/common/FormSection';
import RegistrationSuccessModal from '../../components/common/RegistrationSuccessModal';

const BUSINESS_TYPES = [
  'Individual Consumer',
  'Restaurant',
  'Hotel',
  'Retail Shop',
  'Supermarket',
  'Food-Processing Company',
  'Institutional Buyer',
  'Other',
];

export default function ConsumerRegisterPage() {
  const initialFormState = {
    name: '',
    phone: '',
    businessType: '',
    otherBusinessType: '',
    gstin: '',
    district: '',
    taluk: '',
    address: '',
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Districts and dependent taluks
  const districtOptions = getDistricts();
  const talukOptions = formData.district ? getTaluksByDistrict(formData.district) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset taluk if district changes
    if (name === 'district') {
      setFormData((prev) => ({
        ...prev,
        district: value,
        taluk: '',
      }));
      if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
      if (errors.taluk) setErrors((prev) => ({ ...prev, taluk: '' }));
      return;
    }

    // Reset otherBusinessType if businessType changes to something else
    if (name === 'businessType') {
      setFormData((prev) => ({
        ...prev,
        businessType: value,
        otherBusinessType: value === 'Other' ? prev.otherBusinessType : '',
      }));
      if (errors.businessType) setErrors((prev) => ({ ...prev, businessType: '' }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Phone validation (Indian 10-digit mobile number)
    const phoneClean = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    // Business Type validation
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a Business Type';
    } else if (formData.businessType === 'Other' && !formData.otherBusinessType.trim()) {
      newErrors.otherBusinessType = 'Please specify your business type';
    }

    // GSTIN validation (optional, but if entered, must match 15-character GSTIN format)
    if (formData.gstin.trim()) {
      const gstinUpper = formData.gstin.trim().toUpperCase();
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(gstinUpper)) {
        newErrors.gstin = 'Invalid GSTIN format (e.g. 33AAAAA0000A1Z5)';
      }
    }

    // District & Taluk validation
    if (!formData.district) {
      newErrors.district = 'Please select a District';
    }
    if (!formData.taluk) {
      newErrors.taluk = 'Please select a Taluk';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery / business address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a detailed address (at least 10 characters)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numeric digits';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorEl = document.querySelector('.is-invalid');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessOpen(true);
    }, 300);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSuccessOpen(false);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar Header */}
      <header className="bg-white border-bottom py-3 shadow-xs sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src="/naam-uzhavar-logo-transparent.png"
              alt="Naam Uzhavar"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/register"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
            >
              <i className="bi bi-arrow-left"></i>
              <span className="d-none d-sm-inline">Switch Role</span>
            </Link>
            <Link
              to="/login/buyer"
              className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <main className="container flex-grow-1 py-4 py-md-5 d-flex justify-content-center">
        <div
          className="bg-white rounded-4 border shadow-sm w-100 overflow-hidden"
          style={{ maxWidth: '760px' }}
        >
          {/* Header Banner */}
          <div
            className="p-4 text-white"
            style={{
              background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-white text-primary fw-bold text-uppercase px-2 py-1 shadow-xs">
                Role: Consumer / Buyer
              </span>
              <span
                className="badge px-2 py-1 small fw-semibold"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  letterSpacing: '0.2px',
                }}
              >
                <i className="bi bi-shop me-1 text-white"></i>
                Wholesale & Retail Procurement
              </span>
            </div>
            <h1 className="fs-3 fw-bold mb-1 text-white">Consumer / Buyer Registration</h1>
            <p className="small mb-0 text-white" style={{ opacity: 0.95, lineHeight: 1.5 }}>
              Source harvest-fresh crops directly from verified Tamil Nadu farmers with real-time traceability and farm-gate prices.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-4 p-md-5">
            {/* 1. Personal Details */}
            <FormSection
              icon="bi-person-badge"
              title="Personal Details"
              description="Primary contact and authorized representative details"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <FormInput
                    id="buyer-name"
                    name="name"
                    label="Full Name"
                    placeholder="e.g. S. Venkatesh"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                    icon="bi-person"
                    autoComplete="name"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormInput
                    id="buyer-phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    error={errors.phone}
                    helperText="For order notifications and dispatch tracking"
                    icon="bi-telephone"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </FormSection>

            {/* 2. Business Details */}
            <FormSection
              icon="bi-building"
              title="Business Details"
              description="Select your operational category and optional GST credentials"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label
                      htmlFor="buyer-business-type"
                      className="form-label d-flex align-items-center justify-content-between mb-1"
                      style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}
                    >
                      <span>
                        Business Type <span className="text-danger">*</span>
                      </span>
                    </label>
                    <select
                      id="buyer-business-type"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className={`form-select py-2 px-3 ${errors.businessType ? 'is-invalid border-danger' : ''}`}
                      style={{ fontSize: '0.92rem' }}
                    >
                      <option value="">-- Select Business Type --</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <span>{errors.businessType}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <FormInput
                    id="buyer-gstin"
                    name="gstin"
                    label="GSTIN"
                    placeholder="15-character GST number (if applicable)"
                    value={formData.gstin}
                    onChange={(e) => {
                      handleChange({
                        target: { name: 'gstin', value: e.target.value.toUpperCase() },
                      });
                    }}
                    maxLength={15}
                    error={errors.gstin}
                    helperText="Optional for retail, recommended for B2B input tax credits"
                    icon="bi-receipt"
                  />
                </div>

                {/* Conditional "Specify Business Type" field when 'Other' is selected */}
                {formData.businessType === 'Other' && (
                  <div className="col-12 animate__animated animate__fadeIn">
                    <FormInput
                      id="buyer-other-business-type"
                      name="otherBusinessType"
                      label="Specify Business Type"
                      placeholder="e.g. Export House, Cloud Kitchen, Cooperative Society"
                      value={formData.otherBusinessType}
                      onChange={handleChange}
                      required
                      error={errors.otherBusinessType}
                      icon="bi-pencil-square"
                      helperText="Please describe your specific commercial organization"
                    />
                  </div>
                )}
              </div>
            </FormSection>

            {/* 3. Location Details */}
            <FormSection
              icon="bi-geo-alt"
              title="Location Details"
              description="Dependent Tamil Nadu district and taluk for delivery logistics"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <SearchableSelect
                    id="buyer-district"
                    name="district"
                    label="District"
                    value={formData.district}
                    onChange={handleChange}
                    options={districtOptions}
                    placeholder="Select Tamil Nadu District"
                    searchPlaceholder="Filter districts..."
                    required
                    error={errors.district}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <SearchableSelect
                    id="buyer-taluk"
                    name="taluk"
                    label="Taluk"
                    value={formData.taluk}
                    onChange={handleChange}
                    options={talukOptions}
                    placeholder={
                      formData.district
                        ? 'Select Taluk'
                        : 'Select District first'
                    }
                    searchPlaceholder="Filter taluks..."
                    required
                    disabled={!formData.district}
                    disabledHelper="Please select District first"
                    error={errors.taluk}
                  />
                </div>

                <div className="col-12">
                  <FormInput
                    id="buyer-address"
                    name="address"
                    type="textarea"
                    label="Delivery / Business Address"
                    placeholder="Shop/warehouse number, building name, street, locality, PIN code"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    error={errors.address}
                    icon="bi-building"
                  />
                </div>
              </div>
            </FormSection>

            {/* 4. Account Security */}
            <FormSection
              icon="bi-lock"
              title="Account Security"
              description="Protect your buyer account and procurement orders"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <PasswordInput
                    id="buyer-password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create strong password"
                    required
                    error={errors.password}
                    helperText="Min. 8 characters with upper, lower & numbers"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <PasswordInput
                    id="buyer-confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    error={errors.confirmPassword}
                    helperText="Must match password exactly"
                  />
                </div>
              </div>
            </FormSection>

            {/* Form CTA & Controls */}
            <div className="pt-3 border-top">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '1rem', backgroundColor: '#0d6efd' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Validating details...</span>
                  </>
                ) : (
                  <>
                    <span>Create Buyer Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-3 small text-muted">
                Already registered as Buyer?{' '}
                <Link to="/login/buyer" className="text-primary fw-bold text-decoration-none">
                  Sign in here
                </Link>
                {' '}&bull;{' '}
                <Link to="/register" className="text-muted text-decoration-none">
                  Choose different role
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      <RegistrationSuccessModal
        isOpen={isSuccessOpen}
        roleTitle="Consumer / Buyer"
        roleKey="consumer"
        submittedData={formData}
        onReset={handleReset}
      />
    </div>
  );
}
