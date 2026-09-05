import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerLayout from '../components/buyer/BuyerLayout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const INITIAL_VEHICLES = [
  {
    id: 'VEH-101',
    name: 'Tata Ace Gold',
    category: '1.5 Ton Mini Truck',
    driverName: 'முருகன் • Murugan Logistics',
    driverPhone: '+91 98421 77310',
    regNumber: 'TN-57-AB-4921',
    locationText: '📍 Dindigul • 3.2 km away',
    distanceKm: 3.2,
    ratePerKm: '₹22 / km',
    baseFare: '₹1,200 base',
    payload: '1.5 Tons (1,500 kg)',
    eta: '12 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'VEH-102',
    name: 'Mahindra Bolero Maxi Truck Plus',
    category: '2.5 Ton Pickup',
    driverName: 'செல்வம் • Selvam Transport',
    driverPhone: '+91 94432 66190',
    regNumber: 'TN-57-E-8824',
    locationText: '📍 Oddanchatram • 4.5 km away',
    distanceKm: 4.5,
    ratePerKm: '₹26 / km',
    baseFare: '₹1,500 base',
    payload: '2.5 Tons (2,500 kg)',
    eta: '18 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'VEH-103',
    name: 'Mahindra 575 DI Tractor Trailer',
    category: 'Tractor Trailer',
    driverName: 'குமார் • Kumar Agri Haulers',
    driverPhone: '+91 98654 11240',
    regNumber: 'TN-57-TR-9012',
    locationText: '📍 Nilakottai • 2.1 km away',
    distanceKm: 2.1,
    ratePerKm: '₹30 / km',
    baseFare: '₹1,800 base',
    payload: '3.5 Tons (3,500 kg)',
    eta: '15 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'VEH-104',
    name: 'Ashok Leyland Dost Strong',
    category: '1.5 Ton Mini Truck',
    driverName: 'கார்த்திக் • Karthik Express',
    driverPhone: '+91 97890 55430',
    regNumber: 'TN-58-CK-1092',
    locationText: '📍 Palani • 5.0 km away',
    distanceKm: 5.0,
    ratePerKm: '₹24 / km',
    baseFare: '₹1,350 base',
    payload: '1.5 Tons (1,500 kg)',
    eta: '22 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1586191582056-a6021be0744c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'VEH-105',
    name: 'Tata Yodha 2.0 Heavy Duty',
    category: '2.5 Ton Pickup',
    driverName: 'விக்னேஷ் • Vignesh Logistics',
    driverPhone: '+91 98654 22180',
    regNumber: 'TN-57-M-3319',
    locationText: '📍 Dindigul • 6.2 km away',
    distanceKm: 6.2,
    ratePerKm: '₹28 / km',
    baseFare: '₹1,600 base',
    payload: '2.5 Tons (2,500 kg)',
    eta: '25 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'VEH-106',
    name: 'Sonalika DI 745 III Agri Trailer',
    category: 'Tractor Trailer',
    driverName: 'ஆறுமுகம் • Arumugam Rural Freight',
    driverPhone: '+91 96291 44870',
    regNumber: 'TN-57-TR-4567',
    locationText: '📍 Batlagundu • 7.4 km away',
    distanceKm: 7.4,
    ratePerKm: '₹32 / km',
    baseFare: '₹1,900 base',
    payload: '4.0 Tons (4,000 kg)',
    eta: '28 mins',
    verified: true,
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&auto=format&fit=crop&q=80'
  }
];

const FILTER_CATEGORIES = [
  'All',
  '1.5 Ton Mini Truck',
  '2.5 Ton Pickup',
  'Tractor Trailer'
];

