/**
 * Delivery Service with Axios API Client & Fallback Persistence
 * Naam Uzhavar / FarmDirect Platform
 */

import axios from 'axios';
import { INITIAL_DELIVERIES, DELIVERY_STATUSES } from '../data/driverData';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'naam_uzhavar_driver_deliveries';

// Create Axios Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Helper: Get cached deliveries or initialize from seeds
function getStoredDeliveries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
      return INITIAL_DELIVERIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DELIVERIES;
  } catch (err) {
    console.warn('localStorage error, using memory seeds:', err);
    return INITIAL_DELIVERIES;
  }
}

// Helper: Save deliveries to cache
function saveStoredDeliveries(deliveries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

/**
 * Delivery Service API Layer
 */
export const deliveryService = {
  /**
   * Fetch active consignment for the current logged in driver
   * GET /api/drivers/active-delivery
   */
  async getActiveDelivery() {
    try {
      const response = await apiClient.get('/drivers/active-delivery');
      if (response.data && response.data.delivery) {
        return response.data.delivery;
      }
    } catch (apiError) {
      // Graceful fallback to mock data when backend is not running
      // console.info('Backend unavailable, using cached mock delivery:', apiError.message);
    }

    // Local Mock / Fallback Resolver
    await new Promise((res) => setTimeout(res, 250)); // simulate quick network latency
    const deliveries = getStoredDeliveries();
    
    // Find delivery that is active (in transit, picked up, going to pickup, or assigned)
    const active =
      deliveries.find(
        (d) =>
          d.status !== DELIVERY_STATUSES.DELIVERED &&
          d.status !== DELIVERY_STATUSES.CANCELLED
      ) || deliveries[0];

    if (!active) {
      throw new Error('No active delivery found for this driver.');
    }

    return active;
  },

  /**
   * Fetch specific delivery by ID
   * GET /api/deliveries/:deliveryId
   */
  async getDeliveryById(deliveryId) {
    if (!deliveryId) throw new Error('Delivery ID is required');

    try {
      const response = await apiClient.get(`/deliveries/${deliveryId}`);
      if (response.data && response.data.delivery) {
        return response.data.delivery;
      }
    } catch (apiError) {
      // Fallback to local storage
    }

    await new Promise((res) => setTimeout(res, 200));
    const deliveries = getStoredDeliveries();
    const cleanId = String(deliveryId).trim().toLowerCase();
    
    const found = deliveries.find(
      (d) =>
        String(d.id).toLowerCase() === cleanId ||
        String(d.trackingNumber).toLowerCase() === cleanId
    );

    if (!found) {
      // Fallback: return default if it's the primary seed
      const def = deliveries.find((d) => d.id === 'ORD-1024') || deliveries[0];
      if (def) return def;
      throw new Error(`Delivery lot "${deliveryId}" could not be located.`);
    }

    return found;
  },

  /**
   * Fetch all deliveries assigned to driver (active and historical)
   * GET /api/deliveries
   */
  async getAllDeliveries() {
    try {
      const response = await apiClient.get('/deliveries');
      if (response.data && Array.isArray(response.data.deliveries)) {
        return response.data.deliveries;
      }
    } catch {
      // Fallback
    }

    await new Promise((res) => setTimeout(res, 150));
    return getStoredDeliveries();
  },

  /**
   * Update delivery status
   * PATCH /api/deliveries/:deliveryId/status
   */
  async updateDeliveryStatus(deliveryId, newStatus, extraData = {}) {
    if (!deliveryId) throw new Error('Delivery ID is required');
    if (!newStatus) throw new Error('New status is required');

    try {
      const response = await apiClient.patch(`/deliveries/${deliveryId}/status`, {
        status: newStatus,
        ...extraData
      });
      if (response.data && response.data.delivery) {
        return response.data.delivery;
      }
    } catch {
      // Fallback
    }

    // Update in localStorage
    await new Promise((res) => setTimeout(res, 300));
    const deliveries = getStoredDeliveries();
    let updatedItem = null;

    const updatedList = deliveries.map((item) => {
      if (
        String(item.id).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item.trackingNumber).toLowerCase() === String(deliveryId).toLowerCase()
      ) {
        const now = new Date().toISOString();
        let timestamps = {};

        if (newStatus === DELIVERY_STATUSES.ACCEPTED) timestamps.acceptedAt = now;
        if (newStatus === DELIVERY_STATUSES.PICKED_UP) timestamps.pickupCompletedAt = now;
        if (newStatus === DELIVERY_STATUSES.DELIVERED) timestamps.deliveredAt = now;

        updatedItem = {
          ...item,
          status: newStatus,
          ...timestamps,
          ...extraData
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      throw new Error(`Delivery "${deliveryId}" not found for update.`);
    }

    saveStoredDeliveries(updatedList);
    return updatedItem;
  },

  /**
   * Submit Proof of Delivery (Photo, Receiver Name, Signature)
   * POST /api/deliveries/:deliveryId/proof
   */
  async submitDeliveryProof(deliveryId, proofData) {
    if (!deliveryId) throw new Error('Delivery ID is required');

    try {
      const response = await apiClient.post(`/deliveries/${deliveryId}/proof`, proofData);
      if (response.data && response.data.delivery) {
        return response.data.delivery;
      }
    } catch {
      // Fallback
    }

    await new Promise((res) => setTimeout(res, 400));
    const deliveries = getStoredDeliveries();
    let updatedItem = null;
    const now = new Date().toISOString();

    const updatedList = deliveries.map((item) => {
      if (
        String(item.id).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item.trackingNumber).toLowerCase() === String(deliveryId).toLowerCase()
      ) {
        updatedItem = {
          ...item,
          status: DELIVERY_STATUSES.DELIVERED,
          deliveredAt: now,
          proofOfDelivery: {
            receiverName: proofData.receiverName || item.buyer.receiverName || 'Receiver',
            signature: proofData.signature || null,
            photoUrl: proofData.photoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
            notes: proofData.notes || 'Consignment handed over in good condition. All crates verified.',
            timestamp: now
          }
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      throw new Error(`Delivery "${deliveryId}" not found for proof upload.`);
    }

    saveStoredDeliveries(updatedList);
    return updatedItem;
  },

  /**
   * Reset demonstration delivery data back to initial state
   */
  resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
    return INITIAL_DELIVERIES;
  }
};

export default deliveryService;
