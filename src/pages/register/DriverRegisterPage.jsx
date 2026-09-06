import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { getDistricts, getTaluksByDistrict } from '../../data/tamilNaduLocations';
import SearchableSelect from '../../components/common/SearchableSelect';
import FormInput from '../../components/common/FormInput';
import PasswordInput from '../../components/common/PasswordInput';
import FormSection from '../../components/common/FormSection';
import RegistrationSuccessModal from '../../components/common/RegistrationSuccessModal';

const VEHICLE_TYPES = [
  'Two-Wheeler',
  'Three-Wheeler',
  'Mini Truck',
  'Pickup Truck',
  'Light Commercial Vehicle',
  'Heavy Commercial Vehicle',
  'Other',
];

export default function DriverRegisterPage() {
  const initialFormState = {
    name: '',
    phone: '',
    drivingLicenceNumber: '',
    rcBookNumber: '',
    vehicleType: '',
    otherVehicleType: '',
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

    // Reset otherVehicleType if vehicleType changes to something else
    if (name === 'vehicleType') {
      setFormData((prev) => ({
        ...prev,
        vehicleType: value,
        otherVehicleType: value === 'Other' ? prev.otherVehicleType : '',
      }));
      if (errors.vehicleType) setErrors((prev) => ({ ...prev, vehicleType: '' }));
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

    // Phone validation
    const phoneClean = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    // Driving Licence Number
    if (!formData.drivingLicenceNumber.trim()) {
      newErrors.drivingLicenceNumber = 'Driving licence number is required';
    } else if (formData.drivingLicenceNumber.trim().length < 6) {
      newErrors.drivingLicenceNumber = 'Please enter a valid DL number';
    }

    // RC Book Number
    if (!formData.rcBookNumber.trim()) {
      newErrors.rcBookNumber = 'Vehicle RC book number is required';
    } else if (formData.rcBookNumber.trim().length < 6) {
      newErrors.rcBookNumber = 'Please enter a valid RC book number';
    }

    // Vehicle Type
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Please select a Vehicle Type';
    } else if (formData.vehicleType === 'Other' && !formData.otherVehicleType.trim()) {
      newErrors.otherVehicleType = 'Please specify your vehicle type';
    }

    // District & Taluk
    if (!formData.district) {
      newErrors.district = 'Please select a District';
    }
    if (!formData.taluk) {
      newErrors.taluk = 'Please select a Taluk';
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = 'Driver / garage base address is required';
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

    const email = `${(formData.name || 'driver').toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-3)}@naamuzhavar.com`;
    const locationStr = formData.district ? `${formData.taluk ? formData.taluk + ', ' : ''}${formData.district}, Tamil Nadu` : 'Madurai, Tamil Nadu';

    apiClient
      .post('/auth/register', {
        name: formData.name || 'Murugan Logistics',
        email,
        phone: formData.phone,
        password: formData.password,
        role: 'driver',
        location: locationStr,
        driverDetails: {
          licenseNumber: formData.drivingLicenceNumber || 'TN-57-2024-00189',
          experienceYears: 5
        }
      })
      .catch((err) => {
        console.warn('Backend driver register error:', err.message);
      })
      .finally(() => {
        try {
          const existing = JSON.parse(localStorage.getItem('naam_uzhavar_registered_users') || '[]');
          const newDriver = {
            name: formData.name || 'Murugan Logistics',
            email,
            phone: formData.phone,
            password: formData.password,
            role: 'Logistics Driver',
            roleKey: 'driver',
            district: formData.district,
            taluk: formData.taluk,
            vehicleType: formData.vehicleType,
            drivingLicenceNumber: formData.drivingLicenceNumber,
            rcBookNumber: formData.rcBookNumber,
            location: locationStr,
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
          };
          const filtered = existing.filter((u) => u.phone !== formData.phone);
          filtered.push(newDriver);
          localStorage.setItem('naam_uzhavar_registered_users', JSON.stringify(filtered));
        } catch (err) {}

        setIsSubmitting(false);
        setIsSuccessOpen(true);
      });
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
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 transition-all"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
                minHeight: '32px',
                fontSize: '0.85rem'
              }}
              title="Switch Role"
              aria-label="Switch Role"
            >
              <i className="bi bi-arrow-left"></i>
            </Link>
            <Link
              to="/login"
              className="btn btn-warning rounded-pill fw-bold d-flex align-items-center gap-1 text-dark transition-all"
              style={{
                padding: '4px 12px',
                fontSize: '0.78rem',
                height: '32px',
                minHeight: '32px',
                lineHeight: 1
              }}
              title="Sign In"
            >
              <i className="bi bi-box-arrow-in-right" style={{ fontSize: '0.85rem' }}></i>
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
              background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-white text-dark fw-bold text-uppercase px-2 py-1 shadow-xs">
                Role: Logistics Driver
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
                <i className="bi bi-truck me-1 text-white"></i>
                Cold-Chain & Freight Partner
              </span>
            </div>
            <h1 className="fs-3 fw-bold mb-1 text-white">Driver Registration</h1>
            <p className="small mb-0 text-white" style={{ opacity: 0.95, lineHeight: 1.5 }}>
              Join the FarmDirect agri-logistics network. Transport fresh farm harvests, earn reliable trip fares, and receive prompt digital settlements.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-4 p-md-5">
            {/* 1. Personal Details */}
            <FormSection
              icon="bi-person-badge"
              title="Personal Details"
              description="Basic contact information for driver identity and licensing"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <FormInput
                    id="driver-name"
                    name="name"
                    label="Full Name"
                    placeholder="e.g. K. Selvam"
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
                    id="driver-phone"
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    error={errors.phone}
                    helperText="Used for shipment trip alerts and GPS tracking"
                    icon="bi-telephone"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </FormSection>

            {/* 2. Vehicle & License Details */}
            <FormSection
              icon="bi-truck"
              title="Vehicle & License Details"
              description="Official road transport authority registrations and vehicle class"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <FormInput
                    id="driver-dl"
                    name="drivingLicenceNumber"
                    label="Driving Licence Number"
                    placeholder="e.g. TN-38-2018-0004567"
                    value={formData.drivingLicenceNumber}
                    onChange={(e) => {
                      handleChange({
                        target: { name: 'drivingLicenceNumber', value: e.target.value.toUpperCase() },
                      });
                    }}
                    required
                    error={errors.drivingLicenceNumber}
                    helperText="Valid commercial or transport driving license"
                    icon="bi-card-checklist"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormInput
                    id="driver-rc"
                    name="rcBookNumber"
                    label="RC Book Number"
                    placeholder="e.g. TN 38 AB 1234"
                    value={formData.rcBookNumber}
                    onChange={(e) => {
                      handleChange({
                        target: { name: 'rcBookNumber', value: e.target.value.toUpperCase() },
                      });
                    }}
                    required
                    error={errors.rcBookNumber}
                    helperText="Vehicle Registration Certificate number"
                    icon="bi-file-text"
                  />
                </div>

                <div className="col-12 col-md-12">
                  <div className="mb-3">
                    <label
                      htmlFor="driver-vehicle-type"
                      className="form-label d-flex align-items-center justify-content-between mb-1"
                      style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}
                    >
                      <span>
                        Vehicle Type <span className="text-danger">*</span>
                      </span>
                    </label>
                    <select
                      id="driver-vehicle-type"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className={`form-select py-2 px-3 ${errors.vehicleType ? 'is-invalid border-danger' : ''}`}
                      style={{ fontSize: '0.92rem' }}
                    >
                      <option value="">-- Select Vehicle Type --</option>
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.vehicleType && (
                      <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <span>{errors.vehicleType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditional "Specify Vehicle Type" field when 'Other' is selected */}
                {formData.vehicleType === 'Other' && (
                  <div className="col-12 animate__animated animate__fadeIn">
                    <FormInput
                      id="driver-other-vehicle-type"
                      name="otherVehicleType"
                      label="Specify Vehicle Type"
                      placeholder="e.g. Refrigerated Reefer Van, Tractor Trailer"
                      value={formData.otherVehicleType}
                      onChange={handleChange}
                      required
                      error={errors.otherVehicleType}
                      icon="bi-pencil-square"
                      helperText="Specify payload capacity and freight specifications"
                    />
                  </div>
                )}
              </div>
            </FormSection>

            {/* 3. Location Details */}
            <FormSection
              icon="bi-geo-alt"
              title="Location Details"
              description="Primary dispatch garage or operating district in Tamil Nadu"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <SearchableSelect
                    id="driver-district"
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
                    id="driver-taluk"
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
                    id="driver-address"
                    name="address"
                    type="textarea"
                    label="Operating Base / Residential Address"
                    placeholder="Garage/residence door number, street, locality, PIN code"
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

            {/* 4. Account Security */}
            <FormSection
              icon="bi-lock"
              title="Account Security"
              description="Create a password for your driver dispatch portal"
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <PasswordInput
                    id="driver-password"
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
                    id="driver-confirm-password"
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
                className="btn btn-warning w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 text-dark"
                style={{ fontSize: '1rem', backgroundColor: '#f59e0b', borderColor: '#d97706' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Validating details...</span>
                  </>
                ) : (
                  <>
                    <span>Create Driver Account</span>
                    <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="text-center mt-3 small text-muted">
                Already registered?{' '}
                <Link to="/login" className="text-dark fw-bold text-decoration-none">
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
        roleTitle="Logistics Driver"
        roleKey="driver"
        submittedData={formData}
        onReset={handleReset}
      />
    </div>
  );
}
