import { useLanguage } from "../../contexts/LanguageContext";
import SimpleVoiceAssistant from "../SimpleVoiceAssistant";
import LanguageSelector from "../LanguageSelector";
import LanguageDebugger from "../LanguageDebugger";

interface PatientSpecificDashboardProps {
  user: {
    userType: "patient";
    name: string;
  };
}

export default function PatientSpecificDashboard({
  user,
}: PatientSpecificDashboardProps) {
  const { currentLanguage } = useLanguage();

  // Translation texts similar to other components
  const texts = {
    english: {
      welcomeBack: "Welcome back",
      healthCompanion: "How are you feeling today? Your health is our priority.",
      heartRate: "Heart Rate",
      bloodPressure: "Blood Pressure",
      nextAppointment: "Next Appointment",
      medications: "Medications",
      normal: "Normal",
      today3pm: "Today 3 PM",
      drSharma: "Dr. Sharma",
      dueToday: "Due today",
      aiSymptomChecker: "AI Symptom Checker",
      bookAppointment: "Book Appointment",
      emergency108: "Emergency 108",
      familyHealth: "Family Health",
      aiHealthInsights: "AI Health Insights",
      goodMorning: "Good morning! Your vitals look great today.",
      vitalsGreat: "Keep up the healthy lifestyle!",
      nextCheckup: "Remember your checkup next week",
    },
    hindi: {
      welcomeBack: "वापस स्वागत है",
      healthCompanion: "आज आप कैसा महसूस कर रहे हैं? आपका स्वास्थ्य हमारी प्राथमिकता है।",
      heartRate: "हृदय गति",
      bloodPressure: "रक्तचाप",
      nextAppointment: "अगली अपॉइंटमेंट",
      medications: "दवाइयां",
      normal: "सामान्य",
      today3pm: "आज दोपहर 3 बजे",
      drSharma: "डॉ. शर्मा",
      dueToday: "आज देय",
      aiSymptomChecker: "एआई लक्षण चेकर",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      emergency108: "आपातकाल 108",
      familyHealth: "पारिवारिक स्वास्थ्य",
      aiHealthInsights: "एआई स्वास्थ्य अंतर्दृष्टि",
      goodMorning: "सुप्रभात! आज आपके जीवन संकेतक बहुत अच्छे लग रहे हैं।",
      vitalsGreat: "स्वस्थ जीवनशैली बनाए रखें!",
      nextCheckup: "अगले सप्ताह अपनी जांच याद रखें",
    },
    tamil: {
      welcomeBack: "மீண்டும் வரவேற்கிறோம்",
      healthCompanion: "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்? உங்கள் ஆரோக்கியம் எங்கள் முன்னுரிமை.",
      heartRate: "இதய துடிப்பு",
      bloodPressure: "இரத்த அழுத்தம்",
      nextAppointment: "அடுத்த அப்பாயிண்ட்மெண்ட்",
      medications: "மருந்துகள்",
      normal: "சாதாரண",
      today3pm: "இன்று மதியம் 3 மணி",
      drSharma: "டாக்டர் சர்மா",
      dueToday: "இன்று செலுத்த வேண்டும்",
      aiSymptomChecker: "எஐ அறிகுறி சரிபார்ப்பு",
      bookAppointment: "அப்பாயிண்ட்மெண்ட் புக் செய்யுங்கள்",
      emergency108: "அவசர 108",
      familyHealth: "குடும்ப ஆரோக்கியம்",
      aiHealthInsights: "எஐ ஆரோக்கிய நுண்ணறிவு",
      goodMorning: "காலை வணக்கம்! இன்று உங்கள் உயிர்ச்சக்தி அளவுகள் சிறப்பாக உள்ளன.",
      vitalsGreat: "ஆரோக்கியமான வாழ்க்கை முறையைத் தொடருங்கள்!",
      nextCheckup: "அடுத்த வாரம் உங்கள் பரிசோதனையை நினைவில் கொள்ளுங்கள்",
    },
    telugu: {
      welcomeBack: "తిరిగి స్వాగతం",
      healthCompanion: "ఈరోజు మీరు ఎలా అనిపిస్తున్నారు? మీ ఆరోగ్యం మా ప్రాధాన్యత.",
      heartRate: "హృదయ స్పందన",
      bloodPressure: "రక్తపోటు",
      nextAppointment: "తదుపరి అపాయింట్‌మెంట్",
      medications: "మందులు",
      normal: "సాధారణ",
      today3pm: "ఈరోజు మధ్యాహ్నం 3 గంటలు",
      drSharma: "డాక్టర్ శర్మ",
      dueToday: "ఈరోజు చెల్లించాల్సినది",
      aiSymptomChecker: "ఎఐ లక్షణ తనిఖీ",
      bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
      emergency108: "అత్యవసర 108",
      familyHealth: "కుటుంబ ఆరోగ్యం",
      aiHealthInsights: "ఎఐ ఆరోగ్య అంతర్దృష్టులు",
      goodMorning: "శుభోదయం! ఈరోజు మీ జీవనోపాధి సంకేతాలు గొప్పగా ఉన్నాయి.",
      vitalsGreat: "ఆరోగ్యకరమైన జీవనశైలిని కొనసాగించండి!",
      nextCheckup: "వచ్చే వారం మీ తనిఖీని గుర్తుంచుకోండి",
    },
    bengali: {
      welcomeBack: "ফিরে আসার জন্য স্বাগতম",
      healthCompanion: "আজ আপনি কেমন বোধ করছেন? আপনার স্বাস্থ্য আমাদের অগ্রাধিকার।",
      heartRate: "হৃদস্পন্দন",
      bloodPressure: "রক্তচাপ",
      nextAppointment: "পরবর্তী অ্যাপয়েন্টমেন্ট",
      medications: "ওষুধ",
      normal: "স্বাভাবিক",
      today3pm: "আজ বিকাল ৩টা",
      drSharma: "ডাঃ শর্মা",
      dueToday: "আজ দেয়",
      aiSymptomChecker: "এআই লক্ষণ পরীক্ষক",
      bookAppointment: "অ্যাপয়েন্টমেন্ট বুক করুন",
      emergency108: "জরুরি ১০৮",
      familyHealth: "পারিবারিক স্বাস্থ্য",
      aiHealthInsights: "এআই স্বাস্থ্য অন্তর্দৃষ্টি",
      goodMorning: "সুপ্রভাত! আজ আপনার জীবনীশক্তি চমৎকার দেখাচ্ছে।",
      vitalsGreat: "স্বাস্থ্যকর জীবনযাত্রা বজায় রাখুন!",
      nextCheckup: "পরের সপ্তাহে আপনার চেকআপের কথা মনে রাখবেন",
    },
  };

  const getText = (key: keyof typeof texts.english): string => {
    return (
      texts[currentLanguage as keyof typeof texts]?.[key] ||
      texts.english[key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Language Debug Panel */}
      <LanguageDebugger />

      {/* Language Selector */}
      <div className="flex justify-end">
        <LanguageSelector />
      </div>

      {/* Patient Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold">
          {getText("welcomeBack")}, {user.name}
        </h2>
        <p className="text-blue-100">{getText("healthCompanion")}</p>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{getText("heartRate")}</p>
              <p className="text-2xl font-bold text-gray-800">72 BPM</p>
              <p className="text-green-600 text-sm">{getText("normal")}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❤️</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{getText("bloodPressure")}</p>
              <p className="text-2xl font-bold text-gray-800">120/80</p>
              <p className="text-green-600 text-sm">{getText("normal")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{getText("nextAppointment")}</p>
              <p className="text-lg font-bold text-gray-800">{getText("today3pm")}</p>
              <p className="text-blue-600 text-sm">{getText("drSharma")}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{getText("medications")}</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-orange-600 text-sm">{getText("dueToday")}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">🤖</span>
          <span className="font-semibold">{getText("aiSymptomChecker")}</span>
        </button>

        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">📅</span>
          <span className="font-semibold">{getText("bookAppointment")}</span>
        </button>

        <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">🚨</span>
          <span className="font-semibold">{getText("emergency108")}</span>
        </button>

        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">👨‍👩‍👧‍👦</span>
          <span className="font-semibold">{getText("familyHealth")}</span>
        </button>
      </div>

      {/* AI Health Insights for Patients */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {getText("aiHealthInsights")}
        </h3>
        <div className="space-y-3">
          <p className="text-gray-700">{getText("goodMorning")}</p>
          <p className="text-gray-600">{getText("vitalsGreat")}</p>
          <p className="text-blue-600">💊 {getText("medications")}</p>
          <p className="text-green-600">⏰ {getText("nextCheckup")}</p>
        </div>
      </div>

      {/* AI Voice Assistant */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <SimpleVoiceAssistant
          userName={user.name}
          onCommand={(command) => {
            console.log("Voice command:", command);
            // Handle navigation based on voice commands
          }}
        />
      </div>
    </div>
  );
}