export default function BookVehiclePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [selectedFilter, setSelectedFilter] = useState('All');
  // Card states map: { [vehicleId]: 'READY' | 'WAITING' | 'ACCEPTED' | 'DECLINED' }
  const [bookingStates, setBookingStates] = useState({});

  const userName = user?.name || 'Ravi Kumar';
  const userPhone = user?.phone || '+91 98765 43210';

  // Filter vehicles based on quick-tap chips
  const filteredVehicles = useMemo(() => {
    if (selectedFilter === 'All') return INITIAL_VEHICLES;
    return INITIAL_VEHICLES.filter((v) => v.category === selectedFilter);
  }, [selectedFilter]);

  // Handle State Transitions
  const handleStartBooking = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'WAITING' }));
  };

  const handleCancelBooking = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'READY' }));
  };

  const handleSimulateAccept = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'ACCEPTED' }));
  };

  const handleSimulateDecline = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'DECLINED' }));
  };

  const handleResetBooking = (id) => {
    setBookingStates((prev) => ({ ...prev, [id]: 'READY' }));
  };

  // Find next nearest available driver
  const handleFindNextNearest = (currentId) => {
    // Find next available vehicle that isn't currentId
    const otherVehicles = INITIAL_VEHICLES.filter((v) => v.id !== currentId);
    const nextVeh = otherVehicles.find(
      (v) => !bookingStates[v.id] || bookingStates[v.id] === 'READY'
    ) || otherVehicles[0];

    // Reset current
    setBookingStates((prev) => ({
      ...prev,
      [currentId]: 'READY',
      [nextVeh.id]: 'WAITING'
    }));

    // Scroll to the next vehicle element
    const el = document.getElementById(`vehicle-card-${nextVeh.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
                {filteredVehicles.length} {language === 'ta' ? 'செயலில் உள்ள வாகனங்கள்' : 'Vehicles Active in Cluster'}
              </span>
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            {language === 'ta'
              ? 'விவசாயிகளிடமிருந்து வாங்கிய விளைபொருட்களை ஏற்றிச் செல்ல உள்ளூர் சரக்கு வாகனங்களை நேரடியாக பதிவு செய்யுங்கள்.'
              : 'Connect directly with local agricultural drivers for farmgate pickups. Real-time rates, verified drivers, and transparent in-card tracking.'}
          </p>
        </div>

        {/* Quick-Tap Filter Chips (Large, Pill-Shaped with Emerald Highlights) */}
        <div className="mb-8 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Card Grid: 3-column on desktop, 2-column on tablet, single-column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const currentState = bookingStates[vehicle.id] || 'READY';

            return (
              <div
                key={vehicle.id}
                id={`vehicle-card-${vehicle.id}`}
                className="bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Visual Thumbnail with Location Overlay Badge */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Location Overlay: Dark capsule badge anchored top-left */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-xs">
                    <span>{vehicle.locationText}</span>
                  </div>

                  {/* Category Chip Top-Right */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {vehicle.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Driver & Vehicle Details */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-1.5 font-medium">
                      {vehicle.driverName}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <i className="bi bi-patch-check-fill text-emerald-600"></i>
                      <span>Verified Driver & Vehicle</span>
                    </div>
                  </div>

                  {/* Key Metrics Grid (Simple 2-Column Info Box) */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                        Estimated Fare
                      </span>
                      <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {vehicle.ratePerKm}
                        <span className="text-xs font-normal text-slate-500 block">
                          ({vehicle.baseFare})
                        </span>
                      </div>
                    </div>

                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                        Max Payload
                      </span>
                      <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                        {vehicle.payload}
                      </div>
                    </div>
                  </div>

                  {/* IN-CARD STRESS-FREE BOOKING STATES */}
                  <div className="mt-auto pt-2 border-t border-slate-100">
                    {/* STATE 1: Ready to Book */}
                    {currentState === 'READY' && (
                      <button
                        type="button"
                        onClick={() => handleStartBooking(vehicle.id)}
                        className="w-full min-h-[44px] bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-semibold rounded-xl shadow-sm transition-all py-3 px-4 flex items-center justify-center gap-2 text-sm border-0 cursor-pointer"
                      >
                        <i className="bi bi-lightning-charge-fill text-amber-300"></i>
                        <span>Book This Vehicle</span>
                      </button>
                    )}

                    {/* STATE 2: Awaiting Driver Response */}
                    {currentState === 'WAITING' && (
                      <div className="space-y-2">
                        <div className="animate-pulse bg-amber-50 border border-amber-300 text-amber-900 rounded-xl py-3 px-4 text-center font-bold text-xs sm:text-sm">
                          ⏳ Booking Sent... Waiting for Driver to Accept (Estimated 30s)
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(vehicle.id)}
                            className="text-slate-500 hover:text-rose-600 underline font-semibold bg-transparent border-0 cursor-pointer transition-colors"
                          >
                            Cancel Request
                          </button>
                          <span className="text-[11px] text-amber-700 font-medium">
                            Auto-dispatch active
                          </span>
                        </div>

                        {/* Interactive UI Simulation Controls */}
                        <div className="flex items-center justify-center gap-2 pt-2 border-t border-amber-200/60 mt-2">
                          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                            Simulation:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSimulateAccept(vehicle.id)}
                            className="text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-300 cursor-pointer transition-colors"
                          >
                            [Simulate Accept]
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateDecline(vehicle.id)}
                            className="text-[11px] font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 px-2.5 py-1 rounded-md border border-rose-300 cursor-pointer transition-colors"
                          >
                            [Simulate Decline]
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STATE 3: Driver Accepted */}
                    {currentState === 'ACCEPTED' && (
                      <div className="space-y-3">
                        {/* Emerald Success Header */}
                        <div className="bg-emerald-600 text-white py-2.5 px-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>🎉 Driver Accepted Your Request!</span>
                        </div>

                        {/* Shared Pickup Details Summary Box */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <i className="bi bi-info-circle-fill text-emerald-600"></i>
                            <span>Shared Pickup Details</span>
                          </div>
                          <p className="m-0 text-slate-600 leading-relaxed">
                            Sent to driver: <strong>{userName}</strong>, Contact (<strong>{userPhone}</strong>), and <strong>Default Farm Location (Dindigul)</strong>.
                          </p>
                        </div>

                        {/* Vehicle Registration Plate & ETA info */}
                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                              Vehicle Plate
                            </span>
                            <span className="bg-slate-900 text-amber-400 font-mono font-black tracking-wider px-2.5 py-1 rounded text-xs inline-block mt-0.5 shadow-inner">
                              {vehicle.regNumber}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                              Expected Arrival
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700">
                              {vehicle.eta}
                            </span>
                          </div>
                        </div>

                        {/* Large, Tap-Friendly Green Call Driver Button */}
                        <a
                          href={`tel:${vehicle.driverPhone}`}
                          className="w-full min-h-[48px] bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm no-underline shadow-sm transition-all cursor-pointer"
                        >
                          <i className="bi bi-telephone-fill"></i>
                          <span>📞 Call Driver Now ({vehicle.driverPhone})</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleResetBooking(vehicle.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 block text-center w-full bg-transparent border-0 cursor-pointer pt-0.5"
                        >
                          Book another vehicle
                        </button>
                      </div>
                    )}

                    {/* STATE 4: Driver Busy / Declined */}
                    {currentState === 'DECLINED' && (
                      <div className="space-y-2">
                        {/* Soft Red Banner */}
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <i className="bi bi-x-circle-fill text-rose-600 flex-shrink-0 text-sm"></i>
                          <span>Driver is currently unavailable for this trip.</span>
                        </div>

                        {/* Immediate Solution: Auto-Highlighted Button */}
                        <button
                          type="button"
                          onClick={() => handleFindNextNearest(vehicle.id)}
                          className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border-0"
                        >
                          <i className="bi bi-geo-alt-fill text-amber-400"></i>
                          <span>Find Next Nearest Driver</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetBooking(vehicle.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 block text-center w-full bg-transparent border-0 cursor-pointer"
                        >
                          Reset card
                        </button>
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
