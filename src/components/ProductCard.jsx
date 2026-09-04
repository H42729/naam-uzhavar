/**
 * ProductCard Component
 * High-trust, responsive produce card for Buyer Marketplace.
 * Addresses UI layout, spacing, and alignment requirements:
 * 1. Card Padding & Right Inset: Consistent 16px/px-4 horizontal padding across all rows.
 * 2. Seller Info Row: 6px gap between user icon and seller name; vertically center-aligned Verified badge.
 * 3. Price & Mandi Reference: flex justify-between items-baseline preventing text overflow.
 * 4. Availability & Delivery: justify-between items-center with clean inner spacing.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import brinjalImg from '../assets/brinjal.jpg';

const CROP_FALLBACK = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  brinjal: brinjalImg,
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80';

export default function ProductCard({
  product,
  onViewDetails,
  onBuyNow,
  onAddBulkRequirement
}) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  if (!product) return null;

  const cropKey = (product.crop || '').toLowerCase();
  const isBrinjal = cropKey.includes('brinjal') || cropKey.includes('eggplant');

  let displayImage = isBrinjal ? brinjalImg : (product.image || product.images?.[0]);
  if (!displayImage || displayImage.includes('1628773822503') || displayImage.includes('1622206151226') || displayImage.includes('1590165482129')) {
    displayImage = isBrinjal ? brinjalImg : (CROP_FALLBACK[cropKey] || FALLBACK_IMAGE);
  }

  const baseWeightKg = product.minOrder || product.baseWeight || (product.crop === 'Tomato' ? 50 : (product.quantity || 50));
  const unitPricePerKg = product.price || (product.crop === 'Tomato' ? 25 : 30);
  const locationBadge = product.location || 'Dindigul';
  const categoryName = product.category || 'Vegetables';
  const gradeName = product.grade || 'Grade A Premium';

  // Formatted produce title with Tamil script (e.g. "Tomato (நாட்டு தக்காளி)")
  let formattedCropName = product.crop || 'Produce';
  if (product.crop === 'Tomato' || (product.crop && product.crop.toLowerCase().includes('tomato'))) {
    formattedCropName = 'Tomato (நாட்டு தக்காளி)';
  } else if (product.tamilName) {
    formattedCropName = `${product.crop} (${product.tamilName})`;
  }

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate(`/buyer/products/${product.id}`);
    }
  };

  const handleBulkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Exact Card Data Mapping Contract as specified:
    const bulkPayload = {
      cropName: formattedCropName,                          // Formatted produce title with Tamil script
      unitPrice: Number(unitPricePerKg),                    // Extracted from "UNIT PRICE ₹25 /kg"
      baseWeight: Number(baseWeightKg),                     // Extracted from "BASE WEIGHT 50 kg"
      location: locationBadge,                              // Extracted from bottom-left location badge
      category: categoryName,
      grade: gradeName,
      product                                               // Complete raw product reference
    };

    // Navigate directly to /buyer/requirement with state payload
    navigate('/buyer/requirement', {
      state: bulkPayload
    });

    if (onAddBulkRequirement) {
      onAddBulkRequirement(product, bulkPayload);
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="group h-full flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* 1. Image Container with Badges */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={displayImage}
            alt={product.crop}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = isBrinjal ? brinjalImg : (CROP_FALLBACK[cropKey] || FALLBACK_IMAGE);
            }}
          />

          {/* Grade Badge (Top Right) */}
          <span className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {product.grade || 'Grade A'}
          </span>

          {/* Location Badge (Bottom Left) */}
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
            <i className="bi bi-geo-alt-fill text-amber-400"></i>
            <span>{product.location || 'Tamil Nadu'}</span>
          </div>

          {/* Category Chip (Top Left) */}
          {product.category && (
            <span className="absolute top-2.5 left-2.5 bg-slate-800/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* 2. Card Content Body */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Row 1: Crop Name & Subtitle */}
          <div className="mb-2 min-h-[42px]">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
              <Link
                to={`/buyer/products/${product.id}`}
                className="hover:text-emerald-600 transition-colors no-underline text-slate-900"
              >
                {product.crop}
              </Link>
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5 mb-0">
              {product.tamilName || 'நாட்டு விளைச்சல்'} • {product.farmer || 'Verified Farmer'}
            </p>
          </div>

          {/* Row 2: Price & Base Weight Display */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 mb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">
                Unit Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{unitPricePerKg}
                </span>
                <span className="text-xs text-slate-500 font-medium">/kg</span>
              </div>
            </div>

            <div className="text-right border-l border-slate-200 pl-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">
                Base Weight
              </span>
              <div className="flex items-center justify-end gap-1 text-emerald-700 font-bold text-sm">
                <i className="bi bi-box-seam text-xs"></i>
                <span>{baseWeightKg} kg</span>
              </div>
            </div>
          </div>

          {/* Row 3: Shelf Life & Guarantee Mini Info */}
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3.5 px-0.5">
            <span className="flex items-center gap-1">
              <i className="bi bi-patch-check-fill text-emerald-600"></i>
              <span className="text-slate-600 font-medium">Farmgate Verified</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <i className="bi bi-clock-history text-slate-400"></i>
              <span>{product.shelfLife || '8–10 Days'}</span>
            </span>
          </div>

          {/* Row 4: Two Distinct Action Buttons Side-by-Side */}
          <div className="mt-auto pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Buy Now: Accent button for immediate single-unit checkout */}
              <button
                type="button"
                onClick={handleBuyNowClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98] border-0 cursor-pointer"
                title={`Immediate purchase of 1 base unit (${baseWeightKg} kg)`}
              >
                <i className="bi bi-lightning-charge-fill text-amber-300 text-xs"></i>
                <span className="truncate">{language === 'ta' ? 'உடனடி வாங்கு' : 'Buy Now'}</span>
              </button>

              {/* Add Bulk Requirement: Outlined/secondary button navigating to /buyer/requirement */}
              <button
                type="button"
                onClick={handleBulkClick}
                className="w-full bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-700 border-2 border-emerald-600 hover:border-emerald-700 font-bold py-2 px-1.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer"
                title={`Post bulk requirement for ${formattedCropName}`}
              >
                <i className="bi bi-plus-circle text-xs"></i>
                <span className="truncate">{language === 'ta' ? '+ மொத்த தேவை' : '+ Add Bulk'}</span>
              </button>
            </div>

            {/* View Details Subtle Link */}
            <div className="text-center pt-1">
              {onViewDetails ? (
                <button
                  type="button"
                  onClick={() => onViewDetails(product)}
                  className="text-slate-400 hover:text-emerald-700 text-xs inline-flex items-center gap-1 transition-colors bg-transparent border-0 p-0 cursor-pointer"
                >
                  <span>{language === 'ta' ? 'முழு விவரங்கள்' : 'View Details'}</span>
                  <i className="bi bi-chevron-right text-[10px]"></i>
                </button>
              ) : (
                <Link
                  to={`/buyer/products/${product.id}`}
                  className="text-slate-400 hover:text-emerald-700 text-xs inline-flex items-center gap-1 transition-colors no-underline"
                >
                  <span>{language === 'ta' ? 'முழு விவரங்கள்' : 'View Details'}</span>
                  <i className="bi bi-chevron-right text-[10px]"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
