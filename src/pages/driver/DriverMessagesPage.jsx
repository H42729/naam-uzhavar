/**
 * Driver Communication & Messages Page
 * Route: /driver/messages
 * Facilitates direct messaging with farmers, buyer receiving managers, and central dispatch.
 */

import React, { useState, useEffect } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { DRIVER_MESSAGES } from '../../data/driverData';

export default function DriverMessagesPage() {
  const [threads, setThreads] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_driver_messages');
      return saved ? JSON.parse(saved) : DRIVER_MESSAGES;
    } catch {
      return DRIVER_MESSAGES;
    }
  });
  const [activeContactId, setActiveContactId] = useState(threads[0]?.contactId || 'c1');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('naam_uzhavar_driver_messages', JSON.stringify(threads));
    } catch {}
  }, [threads]);

  const activeThread = threads.find((t) => t.contactId === activeContactId) || threads[0];

  const quickReplies = [
    'I have reached the outer ring road.',
    'Arriving in approximately 10 mins.',
    'Crates loaded and tamper seal applied.',
    'At loading bay #4 now.'
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.contactId === activeContactId) {
          return {
            ...thread,
            messages: [...thread.messages, newMsg]
          };
        }
        return thread;
      })
    );

    setReplyText('');
  };

  const handleQuickSend = (text) => {
    setReplyText(text);
  };

  return (
    <DriverLayout>
      <div className="w-100">
        {/* Header Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <div>
            <div className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Communications
            </div>
            <h1 className="fw-bold text-dark fs-3 mb-0">Trip Messages & Support</h1>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
            <i className="bi bi-circle-fill me-1 small" style={{ fontSize: '0.6rem' }}></i> Live Fleet Channel
          </span>
        </div>

        {/* 2-Column Responsive Chat Container */}
        <div className="row g-3">
          {/* Thread List Column */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="drv-card p-2 mb-3">
              <div className="p-2 border-bottom fw-bold text-dark small text-uppercase" style={{ letterSpacing: '0.05em' }}>
                Active Trip Contacts
              </div>

              <div className="d-flex flex-column gap-1 pt-2">
                {threads.map((t) => {
                  const isActive = t.contactId === activeContactId;
                  const lastMsg = t.messages[t.messages.length - 1];

                  return (
                    <div
                      key={t.contactId}
                      className={`p-2 rounded-3 d-flex align-items-center gap-2 cursor-pointer transition ${
                        isActive ? 'bg-warning-subtle border border-warning' : 'hover-bg-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveContactId(t.contactId)}
                    >
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '42px', height: '42px' }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center justify-content-between">
                          <strong className="d-block text-dark small text-truncate">{t.name}</strong>
                          <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                            {lastMsg?.time}
                          </span>
                        </div>
                        <span className="text-muted small d-block text-truncate" style={{ fontSize: '0.75rem' }}>
                          {lastMsg?.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Chat Conversation Column */}
          <div className="col-12 col-md-7 col-lg-8">
            <div className="drv-card p-0 overflow-hidden d-flex flex-column" style={{ height: '520px' }}>
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="rounded-circle object-fit-cover"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <div>
                    <strong className="d-block text-dark fs-6">{activeThread.name}</strong>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {activeThread.role}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <a
                    href={`tel:${activeThread.phone.replace(/[^0-9+]/g, '')}`}
                    className="drv-btn drv-btn-outline btn-sm"
                    title="Direct Phone Call"
                  >
                    <i className="bi bi-telephone-fill text-success"></i>
                    <span className="d-none d-sm-inline">Call</span>
                  </a>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="p-3 overflow-y-auto flex-grow-1 d-flex flex-column gap-2 bg-white">
                {activeThread.messages.map((m) => {
                  const isMe = m.sender === 'me';
                  return (
                    <div
                      key={m.id}
                      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-4 max-w-md ${
                          isMe
                            ? 'bg-warning text-dark rounded-bottom-end-0 fw-semibold'
                            : 'bg-light text-dark border rounded-bottom-start-0'
                        }`}
                        style={{ maxWidth: '80%' }}
                      >
                        {m.text}
                      </div>
                      <span className="text-muted mt-1 px-1" style={{ fontSize: '0.68rem' }}>
                        {m.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Template Chips */}
              <div className="p-2 border-top bg-light overflow-x-auto d-flex gap-2">
                {quickReplies.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-xs btn-white border rounded-pill text-nowrap small text-muted hover-dark py-1 px-2"
                    style={{ fontSize: '0.72rem', background: '#fff' }}
                    onClick={() => handleQuickSend(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSend} className="p-3 border-top bg-white d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message or tap a quick template above..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="submit" className="drv-btn drv-btn-primary px-3">
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}
