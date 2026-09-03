import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import ProductCard from '../../components/ProductCard';
import { LOCATIONS_LIST } from '../../data/buyerData';

export default function BuyerBrowsePage() {
  const navigate = useNavigate();
  const { products, setRequirementPrefill, confirmOrder, showToast } = useBuyer();

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [sortBy, setSortBy] = useState('default');

  // Direct Buy Modal State
  const [buyingProduct, setBuyingProduct] = useState(null);
  const [buyQty, setBuyQty] = useState(100);
  const [deliveryHub, setDeliveryHub] = useState('Chennai Central Hub');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

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

  const handleOpenBuy = (product) => {
    setBuyingProduct(product);
    setBuyQty(product.minOrder || 100);
    setConfirmedOrder(null);
  };

  const handleConfirmDirectBuy = () => {
    if (!buyingProduct) return;
    const subtotal = buyQty * buyingProduct.price;
    const newOrder = confirmOrder({
      crop: buyingProduct.crop,
      quantity: buyQty,
      farmers: 1,
      amount: subtotal,
      deliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
      location: deliveryHub,
      farmerBreakdown: [
        {
          farmer: buyingProduct.farmer,
          qty: buyQty,
          price: buyingProduct.price
        }
      ]
    });

    setConfirmedOrder(newOrder);
    showToast(`✓ Direct order #${newOrder.id} placed for ${buyingProduct.crop}!`);
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
              onBuy={handleOpenBuy}
            />
          ))}
        </div>
      )}

      {/* ===================================================================
          DIRECT BUY MODAL (PORTALIZED FOR PERFECT WINDOW CENTERING)
          =================================================================== */}
      {buyingProduct &&
        createPortal(
          <div
            className="bd-modal-backdrop"
            onClick={() => !confirmedOrder && setBuyingProduct(null)}
          >
            <div
              className="bd-modal-box p-4"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '580px' }}
            >
              {confirmedOrder ? (
                <div>
                  <div className="d-flex align-items-center gap-3 p-3 bg-success-subtle border border-success-subtle rounded-3 text-success mb-3">
                    <i className="bi bi-check-circle-fill fs-2"></i>
                    <div>
                      <strong className="d-block text-success-emphasis fs-6">
                        Order #{confirmedOrder.id} Placed Successfully!
                      </strong>
                      <span className="small text-secondary">
                        Payment secured in FarmDirect Escrow. Farmer has been notified for consignment dispatch.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-3 small">
                    <div className="d-flex justify-content-between py-1.5 border-bottom">
                      <span className="text-muted">Produce:</span>
                      <strong className="text-dark">{buyingProduct.crop}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1.5 border-bottom">
                      <span className="text-muted">Farmer:</span>
                      <strong className="text-dark">{buyingProduct.farmer}</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1.5 border-bottom">
                      <span className="text-muted">Quantity:</span>
                      <strong className="font-monospace text-success">{buyQty} kg</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1.5 border-bottom">
                      <span className="text-muted">Total Amount:</span>
                      <strong className="font-monospace text-success fs-6">
                        ₹{(buyQty * buyingProduct.price).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between py-1.5">
                      <span className="text-muted">Destination:</span>
                      <span className="text-dark">{deliveryHub}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      onClick={() => setBuyingProduct(null)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm rounded-pill px-4 fw-bold"
                      onClick={() => {
                        setBuyingProduct(null);
                        navigate('/buyer/orders');
                      }}
                    >
                      View in Orders
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-bag-check-fill text-success me-2"></i>
                        Direct Farmgate Purchase
                      </h5>
                      <span className="text-muted small">
                        Buying directly from verified grower
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setBuyingProduct(null)}
                    ></button>
                  </div>

                  {/* Product & Farmer Chip */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border mb-3">
                    <img
                      src={buyingProduct.image}
                      alt={buyingProduct.crop}
                      className="rounded-3 object-fit-cover border flex-shrink-0"
                      style={{ width: '64px', height: '64px' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="fw-bold text-dark mb-0.5">{buyingProduct.crop}</h6>
                      <div className="text-muted small mb-1">
                        <i className="bi bi-person-fill text-success me-1"></i>
                        Farmer: {buyingProduct.farmer} ({buyingProduct.location})
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill font-monospace small">
                        ₹{buyingProduct.price} / kg
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Purchase Quantity (kg)
                    </label>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setBuyQty((prev) =>
                            Math.max(buyingProduct.minOrder || 50, prev - 25)
                          )
                        }
                      >
                        -25
                      </button>
                      <input
                        type="number"
                        className="form-control text-center font-monospace fw-bold"
                        value={buyQty}
                        min={buyingProduct.minOrder || 50}
                        max={buyingProduct.quantity || 10000}
                        step="25"
                        onChange={(e) =>
                          setBuyQty(
                            Math.max(
                              buyingProduct.minOrder || 50,
                              Math.min(
                                buyingProduct.quantity || 10000,
                                Number(e.target.value) || 50
                              )
                            )
                          )
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setBuyQty((prev) =>
                            Math.min(buyingProduct.quantity || 10000, prev + 25)
                          )
                        }
                      >
                        +25
                      </button>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mt-1">
                      <span>Min Order: {buyingProduct.minOrder || 50} kg</span>
                      <span>Available: {buyingProduct.quantity} kg</span>
                    </div>
                  </div>

                  {/* Delivery Hub */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Receiving Hub / Delivery Point
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={deliveryHub}
                      onChange={(e) => setDeliveryHub(e.target.value)}
                    >
                      <option value="Chennai Central Hub">Chennai Central Hub</option>
                      <option value="Coimbatore Wholesale Terminal">Coimbatore Wholesale Terminal</option>
                      <option value="Madurai Consolidation Point">Madurai Consolidation Point</option>
                      <option value="Dindigul Regional Mandi Hub">Dindigul Regional Mandi Hub</option>
                    </select>
                  </div>

                  {/* Price & Savings Summary */}
                  <div className="p-3 bg-light rounded-3 border mb-3 small">
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Unit Farmgate Rate:</span>
                      <strong className="text-dark">₹{buyingProduct.price} / kg</strong>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                      <span className="text-muted">Mandi Retail Benchmark:</span>
                      <span className="text-secondary text-decoration-line-through">
                        ₹{buyingProduct.mandiPrice || Math.round(buyingProduct.price * 1.25)} / kg
                      </span>
                    </div>
                    <div className="d-flex justify-content-between py-1.5 mt-1">
                      <span className="fw-bold text-dark">Subtotal Payable:</span>
                      <span className="fw-black text-success font-monospace fs-5">
                        ₹{(buyQty * buyingProduct.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Badge */}
                  <div className="d-flex align-items-center gap-2 p-2 bg-success-subtle bg-opacity-40 rounded-3 border border-success-subtle text-success small mb-3">
                    <i className="bi bi-shield-lock-fill fs-5"></i>
                    <span style={{ fontSize: '0.78rem' }}>
                      FarmDirect Escrow Protection: Funds held securely until lot inspection upon delivery.
                    </span>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      onClick={() => setBuyingProduct(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success btn-sm rounded-pill px-4 fw-bold shadow-xs d-flex align-items-center gap-1.5"
                      onClick={handleConfirmDirectBuy}
                    >
                      <i className="bi bi-bag-check-fill"></i>
                      <span>Confirm &amp; Place Order</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </BuyerLayout>
  );
}
