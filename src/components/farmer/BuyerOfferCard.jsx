import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

/**
 * BuyerOfferCard
 * Refactored direct wholesale offer card resolving text clipping, layout collisions,
 * right-edge overflow, and inner padding defects.
 */
export default function BuyerOfferCard({
  request,
  onAccept,
  onDecline,
  variant = 'dashboard',
  renderActions
}) {
  const { t, language } = useLanguage();

  if (!request) return null;

  const getStatusChip = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t('accepted') || (language === 'ta' ? 'ஏற்கப்பட்டது' : 'Accepted')}
          </span>
        );
      case 'Declined':
        return (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            {t('declineBtn') || (language === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Declined')}
          </span>
        );
      case 'In Conversation':
        return (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {t('inConversationLabel') || 'In Conversation'}
          </span>
        );
      case 'Completed':
        return (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {t('completed') || (language === 'ta' ? 'முடிந்தது' : 'Completed')}
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            {t('pending') || (language === 'ta' ? 'நிலுவையில்' : 'Pending')}
          </span>
        );
    }
  };

  const cropName = request.cropRequested || request.productName || 'Produce Lot';
  const buyerName = request.buyerName || 'Wholesale Buyer';
  const buyerType = request.buyerType || 'Bulk Purchaser';
  const quantity = request.quantity || '—';
  const offerPrice = request.offerPrice || (request.price ? `₹${request.price} / kg` : '—');
  const location = request.location || request.deliveryLocation || 'Dindigul Hub';

  return (
    <div className="farm-offer-card farm-card bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 h-full flex flex-col hover-shadow transition">
      {/* 3. Buyer Profile Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src={
              request.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
            }
            alt={buyerName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate mb-0.5" title={buyerName}>
              {buyerName}
            </h3>
            <p className="text-xs text-slate-500 truncate mb-0" title={buyerType}>
              {buyerType}
            </p>
          </div>
        </div>

        {getStatusChip(request.status)}
      </div>

      {/* 2. Product Name & Spec Row Architecture */}
      <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs sm:text-sm">
        {/* Product Name Row */}
        <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100">
          <span className="w-1/3 text-slate-500 font-medium shrink-0">
            {t('productNameLabel') || (language === 'ta' ? 'பயிர்' : 'Product Name')}:
          </span>
          <span className="w-2/3 text-right font-semibold text-slate-900 leading-snug break-words">
            {cropName}
          </span>
        </div>

        {/* Quantity Row */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">
            {t('quantityLabel') || (language === 'ta' ? 'அளவு' : 'Quantity')}:
          </span>
          <span className="text-right font-bold font-mono text-emerald-700">
            {quantity}
          </span>
        </div>

        {/* Offered Price Row */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 font-medium">
            {t('offeredPriceLabel') || (language === 'ta' ? 'வழங்கப்பட்ட விலை' : 'Offered Price')}:
          </span>
          <span className="text-right font-bold font-mono text-slate-900">
            {offerPrice}
          </span>
        </div>
      </div>

      {/* 4. Location Line */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 my-3">
        <i className="bi bi-geo-alt-fill text-rose-500 shrink-0"></i>
        <span className="truncate" title={location}>
          {location}
        </span>
      </div>

      {/* 4. Bottom Action Buttons Container */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-auto w-full">
        {renderActions ? (
          renderActions(request)
        ) : (
          <>
            {/* VIEW DETAILS */}
            <Link
              to={`/farmer/requests/${request.id}`}
              className="flex-1 h-9 inline-flex items-center justify-center rounded-lg border border-emerald-600 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors text-decoration-none"
            >
              {language === 'ta' ? 'விவரங்களைப் பார்' : 'VIEW DETAILS'}
            </Link>

            {/* Accept Button (shown for Pending requests) */}
            {request.status === 'Pending' && onAccept && (
              <button
                type="button"
                className="h-9 px-5 inline-flex items-center justify-center rounded-lg bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors border-0 shrink-0"
                onClick={() => onAccept(request.id)}
                title="Accept"
              >
                {t('acceptBtn') || (language === 'ta' ? 'ஏற்றுக்கொள்' : 'Accept')}
              </button>
            )}

            {/* Optional Decline Button for full page view */}
            {variant === 'full' && request.status === 'Pending' && onDecline && (
              <button
                type="button"
                className="h-9 px-3 inline-flex items-center justify-center rounded-lg border border-rose-300 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors shrink-0"
                onClick={() => onDecline(request.id)}
                title="Decline"
              >
                {t('declineBtn') || (language === 'ta' ? 'நிராகரி' : 'Decline')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
