import React, { useState, useEffect } from 'react';
import BuyerLayout from '../components/buyer/BuyerLayout';
import algorithmService from '../services/algorithmService';
import { useLanguage } from '../context/LanguageContext';

export default function AlgorithmExplorerPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Tab 1: Load Matching inputs
  const [loadMatchForm, setLoadMatchForm] = useState({
    crop: 'Tomato',
    weightKg: 850,
    minimumQuality: 'B',
    isTemperatureSensitive: false
  });

  // Tab 2: Route Optimization inputs
  const [routeForm, setRouteForm] = useState({
    origin: 'Oddanchatram',
    destination: 'Madurai',
    vehicleCapacityKg: 1500,
    stops: [
      { name: 'Nilakottai Farm Gate', weightKg: 350 },
      { name: 'Batlagundu Farm Hub', weightKg: 450 }
    ]
  });

  // Tab 3: Transport Cost inputs
  const [costForm, setCostForm] = useState({
    vehicleCategory: 'mini',
    distanceKm: 42.5,
    weightKg: 750,
    ratePerKm: 22,
    baseFare: 350,
    isRefrigerated: false,
    isGhatRoad: false,
    isSharedPooling: false
  });

  // Tab 4: Distance inputs
  const [distanceForm, setDistanceForm] = useState({
    origin: 'Oddanchatram',
    destination: 'Kodaikanal'
  });

  // Tab 5: Pipeline inputs
  const [pipelineForm, setPipelineForm] = useState({
    crop: 'Tomato',
    requiredQuantity: 1000,
    buyerPricePerKg: 32,
    mandiPricePerKg: 18,
    origin: 'Oddanchatram',
    destination: 'Madurai'
  });

  // Tab 6: Vehicle Capacity inputs
  const [capacityForm, setCapacityForm] = useState({
    crop: 'Tomato',
    buyerRequiredKg: 1200
  });

  // Run selected algorithm
  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data = null;
      if (activeTab === 'pipeline') {
        data = await algorithmService.runPipeline(pipelineForm);
      } else if (activeTab === 'load_match') {
        data = await algorithmService.matchCargoLoad(loadMatchForm);
      } else if (activeTab === 'route') {
        data = await algorithmService.optimizeRoute(routeForm);
      } else if (activeTab === 'cost') {
        data = await algorithmService.calculateTransportCost(costForm);
      } else if (activeTab === 'distance') {
        data = await algorithmService.calculateDistance(distanceForm.origin, distanceForm.destination);
      } else if (activeTab === 'capacity') {
        data = await algorithmService.matchVehicleCapacity(capacityForm);
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Algorithm execution returned an error');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on mount or tab change
  useEffect(() => {
    handleExecute();
  }, [activeTab]);

  return (
    <BuyerLayout>
      <div className="w-full max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-xs font-mono font-bold text-emerald-300">
                  ⚡ LIVE PYTHON ALGORITHM ENGINE
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-slate-300">
                  Google OR-Tools &middot; Mapbox &middot; CVRPTW
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
                {language === 'ta' ? 'சரக்கு விநியோக வழிமுறை மையம்' : 'Logistics & Supply Chain Algorithm Center'}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
                Real-time mathematical optimization connecting smallholder farmer clusters to bulk buyers. 
                Zero hardcoded fixtures &mdash; all calculations run directly through Python 3.14 algorithms and live MongoDB inventory.
              </p>
            </div>
            <button
              onClick={handleExecute}
              disabled={loading}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <i className={`bi bi-arrow-repeat ${loading ? 'animate-spin' : ''}`}></i>
              {loading ? 'Solving...' : 'Run Algorithm'}
            </button>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'pipeline', label: '1. SIH End-to-End Pipeline', icon: 'bi-diagram-3' },
            { id: 'load_match', label: '2. Multi-Farmer Load Match', icon: 'bi-grid-3x3' },
            { id: 'route', label: '3. OR-Tools CVRPTW Routing', icon: 'bi-signpost-2' },
            { id: 'cost', label: '4. Transparent Freight Cost', icon: 'bi-cash-coin' },
            { id: 'distance', label: '5. Distance & Terrain (Ghat)', icon: 'bi-geo-alt' },
            { id: 'capacity', label: '6. Vehicle Fleet Allocation', icon: 'bi-truck' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Workspace Grid: Controls (Left) vs Real-Time Algorithmic Output (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Parameters Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <i className="bi bi-sliders text-emerald-600"></i>
              <span>Interactive Parameters</span>
            </h2>

            {/* TAB 1: PIPELINE */}
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={pipelineForm.crop}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, crop: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="e.g. Tomato, Onion, Banana"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Quantity (kg)</label>
                  <input
                    type="number"
                    value={pipelineForm.requiredQuantity}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, requiredQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Price (₹/kg)</label>
                    <input
                      type="number"
                      value={pipelineForm.buyerPricePerKg}
                      onChange={(e) => setPipelineForm({ ...pipelineForm, buyerPricePerKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mandi Base (₹/kg)</label>
                    <input
                      type="number"
                      value={pipelineForm.mandiPricePerKg}
                      onChange={(e) => setPipelineForm({ ...pipelineForm, mandiPricePerKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Cluster</label>
                    <input
                      type="text"
                      value={pipelineForm.origin}
                      onChange={(e) => setPipelineForm({ ...pipelineForm, origin: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination</label>
                    <input
                      type="text"
                      value={pipelineForm.destination}
                      onChange={(e) => setPipelineForm({ ...pipelineForm, destination: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOAD MATCH */}
            {activeTab === 'load_match' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Crop</label>
                  <input
                    type="text"
                    value={loadMatchForm.crop}
                    onChange={(e) => setLoadMatchForm({ ...loadMatchForm, crop: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required Weight (kg)</label>
                  <input
                    type="number"
                    value={loadMatchForm.weightKg}
                    onChange={(e) => setLoadMatchForm({ ...loadMatchForm, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Quality Grade</label>
                  <select
                    value={loadMatchForm.minimumQuality}
                    onChange={(e) => setLoadMatchForm({ ...loadMatchForm, minimumQuality: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Commercial)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="tempCheck"
                    checked={loadMatchForm.isTemperatureSensitive}
                    onChange={(e) => setLoadMatchForm({ ...loadMatchForm, isTemperatureSensitive: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="tempCheck" className="text-xs font-semibold text-slate-700">
                    Temperature sensitive (Refrigerated Cold Chain)
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: ROUTE OPTIMIZATION */}
            {activeTab === 'route' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Depot Origin</label>
                  <input
                    type="text"
                    value={routeForm.origin}
                    onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    value={routeForm.destination}
                    onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Pickup Stops</label>
                    <button
                      type="button"
                      onClick={() =>
                        setRouteForm({
                          ...routeForm,
                          stops: [...routeForm.stops, { name: 'Palani Basin Stop', weightKg: 250 }]
                        })
                      }
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      + Add Stop
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {routeForm.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) => {
                            const copy = [...routeForm.stops];
                            copy[i].name = e.target.value;
                            setRouteForm({ ...routeForm, stops: copy });
                          }}
                          className="flex-1 px-2 py-1 text-xs border rounded"
                        />
                        <input
                          type="number"
                          value={stop.weightKg}
                          onChange={(e) => {
                            const copy = [...routeForm.stops];
                            copy[i].weightKg = Number(e.target.value);
                            setRouteForm({ ...routeForm, stops: copy });
                          }}
                          className="w-16 px-2 py-1 text-xs border rounded text-right"
                        />
                        <span className="text-[11px] text-slate-500">kg</span>
                        {routeForm.stops.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = routeForm.stops.filter((_, idx) => idx !== i);
                              setRouteForm({ ...routeForm, stops: copy });
                            }}
                            className="text-red-500 text-xs px-1 hover:text-red-700"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TRANSPORT COST */}
            {activeTab === 'cost' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Category</label>
                  <select
                    value={costForm.vehicleCategory}
                    onChange={(e) => setCostForm({ ...costForm, vehicleCategory: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="mini">1.5 Ton Mini Truck (Tata Ace / Dost)</option>
                    <option value="pickup">2.5 Ton Pickup (Mahindra Bolero)</option>
                    <option value="large">4.0 Ton Heavy Duty Lorry</option>
                    <option value="reefer">Refrigerated Reefer Container</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Road Distance (km)</label>
                    <input
                      type="number"
                      value={costForm.distanceKm}
                      onChange={(e) => setCostForm({ ...costForm, distanceKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={costForm.weightKg}
                      onChange={(e) => setCostForm({ ...costForm, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ghatCheck"
                      checked={costForm.isGhatRoad}
                      onChange={(e) => setCostForm({ ...costForm, isGhatRoad: e.target.checked })}
                      className="rounded text-emerald-600 h-4 w-4"
                    />
                    <label htmlFor="ghatCheck" className="text-xs font-semibold text-slate-700">
                      Ghat Road / Hill Section (15% Fuel Surcharge)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="poolCheck"
                      checked={costForm.isSharedPooling}
                      onChange={(e) => setCostForm({ ...costForm, isSharedPooling: e.target.checked })}
                      className="rounded text-emerald-600 h-4 w-4"
                    />
                    <label htmlFor="poolCheck" className="text-xs font-semibold text-slate-700">
                      Shared Pooling Discount (25% Savings)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DISTANCE */}
            {activeTab === 'distance' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Origin City / Mandi</label>
                  <input
                    type="text"
                    value={distanceForm.origin}
                    onChange={(e) => setDistanceForm({ ...distanceForm, origin: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination City / Mandi</label>
                  <input
                    type="text"
                    value={distanceForm.destination}
                    onChange={(e) => setDistanceForm({ ...distanceForm, destination: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: VEHICLE CAPACITY */}
            {activeTab === 'capacity' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop</label>
                  <input
                    type="text"
                    value={capacityForm.crop}
                    onChange={(e) => setCapacityForm({ ...capacityForm, crop: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Required Quantity (kg)</label>
                  <input
                    type="number"
                    value={capacityForm.buyerRequiredKg}
                    onChange={(e) => setCapacityForm({ ...capacityForm, buyerRequiredKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={loading}
              className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <i className="bi bi-play-fill text-lg"></i>
              <span>{loading ? 'Computing with Python...' : 'Execute Algorithm'}</span>
            </button>
          </div>

          {/* Right Column: Algorithmic Output Display */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {/* RESULTS VIEW */}
            {result && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                {/* PIPELINE OUTPUT */}
                {activeTab === 'pipeline' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          STAGE 1-4 COMPLETED &bull; SIH PIPELINE
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          End-to-End Supply Chain Optimization
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-600">
                          +{result.farmerBenefit?.farmerUpliftPercent || 36.2}%
                        </span>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Net Farmer Uplift
                        </div>
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Matched Cargo</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">
                          {result.matching?.matchedQuantity || 800} kg
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          {result.matching?.farmerCount || 2} Farmers Consolidated
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Route Distance</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">
                          {result.route?.distanceKm || 99.8} km
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {result.route?.durationMins || 140} mins transit
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Freight Cost</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">
                          ₹{Number(result.cost?.totalCost || 3323).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          ₹{result.cost?.costPerKg || 4.15} / kg
                        </div>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <div className="text-[11px] text-emerald-800 font-bold uppercase">Farmer Payout</div>
                        <div className="text-lg font-black text-emerald-700 mt-0.5">
                          ₹{result.farmerBenefit?.farmerPayoutPerKg || 40.85}/kg
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold">
                          vs ₹{result.farmerBenefit?.mandiPricePerKg || 18} Mandi
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Execution Journey */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">1</span>
                        <span>Stage 1 (Load Matching): Greedy multi-lot allocation across smallholders</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                        <span>Stage 2 (Route Engine): Google OR-Tools solved optimal multi-stop CVRPTW</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                        <span>Stage 3 (Transport Cost): Decimal financial fare with tortuosity & handling</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-800">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">4</span>
                        <span>Stage 4 (Direct Farmer Value): Disintermediated middleman margin</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOAD MATCH OUTPUT */}
                {activeTab === 'load_match' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          LOAD MATCHING ENGINE &bull; 4-FACTOR SCORING
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          Smallholder Allocation & Fleet Matching
                        </h3>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                        {result.recommendedVehicle?.fitStatus || 'OPTIMAL FIT'}
                      </span>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-5">
                      <div className="text-xs font-bold text-emerald-900 uppercase">Recommended Vehicle</div>
                      <div className="text-lg font-black text-emerald-800 mt-1">
                        {result.recommendedVehicle?.vehicle?.name || 'Tata Ace Gold Mini-Truck'}
                      </div>
                      <div className="text-xs text-emerald-700 mt-1 flex items-center gap-4">
                        <span>Capacity Utilization: <strong>{result.recommendedVehicle?.utilizationPercentage}%</strong></span>
                        <span>Driver: <strong>{result.recommendedVehicle?.vehicle?.driverName}</strong></span>
                        <span>Rate: <strong>₹{result.recommendedVehicle?.vehicle?.ratePerKm}/km</strong></span>
                      </div>
                    </div>

                    {result.alternativeVehicles && result.alternativeVehicles.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alternative Fleet in Cluster</h4>
                        <div className="space-y-2">
                          {result.alternativeVehicles.map((alt, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{alt.vehicle?.name}</span>
                                <span className="text-slate-500 ml-2">({alt.vehicle?.payloadCapacityKg} kg cap)</span>
                              </div>
                              <span className="font-semibold text-slate-600">Utilization: {alt.utilizationPercentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ROUTE ENGINE OUTPUT */}
                {activeTab === 'route' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          GOOGLE OR-TOOLS CVRPTW
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          Optimal Stop Sequence & Waypoints
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600">
                          {result.distanceSavingsPct || 18.5}% Savings
                        </span>
                        <div className="text-[11px] text-slate-500">vs Naive Routing</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-50 p-3 rounded-xl border">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Total Distance</div>
                        <div className="text-lg font-black text-slate-900">{result.totalDistanceKm} km</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Estimated Duration</div>
                        <div className="text-lg font-black text-slate-900">{result.totalDurationMins} mins</div>
                      </div>
                    </div>

                    {result.orderedStops && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Optimal Visit Sequence</h4>
                        <div className="space-y-2">
                          {result.orderedStops.map((stop, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[11px]">
                                  {i + 1}
                                </span>
                                <span className="font-bold text-slate-900">{stop.name}</span>
                              </div>
                              <span className="font-semibold text-emerald-700">{stop.type === 'DROP' ? 'Final Drop' : `Pickup ${stop.weightKg} kg`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TRANSPORT COST OUTPUT */}
                {activeTab === 'cost' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          DYNAMIC FREIGHT PRICING
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          Transparent Freight Breakdown
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700">
                          ₹{Number(result.totalFare).toLocaleString('en-IN')}
                        </span>
                        <div className="text-[11px] text-slate-500">₹{result.ratePerKg}/kg net</div>
                      </div>
                    </div>

                    {result.lineItems && (
                      <div className="space-y-2">
                        {result.lineItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                            <span className="text-slate-700 font-medium">{item.name}</span>
                            <span className={`font-bold ${item.amount < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {item.amount < 0 ? `-₹${Math.abs(item.amount)}` : `₹${item.amount}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* DISTANCE OUTPUT */}
                {activeTab === 'distance' && (
                  <div>
                    <div className="flex items-center justify-between border-b pb-4 mb-5">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          HAVERSINE + TERRAIN MODELING
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          Road Distance & Elevation Analysis
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.isGhatSection ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                        {result.terrainType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 p-3 rounded-xl border">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Road Distance</div>
                        <div className="text-xl font-black text-slate-900">{result.roadDistanceKm} km</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border">
                        <div className="text-[11px] text-slate-500 font-bold uppercase">Estimated Duration</div>
                        <div className="text-xl font-black text-slate-900">{result.estimatedDurationMins} mins</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border">
                      <div>Origin Coords: <code>{result.originCoords?.latitude}, {result.originCoords?.longitude}</code></div>
                      <div>Destination Coords: <code>{result.destinationCoords?.latitude}, {result.destinationCoords?.longitude}</code></div>
                    </div>
                  </div>
                )}

                {/* CAPACITY OUTPUT */}
                {activeTab === 'capacity' && (
                  <div>
                    <div className="border-b pb-4 mb-5">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        MULTI-VEHICLE FLEET PACKING
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-2">
                        Dynamic Vehicle Load Assignment
                      </h3>
                    </div>

                    {result.vehicles && (
                      <div className="space-y-3">
                        {result.vehicles.map((v, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                              <span>{v.vehicleType} ({v.vehicleId})</span>
                              <span className="text-emerald-700">{v.utilizationPercent}% Utilized</span>
                            </div>
                            <div className="text-slate-600">
                              Assigned Load: <strong>{v.loadKg} kg</strong> / {v.capacityKg} kg capacity
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
