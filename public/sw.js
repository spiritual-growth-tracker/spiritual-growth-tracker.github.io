// Service Worker for Spiritual Growth Tracker
const CACHE_NAME = 'spiritual-growth-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/assets/images/favicons/favicon-192x192.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Daily Spiritual Inventory Reminder',
    body: 'Take a moment to reflect on your spiritual growth today.',
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
    ]
  };

  // If push data is available, use it
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.log('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if app is not open
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'daily-reminder') {
    event.waitUntil(
      // Send notification for daily reminder
      self.registration.showNotification('Daily Spiritual Inventory Reminder', {
        body: 'Take a moment to reflect on your spiritual growth today. How are you doing with the Fruits of the Spirit?',
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
        ]
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic background sync:', event);
  
  if (event.tag === 'daily-reminder') {
    event.waitUntil(
      // Check if user has completed today's inventory
      checkDailyCompletion()
    );
  }
});

// Function to check if user has completed today's inventory
async function checkDailyCompletion() {
  try {
    // This would need to be implemented based on your data storage strategy
    // For now, we'll just send a reminder
    await self.registration.showNotification('Complete Your Daily Inventory', {
      body: 'Don\'t forget to complete your spiritual growth inventory for today!',
      icon: '/assets/images/favicons/favicon-192x192.png',
      badge: '/assets/images/favicons/favicon-192x192.png',
      tag: 'completion-reminder',
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
      ]
    });
  } catch (error) {
    console.log('Error checking daily completion:', error);
  }
}

// Handle app updates
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 