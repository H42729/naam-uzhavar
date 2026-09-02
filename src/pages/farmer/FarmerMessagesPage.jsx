import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFarmer } from '../../context/FarmerContext';
import FarmerLayout from '../../components/farmer/FarmerLayout';

const QUICK_REPLIES = [
  'Yes, the produce is available for immediate pickup.',
  'Can you confirm the pickup truck arrival timing?',
  'Our produce is Grade A certified and freshly harvested.',
  'We have agreed to your requested rate of ₹24/kg.',
  'Dispatch will be prepared tomorrow at 6:00 AM.'
];

export default function FarmerMessagesPage() {
  const { conversations, sendMessage, markConversationAsRead } = useFarmer();
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

  // Update active conversation if URL query changes
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

  // Auto-scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter(
    (c) =>
      c.consumerName.toLowerCase().includes(chatSearch.toLowerCase()) ||
      (c.businessType && c.businessType.toLowerCase().includes(chatSearch.toLowerCase())) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase()))
  );

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText, 'farmer');
    setInputText('');
  };

  const handleQuickReply = (text) => {
    if (!activeConvId) return;
    sendMessage(activeConvId, text, 'farmer');
  };

  return (
    <FarmerLayout>
      <div className="farm-messages-container">
        {/* ----------------------------------------------------------------------
            LEFT: CONVERSATIONS SIDEBAR
           ---------------------------------------------------------------------- */}
        <div className={`farm-chat-sidebar ${activeConvId ? 'chat-selected' : ''}`}>
          {/* Search bar */}
          <div className="p-3 border-bottom bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h5 className="fw-bold text-dark mb-0">Messages &amp; Inquiries</h5>
              <span className="badge bg-success rounded-pill">
                {conversations.length} Threads
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
                placeholder="Search consumer or buyer..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="farm-chat-list">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  className={`farm-chat-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <img
                    src={
                      conv.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                    }
                    alt={conv.consumerName}
                    className="rounded-circle border"
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark text-truncate small" style={{ maxWidth: '140px' }}>
                        {conv.consumerName}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {conv.timestamp}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <p
                        className="small text-muted mb-0 text-truncate"
                        style={{ fontSize: '0.78rem', maxWidth: '170px' }}
                      >
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-4 text-center text-muted small">
                No active conversations found.
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------------
            RIGHT: ACTIVE CHAT VIEWPORT
           ---------------------------------------------------------------------- */}
        <div className="farm-chat-main">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="farm-chat-header">
                <div className="d-flex align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-light rounded-circle d-md-none border"
                    onClick={() => setActiveConvId(null)}
                  >
                    <i className="bi bi-arrow-left"></i>
                  </button>

                  <img
                    src={
                      activeConversation.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                    }
                    alt={activeConversation.consumerName}
                    className="rounded-circle border"
                    style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                  />

                  <div>
                    <div className="fw-bold text-dark fs-6 mb-0">
                      {activeConversation.consumerName}
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-2">
                      <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                        {activeConversation.businessType || 'Direct Buyer'}
                      </span>
                      <span>
                        <i className="bi bi-geo-alt me-1 text-danger"></i>
                        {activeConversation.location || 'Tamil Nadu'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-none d-sm-inline">
                    ● Active Buyer
                  </span>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="farm-chat-history">
                <div className="text-center my-2">
                  <span className="badge bg-light text-muted border rounded-pill px-3 py-1 small">
                    Direct marketplace conversation with verified B2B buyer
                  </span>
                </div>

                {activeConversation.messages &&
                  activeConversation.messages.map((msg) => {
                    const isFarmer = msg.sender === 'farmer';
                    return (
                      <div
                        key={msg.id}
                        className={`farm-bubble ${
                          isFarmer ? 'farm-bubble-outgoing' : 'farm-bubble-incoming'
                        }`}
                      >
                        <div>{msg.text}</div>
                        <div
                          className={`farm-bubble-time d-flex align-items-center gap-1 ${
                            isFarmer ? 'justify-content-end text-white-50' : 'text-muted'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isFarmer && <i className="bi bi-check2-all text-white"></i>}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-3 pt-2 pb-1 bg-white border-top d-flex gap-2 overflow-x-auto">
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-sm btn-light border rounded-pill text-truncate text-muted"
                    style={{ fontSize: '0.75rem', flexShrink: 0, maxWidth: '280px' }}
                    onClick={() => handleQuickReply(reply)}
                  >
                    💬 {reply}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="farm-chat-input-area">
                <form onSubmit={handleSend} className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-light rounded-circle text-muted border p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }}
                    title="Attach Harvest Photo / Certificate"
                    onClick={() => alert('Photo / Lab certificate attachment simulation.')}
                  >
                    <i className="bi bi-paperclip fs-5"></i>
                  </button>

                  <input
                    type="text"
                    className="form-control rounded-pill px-3 py-2"
                    placeholder="Type your message to consumer (e.g. Yes, 100 kg is ready for pickup)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-sm p-2"
                    style={{ width: '44px', height: '44px' }}
                    disabled={!inputText.trim()}
                  >
                    <i className="bi bi-send-fill fs-6"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-center text-muted">
              <i className="bi bi-chat-dots fs-1 text-success mb-2"></i>
              <h5 className="fw-bold text-dark">Select a Conversation</h5>
              <p className="small text-muted" style={{ maxWidth: '320px' }}>
                Choose a consumer or buyer from the left panel to discuss order quantities, rates, and dispatch timelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}
