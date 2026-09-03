import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PRODUCTS } from '../data/buyerData';

const CROP_FALLBACKS = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
  brinjal: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&auto=format&fit=crop&q=80'
};

const DEFAULT_CROP_IMG = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80';

export default function OrderTable({ orders = [] }) {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const handleGoToProductDetails = (order) => {
    setSelectedOrder(null);
    const cropName = order?.crop || 'Tomato';
    const matched = INITIAL_PRODUCTS.find(
      (p) => p.crop?.toLowerCase() === cropName.toLowerCase()
    );
    const productId = matched ? matched.id : cropName;
    navigate(`/buyer/products/${productId}`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' ||
        order.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        order.id?.toLowerCase().includes(q) ||
        order.crop?.toLowerCase().includes(q) ||
        order.location?.toLowerCase().includes(q) ||
        order.farmerBreakdown?.some((f) => f.farmer?.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('confirmed')) {
      return (
        <span
          className="badge rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1.5 small"
          style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
        >
          <span className="bd-pulse-dot-success"></span>
          <span>Confirmed</span>
        </span>
      );
    }
    if (s.includes('transit')) {
      return (
        <span
          className="badge rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1.5 small"
          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' }}
        >
          <i className="bi bi-truck" style={{ animation: 'bdTruckDrive 1.8s infinite ease-in-out', color: '#0284c7' }}></i>
          <span>In Transit</span>
        </span>
      );
    }
    if (s.includes('delivered')) {
      return (
        <span
          className="badge rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1.5 small"
          style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe' }}
        >
          <i className="bi bi-patch-check-fill" style={{ color: '#7c3aed' }}></i>
          <span>Delivered</span>
        </span>
      );
    }
    return (
      <span
        className="badge rounded-pill px-2.5 py-1 fw-semibold small"
        style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bd-card border-0 shadow-sm rounded-4 overflow-hidden">
      {/* Header Toolbar */}
      <div className="bd-card-header p-3.5 bg-white border-bottom d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2.5">
          <div
            className="rounded-3 bg-success-subtle text-success p-2 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-receipt-cutoff fs-5"></i>
          </div>
          <div>
            <h4 className="bd-card-title mb-0 fs-6 fw-bold text-dark">
              Procurement Orders Registry
            </h4>
            <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
              Real-time consignment dispatch &amp; multi-farmer lot allocations
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Search Input */}
          <div className="input-group input-group-sm" style={{ width: '240px' }}>
            <span className="input-group-text bg-light border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search crop, ID, farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Badges */}
          <div className="btn-group btn-group-sm" role="group">
            {['All', 'Confirmed', 'In Transit', 'Delivered'].map((st) => (
              <button
                key={st}
                type="button"
                className={`btn ${
                  statusFilter === st
                    ? 'btn-success fw-bold text-white shadow-xs'
                    : 'btn-outline-secondary'
                }`}
                style={{ fontSize: '0.78rem' }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="btn-group btn-group-sm ms-auto ms-sm-0" role="group">
            <button
              type="button"
              className={`btn ${viewMode === 'table' ? 'btn-dark text-white' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <i className="bi bi-table"></i>
            </button>
            <button
              type="button"
              className={`btn ${viewMode === 'grid' ? 'btn-dark text-white' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
            >
              <i className="bi bi-grid-fill"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 text-muted bg-light bg-opacity-40 m-3 rounded-4 border">
          <i className="bi bi-inbox fs-1 text-secondary mb-2 d-block opacity-75"></i>
          <h5 className="fw-semibold text-dark">No Procurement Orders Found</h5>
          <p className="small text-muted mb-3" style={{ maxWidth: '380px', margin: '0 auto' }}>
            {searchQuery || statusFilter !== 'All'
              ? 'No purchase orders matched your current search or status filters.'
              : 'You have not confirmed any farmgate purchase orders yet.'}
          </p>
          {(searchQuery || statusFilter !== 'All') && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ================================================================
           VIBRANT GRID CARD VIEW (NO FARMER PAGE BUTTON AS REQUESTED)
           ================================================================ */
        <div className="p-3">
          <div className="row g-3">
            {filteredOrders.map((order) => {
              const cropKey = order.crop?.toLowerCase();
              const cropImg = CROP_FALLBACKS[cropKey] || DEFAULT_CROP_IMG;

              return (
                <div key={order.id} className="col-12 col-md-6 col-xl-4">
                  <div className="bd-order-grid-card h-100">
                    <div className="bd-order-header-strip">
                      <span className="badge bg-dark font-monospace text-white px-2 py-1">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      {/* Crop Banner */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={cropImg}
                          alt={order.crop}
                          className="rounded-3 object-fit-cover shadow-xs border flex-shrink-0"
                          style={{ width: '56px', height: '56px' }}
                        />
                        <div className="overflow-hidden" style={{ minWidth: 0 }}>
                          <h6 className="fw-bold text-dark mb-0.5 text-truncate">{order.crop}</h6>
                          <div className="text-muted small text-truncate">
                            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                            {order.location}
                          </div>
                        </div>
                        <div className="ms-auto text-end flex-shrink-0">
                          <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Amount</span>
                          <strong className="text-success font-monospace fs-6">
                            ₹{order.amount?.toLocaleString('en-IN')}
                          </strong>
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="row g-2 mb-3 small">
                        <div className="col-6">
                          <div className="p-2 rounded bg-light border">
                            <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Total Qty</span>
                            <strong className="text-dark font-monospace">{order.quantity} kg</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 rounded bg-light border">
                            <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Farmers</span>
                            <strong className="text-dark">
                              {order.farmers} {order.farmers === 1 ? 'Farmer' : 'Farmers'}
                            </strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 rounded bg-light border">
                            <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Order Date</span>
                            <span className="text-dark font-monospace">{order.orderDate}</span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 rounded bg-light border">
                            <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Target Arrival</span>
                            <span className="text-dark font-monospace">{order.deliveryDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Farmer Lot Info */}
                      {order.farmerBreakdown && order.farmerBreakdown.length > 0 && (
                        <div
                          className="p-2 rounded mb-3 small d-flex align-items-center justify-content-between"
                          style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                        >
                          <span className="text-success fw-bold text-truncate" style={{ fontSize: '0.76rem', minWidth: 0 }}>
                            <i className="bi bi-person-check-fill me-1"></i>
                            Primary: {order.farmerBreakdown[0].farmer}
                          </span>
                          <span
                            className="badge font-monospace ms-1 flex-shrink-0"
                            style={{ backgroundColor: '#ffffff', color: '#15803d', border: '1px solid #86efac' }}
                          >
                            ₹{order.farmerBreakdown[0].price}/kg
                          </span>
                        </div>
                      )}

                      {/* Clean Single Action Button: See Details */}
                      <div className="mt-auto pt-2.5 border-top">
                        <button
                          type="button"
                          className="btn btn-sm btn-success w-100 rounded-3 fw-bold py-2 d-flex align-items-center justify-content-center gap-1.5 shadow-xs"
                          onClick={() => setSelectedOrder(order)}
                          title="Open colorful details popup modal"
                        >
                          <i className="bi bi-eye"></i>
                          <span>See Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================================================================
           VIBRANT TABLE VIEW (NO FARMER PAGE BUTTON AS REQUESTED)
           ================================================================ */
        <div className="bd-table-wrap">
          <div className="table-responsive">
            <table className="bd-table align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Crop &amp; Produce</th>
                  <th>Quantity</th>
                  <th>Farmer Sourcing</th>
                  <th>Order Value</th>
                  <th>Delivery Hub</th>
                  <th>Status</th>
                  <th className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const cropKey = order.crop?.toLowerCase();
                  const cropImg = CROP_FALLBACKS[cropKey] || DEFAULT_CROP_IMG;

                  return (
                    <tr key={order.id} className="transition hover-bg">
                      <td>
                        <span className="badge bg-light text-dark font-monospace border px-2.5 py-1.5 fw-bold">
                          #{order.id}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2.5">
                          <img
                            src={cropImg}
                            alt={order.crop}
                            className="rounded-2 object-fit-cover border flex-shrink-0"
                            style={{ width: '38px', height: '38px' }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div className="fw-bold text-dark text-truncate">{order.crop}</div>
                            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                              Date: {order.orderDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="font-monospace fw-bold text-dark">{order.quantity} kg</td>
                      <td>
                        <span
                          className="badge border"
                          style={{ backgroundColor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}
                        >
                          <i className="bi bi-people-fill me-1 text-success"></i>
                          {order.farmers} {order.farmers === 1 ? 'farmer' : 'farmers'}
                        </span>
                      </td>
                      <td className="font-monospace fw-bold text-success fs-6">
                        ₹{order.amount?.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div className="text-dark small text-truncate" style={{ maxWidth: '160px' }}>
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {order.location}
                        </div>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td className="text-end pe-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success rounded-pill px-3.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-xs"
                          onClick={() => setSelectedOrder(order)}
                          title="See animated details popup"
                        >
                          <i className="bi bi-eye"></i>
                          <span>See Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================
          REDESIGNED "SEE DETAILS" POPUP WINDOW WITH RICH COLORS & ANIMATIONS
          =================================================================== */}
      {selectedOrder &&
        createPortal(
          <div
            className="bd-modal-backdrop"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bd-order-popup-box"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Vibrant Gradient Header */}
              <div className="bd-order-popup-header d-flex align-items-center justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-white bg-opacity-20 text-white font-monospace px-2.5 py-1 border border-white border-opacity-25 fs-6">
                      #{selectedOrder.id}
                    </span>
                    <span className="badge bg-white text-dark fw-bold rounded-pill px-2.5 py-1 small">
                      Verified Purchase Order
                    </span>
                  </div>
                  <h4 className="fw-bold mb-0 text-white">
                    {selectedOrder.crop} Procurement Details
                  </h4>
                  <span className="text-white text-opacity-80 small">
                    Direct Farmgate Sourcing • Target Dispatch: {selectedOrder.deliveryDate}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                  title="Close popup"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                {/* 4-Step Animated Logistics Timeline */}
                <div className="p-3 bg-light rounded-4 border mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.04em' }}>
                      Real-time Consignment Progress
                    </span>
                    <span
                      className="badge rounded-pill px-2 py-0.5 small fw-bold"
                      style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                    >
                      Live GPS Sync
                    </span>
                  </div>

                  <div className="bd-order-step-timeline">
                    {/* Step 1: Order Confirmed */}
                    <div className="bd-timeline-step-item">
                      <div className="bd-timeline-node completed">
                        <i className="bi bi-check-lg"></i>
                      </div>
                      <strong className="text-dark small" style={{ fontSize: '0.78rem' }}>Placed</strong>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{selectedOrder.orderDate}</span>
                    </div>

                    {/* Step 2: Quality Inspection */}
                    <div className="bd-timeline-step-item">
                      <div className="bd-timeline-node completed">
                        <i className="bi bi-patch-check"></i>
                      </div>
                      <strong className="text-dark small" style={{ fontSize: '0.78rem' }}>Grade Tested</strong>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Verified 100%</span>
                    </div>

                    {/* Step 3: In Transit */}
                    <div className="bd-timeline-step-item">
                      <div className={`bd-timeline-node ${selectedOrder.status?.toLowerCase().includes('transit') || selectedOrder.status?.toLowerCase() === 'delivered' ? 'completed' : 'active'}`}>
                        <i className="bi bi-truck"></i>
                      </div>
                      <strong className="text-dark small" style={{ fontSize: '0.78rem' }}>Dispatched</strong>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Cold-Chain Logistics</span>
                    </div>

                    {/* Step 4: Hub Delivery */}
                    <div className="bd-timeline-step-item">
                      <div className={`bd-timeline-node ${selectedOrder.status?.toLowerCase() === 'delivered' ? 'completed' : ''}`}>
                        <i className="bi bi-box-seam"></i>
                      </div>
                      <strong className="text-dark small" style={{ fontSize: '0.78rem' }}>Delivered</strong>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{selectedOrder.deliveryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Key Financial & Consignment Metrics */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                      <span className="small fw-bold d-block mb-1" style={{ color: '#166534' }}>
                        Total Order Amount
                      </span>
                      <div className="fs-4 fw-black font-monospace" style={{ color: '#15803d' }}>
                        ₹{selectedOrder.amount?.toLocaleString('en-IN')}
                      </div>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Farmgate direct rate pricing
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
                    >
                      <span className="small fw-bold d-block mb-1" style={{ color: '#0369a1' }}>
                        Consolidated Quantity
                      </span>
                      <div className="fs-4 fw-black font-monospace" style={{ color: '#0284c7' }}>
                        {selectedOrder.quantity} kg
                      </div>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Aggregated from {selectedOrder.farmers} verified grower{selectedOrder.farmers > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div
                      className="p-3 rounded-4 h-100"
                      style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                    >
                      <span className="small fw-bold d-block mb-1" style={{ color: '#92400e' }}>
                        Delivery Hub
                      </span>
                      <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.95rem' }}>
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {selectedOrder.location}
                      </div>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Scheduled: {selectedOrder.deliveryDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Escrow Guarantee Banner */}
                <div
                  className="p-2.5 px-3 rounded-3 small mb-4 d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}
                >
                  <i className="bi bi-shield-check-fill fs-5 text-success"></i>
                  <span style={{ fontSize: '0.78rem' }}>
                    <strong>FarmDirect Escrow Protection Active:</strong> Payment is safely held in escrow and released to farmers only upon lot quality inspection.
                  </span>
                </div>

                {/* Allocated Farmer Lots Section with Full Product Details & Click-to-View Action */}
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2.5 flex-wrap gap-2">
                    <div>
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-people-fill text-success me-2"></i>
                        Allocated Farmer Lots ({selectedOrder.farmerBreakdown?.length || selectedOrder.farmers} Sources)
                      </h6>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Individual farmgate lot allocations with direct product details &amp; specifications
                      </span>
                    </div>
                    <span
                      className="badge rounded-pill small"
                      style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                    >
                      <i className="bi bi-patch-check-fill me-1"></i> Verified Farmgate Sourcing
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {selectedOrder.farmerBreakdown && selectedOrder.farmerBreakdown.length > 0 ? (
                      selectedOrder.farmerBreakdown.map((fb, idx) => {
                        const cropKey = selectedOrder.crop?.toLowerCase();
                        const cropImg = CROP_FALLBACKS[cropKey] || DEFAULT_CROP_IMG;

                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-4 border bg-white shadow-xs d-flex flex-column gap-3 transition hover-shadow"
                            style={{ borderLeft: '4px solid #10b981' }}
                          >
                            {/* Product Photo, Name, and Grade Showcase (Clickable to Product Details) */}
                            <div
                              className="d-flex align-items-center gap-3 p-2.5 rounded-3 bg-light border cursor-pointer transition hover-bg"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleGoToProductDetails(selectedOrder)}
                              title="Click to view full product details"
                            >
                              <img
                                src={cropImg}
                                alt={selectedOrder.crop}
                                className="rounded-3 object-fit-cover border shadow-2xs flex-shrink-0"
                                style={{ width: '56px', height: '56px' }}
                              />
                              <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                                <div className="d-flex align-items-center justify-content-between gap-1 mb-0.5 flex-wrap">
                                  <strong className="fs-6 text-dark text-truncate mb-0">
                                    Product: {selectedOrder.crop}
                                  </strong>
                                  <span
                                    className="badge rounded-pill small flex-shrink-0"
                                    style={{ fontSize: '0.68rem', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                                  >
                                    Grade A (Export Quality)
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small text-muted flex-wrap">
                                  <span>Direct Farmgate Lot • Certified Fresh</span>
                                  <span className="text-success fw-semibold ms-auto" style={{ fontSize: '0.74rem' }}>
                                    View Full Product Specs <i className="bi bi-arrow-right"></i>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Farmer Details & Lot Financials Breakdown */}
                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                              <div className="d-flex align-items-center gap-2.5">
                                <div
                                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                  style={{ width: '40px', height: '40px', fontSize: '0.95rem', backgroundColor: '#10b981' }}
                                >
                                  {fb.farmer?.charAt(0) || 'F'}
                                </div>
                                <div>
                                  <div className="fw-bold text-dark fs-6 d-flex align-items-center gap-1.5">
                                    <span>{fb.farmer}</span>
                                    <i className="bi bi-patch-check-fill text-success small" title="Verified Producer"></i>
                                  </div>
                                  <div className="text-muted small d-flex align-items-center gap-2.5 mt-0.5">
                                    <span>
                                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                      {selectedOrder.location || 'Tamil Nadu'}
                                    </span>
                                    <span>•</span>
                                    <span className="fw-bold" style={{ color: '#d97706' }}>
                                      <i className="bi bi-star-fill text-warning me-1"></i> 4.9 Rating
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex align-items-center gap-3 ms-md-auto text-end flex-wrap">
                                <div>
                                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Allocated Lot</span>
                                  <strong className="text-dark font-monospace fs-6">{fb.qty} kg</strong>
                                </div>
                                <div>
                                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Unit Rate</span>
                                  <strong className="font-monospace fs-6" style={{ color: '#15803d' }}>₹{fb.price}/kg</strong>
                                </div>
                                <div>
                                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Lot Subtotal</span>
                                  <strong className="text-dark font-monospace fs-6">
                                    ₹{(fb.qty * fb.price).toLocaleString('en-IN')}
                                  </strong>
                                </div>

                                {/* Direct button to go to Product Details */}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1.5 shadow-xs"
                                  onClick={() => handleGoToProductDetails(selectedOrder)}
                                  title="View full product details on catalog page"
                                >
                                  <i className="bi bi-box-arrow-up-right"></i>
                                  <span>Product Details</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 rounded-3 bg-light border text-muted small">
                        Aggregated across {selectedOrder.farmers} verified regional farm suppliers.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer with Direct Link to Product Details */}
              <div className="p-3 px-4 bg-light border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span className="text-muted small">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Order #{selectedOrder.id} • Secured via FarmDirect Escrow
                </span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-3.5 fw-bold btn-sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-4 py-1.5 fw-bold btn-sm shadow-xs d-flex align-items-center gap-1.5"
                    onClick={() => handleGoToProductDetails(selectedOrder)}
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                    <span>View Product Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
