import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import OrderTable from '../../components/OrderTable';

export default function BuyerOrdersPage() {
  const navigate = useNavigate();
  const { orders } = useBuyer();

  return (
    <BuyerLayout>
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title">Procurement Purchase Orders</h2>
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
            <span>View Farmer Quotes</span>
          </button>
          <button
            type="button"
            className="bd-btn bd-btn-primary bd-btn-sm"
            onClick={() => navigate('/buyer/browse')}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Order New Produce</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <OrderTable orders={orders} />
        </div>
      </div>
    </BuyerLayout>
  );
}
