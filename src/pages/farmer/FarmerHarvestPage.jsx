/**
 * Farmer "My Harvest" Management Page
 * Route: /farmer/harvest
 * Displays all active and past harvest listings with filtering, quality badges, buyer requests, and 1-click publishing.
 */

import React, { useState } from 'react';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import AddHarvestModal from '../../components/farmer/AddHarvestModal';
import { POPULAR_CROPS } from '../../data/cropsData';

export default function FarmerHarvestPage() {
  const { harvests, removeHarvest } = useFarmer();
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(POPULAR_CROPS[0]);

  const filterTabs = ['All', 'Available', 'Buyer Request', 'Reserved', 'Pickup Scheduled', 'Sold'];

  const filteredHarvests = harvests.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              {language === 'ta' ? 'விளைச்சல் இருப்பு' : 'PRODUCE INVENTORY'}
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('myHarvests')}</h1>
          </div>

          <button
            type="button"
            className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
            onClick={() => {
              setSelectedCrop(POPULAR_CROPS[0]);
              setShowAddModal(true);
            }}
          >
            <i className="bi bi-plus-circle-fill fs-5"></i>
            <span>+ {t('addMyHarvest')}</span>
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="d-flex gap-2 overflow-x-auto pb-2 mb-4">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? harvests.length
                : harvests.filter((h) => h.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm text-nowrap rounded-pill px-3 py-2 fw-semibold ${
                  activeFilter === tab
                    ? 'btn-success text-white shadow-xs'
                    : 'btn-light text-muted border'
                }`}
                onClick={() => setActiveFilter(tab)}
              >
                <span>{tab}</span>
                <span className="badge bg-white bg-opacity-25 ms-1 rounded-pill small">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Harvest Cards Grid */}
        {filteredHarvests.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border">
            <i className="bi bi-flower2 fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark">No harvests found under "{activeFilter}"</h3>
            <p className="text-muted small mb-3">
              Add a new crop harvest to start receiving direct buyer bids.
            </p>
            <button
              type="button"
              className="btn btn-success fw-bold px-4 py-2 rounded-pill"
              onClick={() => {
                setSelectedCrop(POPULAR_CROPS[0]);
                setShowAddModal(true);
              }}
            >
              + Add My Harvest
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filteredHarvests.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div className="farm-card p-3 rounded-4 bg-white border h-100 d-flex flex-column shadow-xs">
                  {/* Image & Status Badge */}
                  <div className="rounded-3 overflow-hidden position-relative mb-3" style={{ height: '180px' }}>
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
                      {item.status}
                    </span>

                    {/* Exact / Estimated Badge */}
                    <span className="position-absolute bottom-0 start-0 badge bg-dark bg-opacity-75 m-2 small">
                      {item.isEstimated ? 'Approx. Weight' : 'Weighed Exact'}
                    </span>
                  </div>

                  {/* Header Title */}
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <div>
                      <strong className="fs-5 text-dark d-block">{item.name}</strong>
                      <span className="text-muted small">
                        Harvested: {item.harvestDate || 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Details Pill Grid */}
                  <div className="p-3 bg-light rounded-3 my-2 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Quantity:</span>
                      <strong className="text-success font-monospace fs-6">
                        {item.quantity} {item.unit || 'kg'}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Quality Grade:</span>
                      <strong className="text-dark">{item.quality || 'Good / Fresh'}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Farm Location:</span>
                      <strong className="text-dark">{item.location || 'Dindigul, Tamil Nadu'}</strong>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Buyer Interest:</span>
                      <span className="badge bg-warning-subtle text-warning-emphasis">
                        {item.buyerRequestCount || 0} Buyer Requests
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="d-flex gap-2 mt-auto pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm flex-grow-1 fw-bold"
                      onClick={() => {
                        setSelectedCrop({
                          name: item.cropName || item.name,
                          tamilName: item.tamilName || '',
                          image: item.images?.[0] || ''
                        });
                        setShowAddModal(true);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => removeHarvest(item.id, item.name)}
                      title="Remove Listing"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Harvest 4-Step Popup */}
      <AddHarvestModal
        show={showAddModal}
        initialCrop={selectedCrop}
        onClose={() => setShowAddModal(false)}
      />
    </FarmerLayout>
  );
}
