import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmerContext = createContext(null);

const SAMPLE_PRODUCTS = [
  {
    id: 'PRD-101',
    name: 'Fresh Country Tomatoes (நாட்டு தக்காளி)',
    tamilName: 'நாட்டு தக்காளி',
    category: 'Vegetables',
    description: 'Vine-ripened, naturally grown country tomatoes with high juice and sweetness index. Picked daily from Modakkurichi farm plots.',
    quantity: '650',
    unit: 'Kg',
    price: '24',
    rawPrice: 24,
    harvestDate: '2026-10-18',
    availableFrom: '2026-10-19',
    district: 'Erode',
    taluk: 'Modakkurichi',
    address: 'Survey No. 44/2, Modakkurichi Road, Erode',
    status: 'Active',
    grade: 'Grade A (Premium)',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-102',
    name: 'Bellary & Small Red Onions (சின்ன வெங்காயம்)',
    tamilName: 'சின்ன வெங்காயம்',
    category: 'Vegetables',
    description: 'Pungent, dry-cured red shallots & onions ideal for hotels and supermarket distribution with 30-day shelf life.',
    quantity: '1200',
    unit: 'Kg',
    price: '36',
    rawPrice: 36,
    harvestDate: '2026-10-15',
    availableFrom: '2026-10-16',
    district: 'Erode',
    taluk: 'Gobichettipalayam',
    address: 'Gobi Agro Farm Hub, Plot 12B',
    status: 'Active',
    grade: 'Grade A (Premium)',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-103',
    name: 'Erode Pure Organic Turmeric Finger (ஈரோடு மஞ்சள்)',
    tamilName: 'ஈரோடு விரலி மஞ்சள்',
    category: 'Spices & Herbs',
    description: 'GI Tagged Erode turmeric with >3.8% Curcumin content. Double-polished organic harvest.',
    quantity: '400',
    unit: 'Kg',
    price: '140',
    rawPrice: 140,
    harvestDate: '2026-09-28',
    availableFrom: '2026-10-01',
    district: 'Erode',
    taluk: 'Perundurai',
    address: 'Kisan Organic Estate, Perundurai',
    status: 'Active',
    grade: '100% Certified Organic',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-104',
    name: 'Ooty Standard Potatoes (உருளைக்கிழங்கு)',
    tamilName: 'உருளைக்கிழங்கு',
    category: 'Vegetables',
    description: 'Clean, medium-large hill potatoes with firm skin and low moisture content, ideal for bulk frying and chips.',
    quantity: '850',
    unit: 'Kg',
    price: '28',
    rawPrice: 28,
    harvestDate: '2026-10-10',
    availableFrom: '2026-10-12',
    district: 'Nilgiris',
    taluk: 'Udhagamandalam',
    address: 'Hilltop Terrace Farm, Ooty',
    status: 'Active',
    grade: 'Grade B (Standard)',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-105',
    name: 'Green Cavendish Bananas (பச்சை வாழை)',
    tamilName: 'பச்சை வாழை',
    category: 'Fruits',
    description: 'Uniform 7-8 inch bunch-selected premium green bananas. Packed in ventilated 15kg cartons.',
    quantity: '150',
    unit: 'Dozen',
    price: '45',
    rawPrice: 45,
    harvestDate: '2026-10-22',
    availableFrom: '2026-10-23',
    district: 'Erode',
    taluk: 'Bhavani',
    address: 'Cauvery Riverbank Orchard, Bhavani',
    status: 'Pending',
    grade: 'Grade A (Premium)',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

const SAMPLE_REQUESTS = [
  {
    id: 'REQ-801',
    consumerId: 'CON-101',
    consumerName: 'FreshMart Supermarkets',
    businessType: 'Retail Supermarket Chain',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    productId: 'PRD-101',
    productName: 'Fresh Country Tomatoes',
    quantity: '400 Kg',
    offerPrice: '₹24 / Kg',
    rawOfferPrice: 24,
    totalValue: '₹9,600',
    location: 'Erode City & Coimbatore Hubs',
    district: 'Erode',
    requestDate: 'Today, 09:30 AM',
    deliveryDate: 'Tomorrow Morning (06:00 AM)',
    message: 'We require 400 kg of fresh Grade A Tomatoes for our 5 supermarket outlets across Erode and Tiruppur. Prompt delivery payment guaranteed via direct bank transfer.',
    phone: '+91 98421 55678',
    email: 'procurement@freshmart.in',
    status: 'Pending'
  },
  {
    id: 'REQ-802',
    consumerId: 'CON-102',
    consumerName: 'Kovai Organic Retailers Association',
    businessType: 'Wholesale Distributor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    productId: 'PRD-103',
    productName: 'Erode Pure Organic Turmeric',
    quantity: '250 Kg',
    offerPrice: '₹145 / Kg',
    rawOfferPrice: 145,
    totalValue: '₹36,250',
    location: 'Saibaba Colony, Coimbatore',
    district: 'Coimbatore',
    requestDate: 'Yesterday, 04:15 PM',
    deliveryDate: '22 Oct 2026',
    message: 'Seeking export quality organically certified turmeric with lab batch test report. Willing to pay +₹5 over listed price for high curcumin test.',
    phone: '+91 94432 88910',
    email: 'kovai.organic@trade.com',
    status: 'Pending'
  },
  {
    id: 'REQ-803',
    consumerId: 'CON-103',
    consumerName: 'Hotel Sri Lakshmi Grand & Caterers',
    businessType: 'Restaurant & Hospitality Chain',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    productId: 'PRD-102',
    productName: 'Red Onions (சின்ன வெங்காயம்)',
    quantity: '500 Kg',
    offerPrice: '₹35 / Kg',
    rawOfferPrice: 35,
    totalValue: '₹17,500',
    location: 'Perundurai Bypass Road, Erode',
    district: 'Erode',
    requestDate: '2 days ago',
    deliveryDate: 'Immediate Dispatch',
    message: 'Recurring weekly order for our 3 restaurant kitchens. Pickup vehicle can be arranged from your farm gate.',
    phone: '+91 97890 12345',
    email: 'kitchens@srilakshmigrand.com',
    status: 'Accepted'
  },
  {
    id: 'REQ-804',
    consumerId: 'CON-104',
    consumerName: 'Green Basket Direct Delivery',
    businessType: 'D2C App Delivery Hub',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    productId: 'PRD-104',
    productName: 'Ooty Standard Potatoes',
    quantity: '300 Kg',
    offerPrice: '₹27 / Kg',
    rawOfferPrice: 27,
    totalValue: '₹8,100',
    location: 'Gandhipuram Hub, Coimbatore',
    district: 'Coimbatore',
    requestDate: '3 days ago',
    deliveryDate: '18 Oct 2026',
    message: 'Looking for 300kg Ooty potatoes. Need sorting in 25kg bags.',
    phone: '+91 96550 44321',
    email: 'supply@greenbasket.co',
    status: 'Declined'
  }
];

const SAMPLE_CONVERSATIONS = [
  {
    id: 'CONV-101',
    consumerId: 'CON-101',
    consumerName: 'FreshMart Procurement (Sundar)',
    businessType: 'Retail Supermarket Chain',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    location: 'Erode City',
    lastMessage: 'Is 400 kg of tomato available for tomorrow dispatch?',
    timestamp: '10:15 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'M1',
        sender: 'consumer',
        text: 'Vanakkam Ravi sir. We saw your listing for Country Tomatoes on Naam Uzhavar portal.',
        timestamp: '09:30 AM',
        read: true
      },
      {
        id: 'M2',
        sender: 'consumer',
        text: 'Is 400 kg of tomato available for tomorrow dispatch?',
        timestamp: '10:15 AM',
        read: false
      }
    ]
  },
  {
    id: 'CONV-102',
    consumerId: 'CON-102',
    consumerName: 'Kovai Organic Retailers',
    businessType: 'Wholesale Distributor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    location: 'Coimbatore',
    lastMessage: 'Yes, we will send our EV truck to your farm by 11 AM.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'M201',
        sender: 'farmer',
        text: 'Hello, our organic turmeric harvest is cured and ready for batch inspection.',
        timestamp: 'Yesterday, 02:00 PM',
        read: true
      },
      {
        id: 'M202',
        sender: 'consumer',
        text: 'Great! We reviewed the harvest details. The offer price of ₹145/kg is approved.',
        timestamp: 'Yesterday, 03:30 PM',
        read: true
      },
      {
        id: 'M203',
        sender: 'consumer',
        text: 'Yes, we will send our EV truck to your farm by 11 AM.',
        timestamp: 'Yesterday, 04:45 PM',
        read: true
      }
    ]
  },
  {
    id: 'CONV-103',
    consumerId: 'CON-103',
    consumerName: 'Hotel Sri Lakshmi Grand',
    businessType: 'Restaurant Chain',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    location: 'Perundurai',
    lastMessage: 'Order confirmed! 500 kg onions accepted.',
    timestamp: '2 days ago',
    unreadCount: 0,
    messages: [
      {
        id: 'M301',
        sender: 'consumer',
        text: 'Can you supply 500kg of Red Onions on a weekly recurring basis?',
        timestamp: '2 days ago, 11:00 AM',
        read: true
      },
      {
        id: 'M302',
        sender: 'farmer',
        text: 'Yes, 500 kg is ready at our Perundurai storage hub. Quality grade standard A.',
        timestamp: '2 days ago, 11:45 AM',
        read: true
      },
      {
        id: 'M303',
        sender: 'farmer',
        text: 'Order confirmed! 500 kg onions accepted.',
        timestamp: '2 days ago, 12:30 PM',
        read: true
      }
    ]
  }
];

