// FarmDirect - SIH 2026 Buyer Mock Data & Supply Catalog

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-001',
    crop: 'Tomato',
    tamilName: 'தக்காளி',
    category: 'Vegetables',
    farmer: 'Ravi Farms (R. Ravi)',
    quantity: 200,
    price: 25,
    mandiPrice: 32,
    location: 'Dindigul',
    farmAddress: 'South Street, Reddiarchatram, Dindigul - 624622',
    farmerPhone: '+91 98421 77234',
    harvestDate: '2026-10-12',
    grade: 'Grade A Premium',
    organicStatus: 'Naturally Grown (Pesticide-Free)',
    shelfLife: '8 - 10 Days',
    minOrder: 50,
    description: 'Freshly harvested country tomatoes (நாட்டு தக்காளி) with high brix sweetness index and firm skin. Grown in red loamy soil, ideal for retail grocery chains and food service institutions.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-002',
    crop: 'Onion',
    tamilName: 'வெங்காயம்',
    category: 'Vegetables',
    farmer: 'Kumar Agro (M. Kumar)',
    quantity: 350,
    price: 32,
    mandiPrice: 40,
    location: 'Oddanchatram',
    farmAddress: 'Market Feeder Road, Oddanchatram Cluster, Dindigul - 624619',
    farmerPhone: '+91 94432 99811',
    harvestDate: '2026-10-14',
    grade: 'Grade A Premium',
    organicStatus: 'Cured & Sun-Dried',
    shelfLife: '25 - 30 Days',
    minOrder: 100,
    description: 'Evenly sized, sun-cured medium red onions with crisp texture and robust pungency. Cleaned, graded, and packed in breathable 25kg mesh bags.',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-003',
    crop: 'Banana',
    tamilName: 'வாழைப்பழம்',
    category: 'Fruits',
    farmer: 'Green Valley Farm (K. Velusamy)',
    quantity: 500,
    price: 38,
    mandiPrice: 48,
    location: 'Palani',
    farmAddress: 'Foothill Orchards, Palani Bypass, Dindigul - 624601',
    farmerPhone: '+91 97890 55432',
    harvestDate: '2026-10-15',
    grade: 'Grade A Premium',
    organicStatus: '100% Organic Certified',
    shelfLife: '5 - 7 Days',
    minOrder: 100,
    description: 'Export grade Cavendish green bananas, harvested at mature stage. Uniform finger length of 7-8 inches, shipped in padded corrugated telescopic boxes.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-004',
    crop: 'Brinjal',
    tamilName: 'கத்தரிக்காய்',
    category: 'Vegetables',
    farmer: 'Sri Farm (S. Ramanathan)',
    quantity: 150,
    price: 28,
    mandiPrice: 35,
    location: 'Dindigul',
    farmAddress: 'Vedasandur Highway, Dindigul West - 624710',
    farmerPhone: '+91 96550 12890',
    harvestDate: '2026-10-11',
    grade: 'Grade A Premium',
    organicStatus: 'Integrated Pest Management (IPM)',
    shelfLife: '6 - 8 Days',
    minOrder: 50,
    description: 'Glossy deep purple medium eggplants with soft seeds and tender flesh. Fresh morning harvest ready for dispatch to restaurant chains and retail counters.',
    image: '/images/brinjal.jpg',
    images: [
      '/images/brinjal.jpg',
      '/images/brinjal-2.jpg'
    ]
  },
  {
    id: 'PRD-005',
    crop: 'Carrot',
    tamilName: 'கேரட்',
    category: 'Vegetables',
    farmer: 'Hill Fresh Farm (P. Selvam)',
    quantity: 250,
    price: 42,
    mandiPrice: 55,
    location: 'Kodaikanal',
    farmAddress: 'Vattakanal Valley Terrace Farm, Kodaikanal - 624101',
    farmerPhone: '+91 98432 66781',
    harvestDate: '2026-10-16',
    grade: 'Grade A Premium',
    organicStatus: 'Naturally Sweet Mountain Crop',
    shelfLife: '12 - 15 Days',
    minOrder: 50,
    description: 'Crunchy high-altitude Kodaikanal carrots with vibrant orange hue and natural sugars. Hydro-washed, top-trimmed, and sorted by diameter.',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-006',
    crop: 'Cabbage',
    tamilName: 'முட்டைக்கோஸ்',
    category: 'Vegetables',
    farmer: 'Vel Agro (T. Murugan)',
    quantity: 300,
    price: 24,
    mandiPrice: 30,
    location: 'Nilakottai',
    farmAddress: 'Nilakottai Horticultural Belt, Dindigul - 624208',
    farmerPhone: '+91 97881 33499',
    harvestDate: '2026-10-13',
    grade: 'Grade A Premium',
    organicStatus: 'Clean Farm Grown',
    shelfLife: '10 - 14 Days',
    minOrder: 50,
    description: 'Compact, round cabbage heads with tightly wrapped emerald leaves and firm core. Harvested with protective outer wrappers to ensure crisp freshness during transit.',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-007',
    crop: 'Tomato',
    tamilName: 'தக்காளி',
    category: 'Vegetables',
    farmer: 'Sri Farm (S. Ramanathan)',
    quantity: 150,
    price: 27,
    mandiPrice: 32,
    location: 'Dindigul',
    farmAddress: 'Vedasandur Road, Dindigul - 624710',
    farmerPhone: '+91 96550 12890',
    harvestDate: '2026-10-13',
    grade: 'Grade A Premium',
    organicStatus: 'Conventional High-Yield',
    shelfLife: '7 - 9 Days',
    minOrder: 50,
    description: 'Medium firm salad tomatoes suited for rapid transit and hotel kitchen chopping with consistent sizing.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-008',
    crop: 'Tomato',
    tamilName: 'தக்காளி',
    category: 'Vegetables',
    farmer: 'Kumar Farm (M. Kumar)',
    quantity: 200,
    price: 26,
    mandiPrice: 32,
    location: 'Oddanchatram',
    farmAddress: 'Oddanchatram Mandi Link Road, Dindigul - 624619',
    farmerPhone: '+91 94432 99811',
    harvestDate: '2026-10-14',
    grade: 'Grade A Premium',
    organicStatus: 'Naturally Cultivated',
    shelfLife: '8 - 10 Days',
    minOrder: 50,
    description: 'Evenly graded red tomatoes loaded with lycopene, sorted for zero transit bruise damage.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-009',
    crop: 'Onion',
    tamilName: 'வெங்காயம்',
    category: 'Vegetables',
    farmer: 'Murugan FPO (M. Murugesan)',
    quantity: 300,
    price: 31,
    mandiPrice: 40,
    location: 'Dindigul',
    farmAddress: 'Dindigul Farmers Producer Company Storage, Dindigul - 624003',
    farmerPhone: '+91 98425 44100',
    harvestDate: '2026-10-15',
    grade: 'Grade A Premium',
    organicStatus: 'FPO Collective Produce',
    shelfLife: '20 - 25 Days',
    minOrder: 100,
    description: 'Bulk lot small-to-medium shallots and red onions pooled across 12 smallholder FPO members with verified quality assurance.',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-010',
    crop: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    category: 'Roots & Tubers',
    farmer: 'Kodaikanal Terrace Farm (V. Chelladurai)',
    quantity: 350,
    price: 26,
    mandiPrice: 34,
    location: 'Kodaikanal',
    farmAddress: 'Shenbaganur Slope Terraces, Kodaikanal - 624101',
    farmerPhone: '+91 98423 88123',
    harvestDate: '2026-10-14',
    grade: 'Grade A Premium',
    organicStatus: 'High Altitude Mountain Crop',
    shelfLife: '20 - 25 Days',
    minOrder: 100,
    description: 'Firm mountain-grown potatoes with thin skin, low starch sugar content, optimal for chips, boiling, and institutional cafeteria preparation.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-011',
    crop: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    category: 'Roots & Tubers',
    farmer: 'Hilltop Cold Agro (M. Palanisamy)',
    quantity: 400,
    price: 27,
    mandiPrice: 34,
    location: 'Kodaikanal',
    farmAddress: 'Perumalmalai Feeder Road, Kodaikanal - 624104',
    farmerPhone: '+91 94421 66554',
    harvestDate: '2026-10-15',
    grade: 'Grade A Premium',
    organicStatus: 'Clean Soil Grown',
    shelfLife: '25 - 30 Days',
    minOrder: 100,
    description: 'Graded medium-large potatoes cleaned and sorted in 50kg gunny bags for bulk transport.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-012',
    crop: 'Carrot',
    tamilName: 'கேரட்',
    category: 'Vegetables',
    farmer: 'Ooty Valley Fresh (K. Subbiah)',
    quantity: 300,
    price: 40,
    mandiPrice: 55,
    location: 'Kodaikanal',
    farmAddress: 'Pillar Rocks Agro Belt, Kodaikanal - 624101',
    farmerPhone: '+91 97892 33441',
    harvestDate: '2026-10-15',
    grade: 'Grade A Premium',
    organicStatus: 'Direct Farm Harvested',
    shelfLife: '12 - 14 Days',
    minOrder: 50,
    description: 'Crisp, bright orange sweet carrots washed and trimmed for immediate commercial delivery.',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-013',
    crop: 'Banana',
    tamilName: 'வாழைப்பழம்',
    category: 'Fruits',
    farmer: 'Cauvery Orchards (R. Thangavel)',
    quantity: 450,
    price: 36,
    mandiPrice: 48,
    location: 'Palani',
    farmAddress: 'Shanmuganathi River Basin, Palani - 624618',
    farmerPhone: '+91 98426 11299',
    harvestDate: '2026-10-14',
    grade: 'Grade A Premium',
    organicStatus: 'Naturally Ripened / Green Lots',
    shelfLife: '6 - 8 Days',
    minOrder: 100,
    description: 'Commercial consignment grade Robusta green bananas with uniform bunch formation.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'PRD-014',
    crop: 'Brinjal',
    tamilName: 'கத்தரிக்காய்',
    category: 'Vegetables',
    farmer: 'Batlagundu Vegetable Co-op (S. Manikandan)',
    quantity: 250,
    price: 27,
    mandiPrice: 35,
    location: 'Dindigul',
    farmAddress: 'Nilakottai Highway Crossing, Batlagundu - 624202',
    farmerPhone: '+91 96552 44781',
    harvestDate: '2026-10-13',
    grade: 'Grade A Premium',
    organicStatus: 'IPM Farm Cultivated',
    shelfLife: '7 - 9 Days',
    minOrder: 50,
    description: 'Tender purple brinjal lots sorted for uniform size and weight in 20kg crates.',
    image: '/images/brinjal.jpg',
    images: [
      '/images/brinjal.jpg',
      '/images/brinjal-2.jpg'
    ]
  },
  {
    id: 'PRD-015',
    crop: 'Cabbage',
    tamilName: 'முட்டைக்கோஸ்',
    category: 'Vegetables',
    farmer: 'Nilakottai Farmgate Cluster (G. Rajendran)',
    quantity: 400,
    price: 23,
    mandiPrice: 30,
    location: 'Nilakottai',
    farmAddress: 'Horticulture Feeder Gate #3, Nilakottai - 624208',
    farmerPhone: '+91 94435 77112',
    harvestDate: '2026-10-14',
    grade: 'Grade A Premium',
    organicStatus: 'Pesticide Safe Clean Harvest',
    shelfLife: '12 - 15 Days',
    minOrder: 50,
    description: 'High-density round heads with intact protective outer leaf wrappers.',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=700&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FD1021',
    crop: 'Onion',
    quantity: 400,
    farmers: 2,
    amount: 12600,
    status: 'Delivered',
    orderDate: '2026-10-01',
    deliveryDate: '2026-10-03',
    location: 'Chennai Central Hub',
    farmerBreakdown: [
      { farmer: 'Kumar Agro', qty: 250, price: 32 },
      { farmer: 'Murugan FPO', qty: 150, price: 30.6 }
    ]
  },
  {
    id: 'FD1022',
    crop: 'Banana',
    quantity: 500,
    farmers: 1,
    amount: 19000,
    status: 'In Transit',
    orderDate: '2026-10-04',
    deliveryDate: '2026-10-06',
    location: 'Coimbatore Distribution Center',
    farmerBreakdown: [
      { farmer: 'Green Valley Farm', qty: 500, price: 38 }
    ]
  },
  {
    id: 'FD1023',
    crop: 'Cabbage',
    quantity: 300,
    farmers: 1,
    amount: 7200,
    status: 'Confirmed',
    orderDate: '2026-10-05',
    deliveryDate: '2026-10-08',
    location: 'Madurai Cold Storage',
    farmerBreakdown: [
      { farmer: 'Vel Agro', qty: 300, price: 24 }
    ]
  }
];

