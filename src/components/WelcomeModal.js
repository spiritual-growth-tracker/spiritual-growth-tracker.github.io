import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import notificationService from '../utils/notificationService';

const WelcomeModal = ({ show, onHide }) => {
  const [step, setStep] = useState(1);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [permission, setPermission] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      checkNotificationSupport();
    }
  }, [show]);

  const checkNotificationSupport = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const granted = await notificationService.requestPermission();
      setPermission(Notification.permission);
      
      if (granted) {
        setMessage('Great! You can now receive daily reminders.');
        setNotificationEnabled(true);
      } else {
        setMessage('No worries! You can always enable notifications later in settings.');
      }
    } catch (error) {
      setMessage('Unable to request notification permission. You can enable this later in settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipNotifications = () => {
    setNotificationEnabled(false);
    setStep(2);
  };

  const handleEnableNotifications = () => {
    if (permission === 'granted') {
      setNotificationEnabled(true);
      setStep(2);
    } else {
      handlePermissionRequest();
    }
  };

  const handleCompleteSetup = () => {
    if (notificationEnabled && permission === 'granted') {
      notificationService.updateNotificationSettings(true, reminderTime);
    }
    
    // Mark that the user has seen the welcome modal
    localStorage.setItem('welcomeModalShown', 'true');
    onHide();
  };

  const handleTimeChange = (e) => {
    setReminderTime(e.target.value);
  };

  const getTimeDisplay = () => {
    const [hours, minutes] = reminderTime.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>
          <i className="bi bi-heart-fill text-primary me-2"></i>
          Welcome to Spiritual Growth Tracker
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-bell-fill text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="mb-3">Stay on Track with Daily Reminders</h5>
            <p className="text-muted mb-4">
              Would you like to receive daily notifications to help you maintain your spiritual growth practice? 
              You can always change this later in settings.
            </p>
            
            {permission === 'denied' && (
              <Alert variant="warning" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Notifications are currently blocked. You&apos;ll need to enable them in your browser settings.
              </Alert>
            )}

            {message && (
              <Alert variant="info" className="mb-3">
                {message}
              </Alert>
            )}

            <div className="d-grid gap-2">
              {permission === 'granted' ? (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleEnableNotifications}
                  disabled={isLoading}
                >
                  <i className="bi bi-bell me-2"></i>
                  Yes, enable daily reminders
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handlePermissionRequest}
                  disabled={isLoading}
                >
                  <i className="bi bi-bell me-2"></i>
                  {isLoading ? 'Requesting Permission...' : 'Enable Notifications'}
                </Button>
              )}
              
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={handleSkipNotifications}
              >
                <i className="bi bi-x-circle me-2"></i>
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === 2 && notificationEnabled && (
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-clock-fill text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="mb-3">Choose Your Reminder Time</h5>
            <p className="text-muted mb-4">
              When would you like to receive your daily spiritual growth reminder?
            </p>
            
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Daily Reminder Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={reminderTime}
                    onChange={handleTimeChange}
                    className="text-center fs-5"
                  />
                  <Form.Text className="text-muted">
                    You&apos;ll receive a reminder at <strong>{getTimeDisplay()}</strong> each day
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <div className="mb-3">
              <h6>What you&apos;ll receive:</h6>
              <ul className="text-muted text-start">
                <li>Daily notification at your chosen time</li>
                <li>Gentle reminder to complete your spiritual inventory</li>
                <li>Tap to open the app and start tracking</li>
                <li>Works even when the app is closed</li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && !notificationEnabled && (
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="mb-3">You&apos;re All Set!</h5>
            <p className="text-muted mb-4">
              You can always enable notifications later in the settings menu if you change your mind.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {step === 1 ? (
          <small className="text-muted">
            You can change notification settings anytime in the settings menu
          </small>
        ) : (
          <Button 
            variant="success" 
            size="lg"
            onClick={handleCompleteSetup}
          >
            <i className="bi bi-check-lg me-2"></i>
            Get Started
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default WelcomeModal; 