/**
 * Vehicle Booking Service for Buyer Portal
 * Naam Uzhavar / FarmDirect Platform
 * Connects directly to backend /api/v1/vehicles and /api/v1/vehicles/bookings
 */

import apiClient from './apiClient.js';

const STORAGE_KEY = 'naam_uzhavar_vehicle_bookings';

/**
 * Fetch available vehicles from backend MongoDB
 */
export async function getVehicles(params = {}) {
  try {
    const res = await apiClient.get('/vehicles', { params });
    const data = res.data?.data || res.data?.vehicles || res.data;
    if (Array.isArray(data)) {
      return data.map((v) => ({
        ...v,
        id: v._id || v.id,
        distanceKm: v.distanceKm || (v.distance ? Number(v.distance) : 4.5),
        etaMins: v.etaMins || 15
      }));
    }
  } catch (err) {
    console.warn('Error fetching vehicles from backend:', err.message);
  }
  return [];
}

/**
 * Fetch active and past bookings from backend or cache
 */
export async function fetchVehicleBookings() {
  try {
    const res = await apiClient.get('/vehicles/bookings');
    const records = res.data?.data || res.data;
    if (Array.isArray(records)) {
      const normalized = records.map((b) => ({
        ...b,
        id: b.bookingId || b._id || b.id,
        mongoId: b._id || b.id
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch (e) {
    console.warn('Backend bookings fetch error, using cache:', e.message);
  }
  return getStoredVehicleBookings();
}

export function getStoredVehicleBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveVehicleBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('naam_uzhavar_bookings_updated', { detail: bookings }));
  } catch (e) {
    console.warn('Error saving vehicle bookings:', e);
  }
}

/**
 * Create a new vehicle booking request
 */
export async function createVehicleBookingRequest({
  vehicle,
  pickupLocation,
  dropoffLocation,
  cargoName,
  weightKg,
  pickupTime,
  fare
}) {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `VB-${randomSuffix}`;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const payload = {
    bookingId,
    vehicleId: vehicle._id || vehicle.id,
    vehicleName: vehicle.name,
    tamilVehicleName: vehicle.tamilName || vehicle.name,
    regNumber: vehicle.regNumber,
    driver: vehicle.driver,
    pickupLocation: pickupLocation || 'Arun Organic Farms, Nilakottai Belt',
    dropoffLocation: dropoffLocation || 'ABC Retail Distribution Depot, Dindigul',
    cargoName: cargoName || 'Tomato Country Fresh',
    weightKg: Number(weightKg) || 400,
    fare: Number(fare) || 680,
    status: 'PENDING',
    pickupOtp: otp,
    etaMins: vehicle.etaMins || 15
  };

  let createdBooking = null;
  try {
    const res = await apiClient.post('/vehicles/bookings', payload);
    createdBooking = res.data?.data || res.data;
  } catch (err) {
    console.warn('Backend create booking error, persisting locally:', err.message);
  }

  const result = {
    ...payload,
    ...(createdBooking || {}),
    id: bookingId,
    createdAt: new Date().toISOString()
  };

  const existing = getStoredVehicleBookings();
  const updated = [result, ...existing];
  saveVehicleBookings(updated);
  return result;
}

/**
 * Update vehicle booking status
 */
export async function updateBookingStatus(bookingId, newStatus, declineReason = null) {
  const bookings = getStoredVehicleBookings();
  const target = bookings.find((b) => b.id === bookingId || b.bookingId === bookingId);
  const targetId = target?.mongoId || target?._id || bookingId;

  try {
    await apiClient.patch(`/vehicles/bookings/${targetId}/status`, {
      status: newStatus,
      declineReason
    });
  } catch (err) {
    console.warn('Backend updateBookingStatus error, updating locally:', err.message);
  }

  const updated = bookings.map((b) => {
    if (b.id === bookingId || b.bookingId === bookingId) {
      return {
        ...b,
        status: newStatus,
        declineReason: newStatus === 'DECLINED' ? (declineReason || 'Driver unavailable') : null,
        respondedAt: new Date().toISOString()
      };
    }
    return b;
  });

  saveVehicleBookings(updated);
  return updated.find((b) => b.id === bookingId || b.bookingId === bookingId);
}
