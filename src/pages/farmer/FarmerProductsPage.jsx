import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';
import CropDetailsModal from '../../components/farmer/CropDetailsModal';
import EditProductModal from '../../components/farmer/EditProductModal';
import AddProductButton from '../../components/farmer/AddProductButton';

export default function FarmerProductsPage() {
  const { products, deleteProduct } = useFarmer();
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Spices & Herbs'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilName && p.tamilName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.district && p.district.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <FarmerLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-black text-dark mb-1" style={{ fontSize: '1.85rem' }}>
            {language === 'ta' ? 'எனது அறுவடைப் பொருட்கள்' : 'My Harvest Products'}
          </h1>
          <p className="text-muted small mb-0">
            {language === 'ta'
              ? 'உங்கள் விளைபொருட்களை நிர்வகிக்கவும், இருப்பு மற்றும் விலை விவரங்களை புதுப்பிக்கவும்.'
              : 'Manage your listed produce, track stock availability, and update pricing benchmarks.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <AddProductButton />
      </div>

      {/* Main Container Card enclosing filters and all products */}
      <div className="farm-card mb-4">
        {/* Controls Bar Header */}
        <div className="farm-card-header mb-3 pb-3 border-bottom">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
            {/* Category Filter Pills */}
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-1 ${
                    categoryFilter === cat ? 'btn-success fw-bold' : 'btn-light text-muted border'
                  }`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode & Count */}
            <div className="d-flex align-items-center gap-3">
              <span className="small text-muted">
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${viewMode === 'grid' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <i className="bi bi-grid-fill"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'table' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enclosed Products Grid View */}
        {viewMode === 'grid' ? (
          <div className="farm-product-grid">
            {filteredProducts.map((item) => (
              <div key={item.id} className="farm-product-card">
                <div className="farm-product-img-wrap">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={item.name}
                    className="farm-product-img"
                  />
                  <span className="farm-product-badge bg-success text-white">
                    {item.category}
                  </span>
                  <span className="farm-product-price-tag font-monospace">
                    ₹{item.price} / {item.unit}
                  </span>
                </div>

                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                      {language === 'ta' ? (item.tamilName || item.name) : item.name}
                    </h6>
                    <span
                      className={`badge rounded-pill ${
                        item.status === 'Active'
                          ? 'bg-success-subtle text-success border border-success-subtle'
                          : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="small text-muted mb-2">
                    {language === 'ta' ? 'கிடைக்கும் அளவு:' : 'Available:'}{' '}
                    <strong className="text-success font-monospace">{item.quantity} {item.unit}</strong>
                  </div>

                  <div className="small text-muted mb-3 d-flex align-items-center gap-2">
                    <span>
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      {item.district}
                    </span>
                    <span>•</span>
                    <span>
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.harvestDate}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success fw-semibold px-3 rounded-pill"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>

                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        title="Edit Product"
                        onClick={() => setEditingProduct(item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Product"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                            deleteProduct(item.id, item.name);
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Enclosed Table View */
          <div className="table-responsive">
            <table className="nu-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0]
                              : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
                          }
                          alt="thumb"
                          className="rounded-2 border"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{item.name}</div>
                          <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                            {item.tamilName} • {item.grade}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-muted border">{item.category}</span>
                    </td>
                    <td className="font-monospace fw-semibold">{item.quantity} {item.unit}</td>
                    <td className="font-monospace fw-bold text-success">₹{item.price}/{item.unit}</td>
                    <td className="small text-muted">{item.district}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          item.status === 'Active'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setSelectedProduct(item)}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setEditingProduct(item)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Delete ${item.name}?`)) {
                              deleteProduct(item.id, item.name);
                            }
                          }}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="p-5 text-center bg-white rounded-4">
            <i className="bi bi-box-seam fs-1 text-muted mb-2 d-block"></i>
            <h5 className="fw-bold text-dark">No products found</h5>
            <p className="text-muted small mb-3">
              Try adjusting your search query or add a new harvest crop listing.
            </p>
            <AddProductButton label="Add New Product" />
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <CropDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={(prod) => setEditingProduct(prod)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </FarmerLayout>
  );
}
