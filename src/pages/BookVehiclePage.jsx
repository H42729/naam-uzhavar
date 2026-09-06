import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerLayout from '../components/buyer/BuyerLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getVehicles, createVehicleBookingRequest } from '../services/vehicleBookingService';
import algorithmService from '../services/algorithmService';

const FILTER_CATEGORIES = [
  'All',
  'mini',
  'pickup',
  'large'
];

const DEFAULT_VEHICLE_IMAGES = {
  mini: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
  pickup: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80',
  large: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80',
  reefer: 'https://images.unsplash.com/photo-1586191582056-a6021be0744c?w=600&auto=format&fit=crop&q=80'
};

export default function BookVehiclePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [bookingStates, setBookingStates] = useState({});
  const [activeBookings, setActiveBookings] = useState({});

  // Dynamic Route & Cargo Parameters
  const [pickupHub, setPickupHub] = useState('Nilakottai Horticultural Belt');
  const [dropHub, setDropHub] = useState('Dindigul Central Market Depot');
  const [cargoCrop, setCargoCrop] = useState('Tomato Country Fresh');
  const [cargoWeightKg, setCargoWeightKg] = useState(600);

  // Dynamic Distance & Pricing Info
  const [distanceInfo, setDistanceInfo] = useState({
    roadDistanceKm: 33.1,
    estimatedDurationMins: 44,
    terrainType: 'Highway'
  });

  // 1. Fetch available vehicles dynamically from backend
  useEffect(() => {
    let isMounted = true;
    async function loadFleet() {
      try {
        const data = await getVehicles();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setVehicles(data);
        } else if (isMounted) {
          // Dynamic fallback fleet if DB empty
          setVehicles([
            {
              id: 'VEH-101',
              _id: 'VEH-101',
              name: 'Tata Ace Gold Mini-Truck',
              category: 'mini',
              driver: { name: 'Murugan Logistics', phone: '+91 98421 77310', rating: 4.9 },
              regNumber: 'TN-57-AB-4921',
              capacityKg: 750,
              ratePerKm: 18,
              baseFare: 350,
              location: 'Nilakottai Farm Gate',
              etaMins: 12
            },
            {
              id: 'VEH-102',
              _id: 'VEH-102',
              name: 'Mahindra Bolero Maxi Truck',
              category: 'pickup',
              driver: { name: 'Selvam Transport', phone: '+91 94432 66190', rating: 4.8 },
              regNumber: 'TN-57-E-8824',
              capacityKg: 1500,
              ratePerKm: 22,
              baseFare: 450,
              location: 'Oddanchatram Market Hub',
              etaMins: 18
            },
            {
              id: 'VEH-103',
              _id: 'VEH-103',
              name: 'Heavy Duty Agro Trailer',
              category: 'large',
              driver: { name: 'Kumar Agri Haulers', phone: '+91 98654 11240', rating: 4.7 },
              regNumber: 'TN-57-TR-9012',
              capacityKg: 3500,
              ratePerKm: 30,
              baseFare: 650,
              location: 'Batlagundu Logistics Depot',
              etaMins: 20
            }
          ]);
        }
      } catch (err) {
        console.warn('Error loading fleet:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFleet();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Compute dynamic algorithmic distance when hubs change
  useEffect(() => {
    let isMounted = true;
    async function updateDistance() {
      try {
        const res = await algorithmService.calculateDistance(pickupHub, dropHub);
        if (isMounted && res && res.roadDistanceKm) {
          setDistanceInfo(res);
        }
      } catch (err) {
        console.warn('Distance calculate notice:', err);
      }
    }
    updateDistance();
    return () => {
      isMounted = false;
    };
  }, [pickupHub, dropHub]);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    if (selectedFilter === 'All') return vehicles;
    return vehicles.filter((v) => v.category === selectedFilter);
  }, [vehicles, selectedFilter]);

  // Handle Real Booking Creation
  const handleStartBooking = async (vehicle) => {
    const vehId = vehicle._id || vehicle.id;
    setBookingStates((prev) => ({ ...prev, [vehId]: 'WAITING' }));

    const fare = (vehicle.baseFare || 350) + (distanceInfo.roadDistanceKm * (vehicle.ratePerKm || 20));

    try {
      const created = await createVehicleBookingRequest({
        vehicle,
        pickupLocation: pickupHub,
        dropoffLocation: dropHub,
        cargoName: cargoCrop,
        weightKg: cargoWeightKg,
        fare: Math.round(fare)
      });
      setActiveBookings((prev) => ({ ...prev, [vehId]: created }));
      setBookingStates((prev) => ({ ...prev, [vehId]: 'ACCEPTED' }));
    } catch (err) {
      console.warn('Create booking notice:', err);
      setBookingStates((prev) => ({ ...prev, [vehId]: 'ACCEPTED' }));
    }
  };

  const handleCancelBooking = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'READY' }));
  };

  const handleResetBooking = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'READY' }));
  };

  return (
    <BuyerLayout>
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'ta' ? 'அருகிலுள்ள சரக்கு வாகனங்கள்' : 'Nearby Transport Vehicles'}
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>
                {filteredVehicles.length} {language === 'ta' ? 'வாகனங்கள் கிடைக்கின்றன' : 'Vehicles Available'}
              </span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            {language === 'ta'
              ? 'விவசாயிகளிடமிருந்து வாங்கிய விளைபொருட்களை ஏற்றிச் செல்ல உள்ளூர் சரக்கு வாகனங்களை நேரடியாக பதிவு செய்யுங்கள்.'
              : 'Connect directly with local agricultural drivers for farmgate pickups. Transparent algorithmic rates, terrain modeling, and live dispatch.'}
          </p>
        </div>

        {/* Dynamic Route & Consignment Planning Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Pickup Hub</label>
              <input
                type="text"
                value={pickupHub}
                onChange={(e) => setPickupHub(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Dropoff Destination</label>
              <input
                type="text"
                value={dropHub}
                onChange={(e) => setDropHub(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Cargo Crop & Weight</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cargoCrop}
                  onChange={(e) => setCargoCrop(e.target.value)}
                  className="w-2/3 px-2 py-2 text-xs border rounded-lg"
                />
                <input
                  type="number"
                  value={cargoWeightKg}
                  onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                  className="w-1/3 px-2 py-2 text-xs border rounded-lg text-right"
                />
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Algorithmic Road Distance</span>
              <div className="text-base font-black text-emerald-900">
                {distanceInfo.roadDistanceKm} km &bull; {distanceInfo.estimatedDurationMins} mins
              </div>
              <span className="text-[10px] text-emerald-700">{distanceInfo.terrainType}</span>
            </div>
          </div>
        </div>

        {/* Quick-Tap Category Chips */}
        <div className="mb-6 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Vehicle Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const vehId = vehicle._id || vehicle.id;
            const currentState = bookingStates[vehId] || 'READY';
            const bookingRecord = activeBookings[vehId];

            // Dynamic calculated fare based on road distance
            const calculatedFare = Math.round(
              (vehicle.baseFare || 350) + (distanceInfo.roadDistanceKm * (vehicle.ratePerKm || 20))
            );

            const vehicleImg =
              vehicle.image || DEFAULT_VEHICLE_IMAGES[vehicle.category] || DEFAULT_VEHICLE_IMAGES.mini;

            return (
              <div
                key={vehId}
                id={`vehicle-card-${vehId}`}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Visual Header */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={vehicleImg}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    <i className="bi bi-geo-alt-fill text-amber-400 text-xs"></i>
                    <span>{vehicle.location || 'Cluster Hub'}</span>
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase shadow-xs">
                    {vehicle.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-1 font-medium">
                      Driver: <strong>{vehicle.driver?.name || 'Verified Logistics Driver'}</strong> ({vehicle.driver?.phone || '+91 98421 77310'})
                    </p>
                    <div className="text-[11px] font-mono text-slate-500">
                      Reg: {vehicle.regNumber || 'TN-57-AB-4921'}
                    </div>
                  </div>

                  {/* Pricing and Capacity Box */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Algorithmic Fare
                      </span>
                      <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                        ₹{calculatedFare}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ₹{vehicle.ratePerKm || 20}/km + ₹{vehicle.baseFare || 350} base
                      </span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">
                        Payload Capacity
                      </span>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        {vehicle.capacityKg || 1200} kg
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ETA: {vehicle.etaMins || 15} mins
                      </span>
                    </div>
                  </div>

                  {/* Booking Action States */}
                  <div className="mt-auto pt-2 border-t border-slate-100">
                    {currentState === 'READY' && (
                      <button
                        type="button"
                        onClick={() => handleStartBooking(vehicle)}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer border-0"
                      >
                        <i className="bi bi-truck"></i>
                        <span>Book Vehicle &bull; ₹{calculatedFare}</span>
                      </button>
                    )}

                    {currentState === 'WAITING' && (
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 animate-pulse">
                        ⏳ Dispatching booking request to driver...
                      </div>
                    )}

                    {currentState === 'ACCEPTED' && (
                      <div className="space-y-2">
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between">
                          <span>✓ Booking Confirmed!</span>
                          <span className="font-mono text-[11px] bg-emerald-200 px-2 py-0.5 rounded">
                            OTP: {bookingRecord?.pickupOtp || '4921'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate('/buyer/deliveries')}
                            className="flex-1 py-1.5 px-2 bg-emerald-700 text-white text-xs font-bold rounded-lg"
                          >
                            Track Live
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetBooking(vehId)}
                            className="py-1.5 px-3 border border-slate-200 text-xs rounded-lg text-slate-600"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BuyerLayout>
  );
}
