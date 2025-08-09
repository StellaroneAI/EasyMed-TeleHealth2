import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface VitalSign {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: "normal" | "warning" | "critical";
  icon: string;
  color: string;
  timestamp: string;
}

interface VitalDashboardProps {
  patientId?: string;
  className?: string;
}

export default function VitalDashboard({
  patientId,
  className = "",
}: VitalDashboardProps) {
  const { currentLanguage } = useLanguage();

  // Translation texts
  const texts = {
    english: {
      remotePatientMonitoring: "Remote Patient Monitoring",
      realtimeVitalSigns: "Real-time vital signs tracking",
      liveMonitoring: "Live Monitoring",
      monitoringPaused: "Monitoring Paused",
      startMonitoring: "Start Monitoring",
      stopMonitoring: "Stop Monitoring",
      heartRate: "Heart Rate",
      bloodPressure: "Blood Pressure",
      bodyTemperature: "Body Temperature",
      oxygenSaturation: "Oxygen Saturation",
      bloodGlucose: "Blood Glucose",
      weight: "Weight",
      normal: "NORMAL",
      warning: "WARNING",
      critical: "CRITICAL",
      normalRange: "Normal",
      criticalAlert: "Critical Alert",
      criticalAlertMessage: "Some vital signs are outside normal ranges. Immediate medical attention may be required.",
      contactEmergency: "Contact Emergency Services",
      healthTrends: "Health Trends (Last 24 Hours)",
      stableVitals: "Stable Vitals",
      ofReadingsNormal: "of readings normal",
      averageHeartRate: "Average Heart Rate",
      withinNormalRange: "within normal range",
      sleepQuality: "Sleep Quality",
      goodQualitySleep: "good quality sleep",
    },
    hindi: {
      remotePatientMonitoring: "दूरस्थ रोगी निगरानी",
      realtimeVitalSigns: "वास्तविक समय जीवन संकेत ट्रैकिंग",
      liveMonitoring: "लाइव निगरानी",
      monitoringPaused: "निगरानी रोकी गई",
      startMonitoring: "निगरानी शुरू करें",
      stopMonitoring: "निगरानी बंद करें",
      heartRate: "हृदय गति",
      bloodPressure: "रक्तचाप",
      bodyTemperature: "शरीर का तापमान",
      oxygenSaturation: "ऑक्सीजन संतृप्ति",
      bloodGlucose: "रक्त ग्लूकोज",
      weight: "वजन",
      normal: "सामान्य",
      warning: "चेतावनी",
      critical: "गंभीर",
      normalRange: "सामान्य",
      criticalAlert: "गंभीर अलर्ट",
      criticalAlertMessage: "कुछ जीवन संकेत सामान्य सीमा से बाहर हैं। तत्काल चिकित्सा ध्यान की आवश्यकता हो सकती है।",
      contactEmergency: "आपातकालीन सेवाओं से संपर्क करें",
      healthTrends: "स्वास्थ्य रुझान (पिछले 24 घंटे)",
      stableVitals: "स्थिर जीवन संकेत",
      ofReadingsNormal: "रीडिंग सामान्य",
      averageHeartRate: "औसत हृदय गति",
      withinNormalRange: "सामान्य सीमा के भीतर",
      sleepQuality: "नींद की गुणवत्ता",
      goodQualitySleep: "अच्छी गुणवत्ता की नींद",
    },
    tamil: {
      remotePatientMonitoring: "தொலைநிலை நோயாளி கண்காணிப்பு",
      realtimeVitalSigns: "நேரடி உயிர் அறிகுறிகள் கண்காணிப்பு",
      liveMonitoring: "நேரடி கண்காணிப்பு",
      monitoringPaused: "கண்காணிப்பு நிறுத்தப்பட்டது",
      startMonitoring: "கண்காணிப்பைத் தொடங்கவும்",
      stopMonitoring: "கண்காணிப்பை நிறுத்தவும்",
      heartRate: "இதய துடிப்பு",
      bloodPressure: "இரத்த அழுத்தம்",
      bodyTemperature: "உடல் வெப்பநிலை",
      oxygenSaturation: "ஆக்ஸிஜன் செறிவு",
      bloodGlucose: "இரத்த குளுக்கோஸ்",
      weight: "எடை",
      normal: "சாதாரண",
      warning: "எச்சரிக்கை",
      critical: "அவசர",
      normalRange: "சாதாரண",
      criticalAlert: "அவசர எச்சரிக்கை",
      criticalAlertMessage: "சில உயிர் அறிகுறிகள் சாதாரண வரம்புக்கு வெளியே உள்ளன. உடனடி மருத்துவ கவனம் தேவைப்படலாம்.",
      contactEmergency: "அவசர சேவைகளை தொடர்பு கொள்ளுங்கள்",
      healthTrends: "சுகாதார போக்குகள் (கடந்த 24 மணி நேரம்)",
      stableVitals: "நிலையான உயிர் அறிகுறிகள்",
      ofReadingsNormal: "வாசிப்புகள் சாதாரணம்",
      averageHeartRate: "சராசரி இதய துடிப்பு",
      withinNormalRange: "சாதாரண வரம்புக்குள்",
      sleepQuality: "தூக்க தரம்",
      goodQualitySleep: "நல்ல தர தூக்கம்",
    },
    telugu: {
      remotePatientMonitoring: "రిమోట్ పేషెంట్ మానిటరింగ్",
      realtimeVitalSigns: "రియల్ టైమ్ వైటల్ సైన్స్ ట్రాకింగ్",
      liveMonitoring: "లైవ్ మానిటరింగ్",
      monitoringPaused: "మానిటరింగ్ పాజ్ చేయబడింది",
      startMonitoring: "మానిటరింగ్ ప్రారంభించండి",
      stopMonitoring: "మానిటరింగ్ ఆపండి",
      heartRate: "హృదయ స్పందన",
      bloodPressure: "రక్తపోటు",
      bodyTemperature: "శరీర ఉష్ణోగ్రత",
      oxygenSaturation: "ఆక్సిజన్ సంతృప్తి",
      bloodGlucose: "రక్త గ్లూకోజ్",
      weight: "బరువు",
      normal: "సాధారణ",
      warning: "హెచ్చరిక",
      critical: "క్లిష్టమైన",
      normalRange: "సాధారణ",
      criticalAlert: "క్లిష్టమైన అలర్ట్",
      criticalAlertMessage: "కొన్ని వైటల్ సైన్స్ సాధారణ పరిధుల వెలుపల ఉన్నాయి. తక్షణ వైద్య దృష్టి అవసరం కావచ్చు.",
      contactEmergency: "అత్యవసర సేవలను సంప్రదించండి",
      healthTrends: "ఆరోగ్య ధోరణులు (గత 24 గంటలు)",
      stableVitals: "స్థిరమైన వైటల్స్",
      ofReadingsNormal: "రీడింగ్లు సాధారణం",
      averageHeartRate: "సగటు హృదయ స్పందన",
      withinNormalRange: "సాధారణ పరిధిలో",
      sleepQuality: "నిద్ర నాణ్యత",
      goodQualitySleep: "మంచి నాణ్యత నిద్ర",
    },
    bengali: {
      remotePatientMonitoring: "দূরবর্তী রোগী পর্যবেক্ষণ",
      realtimeVitalSigns: "রিয়েল-টাইম জীবন সংকেত ট্র্যাকিং",
      liveMonitoring: "লাইভ পর্যবেক্ষণ",
      monitoringPaused: "পর্যবেক্ষণ বিরতি",
      startMonitoring: "পর্যবেক্ষণ শুরু করুন",
      stopMonitoring: "পর্যবেক্ষণ বন্ধ করুন",
      heartRate: "হৃদস্পন্দন",
      bloodPressure: "রক্তচাপ",
      bodyTemperature: "শরীরের তাপমাত্রা",
      oxygenSaturation: "অক্সিজেন স্যাচুরেশন",
      bloodGlucose: "রক্তের গ্লুকোজ",
      weight: "ওজন",
      normal: "স্বাভাবিক",
      warning: "সতর্কতা",
      critical: "জটিল",
      normalRange: "স্বাভাবিক",
      criticalAlert: "জটিল সতর্কতা",
      criticalAlertMessage: "কিছু জীবন সংকেত স্বাভাবিক সীমার বাইরে। তাৎক্ষণিক চিকিৎসা মনোযোগ প্রয়োজন হতে পারে।",
      contactEmergency: "জরুরি সেবার সাথে যোগাযোগ করুন",
      healthTrends: "স্বাস্থ্য প্রবণতা (গত ২৪ ঘন্টা)",
      stableVitals: "স্থিতিশীল জীবন সংকেত",
      ofReadingsNormal: "পড়ার স্বাভাবিক",
      averageHeartRate: "গড় হৃদস্পন্দন",
      withinNormalRange: "স্বাভাবিক সীমার মধ্যে",
      sleepQuality: "ঘুমের মান",
      goodQualitySleep: "ভাল মানের ঘুম",
    },
  };

  const getText = (key: keyof typeof texts.english): string => {
    return (
      texts[currentLanguage as keyof typeof texts]?.[key] ||
      texts.english[key]
    );
  };

  const getVitalName = (vitalId: string): string => {
    const vitalNameMap: { [key: string]: keyof typeof texts.english } = {
      heartRate: "heartRate",
      bloodPressure: "bloodPressure",
      temperature: "bodyTemperature",
      oxygenSaturation: "oxygenSaturation",
      glucose: "bloodGlucose",
      weight: "weight",
    };
    return getText(vitalNameMap[vitalId] || "heartRate");
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "critical":
        return getText("critical");
      case "warning":
        return getText("warning");
      default:
        return getText("normal");
    }
  };
  const [vitals, setVitals] = useState<VitalSign[]>([
    {
      id: "heartRate",
      name: "Heart Rate",
      value: 75,
      unit: "bpm",
      normalRange: "60-100",
      status: "normal",
      icon: "💓",
      color: "from-red-500 to-red-600",
      timestamp: new Date().toISOString(),
    },
    {
      id: "bloodPressure",
      name: "Blood Pressure",
      value: 128,
      unit: "mmHg",
      normalRange: "90-140",
      status: "warning",
      icon: "🩸",
      color: "from-blue-500 to-blue-600",
      timestamp: new Date().toISOString(),
    },
    {
      id: "temperature",
      name: "Body Temperature",
      value: 98.6,
      unit: "°F",
      normalRange: "97-99",
      status: "normal",
      icon: "🌡️",
      color: "from-orange-500 to-orange-600",
      timestamp: new Date().toISOString(),
    },
    {
      id: "oxygenSaturation",
      name: "Oxygen Saturation",
      value: 98,
      unit: "%",
      normalRange: "95-100",
      status: "normal",
      icon: "🫁",
      color: "from-green-500 to-green-600",
      timestamp: new Date().toISOString(),
    },
    {
      id: "glucose",
      name: "Blood Glucose",
      value: 95,
      unit: "mg/dL",
      normalRange: "70-100",
      status: "normal",
      icon: "🍯",
      color: "from-purple-500 to-purple-600",
      timestamp: new Date().toISOString(),
    },
    {
      id: "weight",
      name: "Weight",
      value: 68.5,
      unit: "kg",
      normalRange: "50-80",
      status: "normal",
      icon: "⚖️",
      color: "from-teal-500 to-teal-600",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Simulate real-time vital signs monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setVitals((prevVitals) =>
          prevVitals.map((vital) => {
            // Simulate slight variations in vital signs
            const variation = (Math.random() - 0.5) * 0.1;
            let newValue = vital.value + vital.value * variation;

            // Keep values within realistic ranges
            if (vital.id === "heartRate") {
              newValue = Math.max(50, Math.min(150, newValue));
            } else if (vital.id === "bloodPressure") {
              newValue = Math.max(80, Math.min(180, newValue));
            } else if (vital.id === "temperature") {
              newValue = Math.max(96, Math.min(104, newValue));
            } else if (vital.id === "oxygenSaturation") {
              newValue = Math.max(85, Math.min(100, newValue));
            } else if (vital.id === "glucose") {
              newValue = Math.max(60, Math.min(200, newValue));
            }

            // Determine status based on new value
            let status: "normal" | "warning" | "critical" = "normal";
            if (vital.id === "heartRate") {
              if (newValue < 60 || newValue > 100) status = "warning";
              if (newValue < 50 || newValue > 120) status = "critical";
            } else if (vital.id === "bloodPressure") {
              if (newValue < 90 || newValue > 140) status = "warning";
              if (newValue < 80 || newValue > 160) status = "critical";
            } else if (vital.id === "oxygenSaturation") {
              if (newValue < 95) status = "warning";
              if (newValue < 90) status = "critical";
            }

            return {
              ...vital,
              value: Math.round(newValue * 10) / 10,
              status,
              timestamp: new Date().toISOString(),
            };
          }),
        );
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return "🚨";
      case "warning":
        return "⚠️";
      default:
        return "✅";
    }
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">📊</span>
              {getText("remotePatientMonitoring")}
            </h2>
            <p className="text-gray-600 mt-1">{getText("realtimeVitalSigns")}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isMonitoring
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isMonitoring ? `🟢 ${getText("liveMonitoring")}` : `⏸️ ${getText("monitoringPaused")}`}
            </div>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                isMonitoring
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              }`}
            >
              {isMonitoring ? getText("stopMonitoring") : getText("startMonitoring")}
            </button>
          </div>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vitals.map((vital) => (
          <div
            key={vital.id}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${vital.color} rounded-xl flex items-center justify-center`}
              >
                <span className="text-white text-2xl">{vital.icon}</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}
              >
                {getStatusIcon(vital.status)} {getStatusText(vital.status)}
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {getVitalName(vital.id)}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-800">
                  {vital.value}
                </span>
                <span className="text-gray-600">{vital.unit}</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>{getText("normalRange")}: {vital.normalRange}</span>
                <span className="text-xs">
                  {new Date(vital.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Mini trend indicator */}
            <div className="mt-3 h-8 bg-gray-100 rounded-lg flex items-center px-2">
              <div
                className={`h-1 bg-gradient-to-r ${vital.color} rounded-full`}
                style={{
                  width: `${Math.min((vital.value / 150) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Alerts */}
      {vitals.some((v) => v.status === "critical") && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                {getText("criticalAlert")}
              </h3>
              <p className="text-red-700">
                {getText("criticalAlertMessage")}
              </p>
              <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                {getText("contactEmergency")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Trends */}
      <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-3">📈</span>
          {getText("healthTrends")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-green-600 font-semibold">{getText("stableVitals")}</div>
            <div className="text-2xl font-bold text-green-800">92%</div>
            <div className="text-sm text-green-600">{getText("ofReadingsNormal")}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-600 font-semibold">
              {getText("averageHeartRate")}
            </div>
            <div className="text-2xl font-bold text-blue-800">74 bpm</div>
            <div className="text-sm text-blue-600">{getText("withinNormalRange")}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-purple-600 font-semibold">{getText("sleepQuality")}</div>
            <div className="text-2xl font-bold text-purple-800">8.2 hrs</div>
            <div className="text-sm text-purple-600">{getText("goodQualitySleep")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
