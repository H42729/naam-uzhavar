import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import MatchedSupply from '../../components/MatchedSupply';

export default function BuyerMatchedSupplyPage() {
  const navigate = useNavigate();
  const { matchedSupplies } = useBuyer();

  return (
    <BuyerLayout>
      <div className="bd-page-header">
        <div>
          <h2 className="bd-page-title">Matched Supply Overview</h2>
          <p className="bd-page-subtitle">
            Consolidated supply pools aggregated across verified smallholder farmers with transparent price settlement
          </p>
        </div>

        <button
          type="button"
          className="bd-btn bd-btn-primary bd-btn-sm"
          onClick={() => navigate('/buyer/requirement')}
        >
          <i className="bi bi-plus-circle"></i>
          <span>New Supply Aggregation</span>
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <MatchedSupply
            matchedSupplies={matchedSupplies}
            onCreateNewRequirement={() => navigate('/buyer/requirement')}
          />
        </div>
      </div>
    </BuyerLayout>
  );
}
