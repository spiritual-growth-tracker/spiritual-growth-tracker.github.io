import React, { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';
import notificationService from '../utils/notificationService';

const NotificationBadge = ({ onClick }) => {
  const [permission, setPermission] = useState('default');
  const [settings, setSettings] = useState({ enabled: false });

  useEffect(() => {
    const checkNotificationStatus = () => {
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }
      const savedSettings = notificationService.getNotificationSettings();
      setSettings(savedSettings);
    };

    checkNotificationStatus();
    
    // Check status periodically
    const interval = setInterval(checkNotificationStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeVariant = () => {
    if (permission === 'denied') return 'danger';
    if (permission === 'granted' && settings.enabled) return 'success';
    if (permission === 'granted' && !settings.enabled) return 'warning';
    return 'secondary';
  };

  const getBadgeText = () => {
    if (permission === 'denied') return 'Blocked';
    if (permission === 'granted' && settings.enabled) return 'Active';
    if (permission === 'granted' && !settings.enabled) return 'Ready';
    return 'Setup';
  };

  if (!('Notification' in window)) {
    return null; // Don't show badge if notifications not supported
  }

  return (
    <Button 
      variant="outline-primary" 
      size="sm" 
      onClick={onClick}
      className="position-relative"
    >
      <i className="bi bi-bell me-1"></i>
      Notifications
      <Badge 
        bg={getBadgeVariant()} 
        className="position-absolute top-0 start-100 translate-middle"
        style={{ fontSize: '0.6rem' }}
      >
        {getBadgeText()}
      </Badge>
    </Button>
  );
};

export default NotificationBadge; 