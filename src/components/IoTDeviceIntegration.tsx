import React, { useState, useEffect } from "react";

interface Device {
  id: string;
  name: string;
  type:
    | "smartwatch"
    | "glucose_meter"
    | "blood_pressure"
    | "smart_scale"
    | "pulse_oximeter"
    | "thermometer";
  status: "connected" | "disconnected" | "syncing" | "error";
  battery?: number;
  lastSync: string;
  data?: any;
}

interface VitalReading {
  deviceId: string;
  type: string;
  value: string;
  unit: string;
  timestamp: string;
  normalRange: string;
  status: "normal" | "warning" | "critical";
}

export default function IoTDeviceIntegration() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "apple-watch-001",
      name: "Apple Watch Series 9",
      type: "smartwatch",
      status: "connected",
      battery: 85,
      lastSync: "2 minutes ago",
      data: { heartRate: 72, steps: 8456, calories: 245 },
    },
    {
      id: "glucose-meter-001",
      name: "FreeStyle Libre 3",
      type: "glucose_meter",
      status: "connected",
      battery: 92,
      lastSync: "15 minutes ago",
      data: { glucose: 95, trend: "stable" },
    },
    {
      id: "bp-monitor-001",
      name: "Omron HeartGuide",
      type: "blood_pressure",
      status: "syncing",
      battery: 67,
      lastSync: "1 hour ago",
      data: { systolic: 118, diastolic: 78 },
    },
    {
      id: "smart-scale-001",
      name: "Withings Body+",
      type: "smart_scale",
      status: "connected",
      battery: 78,
      lastSync: "3 hours ago",
      data: { weight: 70.2, bodyFat: 15.8, muscle: 32.1 },
    },
  ]);

  const [recentReadings, setRecentReadings] = useState<VitalReading[]>([
    {
      deviceId: "apple-watch-001",
      type: "Heart Rate",
      value: "72",
      unit: "bpm",
      timestamp: "2 min ago",
      normalRange: "60-100 bpm",
      status: "normal",
    },
    {
      deviceId: "glucose-meter-001",
      type: "Blood Glucose",
      value: "95",
      unit: "mg/dL",
      timestamp: "15 min ago",
      normalRange: "70-100 mg/dL",
      status: "normal",
    },
    {
      deviceId: "bp-monitor-001",
      type: "Blood Pressure",
      value: "118/78",
      unit: "mmHg",
      timestamp: "1 hour ago",
      normalRange: "<120/80 mmHg",
      status: "normal",
    },
    {
      deviceId: "smart-scale-001",
      type: "Weight",
      value: "70.2",
      unit: "kg",
      timestamp: "3 hours ago",
      normalRange: "65-75 kg",
      status: "normal",
    },
  ]);

  const [bluetoothSupported, setBluetoothSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Check for Bluetooth support
    setBluetoothSupported("bluetooth" in navigator);
  }, []);

  const getDeviceIcon = (type: Device["type"]) => {
    const icons = {
      smartwatch: "⌚",
      glucose_meter: "🩸",
      blood_pressure: "🫀",
      smart_scale: "⚖️",
      pulse_oximeter: "🫁",
      thermometer: "🌡️",
    };
    return icons[type] || "📱";
  };

  const getStatusColor = (status: Device["status"]) => {
    const colors = {
      connected: "text-green-600 bg-green-100",
      disconnected: "text-red-600 bg-red-100",
      syncing: "text-yellow-600 bg-yellow-100",
      error: "text-red-600 bg-red-100",
    };
    return colors[status];
  };

  const getVitalStatusColor = (status: VitalReading["status"]) => {
    const colors = {
      normal: "text-green-600 bg-green-100",
      warning: "text-yellow-600 bg-yellow-100",
      critical: "text-red-600 bg-red-100",
    };
    return colors[status];
  };

  const scanForDevices = async () => {
    setIsScanning(true);

    if (bluetoothSupported) {
      try {
        // Simulate device scanning
        setTimeout(() => {
          setDevices((prev) => [
            ...prev,
            {
              id: "new-device-001",
              name: "Fitbit Sense 2",
              type: "smartwatch",
              status: "disconnected",
              battery: 0,
              lastSync: "Never",
            },
          ]);
          setIsScanning(false);
        }, 2000);
      } catch (error) {
        console.error("Bluetooth scan failed:", error);
        setIsScanning(false);
      }
    } else {
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  const connectDevice = async (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, status: "syncing" } : device,
      ),
    );

    // Simulate connection
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, status: "connected", lastSync: "Just now" }
            : device,
        ),
      );
    }, 3000);
  };

  const syncDevice = async (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, status: "syncing" } : device,
      ),
    );

    // Simulate sync
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, status: "connected", lastSync: "Just now" }
            : device,
        ),
      );
    }, 2000);
  };

  const exportData = () => {
    const exportData = {
      devices: devices.map((d) => ({ ...d, data: d.data })),
      readings: recentReadings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health-device-data.json";
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🌐 IoT Device Integration</h1>
        <p className="text-blue-100">
          Connect and monitor your health devices in real-time
        </p>
      </div>

      {/* Bluetooth Status */}
      <div
        className={`p-4 rounded-xl border-2 ${
          bluetoothSupported
            ? "bg-blue-50 border-blue-300 text-blue-800"
            : "bg-red-50 border-red-300 text-red-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📡</span>
            <span className="font-medium">
              {bluetoothSupported
                ? "Bluetooth enabled - Ready to connect devices"
                : "Bluetooth not supported in this browser"}
            </span>
          </div>
          <button
            onClick={scanForDevices}
            disabled={isScanning || !bluetoothSupported}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isScanning ? "🔍 Scanning..." : "🔍 Scan for Devices"}
          </button>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">📱 Connected Devices</h2>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Export Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {device.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}
                >
                  {device.status}
                </span>
              </div>

              {device.battery !== undefined && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Battery</span>
                    <span>{device.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        device.battery > 50
                          ? "bg-green-500"
                          : device.battery > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${device.battery}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500 mb-3">
                Last sync: {device.lastSync}
              </div>

              {device.data && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-medium mb-2">Latest Data</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(device.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {device.status === "disconnected" ? (
                  <button
                    onClick={() => connectDevice(device.id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Connect
                  </button>
                ) : (
                  <button
                    onClick={() => syncDevice(device.id)}
                    disabled={device.status === "syncing"}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                  >
                    {device.status === "syncing" ? "Syncing..." : "Sync Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Readings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">📊 Recent Vital Readings</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Vital
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Value
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Normal Range
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentReadings.map((reading, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>
                        {getDeviceIcon(
                          devices.find((d) => d.id === reading.deviceId)
                            ?.type || "smartwatch",
                        )}
                      </span>
                      <span className="font-medium">{reading.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-medium">
                      {reading.value} {reading.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {reading.normalRange}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getVitalStatusColor(reading.status)}`}
                    >
                      {reading.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {reading.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Devices */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          🔌 Supported Device Types
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { type: "smartwatch", name: "Smart Watches", icon: "⌚" },
            { type: "glucose_meter", name: "Glucose Meters", icon: "🩸" },
            { type: "blood_pressure", name: "BP Monitors", icon: "🫀" },
            { type: "smart_scale", name: "Smart Scales", icon: "⚖️" },
            { type: "pulse_oximeter", name: "Pulse Oximeters", icon: "🫁" },
            { type: "thermometer", name: "Thermometers", icon: "🌡️" },
          ].map((deviceType) => (
            <div
              key={deviceType.type}
              className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-3xl block mb-2">{deviceType.icon}</span>
              <h4 className="font-medium text-sm">{deviceType.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-semibold mb-4">
          ✨ IoT Integration Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Real-time vital monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Automatic data synchronization</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Trend analysis and insights</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Emergency alerts and notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Healthcare provider sharing</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-600">✅</span>
              <span>Medication adherence tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
