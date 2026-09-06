/**
 * Buyer Dashboard Page
 * Route: /buyer/dashboard
 *
 * Transformed into a Request Details / Request Tracking Dashboard:
 * Allows institutional buyers and consumers to clearly track all requests
 * sent to farmers and see whether each farmer has accepted, rejected, or is
 * still processing their request.
 *
 * Features:
 * - Title: Request Details
 * - 4 Summary Cards: Total Requests, Pending, Accepted, Rejected
 * - Search by Farmer Name, Product Name, or Request ID
 * - Filter by Status: All, Pending, Accepted, Rejected
 * - Responsive Card View & Detailed Table View (auto-optimized for mobile & desktop)
 * - Exact Status Badges & Texts:
 *   - Pending: "Waiting for Farmer Response" (Orange/Yellow)
 *   - Accepted: "Request Accepted" - "Farmer has accepted your request." (Green)
 *   - Rejected: "Request Rejected" - "Farmer has rejected your request. Reason: ..." (Red)
 * - Request Details Modal with 3-Step Timeline:
 *   Request Sent → Farmer Received → Farmer Response
 * - Empty State with "Browse Products" action
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BuyerLayout from '../components/buyer/BuyerLayout';
import BuyerRequestDetailsModal from '../components/buyer/BuyerRequestDetailsModal';
import AcceptedRequestsCarousel from '../components/buyer/AcceptedRequestsCarousel';
import { INITIAL_BUYER_REQUESTS } from '../data/buyerRequestsData';
import requestService from '../services/requestService';

const STORAGE_KEY = 'naam_uzhavar_buyer_request_details_v1';

export default function BuyerDashboard() {
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

  // Load live requests from backend MongoDB on mount
  useEffect(() => {
    let isMounted = true;
    async function loadRequests() {
      try {
        const liveRequests = await requestService.getBuyerRequests();
        if (isMounted && Array.isArray(liveRequests) && liveRequests.length > 0) {
          const mapped = liveRequests.map((r) => ({
            id: r.id || r._id,
            productId: r.productId,
            productName: r.cropName || r.crop,
            crop: r.cropName || r.crop,
            tamilName: r.tamilName,
            farmerName: r.farmerName,
            farmerPhone: r.farmerPhone,
            quantity: `${r.quantity} ${r.unit || 'kg'}`,
            quantityNum: r.quantity,
            unit: r.unit || 'kg',
            offeredPrice: `₹${r.offeredPrice || r.price}`,
            offeredPriceNum: r.offeredPrice || r.price,
            totalAmount: r.totalAmount,
            deliveryLocation: r.deliveryLocation,
            status: r.status === 'ACCEPTED' ? 'Accepted' : r.status === 'CONFIRMED' ? 'Confirmed' : r.status === 'DECLINED' ? 'Rejected' : 'Pending',
            productImage: r.productImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
            requestDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'Today',
            farmerResponse: r.farmerResponse || (r.status === 'ACCEPTED' ? 'Lot verified. Grade A harvest ready for dispatch.' : null),
            timeline: {
              sentAt: 'Today, Morning',
              receivedAt: 'Today, 10:15 AM',
              responseAt: r.status !== 'PENDING' ? 'Today, 11:30 AM' : null
            }
          }));
          setRequests(mapped);
        }
      } catch (err) {
        console.warn('Error loading live buyer requests:', err);
      }
    }
    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Accepted' | 'Rejected'
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
        ? `Request #${requestId} marked as ACCEPTED by farmer.`
        : newStatus === 'Rejected'
        ? `Request #${requestId} marked as REJECTED by farmer.`
        : `Request #${requestId} marked as PENDING (Waiting for farmer response).`,
      newStatus === 'Accepted' ? 'success' : newStatus === 'Rejected' ? 'danger' : 'warning'
    );
  };

  // Dynamic Summary Cards calculated from request data
  const summaryCounts = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const accepted = requests.filter((r) => r.status === 'Accepted').length;
    const rejected = requests.filter((r) => r.status === 'Rejected' || r.status === 'Declined').length;
    return { total, pending, accepted, rejected };
  }, [requests]);

  // Filter & Search logic
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

  // Accepted requests for smooth carousel showcase
  const acceptedRequests = useMemo(() => {
    return requests.filter((r) => r.status === 'Accepted');
  }, [requests]);

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade pb-5">
        {/* ===================================================================
            1. PAGE HEADER
            =================================================================== */}
        <div className="bd-page-header mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 small fw-bold">
                <i className="bi bi-clock-history me-1"></i> Request Tracking Hub
              </span>
              <span className="text-muted small">• {user?.name || 'FreshMart Procurement'}</span>
            </div>
            <h1 className="bd-page-title fs-2 mb-1 fw-black text-dark" style={{ letterSpacing: '-0.3px' }}>
              Request Details
            </h1>
            <p className="bd-page-subtitle text-muted small mb-0">
              Track all procurement requests sent to verified farmers and verify whether each farmer has accepted, rejected, or is awaiting response.
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
            2. SMOOTH CAROUSEL: ACCEPTED REQUEST TRACKER
            =================================================================== */}
        <AcceptedRequestsCarousel
          acceptedRequests={acceptedRequests}
          onSelectRequest={setSelectedRequest}
          onBrowseProducts={() => navigate('/buyer/browse')}
        />

        {/* ===================================================================
            3. SUMMARY CARDS (Calculated from request data)
            =================================================================== */}
        <div className="row g-2 g-sm-3 mb-4">
          {/* Card 1: Total Requests */}
          <div className="col-6 col-lg-3">
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
                All procurement submissions
              </span>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="col-6 col-lg-3">
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
                  className="rounded-circle d-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  <i className="bi bi-hourglass-split fs-6"></i>
                </div>
              </div>
              <div className="fs-2 fw-black text-warning-emphasis font-monospace mb-0.5">
                {summaryCounts.pending}
              </div>
              <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.74rem' }}>
                Waiting for farmer response
              </span>
            </div>
          </div>

          {/* Card 3: Accepted */}
          <div className="col-6 col-lg-3">
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

          {/* Card 4: Rejected */}
          <div className="col-6 col-lg-3">
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
            3. SEARCH AND FILTER TOOLBAR
            =================================================================== */}
        <div className="bg-white p-3 rounded-4 border shadow-xs mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Search Input: by farmer name, product name, or request ID */}
            <div className="col-12 col-md-5">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by farmer name, product name, or request ID..."
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

            {/* Filter Tabs: All, Pending, Accepted, Rejected */}
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

              {/* View Switcher: Card View & Table View */}
              <div className="btn-group btn-group-sm ms-sm-2" role="group" aria-label="Layout view switcher">
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
            4. REQUESTS LIST (CARDS OR TABLE)
            =================================================================== */}
        {filteredRequests.length === 0 ? (
          /* ===================================================================
             EMPTY STATE
             =================================================================== */
          <div className="p-5 text-center bg-white rounded-4 border shadow-xs my-4">
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3 text-muted"
              style={{ width: '72px', height: '72px' }}
            >
              <i className="bi bi-inbox-fill fs-1 text-muted opacity-75"></i>
            </div>

            <h3 className="fs-4 fw-bold text-dark mb-1">No Requests Found</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
              You haven't sent any requests to farmers yet.
              {(searchQuery || statusFilter !== 'All') && (
                <span className="d-block mt-1 text-secondary" style={{ fontSize: '0.8rem' }}>
                  (No requests match your current search or status filter)
                </span>
              )}
            </p>

            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
              {(searchQuery || statusFilter !== 'All') && (
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 fw-semibold btn-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                  }}
                >
                  Clear Filters
                </button>
              )}

              <button
                type="button"
                className="btn btn-success rounded-pill px-4 fw-bold btn-sm shadow-xs"
                onClick={() => navigate('/buyer/browse')}
              >
                <i className="bi bi-flower2 me-1"></i> Browse Products
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* ===================================================================
             CARD VIEW (Responsive Cards)
             =================================================================== */
          <div className="row g-3">
            {filteredRequests.map((req) => {
              const isPending = req.status === 'Pending';
              const isAccepted = req.status === 'Accepted';
              const isRejected = req.status === 'Rejected' || req.status === 'Declined';

              return (
                <div key={req.id} className="col-12 col-md-6 col-xl-4">
                  <div
                    className="p-3.5 bg-white rounded-4 border shadow-xs h-100 d-flex flex-column transition hover-shadow cursor-pointer"
                    style={{
                      cursor: 'pointer',
                      borderLeft: `4px solid ${
                        isAccepted ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b'
                      }`,
                    }}
                    onClick={() => setSelectedRequest(req)}
                  >
                    {/* Header: Request ID + Status Badge */}
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2.5">
                      <span className="badge bg-light text-dark border font-monospace px-2.5 py-1">
                        #{req.id}
                      </span>

                      {/* Status Badges with exact wording */}
                      {isPending && (
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1">
                          <i className="bi bi-hourglass-split"></i>
                          <span>Waiting for Farmer Response</span>
                        </span>
                      )}
                      {isAccepted && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Request Accepted</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1">
                          <i className="bi bi-x-circle-fill"></i>
                          <span>Request Rejected</span>
                        </span>
                      )}
                    </div>

                    {/* Product & Quantity Box */}
                    <div className="d-flex align-items-center gap-3 p-2.5 bg-light rounded-3 mb-3">
                      <img
                        src={req.productImage}
                        alt={req.productName}
                        className="rounded-3 object-fit-cover shadow-xs border flex-shrink-0"
                        style={{ width: '64px', height: '64px' }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <strong className="fs-6 text-dark d-block text-truncate mb-0.5">
                          Product: {req.productName}
                        </strong>
                        {req.productTamilName && (
                          <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.74rem' }}>
                            {req.productTamilName}
                          </span>
                        )}
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className="badge bg-white text-dark border font-monospace small">
                            Quantity: {req.quantity} {req.unit || 'kg'}
                          </span>
                          <span className="text-success fw-bold font-monospace small">
                            ₹{req.price}/{req.unit || 'kg'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Attributes Specified by User Prompt:
                        Farmer: Ramesh Kumar
                        Product: Tomato
                        Quantity: 50 kg
                        Price: ₹32/kg
                        Request Date: 03 Sep 2026
                        Location: Dindigul */}
                    <div className="mb-3 d-flex flex-column gap-1.5 small" style={{ fontSize: '0.84rem' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">Farmer:</span>
                        <strong className="text-dark">
                          <i className="bi bi-person-fill text-success me-1"></i>
                          {req.farmerName}
                        </strong>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">Price:</span>
                        <span className="text-dark font-monospace fw-semibold">
                          ₹{req.price}/{req.unit || 'kg'} (Total: ₹{(req.quantity * req.price).toLocaleString('en-IN')})
                        </span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">Request Date:</span>
                        <span className="text-dark font-monospace" style={{ fontSize: '0.8rem' }}>
                          <i className="bi bi-calendar3 text-muted me-1 small"></i>
                          {req.requestDate}
                        </span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">Location:</span>
                        <span className="text-dark text-truncate ms-2" style={{ maxWidth: '180px' }}>
                          <i className="bi bi-geo-alt-fill text-danger me-1 small"></i>
                          {req.deliveryLocation}
                        </span>
                      </div>
                    </div>

                    {/* Status Feedback Strip as Specified:
                        For accepted: Farmer has accepted your request.
                        For rejected: Farmer has rejected your request. Reason: ...
                        For pending: Waiting for Farmer Response */}
                    {isAccepted && (
                      <div className="p-2.5 bg-success-subtle border border-success-subtle rounded-3 text-success small mb-3">
                        <div className="fw-bold d-flex align-items-center gap-1.5">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Farmer has accepted your request.</span>
                        </div>
                        {req.acceptedDate && (
                          <div className="text-muted small mt-1 font-monospace" style={{ fontSize: '0.72rem' }}>
                            Confirmed on: {req.acceptedDate}
                          </div>
                        )}
                      </div>
                    )}

                    {isRejected && (
                      <div className="p-2.5 bg-danger-subtle border border-danger-subtle rounded-3 text-danger small mb-3">
                        <div className="fw-bold d-flex align-items-center gap-1.5">
                          <i className="bi bi-x-circle-fill"></i>
                          <span>Farmer has rejected your request.</span>
                        </div>
                        <div className="text-danger-emphasis small mt-0.5" style={{ fontSize: '0.78rem' }}>
                          Reason: {req.rejectionReason || 'Quantity unavailable'}
                        </div>
                      </div>
                    )}

                    {isPending && (
                      <div className="p-2.5 bg-warning-subtle border border-warning-subtle rounded-3 text-warning-emphasis small mb-3">
                        <div className="fw-bold d-flex align-items-center gap-1.5">
                          <i className="bi bi-hourglass-split"></i>
                          <span>Waiting for Farmer Response</span>
                        </div>
                        <div className="text-muted small mt-0.5" style={{ fontSize: '0.78rem' }}>
                          Farmer received request and is checking lot inventory.
                        </div>
                      </div>
                    )}

                    {/* Card Footer Button */}
                    <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
                      <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                        Est. ₹{(req.quantity * req.price).toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill fw-semibold py-1 px-3 d-flex align-items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                      >
                        <span>View Details</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ===================================================================
             TABLE VIEW (Desktop Tabular Data Grid)
             =================================================================== */
          <div className="bg-white rounded-4 border shadow-xs overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                <thead className="table-light text-muted small text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  <tr>
                    <th className="ps-3 py-3">Request ID</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Farmer</th>
                    <th className="py-3">Quantity & Price</th>
                    <th className="py-3">Date & Location</th>
                    <th className="py-3">Current Status</th>
                    <th className="text-end pe-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'Pending';
                    const isAccepted = req.status === 'Accepted';
                    const isRejected = req.status === 'Rejected' || req.status === 'Declined';

                    return (
                      <tr
                        key={req.id}
                        className="cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedRequest(req)}
                      >
                        {/* Request ID */}
                        <td className="ps-3 fw-bold font-monospace text-dark">
                          #{req.id}
                        </td>

                        {/* Product Name & Image */}
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <img
                              src={req.productImage}
                              alt={req.productName}
                              className="rounded-2 object-fit-cover shadow-xs border flex-shrink-0"
                              style={{ width: '42px', height: '42px' }}
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

                        {/* Farmer Name */}
                        <td>
                          <strong className="text-dark d-block">
                            <i className="bi bi-person-fill text-success me-1"></i>
                            {req.farmerName}
                          </strong>
                          <span className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>
                            {req.farmerPhone || '+91 98421 88920'}
                          </span>
                        </td>

                        {/* Quantity & Price */}
                        <td>
                          <div className="fw-bold font-monospace text-dark">
                            {req.quantity} {req.unit || 'kg'}
                          </div>
                          <span className="text-success font-monospace small">
                            ₹{req.price}/kg • ₹{(req.quantity * req.price).toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Request Date & Delivery Location */}
                        <td>
                          <div className="text-dark text-truncate" style={{ maxWidth: '160px' }}>
                            <i className="bi bi-geo-alt-fill text-danger me-1 small"></i>
                            {req.deliveryLocation}
                          </div>
                          <span className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>
                            {req.requestDate}
                          </span>
                        </td>

                        {/* Current Status */}
                        <td>
                          {isPending && (
                            <div>
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1">
                                <i className="bi bi-hourglass-split"></i>
                                <span>Waiting for Farmer Response</span>
                              </span>
                            </div>
                          )}

                          {isAccepted && (
                            <div>
                              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1 mb-0.5">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Request Accepted</span>
                              </span>
                              <div className="text-success small" style={{ fontSize: '0.7rem' }}>
                                Farmer has accepted your request.
                              </div>
                            </div>
                          )}

                          {isRejected && (
                            <div>
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-1 fw-bold small d-inline-flex align-items-center gap-1 mb-0.5">
                                <i className="bi bi-x-circle-fill"></i>
                                <span>Request Rejected</span>
                              </span>
                              <div className="text-danger small text-truncate" style={{ fontSize: '0.7rem', maxWidth: '180px' }} title={req.rejectionReason}>
                                Reason: {req.rejectionReason || 'Quantity unavailable'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Action */}
                        <td className="text-end pe-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRequest(req);
                            }}
                          >
                            Details
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
      </div>

      {/* ===================================================================
          5. VIEW REQUEST DETAILS MODAL (With 3-Step Timeline)
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
