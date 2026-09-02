/**
 * Driver Logistics & Route Management Data Seeds
 * Naam Uzhavar / FarmDirect Platform
 */

export const DELIVERY_STATUSES = {
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  GOING_TO_PICKUP: 'GOING_TO_PICKUP',
  ARRIVED_AT_PICKUP: 'ARRIVED_AT_PICKUP',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  ARRIVED_AT_DROP: 'ARRIVED_AT_DROP',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const STATUS_LABELS = {
  [DELIVERY_STATUSES.ASSIGNED]: 'Assigned',
  [DELIVERY_STATUSES.ACCEPTED]: 'Accepted',
  [DELIVERY_STATUSES.GOING_TO_PICKUP]: 'Going to Pickup',
  [DELIVERY_STATUSES.ARRIVED_AT_PICKUP]: 'Arrived at Pickup',
  [DELIVERY_STATUSES.PICKED_UP]: 'Picked Up',
  [DELIVERY_STATUSES.IN_TRANSIT]: 'In Transit',
  [DELIVERY_STATUSES.ARRIVED_AT_DROP]: 'Arrived at Drop',
  [DELIVERY_STATUSES.DELIVERED]: 'Delivered',
  [DELIVERY_STATUSES.CANCELLED]: 'Cancelled'
};

export const ROUTE_STAGES = [
  { id: 'ACCEPTED', label: 'Request Accepted', icon: 'bi-check-circle' },
  { id: 'GOING_TO_PICKUP', label: 'Going to Pickup', icon: 'bi-signpost-2' },
  { id: 'ARRIVED_AT_PICKUP', label: 'Arrived at Pickup', icon: 'bi-geo-alt' },
  { id: 'PICKED_UP', label: 'Goods Collected', icon: 'bi-box-seam' },
  { id: 'IN_TRANSIT', label: 'In Transit', icon: 'bi-truck' },
  { id: 'ARRIVED_AT_DROP', label: 'Arrived at Buyer', icon: 'bi-shop' },
  { id: 'DELIVERED', label: 'Delivered', icon: 'bi-patch-check-fill' }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'ORD-1024',
    trackingNumber: 'TRK-NU-2026-1024',
    status: DELIVERY_STATUSES.IN_TRANSIT,
    assignedAt: '2026-09-02T16:30:00Z',
    acceptedAt: '2026-09-02T16:35:00Z',
    pickupCompletedAt: '2026-09-02T17:15:00Z',
    deliveredAt: null,

    // Farmer / Pickup information
    farmer: {
      name: 'Arun Kumar',
      farmName: 'Arun Organic Farms',
      phone: '+91 98765 43210',
      address: 'Survey No. 42, Nilakottai Horticultural Belt, Dindigul District',
      district: 'Dindigul',
      taluk: 'Nilakottai',
      pincode: '624208',
      latitude: 10.165,
      longitude: 77.855,
      pickupInstructions: 'Enter through North gate near farm weighbridge. Cold storage warehouse on the left.',
      contactPerson: 'Arun Kumar (Owner)'
    },

    // Buyer / Drop information
    buyer: {
      name: 'ABC Retail',
      businessType: 'Institutional Supermarket Chain',
      phone: '+91 98765 01234',
      address: 'Central Distribution Depot, GT Road, Dindigul',
      district: 'Dindigul',
      taluk: 'Dindigul West',
      pincode: '624001',
      latitude: 10.362,
      longitude: 77.969,
      dropInstructions: 'Loading bay #4 at rear. Security desk will verify digital e-Way bill and invoice.',
      receiverName: 'Sundar Rajan (Receiving Manager)'
    },

    // Cargo & Products Information
    products: [
      {
        id: 'CRG-01',
        name: 'Tomato',
        tamilName: 'நாட்டு தக்காளி',
        variety: 'Country Fresh Grade-A',
        quantity: 150,
        unit: 'kg',
        crates: 6,
        crateWeight: 25,
        tempRequirement: 'Ambient / Ventilated (16-20°C)',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'
      },
      {
        id: 'CRG-02',
        name: 'Onion',
        tamilName: 'சின்ன வெங்காயம்',
        variety: 'Bellary Medium Dry',
        quantity: 100,
        unit: 'kg',
        crates: 4,
        crateWeight: 25,
        tempRequirement: 'Dry Well-Ventilated',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&auto=format&fit=crop&q=80'
      }
    ],

    totalWeight: 250,
    totalCrates: 10,
    cargoVerificationCode: 'NU-SEAL-8894',
    isTemperatureControlled: false,
    cargoDiscrepancyNotes: null,

    // Route Metrics
    distance: 18.0,
    remainingDistance: 9.5,
    distanceToPickup: 8.5,
    etaMinutes: 32,
    etaToDropMinutes: 17,
    speedKmh: 42,
    currentLocation: {
      name: 'NH-44 Bypass near Chettinaickanpatti',
      latitude: 10.255,
      longitude: 77.905
    },

    // Vehicle & Driver assignment
    vehicle: {
      registrationNumber: 'TN-57-AB-4029',
      type: 'Tata Ace Super Mini-Truck',
      payloadCapacityKg: 750,
      fuelType: 'Diesel',
      insuranceValidTill: '2027-03-31'
    },

    // Proof of delivery record (populated when delivered)
    proofOfDelivery: null
  },
  {
    id: 'ORD-1025',
    trackingNumber: 'TRK-NU-2026-1025',
    status: DELIVERY_STATUSES.ASSIGNED,
    assignedAt: '2026-09-02T17:00:00Z',
    acceptedAt: null,
    pickupCompletedAt: null,
    deliveredAt: null,

    farmer: {
      name: 'Ravi Farms',
      farmName: 'Green Valley Organic',
      phone: '+91 94432 11099',
      address: 'Sempatty Road, Oddanchatram, Tamil Nadu',
      district: 'Dindigul',
      taluk: 'Oddanchatram',
      pincode: '624619',
      latitude: 10.485,
      longitude: 77.755,
      pickupInstructions: 'Pick up sorted potato sacks from packing shed.',
      contactPerson: 'Ravi'
    },

    buyer: {
      name: 'FreshMart Supermarket',
      businessType: 'Retail Mart',
      phone: '+91 98421 88344',
      address: 'Trichy Main Road, Dindigul Central',
      district: 'Dindigul',
      taluk: 'Dindigul',
      pincode: '624003',
      latitude: 10.37,
      longitude: 77.98,
      dropInstructions: 'Deliver before 8 PM.',
      receiverName: 'Muthu'
    },

    products: [
      {
        id: 'CRG-03',
        name: 'Potato',
        tamilName: 'உருளைக்கிழங்கு',
        variety: 'Hill Potato Grade-A',
        quantity: 350,
        unit: 'kg',
        crates: 14,
        crateWeight: 25,
        tempRequirement: 'Dry storage',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80'
      }
    ],

    totalWeight: 350,
    totalCrates: 14,
    cargoVerificationCode: 'NU-SEAL-9012',
    isTemperatureControlled: false,
    cargoDiscrepancyNotes: null,

    distance: 28.5,
    remainingDistance: 28.5,
    distanceToPickup: 14.0,
    etaMinutes: 48,
    etaToDropMinutes: 48,
    speedKmh: 0,
    currentLocation: {
      name: 'Oddanchatram Checkpost',
      latitude: 10.48,
      longitude: 77.75
    },

    vehicle: {
      registrationNumber: 'TN-57-AB-4029',
      type: 'Tata Ace Super Mini-Truck',
      payloadCapacityKg: 750,
      fuelType: 'Diesel',
      insuranceValidTill: '2027-03-31'
    },

    proofOfDelivery: null
  }
];

