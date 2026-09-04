import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MATCHED_SUPPLY,
  INITIAL_REQUIREMENTS
} from '../data/buyerData';
import { INITIAL_BUYER_REQUESTS } from '../data/buyerRequestsData';
import {
  matchSupplyLocally,
  createBulkOrderRecord,
  createDirectBuyOrderRecord,
  deductInventoryFromProducts
} from '../services/bulkProcurementService';

const BuyerContext = createContext(null);

export const INITIAL_BUYER_CONVERSATIONS = [
  {
    id: 'CONV-B1',
    farmerName: 'Ravi Farms',
    crop: 'Tomato (நாட்டு தக்காளி)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessage: 'Yes, the harvest will be ready for morning dispatch.',
    timestamp: '10:45 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'buyer',
        text: 'Hello Ravi Farms, can you supply 200 kg Country Tomatoes by tomorrow 8 AM?',
        time: '10:30 AM'
      },
      {
        id: 'msg-2',
        sender: 'farmer',
        text: 'Vanakkam! Yes, our morning harvest is Grade A certified and will be ready for morning dispatch.',
        time: '10:45 AM'
      }
    ]
  },
  {
    id: 'CONV-B2',
    farmerName: 'Kumar Agro',
    crop: 'Small Red Onions (சின்ன வெங்காயம்)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    unreadCount: 1,
    lastMessage: 'We packed 350 kg in 25kg mesh bags as requested.',
    timestamp: 'Yesterday',
    messages: [
      {
        id: 'msg-201',
        sender: 'buyer',
        text: 'Are the shallots sun-cured and moisture-free?',
        time: 'Yesterday, 3:00 PM'
      },
      {
        id: 'msg-202',
        sender: 'farmer',
        text: 'We packed 350 kg in 25kg mesh bags as requested. Guaranteed moisture-free.',
        time: 'Yesterday, 4:15 PM'
      }
    ]
  }
];

