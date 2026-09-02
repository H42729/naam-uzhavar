import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CROP_FALLBACK = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  brinjal: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80'
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80';

export default function ProductCard({
  product,
  onViewDetails,
  onAddToRequirement
}) {
  const navigate = useNavigate();

  const handleDetailsClick = (e) => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate(`/buyer/products/${product.id}`);
    }
  };

  const cropKey = product.crop?.toLowerCase();
  const defaultCropImg = CROP_FALLBACK[cropKey] || FALLBACK_IMAGE;

  return (
    <div className="col-12 col-sm-6 col-xl-4">
      <div className="bd-produce-card h-100 d-flex flex-column">
        {/* Card Thumbnail */}
        <div className="bd-produce-thumb">
          <img
            src={product.image || defaultCropImg}
            alt={product.crop}
            className="bd-produce-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultCropImg;
            }}
          />
          <div className="bd-produce-loc">
            <i className="bi bi-geo-alt-fill text-warning"></i>
            <span>{product.location}</span>
          </div>
          <div className="bd-produce-price">
            ₹{product.price}
            <span style={{ fontSize: '0.74rem', fontWeight: 500, color: '#64748b' }}>/kg</span>
          </div>
          {product.mandiPrice && (
            <div className="bd-produce-mandi-tag">
              Mandi: ₹{product.mandiPrice}/kg
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="bd-produce-body d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div>
              <h4 className="bd-produce-name mb-0">
                <Link
                  to={`/buyer/products/${product.id}`}
                  className="text-decoration-none text-dark hover-primary"
                >
                  {product.crop}
                </Link>
              </h4>
              <span className="text-muted small">
                {product.tamilName ? `${product.tamilName} • ` : ''}
                <span className="text-success fw-semibold">{product.grade || 'Grade A'}</span>
              </span>
            </div>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
              Verified Lot
            </span>
          </div>

          {/* Key Specs */}
          <div className="bd-produce-info-list my-2">
            <div className="bd-produce-info-row">
              <span className="lbl">
                <i className="bi bi-person"></i> Farmer / FPO:
              </span>
              <span className="val text-dark fw-medium">{product.farmer}</span>
            </div>
            <div className="bd-produce-info-row">
              <span className="lbl">
                <i className="bi bi-box-seam"></i> Available Qty:
              </span>
              <span className="val text-success font-monospace fw-bold">{product.quantity} kg</span>
            </div>
            <div className="bd-produce-info-row">
              <span className="lbl">
                <i className="bi bi-calendar-check"></i> Harvest Date:
              </span>
              <span className="val text-muted">{product.harvestDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2 mt-auto pt-2 border-top">
            <Link
              to={`/buyer/products/${product.id}`}
              className="bd-btn bd-btn-outline bd-btn-sm flex-fill text-decoration-none d-flex align-items-center justify-content-center gap-1"
            >
              <i className="bi bi-eye"></i>
              <span>View Details</span>
            </Link>
            {onAddToRequirement && (
              <button
                type="button"
                className="bd-btn bd-btn-primary bd-btn-sm flex-fill"
                onClick={() => onAddToRequirement(product)}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Add to Req</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
