import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import RequirementForm from '../../components/RequirementForm';
import MatchResult from '../../components/MatchResult';

export default function BuyerRequirementPage() {
  const navigate = useNavigate();
  const {
    requirementPrefill,
    findMatchingSupply,
    activeMatch,
    confirmOrder
  } = useBuyer();

  const handleConfirmOrder = (orderData) => {
    confirmOrder(orderData);
  };

  return (
    <BuyerLayout>
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title">Bulk Requirement & Aggregation</h2>
          <p className="bd-page-subtitle">
            Enter target produce volume to automatically match and aggregate across local farmer lots with consolidated dispatch
          </p>
        </div>

        <button
          type="button"
          className="bd-btn bd-btn-outline bd-btn-sm"
          onClick={() => navigate('/buyer/matched-supply')}
        >
          <i className="bi bi-diagram-3"></i>
          <span>View Matched Supply Pools</span>
        </button>
      </div>

      {/* Requirement Form Component */}
      <RequirementForm
        initialValues={requirementPrefill}
        onSubmitRequirement={findMatchingSupply}
      />

      {/* Matching Engine Result Card */}
      {activeMatch && (
        <MatchResult
          matchData={activeMatch}
          onConfirmOrder={handleConfirmOrder}
          onViewOrders={() => navigate('/buyer/orders')}
        />
      )}
    </BuyerLayout>
  );
}
