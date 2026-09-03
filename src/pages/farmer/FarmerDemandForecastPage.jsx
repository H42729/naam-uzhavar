/**
 * AI Demand Forecast Page
 * Route: /farmer/demand-forecast
 * Dedicated page for farmer regional crop demand forecasts, expected mandi price benchmarks, and harvest timing advice.
 */

import React, { useState } from 'react';
import FarmerLayout from '../../components/farmer/FarmerLayout';

const CROP_FORECASTS = [
  {
    id: 'fc-tomato',
    crop: 'Tomato (நாட்டு தக்காளி)',
    demand: 'High Demand',
    demandColor: 'success',
    badgeText: '🟢 High Demand',
    trend: '+18% Buyer Inquiries',
    currentMandiRate: '₹28 / kg',
    projectedRange: '₹28 - ₹32 / kg',
    mandiHub: 'Dindigul & Madurai Wholesale Hubs',
    advice: 'High deficit in southern retail chains. Ideal harvest and sell window for the next 5 days.'
  },
  {
    id: 'fc-onion',
    crop: 'Small Red Onion (சின்ன வெங்காயம்)',
    demand: 'Medium Demand',
    demandColor: 'warning',
    badgeText: '🟡 Medium Demand',
    trend: 'Stable Consumption',
    currentMandiRate: '₹38 / kg',
    projectedRange: '₹36 - ₹40 / kg',
    mandiHub: 'Dindigul & Oddanchatram Mandis',
    advice: 'Steady hotel and domestic consumption. Well-cured dry lots will command premium price.'
  },
  {
    id: 'fc-banana',
    crop: 'Banana (வாழைக்காய் / பழம்)',
    demand: 'High Demand',
    demandColor: 'success',
    badgeText: '🟢 High Demand',
    trend: '+22% Festival Boost',
    currentMandiRate: '₹24 / kg',
    projectedRange: '₹24 - ₹28 / kg',
    mandiHub: 'Batlagundu & Theni Corridors',
    advice: 'Upcoming festival season driving bulk procurement for catering and retail packs.'
  },
  {
    id: 'fc-potato',
    crop: 'Potato (உருளைக்கிழங்கு)',
    demand: 'Medium Demand',
    demandColor: 'warning',
    badgeText: '🟡 Medium Demand',
    trend: 'Balanced Influx',
    currentMandiRate: '₹26 / kg',
    projectedRange: '₹25 - ₹28 / kg',
    mandiHub: 'Dindigul Central Market',
    advice: 'Steady demand from snack food makers and regional restaurant kitchens.'
  },
  {
    id: 'fc-carrot',
    crop: 'Carrot (கேரட்)',
    demand: 'High Demand',
    demandColor: 'success',
    badgeText: '🟢 High Demand',
    trend: '+14% Cold Storage Outflow',
    currentMandiRate: '₹46 / kg',
    projectedRange: '₹45 - ₹52 / kg',
    mandiHub: 'Nilgiris - Dindigul Fast Corridor',
    advice: 'Grade A washed carrots commanding immediate supermarket bids.'
  },
  {
    id: 'fc-chilli',
    crop: 'Green Chilli (பச்சை மிளகாய்)',
    demand: 'High Demand',
    demandColor: 'success',
    badgeText: '🟢 High Demand',
    trend: '+16% Spicy Export Pipeline',
    currentMandiRate: '₹65 / kg',
    projectedRange: '₹62 - ₹70 / kg',
    mandiHub: 'Madurai & Tuticorin Cargo Line',
    advice: 'Hot varieties in high demand for pickle manufacturers and export packaging.'
  }
];

export default function FarmerDemandForecastPage() {
  const [selectedForecast, setSelectedForecast] = useState(CROP_FORECASTS[0]);

  return (
    <FarmerLayout>
      <div className="w-100 farm-animate-fade">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              MARKETPLACE INTELLIGENCE
            </div>
            <h1 className="fw-black text-dark fs-3 mb-0">AI Demand Forecast (சந்தை தேவை கணிப்பு)</h1>
          </div>

          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-cpu-fill me-1"></i> Dindigul &amp; Tamil Nadu Mandi Telemetry
          </span>
        </div>

        {/* Overview Banner */}
        <div className="p-3 bg-light rounded-4 border mb-4 small d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center p-2 flex-shrink-0"
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-graph-up-arrow fs-5"></i>
          </div>
          <div>
            <strong className="text-dark d-block">Direct Market Price Arbitrage Advisory:</strong>
            <span className="text-muted">
              Prices reflect live buyer quotes on Naam Uzhavar platform compared with local APMC mandi arrivals across Dindigul, Madurai, and Oddanchatram.
            </span>
          </div>
        </div>

        {/* Demand Cards Grid */}
        <div className="row g-3 mb-4">
          {CROP_FORECASTS.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div
                className={`farm-card p-4 rounded-4 bg-white border h-100 d-flex flex-column shadow-xs cursor-pointer transition ${
                  selectedForecast.id === item.id ? 'border-success shadow-md' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedForecast(item)}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span
                    className={`badge ${
                      item.demandColor === 'success'
                        ? 'bg-success-subtle text-success border border-success-subtle'
                        : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                    } fw-bold rounded-pill px-3 py-1`}
                  >
                    {item.badgeText}
                  </span>
                  <span className="text-muted small font-monospace">{item.trend}</span>
                </div>

                <strong className="fs-5 text-dark d-block mb-1">{item.crop}</strong>
                <span className="text-muted small d-block mb-3">{item.mandiHub}</span>

                <div className="p-3 bg-light rounded-3 mb-3 small">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Current Platform Rate:</span>
                    <strong className="text-dark font-monospace fs-6">{item.currentMandiRate}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">7-Day Projected Range:</span>
                    <strong className="text-success font-monospace fs-6">{item.projectedRange}</strong>
                  </div>
                </div>

                <p className="text-muted small mb-0 mt-auto">
                  <i className="bi bi-lightbulb-fill text-warning me-1"></i>
                  <strong>Tip:</strong> {item.advice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FarmerLayout>
  );
}
