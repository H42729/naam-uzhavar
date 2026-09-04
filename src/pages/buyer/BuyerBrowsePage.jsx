/**
 * Buyer Marketplace (Browse Produce) Page
 * Route: /buyer/browse
 * Main buyer experience for discovering fresh smallholder farmgate produce with search, filters, and high-clarity cards.
 * Follows Master Prompt Sections 6, 7, 8.
 */

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import ProductCard from '../../components/ProductCard';
import ProduceDetailsModal from '../../components/ProduceDetailsModal';
import BulkProcurementModal from '../../components/buyer/BulkProcurementModal';
import DirectBuyModal from '../../components/buyer/DirectBuyModal';

export default function BuyerBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { products } = useBuyer();
  const { t, language } = useLanguage();

  // Search & Filter State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkProduct, setBulkProduct] = useState(null);
  const [directBuyProduct, setDirectBuyProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [locationFilter, setLocationFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique locations from products
  const availableLocations = useMemo(() => {
    const locs = new Set(products.map((p) => p.location).filter(Boolean));
    return ['All', ...Array.from(locs)];
  }, [products]);

  // Filtered & Sorted Produce
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.crop.toLowerCase().includes(query) ||
          (item.tamilName && item.tamilName.toLowerCase().includes(query)) ||
          (item.farmer && item.farmer.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query));

        const matchesLocation =
          locationFilter === 'All' ||
          (item.location && item.location.toLowerCase() === locationFilter.toLowerCase());

        const matchesGrade =
          gradeFilter === 'All' ||
          (item.grade && item.grade.toLowerCase().includes(gradeFilter.toLowerCase()));

        return matchesSearch && matchesLocation && matchesGrade;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'qty-high') return (b.quantity || 0) - (a.quantity || 0);
        return 0;
      });
  }, [products, searchQuery, locationFilter, gradeFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationFilter('All');
    setGradeFilter('All');
    setSortBy('default');
  };

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. PAGE HEADER & SEARCH BAR
            =================================================================== */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'விவசாயிகளிடமிருந்து நேரடி கொள்முதல்' : 'DIRECT FARMGATE HARVESTS'}
            </span>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('marketplace')}</h1>
          </div>

          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold">
            {filteredProducts.length} {language === 'ta' ? 'விளைச்சல்கள் உள்ளன' : 'Produce Lots Available'}
          </span>
        </div>

        {/* ===================================================================
            2. SEARCH & FILTER TOOLBAR (STICKY SUB-HEADER)
            =================================================================== */}
        <div
          className="bd-sticky-sub-header sticky top-0 z-20 rounded-4 border p-3 mb-4"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px -3px rgba(15, 23, 42, 0.05)'
          }}
        >
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute text-muted small"
                  style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                ></i>
                <input
                  type="text"
                  className="form-control rounded-pill ps-4.5 bg-light border-0"
                  style={{ paddingLeft: '38px' }}
                  placeholder={t('searchProducePlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y text-muted p-2"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="col-12 col-md-7 d-none d-md-flex align-items-center justify-content-end gap-2">
              {/* Location Select */}
              <select
                className="form-select form-select-sm rounded-pill border w-auto text-dark"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? `📍 ${t('allLocations')}` : `📍 ${loc}`}
                  </option>
                ))}
              </select>

              {/* Grade Select */}
              <select
                className="form-select form-select-sm rounded-pill border w-auto text-dark"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="All">{language === 'ta' ? 'அனைத்து தரம்' : 'All Grades'}</option>
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Export">Export Quality</option>
                <option value="Organic">Organic Certified</option>
              </select>

              {/* Sort By Select */}
              <select
                className="form-select form-select-sm rounded-pill border w-auto text-dark"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">{language === 'ta' ? 'இயல்பு வரிசை' : 'Default Sorting'}</option>
                <option value="price-low">{t('priceLowToHigh')}</option>
                <option value="price-high">{t('priceHighToLow')}</option>
                <option value="qty-high">{language === 'ta' ? 'அதிக இருப்பு' : 'Highest Quantity'}</option>
              </select>

              {(searchQuery || locationFilter !== 'All' || gradeFilter !== 'All' || sortBy !== 'default') && (
                <button
                  type="button"
                  className="btn btn-sm btn-light border rounded-pill px-3 text-muted"
                  onClick={handleClearFilters}
                  title="Reset filters"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger Button */}
            <div className="col-12 d-md-none d-flex justify-content-between align-items-center pt-2 border-top">
              <span className="text-muted small">
                {filteredProducts.length} {language === 'ta' ? 'பொருட்கள்' : 'items'}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1.5"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <i className="bi bi-funnel"></i>
                <span>{t('filterProduceLabel')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Filters Drawer/Panel */}
          {showMobileFilters && (
            <div className="d-md-none pt-3 mt-3 border-top farm-animate-fade">
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-muted mb-1">{t('locationFilterLabel')}</label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc === 'All' ? t('allLocations') : loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small text-muted mb-1">{language === 'ta' ? 'தரம்' : 'Grade'}</label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                  >
                    <option value="All">All Grades</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Export">Export</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small text-muted mb-1">{language === 'ta' ? 'வரிசைப்படுத்து' : 'Sort'}</label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="price-low">{t('priceLowToHigh')}</option>
                    <option value="price-high">{t('priceHighToLow')}</option>
                    <option value="qty-high">Highest Quantity</option>
                  </select>
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-light rounded-pill px-3"
                    onClick={handleClearFilters}
                  >
                    {language === 'ta' ? 'மீட்டமை' : 'Reset'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill px-3"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    {language === 'ta' ? 'முடிந்தது' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
            3. PRODUCT GRID / EMPTY STATE
            =================================================================== */}
        {filteredProducts.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-4">
            <i className="bi bi-flower1 fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">{t('noProduceFoundTitle')}</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '380px', margin: '0 auto' }}>
              {t('noProduceFoundDesc')}
            </p>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold shadow-xs"
              onClick={handleClearFilters}
            >
              {language === 'ta' ? 'அனைத்து வடிகட்டிகளையும் நீக்குக' : 'Clear All Filters'}
            </button>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(p) => setSelectedProduct(p)}
                onBuyNow={(p) => setDirectBuyProduct(p)}
              />
            ))}
          </div>
        )}

        {/* View Details Produce Modal */}
        {selectedProduct && (
          <ProduceDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Bulk Procurement Multi-Farmer Matching Modal */}
        {bulkProduct && (
          <BulkProcurementModal
            product={bulkProduct}
            onClose={() => setBulkProduct(null)}
          />
        )}

        {/* Standard Direct Buy Now Modal */}
        {directBuyProduct && (
          <DirectBuyModal
            product={directBuyProduct}
            onClose={() => setDirectBuyProduct(null)}
          />
        )}
      </div>
    </BuyerLayout>
  );
}
