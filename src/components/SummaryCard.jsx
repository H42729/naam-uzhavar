import React from 'react';

export default function SummaryCard({
  title,
  value,
  subtext,
  icon,
  colorScheme = 'green',
  onClick
}) {
  const colorMap = {
    green: {
      bg: '#f0fdf4',
      text: '#15803d',
      border: '#bbf7d0'
    },
    blue: {
      bg: '#eff6ff',
      text: '#2563eb',
      border: '#bfdbfe'
    },
    amber: {
      bg: '#fffbeb',
      text: '#d97706',
      border: '#fde68a'
    },
    purple: {
      bg: '#faf5ff',
      text: '#7e22ce',
      border: '#e9d5ff'
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.green;

  return (
    <div
      className="bd-kpi-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={onClick ? `View ${title}` : undefined}
    >
      <div className="bd-kpi-top">
        <span className="bd-kpi-label text-truncate me-1">{title}</span>
        <div
          className="bd-kpi-icon flex-shrink-0"
          style={{
            backgroundColor: scheme.bg,
            color: scheme.text,
            border: `1px solid ${scheme.border}`
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
      <div className="bd-kpi-value text-truncate">{value}</div>
      <div className="bd-kpi-sub text-truncate">
        <i className="bi bi-arrow-up-right text-success small me-1"></i>
        <span>{subtext}</span>
      </div>
    </div>
  );
}
