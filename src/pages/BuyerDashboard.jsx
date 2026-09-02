import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyer } from '../context/BuyerContext';
import BuyerLayout from '../components/buyer/BuyerLayout';
import SummaryCard from '../components/SummaryCard';
import ProductCard from '../components/ProductCard';
import MatchedSupply from '../components/MatchedSupply';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    products,
    orders,
    matchedSupplies,
    activeRequirementsCount,
    totalAvailableKg,
    matchedOrdersCount,
    completedOrdersCount,
    setRequirementPrefill,
    showToast
  } = useBuyer();

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

  return (
    <BuyerLayout>
      {/* 1. WELCOME HEADER (Note: "Procurement Overview" title has been removed as requested) */}
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title">
            Welcome, {user?.name || 'FreshMart Procurement'}
          </h2>
          <p className="bd-page-subtitle">
            Direct farmgate sourcing hub • Connecting institutional buyers directly with verified Tamil Nadu farmer clusters
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="bd-btn bd-btn-outline"
            onClick={() => navigate('/buyer/browse')}
          >
            <i className="bi bi-search"></i>
            <span>Browse Produce</span>
          </button>
          <button
            type="button"
            className="bd-btn bd-btn-primary"
            onClick={() => {
              setRequirementPrefill(null);
              navigate('/buyer/requirement');
            }}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Bulk Requirement</span>
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW KPI CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <SummaryCard
            title="Active Requirements"
            value={activeRequirementsCount}
            subtext="Pending lot aggregation"
            icon="bi-file-earmark-text-fill"
            colorScheme="amber"
            onClick={() => navigate('/buyer/requirement')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <SummaryCard
            title="Available Produce"
            value={`${totalAvailableKg.toLocaleString()} kg`}
            subtext={`Across ${products.length} farm listings`}
            icon="bi-basket-fill"
            colorScheme="green"
            onClick={() => navigate('/buyer/browse')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <SummaryCard
            title="Matched Orders"
            value={matchedOrdersCount}
            subtext="Confirmed / In transit"
            icon="bi-diagram-3-fill"
            colorScheme="blue"
            onClick={() => navigate('/buyer/orders')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <SummaryCard
            title="Completed Orders"
            value={completedOrdersCount}
            subtext="Fulfillments delivered"
            icon="bi-check2-circle"
            colorScheme="purple"
            onClick={() => navigate('/buyer/orders')}
          />
        </div>
      </div>

      {/* 3. SMART AGGREGATOR QUICK ACTION CALLOUT */}
      <div className="p-3 mb-4 bg-white border rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-success text-white p-2 rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-boxes fs-4"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Automated Multi-Farm Aggregator</h6>
            <p className="text-muted small mb-0">
              Need commercial tonnage? FarmDirect pools multiple smallholder harvests into 1 unified shipment.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="bd-btn bd-btn-primary bd-btn-sm"
          onClick={() => {
            setRequirementPrefill({ crop: 'Tomato', location: 'Dindigul', price: 25, quantity: 500 });
            navigate('/buyer/requirement');
          }}
        >
          <span>Test Tomato Aggregation (500kg)</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* 4. RECENT ACTIVITY: MATCHED SUPPLY & RECENT ORDERS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <MatchedSupply
            matchedSupplies={matchedSupplies.slice(0, 3)}
            onCreateNewRequirement={() => navigate('/buyer/requirement')}
          />
        </div>

        <div className="col-12 col-lg-6">
          <div className="bd-card h-100">
            <div className="bd-card-header">
              <h3 className="bd-card-title">
                <i className="bi bi-clock-history text-primary"></i>
                <span>Recent Procurement Activity</span>
              </h3>
              <button
                type="button"
                className="btn btn-link text-success p-0 fw-bold small text-decoration-none"
                onClick={() => navigate('/buyer/orders')}
              >
                View All Orders →
              </button>
            </div>
            <div className="table-responsive">
              <table className="bd-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Crop</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td className="font-monospace fw-bold">{o.id}</td>
                      <td>{o.crop}</td>
                      <td>{o.quantity} kg</td>
                      <td className="fw-bold text-success font-monospace">
                        ₹{o.amount?.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span
                          className={`bd-badge ${
                            o.status === 'Delivered'
                              ? 'bd-badge-delivered'
                              : o.status === 'In Transit'
                              ? 'bd-badge-transit'
                              : 'bd-badge-confirmed'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FEATURED PRODUCE STRIP */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-dark mb-0">Live Farmer Harvests</h4>
          <p className="text-muted small mb-0">Direct from Oddanchatram, Dindigul & Palani clusters</p>
        </div>
        <button
          type="button"
          className="bd-btn bd-btn-outline bd-btn-sm"
          onClick={() => navigate('/buyer/browse')}
        >
          View All {products.length} Products →
        </button>
      </div>

      <div className="row g-3">
        {products.slice(0, 3).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={() => navigate(`/buyer/products/${product.id}`)}
            onAddToRequirement={handleAddToRequirement}
          />
        ))}
      </div>
    </BuyerLayout>
  );
}
