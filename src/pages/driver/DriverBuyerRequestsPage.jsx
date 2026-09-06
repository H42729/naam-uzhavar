/**
 * DriverBuyerRequestsPage Component
 * Route: /driver/buyer-requests
 * Displays incoming logistics & transport requests submitted by buyers.
 * Shows:
 * - How many kg product (e.g., 350 kg)
 * - Product name (e.g., Tomato, Small Onion)
 * - Buyer name (e.g., FreshMart Procurement)
 * - Location (Farmer pickup location & Buyer drop location)
 * - Action buttons: Accept and Decline
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DriverLayout from '../../components/driver/DriverLayout';
import { useLanguage } from '../../context/LanguageContext';
import deliveryService from '../../services/deliveryService';
import {
  ShoppingBag,
  MapPin,
  Truck,
  Weight,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react';

const INITIAL_BUYER_LOGISTICS_REQUESTS = [
  {
    id: 'BREQ-101',
    productName: 'Hybrid Red Tomato',
    productTamilName: 'ஹைப்ரிட் தக்காளி',
    quantityKg: 350,
    productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    buyerName: 'FreshMart Procurement',
    buyerContact: 'R. Kumar',
    buyerPhone: '+91 98765 43210',
    farmerName: 'Arun Kumar',
    pickupLocation: 'Arun Organic Farm, Survey 42, Nilakottai Belt, Dindigul',
    dropLocation: 'FreshMart Central Receiving Yard, Dindigul Central Market',
    distanceKm: 28,
    estimatedTime: '45 mins',
    payout: 1450,
    vehicleRequired: 'Tata Ace / 750 kg Mini Truck',
    requestedTime: 'Today, 08:30 AM',
    urgency: 'Immediate Dispatch',
    status: 'Pending'
  },
  {
    id: 'BREQ-102',
    productName: 'Small Onion (Shallots)',
    productTamilName: 'சின்ன வெங்காயம்',
    quantityKg: 500,
    productImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80',
    buyerName: 'Madurai Hypermarket',
    buyerContact: 'S. Murugesan',
    buyerPhone: '+91 98421 77310',
    farmerName: 'M. Palanisamy',
    pickupLocation: 'Oddanchatram Vegetable Yard, Dindigul',
    dropLocation: 'Mattuthavani Central Wholesale Depot, Madurai',
    distanceKm: 72,
    estimatedTime: '1 hr 35 mins',
    payout: 2650,
    vehicleRequired: 'Mahindra Bolero Pickup / 1.2 Ton',
    requestedTime: 'Today, 09:15 AM',
    urgency: 'Scheduled 11:00 AM',
    status: 'Pending'
  },
  {
    id: 'BREQ-103',
    productName: 'Fresh Mountain Carrot & Beetroot',
    productTamilName: 'மலைக் கேரட் & பீட்ரூட்',
    quantityKg: 280,
    productImage: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80',
    buyerName: 'Kovai Agro Wholesalers',
    buyerContact: 'V. Sundaram',
    buyerPhone: '+91 94432 18890',
    farmerName: 'K. Chinnasamy',
    pickupLocation: 'Kodaikanal Foothill Cluster, Batlagundu, Dindigul',
    dropLocation: 'RS Puram Produce Terminal, Coimbatore',
    distanceKm: 145,
    estimatedTime: '3 hrs 15 mins',
    payout: 3800,
    vehicleRequired: 'Tata Ace Super / Ventilated Crates',
    requestedTime: 'Today, 10:00 AM',
    urgency: 'Urgent Same-Day',
    status: 'Pending'
  },
  {
    id: 'BREQ-104',
    productName: 'Banana (Robusta Clusters)',
    productTamilName: 'ரோபஸ்டா வாழைப்பழம்',
    quantityKg: 450,
    productImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    buyerName: 'Selvam Organic Superstore',
    buyerContact: 'P. Selvam',
    buyerPhone: '+91 98421 99012',
    farmerName: 'Subramanian R.',
    pickupLocation: 'Palani Green Valley Farm, Dindigul',
    dropLocation: 'Dindigul Bypass Cold Storage Receiving Dock',
    distanceKm: 34,
    estimatedTime: '50 mins',
    payout: 1850,
    vehicleRequired: 'Pickup Carrier / Crates',
    requestedTime: 'Today, 10:45 AM',
    urgency: 'Standard Delivery',
    status: 'Pending'
  },
  {
    id: 'BREQ-105',
    productName: 'Country Brinjal & Drumstick',
    productTamilName: 'நாட்டு கத்தரிக்காய் & முருங்கை',
    quantityKg: 600,
    productImage: '/images/brinjal.jpg',
    buyerName: 'Trichy Wholesale Aggregators',
    buyerContact: 'A. Thangaraj',
    buyerPhone: '+91 97860 44219',
    farmerName: 'K. Ramanathan',
    pickupLocation: 'Reddiarchatram Farmers Cluster, Dindigul',
    dropLocation: 'Gandhi Market Wholesale Shed 4, Trichy',
    distanceKm: 98,
    estimatedTime: '2 hrs 10 mins',
    payout: 3200,
    vehicleRequired: 'Bolero Maxi Truck / 1.2 Ton',
    requestedTime: 'Today, 11:30 AM',
    urgency: 'Evening Market Delivery',
    status: 'Pending'
  }
];

export default function DriverBuyerRequestsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Requests state with localStorage persistence
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_buyer_requests');
      return saved ? JSON.parse(saved) : INITIAL_BUYER_LOGISTICS_REQUESTS;
    } catch {
      return INITIAL_BUYER_LOGISTICS_REQUESTS;
    }
  });

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [actionAlert, setActionAlert] = useState(null);

  // Save changes to localStorage
  const saveRequests = (updated) => {
    setRequests(updated);
    try {
      localStorage.setItem('naam_uzhavar_driver_buyer_requests', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Handle Accept Request
  const handleAccept = async (req) => {
    const updated = requests.map((item) =>
      item.id === req.id ? { ...item, status: 'Accepted' } : item
    );
    saveRequests(updated);

    try {
      await deliveryService.createDelivery({
        orderId: `ORD-${req.id.replace('BREQ-', '3')}`,
        crop: req.productName,
        weight: req.quantityKg,
        crates: Math.ceil(req.quantityKg / 25),
        distance: req.distanceKm || 28,
        status: 'ACCEPTED',
        farmerName: req.farmerName,
        pickupLocation: req.pickupLocation,
        buyerName: req.buyerName,
        dropoffLocation: req.dropLocation
      });
    } catch (err) {
      console.warn('Error creating delivery on backend:', err);
    }

    setActionAlert({
      type: 'success',
      message:
        language === 'ta'
          ? `${req.buyerName} கோரிக்கை (${req.quantityKg} kg ${req.productTamilName}) ஏற்கப்பட்டது! நடப்பு பயணத்தில் சேர்க்கப்பட்டுள்ளது.`
          : `Request accepted for ${req.buyerName} (${req.quantityKg} kg ${req.productName})! Added to your active trip.`,
      acceptedReqId: req.id
    });

    setTimeout(() => {
      setActionAlert((prev) => (prev?.acceptedReqId === req.id ? null : prev));
    }, 6000);
  };

  // Handle Decline Request
  const handleDecline = (req) => {
    const updated = requests.map((item) =>
      item.id === req.id ? { ...item, status: 'Declined' } : item
    );
    saveRequests(updated);

    setActionAlert({
      type: 'warning',
      message:
        language === 'ta'
          ? `${req.buyerName} கோரிக்கை (${req.quantityKg} kg) நிராகரிக்கப்பட்டது.`
          : `Request from ${req.buyerName} for ${req.quantityKg} kg has been declined.`
    });

    setTimeout(() => setActionAlert(null), 4000);
  };

  // Filtered requests based on active tab
  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'PENDING') return r.status === 'Pending';
    if (activeFilter === 'ACCEPTED') return r.status === 'Accepted';
    if (activeFilter === 'DECLINED') return r.status === 'Declined';
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'Accepted').length;
  const totalVolumeKg = requests
    .filter((r) => r.status === 'Accepted')
    .reduce((sum, r) => sum + r.quantityKg, 0);

  return (
    <DriverLayout>
      <div className="w-100">
        {/* ===================================================================
            1. PAGE HEADER BAR
            =================================================================== */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase d-flex items-center gap-1.5" style={{ letterSpacing: '0.05em' }}>
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'வாங்குபவர் சரக்கு எடுப்பு கோரிக்கைகள்' : 'Buyer Logistics Dispatch'}</span>
            </div>
            <h1 className="fw-extrabold text-dark fs-3 mb-0">
              {language === 'ta' ? 'வாங்குபவர் கோரிக்கைகள்' : 'Buyer Requests'}
            </h1>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-3 py-2 rounded-pill fw-bold font-monospace">
              <i className="bi bi-broadcast me-1"></i> {pendingCount} {language === 'ta' ? 'புதிய கோரிக்கைகள்' : 'New Pending'}
            </span>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionAlert && (
          <div
            className={`alert ${
              actionAlert.type === 'success' ? 'alert-success border-success' : 'alert-warning border-warning'
            } d-flex align-items-center justify-content-between gap-3 mb-4 rounded-3 shadow-xs animate-fade-in`}
          >
            <div className="d-flex align-items-center gap-2">
              {actionAlert.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-warning flex-shrink-0" />
              )}
              <span className="fw-semibold text-dark">{actionAlert.message}</span>
            </div>
            {actionAlert.acceptedReqId && (
              <Link
                to="/driver/active"
                className="btn btn-sm btn-success rounded-pill px-3 py-1 fw-bold text-white d-inline-flex items-center gap-1 flex-shrink-0"
              >
                <span>{language === 'ta' ? 'நடப்பு பாதை காண்க' : 'View Active Route'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* ===================================================================
            2. KPI SUMMARY METRIC TILES
            =================================================================== */}
        <div className="row g-2 g-sm-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="p-3 bg-white rounded-3 border shadow-2xs d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-muted small d-block">{language === 'ta' ? 'நிலுவையில் உள்ளவை' : 'Pending Requests'}</span>
                <strong className="fs-5 text-dark font-monospace">{pendingCount}</strong>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="p-3 bg-white rounded-3 border shadow-2xs d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-muted small d-block">{language === 'ta' ? 'ஏற்கப்பட்டவை' : 'Accepted Requests'}</span>
                <strong className="fs-5 text-emerald-700 font-monospace">{acceptedCount}</strong>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="p-3 bg-white rounded-3 border shadow-2xs d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Weight className="w-5 h-5" />
              </div>
              <div>
                <span className="text-muted small d-block">{language === 'ta' ? 'ஏற்கப்பட்ட அளவு' : 'Total Accepted Volume'}</span>
                <strong className="fs-5 text-dark font-monospace">{totalVolumeKg.toLocaleString()} kg</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. FILTER TABS
            =================================================================== */}
        <div className="d-flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'ALL', label: language === 'ta' ? 'அனைத்தும்' : 'All Requests', count: requests.length },
            { key: 'PENDING', label: language === 'ta' ? 'நிலுவை' : 'Pending', count: pendingCount },
            { key: 'ACCEPTED', label: language === 'ta' ? 'ஏற்கப்பட்டது' : 'Accepted', count: acceptedCount },
            { key: 'DECLINED', label: language === 'ta' ? 'நிராகரிக்கப்பட்டது' : 'Declined', count: requests.filter((r) => r.status === 'Declined').length }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all border d-inline-flex items-center gap-2 ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full text-xs px-2 py-0.5 font-bold ${
                  activeFilter === tab.key ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ===================================================================
            4. BUYER REQUESTS CARDS LIST
            =================================================================== */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white p-5 text-center my-4 border rounded-4 shadow-2xs">
            <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark mb-1">
              {language === 'ta' ? 'கோரிக்கைகள் எதுவும் இல்லை' : 'No buyer requests in this view'}
            </h3>
            <p className="text-muted small mb-3">
              {language === 'ta'
                ? 'வாங்குபவர்களிடமிருந்து புதிய சரக்கு கோரிக்கைகள் வரும்போது இங்கே தோன்றும்.'
                : 'When buyers submit new transport and pickup requests, they will appear here.'}
            </p>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold"
              onClick={() => {
                saveRequests(INITIAL_BUYER_LOGISTICS_REQUESTS);
                setActiveFilter('ALL');
              }}
            >
              {language === 'ta' ? 'மாதிரி கோரிக்கைகளை மீட்டமை' : 'Reset Sample Requests'}
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filteredRequests.map((req) => {
              const isAccepted = req.status === 'Accepted';
              const isDeclined = req.status === 'Declined';
              const isPending = req.status === 'Pending';

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-3 border p-3 p-sm-4 shadow-2xs transition-all ${
                    isAccepted ? 'border-success' : isDeclined ? 'border-slate-200 opacity-75' : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {/* Card Header: Product, KG & Status Badge */}
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                      {/* Product Thumbnail */}
                      <img
                        src={req.productImage}
                        alt={req.productName}
                        className="rounded-3 object-fit-cover shadow-2xs flex-shrink-0"
                        style={{ width: '56px', height: '56px', border: '1px solid #e2e8f0' }}
                      />

                      <div>
                        {/* Product Name & Quantity in KG */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <h2 className="fs-5 fw-bold text-dark mb-0">
                            {language === 'ta' ? req.productTamilName : req.productName}
                          </h2>
                          <span className="badge bg-primary text-white rounded-pill px-3 py-1 font-monospace fs-6 fw-bold">
                            {req.quantityKg} kg
                          </span>
                        </div>
                        <div className="text-muted small mt-0.5">
                          <span>Req ID: <strong className="font-monospace text-slate-700">{req.id}</strong></span>
                          <span className="mx-1.5">•</span>
                          <span>{req.urgency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payout & Status */}
                    <div className="d-flex align-items-center gap-2 sm:text-end w-100 sm:w-auto justify-content-between sm:justify-content-end">
                      <div>
                        <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                          {language === 'ta' ? 'சரக்குக் கட்டணம்' : 'OFFERED FARE'}
                        </span>
                        <strong className="fs-4 text-success font-monospace">
                          ₹{req.payout.toLocaleString()}
                        </strong>
                      </div>
                      <span
                        className={`badge rounded-pill px-3 py-1.5 font-semibold text-xs ${
                          isAccepted
                            ? 'bg-success text-white'
                            : isDeclined
                            ? 'bg-secondary text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isAccepted
                          ? (language === 'ta' ? '✓ ஏற்கப்பட்டது' : '✓ Accepted')
                          : isDeclined
                          ? (language === 'ta' ? '✕ நிராகரிக்கப்பட்டது' : '✕ Declined')
                          : (language === 'ta' ? 'பதில் தேவை' : 'Awaiting Response')}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Buyer Name, Locations, Vehicle details */}
                  <div className="row g-3 mb-3">
                    {/* Buyer Information */}
                    <div className="col-12 col-md-4 border-end-md">
                      <div className="d-flex align-items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>
                            {language === 'ta' ? 'வாங்குபவர் பெயர்' : 'BUYER DETAILS'}
                          </span>
                          <strong className="text-dark d-block truncate font-semibold">
                            {req.buyerName}
                          </strong>
                          <span className="text-muted small d-block">
                            Contact: {req.buyerContact}
                          </span>
                          <a
                            href={`tel:${req.buyerPhone}`}
                            className="text-decoration-none text-primary small fw-semibold d-inline-flex items-center gap-1 mt-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{req.buyerPhone}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Location (Farmer) */}
                    <div className="col-12 col-md-4 border-end-md">
                      <div className="d-flex align-items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>
                            {language === 'ta' ? 'பண்ணை எடுக்கும் இடம்' : 'PICKUP LOCATION (FARM)'}
                          </span>
                          <strong className="text-dark d-block small mb-0.5">
                            {req.farmerName}
                          </strong>
                          <span className="text-slate-600 small d-block" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
                            {req.pickupLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Drop Location (Buyer) */}
                    <div className="col-12 col-md-4">
                      <div className="d-flex align-items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>
                            {language === 'ta' ? 'டெலிவரி சேருமிடம்' : 'DELIVERY LOCATION (BUYER)'}
                          </span>
                          <strong className="text-dark d-block small mb-0.5">
                            {req.dropLocation}
                          </strong>
                          <span className="text-muted small d-block">
                            {req.distanceKm} km • ~{req.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle requirement pill */}
                  <div className="d-flex align-items-center justify-content-between p-2.5 bg-slate-50 rounded-2xl mb-3 flex-wrap gap-2 text-xs">
                    <div className="d-flex align-items-center gap-2 text-slate-700">
                      <Truck className="w-4 h-4 text-slate-500" />
                      <span><strong>Vehicle Req:</strong> {req.vehicleRequired}</span>
                    </div>
                    <div className="text-slate-500">
                      <i className="bi bi-clock me-1"></i>
                      <span>Requested: {req.requestedTime}</span>
                    </div>
                  </div>

                  {/* =========================================================
                      TWO BUTTONS: ACCEPT AND DECLINE
                      ========================================================= */}
                  <div className="d-flex align-items-center justify-content-between gap-3 pt-2 border-top flex-wrap">
                    {isPending && (
                      <div className="d-flex align-items-center gap-2.5 w-100 sm:w-auto">
                        {/* 1. Accept Button */}
                        <button
                          type="button"
                          onClick={() => handleAccept(req)}
                          className="btn btn-success text-white rounded-pill px-4 py-2 fw-bold d-inline-flex items-center gap-2 shadow-xs transition hover:scale-102 flex-1 sm:flex-none justify-center"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'ta' ? 'ஏற்கவும்' : 'Accept Request'}</span>
                        </button>

                        {/* 2. Decline Button */}
                        <button
                          type="button"
                          onClick={() => handleDecline(req)}
                          className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold d-inline-flex items-center gap-2 transition flex-1 sm:flex-none justify-center"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{language === 'ta' ? 'நிராகரி' : 'Decline'}</span>
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                        <div className="d-flex align-items-center gap-2 text-success fw-bold small">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{language === 'ta' ? 'நீங்கள் இந்தக் கோரிக்கையை ஏற்றுக்கொண்டீர்கள்' : 'You have accepted this consignment'}</span>
                        </div>
                        <Link
                          to="/driver/active"
                          className="btn btn-primary btn-sm rounded-pill px-4 py-1.5 fw-bold d-inline-flex items-center gap-1.5"
                        >
                          <span>{language === 'ta' ? 'செயலில் உள்ள பாதை' : 'Go to Active Route'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}

                    {isDeclined && (
                      <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                        <div className="d-flex align-items-center gap-2 text-muted fw-semibold small">
                          <XCircle className="w-4 h-4 text-danger" />
                          <span>{language === 'ta' ? 'கோரிக்கை நிராகரிக்கப்பட்டது' : 'Consignment declined'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = requests.map((item) =>
                              item.id === req.id ? { ...item, status: 'Pending' } : item
                            );
                            saveRequests(updated);
                          }}
                          className="btn btn-link btn-sm text-decoration-none text-muted"
                        >
                          {language === 'ta' ? 'மீட்டமைக்க' : 'Undo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DriverLayout>
  );
}
