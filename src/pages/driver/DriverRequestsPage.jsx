/**
 * Driver Delivery Requests Page
 * Route: /driver/requests
 * Shows available farm-to-depot delivery opportunities with payouts, distance, and 1-click acceptance.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverLayout from '../../components/driver/DriverLayout';
import DriverRequestsCarousel from '../../components/driver/DriverRequestsCarousel';
import { AVAILABLE_REQUESTS, DRIVER_PROFILE } from '../../data/driverData';
import deliveryService from '../../services/deliveryService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function DriverRequestsPage() {
  const [requests, setRequests] = useState(AVAILABLE_REQUESTS);
  const [filter, setFilter] = useState('ALL');
  const [acceptedId, setAcceptedId] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();

  // Load available deliveries from backend
  useEffect(() => {
    let isMounted = true;
    async function loadRequests() {
      try {
        const live = await deliveryService.getAvailableDeliveries();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          const mapped = live.map((d, index) => ({
            id: d.id || `REQ-DRV-${101 + index}`,
            orderId: d.orderId || d.id || `ORD-${1028 + index}`,
            crop: d.products?.[0]?.name || d.crop || 'Farm Harvest Lot',
            tamilCrop: d.products?.[0]?.tamilName || d.tamilCrop || 'விவசாய விளைச்சல்',
            farmer: d.farmer?.name || 'Farmer',
            farmLocation: d.farmer?.address || 'Oddanchatram Vegetable Yard, Dindigul',
            buyer: d.buyer?.name || 'Central Supermarket Depot',
            dropLocation: d.buyer?.address || 'Mattuthavani Central Market, Madurai',
            weight: `${d.totalWeight || 350} kg`,
            crates: d.totalCrates || 14,
            distance: `${d.distance || 45} km`,
            pickupTime: 'Today, Available Now',
            payout: Number(d.payout || 2450),
            vehicleRequired: d.vehicle?.type || 'Tata Ace / Bolero Pickup',
            temperature: d.isTemperatureControlled ? 'Cold-Chain (14-16°C)' : 'Ventilated Crate Transport',
            status: d.status || 'AVAILABLE'
          }));
          setRequests(mapped);
        }
      } catch (e) {
        console.warn('Error loading driver available requests:', e);
      }
    }
    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  // Read driver profile for personal greeting
  const [driverProfile, setDriverProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_profile_data');
      return saved ? JSON.parse(saved) : (user || DRIVER_PROFILE);
    } catch {
      return user || DRIVER_PROFILE;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_profile_data');
      if (saved) setDriverProfile(JSON.parse(saved));
      else if (user) setDriverProfile(user);
    } catch {}
  }, [user]);

  const handleAcceptRequest = async (req) => {
    setAcceptedId(req.id);
    try {
      await deliveryService.createDelivery({
        orderId: req.orderId,
        crop: req.crop,
        weight: parseInt(req.weight) || 350,
        crates: req.crates || 14,
        distance: parseFloat(req.distance) || 25,
        status: 'ACCEPTED',
        farmerName: req.farmer,
        pickupLocation: req.farmLocation,
        buyerName: req.buyer,
        dropoffLocation: req.dropLocation
      });
    } catch (e) {
      console.warn('Accept delivery error:', e);
    }

    setTimeout(() => {
      navigate(`/driver/routes/${req.orderId}`);
    }, 400);
  };

  const handleDeclineRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-emerald-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-4 shadow-xs">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                <span className="badge bg-amber-100 text-amber-900 border border-amber-300/80 rounded-pill px-3 py-1 text-xs font-bold d-inline-flex align-items-center gap-1.5">
                  <span>☀️</span> {language === 'ta' ? 'இயக்க மையம்' : 'Logistics Dispatch Terminal'}
                </span>
                <span className="text-muted small">
                  • {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
              </div>
              <h1 className="fw-extrabold text-dark fs-3 fs-sm-2 mb-1">
                {language === 'ta'
                  ? `காலை வணக்கம், ${driverProfile?.tamilName || driverProfile?.name || 'ராஜ்குமார்'}!`
                  : `Good Morning, ${driverProfile?.name || 'Raj Kumar'}!`}
              </h1>
              <p className="text-muted small mb-0">
                {language === 'ta'
                  ? 'இன்றைய விவசாயிகளிடமிருந்து புதிய டெலிவரி கோரிக்கைகள் மற்றும் சரக்குகள் தயாராக உள்ளன.'
                  : 'Here are your dispatch opportunities and active farm produce consignments ready for pickup.'}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-bold">
                <i className="bi bi-broadcast me-1"></i> {requests.length} {language === 'ta' ? 'அருகிலுள்ள கோரிக்கைகள்' : 'Available Nearby'}
              </span>
            </div>
          </div>
        </div>

        {/* Smooth Dispatch Opportunities Carousel */}
        <DriverRequestsCarousel
          requests={requests}
          onAcceptRequest={handleAcceptRequest}
        />

        {/* Filter Pills */}
        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-1">
          {['ALL', 'HIGH_PAYOUT', 'LOCAL_DINDIGUL'].map((f) => (
            <button
              key={f}
              type="button"
              className={`drv-btn drv-btn-sm ${filter === f ? 'drv-btn-amber' : 'drv-btn-outline'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'ALL' && 'All Nearby Requests'}
              {f === 'HIGH_PAYOUT' && 'High Payout (₹2,000+)'}
              {f === 'LOCAL_DINDIGUL' && 'Dindigul Hubs'}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="drv-card p-5 text-center my-4 border-2" style={{ borderStyle: 'dashed' }}>
            <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
            <h3 className="fs-5 fw-bold text-dark">No more requests available right now</h3>
            <p className="text-muted small mb-3">You will receive an audible dispatch chime when new consignments are posted by FPOs.</p>
            <button
              type="button"
              className="drv-btn drv-btn-outline"
              onClick={() => setRequests(AVAILABLE_REQUESTS)}
            >
              Reload Sample Opportunities
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="drv-card border-start border-4 border-warning shadow-xs"
              >
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-light text-dark font-monospace border small">
                        {req.id}
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="badge bg-warning-subtle text-warning-emphasis small">
                        <i className="bi bi-clock me-1"></i> Pickup: {req.pickupTime}
                      </span>
                      <span className="badge bg-info-subtle text-info-emphasis small d-none d-sm-inline-block">
                        {req.temperature}
                      </span>
                    </div>
                    <h2 className="fs-5 fw-bold text-dark mb-0">
                      {req.crop} <span className="text-muted fs-6 fw-normal">({req.tamilCrop})</span>
                    </h2>
                  </div>

                  <div className="text-md-end">
                    <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                      DRIVER ESTIMATED PAYOUT
                    </span>
                    <strong className="fs-3 text-success font-monospace">
                      ₹{req.payout.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Locations Grid */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="text-muted small fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-success"></i>
                        <span>Pickup Location</span>
                      </div>
                      <div className="fw-bold text-dark">{req.farmer}</div>
                      <div className="text-muted small">{req.farmLocation}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="text-muted small fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-shop text-primary"></i>
                        <span>Drop Location</span>
                      </div>
                      <div className="fw-bold text-dark">{req.buyer}</div>
                      <div className="text-muted small">{req.dropLocation}</div>
                    </div>
                  </div>
                </div>

                {/* Specs Row & Actions */}
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-2 border-top">
                  <div className="d-flex align-items-center gap-3 text-muted small flex-wrap">
                    <span>
                      <i className="bi bi-box-seam me-1 text-warning"></i>
                      <strong>{req.weight}</strong> ({req.crates} crates)
                    </span>
                    <span>•</span>
                    <span>
                      <i className="bi bi-signpost me-1 text-primary"></i>
                      <strong>{req.distance}</strong> route
                    </span>
                    <span>•</span>
                    <span>
                      <i className="bi bi-truck me-1 text-secondary"></i>
                      {req.vehicleRequired}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
                    <button
                      type="button"
                      className="drv-btn drv-btn-outline flex-grow-1 flex-sm-grow-0"
                      onClick={() => handleDeclineRequest(req.id)}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      className="drv-btn drv-btn-primary flex-grow-1 flex-sm-grow-0"
                      disabled={acceptedId === req.id}
                      onClick={() => handleAcceptRequest(req)}
                    >
                      {acceptedId === req.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Accept Consignment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DriverLayout>
  );
}
