/**
 * Farmer "My Harvest" Management Page
 * Route: /farmer/harvest
 * Displays the farmer's active and past produce listings in clean, responsive cards.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import AddHarvestModal from '../../components/farmer/AddHarvestModal';
import cropService from '../../services/cropService';

export default function FarmerHarvestPage() {
  const { harvests, removeHarvest, updateHarvest } = useFarmer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCrops() {
      const fetched = await cropService.getCrops();
      if (isMounted && Array.isArray(fetched) && fetched.length > 0) {
        setCrops(fetched);
        if (!selectedCrop) {
          setSelectedCrop(fetched[0]);
        }
      }
    }
    loadCrops();
    return () => { isMounted = false; };
  }, []);

  // Delete confirmation modal state
  const [harvestToDelete, setHarvestToDelete] = useState(null);

  // Edit harvest modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const filterTabs = ['All', 'Available', 'Buyer Request', 'Reserved', 'Sold'];

  const filteredHarvests = harvests.filter((item) => {
    if (activeFilter === 'All') return true;
    return (item.status || '').toLowerCase() === activeFilter.toLowerCase();
  });

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditPrice(item.pricePerKg || item.typicalPricePerKg || 25);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateHarvest(editingItem.id, {
      quantity: editQuantity,
      pricePerKg: Number(editPrice)
    });
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (harvestToDelete) {
      removeHarvest(harvestToDelete.id, harvestToDelete.name);
      setHarvestToDelete(null);
    }
  };

  // Lock body scroll and close modal on Escape key press
  useEffect(() => {
    if (!harvestToDelete && !editingItem) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (harvestToDelete) setHarvestToDelete(null);
        if (editingItem) setEditingItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [harvestToDelete, editingItem]);

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'பண்ணை விளைச்சல் இருப்பு' : 'FARM PRODUCE INVENTORY'}
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('myHarvests')}</h1>
          </div>

          <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
            <Link
              to="/farmer/add-harvest"
              className="btn btn-warning text-dark fw-black px-4 py-2.5 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 border-0 hover-scale transition w-100 w-md-auto"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                minHeight: '44px'
              }}
            >
              <i className="bi bi-plus-circle-fill fs-5"></i>
              <span>{t('addHarvestCTA')}</span>
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs (Sticky Sub-Header) - 1 tab per row on mobile, horizontal on desktop */}
        <div className="farm-sticky-sub-header bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-4 farm-tabs-container scrollbar-none shadow-xs">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? harvests.length
                : harvests.filter((h) => (h.status || '').toLowerCase() === tab.toLowerCase()).length;
            const isActive = activeFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                className={`farm-tab-pill border ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 font-medium border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setActiveFilter(tab)}
              >
                <span className="fw-semibold">
                  {tab === 'All'
                    ? (language === 'ta' ? 'அனைத்தும்' : 'All')
                    : tab === 'Available'
                    ? t('availableStatus')
                    : tab === 'Buyer Request'
                    ? t('buyerRequests')
                    : tab === 'Reserved'
                    ? (language === 'ta' ? 'முன்பதிவு செய்யப்பட்டது' : 'Reserved')
                    : tab === 'Sold'
                    ? t('soldStatus')
                    : tab}
                </span>
                <span
                  className={`inline-flex align-items-center justify-content-center px-2 py-0.5 rounded-pill text-[11px] fw-bold ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  style={{ minWidth: '22px', height: '22px' }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Harvest Cards Grid */}
        {filteredHarvests.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-3">
            <i className="bi bi-flower2 fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">{t('noHarvestYetTitle')}</h3>
            <p className="text-muted small mb-4">{t('noHarvestYetDesc')}</p>
            <Link to="/farmer/add-harvest" className="btn btn-success fw-bold px-4 py-2.5 rounded-pill shadow-xs">
              {t('addHarvestCTA')}
            </Link>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {filteredHarvests.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="farm-card p-3.5 rounded-4 bg-white border h-100 d-flex flex-column shadow-xs">
                  {/* Photo & Status Badge */}
                  <div className="rounded-3 overflow-hidden position-relative mb-3" style={{ height: '175px' }}>
                    <img
                      src={
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-100 h-100 object-fit-cover"
                    />

                    {/* Status Badge */}
                    <span
                      className={`position-absolute top-0 end-0 badge m-2 fw-bold ${
                        item.status === 'Available'
                          ? 'bg-success text-white'
                          : item.status === 'Buyer Request'
                          ? 'bg-warning text-dark'
                          : item.status === 'Sold'
                          ? 'bg-secondary text-white'
                          : 'bg-info text-dark'
                      }`}
                    >
                      {item.status === 'Available'
                        ? t('availableStatus')
                        : item.status === 'Sold'
                        ? t('soldStatus')
                        : item.status}
                    </span>

                    {/* Multi-photo indicator if more than 1 image */}
                    {item.images && item.images.length > 1 && (
                      <span className="position-absolute bottom-0 start-0 badge bg-dark bg-opacity-75 m-2 small">
                        <i className="bi bi-images me-1"></i> {item.images.length} Photos
                      </span>
                    )}
                  </div>

                  {/* Crop Title */}
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div>
                      <strong className="fs-5 text-dark d-block">
                        {language === 'ta' ? item.tamilName || item.name : item.name}
                      </strong>
                      <span className="text-muted small">
                        <i className="bi bi-calendar3 me-1"></i> {item.harvestDate || 'Fresh'}
                      </span>
                    </div>
                  </div>

                  {/* Produce Details Box */}
                  <div className="p-3 bg-light rounded-3 my-2 small">
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">{t('availableQuantityLabel')}:</span>
                      <strong className="text-success font-monospace fs-6">
                        {item.quantity} {item.unit || 'kg'}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">{t('expectedPriceLabel')}:</span>
                      <strong className="text-dark font-monospace fs-6">
                        ₹{item.pricePerKg || item.typicalPricePerKg || 25} / kg
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">{t('farmLocationLabel')}:</span>
                      <strong className="text-dark">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {item.location || 'Dindigul, TN'}
                      </strong>
                    </div>

                    {/* Buyer Requests Linkage */}
                    <div className="d-flex justify-content-between align-items-center pt-1 border-top mt-1">
                      <span className="text-muted">Buyer Interest:</span>
                      {item.buyerRequestCount > 0 ? (
                        <Link
                          to="/farmer/requests"
                          className="badge bg-warning text-dark text-decoration-none fw-bold px-2 py-1"
                        >
                          📩 {item.buyerRequestCount} {t('buyerRequests')} →
                        </Link>
                      ) : (
                        <span className="text-muted small">0 Requests</span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions - In Tamil on mobile: Stacked one by one (Edit, View Requests, Delete) */}
                  <div
                    className={`d-flex gap-2 mt-auto pt-2 border-top ${
                      language === 'ta'
                        ? 'flex-column flex-md-row align-items-stretch align-items-md-center'
                        : 'align-items-center'
                    }`}
                  >
                    <button
                      type="button"
                      className={`btn btn-outline-secondary btn-sm fw-bold rounded-pill d-flex align-items-center justify-content-center ${
                        language === 'ta' ? 'w-100 w-md-auto flex-md-fill' : 'flex-fill'
                      }`}
                      style={{ minHeight: '44px' }}
                      onClick={() => handleOpenEdit(item)}
                    >
                      <i className="bi bi-pencil me-1.5"></i> {t('editHarvestBtn')}
                    </button>

                    <Link
                      to="/farmer/requests"
                      className={`btn btn-outline-success btn-sm fw-bold rounded-pill text-center text-decoration-none d-flex align-items-center justify-content-center ${
                        language === 'ta' ? 'w-100 w-md-auto flex-md-fill' : 'flex-fill'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      <i className="bi bi-inbox me-1.5"></i> {t('viewRequestsForCrop')}
                    </Link>

                    {language === 'ta' ? (
                      <>
                        {/* Mobile View Only (Tamil): Stacked one by one delete action button */}
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm fw-bold rounded-pill d-flex d-md-none align-items-center justify-content-center w-100"
                          style={{ minHeight: '44px' }}
                          onClick={() => setHarvestToDelete(item)}
                          title={t('removeHarvestBtn')}
                        >
                          <i className="bi bi-trash3 me-1.5"></i> {language === 'ta' ? 'விளைச்சலை நீக்கு' : t('removeHarvestBtn')}
                        </button>

                        {/* Desktop View (Tamil): Clean circular delete button */}
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-circle p-0 d-none d-md-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
                          onClick={() => setHarvestToDelete(item)}
                          title={t('removeHarvestBtn')}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
                        onClick={() => setHarvestToDelete(item)}
                        title={t('removeHarvestBtn')}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Harvest Quick Modal (Portaled directly to document.body) */}
      {editingItem &&
        createPortal(
          <div
            className="position-fixed d-flex align-items-center justify-content-center p-3"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 999999
            }}
            onClick={() => setEditingItem(null)}
          >
            <div
              className="bg-white rounded-4 p-4 max-w-md w-100 shadow-2xl position-relative"
              style={{ maxWidth: '440px', border: '1px solid #f1f5f9' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <strong className="fs-6 text-dark">
                  <i className="bi bi-pencil-square text-success me-2"></i>
                  {t('editHarvestBtn')} — {language === 'ta' ? editingItem.tamilName || editingItem.name : editingItem.name}
                </strong>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setEditingItem(null)}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('availableQuantityLabel')} ({editingItem.unit || 'kg'})
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-dark mb-1">
                    {t('expectedPriceLabel')} (₹ / kg)
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-3"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-light btn-sm rounded-pill px-3 fw-bold"
                    style={{ minHeight: '38px' }}
                    onClick={() => setEditingItem(null)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm rounded-pill px-4 fw-bold shadow-xs"
                    style={{ minHeight: '38px' }}
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal (Portaled directly to document.body to prevent containing-block clipping) */}
      {harvestToDelete &&
        createPortal(
          <div
            className="position-fixed d-flex align-items-center justify-content-center p-3"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 999999
            }}
            onClick={() => setHarvestToDelete(null)}
          >
            <div
              className="bg-white rounded-4 p-4 shadow-2xl position-relative w-100"
              style={{
                maxWidth: '430px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon in Top Right */}
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                onClick={() => setHarvestToDelete(null)}
                aria-label="Close"
              ></button>

              <div className="text-center pt-2">
                {/* Warning Icon Badge */}
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#dc2626',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.15)'
                  }}
                >
                  <i className="bi bi-trash3-fill fs-3"></i>
                </div>

                <h3 className="fs-5 fw-bold text-dark mb-2">
                  {language === 'ta' ? 'விளைச்சலை நீக்க வேண்டுமா?' : 'Remove Harvest Listing?'}
                </h3>

                {/* Produce Preview Pill */}
                <div className="p-2.5 px-3 bg-slate-50 rounded-3 border border-slate-200 my-3 d-flex align-items-center gap-3 text-start">
                  <img
                    src={
                      harvestToDelete.images?.[0] ||
                      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={harvestToDelete.name}
                    className="rounded-2 object-fit-cover flex-shrink-0"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div className="min-w-0 flex-1">
                    <strong className="text-dark d-block text-truncate" style={{ fontSize: '0.95rem' }}>
                      {language === 'ta' ? harvestToDelete.tamilName || harvestToDelete.name : harvestToDelete.name}
                    </strong>
                    <div className="small text-muted d-flex align-items-center gap-2 mt-0.5">
                      <span className="text-success fw-bold font-monospace">
                        {harvestToDelete.quantity} {harvestToDelete.unit || 'kg'}
                      </span>
                      <span>•</span>
                      <span className="text-dark fw-bold font-monospace">
                        ₹{harvestToDelete.pricePerKg || harvestToDelete.typicalPricePerKg || 25}/kg
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-muted small mb-4 px-1" style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
                  {language === 'ta'
                    ? `"${harvestToDelete.tamilName || harvestToDelete.name}" விளைச்சல் பதிவு சந்தையிலிருந்து நிரந்தரமாக நீக்கப்படும். வாங்குபவர்கள் இனி இதை பார்க்கவோ அல்லது ஆர்டர் செய்யவோ முடியாது.`
                    : `This harvest listing will be permanently removed from the active marketplace. Buyers will no longer be able to place purchase requests.`}
                </p>

                {/* Modal Actions */}
                <div className="d-flex align-items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 py-2.5 fw-bold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all flex-fill"
                    style={{ minHeight: '44px' }}
                    onClick={() => setHarvestToDelete(null)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill px-4 py-2.5 fw-bold text-white transition-all flex-fill d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                    style={{
                      minHeight: '44px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                    }}
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash3-fill"></i>
                    <span>{t('removeHarvestBtn')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add Harvest 4-Step Popup Modal */}
      <AddHarvestModal
        show={showAddModal}
        initialCrop={selectedCrop}
        onClose={() => setShowAddModal(false)}
      />
    </FarmerLayout>
  );
}
