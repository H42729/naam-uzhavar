/**
 * Delivery Proof Confirmation Modal Component
 * Allows driver to capture receiver name, upload a delivery photo,
 * draw a digital signature on an HTML5 canvas, and finalize delivery.
 */

import React, { useState, useRef, useEffect } from 'react';

export default function DeliveryProofModal({
  show,
  onClose,
  delivery,
  onSubmitProof,
  isSubmitting
}) {
  const [receiverName, setReceiverName] = useState('');
  const [notes, setNotes] = useState('All 10 crates received intact in fresh condition.');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (delivery?.buyer?.receiverName) {
      setReceiverName(delivery.buyer.receiverName);
    }
  }, [delivery]);

  // Initialize Canvas
  useEffect(() => {
    if (show && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [show]);

  if (!show) return null;

  // Touch & Mouse Signature Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let signatureData = null;
    if (canvasRef.current && hasSignature) {
      signatureData = canvasRef.current.toDataURL('image/png');
    }

    onSubmitProof({
      receiverName: receiverName || 'Sundar Rajan',
      signature: signatureData,
      photoUrl: photoPreview,
      notes
    });
  };

  return (
    <div
      className="position-fixed inset-0 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3"
      style={{ zIndex: 1200, top: 0, left: 0, right: 0, bottom: 0, backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-4 shadow-2xl w-100 overflow-hidden d-flex flex-column"
        style={{ maxWidth: '520px', maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-light">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-success text-white rounded-3 p-1 px-2 d-flex align-items-center justify-content-center"
              style={{ height: '32px' }}
            >
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <strong className="fs-6 text-dark d-block">DELIVERY CONFIRMATION</strong>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                Order #{delivery?.id || 'ORD-1024'} • {delivery?.totalWeight} kg
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={isSubmitting}
          ></button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto">
          {/* Receiver Name */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1">
              Receiver Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Full name of person receiving produce"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              required
            />
            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
              Depot Storekeeper or Buyer Authorized Representative
            </span>
          </div>

          {/* Delivery Photo */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1">
              Delivery Proof Photo
            </label>
            <div className="d-flex align-items-center gap-3">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Delivery Proof"
                  className="rounded-3 border object-fit-cover shadow-xs"
                  style={{ width: '80px', height: '80px' }}
                />
              )}
              <div className="flex-grow-1">
                <label className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 cursor-pointer">
                  <i className="bi bi-camera-fill text-primary"></i>
                  <span>Take / Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handlePhotoUpload}
                  />
                </label>
                <span className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                  Photo of unloaded crates at buyer's receiving bay
                </span>
              </div>
            </div>
          </div>

          {/* Touch / Stylus Signature Pad */}
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="form-label small fw-bold text-dark mb-0">
                Receiver Signature (Optional)
              </label>
              {hasSignature && (
                <button
                  type="button"
                  className="btn btn-link btn-xs text-danger p-0 text-decoration-none"
                  onClick={clearSignature}
                >
                  <i className="bi bi-eraser me-1"></i> Clear
                </button>
              )}
            </div>

            <div
              className="border rounded-3 bg-light position-relative"
              style={{ height: '120px', cursor: 'crosshair', touchAction: 'none' }}
            >
              <canvas
                ref={canvasRef}
                width={450}
                height={120}
                className="w-100 h-100"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div
                  className="position-absolute inset-0 d-flex align-items-center justify-content-center text-muted pointer-events-none opacity-50 small"
                  style={{ top: '45%' }}
                >
                  <i className="bi bi-pen me-1"></i> Sign here on touch screen or with mouse
                </div>
              )}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1">Delivery Notes</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Crates inspected and verified by ABC Retail"
            />
          </div>

          {/* Confirmation Action Button */}
          <div className="pt-2 border-top d-flex justify-content-end gap-2">
            <button
              type="button"
              className="drv-btn drv-btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="drv-btn drv-btn-primary px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Confirm Delivery</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
