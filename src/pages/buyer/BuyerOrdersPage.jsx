import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import OrderTable from '../../components/OrderTable';

export default function BuyerOrdersPage() {
  const navigate = useNavigate();
  const { orders } = useBuyer();

  // Compute live summary stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const inTransit = orders.filter((o) =>
      o.status?.toLowerCase().includes('transit')
    ).length;
    const delivered = orders.filter(
      (o) => o.status?.toLowerCase() === 'delivered'
    ).length;
    const confirmed = orders.filter(
      (o) => o.status?.toLowerCase() === 'confirmed'
    ).length;
    const totalSpend = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const totalVolume = orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);

    return {
      totalOrders,
      inTransit,
      delivered,
      confirmed,
      totalSpend,
      totalVolume
    };
  }, [orders]);

  return (
    <BuyerLayout>
      {/* Page Header */}
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title d-flex align-items-center gap-2">
            <span>Procurement Purchase Orders</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fs-6 px-2.5 py-0.5">
              Live Escrow
            </span>
          </h2>
          <p className="bd-page-subtitle">
            Track consolidated orders, real-time logistics dispatch status, and multi-farmer lot receipts
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="bd-btn bd-btn-outline bd-btn-sm"
            onClick={() => navigate('/buyer/requests')}
          >
            <i className="bi bi-inbox"></i>
            <span>Farmer Requests</span>
          </button>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm shadow-xs"
            onClick={() => navigate('/buyer/browse')}
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Order New Produce</span>
          </button>
        </div>
      </div>

      {/* Vibrant Summary KPI Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total Orders */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bd-order-kpi-card bd-kpi-grad-emerald h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                Total Orders
              </span>
              <div className="bd-kpi-icon-bubble bg-success text-white shadow-xs">
                <i className="bi bi-receipt"></i>
              </div>
            </div>
            <div className="fs-2 fw-black text-dark font-monospace mb-0.5">
              {stats.totalOrders}
            </div>
            <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.75rem' }}>
              <span>Volume: {stats.totalVolume.toLocaleString('en-IN')} kg</span>
              <span className="text-success fw-bold">100% Verified</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active In-Transit */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bd-order-kpi-card bd-kpi-grad-blue h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                In Transit Consignments
              </span>
              <div className="bd-kpi-icon-bubble bg-primary text-white shadow-xs">
                <i className="bi bi-truck" style={{ animation: 'bdTruckDrive 2s infinite ease-in-out' }}></i>
              </div>
            </div>
            <div className="fs-2 fw-black text-primary font-monospace mb-0.5">
              {stats.inTransit}
            </div>
            <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.75rem' }}>
              <span>Live GPS tracking</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Completed Deliveries */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bd-order-kpi-card bd-kpi-grad-purple h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                Delivered &amp; Received
              </span>
              <div className="bd-kpi-icon-bubble text-white shadow-xs" style={{ backgroundColor: '#7c3aed' }}>
                <i className="bi bi-patch-check-fill"></i>
              </div>
            </div>
            <div className="fs-2 fw-black font-monospace mb-0.5" style={{ color: '#6d28d9' }}>
              {stats.delivered}
            </div>
            <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.75rem' }}>
              <span>Quality inspected</span>
              <span className="badge rounded-pill fw-bold" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe' }}>
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Spend */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bd-order-kpi-card bd-kpi-grad-amber h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                Procurement Value
              </span>
              <div className="bd-kpi-icon-bubble text-white shadow-xs" style={{ backgroundColor: '#d97706' }}>
                <i className="bi bi-currency-rupee"></i>
              </div>
            </div>
            <div className="fs-2 fw-black text-dark font-monospace mb-0.5">
              ₹{stats.totalSpend.toLocaleString('en-IN')}
            </div>
            <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.75rem' }}>
              <span>Direct Farmgate Rate</span>
              <span className="fw-bold" style={{ color: '#15803d' }}>~18% Mandi Savings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Orders Table & Grid Section */}
      <div className="row g-4">
        <div className="col-12">
          <OrderTable orders={orders} />
        </div>
      </div>
    </BuyerLayout>
  );
}
