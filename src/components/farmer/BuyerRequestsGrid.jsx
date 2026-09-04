import React from 'react';
import BuyerOfferCard from './BuyerOfferCard';
import { useLanguage } from '../../context/LanguageContext';

/**
 * BuyerRequestsGrid
 * Direct wholesale offer card grid component.
 * Displays buyer requests in a 1-col (mobile) -> 2-col (tablet) -> 3-col (desktop) responsive layout.
 */
export default function BuyerRequestsGrid({
  requests = [],
  onAccept,
  onDecline,
  variant = 'dashboard',
  limit,
  renderActions
}) {
  const { t } = useLanguage();

  const displayedRequests = limit ? requests.slice(0, limit) : requests;

  if (!displayedRequests || displayedRequests.length === 0) {
    return (
      <div className="p-4 sm:p-5 text-center bg-white rounded-2xl border border-slate-200">
        <i className="bi bi-inbox-fill text-3xl text-slate-400 mb-2 d-block"></i>
        <strong className="text-base text-slate-800 d-block mb-1">
          {t('noRequestsYetTitle') || 'No Buyer Requests Yet'}
        </strong>
        <p className="text-xs sm:text-sm text-slate-500 mb-0">
          {t('noRequestsYetDesc') || 'Add your produce harvest to start receiving direct wholesale bids.'}
        </p>
      </div>
    );
  }

  return (
    <div className="farm-buyer-requests-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {displayedRequests.map((req) => (
        <div key={req.id} className="w-full flex">
          <BuyerOfferCard
            request={req}
            onAccept={onAccept}
            onDecline={onDecline}
            variant={variant}
            renderActions={renderActions}
          />
        </div>
      ))}
    </div>
  );
}
