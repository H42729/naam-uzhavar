/**
 * Farmer Orders & Deliveries Tracking Page
 * Route: /farmer/orders & /farmer/deliveries
 * Simple, farmer-friendly order tracking showing order progress milestones from farmgate pickup to delivery.
 */

import React, { useState } from 'react';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerDeliveriesPage() {
  const { deliveries } = useFarmer();
  const { t, language } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('All');
  const filterTabs = ['All', 'Accepted', 'In Transit', 'Delivered'];

  const stages = [
    { key: 'orderAcceptedStage', defaultText: 'Order Accepted' },
    { key: 'driverAssignedStage', defaultText: 'Driver Assigned' },
    { key: 'pickupStage', defaultText: 'Pickup' },
    { key: 'inTransitStage', defaultText: 'In Transit' },
    { key: 'deliveredStage', defaultText: 'Delivered' }
  ];

  const filteredOrders = deliveries.filter((del) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Accepted') return del.currentStage === 'Order Accepted' || del.currentStage === 'Driver Assigned';
    if (statusFilter === 'In Transit') return del.currentStage === 'Pickup' || del.currentStage === 'In Transit';
    if (statusFilter === 'Delivered') return del.currentStage === 'Delivered';
    return true;
  });

  const getStatusBadge = (stage) => {
    switch (stage) {
      case 'Delivered':
        return <span className="badge bg-success text-white rounded-pill px-3 py-1">✅ {t('deliveredStage')}</span>;
      case 'In Transit':
      case 'Pickup':
        return <span className="badge bg-primary text-white rounded-pill px-3 py-1">🔵 {t('inTransitStage')}</span>;
      case 'Driver Assigned':
        return <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-3 py-1">🚚 {t('driverAssignedStage')}</span>;
      case 'Order Accepted':
      default:
        return <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">🟢 {t('orderAcceptedStage')}</span>;
    }
  };

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'பண்ணை சரக்கு கண்காணிப்பு' : 'FARM DISPATCH TRACKING'}
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('orders')}</h1>
          </div>

          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-truck me-1.5"></i>
            {language === 'ta' ? 'டாடா ஏஸ் போக்குவரத்து நெட்வொர்க்' : 'Tata Ace Transport Network'}
          </span>
        </div>

        {/* Filter Tabs (Sticky Sub-Header) */}
        <div className="farm-sticky-sub-header bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xs">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? deliveries.length
                : tab === 'Accepted'
                ? deliveries.filter((d) => d.currentStage === 'Order Accepted' || d.currentStage === 'Driver Assigned').length
                : tab === 'In Transit'
                ? deliveries.filter((d) => d.currentStage === 'Pickup' || d.currentStage === 'In Transit').length
                : tab === 'Delivered'
                ? deliveries.filter((d) => d.currentStage === 'Delivered').length
                : deliveries.filter((o) => (o.status || '').toLowerCase() === tab.toLowerCase()).length;
            const isActive = statusFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm shrink-0 whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 font-medium border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setStatusFilter(tab)}
              >
                <span>
                  {tab === 'All'
                    ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                    : tab === 'Accepted'
                    ? t('accepted')
                    : tab === 'In Transit'
                    ? t('inTransitStage')
                    : t('deliveredStage')}
                </span>
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-3">
            <i className="bi bi-box-seam fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">{t('noOrdersYetTitle')}</h3>
            <p className="text-muted small mb-0">{t('noOrdersYetDesc')}</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredOrders.map((ord) => {
              const currentStageIndex = Math.max(
                0,
                stages.findIndex((s) => s.defaultText.toLowerCase() === (ord.currentStage || '').toLowerCase())
              );

              return (
                <div key={ord.id} className="farm-card p-4 rounded-4 bg-white border shadow-xs">
                  {/* Order Top Summary */}
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <strong className="fs-5 text-dark font-monospace">
                          {t('orderNumberLabel')}{ord.id?.replace('ORD-', '')}
                        </strong>
                        <span className="badge bg-light text-muted border font-monospace small">
                          {ord.trackingNumber || ord.id}
                        </span>
                        {getStatusBadge(ord.currentStage)}
                      </div>

                      <div className="text-muted small">
                        <span>{t('buyerLabel')}: <strong className="text-dark">{ord.buyerName}</strong></span>
                        <span className="mx-2">•</span>
                        <span>{t('locationLabel')}: <strong className="text-dark">{ord.dropLocation?.split(',')[0] || 'Dindigul'}</strong></span>
                      </div>
                    </div>

                    <div className="text-md-end">
                      <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                        {language === 'ta' ? 'எதிர்பார்க்கப்படும் வருகை' : 'ESTIMATED ARRIVAL'}
                      </span>
                      <strong className="fs-5 text-success font-monospace">
                        {ord.estimatedArrival || 'Today'}
                      </strong>
                    </div>
                  </div>

                  {/* Produce & Price Highlight Box */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-4">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <span className="text-muted small d-block mb-0.5">{t('productNameLabel')}</span>
                        <strong className="fs-6 text-dark">{ord.crop}</strong>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <span className="text-muted small d-block mb-0.5">{t('quantityLabel')}</span>
                        <strong className="fs-6 text-success font-monospace">{ord.quantity}</strong>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <span className="text-muted small d-block mb-0.5">{t('offeredPriceLabel')}</span>
                        <strong className="fs-6 text-dark font-monospace">{ord.pricePerKg || '₹28 / kg'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 5-Step Visual Progress Tracker */}
                  <div className="mb-4 py-2">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                      {language === 'ta' ? 'விநியோக நிலைகள்' : 'ORDER PROGRESS MILESTONES'}:
                    </span>

                    {/* Progress Track Line */}
                    <div className="position-relative d-none d-md-flex align-items-center justify-content-between my-3 px-2">
                      <div
                        className="position-absolute bg-secondary-subtle"
                        style={{ height: '4px', left: '30px', right: '30px', zIndex: 1 }}
                      ></div>
                      <div
                        className="position-absolute bg-success transition"
                        style={{
                          height: '4px',
                          left: '30px',
                          width: `${(currentStageIndex / (stages.length - 1)) * 90}%`,
                          zIndex: 2
                        }}
                      ></div>

                      {stages.map((stg, sIdx) => {
                        const isCompleted = sIdx <= currentStageIndex;
                        const isCurrent = sIdx === currentStageIndex;

                        return (
                          <div
                            key={stg.key}
                            className="position-relative d-flex flex-column align-items-center text-center"
                            style={{ zIndex: 3, width: '120px' }}
                          >
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold mb-1 shadow-2xs transition ${
                                isCompleted
                                  ? 'bg-success text-white'
                                  : 'bg-white text-muted border border-2'
                              }`}
                              style={{
                                width: '38px',
                                height: '38px',
                                fontSize: '0.9rem',
                                transform: isCurrent ? 'scale(1.15)' : 'none'
                              }}
                            >
                              {isCompleted ? <i className="bi bi-check-lg"></i> : sIdx + 1}
                            </div>
                            <span
                              className={`small ${isCurrent ? 'fw-bold text-dark' : 'text-muted'}`}
                              style={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                            >
                              {t(stg.key, stg.defaultText)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Compact Tracker */}
                    <div className="d-md-none p-3 bg-light rounded-3 mb-2">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-success rounded-circle p-1.5">
                          <i className="bi bi-truck text-white"></i>
                        </span>
                        <strong className="text-dark small">
                          {t('orderTracking')}: {ord.currentStage}
                        </strong>
                      </div>
                      <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                        {ord.statusText || 'En route via southern freight corridor'}
                      </p>
                    </div>
                  </div>

                  {/* Driver Details Box */}
                  <div className="p-3 bg-light rounded-3 border d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
                        style={{ width: '42px', height: '42px' }}
                      >
                        <i className="bi bi-person-fill fs-5"></i>
                      </div>
                      <div>
                        <strong className="text-dark d-block small">
                          {ord.driverName} • <span className="text-muted">{ord.vehicleNumber}</span>
                        </strong>
                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-telephone-fill text-success me-1"></i>
                          {ord.driverPhone}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`tel:${ord.driverPhone}`}
                      className="btn btn-outline-success btn-sm fw-bold rounded-pill px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 text-decoration-none w-100 w-sm-auto"
                      style={{ minHeight: '44px' }}
                    >
                      <i className="bi bi-telephone-fill fs-6"></i>
                      <span>{t('callDriver')}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