export const INITIAL_MATCHED_SUPPLY = [
  {
    id: 'MS-501',
    crop: 'Onion',
    requiredQty: 400,
    matchedQty: 400,
    farmersMatched: 2,
    avgPrice: 31.5,
    status: 'Fully Matched',
    date: '2026-10-01'
  },
  {
    id: 'MS-502',
    crop: 'Banana',
    requiredQty: 500,
    matchedQty: 500,
    farmersMatched: 1,
    avgPrice: 38.0,
    status: 'Fully Matched',
    date: '2026-10-04'
  }
];

export const INITIAL_REQUIREMENTS = [
  {
    id: 'REQ-101',
    crop: 'Tomato',
    quantity: 500,
    maxPrice: 28,
    location: 'Dindigul',
    deliveryDate: '2026-10-18',
    status: 'Active'
  },
  {
    id: 'REQ-102',
    crop: 'Carrot',
    quantity: 300,
    maxPrice: 45,
    location: 'Kodaikanal',
    deliveryDate: '2026-10-20',
    status: 'Active'
  }
];

// Seed Data for Consumer Requests & Farmer Quotes
export const INITIAL_CONSUMER_REQUESTS = [
  {
    id: 'REQ-C201',
    crop: 'Tomato',
    tamilName: 'நாட்டு தக்காளி',
    productId: 'PRD-001',
    farmer: 'Ravi Farms',
    farmerPhone: '+91 98421 77234',
    location: 'Dindigul, Tamil Nadu',
    quantity: 300,
    offeredPrice: 25,
    targetPrice: 24,
    mandiPrice: 32,
    totalAmount: 7500,
    status: 'Pending', // Pending confirmation by consumer
    requestDate: '2026-10-16',
    deliveryDate: '2026-10-18',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    message: 'Ravi Farms accepted your lot quote. Ready for morning harvest dispatch. Confirming will generate logistics dispatch ID.'
  },
  {
    id: 'REQ-C202',
    crop: 'Onion',
    tamilName: 'வெங்காயம்',
    productId: 'PRD-002',
    farmer: 'Kumar Agro',
    farmerPhone: '+91 94432 99811',
    location: 'Oddanchatram, Tamil Nadu',
    quantity: 250,
    offeredPrice: 32,
    targetPrice: 31,
    mandiPrice: 40,
    totalAmount: 8000,
    status: 'Pending', // Pending confirmation
    requestDate: '2026-10-16',
    deliveryDate: '2026-10-19',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    message: 'Graded lot of 250kg verified at Oddanchatram gate. Waiting for your final confirmation to seal consignment.'
  },
  {
    id: 'REQ-C203',
    crop: 'Carrot',
    tamilName: 'கேரட்',
    productId: 'PRD-005',
    farmer: 'Hill Fresh Farm',
    farmerPhone: '+91 98432 66781',
    location: 'Kodaikanal, Tamil Nadu',
    quantity: 200,
    offeredPrice: 42,
    targetPrice: 42,
    mandiPrice: 55,
    totalAmount: 8400,
    status: 'Confirmed', // Already confirmed
    requestDate: '2026-10-14',
    deliveryDate: '2026-10-17',
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&auto=format&fit=crop&q=80',
    message: 'Consignment confirmed & locked into Escrow. Cold storage vehicle en route to Kodaikanal depot.'
  },
  {
    id: 'REQ-C204',
    crop: 'Brinjal',
    tamilName: 'கத்தரிக்காய்',
    productId: 'PRD-004',
    farmer: 'Sri Farm',
    farmerPhone: '+91 96550 12890',
    location: 'Dindigul, Tamil Nadu',
    quantity: 150,
    offeredPrice: 29,
    targetPrice: 26,
    mandiPrice: 35,
    totalAmount: 4350,
    status: 'Declined',
    requestDate: '2026-10-12',
    deliveryDate: '2026-10-15',
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&auto=format&fit=crop&q=80',
    message: 'Price discrepancy beyond allowable variance. Lot counter-offered to alternate institutional buyer.'
  }
];

export const LOCATIONS_LIST = [
  'All Locations',
  'Dindigul',
  'Oddanchatram',
  'Palani',
  'Kodaikanal',
  'Nilakottai'
];

export const CROPS_LIST = [
  'Tomato',
  'Onion',
  'Banana',
  'Brinjal',
  'Carrot',
  'Cabbage'
];
