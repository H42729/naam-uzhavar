/**
 * Delivery Service with Axios API Client & MongoDB Persistence
 * Naam Uzhavar / FarmDirect Platform
 */

import apiClient from './apiClient.js';
import { INITIAL_DELIVERIES, DELIVERY_STATUSES, AVAILABLE_REQUESTS } from '../data/driverData.js';

const STORAGE_KEY = 'naam_uzhavar_driver_deliveries';

// Helper: Normalize delivery object for frontend components
export function normalizeDelivery(d) {
  if (!d) return null;
  const rawId = d.orderId || d.id || d._id;
  const orderId = d.orderId || (String(rawId).startsWith('ORD-') ? rawId : `ORD-${String(rawId).slice(-4)}`);
  const trackingNumber = d.trackingNumber || `TRK-NU-2026-${orderId.replace('ORD-', '')}`;

  return {
    ...d,
    id: orderId,
    _id: d._id || d.id,
    mongoId: d._id || d.id,
    orderId,
    trackingNumber,
    status: d.status || DELIVERY_STATUSES.ASSIGNED,
    assignedAt: d.assignedAt || d.createdAt || new Date().toISOString(),
    acceptedAt: d.acceptedAt || null,
    pickupCompletedAt: d.pickupCompletedAt || null,
    deliveredAt: d.deliveredAt || null,

    farmer: {
      name: d.farmer?.name || 'Arun Kumar',
      farmName: d.farmer?.businessName || d.farmer?.farmName || `${d.farmer?.name || 'Farmer'} Organic Farms`,
      phone: d.farmer?.phone || '+91 98421 88920',
      address: d.farmer?.address || 'Survey No. 42, Nilakottai Horticultural Belt, Dindigul District',
      district: d.farmer?.district || 'Dindigul',
      taluk: d.farmer?.taluk || 'Nilakottai',
      pincode: d.farmer?.pincode || '624208',
      latitude: d.farmer?.latitude || 10.165,
      longitude: d.farmer?.longitude || 77.855,
      pickupInstructions: d.farmer?.instructions || d.farmer?.pickupInstructions || 'North gate weighbridge loading bay.',
      contactPerson: d.farmer?.contactPerson || d.farmer?.name || 'Farm In-Charge'
    },

    buyer: {
      name: d.buyer?.name || 'ABC Retail',
      businessType: d.buyer?.businessName || d.buyer?.businessType || 'Institutional Supermarket Chain',
      phone: d.buyer?.phone || '+91 98765 01234',
      address: d.buyer?.address || 'Central Distribution Depot, GT Road, Dindigul',
      district: d.buyer?.district || 'Dindigul',
      taluk: d.buyer?.taluk || 'Dindigul West',
      pincode: d.buyer?.pincode || '624001',
      latitude: d.buyer?.latitude || 10.362,
      longitude: d.buyer?.longitude || 77.969,
      dropInstructions: d.buyer?.instructions || d.buyer?.dropInstructions || 'Loading bay #4 at rear.',
      receiverName: d.buyer?.receiverName || 'Sundar Rajan (Receiving Manager)'
    },

    products: Array.isArray(d.products) && d.products.length > 0
      ? d.products.map((p, idx) => ({
          id: p.id || p._id || `CRG-0${idx + 1}`,
          name: p.name || 'Produce',
          tamilName: p.tamilName || p.name || '',
          variety: p.variety || 'Grade-A Harvest',
          quantity: Number(p.quantity) || 100,
          unit: p.unit || 'kg',
          crates: Number(p.crates) || Math.ceil((Number(p.quantity) || 100) / 25),
          crateWeight: Number(p.crateWeight) || 25,
          tempRequirement: p.tempRequirement || 'Ambient / Ventilated',
          image: p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'
        }))
      : [
          {
            id: 'CRG-01',
            name: 'Produce Batch',
            tamilName: 'பயிர்',
            quantity: d.totalWeight || 150,
            unit: 'kg',
            crates: d.totalCrates || 6,
            crateWeight: 25,
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'
          }
        ],

    totalWeight: Number(d.totalWeight) || 150,
    totalCrates: Number(d.totalCrates) || 6,
    cargoVerificationCode: d.cargoVerificationCode || 'NU-SEAL-8894',
    isTemperatureControlled: !!d.isTemperatureControlled,

    distance: Number(d.distance) || 18.0,
    remainingDistance: d.remainingDistance !== undefined ? Number(d.remainingDistance) : Number(d.distance || 18.0),
    distanceToPickup: Number(d.distanceToPickup || 8.5),
    etaMinutes: Number(d.etaMinutes || 25),
    speedKmh: Number(d.speedKmh || 0),
    currentLocation: d.currentLocation || {
      name: 'NH-44 Corridor',
      latitude: 10.255,
      longitude: 77.905
    },

    vehicle: d.vehicle || {
      registrationNumber: 'TN-57-AB-4029',
      type: 'Tata Ace Super Mini-Truck',
      payloadCapacityKg: 750,
      fuelType: 'Diesel'
    },

    proofOfDelivery: d.proofOfDelivery || null
  };
}

