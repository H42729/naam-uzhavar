import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MATCHED_SUPPLY,
  INITIAL_REQUIREMENTS,
  INITIAL_CONSUMER_REQUESTS
} from '../data/buyerData';

const BuyerContext = createContext(null);

export function BuyerProvider({ children }) {
  // --------------------------------------------------------------------------
  // CORE STATES (backed by localStorage)
  // --------------------------------------------------------------------------
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('farmdirect_buyer_products');
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          const fresh = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          return fresh ? { ...fresh, ...p, images: fresh.images || [p.image] } : p;
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
      const saved = localStorage.getItem('farmdirect_buyer_requests');
      if (!saved) return INITIAL_CONSUMER_REQUESTS;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((r) => {
          const fresh = INITIAL_CONSUMER_REQUESTS.find((ir) => ir.id === r.id);
          return fresh ? { ...fresh, ...r, image: fresh.image } : r;
        });
      }
      return INITIAL_CONSUMER_REQUESTS;
    } catch {
      return INITIAL_CONSUMER_REQUESTS;
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
    localStorage.setItem('farmdirect_buyer_products', JSON.stringify(products));
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
    localStorage.setItem('farmdirect_buyer_requests', JSON.stringify(requests));
  }, [requests]);

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
    const calculatedAmount = targetReq.totalAmount || (targetReq.offeredPrice * targetReq.quantity);

    const newOrder = {
      id: newOrderId,
      crop: targetReq.crop,
      quantity: targetReq.quantity,
      farmers: 1,
      amount: calculatedAmount,
      status: 'Confirmed',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: targetReq.deliveryDate || 'Within 48 Hours',
      location: targetReq.location || 'Direct Consignment Hub',
      farmerBreakdown: [
        {
          farmer: targetReq.farmer,
          qty: targetReq.quantity,
          price: targetReq.offeredPrice
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // 3. Log into matched supply history
    const newMatchedEntry = {
      id: `MS-${Date.now().toString().slice(-4)}`,
      crop: targetReq.crop,
      requiredQty: targetReq.quantity,
      matchedQty: targetReq.quantity,
      farmersMatched: 1,
      avgPrice: targetReq.offeredPrice,
      status: 'Fully Matched',
      date: new Date().toISOString().split('T')[0]
    };
    setMatchedSupplies((prev) => [newMatchedEntry, ...prev]);

    showToast(`✓ Request ${targetReq.id} Confirmed! Order ${newOrderId} generated successfully.`);
    return { success: true, order: newOrder };
  };

  const declineRequest = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
    showToast(`Request ${requestId} declined.`);
  };

  const createRequest = (newRequestData) => {
    const id = `REQ-C${Date.now().toString().slice(-4)}`;
    const newReq = {
      id,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
      ...newRequestData
    };
    setRequests((prev) => [newReq, ...prev]);
    showToast(`✓ Sourcing request ${id} submitted to farmers!`);
    return newReq;
  };

  // --------------------------------------------------------------------------
  // MULTI-FARM SUPPLY MATCHING ENGINE
  // --------------------------------------------------------------------------
  const findMatchingSupply = (formValues) => {
    const { crop, quantity, maxPrice, location, deliveryDate } = formValues;

    // Filter available pool matching crop & within maximum price
    let candidateSupplies = products.filter(
      (p) =>
        p.crop.toLowerCase() === crop.toLowerCase() &&
        p.price <= maxPrice
    );

    // Prioritize lowest price and regional proximity
    candidateSupplies.sort((a, b) => {
      if (location && location !== 'All Locations') {
        const aLoc = a.location === location ? 0 : 1;
        const bLoc = b.location === location ? 0 : 1;
        if (aLoc !== bLoc) return aLoc - bLoc;
      }
      return a.price - b.price;
    });

    let remainingNeeded = quantity;
    const allocatedLots = [];

    for (const lot of candidateSupplies) {
      if (remainingNeeded <= 0) break;
      const takeQty = Math.min(lot.quantity, remainingNeeded);
      allocatedLots.push({
        ...lot,
        allocatedQty: takeQty
      });
      remainingNeeded -= takeQty;
    }

    const totalMatchedQty = allocatedLots.reduce((acc, curr) => acc + curr.allocatedQty, 0);
    const estimatedTotalAmount = allocatedLots.reduce(
      (acc, curr) => acc + curr.allocatedQty * curr.price,
      0
    );
    const averagePrice = totalMatchedQty > 0 ? estimatedTotalAmount / totalMatchedQty : 0;
    const isFullyMatched = totalMatchedQty >= quantity;

    const matchPayload = {
      crop,
      requiredQty: quantity,
      maxPrice,
      location: location || 'Dindigul',
      deliveryDate,
      matchedItems: allocatedLots,
      totalMatchedQty,
      isFullyMatched,
      farmersCount: allocatedLots.length,
      averagePrice,
      estimatedTotalAmount
    };

    setActiveMatch(matchPayload);

    // Also record requirement into list
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      crop,
      quantity,
      maxPrice,
      location,
      deliveryDate,
      status: isFullyMatched ? 'Matched' : 'Pending'
    };
    setRequirements((prev) => [newReq, ...prev]);

    showToast(
      isFullyMatched
        ? `✓ Perfect Match! Aggregated ${totalMatchedQty} kg across ${allocatedLots.length} farmer lots.`
        : `Partial Match: Found ${totalMatchedQty} kg of ${quantity} kg requested.`
    );

    return matchPayload;
  };

  // --------------------------------------------------------------------------
  // CONFIRM ORDER FROM MATCHED LOTS
  // --------------------------------------------------------------------------
  const confirmOrder = (orderData) => {
    const newOrderId = `FD${1024 + orders.length}`;

    const newOrder = {
      id: newOrderId,
      crop: orderData.crop,
      quantity: orderData.quantity,
      farmers: orderData.farmers,
      amount: orderData.amount,
      status: 'Confirmed',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: orderData.deliveryDate,
      location: orderData.location,
      farmerBreakdown: orderData.farmerBreakdown
    };

    setOrders((prev) => [newOrder, ...prev]);

    const newMatchedEntry = {
      id: `MS-${Date.now().toString().slice(-4)}`,
      crop: orderData.crop,
      requiredQty: orderData.quantity,
      matchedQty: orderData.quantity,
      farmersMatched: orderData.farmers,
      avgPrice: orderData.amount / orderData.quantity,
      status: 'Fully Matched',
      date: new Date().toISOString().split('T')[0]
    };
    setMatchedSupplies((prev) => [newMatchedEntry, ...prev]);

    showToast(`✓ Order ${newOrderId} Confirmed! Supply aggregated from ${orderData.farmers} farmers.`);
    return newOrder;
  };

  // --------------------------------------------------------------------------
  // COMPUTED STATS & METRICS
  // --------------------------------------------------------------------------
  const pendingRequestsCount = useMemo(
    () => requests.filter((r) => r.status === 'Pending').length,
    [requests]
  );

  const totalAvailableKg = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0),
    [products]
  );

  const matchedOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Confirmed' || o.status === 'In Transit').length,
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
    activeMatch,
    setActiveMatch,
    requirementPrefill,
    setRequirementPrefill,
    toastMessage,
    showToast,
    confirmRequest,
    declineRequest,
    createRequest,
    findMatchingSupply,
    confirmOrder,
    pendingRequestsCount,
    totalAvailableKg,
    matchedOrdersCount,
    completedOrdersCount,
    activeRequirementsCount
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
