/**
 * Driver Notifications & Fleet Alerts Page
 * Route: /driver/notifications
 * Delivers highway advisories, trip assignments, payment receipts, and digital gate pass notifications.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DriverLayout from '../../components/driver/DriverLayout';
import { DRIVER_NOTIFICATIONS } from '../../data/driverData';

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = useState(DRIVER_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Fleet Alerts
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">Notifications</h1>
          </div>

          <button
            type="button"
            className="drv-btn drv-btn-outline btn-sm"
            onClick={markAllRead}
          >
            <i className="bi bi-check2-all"></i>
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Notifications Stream */}
        <div className="d-flex flex-column gap-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`drv-card p-3 shadow-xs d-flex align-items-start gap-3 ${
                notif.read ? 'opacity-75' : 'border-start border-4 border-warning bg-warning-subtle'
              }`}
            >
              <div
                className={`rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${
                  notif.type === 'payment'
                    ? 'bg-success text-white'
                    : notif.type === 'weather'
                    ? 'bg-info text-white'
                    : 'bg-warning text-dark'
                }`}
                style={{ width: '42px', height: '42px' }}
              >
                <i className={`bi ${notif.icon} fs-5`}></i>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <strong className="text-dark fs-6">{notif.title}</strong>
                  <span className="text-muted small">{notif.time}</span>
                </div>
                <p className="text-muted small mb-2">{notif.message}</p>

                <div className="d-flex align-items-center gap-2">
                  {notif.type === 'trip' && (
                    <Link to="/driver/requests" className="btn btn-xs btn-primary fw-bold py-1 px-3">
                      View Request →
                    </Link>
                  )}
                  {notif.type === 'payment' && (
                    <Link to="/driver/trips" className="btn btn-xs btn-outline-success fw-bold py-1 px-3">
                      Check Balance
                    </Link>
                  )}
                  <button
                    type="button"
                    className="btn btn-link btn-xs text-muted text-decoration-none p-0 ms-auto"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DriverLayout>
  );
}
