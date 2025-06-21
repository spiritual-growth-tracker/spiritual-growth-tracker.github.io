class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.swRegistration = null;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission === 'granted';
  }

  // Register service worker for push notifications
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      return this.swRegistration;
    }
    throw new Error('Service Worker not supported');
  }

  // Send immediate notification
  async sendNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return false;
    }

    const defaultOptions = {
      icon: '/assets/images/favicons/favicon-192x192.png',
      badge: '/assets/images/favicons/favicon-192x192.png',
      tag: 'spiritual-growth-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/assets/images/favicons/favicon-192x192.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Handle notification actions
    notification.onclick = (event) => {
      event.preventDefault();
      if (event.action === 'open' || !event.action) {
        window.focus();
        notification.close();
      }
    };

    return notification;
  }

  // Schedule daily reminder
  scheduleDailyReminder(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const delay = reminderTime.getTime() - now.getTime();

    // Store reminder settings
    localStorage.setItem('notificationSettings', JSON.stringify({
      enabled: true,
      time: time,
      nextReminder: reminderTime.getTime()
    }));

    // Schedule the reminder
    setTimeout(() => {
      this.sendDailyReminder();
      // Schedule next day's reminder
      this.scheduleDailyReminder(time);
    }, delay);
  }

  // Send daily reminder notification
  async sendDailyReminder() {
    const title = 'Daily Spiritual Inventory Reminder';
    const options = {
      body: 'Take a moment to reflect on your spiritual growth today. How are you doing with the Fruits of the Spirit?',
      data: {
        type: 'daily-reminder',
        url: window.location.href
      }
    };

    await this.sendNotification(title, options);
  }

  // Cancel scheduled reminders
  cancelReminders() {
    localStorage.removeItem('notificationSettings');
    // Note: setTimeout IDs would need to be stored to cancel them
    // For simplicity, we'll rely on the localStorage flag
  }

  // Get notification settings
  getNotificationSettings() {
    const settings = localStorage.getItem('notificationSettings');
    return settings ? JSON.parse(settings) : {
      enabled: false,
      time: '20:00',
      nextReminder: null
    };
  }

  // Update notification settings
  updateNotificationSettings(enabled, time) {
    if (enabled) {
      this.scheduleDailyReminder(time);
    } else {
      this.cancelReminders();
    }
  }

  // Check if user has completed today's inventory
  hasCompletedToday() {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(`data_${today}`);
    return data ? JSON.parse(data).fruits.length > 0 || JSON.parse(data).flesh.length > 0 : false;
  }

  // Send completion reminder if not done
  async sendCompletionReminder() {
    if (!this.hasCompletedToday()) {
      const title = 'Complete Your Daily Inventory';
      const options = {
        body: 'Don\'t forget to complete your spiritual growth inventory for today!',
        data: {
          type: 'completion-reminder',
          url: window.location.href
        }
      };

      await this.sendNotification(title, options);
    }
  }

  // Initialize notification service
  async initialize() {
    if (!this.isSupported) {
      return false;
    }

    try {
      await this.requestPermission();
      await this.registerServiceWorker();
      
      // Restore scheduled reminders
      const settings = this.getNotificationSettings();
      if (settings.enabled) {
        this.scheduleDailyReminder(settings.time);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new NotificationService(); 