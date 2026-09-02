import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, acceptRequest, declineRequest } = useFarmer();

  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <FarmerLayout>
        <div className="p-5 text-center bg-white rounded-4 border">
          <i className="bi bi-exclamation-circle fs-1 text-warning mb-2 d-block"></i>
          <h4 className="fw-bold text-dark">Consumer Request Not Found</h4>
          <p className="text-muted small mb-3">
            The request with ID <code>{id}</code> could not be found or may have been updated.
          </p>
          <Link to="/farmer/requests" className="btn btn-success fw-bold rounded-pill px-4">
            ← Back to All Requests
          </Link>
        </div>
      </FarmerLayout>
    );
  }

  const handleAccept = () => {
    acceptRequest(request.id);
  };

  const handleDecline = () => {
    declineRequest(request.id);
  };

  return (
    <FarmerLayout>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-2">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
            style={{ width: '42px', height: '42px' }}
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <i className="bi bi-arrow-left fs-5 text-dark"></i>
          </button>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span
                className={`badge rounded-pill px-3 py-1 ${
                  request.status === 'Accepted'
                    ? 'bg-success text-white'
                    : request.status === 'Declined'
                    ? 'bg-danger text-white'
                    : 'bg-warning text-dark'
                }`}
              >
                {request.status.toUpperCase()} REQUEST
              </span>
              <span className="text-muted small font-monospace">#{request.id}</span>
            </div>
            <h1 className="fw-black text-dark mb-0" style={{ fontSize: '1.75rem' }}>
              Request Full Details — {request.productName}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {request.status === 'Pending' ? (
            <>
              <button
                type="button"
                className="btn btn-outline-danger px-3 py-2 fw-semibold rounded-3"
                onClick={handleDecline}
              >
                <i className="bi bi-x-lg me-1"></i> Decline Request
              </button>
              <button
                type="button"
                className="btn btn-success px-4 py-2 fw-bold rounded-3 shadow-sm"
                onClick={handleAccept}
              >
                <i className="bi bi-check-lg me-1"></i> Accept Request
              </button>
            </>
          ) : request.status === 'Accepted' ? (
            <span className="badge bg-success fs-6 rounded-pill px-4 py-2">
              ✓ Request Confirmed &amp; Accepted
            </span>
          ) : (
            <span className="badge bg-danger fs-6 rounded-pill px-4 py-2">
              ✕ Request Declined
            </span>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Key Highlights & Produce Order Specs (7 cols) */}
        <div className="col-lg-7">
          {/* Order Overview Card */}
          <div className="farm-card mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-box-seam-fill text-success"></i>
              <span>1. Produce &amp; Pricing Requirements</span>
            </h5>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="small text-muted fw-bold text-uppercase d-block mb-1">
                    Requested Crop / Produce
                  </span>
                  <div className="fs-5 fw-bold text-dark">{request.productName}</div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle">
                  <span className="small fw-bold text-uppercase d-block mb-1">
                    Required Quantity
                  </span>
                  <div className="fs-5 fw-bold font-monospace text-success">{request.quantity}</div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3 border">
                  <span className="small text-muted fw-bold text-uppercase d-block mb-1">
                    Buyer's Offer Price
                  </span>
                  <div className="fs-5 fw-bold font-monospace text-dark">{request.offerPrice}</div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle">
                  <span className="small fw-bold text-uppercase d-block mb-1">
                    Total Estimated Order Value
                  </span>
                  <div className="fs-5 fw-bold font-monospace text-success">
                    {request.totalValue || '₹9,600'}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Specifications */}
            <h6 className="fw-bold text-dark mt-4 mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-truck text-success"></i>
              <span>Delivery &amp; Pickup Logistics</span>
            </h6>

            <div className="p-3 bg-light rounded-3 border">
              <div className="row g-2 small text-muted">
                <div className="col-sm-6">
                  <strong>Request Created Date:</strong>
                  <div className="text-dark fw-semibold mt-1">{request.requestDate || 'Recent'}</div>
                </div>
                <div className="col-sm-6">
                  <strong>Expected Delivery Window:</strong>
                  <div className="text-dark fw-bold mt-1">
                    {request.deliveryDate || 'Within 48 hours'}
                  </div>
                </div>
                <div className="col-12 mt-2 pt-2 border-top">
                  <strong>Destination Hub / Address:</strong>
                  <div className="text-dark fw-semibold mt-1">
                    {request.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author/Buyer Message & Quality Notes */}
          <div className="farm-card">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-chat-left-text-fill text-success"></i>
              <span>2. Buyer's Instructions &amp; Specifications</span>
            </h5>

            <div className="p-3 bg-white rounded-3 border">
              <p className="mb-0 text-dark" style={{ lineHeight: 1.6 }}>
                "{request.message || 'No additional instructions provided by buyer.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Buyer / Author Background & Profile (5 cols) */}
        <div className="col-lg-5">
          <div className="farm-card mb-4">
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-building text-success"></i>
              <span>Buyer Organization &amp; Contact Details</span>
            </h5>

            <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
              <img
                src={
                  request.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                }
                alt={request.consumerName}
                className="rounded-circle border"
                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="fw-bold text-dark mb-1">{request.consumerName}</h5>
                <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill px-3 py-1">
                  {request.businessType || 'Direct Commercial Buyer'}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex justify-content-between p-2 bg-light rounded-2">
                <span className="text-muted fw-bold">Primary Location:</span>
                <span className="text-dark fw-semibold">{request.location}</span>
              </div>

              <div className="d-flex justify-content-between p-2 bg-light rounded-2">
                <span className="text-muted fw-bold">Contact Phone:</span>
                <span className="text-dark font-monospace fw-semibold">
                  {request.phone || '+91 98421 55678'}
                </span>
              </div>

              <div className="d-flex justify-content-between p-2 bg-light rounded-2">
                <span className="text-muted fw-bold">Email Address:</span>
                <span className="text-dark fw-semibold">
                  {request.email || 'buyer@procurement.in'}
                </span>
              </div>

              <div className="d-flex justify-content-between p-2 bg-light rounded-2">
                <span className="text-muted fw-bold">Verification:</span>
                <span className="text-success fw-bold">✓ Verified GST B2B Buyer</span>
              </div>
            </div>
          </div>

          {/* Direct Payout Protection */}
          <div className="p-3 bg-success-subtle text-success-emphasis rounded-4 border border-success-subtle">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-success"></i>
              <span>Naam Uzhavar Direct Guarantee</span>
            </h6>
            <p className="small mb-0">
              When you accept this request, the order is locked at ₹{request.offerPrice || '24/kg'}.
              Payment will be released directly to your registered bank account upon farm gate pickup confirmation.
            </p>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
