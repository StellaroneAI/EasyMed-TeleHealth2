import { useLanguage } from "../contexts/LanguageContext";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
  userType: "patient" | "asha" | "doctor" | "admin";
}

interface MenuItem {
  id: string;
  icon: string;
  labelKey: string;
  gradient: string;
  bgGradient: string;
  userTypes: ("patient" | "asha" | "doctor" | "admin")[];
}

export default function SidebarMenu({
  isOpen,
  onClose,
  onNavigate,
  currentSection,
  userType,
}: SidebarMenuProps) {
  const { currentLanguage } = useLanguage();

  // Menu items with translations for all languages
  const menuTexts = {
    english: {
      dashboard: "Dashboard",
      aiChat: "AI Health Assistant",
      appointments: "Book Appointment",
      telemedicine: "Telemedicine",
      familyHealth: "Family Health",
      vitalsMonitoring: "Vitals Monitoring",
      healthRecords: "Health Records",
      education: "Health Education",
      ashaWorker: "ASHA Worker Hub",
      emergency: "Emergency Services",
      symptomChecker: "Symptom Checker",
      healthAnalytics: "Health Analytics",
      medicationManager: "Medication Manager",
      emergencySystem: "Emergency System",
      pwaFeatures: "PWA Features",
      iotDevices: "IoT Devices",
      geneticInsights: "Genetic Insights",
      wellnessCoaching: "Wellness Coaching",
    },
    hindi: {
      dashboard: "डैशबोर्ड",
      aiChat: "AI स्वास्थ्य सहायक",
      appointments: "अपॉइंटमेंट बुक करें",
      telemedicine: "टेलीमेडिसिन",
      familyHealth: "पारिवारिक स्वास्थ्य",
      vitalsMonitoring: "वाइटल मॉनिटरिंग",
      healthRecords: "स्वास्थ्य रिकॉर्ड",
      education: "स्वास्थ्य शिक्षा",
      ashaWorker: "आशा वर्कर हब",
      emergency: "आपातकालीन सेवाएं",
      symptomChecker: "लक्षण जांचकर्ता",
      healthAnalytics: "स्वास्थ्य विश्लेषण",
      medicationManager: "दवा प्रबंधक",
      emergencySystem: "आपातकालीन सिस्टम",
      pwaFeatures: "PWA सुविधाएं",
      iotDevices: "IoT डिवाइस",
      geneticInsights: "आनुवंशिक अंतर्दृष्टि",
      wellnessCoaching: "वेलनेस कोचिंग",
    },
    tamil: {
      dashboard: "டாஷ்போர்ட்",
      aiChat: "AI சுகாதார உதவியாளர்",
      appointments: "அப்பாயின்மென்ட் புக்",
      telemedicine: "டெலிமெடிசின்",
      familyHealth: "குடும்ப சுகாதாரம்",
      vitalsMonitoring: "உயிர்ச்சக்தி கண்காணிப்பு",
      healthRecords: "சுகாதார பதிவுகள்",
      education: "சுகாதார கல்வி",
      ashaWorker: "ஆசா தொழிலாளர் மையம்",
      emergency: "அவசர சேவைகள்",
      symptomChecker: "அறிகுறி சரிபார்ப்பு",
      healthAnalytics: "சுகாதார பகுப்பாய்வு",
      medicationManager: "மருந்து மேலாளர்",
      emergencySystem: "அவசர அமைப்பு",
      pwaFeatures: "PWA அம்சங்கள்",
      iotDevices: "IoT சாதனங்கள்",
      geneticInsights: "மரபணு நுண்ணறிவு",
      wellnessCoaching: "நல்வாழ்வு பயிற்சி",
    },
  };

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      icon: "🏠",
      labelKey: "dashboard",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "aiChat",
      icon: "🤖",
      labelKey: "aiChat",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "symptomChecker",
      icon: "🩺",
      labelKey: "symptomChecker",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "healthAnalytics",
      icon: "�",
      labelKey: "healthAnalytics",
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "medicationManager",
      icon: "💊",
      labelKey: "medicationManager",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "emergencySystem",
      icon: "🚨",
      labelKey: "emergencySystem",
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-50 to-rose-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "appointments",
      icon: "�📅",
      labelKey: "appointments",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "telemedicine",
      icon: "💻",
      labelKey: "telemedicine",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      userTypes: ["doctor", "admin"],
    },
    {
      id: "vitalsMonitoring",
      icon: "�",
      labelKey: "vitalsMonitoring",
      gradient: "from-teal-500 to-green-500",
      bgGradient: "from-teal-50 to-green-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "iotDevices",
      icon: "🌐",
      labelKey: "iotDevices",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "geneticInsights",
      icon: "🧬",
      labelKey: "geneticInsights",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "wellnessCoaching",
      icon: "🎯",
      labelKey: "wellnessCoaching",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50",
      userTypes: ["patient", "asha", "admin"],
    },
    {
      id: "pwaFeatures",
      icon: "📱",
      labelKey: "pwaFeatures",
      gradient: "from-slate-500 to-gray-500",
      bgGradient: "from-slate-50 to-gray-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "familyHealth",
      icon: "👨‍👩‍👧‍👦",
      labelKey: "familyHealth",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      userTypes: ["patient", "asha"],
    },
    {
      id: "healthRecords",
      icon: "📋",
      labelKey: "healthRecords",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50",
      userTypes: ["patient", "doctor", "admin"],
    },
    {
      id: "education",
      icon: "📚",
      labelKey: "education",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
    {
      id: "ashaWorker",
      icon: "👩‍⚕️",
      labelKey: "ashaWorker",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      userTypes: ["asha", "admin"],
    },
    {
      id: "emergency",
      icon: "🚑",
      labelKey: "emergency",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      userTypes: ["patient", "asha", "doctor", "admin"],
    },
  ];

  // Filter menu items based on user type
  const filteredMenuItems = menuItems.filter((item) =>
    item.userTypes.includes(userType),
  );

  const handleMenuItemClick = (itemId: string) => {
    onNavigate(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getUserTypeConfig = () => {
    const configs = {
      patient: {
        color: "from-blue-500 to-cyan-500",
        name: "Patient",
        icon: "👨‍👩‍👧‍👦",
      },
      asha: {
        color: "from-green-500 to-emerald-500",
        name: "ASHA Worker",
        icon: "👩‍⚕️",
      },
      doctor: {
        color: "from-purple-500 to-indigo-500",
        name: "Doctor",
        icon: "👨‍⚕️",
      },
      admin: {
        color: "from-orange-500 to-red-500",
        name: "Administrator",
        icon: "🏛️",
      },
    };
    return configs[userType];
  };

  const userConfig = getUserTypeConfig();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div
          className={`flex items-center ${!isOpen ? "justify-center" : "space-x-3"}`}
        >
          <div
            className={`w-10 h-10 bg-gradient-to-r ${userConfig.color} rounded-full flex items-center justify-center`}
          >
            <span className="text-white text-xl">🏥</span>
          </div>
          {isOpen && (
            <div>
              <h2 className="font-bold text-gray-800">EasyMed</h2>
              <p className="text-xs text-gray-600">{userConfig.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
              currentSection === item.id
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : "text-gray-700 hover:bg-white/70"
            } ${!isOpen ? "justify-center" : "space-x-3"}`}
            title={
              !isOpen
                ? menuTexts[currentLanguage as keyof typeof menuTexts]?.[
                    item.labelKey as keyof typeof menuTexts.english
                  ] ||
                  menuTexts.english[
                    item.labelKey as keyof typeof menuTexts.english
                  ]
                : undefined
            }
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && (
              <span className="font-medium text-sm">
                {menuTexts[currentLanguage as keyof typeof menuTexts]?.[
                  item.labelKey as keyof typeof menuTexts.english
                ] ||
                  menuTexts.english[
                    item.labelKey as keyof typeof menuTexts.english
                  ]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* User Profile Section */}
      {isOpen && (
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
            <div
              className={`w-8 h-8 bg-gradient-to-r ${userConfig.color} rounded-full flex items-center justify-center`}
            >
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">
                Rajesh Kumar
              </p>
              <p className="text-xs text-gray-600 truncate">
                {userConfig.name}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
