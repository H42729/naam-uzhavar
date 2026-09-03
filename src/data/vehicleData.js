/**
 * Nearby Logistics Vehicles Dataset for Buyer Portal
 * Naam Uzhavar / FarmDirect Platform
 * Covers agricultural transport hubs around Dindigul, Oddanchatram, Nilakottai & Coimbatore.
 */

export const NEARBY_VEHICLES = [
  {
    id: 'VEH-101',
    name: 'Tata Ace Gold',
    tamilName: 'டாடா ஏஸ் கோல்ட்',
    category: 'mini',
    capacityKg: 750,
    capacityLabel: '750 kg',
    ratePerKm: 15,
    baseFare: 350,
    isRefrigerated: false,
    regNumber: 'TN-57-AB-4921',
    driver: {
      name: 'Murugan K.',
      tamilName: 'முருகன் கே.',
      phone: '+91 98421 77310',
      rating: 4.9,
      totalTrips: 184,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      experienceYears: 6,
      badge: 'Top Rated Driver'
    },
    locationName: 'Oddanchatram Mandi Gate',
    tamilLocationName: 'ஒட்டன்சத்திரம் மண்டி வாசல்',
    distanceKm: 1.8,
    etaMins: 12,
    status: 'AVAILABLE',
    icon: 'bi-truck'
  },
  {
    id: 'VEH-102',
    name: 'Mahindra Bolero Maxi Truck',
    tamilName: 'மகிந்திரா பொலேரோ மேக்ஸி',
    category: 'pickup',
    capacityKg: 1200,
    capacityLabel: '1.2 Ton',
    ratePerKm: 18,
    baseFare: 450,
    isRefrigerated: false,
    regNumber: 'TN-57-E-8824',
    driver: {
      name: 'Selvam P.',
      tamilName: 'செல்வம் பி.',
      phone: '+91 94432 66190',
      rating: 4.8,
      totalTrips: 240,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      experienceYears: 8,
      badge: 'FPO Verified Carrier'
    },
    locationName: 'Nilakottai Horticultural Hub',
    tamilLocationName: 'நிலக்கோட்டை தோட்டக்கலை மையம்',
    distanceKm: 3.2,
    etaMins: 18,
    status: 'AVAILABLE',
    icon: 'bi-truck-flatbed'
  },
  {
    id: 'VEH-103',
    name: 'Ashok Leyland Dost Reefer (Cold-Chain)',
    tamilName: 'அசோக் லேலண்ட் தோஸ்த் குளிர்பதனம்',
    category: 'reefer',
    capacityKg: 1500,
    capacityLabel: '1.5 Ton (Chilled 4-8°C)',
    ratePerKm: 24,
    baseFare: 600,
    isRefrigerated: true,
    tempRange: '4°C to 8°C',
    regNumber: 'TN-58-CK-1092',
    driver: {
      name: 'Karthik R.',
      tamilName: 'கார்த்திக் ஆர்.',
      phone: '+91 97890 55430',
      rating: 5.0,
      totalTrips: 312,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      experienceYears: 10,
      badge: 'Certified Cold-Chain Specialist'
    },
    locationName: 'Dindigul Cold Storage Park',
    tamilLocationName: 'திண்டுக்கல் குளிர்பதன கிடங்கு',
    distanceKm: 4.1,
    etaMins: 22,
    status: 'AVAILABLE',
    icon: 'bi-snow'
  },
  {
    id: 'VEH-104',
    name: 'Eicher Pro 2049 Commercial Truck',
    tamilName: 'ஐச்சர் புரோ 2049 சரக்கு லாரி',
    category: 'heavy',
    capacityKg: 2500,
    capacityLabel: '2.5 Ton',
    ratePerKm: 28,
    baseFare: 800,
    isRefrigerated: false,
    regNumber: 'TN-57-M-3319',
    driver: {
      name: 'Vignesh M.',
      tamilName: 'விக்னேஷ் எம்.',
      phone: '+91 98654 22180',
      rating: 4.9,
      totalTrips: 415,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      experienceYears: 12,
      badge: 'Heavy Freight Master'
    },
    locationName: 'Palani Highway Toll Post',
    tamilLocationName: 'பழனி நெடுஞ்சாலை சுங்கச்சாவடி',
    distanceKm: 6.5,
    etaMins: 28,
    status: 'AVAILABLE',
    icon: 'bi-truck'
  },
  {
    id: 'VEH-105',
    name: 'Piaggio Ape E-Xtra Cargo (EV)',
    tamilName: 'பியாஜியோ ஆட்டோ எலெக்ட்ரிக்',
    category: 'mini',
    capacityKg: 500,
    capacityLabel: '500 kg (Green EV)',
    ratePerKm: 12,
    baseFare: 250,
    isRefrigerated: false,
    regNumber: 'TN-57-EV-0412',
    driver: {
      name: 'Anandh S.',
      tamilName: 'ஆனந்த் எஸ்.',
      phone: '+91 96291 44870',
      rating: 4.7,
      totalTrips: 98,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      experienceYears: 4,
      badge: 'Eco Green EV Courier'
    },
    locationName: 'Nilakottai Town Bus Stand',
    tamilLocationName: 'நிலக்கோட்டை பேருந்து நிலையம்',
    distanceKm: 2.1,
    etaMins: 14,
    status: 'AVAILABLE',
    icon: 'bi-lightning-charge'
  }
];

export const POPULAR_PICKUP_POINTS = [
  { id: 'PK-01', name: 'Arun Organic Farms, Nilakottai Belt', district: 'Dindigul', distanceKm: 2.5 },
  { id: 'PK-02', name: 'Oddanchatram Central Vegetable Market', district: 'Dindigul', distanceKm: 1.8 },
  { id: 'PK-03', name: 'Palani Farmers Collective Packhouse', district: 'Dindigul', distanceKm: 6.0 },
  { id: 'PK-04', name: 'Batlagundu Banana & Fruit Mandi', district: 'Dindigul', distanceKm: 8.2 }
];

export const POPULAR_DROPOFF_POINTS = [
  { id: 'DP-01', name: 'ABC Retail Distribution Depot, Dindigul', distanceKm: 18 },
  { id: 'DP-02', name: 'FreshMart Regional Hub, Coimbatore', distanceKm: 85 },
  { id: 'DP-03', name: 'Madurai Wholesale Fulfillment Center', distanceKm: 62 },
  { id: 'DP-04', name: 'Tiruppur Supermarket Central Depot', distanceKm: 95 }
];
