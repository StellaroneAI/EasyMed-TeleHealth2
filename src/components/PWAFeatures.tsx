import React, { useState, useEffect } from "react";

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAFeatures() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(
    null,
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Check if app is installed
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setIsInstallable(true);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setInstallPrompt(null);
    }
  };

  const sendTestNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("EasyMedPro Health Reminder", {
        body: "Time to take your medication! 💊",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "medication-reminder",
        requireInteraction: true,
        actions: [
          { action: "taken", title: "Taken" },
          { action: "snooze", title: "Snooze 10min" },
        ],
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const enableBackgroundSync = () => {
    if (
      "serviceWorker" in navigator &&
      "sync" in window.ServiceWorkerRegistration.prototype
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register("background-health-sync");
      });
    }
  };

  const cacheHealthData = async () => {
    if ("caches" in window) {
      const cache = await caches.open("health-data-v1");
      const healthData = {
        vitals: { heartRate: 72, bloodPressure: "120/80" },
        medications: ["Metformin", "Lisinopril"],
        lastSync: new Date().toISOString(),
      };

      const response = new Response(JSON.stringify(healthData));
      await cache.put("/api/health-data", response);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* PWA Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          📱 Progressive Web App Features
        </h1>
        <p className="text-green-100">Native app experience in your browser</p>
      </div>

      {/* Connection Status */}
      <div
        className={`p-4 rounded-xl border-2 ${
          isOnline
            ? "bg-green-50 border-green-300 text-green-800"
            : "bg-red-50 border-red-300 text-red-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="font-medium">
            {isOnline
              ? "🌐 Online - All features available"
              : "📱 Offline - Essential features only"}
          </span>
        </div>
      </div>

      {/* Installation Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📲 App Installation</h2>

        {isInstalled ? (
          <div className="text-center py-6">
            <span className="text-6xl mb-4 block">✅</span>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              App Installed Successfully!
            </h3>
            <p className="text-gray-600">
              EasyMedPro is now available as a native app on your device.
            </p>
          </div>
        ) : isInstallable ? (
          <div className="text-center py-6">
            <span className="text-6xl mb-4 block">📱</span>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Install EasyMedPro App
            </h3>
            <p className="text-gray-600 mb-4">
              Get the full native app experience with offline capabilities.
            </p>
            <button
              onClick={handleInstallApp}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📲 Install App
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <span className="text-6xl mb-4 block">🌐</span>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Web App Mode
            </h3>
            <p className="text-gray-600">
              Using EasyMedPro in your browser. Install for better experience.
            </p>
          </div>
        )}
      </div>

      {/* PWA Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Push Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🔔 Push Notifications
          </h3>
          <p className="text-gray-600 mb-4">
            Receive medication reminders and health alerts even when the app is
            closed.
          </p>
          <div className="space-y-3">
            <button
              onClick={sendTestNotification}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send Test Notification
            </button>
            <div className="text-sm text-gray-500">
              Permission:{" "}
              {Notification.permission === "granted"
                ? "✅ Granted"
                : "❌ Not granted"}
            </div>
          </div>
        </div>

        {/* Offline Capabilities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📱 Offline Mode
          </h3>
          <p className="text-gray-600 mb-4">
            Access essential health features even without internet connection.
          </p>
          <div className="space-y-3">
            <button
              onClick={cacheHealthData}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Cache Health Data
            </button>
            <div className="text-sm text-gray-500">
              Cached data available offline
            </div>
          </div>
        </div>

        {/* Background Sync */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🔄 Background Sync
          </h3>
          <p className="text-gray-600 mb-4">
            Automatically sync health data when connection is restored.
          </p>
          <div className="space-y-3">
            <button
              onClick={enableBackgroundSync}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enable Background Sync
            </button>
            <div className="text-sm text-gray-500">Sync when online</div>
          </div>
        </div>

        {/* Device Integration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📱 Device Features
          </h3>
          <p className="text-gray-600 mb-4">
            Access device capabilities for enhanced health monitoring.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Camera Access</span>
              <span className="text-green-600">✅ Available</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Geolocation</span>
              <span className="text-green-600">✅ Available</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Vibration</span>
              <span className="text-green-600">✅ Available</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>File System</span>
              <span className="text-green-600">✅ Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Features */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            📱 Offline Features Available
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>View cached vital signs</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>Medication reminders</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>Emergency contacts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>Health history</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced PWA Features */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🚀 Advanced PWA Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <span className="text-3xl block mb-2">⚡</span>
            <h4 className="font-medium">Lightning Fast</h4>
            <p className="text-sm text-gray-600">
              Service worker caching for instant loading
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="text-3xl block mb-2">🔐</span>
            <h4 className="font-medium">Secure</h4>
            <p className="text-sm text-gray-600">
              HTTPS encryption for all data
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <span className="text-3xl block mb-2">📱</span>
            <h4 className="font-medium">Native Feel</h4>
            <p className="text-sm text-gray-600">Full-screen app experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
