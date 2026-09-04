/**
 * Buyer Messages Page
 * Route: /buyer/messages
 * Implements simple, direct buyer-to-farmer messaging matching Master Prompt Section 21.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBuyer } from '../../context/BuyerContext';
import { useLanguage } from '../../context/LanguageContext';
import BuyerLayout from '../../components/buyer/BuyerLayout';

export default function BuyerMessagesPage() {
  const [searchParams] = useSearchParams();
  const activeConvParam = searchParams.get('conv');

  const {
    conversations,
    sendMessage,
    markConversationAsRead
  } = useBuyer();
  const { t, language } = useLanguage();

  const [selectedConvId, setSelectedConvId] = useState(
    activeConvParam || (conversations.length > 0 ? conversations[0].id : null)
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Update selected if url changes
  useEffect(() => {
    if (activeConvParam) {
      setSelectedConvId(activeConvParam);
      markConversationAsRead(activeConvParam);
    }
  }, [activeConvParam]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;
  }, [conversations, selectedConvId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        c.farmerName.toLowerCase().includes(q) ||
        (c.crop && c.crop.toLowerCase().includes(q))
      );
    });
  }, [conversations, searchQuery]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, messageText.trim());
    setMessageText('');
  };

  const quickReplies = [
    language === 'ta' ? 'விளைச்சல் எப்போது தயாராகும்?' : 'When will the harvest be ready for dispatch?',
    language === 'ta' ? 'நாங்கள் 25 கிலோ பெட்டிகளில் பேக்கிங் செய்ய விரும்புகிறோம்.' : 'We require packing in 25kg standard crates.',
    language === 'ta' ? 'ஆர்டர் உறுதி செய்யப்பட்டது. நன்றி!' : 'Great, order confirmed! Thank you.',
    language === 'ta' ? 'சரக்கு ஏற்றுமதி வாகன எண்ணை அனுப்பவும்.' : 'Please share the vehicle dispatch number once loaded.'
  ];

  return (
    <BuyerLayout>
      <div className="w-100 farm-animate-fade d-flex flex-column h-100" style={{ minHeight: '520px' }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-shrink-0">
          <div>
            <h1 className="fw-black text-dark fs-4 mb-0">{t('messages')}</h1>
            <span className="text-muted small">
              {language === 'ta' ? 'விவசாயிகளுடனான நேரடி தகவல் பரிமாற்றம்' : 'Direct communication with producing farmers'}
            </span>
          </div>

          <Link to="/buyer/requests" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
            ← {t('myRequests')}
          </Link>
        </div>

        {/* Messaging Container */}
        <div className="bg-white rounded-4 border shadow-xs overflow-hidden flex-grow-1 d-flex flex-column flex-md-row">
          {/* ===================================================================
              LEFT PANEL: CONVERSATION THREADS
              =================================================================== */}
          <div
            className={`border-end h-100 d-flex flex-column ${
              activeConversation ? 'd-none d-md-flex' : 'd-flex'
            }`}
            style={{ width: '100%', maxWidth: '340px' }}
          >
            {/* Search Input */}
            <div className="p-3 border-bottom">
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute text-muted small"
                  style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                ></i>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill ps-4 bg-light border-0"
                  placeholder={t('searchFarmerPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-grow-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted small">
                  {t('noConversationsYetDesc')}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className={`p-3 border-bottom transition cursor-pointer d-flex align-items-center gap-3 ${
                        isSelected ? 'bg-primary-subtle bg-opacity-35 border-primary-subtle' : 'hover-bg-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        markConversationAsRead(conv.id);
                      }}
                    >
                      <div
                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0 shadow-2xs"
                        style={{ width: '42px', height: '42px' }}
                      >
                        <i className="bi bi-person-fill"></i>
                      </div>

                      <div className="overflow-hidden flex-grow-1">
                        <div className="d-flex justify-content-between align-items-baseline mb-0.5">
                          <strong className="text-dark small text-truncate">{conv.farmerName}</strong>
                          <span className="text-muted" style={{ fontSize: '0.68rem' }}>{conv.timestamp}</span>
                        </div>
                        <span className="text-primary small d-block text-truncate" style={{ fontSize: '0.74rem' }}>
                          Regarding: {conv.crop}
                        </span>
                        <p className="text-muted text-truncate mb-0" style={{ fontSize: '0.76rem' }}>
                          {conv.lastMessage}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ===================================================================
              RIGHT PANEL: ACTIVE CHAT THREAD
              =================================================================== */}
          <div className="flex-grow-1 h-100 d-flex flex-column">
            {activeConversation ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2.5">
                    {/* Mobile Back Button */}
                    <button
                      type="button"
                      className="btn btn-sm btn-light d-md-none border rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => setSelectedConvId(null)}
                    >
                      <i className="bi bi-arrow-left"></i>
                    </button>

                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold shadow-2xs"
                      style={{ width: '38px', height: '38px' }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>

                    <div>
                      <strong className="text-dark d-block fs-6 mb-0">
                        {activeConversation.farmerName}
                      </strong>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        Regarding: <strong className="text-primary">{activeConversation.crop}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small">
                    ✓ Verified Producer
                  </span>
                </div>

                {/* Message Bubble History */}
                <div className="flex-grow-1 overflow-y-auto p-3 p-md-4 d-flex flex-column gap-3 bg-light bg-opacity-25">
                  {activeConversation.messages &&
                    activeConversation.messages.map((msg) => {
                      const isBuyer = msg.sender === 'buyer';
                      return (
                        <div
                          key={msg.id}
                          className={`d-flex flex-column ${isBuyer ? 'align-items-end' : 'align-items-start'}`}
                        >
                          <div
                            className={`p-3 rounded-4 shadow-2xs ${
                              isBuyer
                                ? 'bg-primary text-white rounded-bottom-end-0'
                                : 'bg-white text-dark border rounded-bottom-start-0'
                            }`}
                            style={{ maxWidth: '75%', fontSize: '0.88rem' }}
                          >
                            <p className="mb-1" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            <span
                              className={`small d-block text-end ${isBuyer ? 'text-white-50' : 'text-muted'}`}
                              style={{ fontSize: '0.68rem' }}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Quick Replies Bar */}
                <div className="p-2 border-top bg-white overflow-x-auto d-flex gap-1.5">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill text-nowrap small text-muted hover-primary"
                      style={{ fontSize: '0.74rem' }}
                      onClick={() => sendMessage(activeConversation.id, reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSend} className="p-3 border-top bg-white d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control rounded-pill px-3.5 fs-6"
                    placeholder={t('typeMessagePlaceholder')}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-1.5 shadow-xs"
                    disabled={!messageText.trim()}
                  >
                    <span>{t('sendBtn')}</span>
                    <i className="bi bi-send-fill"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center text-muted">
                <i className="bi bi-chat-dots fs-1 mb-2"></i>
                <h4 className="fs-6 fw-bold text-dark">{t('noConversationsYetTitle')}</h4>
                <p className="small mb-3">{t('noConversationsYetDesc')}</p>
                <Link to="/buyer/browse" className="btn btn-primary btn-sm rounded-pill px-3">
                  {t('browseProduceCTA')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
