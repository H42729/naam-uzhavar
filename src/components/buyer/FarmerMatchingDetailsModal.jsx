import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import brinjalImg from '../../assets/brinjal.jpg';

const CROP_FALLBACKS = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80',
  brinjal: brinjalImg,
  eggplant: brinjalImg,
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=700&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80',
  drumstick: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=700&auto=format&fit=crop&q=80',
  moringa: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=700&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=700&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80'
};

export default function FarmerMatchingDetailsModal({ lot, cropName, onClose }) {
  const { language } = useLanguage();

  // Handle ESC key listener & body scroll lock
  useEffect(() => {
    if (!lot) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lot, onClose]);

  if (!lot) return null;

  // Extract core essential details
  const crop = lot.crop || cropName || 'Produce';
  const cropKey = crop.toLowerCase();
  const isBrinjal = cropKey.includes('brinjal') || cropKey.includes('eggplant');
  let productImage = isBrinjal ? brinjalImg : (lot.image || (lot.images && lot.images[0]));
  if (!productImage || productImage.includes('1628773822503') || productImage.includes('1622206151226')) {
    productImage = isBrinjal ? brinjalImg : (CROP_FALLBACKS[cropKey] || CROP_FALLBACKS.default);
  }

  const rawFarmer = lot._rawFarmer || {};
  const farmerName = lot.farmerName || rawFarmer.name || lot.farmer || 'Verified Farmer';
  const farmerPhone = lot.farmerPhone || rawFarmer.phone || '+91 98421 77234';
  const location = lot.location || rawFarmer.location || 'Dindigul';
  const farmAddress = lot.farmAddress || rawFarmer.farmAddress || `${location}, Tamil Nadu`;
  const grade = lot.grade || rawFarmer.grade || 'Grade A';

  const allocatedKg = Number(lot.allocatedKg ?? lot.allocatedQty ?? 0);
  const pricePerKg = Number(lot.pricePerKg ?? lot.price ?? 25);
  const subtotal = Number(lot.subtotal ?? (allocatedKg * pricePerKg));

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-farmer-details-title"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)'
        }}
      >
        {/* 1. Modal Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <i className="bi bi-info-circle-fill text-emerald-600 text-base"></i>
            <h3 id="modal-farmer-details-title" className="text-sm sm:text-base font-extrabold text-slate-900 mb-0">
              {language === 'ta' ? 'விவசாயி & விளைச்சல் விவரங்கள்' : 'Farmer & Produce Details'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* 2. Farmer Product Photo Banner */}
        <div className="relative w-full h-44 sm:h-48 bg-slate-100 overflow-hidden">
          <img
            src={productImage}
            alt={crop}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = CROP_FALLBACKS.default;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white/80 text-xs font-semibold block">
                  {language === 'ta' ? 'பயிர்' : 'Crop'}
                </span>
                <strong className="text-white text-lg font-black leading-tight">
                  {crop} {lot.tamilName ? `(${lot.tamilName})` : ''}
                </strong>
              </div>
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {grade}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Essential Details List */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Detail A: Farmer Details */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                {farmerName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  {language === 'ta' ? 'விவசாயி' : 'Farmer'}
                </span>
                <strong className="text-slate-900 font-bold text-sm block">
                  {farmerName}
                </strong>
                <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                  <i className="bi bi-patch-check-fill text-xs"></i>
                  {language === 'ta' ? 'சரிபார்க்கப்பட்ட விவசாயி' : 'Verified Farmer'}
                </span>
              </div>
            </div>

            {/* Direct Phone Button */}
            <a
              href={`tel:${farmerPhone.replace(/\s+/g, '')}`}
              className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-emerald-700 transition-colors no-underline self-start sm:self-auto"
              title="Call Farmer"
            >
              <i className="bi bi-telephone-fill text-[11px]"></i>
              <span>{farmerPhone}</span>
            </a>
          </div>

          {/* Detail B: Location */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">
                {language === 'ta' ? 'அமைவிடம்' : 'Location'}
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-0 leading-snug">
                {farmAddress}
              </p>
            </div>
          </div>

          {/* Detail C: Price & Allocation */}
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider mb-2">
              {language === 'ta' ? 'விலை & அளவு விவரம்' : 'Price & Allocation'}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 block font-medium">
                  {language === 'ta' ? 'விலை / கிலோ' : 'Price / kg'}
                </span>
                <strong className="text-slate-900 font-black text-sm sm:text-base">
                  ₹{pricePerKg}
                </strong>
              </div>

              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 block font-medium">
                  {language === 'ta' ? 'அளவு' : 'Allocated Qty'}
                </span>
                <strong className="text-emerald-700 font-black text-sm sm:text-base">
                  {allocatedKg.toLocaleString('en-IN')} kg
                </strong>
              </div>

              <div className="bg-white p-2 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-slate-500 block font-medium">
                  {language === 'ta' ? 'மொத்தம்' : 'Subtotal'}
                </span>
                <strong className="text-emerald-800 font-black text-sm sm:text-base">
                  ₹{subtotal.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-full border border-slate-300 text-slate-700 bg-white font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {language === 'ta' ? 'மூடு' : 'Close'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
