import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Marketplace from '../components/Marketplace';
import HowItWorks from '../components/HowItWorks';
import SavingsCalculator from '../components/SavingsCalculator';
import Footer from '../components/Footer';
import TraceabilityModal from '../components/TraceabilityModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleOpenAuth = (role = 'farmer') => {
    navigate('/login');
  };

  const handleStartSelling = () => {
    if (isAuthenticated && user?.roleKey === 'farmer') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/login/farmer');
    }
  };

  const handleExploreMarketplace = () => {
    const el = document.getElementById('marketplace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectStat = (stat) => {
    if (stat.id === 'products') {
      handleExploreMarketplace();
    } else if (stat.id === 'farmers') {
      if (isAuthenticated && user?.roleKey === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/login/farmer');
      }
    } else {
      setIsTraceabilityOpen(true);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light">
      <div>
        {/* Sticky Modern Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isAuthenticated}
          currentUser={user}
          onOpenAuth={handleOpenAuth}
          onOpenMarketplace={handleExploreMarketplace}
        />

        {/* 2-Column Bento Hero Section */}
        <Hero
          onStartSelling={handleStartSelling}
          onExploreMarketplace={handleExploreMarketplace}
          onOpenTraceability={() => setIsTraceabilityOpen(true)}
        />

        {/* 4-Column Key Metric KPI Cards */}
        <Stats onSelectStat={handleSelectStat} />

        {/* Live Filterable Marketplace Section */}
        <Marketplace onOpenTraceability={() => setIsTraceabilityOpen(true)} />

        {/* How It Works 4-Step Flow */}
        <HowItWorks />

        {/* Farmer Profit & Savings Calculator */}
        <SavingsCalculator onStartSelling={handleStartSelling} />

        {/* Modern Footer */}
        <Footer onOpenAuth={handleOpenAuth} />
      </div>

      {/* Interactive IoT Traceability Modal */}
      <TraceabilityModal
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
      />
    </div>
  );
}
