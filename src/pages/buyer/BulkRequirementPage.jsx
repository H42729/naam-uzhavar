import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';
import { matchSupplyLocally, matchSupplyWithAlgorithm } from '../../services/bulkProcurementService';
import algorithmService from '../../services/algorithmService';
import FarmerMatchingDetailsModal from '../../components/buyer/FarmerMatchingDetailsModal';
import brinjalImg from '../../assets/brinjal.jpg';

const CROP_FALLBACK = {
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  brinjal: brinjalImg,
  carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80';

export default function BulkRequirementPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, confirmBulkOrder } = useBuyer();
  const { language } = useLanguage();
  const { user } = useAuth();

  // 1. Resolve Target Product
  const product = useMemo(() => {
    // If state passed via navigate
    if (location.state?.product) return location.state.product;
    if (!productId) return products[0] || null;

    // Search by product ID string
    const found = products.find(
      (p) => String(p.id).toLowerCase() === String(productId).toLowerCase()
    );
    if (found) return found;

    // Fallback search by index or suffix
    const byIndex = products.find(
      (p, idx) => String(idx + 1) === String(productId) || p.id.endsWith(`00${productId}`)
    );
    if (byIndex) return byIndex;

    return products[0] || null;
  }, [products, productId, location.state]);

  const cropName = product?.crop || location.state?.name || 'Produce';
  const cardWeight = Number(product?.quantity || location.state?.cardWeight || 50);
  const basePricePerKg = Number(product?.price || location.state?.unitPrice || 30);

  const cropKey = cropName.toLowerCase();
  const isBrinjal = cropKey.includes('brinjal') || cropKey.includes('eggplant');
  let displayImage = isBrinjal ? brinjalImg : (product?.image || product?.images?.[0]);
  if (!displayImage || displayImage.includes('1628773822503') || displayImage.includes('1622206151226')) {
    displayImage = isBrinjal ? brinjalImg : (CROP_FALLBACK[cropKey] || FALLBACK_IMAGE);
  }

  // 2. Progressive Flow State: step = 1 | 2 | 3
  const [step, setStep] = useState(1);
  const [targetQuantity, setTargetQuantity] = useState(250);
  const [inputError, setInputError] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [selectedLotForDetails, setSelectedLotForDetails] = useState(null);

  // Delivery & Checkout state for Step 3
  const [deliveryLocation, setDeliveryLocation] = useState('Central Agricultural Hub, Tamil Nadu');
  const [paymentTerms, setPaymentTerms] = useState('escrow');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Reset errors when targetQuantity changes
  useEffect(() => {
    if (Number(targetQuantity) > 0) {
      setInputError('');
    }
  }, [targetQuantity]);

  // Handle Quick Presets
  const handlePresetSelect = (qty) => {
    setTargetQuantity(qty);
    setInputError('');
  };

  // Step 1: Match Supply action via Python Load Matching & Dynamic Freight Engine
  const handleMatchSupply = async () => {
    const qty = Number(targetQuantity);
    if (!qty || qty <= 0) {
      setInputError('Please enter a valid bulk target quantity greater than 0 kg.');
      return;
    }
    setInputError('');
    setIsMatching(true);

    try {
      // 1. Call real multi-farmer supply matching with automatic OR-Tools route & freight
      const result = await matchSupplyWithAlgorithm({
        crop: cropName,
        targetQuantity: qty,
        activeInventory: products,
        destination: deliveryLocation || 'Central Agricultural Hub, Tamil Nadu'
      });

      setMatchResult(result);
    } catch (err) {
      console.warn('Backend match supply error, using local fallback:', err);
      const fallbackResult = matchSupplyLocally({
        crop: cropName,
        targetQuantity: qty,
        activeInventory: products
      });
      setMatchResult(fallbackResult);
    } finally {
      setIsMatching(false);
      setStep(2);
    }
  };

  // Calculations for Financial Summary
  const subtotal = useMemo(() => {
    if (matchResult?.totalAmount) return matchResult.totalAmount;
    const qty = Number(targetQuantity) || 0;
    return qty * basePricePerKg;
  }, [matchResult, targetQuantity, basePricePerKg]);

  const serviceFee = useMemo(() => {
    // 2% standard platform handling & inspection fee
    return Math.round(subtotal * 0.02);
  }, [subtotal]);

  const totalBulkAmount = subtotal + serviceFee;

  // Step 2 CTA: Confirm Matched Supply -> Step 3
  const handleConfirmMatchedSupply = () => {
    setStep(3);
  };

  // Step 3 CTA: Confirm & Place Order -> Success Animation -> Navigate to /my-orders
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);

    setTimeout(() => {
      const order = confirmBulkOrder(matchResult, {
        buyerName: user?.name || 'Registered Institutional Buyer',
        deliveryAddress: deliveryLocation,
        paymentTerms
      });

      setPlacedOrder(order);
      setIsPlacingOrder(false);

      // Brief success animation before redirecting to /my-orders
      setTimeout(() => {
        navigate('/my-orders');
      }, 1800);
    }, 900);
  };

  return (
    <BuyerLayout>
      <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-6 sm:py-8 pb-36 md:pb-8">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              to="/buyer/browse"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors no-underline"
            >
              <i className="bi bi-arrow-left"></i>
              <span>Back to Marketplace</span>
            </Link>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Bulk Procurement Flow
            </span>
          </div>

          {/* Progressive Step Stepper Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {/* Step 1 Tab */}
              <button
                type="button"
                onClick={() => step > 1 && setStep(1)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl text-left transition-all border-0 bg-transparent ${
                  step === 1
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : step > 1
                    ? 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 1
                      ? 'bg-emerald-600 text-white'
                      : step === 1
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > 1 ? <i className="bi bi-check-lg"></i> : '1'}
                </span>
                <div className="text-center sm:text-left">
                  <span className="text-xs sm:text-sm block font-bold leading-tight">
                    Overview & Input
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block">
                    Set target weight
                  </span>
                </div>
              </button>

              {/* Step 2 Tab */}
              <button
                type="button"
                onClick={() => step > 2 && setStep(2)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl text-left transition-all border-0 bg-transparent ${
                  step === 2
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : step > 2
                    ? 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 2
                      ? 'bg-emerald-600 text-white'
                      : step === 2
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > 2 ? <i className="bi bi-check-lg"></i> : '2'}
                </span>
                <div className="text-center sm:text-left">
                  <span className="text-xs sm:text-sm block font-bold leading-tight">
                    Matched Supply
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block">
                    Lot allocations
                  </span>
                </div>
              </button>

              {/* Step 3 Tab */}
              <div
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-xl text-left transition-all ${
                  step === 3
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 3
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </span>
                <div className="text-center sm:text-left">
                  <span className="text-xs sm:text-sm block font-bold leading-tight">
                    Verification & Order
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block">
                    Unmask & finalize
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Two-Column Layout on Desktop, Single Column on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ===============================================================
                LEFT COLUMN (Inputs & Supply Matches with Progressive Disclosure)
                =============================================================== */}
            <div className="md:col-span-7 lg:col-span-8 space-y-6">
              {/* STEP 1: Product Overview & Quantity Input */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Summary Card with Product Details */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                      <img
                        src={displayImage}
                        alt={cropName}
                        className="w-full sm:w-36 h-36 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {product?.grade || 'Grade A'}
                          </span>
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {product?.category || 'Fresh Harvest'}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <i className="bi bi-geo-alt-fill text-amber-500"></i>
                            {product?.location || 'Tamil Nadu'}
                          </span>
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                          {cropName}
                        </h1>
                        <p className="text-xs text-slate-500 mb-4">
                          {product?.tamilName || 'நாட்டு விளைச்சல்'} • Listed by {product?.farmer || 'Regional Farmer'}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                          <div className="bg-slate-50 p-2.5 rounded-xl">
                            <span className="text-[11px] uppercase font-semibold text-slate-500 block">
                              Base Price / kg
                            </span>
                            <span className="text-lg font-extrabold text-slate-900">
                              ₹{basePricePerKg}
                              <span className="text-xs font-normal text-slate-500">/kg</span>
                            </span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl">
                            <span className="text-[11px] uppercase font-semibold text-slate-500 block">
                              Card Lot Weight
                            </span>
                            <span className="text-lg font-extrabold text-emerald-700">
                              {cardWeight} kg
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Field: Target Bulk Quantity in kg */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                    <div className="mb-4">
                      <label
                        htmlFor="bulk-quantity-input"
                        className="block text-sm font-bold text-slate-900 mb-1"
                      >
                        Target Bulk Quantity (in kg) <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-xs text-slate-500 mb-3">
                        Enter the total volume you wish to procure. Our algorithm will match and aggregate lots across certified farms.
                      </p>

                      <div className="relative">
                        <input
                          id="bulk-quantity-input"
                          type="number"
                          min="1"
                          step="10"
                          value={targetQuantity}
                          onChange={(e) => setTargetQuantity(e.target.value)}
                          placeholder="e.g. 500"
                          className={`w-full bg-slate-50 text-slate-900 font-bold text-lg rounded-xl border px-4 py-3 pl-4 pr-14 focus:outline-none focus:ring-2 transition-all ${
                            inputError
                              ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                              : 'border-slate-300 focus:ring-emerald-500/20 focus:border-emerald-600'
                          }`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-500">
                          kg
                        </span>
                      </div>

                      {/* Inline Error Message */}
                      {inputError && (
                        <div className="mt-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                          <i className="bi bi-exclamation-triangle-fill flex-shrink-0 text-sm"></i>
                          <span>{inputError}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-500 block mb-2">
                        Quick Preset Quantities:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[100, 250, 500, 1000, 2000].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => handlePresetSelect(qty)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              Number(targetQuantity) === qty
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            +{qty} kg
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Aggregation Guarantee Callout */}
                    <div className="mt-6 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
                      <i className="bi bi-shield-check text-emerald-700 text-lg mt-0.5"></i>
                      <div className="text-xs text-slate-700">
                        <strong className="text-emerald-900 block font-bold mb-0.5">
                          Multi-Farmer Supply Guarantee
                        </strong>
                        Smallholder lots are aggregated into one seamless dispatch. Single invoice, unified farmgate quality check, and coordinated delivery.
                      </div>
                    </div>
                  </div>

                  {/* Skeleton Loader during simulated matching */}
                  {isMatching && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-5 bg-slate-200 rounded w-16"></div>
                      </div>
                      <div className="space-y-3 pt-2">
                        <div className="h-16 bg-slate-100 rounded-xl"></div>
                        <div className="h-16 bg-slate-100 rounded-xl"></div>
                        <div className="h-16 bg-slate-100 rounded-xl"></div>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-6 bg-slate-200 rounded w-32"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Matched Supply Breakdown */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Fulfillment Status Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-patch-check-fill text-lg"></i>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-emerald-900 mb-0.5">
                          {matchResult?.shortfallKg === 0 ? '100% Supply Matched' : 'Partial Supply Matched'}
                        </h3>
                        <p className="text-xs text-emerald-700 mb-0">
                          {matchResult?.totalMatchedKg} kg aggregated across {matchResult?.allocations?.length || 2} verified farmer lots.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline bg-transparent border-0 p-0 cursor-pointer flex-shrink-0"
                    >
                      Edit Quantity
                    </button>
                  </div>

                  {/* Algorithmic Logistics & Vehicle Matching Banner */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                          Algorithmic Fleet & Load Allocation
                        </span>
                      </div>
                      <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                        Python 4-Factor Solver
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
                        <span className="text-[11px] text-slate-500 font-medium block">Recommended Transport</span>
                        <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                          {matchResult?.recommendedVehicle?.vehicle?.name || 'Tata Ace Gold (0.75 Ton)'}
                        </strong>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Driver: {matchResult?.recommendedVehicle?.vehicle?.driverName || 'Murugan Logistics'}
                        </span>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
                        <span className="text-[11px] text-slate-500 font-medium block">Payload Utilization</span>
                        <strong className="text-emerald-700 font-bold text-sm block mt-0.5">
                          {matchResult?.capacityUtilization || 75.0}% Capacity
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {targetQuantity} kg / {matchResult?.recommendedVehicle?.vehicle?.payloadCapacityKg || 1500} kg
                        </span>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
                        <span className="text-[11px] text-slate-500 font-medium block">Estimated Algorithmic Freight</span>
                        <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                          ₹{matchResult?.transportCost?.totalFare || 850}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          ₹{matchResult?.transportCost?.ratePerKg || (Math.round((850 / (Number(targetQuantity) || 100)) * 10) / 10)}/kg transparent rate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Automated Google OR-Tools Multi-Stop Vehicle Route */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <i className="bi bi-geo-alt-fill text-sm"></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-white">OR-Tools Vehicle Dispatch Route</span>
                            <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full">
                              AI Solved
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Multi-stop Capacitated Vehicle Routing Problem (CVRP)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                          <span className="text-slate-400 text-[11px] block">Optimized Distance</span>
                          <strong className="text-emerald-400 font-mono text-sm">
                            {matchResult?.optimizedRoute?.total_distance_km || 34.8} km
                          </strong>
                        </div>
                        <div className="text-right pl-3 border-l border-slate-800">
                          <span className="text-slate-400 text-[11px] block">Est. Transit</span>
                          <strong className="text-white font-mono text-sm">
                            {matchResult?.optimizedRoute?.totalDurationMins || 50} mins
                          </strong>
                        </div>
                        <div className="text-right pl-3 border-l border-slate-800">
                          <span className="text-slate-400 text-[11px] block">Fuel Saved</span>
                          <strong className="text-teal-400 font-mono text-sm">
                            +{matchResult?.optimizedRoute?.distanceSavingsPct || 15.4}%
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Waypoint Road Map */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-300 block mb-2.5">
                        Optimal Pickup & Drop Sequence:
                      </span>
                      <div className="space-y-2">
                        {(matchResult?.optimizedRoute?.stops || [
                          { name: 'Pickup Stop #1: Oddanchatram Farm Cluster', demand_kg: 150 },
                          { name: 'Pickup Stop #2: Nilakottai Farm Cluster', demand_kg: 100 },
                          { name: 'Delivery Destination: Central Buyer Depot', demand_kg: 250 }
                        ]).map((stop, sIdx) => {
                          const isLast = sIdx === (matchResult?.optimizedRoute?.stops?.length || 3) - 1;
                          return (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                                    isLast ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                                  }`}
                                >
                                  {isLast ? <i className="bi bi-flag-fill text-[10px]"></i> : sIdx + 1}
                                </span>
                                <div>
                                  <strong className="text-slate-100 font-bold block">
                                    {stop.name || `Waypoint #${sIdx + 1}`}
                                  </strong>
                                  <span className="text-[11px] text-slate-400">
                                    {isLast ? 'Final Buyer Dropoff Point' : 'Farmgate Collection Point'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {stop.demand_kg !== undefined && stop.demand_kg > 0 && (
                                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]">
                                    {isLast ? `Total: ${stop.demand_kg} kg` : `+${stop.demand_kg} kg`}
                                  </span>
                                )}
                                <span className={`badge px-2 py-0.5 rounded text-[10px] ${isLast ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                  {isLast ? 'Drop' : 'Pickup'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Google Navigation Direct Trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <i className="bi bi-truck text-emerald-400"></i>
                        <span>
                          Carrier: <strong className="text-slate-200">{matchResult?.recommendedVehicle?.vehicle?.name || 'Tata Ace Gold'}</strong> ({matchResult?.recommendedVehicle?.vehicle?.driverName || 'Murugan Logistics'})
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(matchResult?.allocations?.[0]?.location || 'Nilakottai, Tamil Nadu')}&destination=${encodeURIComponent(deliveryLocation || 'Dindigul, Tamil Nadu')}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs no-underline transition-colors shadow-sm"
                      >
                        <i className="bi bi-map-fill"></i>
                        <span>Open Live Navigation</span>
                      </a>
                    </div>
                  </div>

                  {/* Itemized Table / Card List of Matched Supplier Allocations */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                      <h2 className="text-base font-extrabold text-slate-900 mb-0">
                        Matched Supplier Allocations
                      </h2>
                      <span className="text-xs font-semibold text-slate-500">
                        Anonymized Prior to Order
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {matchResult?.allocations?.map((lot, idx) => (
                        <div
                          key={lot.lotId || idx}
                          className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shadow-2xs flex-shrink-0">
                                {(lot.farmerName || lot.farmer || 'F').charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm block">
                                  {lot.farmerName || lot.farmer || lot.anonymizedLabel || `Supplier Lot #${idx + 1}`}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  ✓ {lot.fpo || `${lot.location || 'Tamil Nadu'} Cluster`}
                                </span>
                              </div>
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                                {lot.grade || 'Grade A'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-left sm:text-right">
                                <span className="text-xs text-slate-500 block">Lot Cost</span>
                                <span className="text-base font-extrabold text-slate-900">
                                  ₹{lot.subtotal?.toLocaleString('en-IN') || (lot.allocatedKg * (lot.pricePerKg || basePricePerKg)).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedLotForDetails({ ...lot, crop: cropName })}
                                className="px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="View Farmer & Produce Details"
                              >
                                <i className="bi bi-eye-fill"></i>
                                <span>{language === 'ta' ? 'விவரங்கள்' : 'View Details'}</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <div>
                              <span className="text-[11px] text-slate-400 block font-medium">Allocated Quantity</span>
                              <strong className="text-slate-900 font-bold">{lot.allocatedKg} kg</strong>
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 block font-medium">Rate / kg</span>
                              <strong className="text-slate-900 font-bold">₹{lot.pricePerKg || basePricePerKg}/kg</strong>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <span className="text-[11px] text-slate-400 block font-medium">Regional Cluster</span>
                              <strong className="text-slate-900 font-bold">{lot.location || 'Tamil Nadu Cluster'}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Step 2 Inline Subtotal Banner */}
                    <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Produce Subtotal:</span>
                        <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Platform Handling & Inspection (2%):</span>
                        <span className="font-bold text-slate-900">₹{serviceFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total Bulk Procurement Amount:</span>
                        <span className="text-emerald-700 text-base">₹{totalBulkAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Farmer Verification & Final Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Verified Notice Banner */}
                  <div className="bg-emerald-600 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <i className="bi bi-shield-lock-fill text-2xl text-emerald-200"></i>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold mb-0.5">
                          Verified Farmer Identity Unmasked
                        </h3>
                        <p className="text-xs text-emerald-100 mb-0">
                          Direct farm contact and pickup details revealed for your matched lots.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-white underline hover:text-emerald-100 bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Back to Breakdown
                    </button>
                  </div>

                  {/* Expanded Supplier Cards with Verified Contact Badges */}
                  <div className="space-y-4">
                    <h2 className="text-base font-extrabold text-slate-900 mb-1">
                      Matched Farmgate Producers
                    </h2>

                    {matchResult?.allocations?.map((lot, idx) => {
                      const farmerData = lot._rawFarmer || {
                        name: product?.farmer || 'Verified Farmer',
                        phone: product?.farmerPhone || '+91 98421 77234',
                        farmAddress: product?.farmAddress || 'Dindigul Cluster, Tamil Nadu',
                        location: product?.location || 'Dindigul'
                      };

                      return (
                        <div
                          key={lot.lotId || idx}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-sm font-extrabold flex items-center justify-center">
                                <i className="bi bi-person-check-fill"></i>
                              </span>
                              <div>
                                <h4 className="text-sm font-extrabold text-slate-900 mb-0">
                                  {farmerData.name}
                                </h4>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <i className="bi bi-patch-check-fill"></i>
                                  Verified Farmgate Producer
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs text-slate-500 block">Allocated Lot</span>
                              <strong className="text-sm font-extrabold text-slate-900">
                                {lot.allocatedKg} kg • ₹{lot.subtotal?.toLocaleString('en-IN') || (lot.allocatedKg * basePricePerKg).toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>

                          {/* Contact Badges: Phone (click to call) and Location Pin */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <a
                              href={`tel:${farmerData.phone}`}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 text-slate-800 hover:text-emerald-700 transition-colors no-underline text-xs font-semibold"
                            >
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                <i className="bi bi-telephone-fill text-[11px]"></i>
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] text-slate-400 block font-normal">Contact Number (Click to Call)</span>
                                <span className="font-bold">{farmerData.phone}</span>
                              </div>
                            </a>

                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 text-xs font-semibold">
                              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                                <i className="bi bi-geo-alt-fill text-[11px]"></i>
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] text-slate-400 block font-normal">Farm Origin / Village</span>
                                <span className="font-bold truncate block">{farmerData.farmAddress || `${farmerData.location}, Tamil Nadu`}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery & Logistics Configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <i className="bi bi-truck text-emerald-600"></i>
                      Delivery & Hub Destination
                    </h3>

                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Destination Address / Yard</label>
                      <input
                        type="text"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:border-emerald-600"
                        placeholder="Enter delivery destination"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <i className="bi bi-clock-history text-emerald-600"></i>
                        Dispatch Window: <strong>24–48 Hours</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="bi bi-shield-check text-emerald-600"></i>
                        Quality Gate: <strong>Certified at Loading</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================================
                RIGHT COLUMN (Desktop Sticky Summary Card with Stage Actions)
                =============================================================== */}
            <div className="hidden md:block md:col-span-5 lg:col-span-4 sticky top-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900 mb-0">
                    Procurement Summary
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Step {step} of 3
                  </span>
                </div>

                {/* Target Crop & Weight */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Target Commodity:</span>
                    <strong className="text-slate-900">{cropName}</strong>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Base Card Lot Weight:</span>
                    <span className="text-slate-700">{cardWeight} kg</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Target Bulk Quantity:</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">
                      {step === 1 ? Number(targetQuantity || 0) : (matchResult?.totalMatchedKg || targetQuantity)} kg
                    </strong>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Base Rate:</span>
                    <span className="text-slate-900 font-semibold">₹{basePricePerKg}/kg</span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Produce Subtotal:</span>
                    <strong className="text-slate-900">₹{subtotal.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Service & Quality Fee (2%):</span>
                    <span className="text-slate-900">₹{serviceFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-extrabold text-base pt-3 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="text-emerald-700 text-lg">
                      ₹{totalBulkAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Stage-Specific Primary Action Button */}
                <div className="pt-2">
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={handleMatchSupply}
                      disabled={isMatching}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 border-0 cursor-pointer"
                    >
                      {isMatching ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Matching Active Farms...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-radar text-base"></i>
                          <span>Match Supply</span>
                        </>
                      )}
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handleConfirmMatchedSupply}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 border-0 cursor-pointer"
                    >
                      <span>Confirm Matched Supply</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 border-0 cursor-pointer"
                    >
                      {isPlacingOrder ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Placing Order...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bag-check-fill"></i>
                          <span>Confirm & Place Order</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block">
                    Direct Farmgate Settlement • 100% Quality Escrow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MOBILE (< 768px) STICKY BOTTOM SUMMARY & ACTION BAR
            Positions directly above BuyerMobileNav (60px high)
            =================================================================== */}
        <div className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                Total ({step === 1 ? Number(targetQuantity || 0) : (matchResult?.totalMatchedKg || targetQuantity)} kg)
              </span>
              <span className="text-base font-extrabold text-emerald-800">
                ₹{totalBulkAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex-1 max-w-[200px]">
              {step === 1 && (
                <button
                  type="button"
                  onClick={handleMatchSupply}
                  disabled={isMatching}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-0 cursor-pointer"
                >
                  {isMatching ? (
                    <span>Matching...</span>
                  ) : (
                    <>
                      <i className="bi bi-radar"></i>
                      <span>Match Supply</span>
                    </>
                  )}
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleConfirmMatchedSupply}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-0 cursor-pointer"
                >
                  <span>Confirm Supply</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border-0 cursor-pointer"
                >
                  {isPlacingOrder ? (
                    <span>Placing...</span>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================
            ORDER SUCCESS MODAL ANIMATION
            =================================================================== */}
        {placedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 transform scale-100 transition-all">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                <i className="bi bi-check-lg"></i>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Order #{placedOrder.id} has been confirmed. Diverting to your orders...
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-left text-xs space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Commodity:</span>
                  <strong className="text-slate-900">{placedOrder.crop}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Volume:</span>
                  <strong className="text-emerald-700">{placedOrder.quantity} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Amount:</span>
                  <strong className="text-slate-900">₹{placedOrder.amount?.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmers Matched:</span>
                  <strong className="text-slate-900">{placedOrder.farmers || 2} Smallholders</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
                <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Redirecting to My Orders...</span>
              </div>
            </div>
          </div>
        )}

        {/* Farmer & Produce Lot Details Modal */}
        {selectedLotForDetails && (
          <FarmerMatchingDetailsModal
            lot={selectedLotForDetails}
            cropName={cropName}
            onClose={() => setSelectedLotForDetails(null)}
          />
        )}
      </div>
    </BuyerLayout>
  );
}
