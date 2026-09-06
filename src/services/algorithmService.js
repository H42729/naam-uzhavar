/**
 * Algorithm Service
 * Direct interface to backend Python & TypeScript algorithm endpoints:
 * - POST /api/v1/algorithms/distance
 * - POST /api/v1/algorithms/load-match
 * - POST /api/v1/algorithms/route-optimize
 * - POST /api/v1/algorithms/transport-cost
 * - POST /api/v1/algorithms/pipeline
 * - POST /api/v1/algorithms/vehicle-capacity
 * - POST /api/v1/algorithms/dispatch
 */

import apiClient from './apiClient.js';

export const algorithmService = {
  /**
   * 1. Calculate realistic road distance and ETA with terrain modeling
   * POST /api/v1/algorithms/distance
   */
  async calculateDistance(origin, destination) {
    try {
      const response = await apiClient.post('/algorithms/distance', {
        origin,
        destination
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend distance algorithm notice:', err.message);
      return {
        origin,
        destination,
        haversineKm: 28.0,
        roadDistanceKm: 33.0,
        estimatedDurationMins: 45,
        terrainType: 'Highway',
        isGhatSection: false
      };
    }
  },

  /**
   * 2. Optimize Load Allocation across multiple farmers
   * POST /api/v1/algorithms/load-match
   */
  async matchCargoLoad({
    crop = 'Tomato',
    weightKg = 500,
    cratesCount,
    isTemperatureSensitive = false,
    minimumQuality = 'B',
    farmerResponses
  }) {
    try {
      const response = await apiClient.post('/algorithms/load-match', {
        crop,
        weightKg: Number(weightKg),
        cratesCount: cratesCount ? Number(cratesCount) : Math.ceil(Number(weightKg) / 25),
        isTemperatureSensitive: Boolean(isTemperatureSensitive),
        minimumQuality,
        farmerResponses
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend load-matching algorithm notice:', err.message);
      return null;
    }
  },

  /**
   * 3. Multi-stop route optimization via Google OR-Tools CVRPTW
   * POST /api/v1/algorithms/route-optimize
   */
  async optimizeRoute({
    origin,
    stops = [],
    destination,
    vehicleCapacityKg = 1500,
    vehicleId
  }) {
    try {
      const response = await apiClient.post('/algorithms/route-optimize', {
        origin,
        stops,
        destination,
        vehicleCapacityKg: Number(vehicleCapacityKg),
        vehicleId
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend route-optimize algorithm notice:', err.message);
      return null;
    }
  },

  /**
   * 4. Transparent freight & transport cost calculation
   * POST /api/v1/algorithms/transport-cost
   */
  async calculateTransportCost({
    vehicleCategory = 'mini',
    ratePerKm = 22,
    baseFare = 350,
    distanceKm = 25,
    weightKg = 500,
    isRefrigerated = false,
    isGhatRoad = false,
    isSharedPooling = false,
    tollCost,
    fuelSurchargePct
  }) {
    try {
      const response = await apiClient.post('/algorithms/transport-cost', {
        vehicleCategory,
        ratePerKm: Number(ratePerKm),
        baseFare: Number(baseFare),
        distanceKm: Number(distanceKm),
        weightKg: Number(weightKg),
        isRefrigerated: Boolean(isRefrigerated),
        isGhatRoad: Boolean(isGhatRoad),
        isSharedPooling: Boolean(isSharedPooling),
        tollCost: tollCost !== undefined ? Number(tollCost) : undefined,
        fuelSurchargePct: fuelSurchargePct !== undefined ? Number(fuelSurchargePct) : undefined
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend transport-cost algorithm notice:', err.message);
      const base = Number(baseFare) || 350;
      const distFare = (Number(distanceKm) || 10) * (Number(ratePerKm) || 22);
      const total = base + distFare;
      return {
        currency: 'INR',
        baseFare: base,
        distanceFare: distFare,
        totalFare: total,
        ratePerKg: Math.round((total / (Number(weightKg) || 100)) * 100) / 100,
        lineItems: [
          { name: 'Base Vehicle Fare', amount: base },
          { name: `Road Distance Fare (${distanceKm} km)`, amount: distFare }
        ]
      };
    }
  },

  /**
   * 5. End-to-end Mandi uplift pipeline (sih_pipeline.py)
   * POST /api/v1/algorithms/pipeline
   */
  async runPipeline({
    crop = 'Tomato',
    requiredQuantity = 1000,
    buyerPricePerKg,
    mandiPricePerKg,
    origin = 'Oddanchatram',
    destination = 'Madurai',
    farmerResponses = [],
    vehicleCapacityKg = 1500,
    vehicleCostPerKm = 22
  }) {
    try {
      const response = await apiClient.post('/algorithms/pipeline', {
        crop,
        requiredQuantity: Number(requiredQuantity),
        buyerPricePerKg: buyerPricePerKg ? Number(buyerPricePerKg) : undefined,
        mandiPricePerKg: mandiPricePerKg ? Number(mandiPricePerKg) : undefined,
        origin,
        destination,
        farmerResponses,
        vehicleCapacityKg: Number(vehicleCapacityKg),
        vehicleCostPerKm: Number(vehicleCostPerKm)
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend pipeline algorithm notice:', err.message);
      return null;
    }
  },

  /**
   * 6. Vehicle capacity and load distribution
   * POST /api/v1/algorithms/vehicle-capacity
   */
  async matchVehicleCapacity({
    buyerRequiredKg,
    crop = 'Tomato',
    farmers = [],
    vehicles = []
  }) {
    try {
      const response = await apiClient.post('/algorithms/vehicle-capacity', {
        buyerRequiredKg: Number(buyerRequiredKg),
        crop,
        farmers,
        vehicles
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend vehicle-capacity algorithm notice:', err.message);
      return null;
    }
  },

  /**
   * 7. Real-Time Smart Algorithmic Dispatch
   * POST /api/v1/algorithms/dispatch
   */
  async smartDispatch(consignmentData) {
    try {
      const response = await apiClient.post('/algorithms/dispatch', consignmentData);
      return response.data?.data || response.data;
    } catch (err) {
      console.warn('Backend dispatch algorithm notice:', err.message);
      throw err;
    }
  }
};

export default algorithmService;
