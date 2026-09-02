import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { CROPS_LIST, LOCATIONS_LIST } from '../../data/buyerData';

const CROP_FALLBACK = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  brinjal: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80'
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';

export default function BuyerRequestsPage() {
  const navigate = useNavigate();
  const { requests, confirmRequest, declineRequest, createRequest, showToast } = useBuyer();

  // Tab filter: 'all' | 'pending' | 'confirmed' | 'declined'
  const [filterTab, setFilterTab] = useState('all');

  // Confirmation modal state
  const [targetRequest, setTargetRequest] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // New Request modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCrop, setNewCrop] = useState('Tomato');
  const [newQty, setNewQty] = useState(250);
  const [newPrice, setNewPrice] = useState(26);
  const [newLoc, setNewLoc] = useState('Dindigul');
  const [newMsg, setNewMsg] = useState('');

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filterTab === 'pending') return r.status === 'Pending';
      if (filterTab === 'confirmed') return r.status === 'Confirmed';
      if (filterTab === 'declined') return r.status === 'Declined';
      return true;
    });
  }, [requests, filterTab]);

  // Metric counts
  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );
  const confirmedCount = useMemo(
    () => requests.filter((r) => r.status === 'Confirmed').length,
    [requests]
  );
  const totalVolumeKg = useMemo(
    () => requests.filter((r) => r.status === 'Confirmed').reduce((sum, r) => sum + (r.quantity || 0), 0),
    [requests]
  );

  // Handlers
  const handleOpenConfirmModal = (req) => {
    setTargetRequest(req);
    setConfirmationResult(null);
  };

  const handleExecuteConfirmation = () => {
    if (!targetRequest) return;
    const result = confirmRequest(targetRequest.id);
    setConfirmationResult(result);
  };

  const handleDecline = (requestId) => {
    if (window.confirm('Are you sure you want to decline this quote/request?')) {
      declineRequest(requestId);
    }
  };

  const handleCreateNewRequest = (e) => {
    e.preventDefault();
    createRequest({
      crop: newCrop,
      quantity: Number(newQty),
      offeredPrice: Number(newPrice),
      targetPrice: Number(newPrice),
      totalAmount: Number(newQty) * Number(newPrice),
      location: `${newLoc}, Tamil Nadu`,
      farmer: 'Open Pool (Tamil Nadu Clusters)',
      deliveryDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString().split('T')[0],
      message: newMsg || `Open sourcing requirement for ${newQty}kg ${newCrop} at target price ₹${newPrice}/kg.`,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
    });

    setShowCreateModal(false);
    setFilterTab('pending');
  };

  return (
    <BuyerLayout>
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Procurement Requests & Farmer Quotes</h2>
          <p className="text-muted small mb-0">
            Review incoming supplier bids, counter-offers, and confirm consignments directly into purchase orders
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="bd-btn bd-btn-outline bd-btn-sm"
            onClick={() => navigate('/buyer/browse')}
          >
            <i className="bi bi-search"></i>
            <span>Browse Produce</span>
          </button>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Post New Sourcing Request</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border shadow-sm d-flex align-items-center gap-3">
            <div className="bg-warning text-dark p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-hourglass-split fs-4"></i>
            </div>
            <div>
              <span className="text-muted small d-block">Pending Confirmation</span>
              <strong className="fs-4 text-dark font-monospace">{pendingCount}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border shadow-sm d-flex align-items-center gap-3">
            <div className="bg-success text-white p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-check2-circle fs-4"></i>
            </div>
            <div>
              <span className="text-muted small d-block">Confirmed Requests</span>
              <strong className="fs-4 text-success font-monospace">{confirmedCount}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border shadow-sm d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-boxes fs-4"></i>
            </div>
            <div>
              <span className="text-muted small d-block">Confirmed Volume</span>
              <strong className="fs-4 text-dark font-monospace">{totalVolumeKg.toLocaleString()} kg</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="p-3 bg-white rounded-3 border shadow-sm d-flex align-items-center gap-3">
            <div className="bg-info-subtle text-info p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-shield-lock-fill fs-4 text-primary"></i>
            </div>
            <div>
              <span className="text-muted small d-block">Escrow Protocol</span>
              <strong className="fs-6 text-dark">100% Direct Bank Payout</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Navigation Tabs */}
      <div className="d-flex gap-2 border-bottom pb-2 mb-4 overflow-auto">
        <button
          type="button"
          className={`bd-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Requests ({requests.length})
        </button>

        <button
          type="button"
          className={`bd-tab-btn d-flex align-items-center gap-2 ${filterTab === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterTab('pending')}
        >
          <span>Awaiting Confirmation</span>
          {pendingCount > 0 && (
            <span className="badge rounded-pill bg-warning text-dark font-monospace small">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`bd-tab-btn ${filterTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilterTab('confirmed')}
        >
          Confirmed & In Progress ({confirmedCount})
        </button>

        <button
          type="button"
          className={`bd-tab-btn ${filterTab === 'declined' ? 'active' : ''}`}
          onClick={() => setFilterTab('declined')}
        >
          Declined
        </button>
      </div>

      {/* Requests Card List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
          <h5 className="fw-semibold text-dark">No Requests Found</h5>
          <p className="text-muted small mb-3">
            {filterTab === 'pending'
              ? 'You have zero pending requests awaiting confirmation.'
              : 'There are no requests matching your active filter.'}
          </p>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm"
            onClick={() => setFilterTab('all')}
          >
            Show All Requests
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'Pending';
            const isConfirmed = req.status === 'Confirmed';
            const isDeclined = req.status === 'Declined';
            const amount = req.totalAmount || (req.offeredPrice * req.quantity);

            return (
              <div
                key={req.id}
                className={`bd-card p-4 transition-all ${
                  isPending ? 'border-warning border-start border-start-4' : ''
                }`}
              >
                <div className="row g-3 align-items-center">
                  {/* Left: Thumbnail & Core Info */}
                  <div className="col-12 col-md-5 d-flex align-items-center gap-3">
                    <img
                      src={req.image || CROP_FALLBACK[req.crop?.toLowerCase()] || DEFAULT_FALLBACK}
                      alt={req.crop}
                      className="rounded-3 border"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = CROP_FALLBACK[req.crop?.toLowerCase()] || DEFAULT_FALLBACK;
                      }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-light text-dark font-monospace border small">
                          {req.id}
                        </span>
                        <span
                          className={`badge rounded-pill small ${
                            isConfirmed
                              ? 'bg-success text-white'
                              : isPending
                              ? 'bg-warning text-dark'
                              : 'bg-secondary text-white'
                          }`}
                        >
                          {isPending
                            ? 'Awaiting Confirmation'
                            : isConfirmed
                            ? 'Confirmed'
                            : 'Declined'}
                        </span>
                      </div>
                      <h5 className="fw-bold text-dark mb-1">
                        {req.crop}
                        {req.tamilName && (
                          <span className="text-muted fw-normal ms-2 fs-6">
                            ({req.tamilName})
                          </span>
                        )}
                      </h5>
                      <div className="text-muted small">
                        <i className="bi bi-person me-1"></i>
                        <strong>{req.farmer}</strong> • {req.location}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Quantity & Commercial Rates */}
                  <div className="col-6 col-md-3">
                    <div className="small text-muted mb-1">Volume & Rate:</div>
                    <div className="fw-bold text-dark">
                      <span className="font-monospace text-success fs-5">{req.quantity} kg</span>
                      <span className="text-muted ms-2">@ ₹{req.offeredPrice}/kg</span>
                    </div>
                    <div className="small text-muted mt-1">
                      Total: <strong className="font-monospace text-dark">₹{amount.toLocaleString('en-IN')}</strong>
                      {req.mandiPrice && (
                        <span className="text-success ms-1 small">
                          (Mandi: ₹{req.mandiPrice}/kg)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delivery & Timeline */}
                  <div className="col-6 col-md-2">
                    <div className="small text-muted mb-1">Expected Delivery:</div>
                    <div className="fw-semibold text-dark small">
                      <i className="bi bi-calendar3 me-1 text-primary"></i>
                      {req.deliveryDate || 'Within 48h'}
                    </div>
                    <div className="text-muted small mt-1">
                      Req Date: {req.requestDate}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="col-12 col-md-2 text-md-end">
                    {isPending && (
                      <div className="d-flex flex-md-column gap-2 justify-content-end">
                        {/* =======================================================
                            REQUEST CONFIRMATION ACTION (User Requirement)
                           ======================================================= */}
                        <button
                          type="button"
                          className="bd-btn bd-btn-primary bd-btn-sm w-100 justify-content-center animate-pulse"
                          onClick={() => handleOpenConfirmModal(req)}
                        >
                          <i className="bi bi-check2-circle"></i>
                          <span>Confirm Request</span>
                        </button>
                        <button
                          type="button"
                          className="bd-btn bd-btn-outline bd-btn-sm text-danger w-100 justify-content-center"
                          onClick={() => handleDecline(req.id)}
                        >
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="d-flex flex-md-column gap-2 justify-content-end">
                        <button
                          type="button"
                          className="bd-btn bd-btn-outline bd-btn-sm text-success w-100 justify-content-center"
                          onClick={() => navigate('/buyer/orders')}
                        >
                          <i className="bi bi-receipt"></i>
                          <span>View in Orders</span>
                        </button>
                      </div>
                    )}

                    {isDeclined && (
                      <span className="badge bg-light text-muted border p-2">
                        Offer Closed
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Note / Message */}
                {req.message && (
                  <div className="mt-3 pt-2 border-top d-flex align-items-center gap-2 text-muted small bg-light p-2 rounded-2">
                    <i className="bi bi-chat-quote-fill text-success fs-6"></i>
                    <span>{req.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================
          CONFIRMATION MODAL WITH CELEBRATION
         ================================================================ */}
      {targetRequest && (
        <div className="bd-modal-backdrop" onClick={() => !confirmationResult && setTargetRequest(null)}>
          <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            {!confirmationResult ? (
              <>
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success text-white p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-check-lg"></i>
                    </div>
                    <h5 className="fw-bold mb-0">Confirm Sourcing Request</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTargetRequest(null)}
                  ></button>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Target Crop:</span>
                    <strong className="text-dark">{targetRequest.crop} ({targetRequest.quantity} kg)</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Farmer / Supplier:</span>
                    <span className="fw-semibold text-dark">{targetRequest.farmer}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Quoted Farm Rate:</span>
                    <span className="fw-bold text-success font-monospace">₹{targetRequest.offeredPrice}/kg</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold text-dark">Total Order Value:</span>
                    <span className="fs-5 fw-bold text-success font-monospace">
                      ₹{(targetRequest.totalAmount || targetRequest.offeredPrice * targetRequest.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="alert alert-success d-flex align-items-center gap-2 py-2 small mb-4">
                  <i className="bi bi-shield-check fs-5"></i>
                  <span>
                    Confirming will lock the lot and create a purchase order with zero intermediary brokerage.
                  </span>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="bd-btn bd-btn-outline bd-btn-sm"
                    onClick={() => setTargetRequest(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bd-btn bd-btn-primary bd-btn-sm"
                    onClick={handleExecuteConfirmation}
                  >
                    <i className="bi bi-check2-all"></i>
                    <span>Yes, Confirm & Place Order</span>
                  </button>
                </div>
              </>
            ) : (
              /* Celebratory Confetti / Checkmark Confirmation */
              <div className="text-center py-4">
                <div className="celebrate-badge mb-3">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4.5rem' }}></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Request Confirmed!</h3>
                <p className="text-muted mb-3">
                  Purchase Order <strong>{confirmationResult.order.id}</strong> has been generated and queued for farmgate dispatch.
                </p>

                <div className="p-3 bg-light rounded-3 mb-4 small text-start font-monospace">
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Order ID:</span>
                    <strong className="text-dark">{confirmationResult.order.id}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Crop / Volume:</span>
                    <span className="text-success fw-bold">{confirmationResult.order.crop} ({confirmationResult.order.quantity} kg)</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-muted">Amount:</span>
                    <span className="text-success fw-bold">₹{confirmationResult.order.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Status:</span>
                    <span className="badge bg-success text-white">Confirmed & Locked</span>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="bd-btn bd-btn-outline bd-btn-sm"
                    onClick={() => {
                      setTargetRequest(null);
                      setConfirmationResult(null);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="bd-btn bd-btn-primary bd-btn-sm"
                    onClick={() => navigate('/buyer/orders')}
                  >
                    <i className="bi bi-arrow-right"></i>
                    <span>View in Orders Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================
          POST NEW SOURCING REQUEST MODAL
         ================================================================ */}
      {showCreateModal && (
        <div className="bd-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="bd-modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <h5 className="fw-bold mb-0">Post New Sourcing Request</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>

            <form onSubmit={handleCreateNewRequest}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Crop</label>
                  <select
                    className="form-select"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                  >
                    {CROPS_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Cluster Location</label>
                  <select
                    className="form-select"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                  >
                    {LOCATIONS_LIST.filter((l) => l !== 'All Locations').map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Required Volume (kg)</label>
                  <input
                    type="number"
                    className="form-control font-monospace fw-bold"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    min={50}
                    step={25}
                    required
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Max Target Price (₹/kg)</label>
                  <input
                    type="number"
                    className="form-control font-monospace fw-bold text-success"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    min={10}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Requirement Details / Delivery Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="E.g. Grade A required for Chennai distribution hub. Morning dispatch preferred."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="bd-btn bd-btn-outline bd-btn-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bd-btn bd-btn-primary bd-btn-sm"
                >
                  <i className="bi bi-broadcast"></i>
                  <span>Broadcast Request to Farmers</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BuyerLayout>
  );
}
