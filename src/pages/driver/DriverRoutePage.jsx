/**
 * Driver Route Management Page Controller
 * Production-ready driver route view with realistic map, progress tracking,
 * cargo information, pickup/drop cards, proof of delivery, and responsive layouts.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DriverLayout from '../../components/driver/DriverLayout';
import RouteHeader from '../../components/driver/RouteHeader';
import RouteSummary from '../../components/driver/RouteSummary';
import RouteMap from '../../components/driver/RouteMap';
import DeliveryProgress from '../../components/driver/DeliveryProgress';
import PickupCard from '../../components/driver/PickupCard';
import DropCard from '../../components/driver/DropCard';
import CargoCard from '../../components/driver/CargoCard';
import RouteStats from '../../components/driver/RouteStats';
import DeliveryActions from '../../components/driver/DeliveryActions';
import DeliveryProofModal from '../../components/driver/DeliveryProofModal';
import RouteSkeleton from '../../components/driver/RouteSkeleton';
import RouteEmptyState from '../../components/driver/RouteEmptyState';
import deliveryService from '../../services/deliveryService';
import { DELIVERY_STATUSES } from '../../data/driverData';

export default function DriverRoutePage() {
  const { deliveryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const activeTab = searchParams.get('tab') || 'route';

  // Show temporary toast notification
  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Fetch Delivery Data
  const loadDelivery = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let data = null;
      if (deliveryId) {
        data = await deliveryService.getDeliveryById(deliveryId);
      } else {
        data = await deliveryService.getActiveDelivery();
      }
      setDelivery(data);
    } catch (err) {
      console.error('Failed to load delivery route:', err);
      setError(err.message || 'The delivery information could not be retrieved.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    loadDelivery();
  }, [loadDelivery]);

  // Status transition handler
  const handleStatusUpdate = async (newStatus) => {
    if (!delivery) return;
    setIsUpdating(true);
    try {
      const updated = await deliveryService.updateDeliveryStatus(delivery.id, newStatus);
      setDelivery(updated);
      showToast(`Status updated: ${newStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'danger');
    } finally {
      setIsUpdating(false);
    }
  };

  // Proof submission handler
  const handleProofSubmit = async (proofData) => {
    if (!delivery) return;
    setIsUpdating(true);
    try {
      const updated = await deliveryService.submitDeliveryProof(delivery.id, proofData);
      setDelivery(updated);
      setShowProofModal(false);
      showToast('Delivery completed! Receipt and e-Way bill generated.');
    } catch (err) {
      showToast(err.message || 'Failed to submit proof', 'danger');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle driver online status
  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      showToast(next ? 'You are now Online and visible to dispatchers.' : 'You are now Offline. Pausing incoming jobs.');
      return next;
    });
  };

  // Reset demo data
  const handleResetDemo = () => {
    const list = deliveryService.resetDemoData();
    setDelivery(list[0]);
    showToast('Demo consignment #ORD-1024 reloaded.');
    navigate('/driver/routes/ORD-1024');
  };

  return (
    <DriverLayout
      activeDeliveryId={delivery?.id}
      onRefresh={() => loadDelivery(true)}
      isOnline={isOnline}
      onToggleOnline={handleToggleOnline}
    >
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`alert alert-${toastMessage.type} position-fixed top-4 start-50 translate-middle-x shadow-lg border d-flex align-items-center gap-2 py-2 px-4 rounded-pill`}
          style={{ zIndex: 1300, top: '80px' }}
        >
          <i className={`bi ${toastMessage.type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`}></i>
          <span className="fw-semibold small">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. LOADING STATE */}
      {loading ? (
        <RouteSkeleton />
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="drv-card p-5 text-center my-4 border-danger">
          <div
            className="rounded-circle bg-danger-subtle text-danger mx-auto d-flex align-items-center justify-content-center mb-3"
            style={{ width: '70px', height: '70px' }}
          >
            <i className="bi bi-exclamation-octagon-fill fs-2"></i>
          </div>
          <h2 className="fs-4 fw-bold text-dark mb-2">Unable to load route</h2>
          <p className="text-muted max-w-md mx-auto mb-4" style={{ maxWidth: '400px' }}>
            {error}
          </p>
          <button
            type="button"
            className="drv-btn drv-btn-primary"
            onClick={() => loadDelivery()}
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Try Again</span>
          </button>
        </div>
      ) : !delivery ? (
        /* 3. EMPTY STATE */
        <RouteEmptyState onResetDemo={handleResetDemo} />
      ) : (
        /* 4. MAIN ROUTE CONTENT */
        <div className="w-100">
          {/* Header Bar */}
          <RouteHeader
            delivery={delivery}
            onRefresh={() => loadDelivery(true)}
            isRefreshing={isRefreshing}
          />

          {/* Top Level Summary Card */}
          <RouteSummary delivery={delivery} />

          {/* Desktop & Mobile Main Section */}
          <div className="row g-4 mb-4">
            {/* Left Column (Desktop 60%): Interactive Map + Progress Tracker + Cargo Card */}
            <div className="col-12 col-lg-7">
              {/* Interactive Route Map */}
              <RouteMap delivery={delivery} />

              {/* Progress Milestones Tracker */}
              <DeliveryProgress currentStatus={delivery.status} />

              {/* Delivery Cargo Card (Moved to Left Side) */}
              <CargoCard delivery={delivery} />

              {/* Vehicle Telemetry & Trip Stats */}
              <RouteStats delivery={delivery} />
            </div>

            {/* Right Column (Desktop 40%): Action Hub, Pickup & Drop Cards */}
            <div className="col-12 col-lg-5">
              {/* Primary Action Hub (Desktop Box) */}
              <DeliveryActions
                delivery={delivery}
                onStatusUpdate={handleStatusUpdate}
                onOpenProofModal={() => setShowProofModal(true)}
                isUpdating={isUpdating}
              />

              {/* Pickup Farm Card */}
              <PickupCard
                delivery={delivery}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
              />

              {/* Drop Destination Card */}
              <DropCard
                delivery={delivery}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. PROOF OF DELIVERY MODAL */}
      <DeliveryProofModal
        show={showProofModal}
        onClose={() => setShowProofModal(false)}
        delivery={delivery}
        onSubmitProof={handleProofSubmit}
        isSubmitting={isUpdating}
      />
    </DriverLayout>
  );
}
