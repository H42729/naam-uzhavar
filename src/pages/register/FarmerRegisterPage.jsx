import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDistricts, getTaluksByDistrict } from '../../data/tamilNaduLocations';
import SearchableSelect from '../../components/common/SearchableSelect';
import FormInput from '../../components/common/FormInput';
import PasswordInput from '../../components/common/PasswordInput';
import FormSection from '../../components/common/FormSection';
import RegistrationSuccessModal from '../../components/common/RegistrationSuccessModal';

export default function FarmerRegisterPage() {
  const initialFormState = {
    name: '',
    phone: '',
    aadhaarNumber: '',
    district: '',
    taluk: '',
    address: '',
    pattaNumber: '',
    landArea: '',
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

    // If district changes, reset taluk automatically
    if (name === 'district') {
      setFormData((prev) => ({
        ...prev,
        district: value,
        taluk: '', // reset dependent field
      }));
      // Clear errors
      if (errors.district) {
        setErrors((prev) => ({ ...prev, district: '' }));
      }
      if (errors.taluk) {
        setErrors((prev) => ({ ...prev, taluk: '' }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear individual field error on change
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

    // Aadhaar number validation (12 digits, numeric)
    const aadhaarClean = formData.aadhaarNumber.trim().replace(/\D/g, '');
    if (!formData.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(aadhaarClean)) {
      newErrors.aadhaarNumber = 'Aadhaar must be exactly 12 numeric digits';
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
      newErrors.address = 'Farm or residential address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a detailed address (at least 10 characters)';
    }

    // Patta number validation
    if (!formData.pattaNumber.trim()) {
      newErrors.pattaNumber = 'Patta number is required for agricultural verification';
    }

    // Land Area (optional, but if entered must be a positive number)
    if (formData.landArea && (isNaN(formData.landArea) || Number(formData.landArea) <= 0)) {
      newErrors.landArea = 'Land area must be a valid positive number';
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
      // Scroll to the first error
      const firstErrorEl = document.querySelector('.is-invalid');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const existing = JSON.parse(localStorage.getItem('naam_uzhavar_registered_users') || '[]');
      const newFarmer = {
        name: formData.fullName || 'Registered Farmer',
        email: `${(formData.fullName || 'farmer').toLowerCase().replace(/[^a-z0-9]/g, '')}@naamuzhavar.com`,
        phone: formData.phone,
        password: formData.password,
        role: 'Farmer',
        roleKey: 'farmer',
        district: formData.district,
        taluk: formData.taluk,
        village: formData.village,
        landArea: formData.landArea,
        pattaNumber: formData.pattaNumber,
        location: formData.district ? `${formData.district}, Tamil Nadu` : 'Erode, Tamil Nadu',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA',
      };
      const filtered = existing.filter((u) => u.phone !== formData.phone);
      filtered.push(newFarmer);
      localStorage.setItem('naam_uzhavar_registered_users', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Error saving registered farmer:', err);
    }

    // Simulate clean state processing for API readiness
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
      {/* Top Navbar Bar */}
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
              to="/login/farmer"
              className="btn btn-success btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
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
              background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-white text-success fw-bold text-uppercase px-2 py-1 shadow-xs">
                Role: Farmer / FPO
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
                <i className="bi bi-geo-alt-fill me-1 text-white"></i>
                Tamil Nadu Direct Market
              </span>
            </div>
            <h1 className="fs-3 fw-bold mb-1 text-white">Farmer Registration</h1>
            <p className="small mb-0 text-white" style={{ opacity: 0.95, lineHeight: 1.5 }}>
              Register your farm to list harvests directly, eliminate commission agents, and access verified buyers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-4 p-md-5">
            {/* 1. Personal Details */}
            <FormSection
              icon="bi-person-badge"
              title="Personal Details"
              description="Basic contact information for farmer verification"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <FormInput
                    id="farmer-name"
                    name="name"
                    label="Full Name"
                    placeholder="e.g. S. Murugesan"
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
                    id="farmer-phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    error={errors.phone}
                    helperText="We will send SMS updates for harvest bookings"
                    icon="bi-telephone"
                    autoComplete="tel"
                  />
                </div>

                <div className="col-12">
                  <FormInput
                    id="farmer-aadhaar"
                    name="aadhaarNumber"
                    type="text"
                    label="Aadhaar Number"
                    placeholder="12-digit Aadhaar number"
                    value={formData.aadhaarNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                      handleChange({ target: { name: 'aadhaarNumber', value: val } });
                    }}
                    required
                    maxLength={12}
                    error={errors.aadhaarNumber}
                    helperText="Confidential government identity verification"
                    icon="bi-card-heading"
                  />
                </div>
              </div>
            </FormSection>

            {/* 2. Location Details */}
            <FormSection
              icon="bi-geo-alt"
              title="Location Details"
              description="Dependent Tamil Nadu district and taluk selection"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <SearchableSelect
                    id="farmer-district"
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
                    id="farmer-taluk"
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
                    id="farmer-address"
                    name="address"
                    type="textarea"
                    label="Farm / Village Address"
                    placeholder="Village, door/survey number, street, landmark, PIN code"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    error={errors.address}
                    icon="bi-house-door"
                  />
                </div>
              </div>
            </FormSection>

            {/* 3. Land Details */}
            <FormSection
              icon="bi-bounding-box"
              title="Land Details"
              description="Agricultural ownership details for direct procurement eligibility"
            >
              <div className="row g-3">
                <div className="col-12 col-md-7">
                  <FormInput
                    id="farmer-patta"
                    name="pattaNumber"
                    label="Patta Number"
                    placeholder="e.g. 1420 / 3A-1"
                    value={formData.pattaNumber}
                    onChange={handleChange}
                    required
                    error={errors.pattaNumber}
                    helperText="Official revenue records patta/chitta passbook ID"
                    icon="bi-file-earmark-text"
                  />
                </div>

                <div className="col-12 col-md-5">
                  <FormInput
                    id="farmer-land-area"
                    name="landArea"
                    type="number"
                    min="0.1"
                    step="0.1"
                    label="Land Area"
                    placeholder="e.g. 4.5"
                    suffix="Acres"
                    value={formData.landArea}
                    onChange={handleChange}
                    error={errors.landArea}
                    helperText="Optional field for yield estimates"
                    icon="bi-aspect-ratio"
                  />
                </div>
              </div>
            </FormSection>

            {/* 4. Account Security */}
            <FormSection
              icon="bi-lock"
              title="Account Security"
              description="Create a secure password to access your farmer dashboard"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <PasswordInput
                    id="farmer-password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create secure password"
                    required
                    error={errors.password}
                    helperText="Min. 8 characters with upper, lower & numbers"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <PasswordInput
                    id="farmer-confirm-password"
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
                className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '1rem', backgroundColor: '#198754' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Validating details...</span>
                  </>
                ) : (
                  <>
                    <span>Create Farmer Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-3 small text-muted">
                Already registered?{' '}
                <Link to="/login/farmer" className="text-success fw-bold text-decoration-none">
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
        roleTitle="Farmer / FPO"
        roleKey="farmer"
        submittedData={formData}
        onReset={handleReset}
      />
    </div>
  );
}
