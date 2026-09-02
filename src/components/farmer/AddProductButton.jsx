import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PARTICLES = ['✨', '❇️', '⭐', '🌱', '✨', '✦'];

export default function AddProductButton({
  className = '',
  style = {},
  to = '/farmer/add-product',
  onClick,
  responsive = false,
  label = 'Add Product',
  shortLabel = 'Add',
  icon = 'bi-plus-lg'
}) {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [ripple, setRipple] = useState(null);
  const [burstParticles, setBurstParticles] = useState([]);

  const handleClick = (e) => {
    // 1. Calculate ripple origin relative to button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    setRipple({ id: Date.now(), x, y });

    // 2. Generate 6 directional sparkle particles radiating outwards
    const newParticles = PARTICLES.map((char, index) => {
      const angle = (index * 60 + (Math.random() * 20 - 10)) * (Math.PI / 180);
      const distance = 30 + Math.random() * 25;
      return {
        id: `${Date.now()}-${index}`,
        char,
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance}px`
      };
    });
    setBurstParticles(newParticles);

    // 3. Trigger active click animation state
    setIsClicked(true);

    if (onClick) {
      onClick(e);
    }

    // 4. Smooth navigation after user experiences the animation
    if (to) {
      e.preventDefault();
      setTimeout(() => {
        navigate(to);
      }, 230);
    }

    // Clean up animation states
    setTimeout(() => {
      setIsClicked(false);
      setBurstParticles([]);
      setRipple(null);
    }, 600);
  };

  return (
    <button
      type="button"
      className={`farm-btn-primary-cta ${isClicked ? 'farm-btn-clicked' : ''} ${className}`}
      style={style}
      onClick={handleClick}
      title="Add New Harvest Product"
      aria-label="Add Product"
    >
      {/* Inner overflow container for smooth radial ripple & shine */}
      <span className="farm-btn-inner-fx" aria-hidden="true">
        {ripple && (
          <span
            className="farm-btn-ripple"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          />
        )}
      </span>

      {/* Bursting floating particles */}
      {burstParticles.map((p) => (
        <span
          key={p.id}
          className="farm-sparkle-particle"
          style={{ '--tx': p.tx, '--ty': p.ty }}
          aria-hidden="true"
        >
          {p.char}
        </span>
      ))}

      {/* Button Content */}
      <span className="farm-btn-content">
        <i className={`bi ${icon}`}></i>
        {responsive ? (
          <>
            <span className="d-none d-sm-inline">{label}</span>
            <span className="d-inline d-sm-none">{shortLabel}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </span>
    </button>
  );
}