export const DRIVER_PROFILE = {
  name: 'Raj Kumar',
  tamilName: 'ராஜ்குமார்',
  driverId: 'DRV-TN-4029',
  phone: '+91 98421 66543',
  email: 'driver@naamuzhavar.com',
  rating: 4.9,
  totalTrips: 184,
  onTimeRate: '98.4%',
  vehicleModel: 'Tata Ace Super (TN-57-AB-4029)',
  licenseNumber: 'TN-57-20180004921',
  licenseValidity: '2032-08-14',
  insuranceValidity: '2027-03-31',
  fcValidity: '2028-11-20',
  bankAccount: 'SBI A/c **** 4819 (IFSC: SBIN0001429)',
  upiId: 'rajkumar.driver@upi',
  status: 'Online',
  preferredDistricts: ['Dindigul', 'Madurai', 'Theni', 'Trichy'],
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
};

export const AVAILABLE_REQUESTS = [
  {
    id: 'REQ-DRV-101',
    orderId: 'ORD-1028',
    crop: 'Cauliflower & Drumstick',
    tamilCrop: 'காலிஃபிளவர் & முருங்கை',
    farmer: 'K. Palanisamy',
    farmLocation: 'Oddanchatram Vegetable Yard, Dindigul',
    buyer: 'Madurai Fresh Bazaar',
    dropLocation: 'Mattuthavani Central Market, Madurai',
    weight: '380 kg',
    crates: 15,
    distance: '72 km',
    pickupTime: 'Today, 07:30 PM',
    payout: 2450,
    vehicleRequired: 'Tata Ace / Bolero Pickup',
    temperature: 'Ventilated Crate Transport',
    status: 'AVAILABLE'
  },
  {
    id: 'REQ-DRV-102',
    orderId: 'ORD-1029',
    crop: 'Cumbum Valley Grapes',
    tamilCrop: 'பன்னீர் திராட்சை',
    farmer: 'M. Selvaraj',
    farmLocation: 'Cumbum Grape Orchards, Theni',
    buyer: 'ABC Retail Distribution Hub',
    dropLocation: 'Dindigul Bypass Depot',
    weight: '420 kg',
    crates: 20,
    distance: '65 km',
    pickupTime: 'Tomorrow, 06:00 AM',
    payout: 2100,
    vehicleRequired: 'Tata Ace / 1-Ton Mini',
    temperature: 'Cold-Chain Protected (14-16°C)',
    status: 'AVAILABLE'
  },
  {
    id: 'REQ-DRV-103',
    orderId: 'ORD-1030',
    crop: 'Hill Garlic (Kodaikanal Malai Poondu)',
    tamilCrop: 'கொடைக்கானல் மலைப்பூண்டு',
    farmer: 'V. Murugesan',
    farmLocation: 'Gudalur Hill Depot, Dindigul',
    buyer: 'Trichy Central Wholesale Mandi',
    dropLocation: 'Gandhi Market, Trichy',
    weight: '300 kg',
    crates: 12,
    distance: '88 km',
    pickupTime: 'Tomorrow, 08:30 AM',
    payout: 2950,
    vehicleRequired: 'Mini Truck (Dry Covered)',
    temperature: 'Dry Ambient',
    status: 'AVAILABLE'
  }
];

