import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  consultationType: "video" | "chat" | "both";
  availableDoctors: number;
  averageWaitTime: string;
  isPrivacySensitive?: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  experience: string;
  rating: number;
  available: boolean;
  nextSlot: string;
  language: string[];
}

interface ConsultationBookingProps {
  onBookConsultation?: (booking: any) => void;
  className?: string;
}

export default function ConsultationBooking({
  onBookConsultation,
  className = "",
}: ConsultationBookingProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [consultationType, setConsultationType] = useState<"video" | "chat">(
    "video",
  );
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [step, setStep] = useState<
    "specialty" | "type" | "doctor" | "time" | "confirm"
  >("specialty");

  const { currentLanguage } = useLanguage();

  const consultationTexts = {
    english: {
      header: "Multi-Specialty Consultation",
      subHeader: "Choose video or chat consultation based on your comfort",
      steps: [
        "Select Medical Specialty",
        "Choose Consultation Type",
        "Select Doctor",
        "Pick Time Slot",
        "Confirm Booking"
      ],
      confirmBooking: "Confirm Your Booking",
      specialty: "Specialty",
      consultationType: "Consultation Type",
      doctor: "Doctor",
      time: "Time",
      confirm: "Confirm Booking",
      back: "Back",
      videoConsultation: "Video Consultation",
      chatConsultation: "Chat Consultation",
      faceToFace: "Face-to-face consultation with doctor",
      textBased: "Text-based private consultation",
      personalInteraction: "✓ Personal interaction",
      visualExamination: "✓ Visual examination",
      realTimeDiagnosis: "✓ Real-time diagnosis",
      completePrivacy: "✓ Complete privacy",
      writtenRecords: "✓ Written records",
      comfortableSensitiveTopics: "✓ Comfortable for sensitive topics",
      sensitiveConsultations: "✓ Recommended for sensitive consultations",
      privacyNoticeHeader: "Privacy Notice",
      privacyNoticeBody: "This specialty involves sensitive topics. Chat consultation provides complete privacy and may be more comfortable for discussing personal health matters.",
      availableSlots: "Available slots for today",
      availableDoctors: "Available Doctors for",
      videoCall: "📹 Video Call",
      chat: "💬 Chat",
      nextSlot: "Next slot"
    },
    hindi: {
      header: "मल्टी-स्पेशल्टी परामर्श",
      subHeader: "अपने आराम के अनुसार वीडियो या चैट परामर्श चुनें",
      steps: [
        "मेडिकल स्पेशलिटी चुनें",
        "परामर्श प्रकार चुनें",
        "डॉक्टर चुनें",
        "समय स्लॉट चुनें",
        "बुकिंग की पुष्टि करें"
      ],
      confirmBooking: "अपनी बुकिंग की पुष्टि करें",
      specialty: "स्पेशलिटी",
      consultationType: "परामर्श प्रकार",
      doctor: "डॉक्टर",
      time: "समय",
      confirm: "बुकिंग की पुष्टि करें",
      back: "वापस",
      videoConsultation: "वीडियो परामर्श",
      chatConsultation: "चैट परामर्श",
      faceToFace: "डॉक्टर के साथ आमने-सामने परामर्श",
      textBased: "टेक्स्ट-आधारित निजी परामर्श",
      personalInteraction: "✓ व्यक्तिगत संपर्क",
      visualExamination: "✓ दृश्य परीक्षा",
      realTimeDiagnosis: "✓ वास्तविक समय निदान",
      completePrivacy: "✓ पूर्ण गोपनीयता",
      writtenRecords: "✓ लिखित रिकॉर्ड",
      comfortableSensitiveTopics: "✓ संवेदनशील विषयों के लिए आरामदायक",
      sensitiveConsultations: "✓ संवेदनशील परामर्श के लिए अनुशंसित",
      privacyNoticeHeader: "गोपनीयता सूचना",
      privacyNoticeBody: "यह विशेषता संवेदनशील विषयों को शामिल करती है। चैट परामर्श पूरी गोपनीयता प्रदान करता है और व्यक्तिगत स्वास्थ्य मामलों पर चर्चा करने के लिए अधिक आरामदायक हो सकता है।",
      availableSlots: "आज के लिए उपलब्ध स्लॉट",
      availableDoctors: "के लिए उपलब्ध डॉक्टर",
      videoCall: "📹 वीडियो कॉल",
      chat: "💬 चैट",
      nextSlot: "अगला स्लॉट"
    },
    tamil: {
      header: "பல சிறப்பு ஆலோசனை",
      subHeader: "உங்கள் வசதிக்கேற்ப வீடியோ அல்லது சொட்சேப் ஆலோசனை தேர்ந்தெடுக்கவும்",
      steps: [
        "மருத்துவ சிறப்பு தேர்ந்தெடுக்கவும்",
        "ஆலோசனை வகையை தேர்ந்தெடுக்கவும்",
        "மருத்துவரை தேர்ந்தெடுக்கவும்",
        "சமயம் இடங்களை தேர்ந்தெடுக்கவும்",
        "பதிவு உறுதிசெய்க",
      ],
      confirmBooking: "உங்கள் பதிவை உறுதிசெய்க",
      specialty: "சிறப்பு",
      consultationType: "ஆலோசனை வகை",
      doctor: "மருத்துவர்",
      time: "நேரம்",
      confirm: "பதிவு உறுதிசெய்க",
      back: "மீண்டும்",
      videoConsultation: "வீடியோ ஆலோசனை",
      chatConsultation: "சொட்சேப் ஆலோசனை",
      faceToFace: "மருத்துவருடன் நேரடி ஆலோசனை",
      textBased: "சொட்சேப் அடிப்படையிலான தனிப்பட்ட ஆலோசனை",
      personalInteraction: "✓ தனிப்பட்ட தொடர்பு",
      visualExamination: "✓ காட்சி பரிசோதனை",
      realTimeDiagnosis: "✓ நேரடி மருத்துவம்",
      completePrivacy: "✓ முழு தனிமை",
      writtenRecords: "✓ எழுதப்பட்ட பதிவுகள்",
      comfortableSensitiveTopics: "✓ உணர்ச்சிமிக்க பொருட்களுக்கு வசதியானது",
      sensitiveConsultations: "✓ உணர்ச்சிமிக்க ஆலோசனைகளுக்கு பரிந்துரைக்கப்படுகிறது",
      privacyNoticeHeader: "தனிமை அறிவிப்பு",
      privacyNoticeBody: "இந்த சிறப்பு உணர்ச்சிமிக்க பொருட்களை உள்ளடக்கியது. சொட்சேப் ஆலோசனை முழு தனிமையை வழங்குகிறது மற்றும் தனிப்பட்ட மருத்துவ விஷயங்களைப் பற்றி பேசுவதற்கு அதிக வசதியாக இருக்கலாம்.",
      availableSlots: "இன்றையக்கு கிடைக்கும் இடங்கள்",
      availableDoctors: "கிடைக்கும் மருத்துவர்கள்",
      videoCall: "📹 வீடியோ அழைப்பு",
      chat: "💬 சொட்சேப்",
      nextSlot: "பின்னர் இடம்"
    },
    telugu: {
      header: "మల్టీ-స్పెషల్టీ కన్సల్టేషన్",
      subHeader: "మీ సౌకర్యం ప్రకారం వీడియో లేదా చాట్ కన్సల్టేషన్ ఎంచుకోండి",
      steps: [
        "మెడికల్ స్పెషల్టీ ఎంచుకోండి",
        "కన్సల్టేషన్ రకం ఎంచుకోండి",
        "డాక్టర్‌ని ఎంచుకోండి",
        "సమయ స్లాట్‌ని ఎంచుకోండి",
        "బుకింగ్‌ను ధృవీకరించండి",
      ],
      confirmBooking: "మీ బుకింగ్‌ను ధృవీకరించండి",
      specialty: "స్పెషల్టీ",
      consultationType: "కన్సల్టేషన్ రకం",
      doctor: "డాక్టర్",
      time: "సమయం",
      confirm: "బుకింగ్‌ను ధృవీకరించండి",
      back: "తిరిగి",
      videoConsultation: "వీడియో కన్సల్టేషన్",
      chatConsultation: "చాట్ కన్సల్టేషన్",
      faceToFace: "డాక్టర్‌తో ముఖాముఖి కన్సల్టేషన్",
      textBased: "పాఠంపై ఆధారిత వ్యక్తిగత కన్సల్టేషన్",
      personalInteraction: "✓ ప్రత్యక్ష పరిమళం",
      visualExamination: "✓ కాంచిక పరీక్ష",
      realTimeDiagnosis: "✓ ప్రత్యక్ష డయాగ్నోసిస్",
      completePrivacy: "✓ పూర్తి గోప్యత",
      writtenRecords: "✓ వ్రాతపూర్వక రికార్డులు",
      comfortableSensitiveTopics: "✓ అన్వేషణ చూసే అంశాలకు సౌకర్యం",
      sensitiveConsultations: "✓ అన్వేషణ చూసే కన్సల్టేషన్లకు సిఫార్సు చేయబడింది",
      privacyNoticeHeader: "గోప్యత నోటీసు",
      privacyNoticeBody: "ఈ స్పెషల్టీ అన్వేషణ చూసే అంశాలను కలిగి ఉంటుంది. చాట్ కన్సల్టేషన్ పూర్తి గోప్యతను అందిస్తుంది మరియు వ్యక్తిగత వైద్య విషయాల గురించి చర్చించడం మరింత సౌకర్యంగా ఉంటుంది.",
      availableSlots: "ఈ రోజు అందుబాటులో ఉన్న స్లాట్స్",
      availableDoctors: "కోసం అందుబాటులో ఉన్న డాక్టర్లు",
      videoCall: "📹 వీడియో కాల్",
      chat: "💬 చాట్",
      nextSlot: "తర్వాత స్లాట్"
    },
    bengali: {
      header: "মাল্টি-স্পেশাল্টি কনসাল্টেশন",
      subHeader: "আপনার সান্ত্বনা অনুযায়ী ভিডিও বা চ্যাট কনসাল্টেশন নির্বাচন করুন",
      steps: [
        "মেডিকেল স্পেশাল্টি নির্বাচন করুন",
        "কনসাল্টেশন প্রকার নির্বাচন করুন",
        "ডাক্তার নির্বাচন করুন",
        "সময় স্লট নির্বাচন করুন",
        "বুকিং নিশ্চিত করুন"
      ],
      confirmBooking: "আপনার বুকিং নিশ্চিত করুন",
      specialty: "স্পেশাল্টি",
      consultationType: "কনসাল্টেশন প্রকার",
      doctor: "ডাক্তার",
      time: "সময়",
      confirm: "বুকিং নিশ্চিত করুন",
      back: "ফিরে",
      videoConsultation: "ভিডিও কনসাল্টেশন",
      chatConsultation: "চ্যাট কনসাল্টেশন",
      faceToFace: "ডাক্তার সঙ্গে মুখোমুখি পরামর্শ",
      textBased: "পাঠ্য ভিত্তিক ব্যক্তিগত পরামর্শ",
      personalInteraction: "✓ ব্যক্তিগত মিথস্ক্রিয়া",
      visualExamination: "✓ দৃশ্যমান পরীক্ষা",
      realTimeDiagnosis: "✓ বাস্তব সময় নির্ণয়",
      completePrivacy: "✓ সম্পূর্ণ গোপনীয়তা",
      writtenRecords: "✓ লিখিত রেকর্ড",
      comfortableSensitiveTopics: "✓ সংবেদনশীল বিষয়গুলির জন্য আরামদায়ক",
      sensitiveConsultations: "✓ সংবেদনশীল পরামর্শের জন্য সুপারিশ করা হয়েছে",
      privacyNoticeHeader: "গোপনীয়তা নোটিশ",
      privacyNoticeBody: "এই বিশেষত্ব সংবেদনশীল বিষয়গুলিকে অন্তর্ভুক্ত করে৷ চ্যাট পরামর্শ সম্পূর্ণ গোপনীয়তা প্রদান করে এবং ব্যক্তিগত স্বাস্থ্য বিষয়গুলি আলোচনা করার জন্য আরও আরামদায়ক হতে পারে৷",
      availableSlots: "আজকের জন্য উপলভ্য স্লট",
      availableDoctors: "জন্য উপলভ্য ডাক্তার",
      videoCall: "📹 ভিডিও কল",
      chat: "💬 চ্যাট",
      nextSlot: "পরবর্তী স্লট"
    }
  };

  const getConsultationText = (key: keyof typeof consultationTexts.english): string => {
    return (
      consultationTexts[currentLanguage as keyof typeof consultationTexts]?.[key] ||
      consultationTexts.english[key]
    );
  };

  const specialties: Specialty[] = [
    {
      id: "general",
      name: "General Medicine",
      icon: "🩺",
      description: "General health concerns, routine checkups",
      consultationType: "both",
      availableDoctors: 12,
      averageWaitTime: "5-10 mins",
    },
    {
      id: "gynecology",
      name: "Gynecology",
      icon: "🤱",
      description: "Women's health, pregnancy care",
      consultationType: "both",
      availableDoctors: 8,
      averageWaitTime: "10-15 mins",
      isPrivacySensitive: true,
    },
    {
      id: "sexology",
      name: "Sexual Health",
      icon: "💕",
      description: "Sexual health concerns, reproductive issues",
      consultationType: "both",
      availableDoctors: 5,
      averageWaitTime: "15-20 mins",
      isPrivacySensitive: true,
    },
    {
      id: "psychiatry",
      name: "Mental Health",
      icon: "🧠",
      description: "Mental health, counseling, therapy",
      consultationType: "both",
      availableDoctors: 6,
      averageWaitTime: "20-30 mins",
      isPrivacySensitive: true,
    },
    {
      id: "dermatology",
      name: "Dermatology",
      icon: "🧴",
      description: "Skin conditions, hair, nail problems",
      consultationType: "both",
      availableDoctors: 4,
      averageWaitTime: "15-25 mins",
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      icon: "👶",
      description: "Child health, infant care",
      consultationType: "both",
      availableDoctors: 7,
      averageWaitTime: "10-15 mins",
    },
    {
      id: "cardiology",
      name: "Cardiology",
      icon: "❤️",
      description: "Heart conditions, blood pressure",
      consultationType: "both",
      availableDoctors: 3,
      averageWaitTime: "25-35 mins",
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      icon: "🦴",
      description: "Bone, joint, muscle problems",
      consultationType: "both",
      availableDoctors: 5,
      averageWaitTime: "20-30 mins",
    },
  ];

  const doctors: Doctor[] = [
    {
      id: "dr1",
      name: "Dr. Priya Sharma",
      specialtyId: "gynecology",
      experience: "12 years",
      rating: 4.8,
      available: true,
      nextSlot: "10:30 AM",
      language: ["English", "Hindi", "Tamil"],
    },
    {
      id: "dr2",
      name: "Dr. Rajesh Kumar",
      specialtyId: "general",
      experience: "8 years",
      rating: 4.6,
      available: true,
      nextSlot: "11:00 AM",
      language: ["English", "Hindi", "Telugu"],
    },
    {
      id: "dr3",
      name: "Dr. Meera Reddy",
      specialtyId: "sexology",
      experience: "15 years",
      rating: 4.9,
      available: true,
      nextSlot: "2:00 PM",
      language: ["English", "Telugu", "Kannada"],
    },
  ];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];

  const selectedSpecialtyData = specialties.find(
    (s) => s.id === selectedSpecialty,
  );
  const availableDoctors = doctors.filter(
    (d) => d.specialtyId === selectedSpecialty && d.available,
  );

  const handleBooking = () => {
    const booking = {
      specialty: selectedSpecialtyData,
      consultationType,
      doctor: doctors.find((d) => d.id === selectedDoctor),
      timeSlot: selectedTimeSlot,
      bookingId:
        "BOOK-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: "confirmed",
    };

    if (onBookConsultation) {
      onBookConsultation(booking);
    }

    // Reset form
    setStep("specialty");
    setSelectedSpecialty("");
    setSelectedDoctor("");
    setSelectedTimeSlot("");
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">👨‍⚕️</span>
          {getConsultationText("header")}
        </h2>
        <p className="text-gray-600 mt-1">
          {getConsultationText("subHeader")}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {["specialty", "type", "doctor", "time", "confirm"].map(
            (stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName
                      ? "bg-blue-600 text-white"
                      : [
                            "specialty",
                            "type",
                            "doctor",
                            "time",
                            "confirm",
                          ].indexOf(step) > index
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      [
                        "specialty",
                        "type",
                        "doctor",
                        "time",
                        "confirm",
                      ].indexOf(step) > index
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ),
          )}
        </div>
        <div className="text-center text-sm text-gray-600 font-medium">
          {step === "specialty" && getConsultationText("steps")[0]}
          {step === "type" && getConsultationText("steps")[1]}
          {step === "doctor" && getConsultationText("steps")[2]}
          {step === "time" && getConsultationText("steps")[3]}
          {step === "confirm" && getConsultationText("steps")[4]}
        </div>
      </div>

      {/* Step 1: Select Specialty */}
      {step === "specialty" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => {
                setSelectedSpecialty(specialty.id);
                setStep("type");
              }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">{specialty.icon}</span>
                </div>
                {specialty.isPrivacySensitive && (
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    🔒 Private
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {specialty.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {specialty.description}
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{specialty.availableDoctors} doctors</span>
                <span>{specialty.averageWaitTime}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Select Consultation Type */}
      {step === "type" && selectedSpecialtyData && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedSpecialtyData.name} Consultation
            </h3>
            <p className="text-gray-600">
              {getConsultationText("subHeader")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setConsultationType("video");
                setStep("doctor");
              }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl">📹</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {getConsultationText("videoConsultation")}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {getConsultationText("faceToFace")}
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>{getConsultationText("personalInteraction")}</div>
                  <div>{getConsultationText("visualExamination")}</div>
                  <div>{getConsultationText("realTimeDiagnosis")}</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setConsultationType("chat");
                setStep("doctor");
              }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl">💬</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {getConsultationText("chatConsultation")}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {getConsultationText("textBased")}
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>{getConsultationText("completePrivacy")}</div>
                  <div>{getConsultationText("writtenRecords")}</div>
                  <div>{getConsultationText("comfortableSensitiveTopics")}</div>
                  {selectedSpecialtyData.isPrivacySensitive && (
                    <div className="text-purple-600">
                      {getConsultationText("sensitiveConsultations")}
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {selectedSpecialtyData.isPrivacySensitive && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-purple-600 text-lg mr-2">🔒</span>
                <div>
                  <h5 className="font-medium text-purple-800">
                    {getConsultationText("privacyNoticeHeader")}
                  </h5>
                  <p className="text-sm text-purple-700">
                    {getConsultationText("privacyNoticeBody")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Select Doctor */}
      {step === "doctor" && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setStep("type")}
              className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
            >
              ← {getConsultationText("back")} to consultation type
            </button>
            <h3 className="text-xl font-semibold text-gray-800">
              {getConsultationText("availableDoctors")} {consultationType === "video" ? getConsultationText("videoConsultation") : getConsultationText("chatConsultation")}
            </h3>
          </div>

          <div className="grid gap-4">
            {availableDoctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => {
                  setSelectedDoctor(doctor.id);
                  setStep("time");
                }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl">👨‍⚕️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {doctor.name}
                        </h4>
                        <p className="text-gray-600">
                          {selectedSpecialtyData?.name} Specialist
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.experience} experience
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm font-medium ml-1">
                            {doctor.rating}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {getConsultationText("nextSlot")}: {doctor.nextSlot}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {doctor.language.map((lang) => (
                        <span
                          key={lang}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Select Time */}
      {step === "time" && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setStep("doctor")}
              className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
            >
              ← {getConsultationText("back")} to doctor selection
            </button>
            <h3 className="text-xl font-semibold text-gray-800">
              {getConsultationText("steps")[3]}
            </h3>
            <p className="text-gray-600">{getConsultationText("availableSlots")}</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setSelectedTimeSlot(slot);
                  setStep("confirm");
                }}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow border border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="text-sm font-medium text-gray-800">{slot}</div>
                <div className="text-xs text-green-600">Available</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Confirm Booking */}
      {step === "confirm" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              {getConsultationText("confirmBooking")}
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{getConsultationText("specialty")}:</span>
                <span className="font-medium">
                  {selectedSpecialtyData?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{getConsultationText("consultationType")}:</span>
                <span className="font-medium flex items-center">
                  {consultationType === "video" ? getConsultationText("videoCall") : getConsultationText("chat")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{getConsultationText("doctor")}:</span>
                <span className="font-medium">
                  {doctors.find((d) => d.id === selectedDoctor)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{getConsultationText("time")}:</span>
                <span className="font-medium">{selectedTimeSlot}</span>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => setStep("time")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
              >
                {getConsultationText("back")}
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg transition-all duration-300"
              >
                {getConsultationText("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
