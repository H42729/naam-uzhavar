# FarmDirect - Modern Agricultural Supply Chain Platform

A unique, accessible, and user-friendly frontend web application built with **React 18, Bootstrap 5.3, CSS3, HTML5, and JavaScript**.

---

## 🌾 Core Features & Design System

1. **Modern Sticky Glassmorphic Navbar (`Navbar.jsx`)**:
   - Agriculture brand logo with subtle green glow.
   - Smooth navigation menu links (`Home`, `How It Works`, `Marketplace`, `Benefits`, `About`).
   - Action buttons: Notification alerts, profile manager, `Login`, `Get Started`, and mobile drawer menu.

2. **2-Column Bento Hero Section (`Hero.jsx`)**:
   - **Left Bento Card**:
     - Headline: **"Connect Directly. Earn Better. <span style="color:#004c22">Buy Smarter.</span>"**
     - Detailed proposition: *"FarmDirect is the modern agricultural supply chain platform connecting farmers and FPOs directly with consumers and businesses. Eliminate the middleman, increase margins, and ensure fresher produce."*
     - Tactile CTA Buttons: `Start Selling` (gradient green pill) and `Explore Marketplace` (clean outlined button).
     - Value chips: `0% Commission Middlemen`, `24h Farm-to-Doorstep`, `IoT Verified Freshness`.
   - **Right Bento Card**:
     - High-resolution 3D isometric agricultural supply chain artwork.
     - Dark glassmorphic caption: **"Transparent tracking from seed to sale."** with live status indicator and interactive `Live Batch ↗` button.

3. **Key Performance Indicators (`Stats.jsx`)**:
   - **50k+** Farmers Connected
   - **200+** Products Listed
   - **1M+** Orders Completed
   - **25%** Avg. Farmer Savings (vibrant green)

4. **Live Produce Marketplace (`Marketplace.jsx`)**:
   - Dynamic real-time catalog fetched from `GET /api/v1/products`.
   - Category filtering (`All`, `Fruits`, `Vegetables`, `Grains`, `Honey & Oils`).
   - Live search bar, farmer location, mandi benchmark price comparison, and direct proposal placement.

5. **Supply Chain Flow (`HowItWorks.jsx`)**:
   - 4-step pipeline: Farm Listing -> AI Quality Check -> Smart Cold-Chain -> Instant Payout.

6. **Farmer Savings Calculator (`SavingsCalculator.jsx`)**:
   - Interactive slider for monthly yield (500 kg to 15,000 kg).
   - Real-time side-by-side comparison of Traditional Middleman Model vs FarmDirect (+43% net farmer profit).

7. **IoT Batch Traceability Inspector (`TraceabilityModal.jsx`)**:
   - Blockchain-verified batch timeline, optical brix logs, temperature readings, and origin GPS.

8. **Multi-Role Authentication (`AuthModal.jsx` & Portal Logins)**:
   - Portals for **Farmer**, **Buyer**, and **Driver**.
   - Backed by JWT Bearer token authentication stored in `localStorage` and synchronized with `GET /api/v1/auth/me`.

---

## 🏛️ Application Architecture & State Management

```
src/
├── context/
│   ├── LanguageContext.jsx       # Bilingual state (EN/TA) with backend sync (POST /translations/preference)
│   ├── AuthContext.jsx           # JWT auth token management, user rehydration from GET /auth/me
│   ├── FarmerContext.jsx         # Live harvest listings (products) and buyer proposals (requests)
│   └── BuyerContext.jsx          # Marketplace state, cart, bulk purchase orders
├── services/
│   ├── apiClient.js              # Axios instance with baseURL 'http://localhost:5000/api/v1' & Bearer JWT interceptor
│   ├── cropService.js            # GET /api/v1/crops (15 Master horticulture crops)
│   ├── productService.js         # CRUD operations on produce listings (/api/v1/products)
│   ├── requestService.js         # Procurement proposals and bargaining (/api/v1/requests)
│   ├── vehicleBookingService.js  # Nearby logistics carriers & booking dispatch (/api/v1/vehicles)
│   └── deliveryService.js        # Consignments, status milestones & Proof of Delivery (/api/v1/deliveries)
├── pages/
│   ├── farmer/                   # FarmerDashboardPage, FarmerHarvestPage, FarmerRequestsPage
│   ├── buyer/                    # BuyerDashboard, Marketplace, ProductDetail, BulkAggregation
│   ├── driver/                   # DriverRoutePage, DriverRequestsPage, DriverHistoryPage, DriverTripSummaryPage
│   └── register/                 # Multi-role authentication & registration pages
└── components/
    ├── buyer/                    # NearbyVehiclesSection, BookVehicleModal, AcceptedRequestsCarousel
    ├── driver/                   # DriverLayout, RouteMap, DeliveryProgress, CargoCard, PODModal
    └── farmer/                   # AddHarvestModal, CropSelector, FarmerBidsTable
```

---

## 🌐 Bilingual Support (English / தமிழ்)

- **One-Click Switch**: Toggle in the navigation bar immediately switches language across all components.
- **Backend Persistence**:
  - Unauthenticated users: Persists to `localStorage` and `POST /api/v1/translations/preference`.
  - Authenticated users: Persists directly to MongoDB via `PATCH /api/v1/auth/me/language` and rehydrates upon login.

---

## 🚀 Running Locally

```bash
# Navigate to frontend folder
cd d:\Hackathon\naam-uzhavar-main

# Install dependencies
npm install

# Build for production verification (zero errors)
npm run build

# Start Vite dev server
npm run dev
```

The frontend runs at: **`http://localhost:5173`** (proxies/connects to backend at `http://localhost:5000/api/v1`).

