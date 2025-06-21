import React, { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';

const SettingsModal = ({ show, onHide }) => {
  const fileInputRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const clearAllData = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('data_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setShowConfirmModal(false);
    onHide();
    window.location.reload();
  };

  const handleClearDataClick = () => {
    setShowConfirmModal(true);
  };

  const exportData = () => {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('data_')) {
        allData[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spiritual-growth-data-${formatDate(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate that the imported data has the expected structure
        const isValidData = Object.keys(importedData).every(key => 
          key.startsWith('data_') && 
          typeof importedData[key] === 'object' &&
          Array.isArray(importedData[key].fruits) &&
          Array.isArray(importedData[key].flesh)
        );

        if (!isValidData) {
          alert('Invalid data file. Please select a valid spiritual growth data file.');
          return;
        }

        // Clear existing data and import new data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('data_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Import the new data
        Object.keys(importedData).forEach(key => {
          localStorage.setItem(key, JSON.stringify(importedData[key]));
        });

        alert('Data imported successfully! The page will reload to show your imported data.');
        window.location.reload();
      } catch (error) {
        // console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>Data Management</h6>
            <p className="text-muted">Manage your spiritual growth data</p>
            <div className="d-grid gap-2">
              <Button variant="info" onClick={exportData}>
                <i className="bi bi-download me-2"></i>
                Export Data
              </Button>
              <Button variant="success" onClick={importData}>
                <i className="bi bi-upload me-2"></i>
                Import Data
              </Button>
              <Button variant="danger" onClick={handleClearDataClick}>
                <i className="bi bi-trash me-2"></i>
                Clear All Data
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="mb-3">
            <h6>About</h6>
            <p className="text-muted">
              Spiritual Growth Tracker v1.0.0<br />
              A tool to help you track your daily spiritual growth by monitoring the Fruits of the Spirit and Works of the Flesh.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear All Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to clear all data? This action cannot be undone.</p>
          <p className="text-muted">All your spiritual growth tracking data will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearAllData}>
            Clear All Data
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SettingsModal; 