/**
 * Vehicle Booking Service for Buyer Portal
 * Naam Uzhavar / FarmDirect Platform
 * Handles creating booking requests, managing status (PENDING, ACCEPTED, DECLINED, IN_TRANSIT),
 * and simulating driver real-time responses.
 */

const STORAGE_KEY = 'naam_uzhavar_vehicle_bookings';

const SEED_BOOKINGS = [
  {
    id: 'VB-8039',
    vehicleId: 'VEH-102',
    vehicleName: 'Mahindra Bolero Maxi Truck',
    regNumber: 'TN-57-E-8824',
    driver: {
      name: 'Selvam P.',
      tamilName: 'செல்வம் பி.',
      phone: '+91 94432 66190',
      rating: 4.8
    },
    pickupLocation: 'Oddanchatram Central Vegetable Market',
    dropoffLocation: 'ABC Retail Distribution Depot, Dindigul',
    cargoName: 'Tomato Grade-A',
    weightKg: 650,
    fare: 750,
    status: 'DELIVERED', // PENDING, ACCEPTED, DECLINED, IN_TRANSIT, DELIVERED
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    pickupOtp: '5821',
    etaMins: 0
  }
];

export function getStoredVehicleBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_BOOKINGS;
  } catch (e) {
    console.warn('Error reading vehicle bookings from localStorage:', e);
    return SEED_BOOKINGS;
  }
}

export function saveVehicleBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new CustomEvent('naam_uzhavar_bookings_updated', { detail: bookings }));
  } catch (e) {
    console.warn('Error saving vehicle bookings to localStorage:', e);
  }
}

export function createVehicleBookingRequest({
  vehicle,
  pickupLocation,
  dropoffLocation,
  cargoName,
  weightKg,
  pickupTime,
  fare
}) {
  const bookings = getStoredVehicleBookings();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const newBooking = {
    id: `VB-${randomSuffix}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    tamilVehicleName: vehicle.tamilName,
    regNumber: vehicle.regNumber,
    isRefrigerated: vehicle.isRefrigerated,
    driver: {
      name: vehicle.driver.name,
      tamilName: vehicle.driver.tamilName,
      phone: vehicle.driver.phone,
      rating: vehicle.driver.rating,
      avatar: vehicle.driver.avatar
    },
    pickupLocation: pickupLocation || 'Arun Organic Farms, Nilakottai Belt',
    dropoffLocation: dropoffLocation || 'ABC Retail Distribution Depot, Dindigul',
    cargoName: cargoName || 'Tomato Country Fresh',
    weightKg: Number(weightKg) || 400,
    pickupTime: pickupTime || 'Immediate Dispatch',
    fare: Number(fare) || 680,
    status: 'PENDING', // Initially pending awaiting driver confirmation
    createdAt: new Date().toISOString(),
    pickupOtp: otp,
    etaMins: vehicle.etaMins || 15,
    declineReason: null
  };

  const updated = [newBooking, ...bookings];
  saveVehicleBookings(updated);
  return newBooking;
}

export function updateBookingStatus(bookingId, newStatus, declineReason = null) {
  const bookings = getStoredVehicleBookings();
  const updated = bookings.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: newStatus,
        declineReason: newStatus === 'DECLINED' ? (declineReason || 'Driver is currently busy with another consignment') : null,
        respondedAt: new Date().toISOString()
      };
    }
    return b;
  });

  saveVehicleBookings(updated);
  return updated.find((b) => b.id === bookingId);
}
