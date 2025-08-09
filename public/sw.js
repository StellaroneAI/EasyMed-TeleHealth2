const CACHE_NAME = "easymedpro-v1.0.0";
const STATIC_CACHE_NAME = "easymedpro-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "easymedpro-dynamic-v1.0.0";

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/favicon.ico",
  // Add other critical assets
];

// Health data endpoints to cache
const HEALTH_DATA_URLS = [
  "/api/vitals",
  "/api/medications",
  "/api/appointments",
  "/api/health-records",
  "/api/emergency-contacts",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Cache installation failed", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests with appropriate strategies
  if (request.method === "GET") {
    // Static assets - Cache First strategy
    if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
      event.respondWith(cacheFirst(request));
    }
    // Health data - Network First strategy (with offline fallback)
    else if (
      HEALTH_DATA_URLS.some((endpoint) => url.pathname.includes(endpoint))
    ) {
      event.respondWith(networkFirst(request));
    }
    // API calls - Network First strategy
    else if (url.pathname.startsWith("/api/")) {
      event.respondWith(networkFirst(request));
    }
    // Images and media - Cache First strategy
    else if (
      request.destination === "image" ||
      request.destination === "video"
    ) {
      event.respondWith(cacheFirst(request));
    }
    // Default - Network First with cache fallback
    else {
      event.respondWith(networkFirst(request));
    }
  }
});

// Background sync for offline health data submission
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "background-health-sync") {
    event.waitUntil(syncHealthData());
  }
});

// Push notifications for medication reminders and health alerts
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received", event);

  const options = {
    body: event.data ? event.data.text() : "EasyMedPro Health Reminder",
    icon: "/icon-192.png",
    badge: "/badge-icon.png",
    vibrate: [100, 50, 100],
    tag: "health-reminder",
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "View Details",
        icon: "/view-icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/dismiss-icon.png",
      },
    ],
    data: {
      url: "/",
      timestamp: Date.now(),
    },
  };

  event.waitUntil(
    self.registration.showNotification("EasyMedPro Health Alert", options),
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  } else if (event.action === "dismiss") {
    // Handle dismiss action
    console.log("Notification dismissed");
  } else {
    // Default action - open app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Caching strategies

// Cache First - good for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error("Cache First strategy failed:", error);
    return new Response("Offline - Content not available", { status: 503 });
  }
}

// Network First - good for dynamic content and API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Network failed, trying cache:", error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or basic error response
    if (request.destination === "document") {
      return caches.match("/") || new Response("Offline", { status: 503 });
    }

    return new Response("Offline - Data not available", { status: 503 });
  }
}

// Background sync function for health data
async function syncHealthData() {
  try {
    console.log("Service Worker: Syncing health data...");

    // Get pending health data from IndexedDB or local storage
    const pendingData = await getPendingHealthData();

    if (pendingData && pendingData.length > 0) {
      for (const data of pendingData) {
        try {
          const response = await fetch("/api/sync-health-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // Remove from pending queue
            await removePendingHealthData(data.id);
            console.log("Health data synced successfully:", data.id);
          }
        } catch (syncError) {
          console.error("Failed to sync health data:", syncError);
        }
      }
    }

    console.log("Service Worker: Health data sync completed");
  } catch (error) {
    console.error("Service Worker: Background sync failed:", error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingHealthData() {
  // Implementation would use IndexedDB to retrieve pending data
  // This is a placeholder
  return [];
}

async function removePendingHealthData(id) {
  // Implementation would use IndexedDB to remove synced data
  // This is a placeholder
  console.log("Removing synced data:", id);
}

// Periodic background sync for vital signs
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "vital-signs-sync") {
    event.waitUntil(syncVitalSigns());
  }
});

async function syncVitalSigns() {
  try {
    console.log("Service Worker: Syncing vital signs...");

    // Simulate fetching data from connected devices
    const deviceData = await fetchDeviceData();

    if (deviceData) {
      await fetch("/api/vital-signs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      });

      console.log("Vital signs synced successfully");
    }
  } catch (error) {
    console.error("Vital signs sync failed:", error);
  }
}

async function fetchDeviceData() {
  // Placeholder for device integration
  return {
    heartRate: 72,
    bloodPressure: "120/80",
    timestamp: Date.now(),
  };
}

// Handle app updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("Service Worker: Loaded successfully");
