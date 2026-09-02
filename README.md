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
   - Category filtering (`All`, `Fruits`, `Vegetables`, `Grains`, `Honey & Oils`).
   - Live search bar, farmer location, brix freshness score, price comparison against market price, and direct cart add.

5. **Supply Chain Flow (`HowItWorks.jsx`)**:
   - 4-step pipeline: Farm Listing -> AI Quality Check -> Smart Cold-Chain -> Instant Payout.

6. **Farmer Savings Calculator (`SavingsCalculator.jsx`)**:
   - Interactive slider for monthly yield (500 kg to 15,000 kg).
   - Real-time side-by-side comparison of Traditional Middleman Model vs FarmDirect (+43% net farmer profit).

7. **IoT Batch Traceability Inspector (`TraceabilityModal.jsx`)**:
   - Blockchain-verified batch timeline, optical brix logs, temperature readings, and origin GPS.

8. **Multi-Role Authentication (`AuthModal.jsx`)**:
   - Toggle between **Farmer / FPO** and **Consumer / B2B Buyer**.

---

## 🚀 Running Locally

```bash
# In d:\hackathon
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
