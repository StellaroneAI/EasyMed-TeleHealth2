import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface EmergencyAlert {
  id: string;
  type: "medical" | "fall" | "panic" | "medication" | "vital_signs";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  location?: { lat: number; lng: number; address: string };
  resolved: boolean;
  responders: string[];
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  accuracy: number;
}

export default function EmergencySystem() {
  const { currentLanguage, getText } = useLanguage();
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  );
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [recentAlerts, setRecentAlerts] = useState<EmergencyAlert[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(0);
  const [selectedEmergencyType, setSelectedEmergencyType] =
    useState<string>("");

  useEffect(() => {
    loadEmergencyContacts();
    loadRecentAlerts();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emergencyCountdown > 0) {
      interval = setInterval(() => {
        setEmergencyCountdown((prev) => {
          if (prev <= 1) {
            triggerEmergencyAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emergencyCountdown]);

  const loadEmergencyContacts = () => {
    const contacts: EmergencyContact[] = [
      {
        id: "contact1",
        name: "Dr. Sarah Johnson",
        relationship: "Primary Doctor",
        phone: "+91-9876543210",
        isPrimary: true,
      },
      {
        id: "contact2",
        name: "John Smith",
        relationship: "Son",
        phone: "+91-9876543211",
        isPrimary: false,
      },
      {
        id: "contact3",
        name: "Emergency Services",
        relationship: "Emergency",
        phone: "108",
        isPrimary: true,
      },
      {
        id: "contact4",
        name: "Mary Johnson",
        relationship: "Daughter",
        phone: "+91-9876543212",
        isPrimary: false,
      },
    ];
    setEmergencyContacts(contacts);
  };

  const loadRecentAlerts = () => {
    const alerts: EmergencyAlert[] = [
      {
        id: "alert1",
        type: "vital_signs",
        severity: "medium",
        message: "Blood pressure reading above normal range (145/95)",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        resolved: true,
        responders: ["Dr. Sarah Johnson"],
      },
      {
        id: "alert2",
        type: "medication",
        severity: "low",
        message: "Missed morning medication reminder",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        resolved: true,
        responders: ["John Smith"],
      },
    ];
    setRecentAlerts(alerts);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          try {
            // Simulate reverse geocoding
            const address = await reverseGeocode(latitude, longitude);
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              address,
              accuracy: accuracy || 0,
            });
          } catch (error) {
            console.error("Error getting address:", error);
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              accuracy: accuracy || 0,
            });
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use fallback location for demo
          setCurrentLocation({
            lat: 12.9716,
            lng: 77.5946,
            address: "Bangalore, Karnataka, India",
            accuracy: 100,
          });
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    } else {
      setIsLocating(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simulate reverse geocoding API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `Near ${lat.toFixed(4)}, ${lng.toFixed(4)} - Bangalore, Karnataka`;
  };

  const startEmergencyCountdown = (type: string) => {
    setSelectedEmergencyType(type);
    setEmergencyCountdown(10); // 10 second countdown

    // Play emergency sound
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Emergency alert activated. Emergency services will be contacted in 10 seconds. Press cancel if this was accidental.`,
      );
      utterance.rate = 1.2;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const cancelEmergencyCountdown = () => {
    setEmergencyCountdown(0);
    setSelectedEmergencyType("");

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Emergency alert cancelled.",
      );
      speechSynthesis.speak(utterance);
    }
  };

  const triggerEmergencyAlert = async () => {
    setIsEmergencyMode(true);

    const newAlert: EmergencyAlert = {
      id: `alert_${Date.now()}`,
      type: selectedEmergencyType as any,
      severity: "critical",
      message: getEmergencyMessage(selectedEmergencyType),
      timestamp: new Date(),
      location: currentLocation || undefined,
      resolved: false,
      responders: [],
    };

    setRecentAlerts((prev) => [newAlert, ...prev]);

    // Send alerts to emergency contacts
    const primaryContacts = emergencyContacts.filter((c) => c.isPrimary);

    for (const contact of primaryContacts) {
      await sendEmergencyNotification(contact, newAlert);
    }

    // Start continuous location sharing
    startLocationTracking();

    // Announce emergency alert
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Emergency alert sent. Help is on the way. Your location has been shared with emergency contacts.`,
      );
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const getEmergencyMessage = (type: string): string => {
    const messages = {
      medical: "Medical emergency reported. Immediate assistance required.",
      fall: "Fall detected. Patient may need immediate medical attention.",
      panic: "Panic button activated. Patient requesting immediate help.",
      medication: "Medication emergency. Possible overdose or severe reaction.",
      vital_signs:
        "Critical vital signs detected. Medical emergency in progress.",
    };
    return (
      messages[type as keyof typeof messages] || "Emergency situation reported."
    );
  };

  const sendEmergencyNotification = async (
    contact: EmergencyContact,
    alert: EmergencyAlert,
  ) => {
    // Simulate sending notification
    console.log(
      `Sending emergency notification to ${contact.name} (${contact.phone})`,
    );

    const message = `
🚨 EMERGENCY ALERT 🚨
${alert.message}
Time: ${alert.timestamp.toLocaleString()}
${currentLocation ? `Location: ${currentLocation.address}` : "Location unavailable"}
Patient: [Patient Name]
Contact immediately if you receive this message.
    `;

    // In a real app, this would send SMS/call through emergency services API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const startLocationTracking = () => {
    // Start continuous location tracking for emergency responders
    const trackingInterval = setInterval(() => {
      if (!isEmergencyMode) {
        clearInterval(trackingInterval);
        return;
      }
      getCurrentLocation();
    }, 30000); // Update every 30 seconds
  };

  const resolveEmergency = () => {
    setIsEmergencyMode(false);
    setSelectedEmergencyType("");

    // Update the latest alert as resolved
    setRecentAlerts((prev) =>
      prev.map((alert, index) =>
        index === 0 ? { ...alert, resolved: true } : alert,
      ),
    );

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Emergency resolved. Normal monitoring resumed.",
      );
      speechSynthesis.speak(utterance);
    }
  };

  const callEmergencyContact = (contact: EmergencyContact) => {
    // In a real app, this would initiate a phone call
    window.open(`tel:${contact.phone}`);

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Calling ${contact.name}`);
      speechSynthesis.speak(utterance);
    }
  };

  const emergencyTypes = [
    {
      id: "medical",
      name: "Medical Emergency",
      icon: "🏥",
      color: "bg-red-500",
    },
    { id: "fall", name: "Fall Detected", icon: "⬇️", color: "bg-orange-500" },
    { id: "panic", name: "Panic Button", icon: "🆘", color: "bg-red-600" },
    {
      id: "medication",
      name: "Medication Issue",
      icon: "💊",
      color: "bg-purple-500",
    },
    {
      id: "vital_signs",
      name: "Critical Vitals",
      icon: "💓",
      color: "bg-red-400",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-800 bg-red-100 border-red-400";
      case "high":
        return "text-red-700 bg-red-50 border-red-300";
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-300";
      case "low":
        return "text-blue-700 bg-blue-50 border-blue-300";
      default:
        return "text-gray-700 bg-gray-50 border-gray-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="text-xl font-bold">EMERGENCY MODE ACTIVE</h2>
                <p>
                  Emergency services have been notified. Help is on the way.
                </p>
              </div>
            </div>
            <button
              onClick={resolveEmergency}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100"
            >
              Resolve Emergency
            </button>
          </div>
        </div>
      )}

      {/* Emergency Countdown */}
      {emergencyCountdown > 0 && (
        <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-6xl font-bold mb-4 animate-bounce">
            {emergencyCountdown}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Emergency Alert Activating
          </h2>
          <p className="text-red-100 mb-4">
            Emergency services will be contacted automatically
          </p>
          <button
            onClick={cancelEmergencyCountdown}
            className="px-8 py-3 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            CANCEL EMERGENCY
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          🚨 Emergency Response System
        </h1>
        <p className="text-red-100">
          24/7 emergency monitoring and rapid response
        </p>

        {/* Location Status */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-red-200">📍</span>
          {isLocating ? (
            <span className="text-red-100">Getting your location...</span>
          ) : currentLocation ? (
            <span className="text-red-100">{currentLocation.address}</span>
          ) : (
            <span className="text-red-100">Location unavailable</span>
          )}
        </div>
      </div>

      {/* Emergency Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => startEmergencyCountdown(type.id)}
            disabled={emergencyCountdown > 0 || isEmergencyMode}
            className={`${type.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <h3 className="text-lg font-semibold">{type.name}</h3>
            <p className="text-sm opacity-90 mt-1">
              Tap to activate emergency alert
            </p>
          </button>
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📞 Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <p className="text-gray-600">{contact.relationship}</p>
                  <p className="text-blue-600 font-medium">{contact.phone}</p>
                  {contact.isPrimary && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      ⭐ Primary Contact
                    </span>
                  )}
                </div>
                <button
                  onClick={() => callEmergencyContact(contact)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📞 Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          📋 Recent Emergency Alerts
        </h2>

        {recentAlerts.length > 0 ? (
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {alert.type === "medical"
                          ? "🏥"
                          : alert.type === "fall"
                            ? "⬇️"
                            : alert.type === "panic"
                              ? "🆘"
                              : alert.type === "medication"
                                ? "💊"
                                : "💓"}
                      </span>
                      <h3 className="font-semibold capitalize">
                        {alert.type.replace("_", " ")} Alert
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{alert.message}</p>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>🕐 {alert.timestamp.toLocaleString()}</p>
                      {alert.location && <p>📍 {alert.location.address}</p>}
                      {alert.responders.length > 0 && (
                        <p>👥 Responders: {alert.responders.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {alert.resolved ? (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✅ Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 animate-pulse">
                        🔴 Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">✅</span>
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              No Recent Emergencies
            </h3>
            <p className="text-gray-600">
              Your emergency monitoring system is active and ready.
            </p>
          </div>
        )}
      </div>

      {/* Emergency Services Info */}
      <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-6 border-2 border-dashed border-red-300">
        <h2 className="text-xl font-semibold mb-4 text-red-800">
          🚑 Emergency Services Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🚑</div>
            <h3 className="font-semibold">Medical Emergency</h3>
            <p className="text-2xl font-bold text-red-600">108</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="font-semibold">Police Emergency</h3>
            <p className="text-2xl font-bold text-red-600">100</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="text-2xl mb-2">🚒</div>
            <h3 className="font-semibold">Fire Emergency</h3>
            <p className="text-2xl font-bold text-red-600">101</p>
          </div>
        </div>

        <div className="mt-4 text-sm text-red-700 bg-red-100 p-3 rounded border-l-4 border-red-400">
          <h4 className="font-semibold mb-1">⚠️ Important:</h4>
          <p>
            This system automatically shares your location with emergency
            responders when activated. Make sure your emergency contacts are up
            to date and your location services are enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