export function BuyerProvider({ children }) {
  // --------------------------------------------------------------------------
  // CORE STATES (backed by localStorage)
  // --------------------------------------------------------------------------
  const [products, setProducts] = useState(() => {
    try {
      localStorage.removeItem('farmdirect_buyer_products');
      localStorage.removeItem('farmdirect_buyer_products_v3');
      localStorage.removeItem('farmdirect_buyer_products_v4');
      localStorage.removeItem('farmdirect_buyer_products_v5');
      localStorage.removeItem('farmdirect_buyer_products_v6');
      const saved = localStorage.getItem('farmdirect_buyer_products_v7');
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          const fresh = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          const item = fresh ? { ...p, ...fresh, quantity: p.quantity ?? fresh.quantity } : p;
          if (item.crop === 'Brinjal' || (item.image && (item.image.includes('1628773822503') || item.image.includes('1622206151226')))) {
            item.image = '/images/brinjal.jpg';
            item.images = [
              '/images/brinjal.jpg',
              '/images/brinjal-2.jpg'
            ];
          }
          return item;
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('farmdirect_buyer_orders');
      if (!saved) return INITIAL_ORDERS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [matchedSupplies, setMatchedSupplies] = useState(() => {
    try {
      const saved = localStorage.getItem('farmdirect_buyer_matched');
      if (!saved) return INITIAL_MATCHED_SUPPLY;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MATCHED_SUPPLY;
    } catch {
      return INITIAL_MATCHED_SUPPLY;
    }
  });

  const [requirements, setRequirements] = useState(() => {
    try {
      const saved = localStorage.getItem('farmdirect_buyer_reqs');
      if (!saved) return INITIAL_REQUIREMENTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REQUIREMENTS;
    } catch {
      return INITIAL_REQUIREMENTS;
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('naam_uzhavar_buyer_requests_unified_v2');
      if (!saved) return INITIAL_BUYER_REQUESTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BUYER_REQUESTS;
    } catch {
      return INITIAL_BUYER_REQUESTS;
    }
  });

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('farmdirect_buyer_conversations');
      if (!saved) return INITIAL_BUYER_CONVERSATIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BUYER_CONVERSATIONS;
    } catch {
      return INITIAL_BUYER_CONVERSATIONS;
    }
  });

  // Current active match calculation payload
  const [activeMatch, setActiveMatch] = useState(null);

  // Pre-fill state for Bulk Requirement form
  const [requirementPrefill, setRequirementPrefill] = useState(null);

  // Global Toast State
  const [toastMessage, setToastMessage] = useState('');

  // --------------------------------------------------------------------------
  // PERSISTENCE SYNC
  // --------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('farmdirect_buyer_products_v7', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('farmdirect_buyer_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('farmdirect_buyer_matched', JSON.stringify(matchedSupplies));
  }, [matchedSupplies]);

  useEffect(() => {
    localStorage.setItem('farmdirect_buyer_reqs', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_buyer_requests_unified_v2', JSON.stringify(requests));
    localStorage.setItem('naam_uzhavar_buyer_request_details_v1', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('farmdirect_buyer_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? '' : current));
    }, 4000);
  };

  // --------------------------------------------------------------------------
  // REQUEST CONFIRMATION WORKFLOW (User Requested Action)
  // --------------------------------------------------------------------------
  const confirmRequest = (requestId) => {
    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) return null;

    // 1. Mark request as Confirmed
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Confirmed',
              confirmedAt: new Date().toISOString()
            }
          : r
      )
    );

    // 2. Generate a new confirmed purchase order
    const newOrderId = `FD${1024 + orders.length}`;
    const targetQty = Number(targetReq.quantity) || 100;
    const targetPrice = Number(targetReq.price || targetReq.offeredPrice) || 25;
    const calculatedAmount = targetReq.totalAmount || targetQty * targetPrice;

    const newOrder = {
      id: newOrderId,
      crop: targetReq.productName || targetReq.crop || 'Produce',
      quantity: targetQty,
      farmers: 1,
      amount: calculatedAmount,
      status: 'Confirmed',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: targetReq.deliveryDate || 'Within 48 Hours',
      location: targetReq.deliveryLocation || targetReq.location || 'Direct Consignment Hub',
      farmerBreakdown: [
        {
          farmer: targetReq.farmerName || targetReq.farmer || 'Verified Farmer',
          qty: targetQty,
          price: targetPrice
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // 3. Log into matched supply history
    const newMatchedEntry = {
      id: `MS-${Date.now().toString().slice(-4)}`,
      crop: targetReq.productName || targetReq.crop,
      requiredQty: targetQty,
      matchedQty: targetQty,
      farmersMatched: 1,
      avgPrice: targetPrice,
      status: 'Fully Matched',
      date: new Date().toISOString().split('T')[0]
    };
    setMatchedSupplies((prev) => [newMatchedEntry, ...prev]);

    showToast(`✓ Request #${targetReq.id} Confirmed! Order #${newOrderId} generated.`);
    return { success: true, order: newOrder };
  };

  const cancelRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
    showToast(`Request #${requestId} cancelled.`);
  };

  const declineRequest = cancelRequest;

  const createRequest = (newRequestData) => {
    const id = `REQ-${Date.now().toString().slice(-4)}`;
    const calcTotal = (Number(newRequestData.quantity) || 0) * (Number(newRequestData.price || newRequestData.offeredPrice) || 0);

    const newReq = {
      id,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
      requestTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: calcTotal,
      timeline: {
        sentAt: 'Just now',
        receivedAt: 'Just now',
        responseAt: null
      },
      ...newRequestData
    };
    setRequests((prev) => [newReq, ...prev]);
    showToast(`✓ Request #${id} submitted to farmer!`);
    return newReq;
  };

  // --------------------------------------------------------------------------
  // INVENTORY DEDUCTION ENGINE
  // --------------------------------------------------------------------------
  const deductInventory = (deductions) => {
    setProducts((prev) => deductInventoryFromProducts(prev, deductions));
  };

  // --------------------------------------------------------------------------
  // MULTI-FARM SUPPLY MATCHING ENGINE
  // --------------------------------------------------------------------------
  const findMatchingSupply = (formValues, options = {}) => {
    const { crop, quantity, maxPrice, location, deliveryDate } = formValues;
    const saveRequirement = options.saveRequirement !== undefined ? options.saveRequirement : true;

    // Utilize the centralized matching engine with anonymized farmer labeling
    const matchResult = matchSupplyLocally({
      crop,
      targetQuantity: Number(quantity) || 1000,
      maxPrice: maxPrice && Number(maxPrice) > 0 ? Number(maxPrice) : Infinity,
      location: location || 'All',
      activeInventory: products
    });

    const safeReqQty = Number(matchResult.requiredQty || matchResult.targetQuantity || quantity || 1000);
    const safeMatchedQty = Number(matchResult.totalMatchedQty ?? matchResult.totalMatchedKg ?? 0);
    const safeTotalAmt = Number(matchResult.estimatedTotalAmount ?? matchResult.totalAmount ?? 0);
    const safeAvgPrice = safeMatchedQty > 0 ? Math.round(safeTotalAmt / safeMatchedQty) : Math.round(Number(matchResult.averagePrice || 25));

    const normalizedAllocations = (matchResult.allocations || []).map((a, idx) => ({
      ...a,
      lotId: a.lotId || `LOT-${idx + 1}`,
      farmer: a.anonymizedLabel || a.farmer || `Farmer Partner #${idx + 1}`,
      location: a.location || 'Dindigul Regional Hub',
      allocatedQty: Number(a.allocatedKg ?? a.allocatedQty ?? 0),
      allocatedKg: Number(a.allocatedKg ?? a.allocatedQty ?? 0),
      price: Number(a.pricePerKg ?? a.price ?? safeAvgPrice),
      pricePerKg: Number(a.pricePerKg ?? a.price ?? safeAvgPrice),
      subtotal: Number(a.subtotal ?? ((a.allocatedKg || a.allocatedQty || 0) * (a.pricePerKg || a.price || safeAvgPrice)))
    }));

    const matchPayload = {
      ...matchResult,
      id: formValues.id || `REQ-MATCH-${Date.now().toString().slice(-4)}`,
      crop: crop || matchResult.crop,
      deliveryDate: deliveryDate || 'Within 5 Days',
      location: location || 'Central Regional Hub',
      requiredQty: safeReqQty,
      targetQuantity: safeReqQty,
      totalMatchedQty: safeMatchedQty,
      totalMatchedKg: safeMatchedQty,
      farmersCount: Number(matchResult.farmersCount || normalizedAllocations.length || 1),
      averagePrice: safeAvgPrice,
      avgPrice: safeAvgPrice,
      estimatedTotalAmount: safeTotalAmt,
      totalAmount: safeTotalAmt,
      allocations: normalizedAllocations,
      matchedItems: normalizedAllocations
    };

    setActiveMatch(matchPayload);

    // Record new requirement into state only when creating/posting
    if (saveRequirement) {
      const newReq = {
        id: formValues.id || `REQ-B${Date.now().toString().slice(-4)}`,
        crop: crop || 'Produce',
        quantity: safeReqQty,
        requiredQty: safeReqQty,
        maxPrice: maxPrice || null,
        location: location || 'All',
        deliveryDate: deliveryDate || 'Within 7 Days',
        status: matchResult.isFulfilled ? 'Active' : 'Pending'
      };
      setRequirements((prev) => [newReq, ...prev]);
    }

    if (matchResult.isFulfilled) {
      showToast(
        `✓ Perfect Match! Aggregated ${safeMatchedQty} kg across ${matchPayload.farmersCount} farmer lots.`
      );
    } else if (safeMatchedQty > 0) {
      showToast(
        `⚠️ Partial Match: Found ${safeMatchedQty} kg of ${safeReqQty} kg requested (${matchResult.shortfallKg} kg shortfall).`
      );
    } else {
      showToast(
        `No active farmer inventory currently matches ${crop}.`,
        'warning'
      );
    }

    return matchPayload;
  };

  // --------------------------------------------------------------------------
  // CREATE BULK REQUIREMENT
  // --------------------------------------------------------------------------
  const createBulkRequirement = (formValues) => {
    return findMatchingSupply(formValues);
  };

  // --------------------------------------------------------------------------
  // CONFIRM ORDER FROM MATCHED LOTS (WITH INVENTORY DEDUCTION & UNMASKING)
  // --------------------------------------------------------------------------
  const confirmOrder = (orderData) => {
    const newOrderId = `FD${1024 + orders.length}`;

    const newOrder = {
      id: newOrderId,
      crop: orderData.crop,
      quantity: orderData.quantity,
      farmers: orderData.farmers || orderData.farmerBreakdown?.length || 1,
      amount: orderData.amount,
      status: 'Confirmed',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: orderData.deliveryDate || 'Within 48 Hours',
      location: orderData.location || 'Central Distribution Hub',
      farmerBreakdown: orderData.farmerBreakdown || []
    };

    // Deduct inventory if allocations specified
    if (Array.isArray(orderData.allocationsToDeduct) && orderData.allocationsToDeduct.length > 0) {
      deductInventory(orderData.allocationsToDeduct);
    }

    setOrders((prev) => [newOrder, ...prev]);

    const newMatchedEntry = {
      id: `MS-${Date.now().toString().slice(-4)}`,
      crop: orderData.crop,
      requiredQty: orderData.quantity,
      matchedQty: orderData.quantity,
      farmersMatched: orderData.farmers || 1,
      avgPrice: orderData.quantity > 0 ? orderData.amount / orderData.quantity : 0,
      status: 'Fully Matched',
      date: new Date().toISOString().split('T')[0]
    };
    setMatchedSupplies((prev) => [newMatchedEntry, ...prev]);

    showToast(`✓ Order #${newOrderId} Confirmed! Inventory updated.`);
    return newOrder;
  };

  const confirmBulkOrder = (matchPayload, buyerDetails = {}) => {
    // If matchPayload was constructed by matchSupplyLocally with raw farmer data
    if (matchPayload.allocations && matchPayload.allocations.length > 0) {
      const newOrder = createBulkOrderRecord(matchPayload, buyerDetails);

      // Deduct inventory from active products
      if (newOrder.allocationsToDeduct) {
        deductInventory(newOrder.allocationsToDeduct);
      }

      setOrders((prev) => [newOrder, ...prev]);

      const newMatchedEntry = {
        id: `MS-${Date.now().toString().slice(-4)}`,
        crop: newOrder.crop,
        requiredQty: newOrder.quantity,
        matchedQty: newOrder.quantity,
        farmersMatched: newOrder.farmers,
        avgPrice: newOrder.quantity > 0 ? newOrder.amount / newOrder.quantity : 0,
        status: 'Fully Matched',
        date: new Date().toISOString().split('T')[0]
      };
      setMatchedSupplies((prev) => [newMatchedEntry, ...prev]);

      showToast(`✓ Order #${newOrder.id} Placed! Sellers' contact details revealed.`);
      return newOrder;
    }

    // Fallback legacy structure
    const orderData = {
      crop: matchPayload.crop,
      quantity: matchPayload.totalMatchedQty,
      farmers: matchPayload.farmersCount,
      amount: matchPayload.estimatedTotalAmount,
      deliveryDate: matchPayload.deliveryDate,
      location: matchPayload.location,
      farmerBreakdown: (matchPayload.matchedItems || []).map((lot) => ({
        farmer: lot.farmer,
        fullName: lot.farmer,
        phone: lot.farmerPhone || '+91 98421 77234',
        address: lot.farmAddress || `${lot.location || 'Dindigul'}, Tamil Nadu`,
        qty: lot.allocatedQty || lot.quantity,
        price: lot.price
      })),
      allocationsToDeduct: (matchPayload.matchedItems || []).map((lot) => ({
        lotId: lot.id || lot.lotId,
        allocatedKg: lot.allocatedQty || lot.quantity
      }))
    };
    return confirmOrder(orderData);
  };

  const confirmDirectBuyOrder = (product, buyerDetails = {}) => {
    const newOrder = createDirectBuyOrderRecord(product, buyerDetails);

    // Deduct inventory from active products
    if (newOrder.allocationsToDeduct) {
      deductInventory(newOrder.allocationsToDeduct);
    }

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`✓ Order #${newOrder.id} Placed! Direct purchase confirmed.`);
    return newOrder;
  };

  // --------------------------------------------------------------------------
  // MESSAGING BRIDGE
  // --------------------------------------------------------------------------
  const sendMessage = (convId, text) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              timestamp: 'Just now',
              messages: [...(c.messages || []), newMsg]
            }
          : c
      )
    );
  };

  const getOrCreateConversationForFarmer = (farmerName, cropName) => {
    const existing = conversations.find(
      (c) => (c.farmerName || '').toLowerCase() === (farmerName || '').toLowerCase()
    );
    if (existing) return existing.id;

    const newId = `CONV-B${Date.now().toString().slice(-4)}`;
    const newConv = {
      id: newId,
      farmerName: farmerName || 'Farmer Partner',
      crop: cropName || 'Fresh Harvest',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      unreadCount: 0,
      lastMessage: `Conversation opened regarding ${cropName || 'produce sourcing'}.`,
      timestamp: 'Just now',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          sender: 'farmer',
          text: `Vanakkam! Thanks for connecting regarding ${cropName || 'our harvest'}. How can we assist your procurement?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    return newId;
  };

  const markConversationAsRead = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // --------------------------------------------------------------------------
  // COMPUTED STATS & METRICS
  // --------------------------------------------------------------------------
  const pendingRequestsCount = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );

  const acceptedRequestsCount = useMemo(
    () => requests.filter((r) => r.status === 'Accepted').length,
    [requests]
  );

  const totalAvailableKg = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0),
    [products]
  );

  const activeOrdersCount = useMemo(
    () => orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
    [orders]
  );

  const completedOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Delivered').length,
    [orders]
  );

  const activeRequirementsCount = useMemo(
    () => requirements.filter((r) => r.status === 'Active' || r.status === 'Pending').length,
    [requirements]
  );

  const unreadMessagesCount = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [conversations]
  );

  const value = {
    products,
    setProducts,
    orders,
    setOrders,
    matchedSupplies,
    setMatchedSupplies,
    requirements,
    setRequirements,
    requests,
    setRequests,
    conversations,
    setConversations,
    activeMatch,
    setActiveMatch,
    requirementPrefill,
    setRequirementPrefill,
    toastMessage,
    showToast,
    confirmRequest,
    cancelRequest,
    declineRequest,
    createRequest,
    findMatchingSupply,
    createBulkRequirement,
    confirmOrder,
    confirmBulkOrder,
    confirmDirectBuyOrder,
    deductInventory,
    sendMessage,
    getOrCreateConversationForFarmer,
    markConversationAsRead,
    pendingRequestsCount,
    acceptedRequestsCount,
    totalAvailableKg,
    activeOrdersCount,
    completedOrdersCount,
    activeRequirementsCount,
    unreadMessagesCount
  };

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}

export function useBuyer() {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
}
