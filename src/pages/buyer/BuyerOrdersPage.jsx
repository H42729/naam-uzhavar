/**
 * Buyer Orders Page
 * Route: /buyer/orders
 * Displays confirmed purchase orders with status filtering tabs,
 * detailed modal showing delivery status and the complete Multi-Farmer Order Breakdown.
 * Follows Master Prompt Sections 18, 19, 20.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';

export default function BuyerOrdersPage() {
  const { orders, getOrCreateConversationForFarmer } = useBuyer();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = ['All', 'Confirmed', 'In Transit', 'Delivered'];

  const filteredOrders = orders.filter((o) => {
    const status = (o.status || '').toLowerCase();
    const matchesTab =
      activeTab === 'All' ||
      status === activeTab.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.crop.toLowerCase().includes(query) ||
      (o.location && o.location.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge bg-success text-white rounded-pill px-2.5 py-1">✓ {t('orderDeliveredBadge')}</span>;
      case 'In Transit':
        return <span className="badge bg-info text-dark rounded-pill px-2.5 py-1">🚚 {t('orderInTransitBadge')}</span>;
      case 'Confirmed':
      default:
        return <span className="badge bg-primary text-white rounded-pill px-2.5 py-1">🟢 {t('orderConfirmedBadge')}</span>;
    }
  };

  const handleMessageFarmers = (order) => {
    const firstFarmer = order.farmerBreakdown?.[0]?.farmer || 'Farmer Partner';
    const convId = getOrCreateConversationForFarmer(firstFarmer, order.crop);
    setSelectedOrder(null);
    navigate(`/buyer/messages?conv=${convId}`);
  };

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade">
        {/* ===================================================================
            1. PAGE HEADER
            =================================================================== */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.04em' }}>
              {language === 'ta' ? 'உறுதி செய்யப்பட்ட கொள்முதல் ஆர்டர்கள்' : 'CONFIRMED PROCUREMENT ORDERS'}
            </span>
            <h1 className="fw-black text-dark fs-3 mb-0">{t('myOrders')}</h1>
          </div>

          <Link to="/buyer/browse" className="btn btn-outline-primary rounded-pill px-3.5 py-2 fw-bold">
            <i className="bi bi-cart-plus me-1.5"></i>
            <span>{t('viewMarketplaceCTA')}</span>
          </Link>
        </div>

        {/* ===================================================================
            2. TABS & SEARCH (STICKY SUB-HEADER)
            =================================================================== */}
        <div className="bd-filter-tabs-container">
          {/* Scroll-free tabs container: 2 in one row, another two in next row on mobile */}
          <div className="bd-tabs-scroll-area">
            {filterTabs.map((tab) => {
              const count =
                tab === 'All'
                  ? orders.length
                  : orders.filter((o) => (o.status || '').toLowerCase() === tab.toLowerCase()).length;
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  className={`bd-tab-pill ${
                    isActive ? 'bd-tab-pill-active active' : 'bd-tab-pill-inactive'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab}</span>
                  <span className="bd-tab-badge">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar: Separated on mobile, side-by-side on desktop/tablet */}
          <div className="bd-search-wrapper">
            <i
              className="bd-search-icon bi bi-search"
              aria-hidden="true"
            ></i>
            <input
              type="text"
              className="bd-search-input"
              placeholder={language === 'ta' ? 'ஆர்டர் எண் அல்லது பயிர்...' : 'Search order # or crop...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ===================================================================
            3. ORDERS LIST / EMPTY STATE
            =================================================================== */}
        {filteredOrders.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 border my-4">
            <i className="bi bi-box-seam fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">{t('noOrdersYetBuyerTitle')}</h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '380px', margin: '0 auto' }}>
              {t('noOrdersYetBuyerDesc')}
            </p>
            <Link to="/buyer/browse" className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-xs">
              {t('browseProduceCTA')}
            </Link>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="col-12 col-md-6 col-lg-4">
                <div className="farm-card p-4 rounded-4 bg-white border shadow-xs h-100 d-flex flex-column hover-scale transition">
                  {/* Order ID & Status */}
                  <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-1.5 flex-wrap">
                      <strong className="fs-6 font-monospace text-dark">
                        Order #{order.id}
                      </strong>
                      {order.orderType && (
                        <span
                          className="badge rounded-pill px-2 py-0.5"
                          style={{
                            fontSize: '0.68rem',
                            backgroundColor: order.orderType.includes('Bulk') ? '#eff6ff' : '#f0fdf4',
                            color: order.orderType.includes('Bulk') ? '#1d4ed8' : '#15803d',
                            border: `1px solid ${order.orderType.includes('Bulk') ? '#bfdbfe' : '#bbf7d0'}`
                          }}
                        >
                          {order.orderType.includes('Bulk') ? 'Bulk Pooled' : 'Direct Buy'}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Crop & Quantity */}
                  <div className="mb-3">
                    <h3 className="fs-5 fw-bold text-dark mb-1">
                      {order.crop}
                    </h3>
                    <span className="text-muted small">
                      {order.farmers || order.farmerBreakdown?.length || 1} {language === 'ta' ? 'விவசாயிகளிடமிருந்து தொகுக்கப்பட்டது' : 'farmers contributing'}
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3 bg-light rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1.5">
                      <span className="text-muted">{language === 'ta' ? 'அளவு' : 'Quantity'}:</span>
                      <strong className="text-success font-monospace fs-6">{order.quantity} kg</strong>
                    </div>
                    <div className="d-flex justify-content-between pt-1 border-top">
                      <span className="text-dark fw-bold">{language === 'ta' ? 'மொத்த தொகை' : 'Total Amount'}:</span>
                      <strong className="text-primary font-monospace fs-6">
                        ₹{Number(order.amount).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Location & Delivery */}
                  <div className="d-flex justify-content-between align-items-center text-muted small mb-3" style={{ fontSize: '0.74rem' }}>
                    <span>
                      <i className="bi bi-calendar3 me-1"></i> {order.deliveryDate || 'Within 48h'}
                    </span>
                    <span className="text-truncate" style={{ maxWidth: '140px' }}>
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {order.location || 'Central Distribution Hub'}
                    </span>
                  </div>

                  {/* CTA: VIEW ORDER */}
                  <div className="mt-auto pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-primary fw-bold w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-1.5 shadow-2xs"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <span>{language === 'ta' ? 'ஆர்டரைப் பார்' : 'View Order'}</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================
            4. ORDER DETAILS MODAL (Section 20)
            =================================================================== */}
        {selectedOrder && (
          <div
            className="position-fixed inset-0 bg-dark bg-opacity-65 d-flex align-items-center justify-content-center p-3 farm-animate-fade"
            style={{ zIndex: 1250, top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="bg-white rounded-4 p-4 max-w-lg w-100 shadow-xl" style={{ maxWidth: '620px', maxHeight: '92vh', overflowY: 'auto' }}>
              {/* Modal Header */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <strong className="fs-5 fw-black text-dark">
                    Order #{selectedOrder.id}
                  </strong>
                  {selectedOrder.orderType && (
                    <span className="badge bg-primary-subtle text-primary rounded-pill small">
                      {selectedOrder.orderType}
                    </span>
                  )}
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <button
                  type="button"
                  className="btn-close btn-sm"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              {/* Order Specs */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Produce:</span>
                    <strong className="text-dark fs-6">{selectedOrder.crop}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Total Quantity:</span>
                    <strong className="text-success font-monospace fs-6">{selectedOrder.quantity} kg</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Total Amount:</span>
                    <strong className="text-primary font-monospace fs-6">₹{Number(selectedOrder.amount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 bg-light rounded-3">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Delivery Target:</span>
                    <strong className="text-dark fs-6">{selectedOrder.deliveryDate || 'Within 48 Hours'}</strong>
                  </div>
                </div>
              </div>

              {/* Multi-Farmer Order Breakdown with Unmasked Contacts */}
              <div className="mb-3">
                <h4 className="fs-6 fw-bold text-dark mb-2 d-flex align-items-center gap-1.5">
                  <i className="bi bi-people-fill text-primary"></i>
                  <span>{t('farmerBreakdownTitle')} &amp; Direct Contacts</span>
                </h4>

                <div className="d-flex flex-column gap-2 mb-3">
                  {selectedOrder.farmerBreakdown && selectedOrder.farmerBreakdown.length > 0 ? (
                    selectedOrder.farmerBreakdown.map((item, idx) => {
                      const farmerPhone = item.phone || '+91 98421 77234';
                      const cleanPhone = farmerPhone.replace(/[^0-9]/g, '');
                      return (
                        <div key={idx} className="p-3 rounded-3 border bg-light small">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                            <div>
                              <strong className="text-dark d-block fs-6">
                                {item.fullName || item.farmer}
                              </strong>
                              <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                                📍 {item.address || `${item.location || 'Dindigul'}, Tamil Nadu`}
                              </span>
                            </div>

                            <div className="text-end">
                              <span className="badge bg-success-subtle text-success font-monospace fs-6">
                                {item.qty} kg
                              </span>
                              <span className="text-muted small d-block">
                                @ ₹{item.price}/kg = <strong className="text-dark">₹{(item.qty * item.price).toLocaleString('en-IN')}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Contact buttons */}
                          <div className="d-flex align-items-center gap-2 pt-1 border-top mt-2">
                            <a
                              href={`tel:${farmerPhone}`}
                              className="btn btn-xs btn-outline-primary rounded-pill px-2.5 py-0.5 fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
                              style={{ fontSize: '0.74rem' }}
                            >
                              <i className="bi bi-telephone-fill"></i>
                              <span>{farmerPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hello ${item.fullName || item.farmer}, regarding Order #${selectedOrder.id} for ${item.qty}kg ${selectedOrder.crop}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-xs btn-outline-success rounded-pill px-2.5 py-0.5 fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
                              style={{ fontSize: '0.74rem' }}
                            >
                              <i className="bi bi-whatsapp"></i>
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 rounded-3 border bg-light small">
                      <div className="d-flex justify-content-between">
                        <strong className="text-dark">Ravi Farms (R. Ravi)</strong>
                        <span className="text-success font-monospace fw-bold">{selectedOrder.quantity} kg</span>
                      </div>
                      <span className="text-muted small">South Street, Reddiarchatram, Dindigul - 624622</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Hub Information */}
              <div className="p-3 bg-light rounded-3 mb-4 small text-muted">
                <div className="d-flex justify-content-between mb-1">
                  <span>Destination Hub:</span>
                  <strong className="text-dark">{selectedOrder.location || 'Dindigul Central Hub'}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Transit Status:</span>
                  <strong className="text-success">Consignment Verified & Scheduled</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1.5"
                  onClick={() => handleMessageFarmers(selectedOrder)}
                >
                  <i className="bi bi-chat-dots-fill"></i>
                  <span>{t('messageFarmersBtn')}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill px-4"
                  onClick={() => setSelectedOrder(null)}
                >
                  {language === 'ta' ? 'மூடு' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
