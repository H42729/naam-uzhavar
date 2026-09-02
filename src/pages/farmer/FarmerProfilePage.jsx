import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA';

const AVATAR_PRESETS = [
  {
    name: 'Current Photo',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsSudoKNyE7RJZob9ewQOMJwTcwZUjLC5hQwyUPRj0Jw5fUDlpXhqui_Y4_7IcAnQmAdgWVOcPEnf6cV1rotCpFACgesUn3oD-PCwQkJP7f8H7tO4HZzAkGd9HVZm9pXVk9ajbGmq5nOT3u50Rhr06u7IEESRHxHUfaFbkfSXThrWGF37A-1rj954tpLOOk8g1neswi5Qr6ZZQdHyAZ2SODHuakgv-slcE-AxKG-YQO6u39Trc4sqnA'
  },
  {
    name: 'Traditional Turban',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Green Field Portrait',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smiling Farm Owner',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
  }
];

export default function FarmerProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { notify } = useFarmer();

  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Ravi Kumar',
    phone: '+91 98765 43210',
    email: user?.email || 'farmer@naamuzhavar.com',
    farmName: 'Ravi Organic Harvests & Agro Farm',
    location: user?.location || 'Erode, Tamil Nadu',
    district: 'Erode',
    taluk: 'Modakkurichi',
    address: 'Survey No. 44/2, Modakkurichi Road, Erode 638104',
    farmSize: '4.5 Acres',
    farmingType: 'Certified Organic & Natural Farming',
    soilType: 'Red Loam & Alluvial',
    irrigation: 'Drip Irrigation & Borewell',
    upiId: 'ravifarmer@oksbi',
    bankAccount: 'State Bank of India (A/C: ****5542)'
  });

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Invalid File', 'Please select a valid image file (JPG, PNG, WEBP).', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify('File Too Large', 'Please select an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAvatarUrl = event.target.result;
      setAvatar(newAvatarUrl);
      updateUserProfile({ avatar: newAvatarUrl });
      notify('Photo Updated', 'New farmer profile photo applied successfully!', 'success');
      setShowAvatarPicker(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setAvatar(url);
    updateUserProfile({ avatar: url });
    notify('Photo Updated', 'Profile photo updated.', 'success');
    setShowAvatarPicker(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    updateUserProfile({
      name: profileData.name,
      location: profileData.location,
      avatar
    });
    notify('Profile Updated', 'Farmer credentials and farm details updated successfully.', 'success');
  };

  return (
    <FarmerLayout>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: '1.85rem' }}>
            Farmer Profile &amp; Identity
          </h1>
          <p className="text-muted small mb-0">
            Verified agricultural credentials on the Naam Uzhavar Direct Farmer Marketplace.
          </p>
        </div>

        <button
          type="button"
          className={`btn ${isEditing ? 'btn-outline-secondary' : 'btn-success'} fw-bold px-4 py-2 rounded-3`}
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil-square'} me-2`}></i>
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar & Trust Badges (4 cols) */}
        <div className="col-lg-4">
          <div className="farm-card text-center mb-4">
            {/* Avatar Photo with Change Photo Trigger */}
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={avatar || DEFAULT_AVATAR}
                alt={profileData.name}
                className="rounded-circle border border-3 border-success shadow-sm"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />

              {/* Upload Photo Button */}
              <button
                type="button"
                className="btn btn-sm btn-success rounded-circle position-absolute bottom-0 end-0 p-2 shadow d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                title="Change Profile Photo"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                <i className="bi bi-camera-fill fs-6"></i>
              </button>
            </div>

            {/* Avatar Picker / Upload Options */}
            {showAvatarPicker && (
              <div className="p-3 bg-light rounded-4 border mb-3 text-start farm-animate-fade">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark small">Change Profile Photo</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                    onClick={() => setShowAvatarPicker(false)}
                  >
                    ✕
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="d-none"
                  onChange={handleAvatarFileChange}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-success w-100 mb-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-upload"></i>
                  <span>Upload from Device</span>
                </button>

                <div className="small text-muted fw-bold mb-2" style={{ fontSize: '0.72rem' }}>
                  Or choose a photo:
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset.url}
                      alt={preset.name}
                      title={preset.name}
                      className="rounded-circle border cursor-pointer hover-scale"
                      style={{
                        width: '38px',
                        height: '38px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectPreset(preset.url)}
                    />
                  ))}
                </div>
              </div>
            )}

            <h4 className="fw-bold text-dark mb-1">{profileData.name}</h4>
            <div className="text-success fw-semibold small mb-2">{profileData.farmName}</div>
            <div className="text-muted small mb-3">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {profileData.location}
            </div>

            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                ⭐ 4.9 Direct Farmer
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                ✓ 100% Organic
              </span>
            </div>

            <hr className="my-3 text-muted opacity-25" />

            {/* Trust Certifications */}
            <div className="text-start">
              <h6 className="fw-bold text-dark small mb-3 text-uppercase">
                Verified Credentials &amp; Documents
              </h6>
              <div className="d-flex flex-column gap-2 small">
                <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-shield-fill-check text-success fs-5"></i>
                    <span>Aadhaar Kisan KYC</span>
                  </div>
                  <span className="badge bg-success">Verified</span>
                </div>

                <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-check-fill text-success fs-5"></i>
                    <span>TN Land Record 10/11</span>
                  </div>
                  <span className="badge bg-success">Verified</span>
                </div>

                <div className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check-fill text-success fs-5"></i>
                    <span>APMC Mandi Registration</span>
                  </div>
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details & Farm Specs (8 cols) */}
        <div className="col-lg-8">
          <div className="farm-card">
            <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-person-lines-fill text-success"></i>
              <span>Farm Overview &amp; Specifications</span>
            </h5>

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    disabled={!isEditing}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Farm Name / Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.farmName}
                    onChange={(e) => setProfileData({ ...profileData, farmName: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Farm Size</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.farmSize}
                    onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Farming Practice</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.farmingType}
                    onChange={(e) => setProfileData({ ...profileData, farmingType: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-dark">Farm Gate Address</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!isEditing}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Direct Payout Settings */}
              <h5 className="fw-bold text-dark mb-3 pt-3 pb-2 border-top d-flex align-items-center gap-2">
                <i className="bi bi-wallet2 text-success"></i>
                <span>Direct Buyer Payout Routing (Zero Middlemen)</span>
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Direct UPI VPA</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    disabled={!isEditing}
                    value={profileData.upiId}
                    onChange={(e) => setProfileData({ ...profileData, upiId: e.target.value })}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-dark">Linked Bank Account</label>
                  <input
                    type="text"
                    className="form-control font-monospace"
                    disabled={!isEditing}
                    value={profileData.bankAccount}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bankAccount: e.target.value })
                    }
                  />
                </div>
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success fw-bold px-4">
                    Save Profile Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
