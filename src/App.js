import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';
import './App.css';
import DateNavigation from './components/DateNavigation';
import FruitSection from './components/FruitSection';
import FleshSection from './components/FleshSection';
import ResultsModal from './components/ResultsModal';
import SettingsModal from './components/SettingsModal';
import InstallPWAModal from './components/InstallPWAModal';
import { formatDate } from './utils/dateUtils';

function App() {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [data, setData] = useState({ fruits: [], flesh: [] });
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [buildVersion, setBuildVersion] = useState('');

  // Load data for the selected date
  useEffect(() => {
    const existingData = localStorage.getItem(`data_${selectedDate}`);
    if (existingData) {
      setData(JSON.parse(existingData));
    } else {
      setData({ fruits: [], flesh: [] });
    }
  }, [selectedDate]);

  // Get build version from environment variable or git
  useEffect(() => {
    // Check if we have a build version from environment (set during build)
    const envVersion = process.env.REACT_APP_BUILD_VERSION;
    if (envVersion) {
      setBuildVersion(envVersion);
    } else {
      // Fallback: try to get git commit hash
      try {
        const { execSync } = require('child_process');
        const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        setBuildVersion(gitHash);
      } catch (error) {
        // If git command fails, use a fallback
        setBuildVersion('dev');
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem(`data_${selectedDate}`, JSON.stringify(newData));
  };

  // Handle fruit selection
  const handleFruitToggle = (fruit) => {
    const newFruits = data.fruits.includes(fruit)
      ? data.fruits.filter(f => f !== fruit)
      : [...data.fruits, fruit];
    saveData({ ...data, fruits: newFruits });
  };

  // Handle flesh work selection
  const handleFleshToggle = (work) => {
    const newFlesh = data.flesh.includes(work)
      ? data.flesh.filter(w => w !== work)
      : [...data.flesh, work];
    saveData({ ...data, flesh: newFlesh });
  };

  // Handle date change
  const handleDateChange = (dateStr) => {
    setSelectedDate(dateStr);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-3">Spiritual Growth Tracker</h1>
      <p className="text-center mb-4 text-muted">
        This app helps you track your daily spiritual growth by monitoring how well you are operating in the Fruits of the Spirit and identifying areas where you might be walking in the Works of the Flesh. Use it daily to reflect on your spiritual journey and make positive changes.
      </p>
      
      <div id="trackerForm">
        <DateNavigation 
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <FruitSection 
          selectedFruits={data.fruits}
          onFruitToggle={handleFruitToggle}
        />

        <FleshSection 
          selectedFlesh={data.flesh}
          onFleshToggle={handleFleshToggle}
        />

        <div className="text-center mt-4">
          <button 
            type="button" 
            className="btn btn-success btn-lg me-2"
            onClick={() => setShowResultsModal(true)}
          >
            <i className="bi bi-bar-chart-fill"></i>
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-lg"
            onClick={() => setShowSettingsModal(true)}
          >
            <i className="bi bi-gear-fill"></i>
          </button>
        </div>

        <div className="text-center mt-3">
          <button 
            type="button" 
            className="btn btn-success btn-lg"
            onClick={() => setShowInstallModal(true)}
          >
            <i className="bi bi-phone"></i> Install App
          </button>
        </div>
      </div>

      <ResultsModal 
        show={showResultsModal}
        onHide={() => setShowResultsModal(false)}
        selectedDate={selectedDate}
      />

      <SettingsModal 
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
      />

      <InstallPWAModal 
        show={showInstallModal}
        onHide={() => setShowInstallModal(false)}
      />

      {/* Build Version Display */}
      {buildVersion && (
        <div className="text-center mt-5 pt-3 border-top">
          <small className="text-muted">Build: {buildVersion}</small>
        </div>
      )}
    </div>
  );
}

export default App; 