/**
 * BuyerProfilePage Component
 * Clean, uncluttered Buyer Profile Page showing ONLY essential details:
 * - Enterprise / Company Name
 * - Contact Person
 * - Phone Number & Email Address
 * - Warehouse / Delivery Address
 * - GSTIN Number
 * - Bank / UPI info
 * - Interactive Edit Profile feature with input validation and persistence
 */

import React, { useState, useEffect } from 'react';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Edit3,
  X,
  Save,
  CreditCard,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const DEFAULT_BUYER_PROFILE = {
  name: 'FreshMart Procurement',
  tamilName: 'ஃப்ரெஷ்மார்ட் கொள்முதல்',
  contactPerson: 'R. Kumar',
  phone: '9842178901',
  email: 'procurement@freshmartagri.in',
  city: 'Dindigul, Tamil Nadu',
  cityTamil: 'திண்டுக்கல், தமிழ்நாடு',
  warehouseAddress: 'Shed No. 14-B, APMC Market Yard, Palani Road, Dindigul - 624001',
  gstin: '33AAACH1234F1Z8',
  bankName: 'HDFC Bank (**** 8821)',
  upiId: 'freshmart.mandi@okhdfcbank',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
};

export default function BuyerProfilePage() {
  const { showToast } = useBuyer();
  const { t, language } = useLanguage();

  // Load profile from localStorage or fallback to default
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_buyer_profile_data');
      if (saved) {
        return { ...DEFAULT_BUYER_PROFILE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_BUYER_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleStartEdit = () => {
    setFormData(profile);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setErrorMsg('');
    setIsEditing(false);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();

    // Validation for essential fields
    if (!formData.name?.trim()) {
      setErrorMsg(language === 'ta' ? 'நிறுவனத்தின் பெயர் அவசியம்.' : 'Company name is required.');
      return;
    }
    if (!formData.contactPerson?.trim()) {
      setErrorMsg(language === 'ta' ? 'தொடர்பு நபர் பெயர் அவசியம்.' : 'Contact person is required.');
      return;
    }
    const cleanPhone = formData.phone?.replace(/[^0-9]/g, '') || '';
    if (cleanPhone.length < 10) {
      setErrorMsg(language === 'ta' ? 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      setErrorMsg(language === 'ta' ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid email address.');
      return;
    }
    if (!formData.warehouseAddress?.trim()) {
      setErrorMsg(language === 'ta' ? 'விநியோக முகவரி அவசியம்.' : 'Delivery address is required.');
      return;
    }

    setErrorMsg('');
    setProfile(formData);
    try {
      localStorage.setItem('naam_uzhavar_buyer_profile_data', JSON.stringify(formData));
    } catch {}

    setIsEditing(false);

    if (showToast) {
      showToast(
        language === 'ta'
          ? 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது.'
          : 'Profile details saved successfully.'
      );
    }
  };

  const displayName = language === 'ta' && profile.tamilName ? profile.tamilName : profile.name;
  const displayCity = language === 'ta' && profile.cityTamil ? profile.cityTamil : profile.city;

  return (
    <BuyerLayout>
      <div className="w-100 max-w-5xl mx-auto farm-animate-fade">
        
        {/* ===================================================================
            HEADER: TITLE & EDIT ACTION (CLEAN & MINIMAL)
            =================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
              {language === 'ta' ? 'வாங்குபவர் சுயவிவரம்' : 'Buyer Profile'}
            </h1>
            <p className="text-sm text-slate-500 mb-0">
              {language === 'ta'
                ? 'உங்கள் நிறுவன மற்றும் விநியோக முகவரி விவரங்கள்.'
                : 'Manage your enterprise, delivery location, and contact information.'}
            </p>
          </div>

          {/* Edit / Save Action */}
          <div>
            {!isEditing ? (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer border-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>{language === 'ta' ? 'சுயவிவரத்தை திருத்து' : 'Edit Profile'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{language === 'ta' ? 'ரத்து' : 'Cancel'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer border-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ===================================================================
            ESSENTIAL DETAILS: 2-COLUMN BALANCED VIEW
            =================================================================== */}
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. LEFT CARD: BUYER IDENTITY & QUICK SUMMARY */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
                <div className="relative inline-block mb-3">
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover shadow-sm mx-auto border-3 border-[#2563EB]"
                  />
                  <span
                    className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-1 flex items-center justify-center shadow-xs"
                    title="Verified Buyer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-0.5">{displayName}</h2>
                <p className="text-xs text-slate-500 font-medium mb-2">{profile.contactPerson}</p>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'ta' ? 'சரிபார்க்கப்பட்ட வாங்குபவர்' : 'Verified Buyer'}</span>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-center gap-1 pt-3 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{displayCity}</span>
                </div>
              </div>

              {/* Payment Settlement Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {language === 'ta' ? 'வங்கி & பணம் செலுத்துதல்' : 'Payment Account'}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ta' ? 'வங்கி கணக்கு:' : 'Bank:'}</span>
                    <span className="font-semibold text-slate-900">{profile.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ta' ? 'UPI ஐடி:' : 'UPI ID:'}</span>
                    <span className="font-mono font-medium text-slate-900">{profile.upiId}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 2. RIGHT CARD: EDITABLE IMPORTANT DETAILS */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#2563EB]" />
                    <h3 className="text-base font-bold text-slate-900 mb-0">
                      {language === 'ta' ? 'நிறுவன தகவல்கள்' : 'Enterprise Information'}
                    </h3>
                  </div>

                  {isEditing && (
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {language === 'ta' ? 'திருத்தும் பயன்முறை' : 'Editing Mode'}
                    </span>
                  )}
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Company Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'நிறுவனம் / வணிகப் பெயர்' : 'Company / Firm Name'}
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.name}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. FreshMart Procurement"
                    />
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'தொடர்பு நபர்' : 'Contact Person'}
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.contactPerson}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. R. Kumar"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9842178901"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.email}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@freshmartagri.in"
                    />
                  </div>

                  {/* GSTIN / Tax ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'ஜிஎஸ்டி எண் (GSTIN)' : 'GSTIN Number'}
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.gstin}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      placeholder="33AAACH1234F1Z8"
                    />
                  </div>

                  {/* Delivery / Warehouse Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'விநியோகம் / கிடங்கு முகவரி' : 'Delivery / Warehouse Address'}
                    </label>
                    <textarea
                      rows="3"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all ${
                        isEditing
                          ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={formData.warehouseAddress}
                      disabled={!isEditing}
                      onChange={(e) => setFormData({ ...formData, warehouseAddress: e.target.value })}
                      placeholder="Enter warehouse shed, street address, and pin code for vehicle delivery"
                    />
                  </div>

                </div>

                {/* Bottom Action Buttons when Editing */}
                {isEditing && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
                    >
                      {language === 'ta' ? 'ரத்து' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer border-0"
                    >
                      {language === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </form>

      </div>
    </BuyerLayout>
  );
}
