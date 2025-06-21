import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';
import notificationService from '../utils/notificationService';

const SettingsModal = ({ show, onHide }) => {
  const fileInputRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    time: '20:00'
  });
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      loadNotificationSettings();
      checkNotificationSupport();
    }
  }, [show]);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  };

  const loadNotificationSettings = () => {
    const savedSettings = notificationService.getNotificationSettings();
    setNotificationSettings(savedSettings);
  };

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const granted = await notificationService.requestPermission();
      setPermission(Notification.permission);
      
      if (granted) {
        setMessage('Notification permission granted! You can now enable daily reminders.');
      } else {
        setMessage('Notification permission denied. Please enable notifications in your browser settings.');
      }
    } catch (error) {
      setMessage('Failed to request notification permission: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationSettings.enabled && permission !== 'granted') {
      setMessage('Please grant notification permission first.');
      return;
    }

    const newSettings = {
      ...notificationSettings,
      enabled: !notificationSettings.enabled
    };

    setNotificationSettings(newSettings);
    notificationService.updateNotificationSettings(newSettings.enabled, newSettings.time);
    
    if (newSettings.enabled) {
      setMessage('Daily reminders enabled! You will receive a notification at ' + newSettings.time);
    } else {
      setMessage('Daily reminders disabled.');
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const newSettings = { ...notificationSettings, time: newTime };
    setNotificationSettings(newSettings);
    
    if (newSettings.enabled) {
      notificationService.updateNotificationSettings(true, newTime);
      setMessage('Reminder time updated to ' + newTime);
    }
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await notificationService.sendNotification('Test Notification', {
        body: 'This is a test notification from your Spiritual Growth Tracker app!',
        tag: 'test-notification'
      });
      setMessage('Test notification sent! Check your notifications.');
    } catch (error) {
      setMessage('Failed to send test notification: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (permission) {
      case 'granted':
        return 'Notifications are enabled';
      case 'denied':
        return 'Notifications are blocked';
      default:
        return 'Notification permission not set';
    }
  };

  const getPermissionStatusColor = () => {
    switch (permission) {
      case 'granted':
        return 'success';
      case 'denied':
        return 'danger';
      default:
        return 'warning';
    }
  };

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
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications Section */}
          <div className="mb-4">
            <h6>
              <i className="bi bi-bell-fill me-2"></i>
              Notifications
            </h6>
            <p className="text-muted">Set up daily reminders for your spiritual inventory</p>
            
            {!isSupported && (
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Notifications are not supported in this browser.
              </Alert>
            )}

            {isSupported && (
              <>
                <div className="mb-3">
                  <Alert variant={getPermissionStatusColor()}>
                    <i className="bi bi-info-circle me-2"></i>
                    {getPermissionStatusText()}
                  </Alert>
                  
                  {permission !== 'granted' && (
                    <Button 
                      variant="primary" 
                      onClick={handlePermissionRequest}
                      disabled={isLoading}
                      size="sm"
                      className="mb-3"
                    >
                      {isLoading ? 'Requesting...' : 'Request Permission'}
                    </Button>
                  )}
                </div>

                <Form className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="notification-switch"
                      label="Enable daily reminders"
                      checked={notificationSettings.enabled}
                      onChange={handleToggleNotifications}
                      disabled={permission !== 'granted'}
                    />
                  </Form.Group>

                  {notificationSettings.enabled && (
                    <Form.Group className="mb-3">
                      <Form.Label>Reminder Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={notificationSettings.time}
                        onChange={handleTimeChange}
                        disabled={!notificationSettings.enabled}
                        className="w-auto"
                      />
                      <Form.Text className="text-muted">
                        You&apos;ll receive a daily reminder at this time to complete your spiritual inventory.
                      </Form.Text>
                    </Form.Group>
                  )}
                </Form>

                <div className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleTestNotification}
                    disabled={permission !== 'granted' || isLoading}
                    size="sm"
                  >
                    <i className="bi bi-bell me-2"></i>
                    Send Test Notification
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Data Management Section */}
          <div className="mb-4">
            <h6>
              <i className="bi bi-database me-2"></i>
              Data Management
            </h6>
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
          
          {/* About Section */}
          <div className="mb-3">
            <h6>
              <i className="bi bi-info-circle me-2"></i>
              About
            </h6>
            <p className="text-muted">
              Spiritual Growth Tracker v1.0.0<br />
              A tool to help you track your daily spiritual growth by monitoring the Fruits of the Spirit and Works of the Flesh.
            </p>
          </div>

          {message && (
            <Alert variant="info" dismissible onClose={() => setMessage('')}>
              {message}
            </Alert>
          )}
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