import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import RuleExplainerModal from './components/RuleExplainerModal';

import Dashboard from './pages/Dashboard';
import FarmManagement from './pages/FarmManagement';
import CropRecommendation from './pages/CropRecommendation';
import FertilizerGuidance from './pages/FertilizerGuidance';
import IrrigationGuidance from './pages/IrrigationGuidance';
import ActivityTracker from './pages/ActivityTracker';
import ExpenseManager from './pages/ExpenseManager';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Cross-page context
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [cropContext, setCropContext] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check health periodically
  useEffect(() => {
    const checkStatus = () => {
      api.checkHealth()
        .then(() => setBackendOnline(true))
        .catch(() => setBackendOnline(false));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        onOpenExplainer={() => setIsExplainerOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard setActiveTab={setActiveTab} showToast={showToast} />
        )}

        {activeTab === 'farms' && (
          <FarmManagement
            setActiveTab={setActiveTab}
            onSelectFarmForRecommendation={(farm) => setSelectedFarm(farm)}
            showToast={showToast}
          />
        )}

        {activeTab === 'crop-recommendation' && (
          <CropRecommendation
            selectedFarm={selectedFarm}
            setActiveTab={setActiveTab}
            onSelectCropForGuides={(ctx) => setCropContext(ctx)}
            showToast={showToast}
          />
        )}

        {activeTab === 'fertilizer' && (
          <FertilizerGuidance
            cropContext={cropContext}
            showToast={showToast}
          />
        )}

        {activeTab === 'irrigation' && (
          <IrrigationGuidance
            cropContext={cropContext}
            showToast={showToast}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityTracker showToast={showToast} />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager showToast={showToast} />
        )}
      </main>

      <RuleExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
