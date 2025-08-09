import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useABHA } from "../contexts/ABHAContext";

interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  bloodGlucose?: number;
  weight?: number;
  height?: number;
}

interface MonitoringDevice {
  id: string;
  type:
    | "BLOOD_PRESSURE"
    | "GLUCOMETER"
    | "PULSE_OXIMETER"
    | "THERMOMETER"
    | "WEIGHING_SCALE";
  name: string;
  batteryLevel: number;
  isConnected: boolean;
  lastSync: string;
}

interface PatientReading {
  id: string;
  timestamp: string;
  vitals: VitalSigns;
  deviceUsed: string;
  notes?: string;
  alerts: string[];
}

export default function RemotePatientMonitoring() {
  const { currentLanguage } = useLanguage();
  const { isABHAConnected } = useABHA();
  const [devices, setDevices] = useState<MonitoringDevice[]>([]);
  const [readings, setReadings] = useState<PatientReading[]>([]);
  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // RPM translations
  const rpmTexts = {
    english: {
      title: "📊 Remote Patient Monitoring",
      subtitle: "Track your vital signs with connected devices",
      currentVitals: "Current Vital Signs",
      devices: "Connected Devices",
      readings: "Recent Readings",
      recordVitals: "Record Vitals",
      noDevices: "No devices connected",
      noReadings: "No readings recorded yet",
      connectDevice: "Connect Device",
      syncNow: "Sync Now",
      heartRate: "Heart Rate",
      bloodPressure: "Blood Pressure",
      temperature: "Temperature",
      oxygenSaturation: "Oxygen Saturation",
      respiratoryRate: "Respiratory Rate",
      bloodGlucose: "Blood Glucose",
      weight: "Weight",
      height: "Height",
      bpm: "bpm",
      mmhg: "mmHg",
      celsius: "°C",
      fahrenheit: "°F",
      percent: "%",
      mgdl: "mg/dL",
      kg: "kg",
      cm: "cm",
      connected: "Connected",
      disconnected: "Disconnected",
      batteryLow: "Battery Low",
      batteryGood: "Battery Good",
      normal: "Normal",
      high: "High",
      low: "Low",
      critical: "Critical",
      lastReading: "Last Reading",
      alerts: "Health Alerts",
      trends: "Trends",
      shareWithDoctor: "Share with Doctor",
      emergencyAlert: "Emergency Alert",
      vitalsOutOfRange: "Vitals out of normal range",
      deviceKit: "EasyMed Device Kit",
      instructions: "Follow device instructions for accurate readings",
      dataSharing: "Your data is securely shared with healthcare providers",
      aiAnalysis: "AI-powered health analysis available",
    },
    hindi: {
      title: "📊 रिमोट रोगी निगरानी",
      subtitle:
        "कनेक्टेड डिवाइसेस के साथ अपने महत्वपूर्ण संकेतों को ट्रैक करें",
      currentVitals: "वर्तमान महत्वपूर्ण संकेत",
      devices: "जुड़े हुए उपकरण",
      readings: "हाल की रीडिंग",
      recordVitals: "वाइटल्स रिकॉर्ड करें",
      noDevices: "कोई उपकरण कनेक्ट नहीं",
      noReadings: "अभी तक कोई रीडिंग रिकॉर्ड नहीं की गई",
      connectDevice: "डिवाइस कनेक्ट करें",
      syncNow: "अभी सिंक करें",
      heartRate: "हृदय गति",
      bloodPressure: "रक्तचाप",
      temperature: "तापमान",
      oxygenSaturation: "ऑक्सीजन संतृप्ति",
      respiratoryRate: "श्वसन दर",
      bloodGlucose: "रक्त शर्करा",
      weight: "वजन",
      height: "ऊंचाई",
      bpm: "बीपीएम",
      mmhg: "एमएमएचजी",
      celsius: "°सेल्सियस",
      fahrenheit: "°फारेनहाइट",
      percent: "%",
      mgdl: "मिलीग्राम/डीएल",
      kg: "किलो",
      cm: "सेमी",
      connected: "कनेक्टेड",
      disconnected: "डिस्कनेक्टेड",
      batteryLow: "बैटरी कम",
      batteryGood: "बैटरी अच्छी",
      normal: "सामान्य",
      high: "उच्च",
      low: "निम्न",
      critical: "गंभीर",
      lastReading: "अंतिम रीडिंग",
      alerts: "स्वास्थ्य अलर्ट",
      trends: "रुझान",
      shareWithDoctor: "डॉक्टर के साथ साझा करें",
      emergencyAlert: "आपातकालीन अलर्ट",
      vitalsOutOfRange: "वाइटल्स सामान्य सीमा से बाहर",
      deviceKit: "ईज़ीमेड डिवाइस किट",
      instructions: "सटीक रीडिंग के लिए डिवाइस निर्देशों का पालन करें",
      dataSharing:
        "आपका डेटा स्वास्थ्य सेवा प्रदाताओं के साथ सुरक्षित रूप से साझा किया जाता है",
      aiAnalysis: "एआई-संचालित स्वास्थ्य विश्लेषण उपलब्ध",
    },
    tamil: {
      title: "📊 தொலைநிலை நோயாளி கண்காணிப்பு",
      subtitle:
        "இணைக்கப்பட்ட சாதனங்களுடன் உங்கள் முக்கிய அறிகுறிகளைக் கண்காணிக்கவும்",
      currentVitals: "தற்போதைய முக்கிய அறிகுறிகள்",
      devices: "இணைக்கப்பட்ட சாதனங்கள்",
      readings: "சமீபத்திய அளவீடுகள்",
      recordVitals: "முக்கிய அறிகுறிகளைப் பதிவு செய்யவும்",
      noDevices: "எந்த சாதனமும் இணைக்கப்படவில்லை",
      noReadings: "இன்னும் எந்த அளவீடும் பதிவு செய்யப்படவில்லை",
      connectDevice: "சாதனத்தை இணைக்கவும்",
      syncNow: "இப்போது ஒத்திசைக்கவும்",
      heartRate: "இதயத் துடிப்பு",
      bloodPressure: "இரத்த அழுத்தம்",
      temperature: "வெப்பநிலை",
      oxygenSaturation: "ஆக்ஸிஜன் செறிவு",
      respiratoryRate: "சுவாச வீதம்",
      bloodGlucose: "இரத்த சர்க்கரை",
      weight: "எடை",
      height: "உயரம்",
      bpm: "பிபிஎம்",
      mmhg: "எம்எம்எச்ஜி",
      celsius: "°செல்சியஸ்",
      fahrenheit: "°பாரன்ஹீட்",
      percent: "%",
      mgdl: "மிகி/டிஎல்",
      kg: "கிலோ",
      cm: "சென்மீ",
      connected: "இணைக்கப்பட்டுள்ளது",
      disconnected: "துண்டிக்கப்பட்டுள்ளது",
      batteryLow: "பேட்டரி குறைவு",
      batteryGood: "பேட்டரி நல்லது",
      normal: "சாதாரண",
      high: "உயர்ந்த",
      low: "குறைந்த",
      critical: "மிக முக்கியமான",
      lastReading: "கடைசி அளவீடு",
      alerts: "சுகாதார எச்சரிக்கைகள்",
      trends: "போக்குகள்",
      shareWithDoctor: "மருத்துவருடன் பகிர்ந்து கொள்ளுங்கள்",
      emergencyAlert: "அவசர எச்சரிக்கை",
      vitalsOutOfRange: "முக்கிய அறிகுறிகள் சாதாரண வரம்புக்கு வெளியே",
      deviceKit: "ஈஸிமெட் சாதன கிட்",
      instructions: "துல்லியமான அளவீடுகளுக்கு சாதன வழிமுறைகளைப் பின்பற்றவும்",
      dataSharing:
        "உங்கள் தரவு சுகாதாரப் பராமரிப்பாளர்களுடன் பாதுகாப்பாகப் பகிரப்படுகிறது",
      aiAnalysis: "AI-இயங்கும் சுகாதார பகுப்பாய்வு கிடைக்கிறது",
    },
  };

  const getRPMText = (key: keyof typeof rpmTexts.english): string => {
    return (
      rpmTexts[currentLanguage as keyof typeof rpmTexts]?.[key] ||
      rpmTexts.english[key]
    );
  };

  // Mock devices data
  const mockDevices: MonitoringDevice[] = [
    {
      id: "device1",
      type: "BLOOD_PRESSURE",
      name: "EasyMed BP Monitor",
      batteryLevel: 85,
      isConnected: true,
      lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "device2",
      type: "PULSE_OXIMETER",
      name: "EasyMed Pulse Oximeter",
      batteryLevel: 92,
      isConnected: true,
      lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "device3",
      type: "GLUCOMETER",
      name: "EasyMed Glucometer",
      batteryLevel: 45,
      isConnected: false,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "device4",
      type: "THERMOMETER",
      name: "EasyMed Digital Thermometer",
      batteryLevel: 78,
      isConnected: true,
      lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ];

  // Mock readings data
  const mockReadings: PatientReading[] = [
    {
      id: "reading1",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      vitals: {
        heartRate: 72,
        bloodPressure: { systolic: 120, diastolic: 80 },
        temperature: 98.6,
        oxygenSaturation: 98,
        respiratoryRate: 16,
      },
      deviceUsed: "EasyMed BP Monitor",
      alerts: [],
    },
    {
      id: "reading2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      vitals: {
        heartRate: 85,
        bloodPressure: { systolic: 140, diastolic: 90 },
        temperature: 99.2,
        oxygenSaturation: 96,
        respiratoryRate: 18,
        bloodGlucose: 110,
      },
      deviceUsed: "EasyMed Glucometer",
      alerts: ["Blood pressure slightly elevated", "Temperature slightly high"],
    },
  ];

  useEffect(() => {
    setDevices(mockDevices);
    setReadings(mockReadings);
    if (mockReadings.length > 0) {
      setCurrentVitals(mockReadings[0].vitals);
    }
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "BLOOD_PRESSURE":
        return "🩺";
      case "PULSE_OXIMETER":
        return "💓";
      case "GLUCOMETER":
        return "🩸";
      case "THERMOMETER":
        return "🌡️";
      case "WEIGHING_SCALE":
        return "⚖️";
      default:
        return "📱";
    }
  };

  const getVitalStatus = (
    vital: string,
    value: number,
  ): "normal" | "high" | "low" | "critical" => {
    switch (vital) {
      case "heartRate":
        if (value < 60) return "low";
        if (value > 100) return "high";
        return "normal";
      case "temperature":
        if (value < 97) return "low";
        if (value > 100.4) return "high";
        if (value > 102) return "critical";
        return "normal";
      case "oxygenSaturation":
        if (value < 90) return "critical";
        if (value < 95) return "low";
        return "normal";
      default:
        return "normal";
    }
  };

  const getVitalColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600";
      case "high":
        return "text-orange-600";
      case "low":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSyncDevice = async (deviceId: string) => {
    setIsRecording(true);
    try {
      // Simulate device sync
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update device last sync time
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, lastSync: new Date().toISOString() }
            : device,
        ),
      );
    } catch (error) {
      console.error("Failed to sync device:", error);
    } finally {
      setIsRecording(false);
    }
  };

  if (!isABHAConnected) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">{getRPMText("title")}</h3>
          <p className="text-gray-600 mb-4">
            Connect ABHA to access remote monitoring
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-xl">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {getRPMText("title")}
            </h3>
            <p className="text-sm text-gray-600">{getRPMText("subtitle")}</p>
          </div>
        </div>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-6 py-3 rounded-xl transition-all duration-300 text-sm font-semibold hover:scale-105 active:scale-95 shadow-lg ${
            isRecording
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-red-200"
              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-200"
          }`}
        >
          {isRecording ? "🔴 Recording..." : `📈 ${getRPMText("recordVitals")}`}
        </button>
      </div>

      {/* Device Kit Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📦</div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-800">
              {getRPMText("deviceKit")}
            </h4>
            <p className="text-sm text-blue-600">
              {getRPMText("instructions")}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {getRPMText("dataSharing")}
            </p>
          </div>
        </div>
      </div>

      {/* Current Vitals */}
      {currentVitals && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">{getRPMText("currentVitals")}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="bg-white/50 p-3 rounded-lg border border-white/20">
              <div className="text-center">
                <div className="text-xl mb-1">💓</div>
                <p className="text-xs text-gray-600">
                  {getRPMText("heartRate")}
                </p>
                <p
                  className={`font-bold ${getVitalColor(getVitalStatus("heartRate", currentVitals.heartRate))}`}
                >
                  {currentVitals.heartRate} {getRPMText("bpm")}
                </p>
              </div>
            </div>

            <div className="bg-white/50 p-3 rounded-lg border border-white/20">
              <div className="text-center">
                <div className="text-xl mb-1">🩺</div>
                <p className="text-xs text-gray-600">
                  {getRPMText("bloodPressure")}
                </p>
                <p className="font-bold text-blue-600">
                  {currentVitals.bloodPressure.systolic}/
                  {currentVitals.bloodPressure.diastolic}
                </p>
                <p className="text-xs text-gray-500">{getRPMText("mmhg")}</p>
              </div>
            </div>

            <div className="bg-white/50 p-3 rounded-lg border border-white/20">
              <div className="text-center">
                <div className="text-xl mb-1">🌡️</div>
                <p className="text-xs text-gray-600">
                  {getRPMText("temperature")}
                </p>
                <p
                  className={`font-bold ${getVitalColor(getVitalStatus("temperature", currentVitals.temperature))}`}
                >
                  {currentVitals.temperature}
                  {getRPMText("fahrenheit")}
                </p>
              </div>
            </div>

            <div className="bg-white/50 p-3 rounded-lg border border-white/20">
              <div className="text-center">
                <div className="text-xl mb-1">🫁</div>
                <p className="text-xs text-gray-600">
                  {getRPMText("oxygenSaturation")}
                </p>
                <p
                  className={`font-bold ${getVitalColor(getVitalStatus("oxygenSaturation", currentVitals.oxygenSaturation))}`}
                >
                  {currentVitals.oxygenSaturation}
                  {getRPMText("percent")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Devices */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">{getRPMText("devices")}</h4>
        {devices.length === 0 ? (
          <div className="text-center py-6 bg-white/30 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-gray-600 text-sm">{getRPMText("noDevices")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-white/50 p-3 rounded-lg border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-2xl">{getDeviceIcon(device.type)}</div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium truncate">{device.name}</h5>
                      <div className="flex items-center space-x-2 text-xs">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full ${
                            device.isConnected
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {device.isConnected
                            ? getRPMText("connected")
                            : getRPMText("disconnected")}
                        </span>
                        <span
                          className={`${device.batteryLevel < 20 ? "text-red-600" : "text-gray-600"}`}
                        >
                          🔋 {device.batteryLevel}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getRPMText("lastReading")}:{" "}
                        {formatTime(device.lastSync)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSyncDevice(device.id)}
                    disabled={!device.isConnected || isRecording}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      device.isConnected && !isRecording
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {isRecording ? "Syncing..." : getRPMText("syncNow")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Readings */}
      <div>
        <h4 className="font-medium mb-3">{getRPMText("readings")}</h4>
        {readings.length === 0 ? (
          <div className="text-center py-6 bg-white/30 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-gray-600 text-sm">{getRPMText("noReadings")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {readings.slice(0, 3).map((reading) => (
              <div
                key={reading.id}
                className="bg-white/50 p-3 rounded-lg border border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">
                        {formatTime(reading.timestamp)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {reading.deviceUsed}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">HR: </span>
                        <span className="font-medium">
                          {reading.vitals.heartRate} bpm
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">BP: </span>
                        <span className="font-medium">
                          {reading.vitals.bloodPressure.systolic}/
                          {reading.vitals.bloodPressure.diastolic}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Temp: </span>
                        <span className="font-medium">
                          {reading.vitals.temperature}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">SpO2: </span>
                        <span className="font-medium">
                          {reading.vitals.oxygenSaturation}%
                        </span>
                      </div>
                    </div>
                    {reading.alerts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-orange-600 font-medium">
                          {getRPMText("alerts")}:
                        </p>
                        {reading.alerts.map((alert, index) => (
                          <p key={index} className="text-xs text-orange-600">
                            • {alert}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-all ml-2">
                    {getRPMText("shareWithDoctor")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Banner */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🤖</div>
          <div className="flex-1">
            <h4 className="font-medium text-purple-800">
              {getRPMText("aiAnalysis")}
            </h4>
            <p className="text-sm text-purple-600">
              AI-powered insights based on your vital trends and patterns
            </p>
          </div>
          <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-all">
            View Analysis
          </button>
        </div>
      </div>
    </section>
  );
}