export const DELIVERY_HISTORY = [
  {
    id: 'ORD-1022',
    trackingNumber: 'TRK-NU-2026-1022',
    completedAt: 'Yesterday, 05:40 PM',
    farmer: 'Arun Organic Farms, Nilakottai',
    buyer: 'Reliance Smart Superstore, Dindigul',
    crop: 'Country Tomato (Grade-A)',
    weight: '200 kg',
    distance: '18 km',
    payout: 1250,
    rating: 5,
    receiver: 'R. Senthil (Store Manager)',
    status: 'DELIVERED',
    proofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'ORD-1020',
    trackingNumber: 'TRK-NU-2026-1020',
    completedAt: '01 Sep 2026, 04:15 PM',
    farmer: 'Batlagundu Onion Growers FPO',
    buyer: 'Chennai Supermart Hub, Dindigul',
    crop: 'Small Red Onion (Sambar Vengayam)',
    weight: '450 kg',
    distance: '34 km',
    payout: 1850,
    rating: 5,
    receiver: 'M. Anand (Inward Supervisor)',
    status: 'DELIVERED',
    proofPhoto: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'ORD-1018',
    trackingNumber: 'TRK-NU-2026-1018',
    completedAt: '30 Aug 2026, 06:30 PM',
    farmer: 'Green Valley Organic, Oddanchatram',
    buyer: 'Nilgiris Daily Mart, Dindigul',
    crop: 'Hill Potato & Carrot',
    weight: '500 kg',
    distance: '42 km',
    payout: 2300,
    rating: 5,
    receiver: 'K. Balaji',
    status: 'DELIVERED',
    proofPhoto: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&auto=format&fit=crop&q=80'
  }
];

