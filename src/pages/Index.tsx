
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Favorites from '../components/Favorites';
import Performance from '../components/Performance';
import TodayAnalysis from '../components/TodayAnalysis';
import Notifications from '../components/Notifications';
import Profile from '../components/Profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'favorites':
        return <Favorites />;
      case 'performance':
        return <Performance />;
      case 'analysis':
        return <TodayAnalysis />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