export function FarmerProvider({ children }) {
  // 1. Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_products_v2');
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  // 2. Consumer Requests State
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_consumer_requests_v2');
    return saved ? JSON.parse(saved) : SAMPLE_REQUESTS;
  });

  // 3. Conversations State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_farmer_conversations_v2');
    return saved ? JSON.parse(saved) : SAMPLE_CONVERSATIONS;
  });

  // 4. Notification / Feedback Toast
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('naam_uzhavar_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_consumer_requests_v2', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_farmer_conversations_v2', JSON.stringify(conversations));
  }, [conversations]);

  const notify = (title, message, type = 'success') => {
    setFeedbackToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Product Operations
  const addProduct = (newProductData) => {
    const newProduct = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      grade: 'Grade A (Premium)',
      images: [],
      ...newProductData,
      rawPrice: Number(String(newProductData.price).replace(/[^0-9.]/g, '')) || 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    notify('Product Listed!', `"${newProduct.name}" has been published to the marketplace.`, 'success');
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    notify('Product Updated', 'Product details saved successfully.', 'info');
  };

  const deleteProduct = (id, productName) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    notify('Product Removed', `"${productName || 'Listing'}" removed from active catalog.`, 'warning');
  };

  // Request Operations
  const acceptRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Accepted' } : req))
    );
    const targetReq = requests.find((r) => r.id === requestId);
    notify(
      'Request Accepted! 🎉',
      `You accepted the request from ${targetReq?.consumerName || 'the consumer'} for ${targetReq?.quantity || 'produce'}.`,
      'success'
    );
  };

  const declineRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Declined' } : req))
    );
    const targetReq = requests.find((r) => r.id === requestId);
    notify(
      'Request Declined',
      `Request from ${targetReq?.consumerName || 'the buyer'} has been declined.`,
      'info'
    );
  };

  // Messaging Operations
  const sendMessage = (conversationId, text, sender = 'farmer') => {
    if (!text.trim()) return;

    const newMessage = {
      id: `M-${Date.now()}`,
      sender,
      text: text.trim(),
      timestamp: 'Just now',
      read: true
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text.trim(),
            timestamp: 'Just now',
            unreadCount: sender === 'farmer' ? 0 : conv.unreadCount + 1,
            messages: [...conv.messages, newMessage]
          };
        }
        return conv;
      })
    );
  };

  const markConversationAsRead = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
    );
  };

  const startConversationWithConsumer = (consumerData) => {
    const existing = conversations.find(
      (c) => c.consumerId === consumerData.consumerId || c.consumerName === consumerData.consumerName
    );

    if (existing) {
      return existing.id;
    }

    const newConvId = `CONV-${Date.now().toString().slice(-4)}`;
    const newConv = {
      id: newConvId,
      consumerId: consumerData.consumerId || `CON-${Date.now()}`,
      consumerName: consumerData.consumerName,
      businessType: consumerData.businessType || 'Direct Buyer',
      avatar:
        consumerData.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      location: consumerData.location || 'Tamil Nadu',
      lastMessage: `Regarding request for ${consumerData.productName || 'produce'}`,
      timestamp: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `M-init-${Date.now()}`,
          sender: 'farmer',
          text: `Vanakkam ${consumerData.consumerName}! I received your request for ${consumerData.quantity || 'produce'} (${consumerData.productName || 'produce'}). Let's finalize the pickup details.`,
          timestamp: 'Just now',
          read: true
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConvId;
  };

  // Computed Stats
  const activeProductsCount = products.filter((p) => p.status === 'Active').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;
  const acceptedRequestsCount = requests.filter((r) => r.status === 'Accepted').length;
  const totalUnreadMessages = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  const stats = {
    activeProducts: activeProductsCount,
    pendingRequests: pendingRequestsCount,
    acceptedRequests: acceptedRequestsCount,
    productsSold: '3,100 Kg',
    unreadMessages: totalUnreadMessages
  };

  return (
    <FarmerContext.Provider
      value={{
        products,
        requests,
        conversations,
        stats,
        feedbackToast,
        addProduct,
        updateProduct,
        deleteProduct,
        acceptRequest,
        declineRequest,
        sendMessage,
        markConversationAsRead,
        startConversationWithConsumer,
        notify
      }}
    >
      {children}

      {/* Global Toast Feedback */}
      {feedbackToast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1150, maxWidth: '380px' }}
        >
          <div
            className={`toast show border-0 shadow-lg p-3 rounded-4 bg-${
              feedbackToast.type === 'info'
                ? 'info text-dark'
                : feedbackToast.type === 'warning'
                ? 'warning text-dark'
                : 'success text-white'
            }`}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <i
                className={`bi fs-5 ${
                  feedbackToast.type === 'warning'
                    ? 'bi-exclamation-triangle-fill'
                    : 'bi-check-circle-fill'
                }`}
              ></i>
              <strong className="fs-6">{feedbackToast.title}</strong>
            </div>
            <div className="small opacity-90">{feedbackToast.message}</div>
          </div>
        </div>
      )}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
}
