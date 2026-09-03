/**
 * Farmer Context & State Provider
 * Platform: Naam Uzhavar (Direct Farmer Marketplace)
 * Provides centralized frontend mock state for farmer harvests, buyer requests, deliveries, and communication.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmerContext = createContext(null);

export const DEFAULT_FARMER_PROFILE = {
  name: 'Arun Kumar',
  tamilName: 'அருண் குமார்',
  phone: '+91 98421 88920',
  email: 'arun.farm@naamuzhavar.in',
  state: 'Tamil Nadu',
  district: 'Dindigul',
  taluk: 'Nilakottai',
  village: 'Batlagundu Road, Nilakottai',
  address: 'Survey No. 44/2, Batlagundu Main Road, Nilakottai, Dindigul - 624208',
  maskedAadhaar: 'XXXX-XXXX-4819',
  pattaStatus: 'Verified (e-Patta #TN-DG-2024-88492)',
  landSize: '4.5 Acres (Horticulture & Vegetables)',
  fpoMembership: 'Nilakottai Horticulture Farmers Producer Co-op',
  isVerified: true,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  rating: 4.9,
  totalDeliveriesCount: 42
};

export const INITIAL_HARVESTS = [
  {
    id: 'HRV-101',
    name: 'Tomato (நாட்டு தக்காளி)',
    cropName: 'Tomato',
    tamilName: 'நாட்டு தக்காளி',
    quantity: '250',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Available',
    buyerRequestCount: 3,
    harvestDate: 'Today (Morning Harvest)',
    pricePerKg: 28,
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-102',
    name: 'Small Red Onions (சின்ன வெங்காயம்)',
    cropName: 'Onion',
    tamilName: 'சின்ன வெங்காயம்',
    quantity: '400',
    unit: 'kg',
    isEstimated: true,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Buyer Request',
    buyerRequestCount: 2,
    harvestDate: 'Yesterday',
    pricePerKg: 38,
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-103',
    name: 'Carrots (கேரட்)',
    cropName: 'Carrot',
    tamilName: 'கேரட்',
    quantity: '150',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Reserved',
    buyerRequestCount: 1,
    harvestDate: '2 days ago',
    pricePerKg: 45,
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-104',
    name: 'Green Bananas (வாழைக்காய்)',
    cropName: 'Banana',
    tamilName: 'பச்சை வாழைக்காய்',
    quantity: '500',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Pickup Scheduled',
    buyerRequestCount: 1,
    harvestDate: '1 day ago',
    pricePerKg: 22,
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-105',
    name: 'Potatoes (உருளைக்கிழங்கு)',
    cropName: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    quantity: '300',
    unit: 'kg',
    isEstimated: true,
    quality: 'Average',
    location: 'Dindigul, Tamil Nadu',
    status: 'Available',
    buyerRequestCount: 0,
    harvestDate: '3 days ago',
    pricePerKg: 26,
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-106',
    name: 'Sweet Corn (மக்காச்சோளம்)',
    cropName: 'Corn',
    tamilName: 'மக்காச்சோளம்',
    quantity: '200',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Available',
    buyerRequestCount: 1,
    harvestDate: 'Today',
    pricePerKg: 20,
    images: [
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-107',
    name: 'Green Chillies (பச்சை மிளகாய்)',
    cropName: 'Chilli',
    tamilName: 'பச்சை மிளகாய்',
    quantity: '75',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Sold',
    buyerRequestCount: 0,
    harvestDate: '4 days ago',
    pricePerKg: 65,
    images: [
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'HRV-108',
    name: 'Bangalora Mangoes (மாம்பழம்)',
    cropName: 'Mango',
    tamilName: 'செந்தூரம் மாம்பழம்',
    quantity: '350',
    unit: 'kg',
    isEstimated: false,
    quality: 'Good / Fresh',
    location: 'Dindigul, Tamil Nadu',
    status: 'Available',
    buyerRequestCount: 2,
    harvestDate: 'Yesterday',
    pricePerKg: 55,
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_BUYER_REQUESTS = [
  {
    id: 'REQ-901',
    buyerName: 'ABC Retail Dindigul',
    buyerType: 'Supermarket Chain',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    cropRequested: 'Tomato (நாட்டு தக்காளி)',
    quantity: '150 kg',
    offerPrice: '₹28 / kg',
    totalValue: '₹4,200',
    location: 'Palani Road, Dindigul Central Hub',
    requestDate: 'Today, 08:30 AM',
    message: 'Need 150 kg grade-A country tomatoes for our morning dispatch. Pickup van ready at Nilakottai.',
    phone: '+91 94432 10987',
    status: 'Pending'
  },
  {
    id: 'REQ-902',
    buyerName: 'FreshBasket Supermarkets',
    buyerType: 'Retail Store Network',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    cropRequested: 'Small Red Onions (சின்ன வெங்காயம்)',
    quantity: '250 kg',
    offerPrice: '₹38 / kg',
    totalValue: '₹9,500',
    location: 'Madurai Bye-Pass Depot',
    requestDate: 'Today, 09:15 AM',
    message: 'Urgent procurement for Madurai central distribution. Guaranteed payment upon electronic gate delivery.',
    phone: '+91 98421 77654',
    status: 'Pending'
  },
  {
    id: 'REQ-903',
    buyerName: 'Hotel Sri Lakshmi Grand & Caterers',
    buyerType: 'Hospitality Chain',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    cropRequested: 'Potatoes (உருளைக்கிழங்கு)',
    quantity: '100 kg',
    offerPrice: '₹26 / kg',
    totalValue: '₹2,600',
    location: 'Dindigul Collectorate Junction',
    requestDate: 'Yesterday, 05:45 PM',
    message: 'Regular weekly requirement for catering kitchen. Quality check required on farm site.',
    phone: '+91 97890 55432',
    status: 'Pending'
  },
  {
    id: 'REQ-904',
    buyerName: 'Kovai Organic Retailers Association',
    buyerType: 'Organic Wholesaler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    cropRequested: 'Carrots (கேரட்)',
    quantity: '150 kg',
    offerPrice: '₹46 / kg',
    totalValue: '₹6,900',
    location: 'Coimbatore Wholesale Mandi',
    requestDate: 'Yesterday, 11:20 AM',
    message: 'Clean washed carrots preferred. Driver assigned for morning pickup.',
    phone: '+91 96550 99881',
    status: 'Accepted'
  },
  {
    id: 'REQ-905',
    buyerName: 'Nilgiris Daily Needs',
    buyerType: 'Departmental Store',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    cropRequested: 'Sweet Corn',
    quantity: '200 kg',
    offerPrice: '₹19 / kg',
    totalValue: '₹3,800',
    location: 'Theni Highway Cross, Batlagundu',
    requestDate: '2 days ago',
    message: 'Looking for 200kg tender sweet corn cobs.',
    phone: '+91 94441 33221',
    status: 'Declined'
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'ORD-1024',
    trackingNumber: 'TRK-TN-2026-1024',
    buyerName: 'ABC Retail Dindigul',
    crop: 'Tomato (நாட்டு தக்காளி)',
    quantity: '150 kg (6 crates)',
    driverName: 'Raj Kumar',
    driverPhone: '+91 98421 44550',
    vehicleNumber: 'TN-57-AB-4029 (Tata Ace)',
    pickupLocation: 'Arun Kumar Farm, Nilakottai',
    dropLocation: 'ABC Retail Central Bay #4, Palani Road, Dindigul',
    estimatedArrival: '11:45 AM (In 25 mins)',
    currentStage: 'In Transit',
    stages: ['Order Accepted', 'Driver Assigned', 'Pickup', 'In Transit', 'Delivered'],
    stageIndex: 3,
    statusText: 'Driver is en route to Dindigul Depot via NH-44 corridor'
  },
  {
    id: 'ORD-1022',
    trackingNumber: 'TRK-TN-2026-1022',
    buyerName: 'FreshBasket Supermarkets',
    crop: 'Small Red Onions (சின்ன வெங்காயம்)',
    quantity: '250 kg (10 bags)',
    driverName: 'Murugan S.',
    driverPhone: '+91 98422 11223',
    vehicleNumber: 'TN-58-CD-8812 (Mahindra Bolero Maxi)',
    pickupLocation: 'Arun Kumar Farm, Nilakottai',
    dropLocation: 'Madurai Wholesale Ring Road Depot',
    estimatedArrival: 'Completed at 08:30 AM',
    currentStage: 'Delivered',
    stages: ['Order Accepted', 'Driver Assigned', 'Pickup', 'In Transit', 'Delivered'],
    stageIndex: 4,
    statusText: 'Consignment successfully delivered with verified digital e-way signature'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'CONV-F1',
    buyerId: 'B-101',
    buyerName: 'ABC Retail Procurement (Sundar)',
    buyerType: 'Supermarket Chain • Dindigul',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    unreadCount: 1,
    lastMessage: 'Driver Raj Kumar is reaching your farm gate in 10 mins.',
    timestamp: '10:15 AM',
    phone: '+91 94432 10987',
    messages: [
      {
        id: 'M1',
        sender: 'buyer',
        text: 'Vanakkam Arun sir. We placed an offer for 150 kg Tomatoes on your harvest listing.',
        time: '08:30 AM'
      },
      {
        id: 'M2',
        sender: 'farmer',
        text: 'Vanakkam Sundar sir! Offer accepted. The crates are pre-weighed and sorted.',
        time: '08:45 AM'
      },
      {
        id: 'M3',
        sender: 'buyer',
        text: 'Driver Raj Kumar is reaching your farm gate in 10 mins.',
        time: '10:15 AM'
      }
    ]
  },
  {
    id: 'CONV-F2',
    buyerId: 'B-102',
    buyerName: 'FreshBasket Central Hub',
    buyerType: 'Retail Store Network • Madurai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    unreadCount: 0,
    lastMessage: 'Payment of ₹9,500 transferred via IMPS. Thank you!',
    timestamp: 'Yesterday',
    phone: '+91 98421 77654',
    messages: [
      {
        id: 'M201',
        sender: 'buyer',
        text: 'Onion consignment reached depot in top quality condition.',
        time: 'Yesterday, 04:30 PM'
      },
      {
        id: 'M202',
        sender: 'buyer',
        text: 'Payment of ₹9,500 transferred via IMPS. Thank you!',
        time: 'Yesterday, 04:45 PM'
      }
    ]
  }
];

export function FarmerProvider({ children }) {
  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_farmer_profile_v3');
    return saved ? JSON.parse(saved) : DEFAULT_FARMER_PROFILE;
  });

  const [harvests, setHarvests] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_harvests_v3');
    return saved ? JSON.parse(saved) : INITIAL_HARVESTS;
  });

  const [buyerRequests, setBuyerRequests] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_buyer_requests_v3');
    return saved ? JSON.parse(saved) : INITIAL_BUYER_REQUESTS;
  });

  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_deliveries_v3');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('naam_uzhavar_conversations_v3');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('naam_uzhavar_farmer_profile_v3', JSON.stringify(farmerProfile));
  }, [farmerProfile]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_harvests_v3', JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_buyer_requests_v3', JSON.stringify(buyerRequests));
  }, [buyerRequests]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_deliveries_v3', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('naam_uzhavar_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  const showToast = (title, message, type = 'success') => {
    setToast({ id: Date.now(), title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add Harvest Flow
  const addHarvest = (newHarvestData) => {
    const newHarvest = {
      id: `HRV-${Date.now().toString().slice(-4)}`,
      status: 'Available',
      buyerRequestCount: 0,
      harvestDate: 'Just Now',
      location: 'Dindigul, Tamil Nadu',
      ...newHarvestData
    };

    setHarvests((prev) => [newHarvest, ...prev]);
    showToast(
      '🌱 Harvest Added Successfully!',
      `Your ${newHarvest.cropName || 'crop'} (${newHarvest.quantity} ${newHarvest.unit}) is now visible to buyers.`,
      'success'
    );
    return newHarvest;
  };

  const removeHarvest = (id, name) => {
    setHarvests((prev) => prev.filter((h) => h.id !== id));
    showToast('Harvest Removed', `"${name || 'Listing'}" has been removed from marketplace.`, 'warning');
  };

  const updateHarvest = (id, updatedFields) => {
    setHarvests((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedFields } : h))
    );
    showToast('Updated', 'Harvest details updated successfully.', 'info');
  };

  // Buyer Requests Operations
  const acceptRequest = (requestId) => {
    setBuyerRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Accepted' } : r))
    );
    const req = buyerRequests.find((r) => r.id === requestId);
    showToast(
      'Order Accepted! 🎉',
      `You accepted the request from ${req?.buyerName || 'the buyer'} for ${req?.quantity || 'produce'}.`,
      'success'
    );
  };

  const declineRequest = (requestId) => {
    setBuyerRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
    const req = buyerRequests.find((r) => r.id === requestId);
    showToast('Request Declined', `Declined request from ${req?.buyerName || 'the buyer'}.`, 'info');
  };

  // Messaging Operations
  const sendMessage = (conversationId, text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: `M-${Date.now()}`,
      sender: 'farmer',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            timestamp: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  // Stats
  const activeHarvestsCount = harvests.filter((h) => h.status === 'Available' || h.status === 'Buyer Request').length;
  const pendingRequestsCount = buyerRequests.filter((r) => r.status === 'Pending').length;
  const acceptedOrdersCount = buyerRequests.filter((r) => r.status === 'Accepted').length;
  const activeDeliveriesCount = deliveries.filter((d) => d.currentStage !== 'Delivered').length;

  const stats = {
    myHarvest: activeHarvestsCount || 8,
    buyerRequests: pendingRequestsCount || 3,
    accepted: acceptedOrdersCount || 5,
    deliveries: activeDeliveriesCount || 2,
    activeProducts: activeHarvestsCount
  };

  return (
    <FarmerContext.Provider
      value={{
        farmerProfile,
        setFarmerProfile,
        harvests,
        products: harvests, // alias for backwards compatibility
        buyerRequests,
        requests: buyerRequests, // alias
        deliveries,
        conversations,
        stats,
        toast,
        addHarvest,
        addProduct: addHarvest, // alias
        removeHarvest,
        deleteProduct: removeHarvest, // alias
        updateHarvest,
        acceptRequest,
        declineRequest,
        sendMessage,
        showToast
      }}
    >
      {children}
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

export default FarmerContext;
