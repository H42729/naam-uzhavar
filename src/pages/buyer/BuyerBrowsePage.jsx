import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import ProductCard from '../../components/ProductCard';
import { LOCATIONS_LIST } from '../../data/buyerData';

export default function BuyerBrowsePage() {
  const navigate = useNavigate();
  const { products, setRequirementPrefill, showToast } = useBuyer();

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesSearch =
          item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation =
          locationFilter === 'All Locations' || item.location === locationFilter;

        return matchesSearch && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'qty-high') return b.quantity - a.quantity;
        if (sortBy === 'qty-low') return a.quantity - b.quantity;
        return 0;
      });
  }, [products, searchQuery, locationFilter, sortBy]);

  const handleAddToRequirement = (product) => {
    setRequirementPrefill({
      crop: product.crop,
      location: product.location,
      price: product.price,
      quantity: product.minOrder || 100
    });
    showToast(`✓ Pre-filled requirement with ${product.crop} from ${product.location}.`);
    navigate('/buyer/requirement');
  };

  return (
    <BuyerLayout>
      {/* Header */}
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title">Browse Available Produce</h2>
          <p className="bd-page-subtitle">
            Explore verified farmer & FPO crop inventories ready for direct farmgate procurement
          </p>
        </div>

        <button
          type="button"
          className="bd-btn bd-btn-primary bd-btn-sm"
          onClick={() => navigate('/buyer/requirement')}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Bulk Aggregation Tool</span>
        </button>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div className="bd-toolbar mb-4">
        {/* Search input */}
        <div className="bd-search-wrap">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="bd-search-input"
            placeholder="Search by crop, farmer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter by Location */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-semibold">Location:</span>
          <select
            className="bd-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {LOCATIONS_LIST.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort dropdown */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-semibold">Sort by:</span>
          <select
            className="bd-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="qty-high">Quantity: High to Low</option>
            <option value="qty-low">Quantity: Low to High</option>
          </select>
        </div>

        {/* Reset Filters */}
        {(searchQuery || locationFilter !== 'All Locations' || sortBy !== 'default') && (
          <button
            type="button"
            className="btn btn-sm btn-link text-muted p-0 text-decoration-none ms-auto"
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('All Locations');
              setSortBy('default');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Produce Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <i className="bi bi-search fs-1 text-secondary mb-2 d-block"></i>
          <h5 className="fw-semibold text-dark">No Agricultural Produce Found</h5>
          <p className="text-muted small mb-3">
            Try adjusting your search query or location filter to discover available crops.
          </p>
          <button
            type="button"
            className="bd-btn bd-btn-outline bd-btn-sm"
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('All Locations');
              setSortBy('default');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={() => navigate(`/buyer/products/${product.id}`)}
              onAddToRequirement={handleAddToRequirement}
            />
          ))}
        </div>
      )}
    </BuyerLayout>
  );
}
