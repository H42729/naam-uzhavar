/**
 * Driver Trip Summary & Earnings Page
 * Route: /driver/trips
 * Tracks driver earnings, weekly metrics, performance ratings, and payout withdrawals.
 */

import React, { useState } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { DRIVER_EARNINGS } from '../../data/driverData';

export default function DriverTripSummaryPage() {
  const [earnings, setEarnings] = useState(DRIVER_EARNINGS);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 4000);
    }, 1200);
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Performance & Financials
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">Trip Summary & Earnings</h1>
          </div>

          <div>
            <button
              type="button"
              className="drv-btn drv-btn-primary"
              disabled={withdrawing}
              onClick={handleWithdraw}
            >
              {withdrawing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-wallet2"></i>
                  <span>Withdraw Payout to UPI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {withdrawSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3 shadow-xs">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <div>
              <strong>Withdrawal Initiated!</strong>
              <div className="small">₹{earnings.today} transferred to rajkumar.driver@upi via IMPS. Reference #IMP-984210.</div>
            </div>
          </div>
        )}

        {/* Top 3 Earnings Metrics */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="drv-card p-3 border-start border-4 border-success h-100">
              <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                TODAY'S ESTIMATED REVENUE
              </span>
              <div className="fs-2 fw-bold text-success font-monospace my-1">
                ₹{earnings.today.toLocaleString()}
              </div>
              <span className="text-muted small">
                <i className="bi bi-arrow-up-right text-success me-1"></i>
                From 2 active & completed consignments
              </span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="drv-card p-3 border-start border-4 border-warning h-100">
              <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                THIS WEEK'S EARNINGS
              </span>
              <div className="fs-2 fw-bold text-dark font-monospace my-1">
                ₹{earnings.thisWeek.toLocaleString()}
              </div>
              <span className="text-muted small">
                <i className="bi bi-check2 text-primary me-1"></i>
                11 trips completed across Dindigul-Madurai
              </span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="drv-card p-3 border-start border-4 border-primary h-100">
              <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem' }}>
                THIS MONTH (AUG-SEP)
              </span>
              <div className="fs-2 fw-bold text-primary font-monospace my-1">
                ₹{earnings.thisMonth.toLocaleString()}
              </div>
              <span className="text-muted small">
                <i className="bi bi-shield-check text-success me-1"></i>
                Verified FPO direct settlement
              </span>
            </div>
          </div>
        </div>

        {/* Driving & Performance Telematics */}
        <div className="drv-card mb-4">
          <div className="drv-card-title">
            <span>
              <i className="bi bi-speedometer2 me-1 text-warning"></i> FLEET & TRIP EFFICIENCY
            </span>
            <span className="badge bg-light text-dark border small">Overall Telematics</span>
          </div>

          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">TOTAL TRIPS</span>
                <strong className="fs-4 text-dark font-monospace">{earnings.totalTrips}</strong>
                <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                  Since Joined Jan 2026
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">DISTANCE COVERED</span>
                <strong className="fs-4 text-dark font-monospace">{earnings.totalDistanceKm} km</strong>
                <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                  Horticulture Corridors
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">ON-TIME RATE</span>
                <strong className="fs-4 text-success font-monospace">{earnings.onTimeRate}</strong>
                <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                  Top Tier Performer
                </span>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 bg-light rounded-3 border">
                <span className="text-muted small d-block">DRIVER RATING</span>
                <strong className="fs-4 text-warning font-monospace">★ {earnings.rating}</strong>
                <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                  172 Farmer & Buyer Reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payout Settlements */}
        <div className="drv-card">
          <div className="drv-card-title">
            <span>
              <i className="bi bi-clock-history me-1 text-primary"></i> RECENT PAYOUT SETTLEMENTS
            </span>
            <span className="badge bg-success-subtle text-success small">Direct Bank Transfer</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small text-uppercase">
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Payout Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.recentPayouts.map((txn) => (
                  <tr key={txn.id}>
                    <td className="font-monospace fw-bold text-dark">{txn.id}</td>
                    <td className="text-muted small">{txn.date}</td>
                    <td className="small">{txn.method}</td>
                    <td className="fw-bold font-monospace text-success fs-6">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success small">
                        <i className="bi bi-check2-circle me-1"></i> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}
