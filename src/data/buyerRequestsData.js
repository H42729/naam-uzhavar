/**
 * Buyer Requests Mock Dataset
 * Contains realistic procurement requests sent by buyers to Tamil Nadu farmers.
 * Structure supports:
 * - Request ID
 * - Farmer details (Name, phone, location, hub)
 * - Product details (Name, Tamil name, Image, Unit, Price)
 * - Quantity requested & total amount
 * - Request Date & Time
 * - Delivery Location
 * - Current Status ('Pending' | 'Accepted' | 'Rejected')
 * - Farmer Response Message & Rejection Reason
 * - Timeline timestamps
 */

export const INITIAL_BUYER_REQUESTS = [
  {
    id: "REQ001",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98421 88920",
    farmerLocation: "Nilakottai, Dindigul",
    farmerFpo: "Dindigul Vegetable Growers Association",
    productName: "Tomato",
    productTamilName: "தக்காளி",
    productImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    quantity: 50,
    unit: "kg",
    price: 32,
    requestDate: "03 Sep 2026",
    requestTime: "08:30 AM",
    deliveryLocation: "Dindigul Central Market Depot",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Pending",
    responseMessage: null,
    rejectionReason: null,
    timeline: {
      sentAt: "03 Sep 2026, 08:30 AM",
      receivedAt: "03 Sep 2026, 08:45 AM",
      responseAt: null
    }
  },
  {
    id: "REQ002",
    farmerName: "M. Palanisamy",
    farmerPhone: "+91 94432 17823",
    farmerLocation: "Oddanchatram, Dindigul",
    farmerFpo: "Oddanchatram Farmers Producer Co.",
    productName: "Small Onion",
    productTamilName: "சின்ன வெங்காயம்",
    productImage: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80",
    quantity: 120,
    unit: "kg",
    price: 58,
    requestDate: "02 Sep 2026",
    requestTime: "04:15 PM",
    deliveryLocation: "Coimbatore Omni Bus Stand Hub",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Accepted",
    acceptedDate: "02 Sep 2026, 06:10 PM",
    responseMessage: "Lot verified. Grade A dry harvest packed in 50kg mesh bags ready for dispatch.",
    rejectionReason: null,
    timeline: {
      sentAt: "02 Sep 2026, 04:15 PM",
      receivedAt: "02 Sep 2026, 04:30 PM",
      responseAt: "02 Sep 2026, 06:10 PM"
    }
  },
  {
    id: "REQ003",
    farmerName: "Sundaram P.",
    farmerPhone: "+91 97880 55431",
    farmerLocation: "Cumbum Valley, Theni",
    farmerFpo: "Cumbum Valley Banana Growers FPO",
    productName: "Banana (Robusta)",
    productTamilName: "வாழைப்பழம் (ரோபஸ்டா)",
    productImage: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80",
    quantity: 250,
    unit: "kg",
    price: 24,
    requestDate: "01 Sep 2026",
    requestTime: "11:20 AM",
    deliveryLocation: "Madurai Ring Road Cold Chain",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Rejected",
    acceptedDate: null,
    responseMessage: null,
    rejectionReason: "Quantity unavailable - Current lot has already been locked by another institutional buyer.",
    timeline: {
      sentAt: "01 Sep 2026, 11:20 AM",
      receivedAt: "01 Sep 2026, 11:40 AM",
      responseAt: "01 Sep 2026, 01:15 PM"
    }
  },
  {
    id: "REQ004",
    farmerName: "K. Chinnasamy",
    farmerPhone: "+91 96551 22894",
    farmerLocation: "Sankarankovil, Tenkasi",
    farmerFpo: "Tenkasi Spices & Chillies Consortium",
    productName: "Green Chilli",
    productTamilName: "பச்சை மிளகாய்",
    productImage: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=400&q=80",
    quantity: 40,
    unit: "kg",
    price: 45,
    requestDate: "03 Sep 2026",
    requestTime: "07:10 AM",
    deliveryLocation: "Tirunelveli Junction Mandi Outlet",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Accepted",
    acceptedDate: "03 Sep 2026, 09:00 AM",
    responseMessage: "Freshly hand-picked morning harvest. Ready for pickup before 1 PM.",
    rejectionReason: null,
    timeline: {
      sentAt: "03 Sep 2026, 07:10 AM",
      receivedAt: "03 Sep 2026, 07:25 AM",
      responseAt: "03 Sep 2026, 09:00 AM"
    }
  },
  {
    id: "REQ005",
    farmerName: "V. Arumugam",
    farmerPhone: "+91 98425 66712",
    farmerLocation: "Aravakurichi, Karur",
    farmerFpo: "Karur Moringa Producers Society",
    productName: "Drumstick / Moringa",
    productTamilName: "முருங்கைக்காய்",
    productImage: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80",
    quantity: 80,
    unit: "kg",
    price: 38,
    requestDate: "03 Sep 2026",
    requestTime: "09:40 AM",
    deliveryLocation: "Tiruchirappalli Gandhi Market Gate 2",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Pending",
    responseMessage: null,
    rejectionReason: null,
    timeline: {
      sentAt: "03 Sep 2026, 09:40 AM",
      receivedAt: "03 Sep 2026, 09:55 AM",
      responseAt: null
    }
  },
  {
    id: "REQ006",
    farmerName: "Muthuvel K.",
    farmerPhone: "+91 94862 33109",
    farmerLocation: "Ooty Hills, Nilgiris",
    farmerFpo: "Nilgiris Hill Produce Collective",
    productName: "Potato (Ooty Hill)",
    productTamilName: "உருளைக்கிழங்கு",
    productImage: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    quantity: 200,
    unit: "kg",
    price: 30,
    requestDate: "31 Aug 2026",
    requestTime: "03:10 PM",
    deliveryLocation: "Mettupalayam Railway Mandi Depot",
    buyerName: "FreshMart Procurement",
    buyerPhone: "+91 98765 43210",
    status: "Rejected",
    acceptedDate: null,
    responseMessage: null,
    rejectionReason: "Price negotiation: Minimum farmgate floor rate for Grade A Ooty potato is ₹36/kg.",
    timeline: {
      sentAt: "31 Aug 2026, 03:10 PM",
      receivedAt: "31 Aug 2026, 03:30 PM",
      responseAt: "31 Aug 2026, 05:45 PM"
    }
  }
];