export const DRIVER_MESSAGES = [
  {
    contactId: 'c1',
    name: 'Arun Kumar (Farmer)',
    role: 'Farmer • Nilakottai',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    unread: 0,
    messages: [
      { id: 1, sender: 'them', text: 'Vanakkam Rajkumar. Crates are loaded at the North Gate shed.', time: '04:55 PM' },
      { id: 2, sender: 'me', text: 'Vanakkam Arun sir. I am inspecting the crates and applying seal NU-SEAL-8894.', time: '05:05 PM' },
      { id: 3, sender: 'them', text: 'Great! Digital gate pass approved on portal. Safe driving.', time: '05:12 PM' }
    ]
  },
  {
    contactId: 'c2',
    name: 'Sundar Rajan (ABC Retail)',
    role: 'Buyer Depot Manager • Dindigul',
    phone: '+91 98765 01234',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    unread: 1,
    messages: [
      { id: 1, sender: 'them', text: 'Hi Raj Kumar, what is your current ETA at loading bay #4?', time: '05:35 PM' },
      { id: 2, sender: 'me', text: 'Crossing Chettinaickanpatti bypass. Reaching in approximately 17 mins.', time: '05:37 PM' },
      { id: 3, sender: 'them', text: 'Understood. Unloading team is ready at bay #4.', time: '05:38 PM' }
    ]
  },
  {
    contactId: 'c3',
    name: 'Naam Uzhavar Dispatch Hub',
    role: 'Central Fleet Operations',
    phone: '1800-425-9988',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    unread: 0,
    messages: [
      { id: 1, sender: 'them', text: 'Consignment #ORD-1024 route verified on NH-44 corridor.', time: '04:30 PM' },
      { id: 2, sender: 'them', text: 'Toll pass auto-recharged with ₹480.', time: '04:45 PM' }
    ]
  }
];

export const DRIVER_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New High-Value Trip Available',
    message: 'Oddanchatram to Madurai Cauliflower consignment (₹2,450 payout). Tap to claim.',
    time: '12 mins ago',
    type: 'trip',
    icon: 'bi-truck',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Payment Credited: ₹1,250',
    message: 'Freight charges for ORD-1022 successfully credited to your SBI Account.',
    time: '2 hours ago',
    type: 'payment',
    icon: 'bi-cash-coin',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Highway Weather Advisory',
    message: 'Scattered evening rain expected on NH-44 between Nilakottai and Dindigul. Drive with headlights on.',
    time: '3 hours ago',
    type: 'weather',
    icon: 'bi-cloud-rain',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Digital Gate Pass Generated',
    message: 'E-pass #EWP-8842 issued for Dindigul Wholesale Receiving Depot.',
    time: '4 hours ago',
    type: 'system',
    icon: 'bi-qr-code',
    read: true
  }
];

export const DRIVER_EARNINGS = {
  today: 1850,
  thisWeek: 12650,
  thisMonth: 48200,
  totalDistanceKm: 5420,
  totalTrips: 184,
  onTimeRate: '98.4%',
  fuelEfficiency: '14.8 km/L',
  rating: 4.9,
  recentPayouts: [
    { id: 'TXN-901', date: '01 Sep 2026', amount: 4850, method: 'UPI (rajkumar.driver@upi)', status: 'Credited' },
    { id: 'TXN-884', date: '25 Aug 2026', amount: 8200, method: 'Bank Transfer (SBI)', status: 'Credited' },
    { id: 'TXN-872', date: '18 Aug 2026', amount: 6900, method: 'Bank Transfer (SBI)', status: 'Credited' }
  ]
};

