import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import CropDetailsModal from '../../components/farmer/CropDetailsModal';
import EditProductModal from '../../components/farmer/EditProductModal';
import AddProductButton from '../../components/farmer/AddProductButton';

export default function FarmerDashboardPage() {
  const { user } = useAuth();
  const {
    products,
    requests,
    stats,
    acceptRequest,
    declineRequest,
    deleteProduct
  } = useFarmer();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter listings & requests if search query is active
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilName && p.tamilName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRequests = requests
    .filter(
      (r) =>
        r.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.businessType && r.businessType.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      if (a.status === 'Accepted' && b.status === 'Declined') return -1;
      if (a.status === 'Declined' && b.status === 'Accepted') return 1;
      return 0;
    });

  return (
    <FarmerLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* ----------------------------------------------------------------------
          1. WELCOME & PRIMARY CTA HEADER
         ---------------------------------------------------------------------- */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold">
              🌱 Verified Direct Farmer Hub
            </span>
            <span className="text-muted small">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {user?.location || 'Erode, Tamil Nadu'}
            </span>
          </div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name || 'Ravi Kumar'} 👋
          </h1>
          <p className="text-muted small mb-0">
            Manage your harvest listings, review live consumer offers, and fulfill direct B2B orders with zero middlemen.
          </p>
        </div>

        {/* Primary Action Button */}
        <AddProductButton className="py-2 px-4 fs-6 shadow-sm" icon="bi-plus-circle-fill" />
      </div>

      {/* ----------------------------------------------------------------------
          2. QUICK STATISTICS (4 IN ONE ROW)
         ---------------------------------------------------------------------- */}
      <div className="row g-3 mb-4">
        {/* Active Products */}
        <div className="col-6 col-lg-3">
          <div className="farm-stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="farm-stat-label">ACTIVE PRODUCTS</span>
              <div className="farm-stat-icon bg-success-subtle text-success">
                <i className="bi bi-box-seam-fill"></i>
              </div>
            </div>
            <div className="farm-stat-number text-success">{stats.activeProducts}</div>
            <div className="farm-stat-trend text-muted small">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>Live on Direct Mandi</span>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-6 col-lg-3">
          <div className="farm-stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="farm-stat-label">PENDING REQUESTS</span>
              <div className="farm-stat-icon bg-warning-subtle text-warning-emphasis">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
            <div className="farm-stat-number text-warning-emphasis">{stats.pendingRequests}</div>
            <div className="farm-stat-trend" style={{ color: '#d97706' }}>
              <i className="bi bi-bell-fill"></i>
              <span>{stats.pendingRequests > 0 ? 'Requires action' : 'All caught up'}</span>
            </div>
          </div>
        </div>

        {/* Accepted Requests */}
        <div className="col-6 col-lg-3">
          <div className="farm-stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="farm-stat-label">ACCEPTED ORDERS</span>
              <div className="farm-stat-icon bg-info-subtle text-info-emphasis">
                <i className="bi bi-patch-check-fill"></i>
              </div>
            </div>
            <div className="farm-stat-number text-primary">{stats.acceptedRequests}</div>
            <div className="farm-stat-trend text-success small">
              <i className="bi bi-truck"></i>
              <span>In logistics / dispatch</span>
            </div>
          </div>
        </div>

        {/* Products Sold */}
        <div className="col-6 col-lg-3">
          <div className="farm-stat-card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="farm-stat-label">PRODUCTS SOLD</span>
              <div className="farm-stat-icon bg-success-subtle text-success">
                <i className="bi bi-cart-check-fill"></i>
              </div>
            </div>
            <div className="farm-stat-number text-dark">{stats.productsSold}</div>
            <div className="farm-stat-trend text-success small">
              <i className="bi bi-arrow-up-right-circle-fill"></i>
              <span>100% Direct to Buyer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          3. CONSUMER REQUESTS (STREAMLINED & NEAT UI)
         ---------------------------------------------------------------------- */}
      <div className="farm-card mb-4">
        <div className="farm-card-header">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <i className="bi bi-inbox-fill fs-5"></i>
            </div>
            <div>
              <h2 className="farm-card-title">Consumer Requests</h2>
              <span className="text-muted small">
                Direct purchasing proposals from verified retail buyers &amp; supermarkets
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark fw-bold rounded-pill px-3 py-2">
              {stats.pendingRequests} Pending
            </span>
            <Link
              to="/farmer/requests"
              className="btn btn-sm btn-outline-success fw-bold rounded-pill px-3"
            >
              View All Requests →
            </Link>
          </div>
        </div>

        {/* Streamlined Requests Cards List */}
        <div className="d-flex flex-column gap-3">
          {filteredRequests.slice(0, 3).map((req) => (
            <div key={req.id} className="farm-request-card">
              <div
                className={`farm-request-status-bar ${
                  req.status === 'Accepted'
                    ? 'farm-status-accepted'
                    : req.status === 'Declined'
                    ? 'farm-status-declined'
                    : 'farm-status-pending'
                }`}
              ></div>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                {/* Left: Essential Information Only */}
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      req.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                    }
                    alt={req.consumerName}
                    className="rounded-circle border"
                    style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h5 className="fw-bold text-dark mb-0">{req.consumerName}</h5>
                      <span className="badge bg-light text-muted border rounded-pill small">
                        {req.businessType}
                      </span>
                    </div>

                    <div className="small text-muted mt-1">
                      <span>Crop: </span>
                      <strong className="text-dark">{req.productName}</strong> • Quantity:{' '}
                      <strong className="text-success font-monospace">{req.quantity}</strong> • Offer:{' '}
                      <span className="fw-bold text-dark font-monospace">{req.offerPrice}</span>
                      {req.totalValue && (
                        <span className="text-muted ms-1">
                          (Total: <strong className="text-success">{req.totalValue}</strong>)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {req.status === 'Pending' ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger px-3 py-1 fw-semibold rounded-3"
                        onClick={() => declineRequest(req.id)}
                      >
                        <i className="bi bi-x-lg me-1"></i> Decline
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-success px-4 py-1 fw-bold rounded-3 shadow-xs"
                        onClick={() => acceptRequest(req.id)}
                      >
                        <i className="bi bi-check-lg me-1"></i> Accept
                      </button>
                    </>
                  ) : req.status === 'Accepted' ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                      ✓ Accepted
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">
                      ✕ Declined
                    </span>
                  )}

                  {/* Navigates to dedicated page instead of modal */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3 py-1 rounded-3 fw-semibold"
                    onClick={() => navigate(`/farmer/requests/${req.id}`)}
                  >
                    <i className="bi bi-arrow-right-circle me-1"></i> Full Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="p-4 text-center text-muted bg-light rounded-3">
              <i className="bi bi-inbox fs-2 text-muted mb-2 d-block"></i>
              No consumer requests matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          4. MY RECENT PRODUCTS & QUICK ACTIONS ROW
         ---------------------------------------------------------------------- */}
      <div className="row g-4 mb-4">
        {/* Left: Recent Products (8 Cols) */}
        <div className="col-lg-8">
          <div className="farm-card">
            <div className="farm-card-header">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-box-seam-fill fs-5"></i>
                </div>
                <div>
                  <h2 className="farm-card-title">My Harvest Produce</h2>
                  <span className="text-muted small">
                    {products.length} products active in your inventory
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <AddProductButton className="farm-btn-sm py-1 px-3 shadow-none" label="Add Product" />
                <Link to="/farmer/products" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                  View All →
                </Link>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="row g-3">
              {filteredProducts.slice(0, 4).map((item) => (
                <div key={item.id} className="col-12 col-sm-6">
                  <div className="farm-product-card h-100">
                    <div className="farm-product-img-wrap">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0]
                            : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                        }
                        alt={item.name}
                        className="farm-product-img"
                      />
                      <span className="farm-product-badge bg-success text-white">
                        {item.category}
                      </span>
                      <span className="farm-product-price-tag">
                        ₹{item.price} / {item.unit}
                      </span>
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1 text-truncate">{item.name}</h6>
                      <div className="small text-muted mb-2">
                        {item.tamilName ? `${item.tamilName} • ` : ''}
                        Available: <strong className="text-success font-monospace">{item.quantity} {item.unit}</strong>
                      </div>

                      <div className="small text-muted mb-3 d-flex align-items-center gap-2">
                        <span>
                          <i className="bi bi-geo-alt me-1 text-danger"></i>
                          {item.district}
                        </span>
                        <span>•</span>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-decoration-none text-success fw-bold p-0"
                          onClick={() => setSelectedProduct(item)}
                        >
                          View Details
                        </button>

                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            title="Edit Listing"
                            onClick={() => setEditingProduct(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Listing"
                            onClick={() => {
                              if (window.confirm(`Remove ${item.name} from catalog?`)) {
                                deleteProduct(item.id, item.name);
                              }
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions (4 Cols) */}
        <div className="col-lg-4">
          <div className="farm-card">
            <h4 className="fw-bold text-dark fs-6 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-warning"></i>
              <span>Quick Actions</span>
            </h4>
            <div className="d-grid gap-2 mb-3">
              <Link
                to="/farmer/add-product"
                className="btn btn-light border text-start d-flex align-items-center gap-2 py-3 fw-semibold rounded-3 hover-shadow"
              >
                <span className="bg-success text-white p-2 rounded-3 d-flex">
                  <i className="bi bi-plus-lg fs-6"></i>
                </span>
                <div>
                  <div className="text-dark fw-bold">Add New Product</div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    Publish new harvest to buyer mandi
                  </div>
                </div>
              </Link>

              <Link
                to="/farmer/requests"
                className="btn btn-light border text-start d-flex align-items-center gap-2 py-3 fw-semibold rounded-3 hover-shadow"
              >
                <span className="bg-warning text-dark p-2 rounded-3 d-flex">
                  <i className="bi bi-inbox fs-6"></i>
                </span>
                <div>
                  <div className="text-dark fw-bold">Consumer Requests</div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    Review {stats.pendingRequests} pending buyer proposals
                  </div>
                </div>
              </Link>

              <Link
                to="/farmer/demand-forecast"
                className="btn btn-light border text-start d-flex align-items-center gap-2 py-3 fw-semibold rounded-3 hover-shadow"
              >
                <span className="bg-info text-dark p-2 rounded-3 d-flex">
                  <i className="bi bi-graph-up fs-6"></i>
                </span>
                <div>
                  <div className="text-dark fw-bold">Demand Forecast</div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    Regional mandi benchmarks &amp; analytics
                  </div>
                </div>
              </Link>

              <Link
                to="/farmer/profile"
                className="btn btn-light border text-start d-flex align-items-center gap-2 py-3 fw-semibold rounded-3 hover-shadow"
              >
                <span className="bg-primary text-white p-2 rounded-3 d-flex">
                  <i className="bi bi-person-badge fs-6"></i>
                </span>
                <div>
                  <div className="text-dark fw-bold">Farmer Profile &amp; KYC</div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    Edit farm info and photo
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          5. MODALS FOR CROPS ONLY
         ---------------------------------------------------------------------- */}
      {selectedProduct && (
        <CropDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={(prod) => setEditingProduct(prod)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </FarmerLayout>
  );
}