// Helper: Get cached deliveries
function getStoredDeliveries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
      return INITIAL_DELIVERIES.map(normalizeDelivery);
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(normalizeDelivery)
      : INITIAL_DELIVERIES.map(normalizeDelivery);
  } catch (err) {
    return INITIAL_DELIVERIES.map(normalizeDelivery);
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

export const deliveryService = {
  /**
   * Fetch active consignment for the driver
   * GET /api/v1/deliveries/active
   */
  async getActiveDelivery() {
    try {
      const response = await apiClient.get('/deliveries/active');
      const data = response.data?.data || response.data?.delivery || response.data;
      if (data && (data._id || data.orderId || data.id)) {
        return normalizeDelivery(data);
      }
    } catch (apiError) {
      console.warn('Backend active delivery fetch failed, falling back:', apiError.message);
    }

    // Local / Cache fallback
    const deliveries = getStoredDeliveries();
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
   * GET /api/v1/deliveries/:deliveryId
   */
  async getDeliveryById(deliveryId) {
    if (!deliveryId) throw new Error('Delivery ID is required');

    try {
      const response = await apiClient.get(`/deliveries/${deliveryId}`);
      const data = response.data?.data || response.data?.delivery || response.data;
      if (data && (data._id || data.orderId || data.id)) {
        return normalizeDelivery(data);
      }
    } catch (apiError) {
      console.warn(`Backend delivery fetch for ${deliveryId} failed, falling back:`, apiError.message);
    }

    const deliveries = getStoredDeliveries();
    const cleanId = String(deliveryId).trim().toLowerCase();

    const found = deliveries.find(
      (d) =>
        String(d.id).toLowerCase() === cleanId ||
        String(d.orderId).toLowerCase() === cleanId ||
        String(d.trackingNumber).toLowerCase() === cleanId ||
        String(d._id).toLowerCase() === cleanId
    );

    if (found) return found;

    const def = deliveries.find((d) => d.id === 'ORD-1024') || deliveries[0];
    if (def) return def;
    throw new Error(`Delivery lot "${deliveryId}" could not be located.`);
  },

  /**
   * Fetch all deliveries assigned to driver
   * GET /api/v1/deliveries
   */
  async getAllDeliveries(filterQuery = {}) {
    try {
      const response = await apiClient.get('/deliveries', { params: filterQuery });
      const list = response.data?.data || response.data?.deliveries || response.data;
      if (Array.isArray(list) && list.length > 0) {
        const normalized = list.map(normalizeDelivery);
        saveStoredDeliveries(normalized);
        return normalized;
      }
    } catch (err) {
      console.warn('Backend getAllDeliveries failed, falling back:', err.message);
    }

    return getStoredDeliveries();
  },

  /**
   * Fetch available delivery opportunities ready for claim
   * GET /api/v1/deliveries/available
   */
  async getAvailableDeliveries() {
    try {
      const response = await apiClient.get('/deliveries/available');
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeDelivery);
      }
    } catch (err) {
      console.warn('Backend getAvailableDeliveries failed, falling back:', err.message);
    }
    return AVAILABLE_REQUESTS;
  },

  /**
   * Create a new delivery consignment
   * POST /api/v1/deliveries
   */
  async createDelivery(data) {
    try {
      const response = await apiClient.post('/deliveries', data);
      const created = response.data?.data || response.data;
      if (created) {
        const norm = normalizeDelivery(created);
        const stored = getStoredDeliveries();
        saveStoredDeliveries([norm, ...stored]);
        return norm;
      }
    } catch (err) {
      console.warn('Backend createDelivery failed, saving to cache:', err.message);
    }

    const localNorm = normalizeDelivery({
      ...data,
      orderId: data.orderId || `ORD-${Date.now().toString().slice(-4)}`,
      status: data.status || 'ASSIGNED'
    });
    const stored = getStoredDeliveries();
    saveStoredDeliveries([localNorm, ...stored]);
    return localNorm;
  },

  /**
   * Update delivery status
   * PATCH /api/v1/deliveries/:deliveryId/status
   */
  async updateDeliveryStatus(deliveryId, newStatus, extraData = {}) {
    if (!deliveryId) throw new Error('Delivery ID is required');
    if (!newStatus) throw new Error('New status is required');

    let updatedFromApi = null;
    try {
      const response = await apiClient.patch(`/deliveries/${deliveryId}/status`, {
        status: newStatus,
        ...extraData
      });
      const data = response.data?.data || response.data?.delivery || response.data;
      if (data) {
        updatedFromApi = normalizeDelivery(data);
      }
    } catch (err) {
      console.warn('Backend updateDeliveryStatus failed, updating locally:', err.message);
    }

    // Always keep localStorage cache updated
    const deliveries = getStoredDeliveries();
    let updatedItem = updatedFromApi;

    const updatedList = deliveries.map((item) => {
      if (
        String(item.id).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item.orderId).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item._id).toLowerCase() === String(deliveryId).toLowerCase()
      ) {
        const now = new Date().toISOString();
        let timestamps = {};

        if (newStatus === DELIVERY_STATUSES.ACCEPTED) timestamps.acceptedAt = now;
        if (newStatus === DELIVERY_STATUSES.PICKED_UP) timestamps.pickupCompletedAt = now;
        if (newStatus === DELIVERY_STATUSES.DELIVERED) timestamps.deliveredAt = now;

        updatedItem = updatedFromApi || {
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
      updatedItem = normalizeDelivery({ id: deliveryId, status: newStatus, ...extraData });
      updatedList.unshift(updatedItem);
    }

    saveStoredDeliveries(updatedList);
    return updatedItem;
  },

  /**
   * Submit Proof of Delivery (Photo, Receiver Name, Signature)
   * POST /api/v1/deliveries/:deliveryId/proof
   */
  async submitDeliveryProof(deliveryId, proofData) {
    if (!deliveryId) throw new Error('Delivery ID is required');

    let updatedFromApi = null;
    try {
      const response = await apiClient.post(`/deliveries/${deliveryId}/proof`, proofData);
      const data = response.data?.data || response.data?.delivery || response.data;
      if (data) {
        updatedFromApi = normalizeDelivery(data);
      }
    } catch (err) {
      console.warn('Backend submitDeliveryProof failed, updating locally:', err.message);
    }

    const deliveries = getStoredDeliveries();
    let updatedItem = updatedFromApi;
    const now = new Date().toISOString();

    const updatedList = deliveries.map((item) => {
      if (
        String(item.id).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item.orderId).toLowerCase() === String(deliveryId).toLowerCase() ||
        String(item._id).toLowerCase() === String(deliveryId).toLowerCase()
      ) {
        updatedItem = updatedFromApi || {
          ...item,
          status: DELIVERY_STATUSES.DELIVERED,
          deliveredAt: now,
          proofOfDelivery: {
            receiverName: proofData.receiverName || item.buyer?.receiverName || 'Sundar Rajan',
            signatureUrl: proofData.signature || proofData.signatureUrl || null,
            photoUrl: proofData.photoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
            notes: proofData.notes || 'Consignment verified at buyer bay.',
            timestamp: now
          }
        };
        return updatedItem;
      }
      return item;
    });

    if (!updatedItem) {
      updatedItem = normalizeDelivery({ id: deliveryId, status: DELIVERY_STATUSES.DELIVERED });
    }

    saveStoredDeliveries(updatedList);
    return updatedItem;
  },

  /**
   * Reset demonstration delivery data back to initial state
   */
  resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DELIVERIES));
    return INITIAL_DELIVERIES.map(normalizeDelivery);
  }
};

export default deliveryService;
