import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerRequestsPage() {
  const { requests, acceptRequest, declineRequest } = useFarmer();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Accepted', 'Declined'

  const filterTabs = ['All', 'Pending', 'Accepted', 'Declined'];

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.businessType && r.businessType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Separate active/acceptable requests from declined requests
  const activeRequests = filteredRequests.filter((r) => r.status !== 'Declined');
  const declinedRequests = filteredRequests.filter((r) => r.status === 'Declined');

  const renderRequestCard = (req) => (
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
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h5 className="fw-bold text-dark mb-0">{req.consumerName}</h5>
              <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                {req.businessType}
              </span>
              <span className="text-muted small font-monospace">#{req.id}</span>
            </div>

            <div className="small text-dark mt-1">
              <span>Requested: </span>
              <strong className="text-dark">{req.productName}</strong> • Quantity:{' '}
              <strong className="text-success font-monospace">{req.quantity}</strong> • Offer:{' '}
              <span className="fw-bold text-dark font-monospace">{req.offerPrice}</span>
              {req.totalValue && (
                <span className="text-muted ms-1">
                  (Total: <strong className="text-success font-monospace">{req.totalValue}</strong>)
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
            <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">
              ✓ Accepted
            </span>
          ) : (
            <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold">
              ✕ Declined
            </span>
          )}

          {/* Navigates to dedicated details route */}
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
  );

  return (
    <FarmerLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: '1.85rem' }}>
            Consumer &amp; Buyer Requests
          </h1>
          <p className="text-muted small mb-0">
            Review live purchase proposals from verified retail buyers and hospitality chains.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 flex-wrap">
          {filterTabs.map((tab) => {
            const count =
              tab === 'All'
                ? requests.length
                : requests.filter((r) => r.status.toLowerCase() === tab.toLowerCase()).length;
            return (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  statusFilter === tab ? 'btn-success fw-bold' : 'btn-light text-muted border'
                }`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Request Container Card */}
      <div className="farm-card mb-4">
        {/* When viewing 'All', split into Top: Acceptable/Active Requests and Below: Declined Requests */}
        {statusFilter === 'All' ? (
          <>
            {/* 1. Top Section: Acceptable & Active Requests */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                    ● Active &amp; Actionable
                  </span>
                  <h5 className="fw-bold text-dark mb-0 fs-6">
                    Pending &amp; Accepted Orders ({activeRequests.length})
                  </h5>
                </div>
                <span className="small text-muted">Awaiting fulfillment / decisions</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {activeRequests.map(renderRequestCard)}
                {activeRequests.length === 0 && (
                  <div className="p-4 text-center text-muted bg-light rounded-3 small">
                    No active or pending requests found.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Below Section: Declined Requests */}
            {declinedRequests.length > 0 && (
              <div className="pt-3 border-top">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
                      ✕ Declined
                    </span>
                    <h5 className="fw-bold text-muted mb-0 fs-6">
                      Declined Requests ({declinedRequests.length})
                    </h5>
                  </div>
                  <span className="small text-muted">Archived proposals</span>
                </div>

                <div className="d-flex flex-column gap-3 opacity-90">
                  {declinedRequests.map(renderRequestCard)}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Specific Filter Selected (e.g. 'Pending', 'Accepted', 'Declined') */
          <div className="d-flex flex-column gap-3">
            {filteredRequests.map(renderRequestCard)}

            {filteredRequests.length === 0 && (
              <div className="p-5 text-center bg-white rounded-4">
                <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                <h5 className="fw-bold text-dark">No requests found</h5>
                <p className="text-muted small mb-0">
                  There are no {statusFilter.toLowerCase()} requests matching your search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
