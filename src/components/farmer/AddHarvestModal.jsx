/**
 * Add Harvest Popup & Mobile Bottom Sheet Modal
 * 4-Step Farmer Flow:
 * Step 1: Quantity (Stepper, Quick Chips, Exact/Estimated ranges, Bags & Boxes calculators)
 * Step 2: Quality (Good/Fresh, Average, Damaged)
 * Step 3: Current Harvest Photo (Camera take / Gallery upload, previews, reorder, remove)
 * Step 4: Review & Publish (Summary & Success animation)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import cropService from '../../services/cropService';

const DEFAULT_FALLBACK_CROP = {
  id: 'tomato',
  name: 'Tomato',
  tamilName: 'நாட்டு தக்காளி',
  image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
  typicalPricePerKg: 28
};

export default function AddHarvestModal({
  show,
  onClose,
  initialCrop = null,
  onSuccess
}) {
  const { addHarvest, farmerProfile } = useFarmer();
  const navigate = useNavigate();

  // Selected crop
  const [selectedCrop, setSelectedCrop] = useState(initialCrop || DEFAULT_FALLBACK_CROP);

  useEffect(() => {
    let isMounted = true;
    if (!initialCrop) {
      cropService.getCrops().then((list) => {
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setSelectedCrop(list[0]);
        }
      });
    }
    return () => { isMounted = false; };
  }, [initialCrop]);

  // Wizard Step: 1, 2, 3, 4, or 5 (Success)
  const [step, setStep] = useState(1);

  // Step 1: Quantity State
  const [quantity, setQuantity] = useState(100);
  const [isEstimated, setIsEstimated] = useState(false);
  const [estimatedRange, setEstimatedRange] = useState('100–250 kg');
  const [calcMode, setCalcMode] = useState('direct'); // 'direct', 'bags', 'boxes'
  const [bagCount, setBagCount] = useState(10);
  const [bagWeight, setBagWeight] = useState(25);
  const [boxCount, setBoxCount] = useState(5);
  const [boxWeight, setBoxWeight] = useState(10);

  // Step 2: Quality State
  const [quality, setQuality] = useState('Good / Fresh');

  // Step 3: Photo State (URLs created with URL.createObjectURL or fallbacks)
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Validation Error State
  const [errorMessage, setErrorMessage] = useState('');

  // When initialCrop changes
  useEffect(() => {
    if (initialCrop) {
      setSelectedCrop(initialCrop);
    }
  }, [initialCrop]);

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setStep(1);
      setUploadedPhotos([]);
      setErrorMessage('');
    }
  }, [show]);

  if (!show) return null;

  // Stepper handlers
  const handleQuantityIncrement = (delta) => {
    setErrorMessage('');
    setQuantity((prev) => Math.max(5, prev + delta));
  };

  // Bag & Box calculations
  const calculatedBagKg = bagCount * bagWeight;
  const calculatedBoxKg = boxCount * boxWeight;

  // File Upload Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedPhotos((prev) => [...prev, ...newPhotoUrls]);
    setErrorMessage('');
    e.target.value = '';
  };

  const handleRemovePhoto = (indexToRemove) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMovePhoto = (index, direction) => {
    setUploadedPhotos((prev) => {
      const copy = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Step 1 Validation & Transition
  const handleNextFromStep1 = () => {
    if (calcMode === 'direct') {
      if (!isEstimated) {
        if (!quantity || Number(quantity) <= 0 || isNaN(Number(quantity))) {
          setErrorMessage('Please enter a harvest quantity greater than 0 kg.');
          return;
        }
      } else {
        if (!estimatedRange) {
          setErrorMessage('Please select an estimated quantity range for your harvest.');
          return;
        }
      }
    } else if (calcMode === 'bags') {
      if (!bagCount || Number(bagCount) <= 0) {
        setErrorMessage('Please enter the number of bags (must be at least 1 bag).');
        return;
      }
      if (!bagWeight || Number(bagWeight) <= 0) {
        setErrorMessage('Please select the weight per bag.');
        return;
      }
    } else if (calcMode === 'boxes') {
      if (!boxCount || Number(boxCount) <= 0) {
        setErrorMessage('Please enter the number of boxes/crates (must be at least 1 box).');
        return;
      }
      if (!boxWeight || Number(boxWeight) <= 0) {
        setErrorMessage('Please select the weight per box/crate.');
        return;
      }
    }

    setErrorMessage('');
    setStep(2);
  };

  // Step 2 Validation & Transition
  const handleNextFromStep2 = () => {
    if (!quality) {
      setErrorMessage('Please select the quality grade of your crop (Good / Fresh, Average, or Damaged).');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  // Step 3 Validation & Transition
  const handleNextFromStep3 = () => {
    if (uploadedPhotos.length === 0) {
      setErrorMessage('Harvest Photo Required: Please take a photo or upload at least 1 actual photo of your harvested crop so buyers can verify the quality before placing bids!');
      return;
    }
    setErrorMessage('');
    setStep(4);
  };

  // Final Publish Handler with Full Form Verification
  const handlePublish = () => {
    if (!selectedCrop) {
      setErrorMessage('Please select a crop to publish.');
      return;
    }
    if (calcMode === 'direct' && !isEstimated && (!quantity || Number(quantity) <= 0)) {
      setErrorMessage('Please enter a harvest quantity greater than 0 kg.');
      setStep(1);
      return;
    }
    if (calcMode === 'direct' && isEstimated && !estimatedRange) {
      setErrorMessage('Please select an estimated quantity range.');
      setStep(1);
      return;
    }
    if (calcMode === 'bags' && (!bagCount || Number(bagCount) <= 0)) {
      setErrorMessage('Please enter the number of bags.');
      setStep(1);
      return;
    }
    if (calcMode === 'boxes' && (!boxCount || Number(boxCount) <= 0)) {
      setErrorMessage('Please enter the number of boxes/crates.');
      setStep(1);
      return;
    }
    if (!quality) {
      setErrorMessage('Please select the quality grade of your crop.');
      setStep(2);
      return;
    }
    if (uploadedPhotos.length === 0) {
      setErrorMessage('Harvest Photo Required: Please upload at least 1 actual photo of your harvest.');
      setStep(3);
      return;
    }

    const finalKg =
      calcMode === 'bags'
        ? calculatedBagKg
        : calcMode === 'boxes'
        ? calculatedBoxKg
        : isEstimated
        ? estimatedRange
        : quantity;

    // Use farmer-uploaded image as primary photo
    const finalImages =
      uploadedPhotos.length > 0
        ? uploadedPhotos
        : [selectedCrop?.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'];

    addHarvest({
      cropName: selectedCrop?.name || 'Crop',
      tamilName: selectedCrop?.tamilName || '',
      name: `${selectedCrop?.name || 'Harvest'} (${selectedCrop?.tamilName || ''})`,
      quantity: String(finalKg),
      unit: isEstimated && calcMode === 'direct' ? '' : 'kg',
      isEstimated: isEstimated || calcMode === 'bags' || calcMode === 'boxes',
      quality,
      images: finalImages,
      pricePerKg: selectedCrop?.typicalPricePerKg || 30,
      location: `${farmerProfile?.district || 'Dindigul'}, ${farmerProfile?.state || 'Tamil Nadu'}`
    });

    setErrorMessage('');
    setStep(5); // Show success screen
    if (onSuccess) onSuccess();
  };

  return (
    <div
      className="position-fixed inset-0 bg-dark bg-opacity-60 d-flex align-items-end align-items-md-center justify-content-center p-0 p-md-3 farm-animate-fade"
      style={{ zIndex: 1150, top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Click outside to close (desktop) */}
      <div
        className="position-absolute inset-0"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={onClose}
      ></div>

      {/* Main Dialog Box / Mobile Bottom Sheet */}
      <div
        className="bg-white rounded-top-5 rounded-md-4 w-100 shadow-2xl position-relative overflow-hidden d-flex flex-column"
        style={{
          maxWidth: '580px',
          maxHeight: '92vh',
          zIndex: 1155,
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Header Bar */}
        <div className="p-3 px-4 bg-light border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            {selectedCrop?.image && step < 5 && (
              <img
                src={selectedCrop.image}
                alt={selectedCrop.name}
                className="rounded-circle object-fit-cover shadow-xs border"
                style={{ width: '42px', height: '42px' }}
              />
            )}
            <div>
              <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                {step === 5 ? 'COMPLETED' : `STEP ${step} OF 4`}
              </span>
              <strong className="fs-5 text-dark">
                {step === 5
                  ? 'Harvest Published'
                  : `Add ${selectedCrop?.name || 'Crop'} Harvest`}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-light border-0 rounded-circle text-muted d-flex align-items-center justify-content-center"
            style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="w-100 bg-secondary-subtle" style={{ height: '4px' }}>
            <div
              className="bg-success transition"
              style={{
                height: '100%',
                width: `${(step / 4) * 100}%`,
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-3 p-md-4 overflow-y-auto flex-grow-1">
          {/* Validation Alert / Missing Field Message */}
          {errorMessage && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 shadow-xs border-danger farm-animate-fade py-2 px-3"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill fs-5 text-danger flex-shrink-0"></i>
              <div className="flex-grow-1 small fw-bold">
                {errorMessage}
              </div>
              <button
                type="button"
                className="btn-close btn-sm"
                onClick={() => setErrorMessage('')}
                aria-label="Dismiss error"
              ></button>
            </div>
          )}

          {/* ===================================================================
              STEP 1: QUANTITY
              =================================================================== */}
          {step === 1 && (
            <div className="farm-animate-fade">
              <h2 className="fs-4 fw-bold text-dark mb-1">How much did you harvest?</h2>
              <p className="text-muted small mb-4">
                Enter your harvest weight. Exact weight is not required — estimates are accepted!
              </p>

              {/* Mode Toggle: Exact Kg vs Don't Know Exact vs Bags/Boxes */}
              <div className="d-flex gap-2 p-1 bg-light rounded-pill mb-4 border">
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${
                    calcMode === 'direct' && !isEstimated ? 'btn-success text-white shadow-xs' : 'btn-light text-muted'
                  }`}
                  onClick={() => {
                    setCalcMode('direct');
                    setIsEstimated(false);
                  }}
                >
                  Exact Weight
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${
                    calcMode === 'direct' && isEstimated ? 'btn-success text-white shadow-xs' : 'btn-light text-muted'
                  }`}
                  onClick={() => {
                    setCalcMode('direct');
                    setIsEstimated(true);
                  }}
                >
                  I don't know exact
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${
                    calcMode === 'bags' || calcMode === 'boxes' ? 'btn-success text-white shadow-xs' : 'btn-light text-muted'
                  }`}
                  onClick={() => setCalcMode('bags')}
                >
                  Bags / Boxes
                </button>
              </div>

              {/* Exact Kg Mode: Large Stepper */}
              {calcMode === 'direct' && !isEstimated && (
                <div>
                  <div className="p-4 bg-light rounded-4 border text-center mb-4">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-2">
                      HARVEST QUANTITY
                    </span>
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-circle fw-black fs-4 d-flex align-items-center justify-content-center shadow-xs"
                        style={{ width: '56px', height: '56px' }}
                        onClick={() => handleQuantityIncrement(-25)}
                      >
                        −
                      </button>

                      <div className="px-3">
                        <span className="fw-black text-dark font-monospace" style={{ fontSize: '3rem' }}>
                          {quantity}
                        </span>
                        <span className="text-muted fs-4 ms-1 fw-bold">kg</span>
                      </div>

                      <button
                        type="button"
                        className="btn btn-success text-white rounded-circle fw-black fs-4 d-flex align-items-center justify-content-center shadow-xs"
                        style={{ width: '56px', height: '56px' }}
                        onClick={() => handleQuantityIncrement(25)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Chips */}
                  <span className="text-muted small fw-bold d-block mb-2">QUICK SELECTION:</span>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {[50, 100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`btn btn-sm py-2 px-3 rounded-pill fw-bold ${
                          quantity === preset
                            ? 'btn-success text-white'
                            : 'btn-outline-secondary bg-white'
                        }`}
                        onClick={() => setQuantity(preset)}
                      >
                        {preset} kg
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Approximate Ranges Mode */}
              {calcMode === 'direct' && isEstimated && (
                <div>
                  <div className="alert alert-warning-subtle text-warning-emphasis d-flex align-items-center gap-2 p-2 px-3 rounded-3 mb-3 small">
                    <i className="bi bi-info-circle-fill fs-5"></i>
                    <span>Select an approximate range. Buyers will negotiate final weight upon mandi pickup.</span>
                  </div>

                  <div className="row g-2 mb-4">
                    {[
                      'Less than 25 kg',
                      '25–50 kg',
                      '50–100 kg',
                      '100–250 kg',
                      '250–500 kg',
                      'More than 500 kg'
                    ].map((range) => (
                      <div key={range} className="col-6">
                        <div
                          className={`p-3 rounded-3 text-center cursor-pointer transition border ${
                            estimatedRange === range
                              ? 'bg-success-subtle border-success text-success fw-bold shadow-xs'
                              : 'bg-light hover-bg-white text-dark'
                          }`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEstimatedRange(range)}
                        >
                          <i className="bi bi-box-seam me-1 small"></i>
                          <span>{range}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-light rounded-3 border text-center">
                    <span className="text-muted small">Estimated Quantity:</span>
                    <strong className="fs-5 text-success d-block">{estimatedRange}</strong>
                  </div>
                </div>
              )}

              {/* Bags / Boxes Calculator Mode */}
              {(calcMode === 'bags' || calcMode === 'boxes') && (
                <div>
                  <div className="d-flex gap-2 mb-3">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 rounded-pill ${calcMode === 'bags' ? 'btn-success fw-bold' : 'btn-light border'}`}
                      onClick={() => setCalcMode('bags')}
                    >
                      <i className="bi bi-bag me-1"></i> I have bags (சாக்கு பை)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 rounded-pill ${calcMode === 'boxes' ? 'btn-success fw-bold' : 'btn-light border'}`}
                      onClick={() => setCalcMode('boxes')}
                    >
                      <i className="bi bi-box me-1"></i> I have boxes (பெட்டி)
                    </button>
                  </div>

                  {calcMode === 'bags' ? (
                    <div className="p-3 bg-light rounded-4 border mb-3">
                      <div className="row g-3 align-items-center">
                        <div className="col-6">
                          <label className="form-label small fw-bold text-muted">Number of Bags</label>
                          <input
                            type="number"
                            className="form-control form-control-lg text-center fw-bold"
                            value={bagCount}
                            onChange={(e) => setBagCount(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-bold text-muted">Kg per Bag</label>
                          <select
                            className="form-select form-select-lg text-center fw-bold"
                            value={bagWeight}
                            onChange={(e) => setBagWeight(Number(e.target.value))}
                          >
                            <option value={20}>20 kg / bag</option>
                            <option value={25}>25 kg / bag (Standard)</option>
                            <option value={50}>50 kg / bag (Gunny)</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-center mt-3 pt-3 border-top">
                        <span className="text-muted small d-block">ESTIMATED TOTAL:</span>
                        <strong className="fs-3 text-success font-monospace">
                          {bagCount} bags × {bagWeight} kg = {calculatedBagKg} kg
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-light rounded-4 border mb-3">
                      <div className="row g-3 align-items-center">
                        <div className="col-6">
                          <label className="form-label small fw-bold text-muted">Number of Boxes / Crates</label>
                          <input
                            type="number"
                            className="form-control form-control-lg text-center fw-bold"
                            value={boxCount}
                            onChange={(e) => setBoxCount(Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-bold text-muted">Kg per Box</label>
                          <select
                            className="form-select form-select-lg text-center fw-bold"
                            value={boxWeight}
                            onChange={(e) => setBoxWeight(Number(e.target.value))}
                          >
                            <option value={10}>10 kg / crate</option>
                            <option value={15}>15 kg / crate</option>
                            <option value={25}>25 kg / crate (Tomato)</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-center mt-3 pt-3 border-top">
                        <span className="text-muted small d-block">ESTIMATED TOTAL:</span>
                        <strong className="fs-3 text-success font-monospace">
                          {boxCount} boxes × {boxWeight} kg = {calculatedBoxKg} kg
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-success w-100 py-3 rounded-3 fw-bold fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleNextFromStep1}
                >
                  <span>Next: Crop Quality</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              STEP 2: QUALITY
              =================================================================== */}
          {step === 2 && (
            <div className="farm-animate-fade">
              <h2 className="fs-4 fw-bold text-dark mb-1">How is your crop?</h2>
              <p className="text-muted small mb-4">
                Be honest with your grading to establish high buyer trust ratings.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                {/* 1. Good / Fresh */}
                <div
                  className={`p-3 rounded-4 border-2 transition cursor-pointer d-flex align-items-center gap-3 ${
                    quality === 'Good / Fresh'
                      ? 'border-success bg-success-subtle shadow-sm'
                      : 'border bg-light'
                  }`}
                  style={{ cursor: 'pointer', borderStyle: 'solid' }}
                  onClick={() => {
                    setQuality('Good / Fresh');
                    setErrorMessage('');
                  }}
                >
                  <div className="fs-1">🟢</div>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-6 d-block">Good / Fresh (முதல் தரம்)</strong>
                    <span className="text-muted small d-block">
                      Cleanly harvested, firm texture, uniform sizing. Sells at highest mandi rates.
                    </span>
                  </div>
                  {quality === 'Good / Fresh' && (
                    <i className="bi bi-check-circle-fill text-success fs-4"></i>
                  )}
                </div>

                {/* 2. Average */}
                <div
                  className={`p-3 rounded-4 border-2 transition cursor-pointer d-flex align-items-center gap-3 ${
                    quality === 'Average'
                      ? 'border-warning bg-warning-subtle shadow-sm'
                      : 'border bg-light'
                  }`}
                  style={{ cursor: 'pointer', borderStyle: 'solid' }}
                  onClick={() => {
                    setQuality('Average');
                    setErrorMessage('');
                  }}
                >
                  <div className="fs-1">🟡</div>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-6 d-block">Average (நடுத்தர தரம்)</strong>
                    <span className="text-muted small d-block">
                      Standard commercial grade with minor shape or cosmetic color variations.
                    </span>
                  </div>
                  {quality === 'Average' && (
                    <i className="bi bi-check-circle-fill text-warning-emphasis fs-4"></i>
                  )}
                </div>

                {/* 3. Damaged */}
                <div
                  className={`p-3 rounded-4 border-2 transition cursor-pointer d-flex align-items-center gap-3 ${
                    quality === 'Damaged'
                      ? 'border-danger bg-danger-subtle shadow-sm'
                      : 'border bg-light'
                  }`}
                  style={{ cursor: 'pointer', borderStyle: 'solid' }}
                  onClick={() => {
                    setQuality('Damaged');
                    setErrorMessage('');
                  }}
                >
                  <div className="fs-1">🔴</div>
                  <div className="flex-grow-1">
                    <strong className="text-dark fs-6 d-block">Damaged / Bulk Processing</strong>
                    <span className="text-muted small d-block">
                      Bruised, overripe, or split skin. Suitable for juice/sauce processing factories.
                    </span>
                  </div>
                  {quality === 'Damaged' && (
                    <i className="bi bi-check-circle-fill text-danger fs-4"></i>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-light border py-3 px-4 rounded-3 fw-bold"
                  onClick={() => {
                    setErrorMessage('');
                    setStep(1);
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-success flex-grow-1 py-3 rounded-3 fw-bold fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleNextFromStep2}
                >
                  <span>Next: Harvest Photos</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              STEP 3: CURRENT HARVEST PHOTO
              =================================================================== */}
          {step === 3 && (
            <div className="farm-animate-fade">
              <h2 className="fs-4 fw-bold text-dark mb-1">Show your harvested crop</h2>
              <p className="text-muted small mb-3">
                Upload a current photo so buyers can see your actual harvest.
              </p>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="d-none"
                onChange={handleFileChange}
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="d-none"
                onChange={handleFileChange}
              />

              {/* 2 Large Action Buttons */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-success w-100 p-3 rounded-4 fw-bold d-flex flex-column align-items-center justify-content-center gap-2 border-2"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <span className="fs-1">📷</span>
                    <span className="fs-6">Take Photo</span>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Open Camera
                    </span>
                  </button>
                </div>

                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 p-3 rounded-4 fw-bold d-flex flex-column align-items-center justify-content-center gap-2 border-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="fs-1">🖼️</span>
                    <span className="fs-6">Upload Photo</span>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Select from Gallery
                    </span>
                  </button>
                </div>
              </div>

              {/* Image Previews & Management */}
              {uploadedPhotos.length > 0 ? (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <strong className="text-dark small">
                      Selected Photos ({uploadedPhotos.length}):
                    </strong>
                    <span className="text-muted small">First photo is cover</span>
                  </div>

                  <div className="row g-2">
                    {uploadedPhotos.map((photoUrl, idx) => (
                      <div key={idx} className="col-4 position-relative">
                        <div className="border rounded-3 overflow-hidden position-relative" style={{ height: '100px' }}>
                          <img
                            src={photoUrl}
                            alt={`Harvest ${idx + 1}`}
                            className="w-100 h-100 object-fit-cover"
                          />

                          {/* Primary Badge */}
                          {idx === 0 && (
                            <span className="position-absolute top-0 start-0 badge bg-success m-1 small" style={{ fontSize: '0.62rem' }}>
                              Cover
                            </span>
                          )}

                          {/* Remove Button */}
                          <button
                            type="button"
                            className="position-absolute top-0 end-0 btn btn-danger btn-xs m-1 rounded-circle p-1 d-flex align-items-center justify-content-center"
                            style={{ width: '22px', height: '22px' }}
                            onClick={() => handleRemovePhoto(idx)}
                            title="Remove image"
                          >
                            <i className="bi bi-x"></i>
                          </button>

                          {/* Reorder Buttons */}
                          <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-50 d-flex justify-content-between px-1 py-0">
                            <button
                              type="button"
                              className="btn btn-link btn-xs text-white p-0 text-decoration-none"
                              disabled={idx === 0}
                              onClick={() => handleMovePhoto(idx, -1)}
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              className="btn btn-link btn-xs text-white p-0 text-decoration-none"
                              disabled={idx === uploadedPhotos.length - 1}
                              onClick={() => handleMovePhoto(idx, 1)}
                            >
                              ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Tile */}
                    <div className="col-4">
                      <div
                        className="border border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center text-muted p-2 cursor-pointer h-100 hover-bg-light"
                        style={{ height: '100px', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="bi bi-plus-circle fs-4 text-success"></i>
                        <span className="small mt-1 text-center" style={{ fontSize: '0.7rem' }}>
                          + Add More
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-light rounded-4 border text-center mb-4">
                  <i className="bi bi-camera-fill text-muted fs-3 mb-2 d-block"></i>
                  <strong className="text-dark small d-block">No photos uploaded yet</strong>
                  <span className="text-muted small">
                    Snap a quick photo from your phone. Listings with actual harvest photos get 3x faster buyer offers!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-2 mt-4 pt-2">
                <button
                  type="button"
                  className="btn btn-light border py-3 px-4 rounded-3 fw-bold"
                  onClick={() => {
                    setErrorMessage('');
                    setStep(2);
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-success flex-grow-1 py-3 rounded-3 fw-bold fs-6 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleNextFromStep3}
                >
                  <span>Next: Review &amp; Publish</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              STEP 4: REVIEW
              =================================================================== */}
          {step === 4 && (
            <div className="farm-animate-fade">
              <h2 className="fs-4 fw-bold text-dark mb-1">Review Your Harvest</h2>
              <p className="text-muted small mb-4">
                Confirm your harvest details before publishing to Dindigul and Tamil Nadu buyers.
              </p>

              {/* Review Card */}
              <div className="p-3 bg-light rounded-4 border mb-4">
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                  <img
                    src={
                      uploadedPhotos.length > 0
                        ? uploadedPhotos[0]
                        : selectedCrop?.image || ''
                    }
                    alt={selectedCrop?.name}
                    className="rounded-3 object-fit-cover shadow-xs border"
                    style={{ width: '70px', height: '70px' }}
                  />
                  <div>
                    <h3 className="fs-5 fw-bold text-dark mb-1">
                      {selectedCrop?.name} <span className="text-muted fs-6 fw-normal">({selectedCrop?.tamilName})</span>
                    </h3>
                    <span className="badge bg-success-subtle text-success small">
                      <i className="bi bi-patch-check-fill me-1"></i> Ready for Direct Mandi
                    </span>
                  </div>
                </div>

                <div className="row g-2 small">
                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>CROP</span>
                    <strong className="text-dark fs-6">{selectedCrop?.name}</strong>
                  </div>

                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>QUANTITY</span>
                    <strong className="text-success fs-6 font-monospace">
                      {calcMode === 'bags'
                        ? `${calculatedBagKg} kg (${bagCount} bags)`
                        : calcMode === 'boxes'
                        ? `${calculatedBoxKg} kg (${boxCount} boxes)`
                        : isEstimated
                        ? `${estimatedRange} (Estimated)`
                        : `${quantity} kg (Exact)`}
                    </strong>
                  </div>

                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>QUALITY</span>
                    <strong className="text-dark fs-6">{quality}</strong>
                  </div>

                  <div className="col-6">
                    <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>LOCATION</span>
                    <strong className="text-dark fs-6">
                      {farmerProfile?.district || 'Dindigul'}, {farmerProfile?.state || 'Tamil Nadu'}
                    </strong>
                  </div>

                  <div className="col-12 mt-2 pt-2 border-top">
                    <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>HARVEST PHOTOS</span>
                    {uploadedPhotos.length > 0 ? (
                      <div className="d-flex gap-2 mt-1">
                        {uploadedPhotos.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt=""
                            className="rounded-2 border object-fit-cover"
                            style={{ width: '48px', height: '48px' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted small">Standard crop photo will be used</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-light border py-3 px-4 rounded-3 fw-bold"
                  onClick={() => {
                    setErrorMessage('');
                    setStep(3);
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-success flex-grow-1 py-3 rounded-3 fw-bold fs-5 shadow-lg d-flex align-items-center justify-content-center gap-2"
                  onClick={handlePublish}
                >
                  <i className="bi bi-send-fill"></i>
                  <span>Publish My Harvest</span>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              STEP 5: SUCCESS SCREEN
              =================================================================== */}
          {step === 5 && (
            <div className="text-center py-4 farm-animate-fade">
              <div
                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="bi bi-check-lg" style={{ fontSize: '3rem' }}></i>
              </div>

              <h2 className="fs-3 fw-bold text-dark mb-2">
                🌱 Harvest Added Successfully!
              </h2>

              <p className="text-muted mb-4 fs-6">
                Your harvest is now visible to buyers across Dindigul and Tamil Nadu.
              </p>

              <div className="d-flex flex-column gap-2 max-w-xs mx-auto" style={{ maxWidth: '320px' }}>
                <button
                  type="button"
                  className="btn btn-success fw-bold py-3 rounded-3 fs-6 shadow-sm"
                  onClick={() => {
                    onClose();
                    navigate('/farmer/harvest');
                  }}
                >
                  View My Harvest
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary fw-bold py-2 rounded-3"
                  onClick={() => {
                    setStep(1);
                    setUploadedPhotos([]);
                  }}
                >
                  + Add Another Crop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
