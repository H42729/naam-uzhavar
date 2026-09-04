/**
 * Farmer Messages Page
 * Route: /farmer/messages
 * Simple farmer-to-buyer direct messaging with active conversation threads,
 * unread badges, quick reply chips, and mobile-friendly chat navigation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import { useLanguage } from '../../context/LanguageContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

export default function FarmerMessagesPage() {
  const { conversations, sendMessage, markConversationAsRead } = useFarmer();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const requestedConvId = searchParams.get('conv');

  const [activeConvId, setActiveConvId] = useState(() => {
    if (requestedConvId && conversations.some((c) => c.id === requestedConvId)) {
      return requestedConvId;
    }
    return conversations.length > 0 ? conversations[0].id : null;
  });

  const [inputText, setInputText] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const messagesEndRef = useRef(null);

  const quickReplies =
    language === 'ta'
      ? [
          'ஆம், சரக்கு உடனடியாக ஏற்றுமதி செய்யத் தயாராக உள்ளது.',
          'வாகனம் வரும் நேரத்தை உறுதிப்படுத்த முடியுமா?',
          'எங்கள் விளைச்சல் முதல் தரம் (Grade A) கொண்டதாகும்.',
          'நாளை காலை 6:00 மணிக்கு ஏற்றுமதிக்கு தயாராக வைக்கப்படும்.'
        ]
      : [
          'Yes, the produce is ready for immediate pickup.',
          'Can you confirm the pickup truck arrival timing?',
          'Our produce is Grade A certified and freshly sorted.',
          'Dispatch will be prepared tomorrow at 6:00 AM.'
        ];

  // Update active conversation if query parameter changes
  useEffect(() => {
    if (requestedConvId && conversations.some((c) => c.id === requestedConvId)) {
      setActiveConvId(requestedConvId);
    }
  }, [requestedConvId, conversations]);

  // Mark active conversation as read
  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
    }
  }, [activeConvId]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) => {
    const searchTarget = `${c.consumerName || ''} ${c.buyerName || ''} ${c.businessType || ''} ${c.buyerType || ''} ${c.lastMessage || ''}`.toLowerCase();
    return searchTarget.includes(chatSearch.toLowerCase());
  });

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text) => {
    if (!activeConvId) return;
    sendMessage(activeConvId, text);
  };

  return (
    <FarmerLayout>
      <div className="farm-messages-container bg-white rounded-4 border shadow-xs overflow-hidden">
        {/* ===================================================================
            LEFT: CONVERSATION LIST PANEL
            =================================================================== */}
        <div className={`farm-chat-sidebar border-end ${activeConvId ? 'chat-selected' : ''}`}>
          {/* Header & Search */}
          <div className="p-3 border-bottom bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h2 className="fw-bold text-dark fs-6 mb-0">{t('messages')}</h2>
              <span className="badge bg-success rounded-pill px-2.5 py-1 small">
                {conversations.length} {language === 'ta' ? 'உரையாடல்கள்' : 'Chats'}
              </span>
            </div>
            <div className="position-relative">
              <i
                className="bi bi-search position-absolute text-muted small"
                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>
              <input
                type="text"
                className="form-control form-control-sm rounded-pill ps-4 bg-white"
                placeholder={language === 'ta' ? 'வாங்குபவரைத் தேடுங்கள்...' : 'Search buyer...'}
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List of Conversations */}
          <div className="farm-chat-list">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const name = conv.buyerName || conv.consumerName || 'Wholesale Buyer';

              return (
                <div
                  key={conv.id}
                  className={`farm-chat-item p-3 border-bottom cursor-pointer transition ${isActive ? 'active bg-success-subtle' : 'hover-bg-light'}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <img
                      src={
                        conv.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={name}
                      className="rounded-circle border object-fit-cover flex-shrink-0"
                      style={{ width: '44px', height: '44px' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between align-items-center mb-0.5">
                        <strong className="text-dark small text-truncate d-block" style={{ maxWidth: '140px' }}>
                          {name}
                        </strong>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                          {conv.timestamp}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small text-truncate d-block" style={{ fontSize: '0.75rem', maxWidth: '160px' }}>
                          {conv.lastMessage}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-4 text-center text-muted small">
                {t('noMessagesYetDesc')}
              </div>
            )}
          </div>
        </div>

        {/* ===================================================================
            RIGHT: CHAT VIEWPORT
            =================================================================== */}
        <div className="farm-chat-main d-flex flex-column">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="farm-chat-header p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2.5">
                  <button
                    type="button"
                    className="btn btn-sm btn-light rounded-circle d-md-none border p-1"
                    onClick={() => setActiveConvId(null)}
                    aria-label="Back to conversations"
                  >
                    <i className="bi bi-arrow-left fs-6"></i>
                  </button>

                  <img
                    src={
                      activeConversation.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                    }
                    alt={activeConversation.buyerName}
                    className="rounded-circle border object-fit-cover"
                    style={{ width: '42px', height: '42px' }}
                  />

                  <div>
                    <strong className="text-dark d-block fs-6 mb-0">
                      {activeConversation.buyerName || activeConversation.consumerName}
                    </strong>
                    <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                      {activeConversation.buyerType || 'Wholesale Buyer'}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small">
                    ● {language === 'ta' ? 'சரிபார்க்கப்பட்ட வாங்குபவர்' : 'Verified Buyer'}
                  </span>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="farm-chat-history p-3 flex-grow-1 overflow-y-auto" style={{ minHeight: '340px', maxHeight: '520px', background: '#f8fafc' }}>
                <div className="text-center my-2">
                  <span className="badge bg-white text-muted border rounded-pill px-3 py-1.5 small shadow-2xs">
                    🔒 {language === 'ta' ? 'நேரடி பாதுகாப்பான உழவர் - வாங்குபவர் உரையாடல்' : 'Direct secure farmer-to-buyer negotiation'}
                  </span>
                </div>

                {activeConversation.messages &&
                  activeConversation.messages.map((msg) => {
                    const isFarmer = msg.sender === 'farmer';

                    return (
                      <div
                        key={msg.id}
                        className={`d-flex mb-3 ${isFarmer ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div
                          className="rounded-4 p-3 shadow-2xs position-relative"
                          style={{
                            maxWidth: '78%',
                            background: isFarmer ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#ffffff',
                            color: isFarmer ? '#ffffff' : '#0f172a',
                            border: isFarmer ? 'none' : '1px solid #e2e8f0',
                            borderBottomRightRadius: isFarmer ? '4px' : '16px',
                            borderBottomLeftRadius: isFarmer ? '16px' : '4px'
                          }}
                        >
                          <div className="fw-bold mb-1" style={{ fontSize: '0.72rem', opacity: isFarmer ? 0.85 : 0.65 }}>
                            {isFarmer ? t('farmerLabel') : t('buyerLabel')}:
                          </div>
                          <div className="small mb-1" style={{ fontSize: '0.88rem', lineHeight: 1.45 }}>
                            {msg.text}
                          </div>
                          <div
                            className={`d-flex align-items-center gap-1 small ${isFarmer ? 'justify-content-end text-white-50' : 'text-muted'}`}
                            style={{ fontSize: '0.68rem' }}
                          >
                            <span>{msg.time || msg.timestamp || 'Today'}</span>
                            {isFarmer && <i className="bi bi-check2-all text-white"></i>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-3 py-2 bg-white border-top d-flex gap-2 overflow-x-auto">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-sm btn-light border rounded-pill text-truncate text-muted flex-shrink-0"
                    style={{ fontSize: '0.75rem', maxWidth: '300px' }}
                    onClick={() => handleQuickReply(reply)}
                  >
                    💬 {reply}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="p-3 bg-white border-top">
                <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill px-3.5 fs-6"
                    placeholder={t('typeYourMessagePlaceholder')}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="btn btn-success fw-bold rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-1.5 shadow-sm"
                    disabled={!inputText.trim()}
                  >
                    <span>{t('sendBtn')}</span>
                    <i className="bi bi-send-fill fs-6"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center text-muted">
              <i className="bi bi-chat-dots fs-1 text-success mb-2"></i>
              <h3 className="fs-5 fw-bold text-dark">{t('noMessagesYetTitle')}</h3>
              <p className="small text-muted" style={{ maxWidth: '320px' }}>
                {t('noMessagesYetDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}
