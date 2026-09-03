/**
 * Buyer Request Status Page
 * Route: /buyer/request-status
 *
 * Dedicated Request Status & Accept Request Tracker Page for Buyer Module.
 * Replaces the previous "Buyer Request" section.
 *
 * Features:
 * - Accept Request Tracker with Smooth Carousel Animation
 * - Farmer Details: Name, Contact No, Address / Mandi Location, FPO
 * - Product Details: Name, Photo, Quantity, Unit, Price, Total Amount, Location, Date
 * - 4 Summary Cards: Total Requests, Accepted, Pending, Rejected
 * - Search by Farmer Name, Product Name, or Request ID
 * - Filter by Status: All, Accepted, Pending, Rejected
 * - Responsive Card View & Tabular View
 * - BuyerRequestDetailsModal with 3-Step Timeline
 * - Sticky Navbar support
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import BuyerRequestDetailsModal from '../../components/buyer/BuyerRequestDetailsModal';
import { INITIAL_BUYER_REQUESTS } from '../../data/buyerRequestsData';

const STORAGE_KEY = 'naam_uzhavar_buyer_request_details_v1';

export default function BuyerRequestStatusPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Requests state (persisted to localStorage)
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BUYER_REQUESTS;
    } catch (e) {
      console.warn('Error loading buyer requests from localStorage:', e);
      return INITIAL_BUYER_REQUESTS;
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Accepted' | 'Pending' | 'Rejected'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal inspection state
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Toast alert
  const [toastAlert, setToastAlert] = useState(null);

  // Persist requests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.warn('Error saving buyer requests to localStorage:', e);
    }
  }, [requests]);

  const showNotification = (msg, type = 'success') => {
    setToastAlert({ id: Date.now(), msg, type });
    setTimeout(() => setToastAlert(null), 3500);
  };

  // Reset demo dataset
  const handleResetDemoData = () => {
    setRequests(INITIAL_BUYER_REQUESTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUYER_REQUESTS));
    showNotification('Demo request data reset to initial values.', 'info');
  };

  // Update request status (e.g. from modal simulation)
  const handleUpdateStatus = (requestId, newStatus, extraFields = {}) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: newStatus,
            ...extraFields,
          };
        }
        return r;
      })
    );

    // Keep active modal in sync
    setSelectedRequest((prev) =>
      prev && prev.id === requestId ? { ...prev, status: newStatus, ...extraFields } : prev
    );

    showNotification(
      newStatus === 'Accepted'
        ? `Request #${requestId} has been marked as ACCEPTED by farmer.`
        : newStatus === 'Rejected'
        ? `Request #${requestId} has been marked as REJECTED by farmer.`
        : `Request #${requestId} marked as PENDING (Waiting for farmer response).`,
      newStatus === 'Accepted' ? 'success' : newStatus === 'Rejected' ? 'danger' : 'warning'
    );
  };

  // Summary counts
  const summaryCounts = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const accepted = requests.filter((r) => r.status === 'Accepted').length;
    const rejected = requests.filter((r) => r.status === 'Rejected' || r.status === 'Declined').length;
    return { total, pending, accepted, rejected };
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Rejected') {
          if (req.status !== 'Rejected' && req.status !== 'Declined') return false;
        } else if (req.status !== statusFilter) {
          return false;
        }
      }

      // Search query (matches farmer name, product name, or request ID)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesFarmer = (req.farmerName || '').toLowerCase().includes(q);
        const matchesProduct = (req.productName || '').toLowerCase().includes(q);
        const matchesTamilProduct = (req.productTamilName || '').toLowerCase().includes(q);
        const matchesId = (req.id || '').toLowerCase().includes(q);
        const matchesLocation = (req.deliveryLocation || '').toLowerCase().includes(q);

        return matchesFarmer || matchesProduct || matchesTamilProduct || matchesId || matchesLocation;
      }

      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade pb-5">
        {/* ===================================================================
            1. PAGE HEADER
            =================================================================== */}
        <div className="bd-page-header mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small fw-bold">
                <i className="bi bi-clock-history me-1"></i> Request Status
              </span>
              <span className="text-muted small">• {user?.name || 'FreshMart Procurement'}</span>
            </div>
            <h1 className="bd-page-title fs-2 mb-1 fw-black text-dark" style={{ letterSpacing: '-0.3px' }}>
              Request Status
            </h1>
            <p className="bd-page-subtitle text-muted small mb-0">
              Track real-time farmer responses, verified contact details, farmgate mandi addresses, and produce fulfillment status.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill fw-semibold shadow-xs d-flex align-items-center gap-1.5"
              onClick={handleResetDemoData}
              title="Reset mock requests to initial values"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span className="d-none d-sm-inline">Reset Demo</span>
            </button>

            <button
              type="button"
              className="btn btn-success btn-sm rounded-pill px-3.5 fw-bold shadow-xs d-flex align-items-center gap-1.5"
              onClick={() => navigate('/buyer/browse')}
            >
              <i className="bi bi-flower2"></i>
              <span>Browse Products</span>
            </button>
          </div>
        </div>

        {/* Toast Alert Banner */}
        {toastAlert && (
          <div
            className={`alert alert-${toastAlert.type} alert-dismissible fade show mb-4 rounded-4 shadow-sm border py-2.5 px-3.5 d-flex align-items-center gap-2`}
            role="alert"
          >
            <i className={`bi ${toastAlert.type === 'success' ? 'bi-check-circle-fill' : toastAlert.type === 'danger' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} fs-5`}></i>
            <span className="small fw-semibold">{toastAlert.msg}</span>
            <button
              type="button"
              className="btn-close ms-auto py-2"
              onClick={() => setToastAlert(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* ===================================================================
            2. SEARCH & FILTER TOOLBAR (TOP OF PAGE)
            =================================================================== */}
        <div className="bg-white p-3 rounded-4 border shadow-xs mb-3">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by farmer name, product, or request ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs & View Toggle */}
            <div className="col-12 col-md-7 d-flex flex-wrap align-items-center justify-content-start justify-content-md-end gap-2">
              <div className="btn-group btn-group-sm overflow-x-auto" role="group" aria-label="Filter requests by status">
                <button
                  type="button"
                  className={`btn fw-semibold ${
                    statusFilter === 'All'
                      ? 'btn-dark text-white'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setStatusFilter('All')}
                >
                  All ({summaryCounts.total})
                </button>

                <button
                  type="button"
                  className={`btn fw-semibold ${
                    statusFilter === 'Accepted'
                      ? 'btn-success text-white'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setStatusFilter('Accepted')}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Accepted ({summaryCounts.accepted})
                </button>

                <button
                  type="button"
                  className={`btn fw-semibold ${
                    statusFilter === 'Pending'
                      ? 'btn-warning text-dark'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setStatusFilter('Pending')}
                >
                  <i className="bi bi-hourglass-split me-1"></i>
                  Pending ({summaryCounts.pending})
                </button>

                <button
                  type="button"
                  className={`btn fw-semibold ${
                    statusFilter === 'Rejected'
                      ? 'btn-danger text-white'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setStatusFilter('Rejected')}
                >
                  <i className="bi bi-x-circle-fill me-1"></i>
                  Rejected ({summaryCounts.rejected})
                </button>
              </div>

              {/* View Switcher */}
              <div className="btn-group btn-group-sm ms-auto ms-sm-2" role="group" aria-label="Layout view switcher">
                <button
                  type="button"
                  className={`btn ${viewMode === 'grid' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Card View"
                >
                  <i className="bi bi-grid-fill"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'table' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <i className="bi bi-table"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. SUMMARY KPI CARDS (DIRECTLY BELOW SEARCH)
            =================================================================== */}
        <div className="row g-2 g-sm-3 mb-4">
          {/* Card 1: Total Requests */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className={`p-3 p-md-3.5 rounded-4 bg-white border h-100 shadow-xs transition cursor-pointer ${
                statusFilter === 'All' ? 'border-primary border-2 shadow-sm' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter('All')}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  Total Requests
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary-subtle text-primary flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-file-earmark-text-fill fs-6"></i>
                </div>
              </div>
              <div className="fs-2 fw-black text-dark font-monospace mb-0.5">
                {summaryCounts.total}
              </div>
              <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.74rem' }}>
                All procurement requests
              </span>
            </div>
          </div>

          {/* Card 2: Accepted Requests */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className={`p-3 p-md-3.5 rounded-4 bg-white border h-100 shadow-xs transition cursor-pointer ${
                statusFilter === 'Accepted' ? 'border-success border-2 shadow-sm' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter('Accepted')}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  Accepted
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-success-subtle text-success flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-check-circle-fill fs-6"></i>
                </div>
              </div>
              <div className="fs-2 fw-black text-success font-monospace mb-0.5">
                {summaryCounts.accepted}
              </div>
              <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.74rem' }}>
                Farmer accepted request
              </span>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className={`p-3 p-md-3.5 rounded-4 bg-white border h-100 shadow-xs transition cursor-pointer ${
                statusFilter === 'Pending' ? 'border-warning border-2 shadow-sm' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter('Pending')}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  Pending
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '36px', height: '36px', backgroundColor: '#fef3c7', color: '#b45309' }}
                >
                  <i className="bi bi-hourglass-split fs-6"></i>
                </div>
              </div>
              <div className="fs-2 fw-black font-monospace mb-0.5" style={{ color: '#b45309' }}>
                {summaryCounts.pending}
              </div>
              <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.74rem' }}>
                Waiting for farmer response
              </span>
            </div>
          </div>

          {/* Card 4: Rejected */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div
              className={`p-3 p-md-3.5 rounded-4 bg-white border h-100 shadow-xs transition cursor-pointer ${
                statusFilter === 'Rejected' ? 'border-danger border-2 shadow-sm' : ''
              }`}
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter('Rejected')}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  Rejected
                </span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-danger-subtle text-danger flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-x-circle-fill fs-6"></i>
                </div>
              </div>
              <div className="fs-2 fw-black text-danger font-monospace mb-0.5">
                {summaryCounts.rejected}
              </div>
              <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.74rem' }}>
                Farmer rejected request
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            5. REQUESTS LIST (CARDS OR TABLE)
            =================================================================== */}
        {filteredRequests.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5 bg-white rounded-4 border shadow-xs p-4">
            <i className="bi bi-inbox fs-1 text-muted opacity-75 mb-2 d-block"></i>
            <h5 className="fw-bold text-dark">No Requests Found</h5>
            <p className="text-muted small mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
              {statusFilter !== 'All'
                ? `You have no ${statusFilter.toLowerCase()} procurement requests matching this filter.`
                : 'You have not submitted any bulk procurement requests yet.'}
            </p>
            {statusFilter !== 'All' && (
              <button
                type="button"
                className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold"
                onClick={() => setStatusFilter('All')}
              >
                Show All Requests
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ================================================================
             VIBRANT PRODUCT CONTAINER CARD VIEW (COLORS, ANIMATIONS, STYLES)
             ================================================================ */
          <div className="row g-3">
            {filteredRequests.map((req) => {
              const isPending = req.status === 'Pending';
              const isAccepted = req.status === 'Accepted';
              const isRejected = req.status === 'Rejected' || req.status === 'Declined';
              const cardStatusClass = isAccepted
                ? 'bd-request-card-accepted'
                : isRejected
                ? 'bd-request-card-rejected'
                : 'bd-request-card-pending';

              const farmerPageUrl = `/buyer/aggregate-details/${req.id}?crop=${encodeURIComponent(
                req.productName
              )}&farmer=${encodeURIComponent(req.farmerName)}&qty=${req.quantity}&price=${
                req.price
              }&location=${encodeURIComponent(req.farmerLocation)}`;

              return (
                <div key={req.id} className="col-12 col-md-6 col-xl-4">
                  <div className={`bd-request-card ${cardStatusClass}`}>
                    {/* 1. Header: Request ID, Date & Live Status Badge */}
                    <div className="bd-req-header">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border font-monospace px-2.5 py-1" style={{ fontSize: '0.78rem' }}>
                          #{req.id}
                        </span>
                        <span className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>
                          {req.requestDate}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isPending && (
                        <span
                          className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5 shadow-2xs"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                        >
                          <span className="bd-pulse-dot-warning"></span>
                          <span>Waiting for Farmer</span>
                        </span>
                      )}
                      {isAccepted && (
                        <span
                          className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5 shadow-2xs"
                          style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                        >
                          <span className="bd-pulse-dot-success"></span>
                          <span>Request Accepted</span>
                        </span>
                      )}
                      {isRejected && (
                        <span
                          className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5 shadow-2xs"
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                        >
                          <span className="bd-pulse-dot-danger"></span>
                          <span>Request Declined</span>
                        </span>
                      )}
                    </div>

                    {/* 2. Card Body */}
                    <div className="bd-req-body">
                      {/* Product Showcase Box */}
                      <div className="bd-req-product-box">
                        <img
                          src={req.productImage}
                          alt={req.productName}
                          className="bd-req-product-img"
                        />
                        <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
                          <div className="d-flex align-items-center justify-content-between gap-1 mb-0.5">
                            <strong className="fs-6 text-dark text-truncate mb-0">
                              {req.productName}
                            </strong>
                            <span
                              className="badge rounded-pill small flex-shrink-0"
                              style={{ fontSize: '0.68rem', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                            >
                              Grade A
                            </span>
                          </div>
                          {req.productTamilName && (
                            <span className="text-muted small d-block text-truncate mb-1.5" style={{ fontSize: '0.74rem' }}>
                              {req.productTamilName}
                            </span>
                          )}
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span
                              className="badge font-monospace small"
                              style={{ backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1' }}
                            >
                              {req.quantity} {req.unit || 'kg'}
                            </span>
                            <span className="fw-bold font-monospace small" style={{ color: '#15803d' }}>
                              ₹{req.price}/{req.unit || 'kg'}
                            </span>
                            <span className="text-dark small ms-auto font-monospace fw-bold" style={{ fontSize: '0.8rem' }}>
                              ₹{(req.quantity * req.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Farmer & Logistics Details Block */}
                      <div className="bd-req-farmer-box">
                        {/* Farmer Profile Row with Call Actions */}
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2 min-w-0">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: '32px', height: '32px', backgroundColor: '#dcfce7', color: '#15803d' }}
                            >
                              <i className="bi bi-person-fill fs-6"></i>
                            </div>
                            <div className="min-w-0">
                              <span className="bd-req-info-label">Farmer Name</span>
                              <strong className="text-dark text-truncate d-block" style={{ fontSize: '0.88rem' }}>
                                {req.farmerName}
                              </strong>
                            </div>
                          </div>

                          {/* Quick Call & WhatsApp Action Buttons */}
                          <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
                            <a
                              href={`tel:${req.farmerPhone || '+919842188920'}`}
                              className="btn btn-sm btn-outline-success rounded-circle p-0 d-flex align-items-center justify-content-center shadow-2xs"
                              style={{ width: '30px', height: '30px' }}
                              title={`Call ${req.farmerName}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="bi bi-telephone-fill" style={{ fontSize: '0.78rem' }}></i>
                            </a>
                            <a
                              href={`https://wa.me/${(req.farmerPhone || '919842188920').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-success rounded-circle p-0 d-flex align-items-center justify-content-center shadow-2xs"
                              style={{ width: '30px', height: '30px' }}
                              title="Chat on WhatsApp"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="bi bi-whatsapp" style={{ fontSize: '0.82rem' }}></i>
                            </a>
                          </div>
                        </div>

                        {/* Contact No Row */}
                        <div className="pt-2 border-top d-flex align-items-center justify-content-between font-monospace" style={{ fontSize: '0.78rem' }}>
                          <span className="text-muted">Contact No:</span>
                          <a
                            href={`tel:${req.farmerPhone || '+919842188920'}`}
                            className="text-success fw-bold text-decoration-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {req.farmerPhone || '+91 98421 88920'}
                          </a>
                        </div>

                        {/* Farmer Address */}
                        <div className="bd-req-info-row">
                          <i className="bi bi-pin-map-fill text-danger flex-shrink-0 mt-0.5"></i>
                          <div className="min-w-0 flex-grow-1">
                            <span className="bd-req-info-label">Farmer Address</span>
                            <span className="text-dark text-truncate d-block" style={{ fontSize: '0.8rem' }} title={req.farmerLocation}>
                              {req.farmerLocation}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Hub */}
                        <div className="bd-req-info-row">
                          <i className="bi bi-truck text-primary flex-shrink-0 mt-0.5"></i>
                          <div className="min-w-0 flex-grow-1">
                            <span className="bd-req-info-label">Delivery Hub</span>
                            <span className="text-dark text-truncate d-block" style={{ fontSize: '0.8rem' }} title={req.deliveryLocation}>
                              {req.deliveryLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Feedback Strip */}
                      {isAccepted && (
                        <div className="bd-req-status-banner accepted">
                          <i className="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
                          <div className="small flex-grow-1">
                            <strong className="d-block" style={{ color: '#065f46' }}>
                              Farmer has accepted your request.
                            </strong>
                            <span className="text-muted d-block mt-0.5" style={{ fontSize: '0.74rem' }}>
                              {req.acceptedDate ? `Accepted on ${req.acceptedDate}` : 'Lot allocated and ready for pickup.'}
                            </span>
                          </div>
                        </div>
                      )}

                      {isRejected && (
                        <div className="bd-req-status-banner rejected">
                          <i className="bi bi-x-circle-fill text-danger fs-5 flex-shrink-0 mt-0.5"></i>
                          <div className="small flex-grow-1">
                            <strong className="d-block" style={{ color: '#991b1b' }}>
                              Farmer has rejected your request.
                            </strong>
                            <span className="d-block mt-0.5" style={{ fontSize: '0.74rem', color: '#b91c1c' }}>
                              Reason: {req.rejectionReason || 'Quantity unavailable'}
                            </span>
                          </div>
                        </div>
                      )}

                      {isPending && (
                        <div className="bd-req-status-banner pending">
                          <i className="bi bi-hourglass-split fs-5 flex-shrink-0" style={{ color: '#d97706' }}></i>
                          <div className="small flex-grow-1">
                            <strong className="d-block" style={{ color: '#92400e' }}>
                              Waiting for Farmer Response
                            </strong>
                            <span className="d-block mt-0.5" style={{ fontSize: '0.74rem', color: '#78350f' }}>
                              Farmer checking field inventory &amp; harvest date.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Compact Simulation Pill Bar */}
                      <div className="d-flex align-items-center justify-content-between p-1.5 px-2.5 bg-light rounded-pill mb-3" style={{ fontSize: '0.72rem' }}>
                        <span className="text-muted fw-semibold">
                          <i className="bi bi-sliders me-1"></i>Status:
                        </span>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className={`btn py-0 px-2 rounded-start-pill ${isAccepted ? 'btn-success text-white fw-bold' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.68rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(req.id, 'Accepted');
                            }}
                          >
                            ✓ Accept
                          </button>
                          <button
                            type="button"
                            className={`btn py-0 px-2 ${isPending ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.68rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(req.id, 'Pending');
                            }}
                          >
                            ⏳ Pending
                          </button>
                          <button
                            type="button"
                            className={`btn py-0 px-2 rounded-end-pill ${isRejected ? 'btn-danger text-white fw-bold' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '0.68rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(req.id, 'Rejected', 'Quantity unavailable');
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>

                      {/* Responsive Action Buttons in Card Footer */}
                      <div className="bd-req-footer-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark flex-fill rounded-pill fw-semibold py-1.5 d-flex align-items-center justify-content-center gap-1 shadow-2xs bd-req-action-btn"
                          onClick={() => setSelectedRequest(req)}
                          title="Open centered details popup modal"
                        >
                          <i className="bi bi-eye"></i>
                          <span>See Details</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-success flex-fill rounded-pill fw-bold py-1.5 d-flex align-items-center justify-content-center gap-1.5 shadow-2xs bd-req-action-btn"
                          onClick={() => navigate(farmerPageUrl)}
                          title="Open dedicated Farmer & Product Details Page"
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                          <span>Farmer Page</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================================================================
             VIBRANT TABLE VIEW
             ================================================================ */
          <div className="bg-white rounded-4 border shadow-xs overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-muted small text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  <tr>
                    <th className="ps-3 py-3">Request ID</th>
                    <th className="py-3">Product Photo &amp; Details</th>
                    <th className="py-3">Farmer &amp; Contact</th>
                    <th className="py-3">Location &amp; Delivery</th>
                    <th className="py-3">Quantity &amp; Value</th>
                    <th className="py-3">Current Status</th>
                    <th className="text-end pe-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'Pending';
                    const isAccepted = req.status === 'Accepted';
                    const isRejected = req.status === 'Rejected' || req.status === 'Declined';

                    const farmerPageUrl = `/buyer/aggregate-details/${req.id}?crop=${encodeURIComponent(
                      req.productName
                    )}&farmer=${encodeURIComponent(req.farmerName)}&qty=${req.quantity}&price=${
                      req.price
                    }&location=${encodeURIComponent(req.farmerLocation)}`;

                    return (
                      <tr key={req.id} className="transition hover-bg">
                        {/* Request ID */}
                        <td className="ps-3 fw-bold font-monospace text-dark">
                          <span className="badge bg-light text-dark border font-monospace px-2 py-1">
                            #{req.id}
                          </span>
                        </td>

                        {/* Product Photo & Details */}
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <img
                              src={req.productImage}
                              alt={req.productName}
                              className="rounded-2 object-fit-cover shadow-xs border flex-shrink-0"
                              style={{ width: '46px', height: '46px' }}
                            />
                            <div>
                              <strong className="text-dark d-block mb-0">{req.productName}</strong>
                              {req.productTamilName && (
                                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                                  {req.productTamilName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Farmer & Contact */}
                        <td>
                          <strong className="text-dark d-block">
                            <i className="bi bi-person-fill text-success me-1"></i>
                            {req.farmerName}
                          </strong>
                          <div className="d-flex align-items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${req.farmerPhone || '+919842188920'}`}
                              className="text-success font-monospace small text-decoration-none"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="bi bi-telephone-fill me-1 small"></i>
                              {req.farmerPhone || '+91 98421 88920'}
                            </a>
                          </div>
                        </td>

                        {/* Farmer Address & Delivery */}
                        <td>
                          <div className="text-dark text-truncate" style={{ maxWidth: '160px' }}>
                            <i className="bi bi-pin-map-fill text-danger me-1 small"></i>
                            {req.farmerLocation}
                          </div>
                          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                            To: {req.deliveryLocation}
                          </span>
                        </td>

                        {/* Quantity & Price */}
                        <td>
                          <div className="fw-bold font-monospace text-dark">
                            {req.quantity} {req.unit || 'kg'}
                          </div>
                          <span className="text-success font-monospace fw-bold small">
                            ₹{(req.quantity * req.price).toLocaleString('en-IN')} (₹{req.price}/kg)
                          </span>
                        </td>

                        {/* Current Status */}
                        <td>
                          {isPending && (
                            <span
                              className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5"
                              style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                            >
                              <span className="bd-pulse-dot-warning"></span>
                              <span>Waiting</span>
                            </span>
                          )}

                          {isAccepted && (
                            <span
                              className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5"
                              style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}
                            >
                              <span className="bd-pulse-dot-success"></span>
                              <span>Accepted</span>
                            </span>
                          )}

                          {isRejected && (
                            <span
                              className="badge rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1.5"
                              style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                            >
                              <span className="bd-pulse-dot-danger"></span>
                              <span>Declined</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="text-end pe-3">
                          <div className="d-inline-flex align-items-center gap-1.5">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 fw-semibold"
                              onClick={() => setSelectedRequest(req)}
                              title="See details popup modal"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 shadow-xs"
                              onClick={() => navigate(farmerPageUrl)}
                              title="Open dedicated Farmer & Product page"
                            >
                              <i className="bi bi-box-arrow-up-right"></i>
                              <span>Farmer Page</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          6. VIEW REQUEST DETAILS MODAL (With 3-Step Timeline)
          =================================================================== */}
      {selectedRequest && (
        <BuyerRequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
          onBrowseProducts={() => navigate('/buyer/browse')}
        />
      )}
    </BuyerLayout>
  );
}
