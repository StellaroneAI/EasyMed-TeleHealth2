import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface EducationContent {
  id: string;
  title: string;
  category:
    | "MATERNAL"
    | "CHILD"
    | "CHRONIC"
    | "MENTAL"
    | "NUTRITION"
    | "HYGIENE"
    | "SEX_EDUCATION"
    | "ELDER_CARE";
  type: "VIDEO" | "ARTICLE" | "AUDIO" | "INTERACTIVE";
  duration: number;
  language: string;
  isOfflineAvailable: boolean;
  description: string;
  viewCount: number;
  rating: number;
}

interface Vaccine {
  id: string;
  name: string;
  recommendedAge: string;
  description: string;
  isCompleted: boolean;
  scheduledDate?: string;
  completedDate?: string;
  nextDose?: string;
}

export default function PatientEducationLibrary() {
  const { currentLanguage } = useLanguage();
  const [educationContent, setEducationContent] = useState<EducationContent[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [immunizationData, setImmunizationData] = useState<Vaccine[]>([]);
  const [showImmunization, setShowImmunization] = useState(false);

  // Education Library translations
  const eduTexts = {
    english: {
      title: "📚 Patient Education Library",
      subtitle: "Comprehensive health education in your language",
      searchPlaceholder: "Search health topics...",
      categories: "Categories",
      all: "All Topics",
      maternal: "Maternal Health",
      child: "Child Health",
      chronic: "Chronic Diseases",
      mental: "Mental Health",
      nutrition: "Nutrition",
      hygiene: "Hygiene",
      sexEducation: "Sex Education",
      elderCare: "Elder Care",
      immunization: "Immunization Tracker",
      offlineContent: "Offline Content",
      featured: "Featured Content",
      popular: "Popular",
      recent: "Recently Added",
      video: "Video",
      article: "Article",
      audio: "Audio",
      interactive: "Interactive",
      minutes: "minutes",
      views: "views",
      rating: "Rating",
      download: "Download",
      play: "Play",
      read: "Read",
      listen: "Listen",
      start: "Start",
      completed: "Completed",
      pending: "Pending",
      overdue: "Overdue",
      scheduled: "Scheduled",
      nextDose: "Next Dose",
      vaccineSchedule: "Vaccine Schedule",
      childImmunization: "Childhood Immunization",
      adultImmunization: "Adult Immunization",
      travelVaccines: "Travel Vaccines",
      seasonalVaccines: "Seasonal Vaccines",
      noContent: "No content found",
      offlineAvailable: "Available offline",
      downloadForOffline: "Download for offline viewing",
      healthTips: "Daily Health Tips",
      diseasesPrevention: "Disease Prevention",
      emergencyFirstAid: "Emergency First Aid",
      womenHealth: "Women's Health",
      menHealth: "Men's Health",
      teenHealth: "Teen Health",
      geriatricCare: "Geriatric Care",
    },
    hindi: {
      title: "📚 रोगी शिक्षा पुस्तकालय",
      subtitle: "आपकी भाषा में व्यापक स्वास्थ्य शिक्षा",
      searchPlaceholder: "स्वास्थ्य विषयों की खोज करें...",
      categories: "श्रेणियां",
      all: "सभी विषय",
      maternal: "मातृ स्वास्थ्य",
      child: "बाल स्वास्थ्य",
      chronic: "पुरानी बीमारियां",
      mental: "मानसिक स्वास्थ्य",
      nutrition: "पोषण",
      hygiene: "स्वच्छता",
      sexEducation: "यौन शिक्षा",
      elderCare: "बुजुर्ग देखभाल",
      immunization: "टीकाकरण ट्रैकर",
      offlineContent: "ऑफलाइन सामग्री",
      featured: "फीचर्ड सामग्री",
      popular: "लोकप्रिय",
      recent: "हाल ही में जोड़ा गया",
      video: "वीडियो",
      article: "लेख",
      audio: "ऑडियो",
      interactive: "इंटरैक्टिव",
      minutes: "मिनट",
      views: "दृश्य",
      rating: "रेटिंग",
      download: "डाउनलोड",
      play: "चलाएं",
      read: "पढ़ें",
      listen: "सुनें",
      start: "शुरू करें",
      completed: "पूर्ण",
      pending: "लंबित",
      overdue: "अतिदेय",
      scheduled: "निर्धारित",
      nextDose: "अगली खुराक",
      vaccineSchedule: "वैक्सीन शेड्यूल",
      childImmunization: "बचपन का टीकाकरण",
      adultImmunization: "वयस्क टीकाकरण",
      travelVaccines: "यात्रा वैक्सीन",
      seasonalVaccines: "मौसमी वैक्सीन",
      noContent: "कोई सामग्री नहीं मिली",
      offlineAvailable: "ऑफलाइन उपलब्ध",
      downloadForOffline: "ऑफलाइन देखने के लिए डाउनलोड करें",
      healthTips: "दैनिक स्वास्थ्य सुझाव",
      diseasesPrevention: "रोग की रोकथाम",
      emergencyFirstAid: "आपातकालीन प्राथमिक चिकित्सा",
      womenHealth: "महिला स्वास्थ्य",
      menHealth: "पुरुष स्वास्थ्य",
      teenHealth: "किशोर स्वास्थ्य",
      geriatricCare: "वृद्धावस्था देखभाल",
    },
    tamil: {
      title: "📚 நோயாளி கல்வி நூலகம்",
      subtitle: "உங்கள் மொழியில் விரிவான சுகாதார கல்வி",
      searchPlaceholder: "சுகாதார தலைப்புகளைத் தேடுங்கள்...",
      categories: "வகைகள்",
      all: "அனைத்து தலைப்புகள்",
      maternal: "தாய்மை சுகாதாரம்",
      child: "குழந்தை சுகாதாரம்",
      chronic: "நாட்பட்ட நோய்கள்",
      mental: "மனநலம்",
      nutrition: "ஊட்டச்சத்து",
      hygiene: "சுகாதாரம்",
      sexEducation: "பாலியல் கல்வி",
      elderCare: "முதியோர் பராமரிப்பு",
      immunization: "தடுப்பூசி கண்காணிப்பு",
      offlineContent: "ஆஃப்லைன் உள்ளடக்கம்",
      featured: "சிறப்பு உள்ளடக்கம்",
      popular: "பிரபலமான",
      recent: "சமீபத்தில் சேர்க்கப்பட்டது",
      video: "வீடியோ",
      article: "கட்டுரை",
      audio: "ஆடியோ",
      interactive: "ஊடாடும்",
      minutes: "நிமிடங்கள்",
      views: "பார்வைகள்",
      rating: "மதிப்பீடு",
      download: "பதிவிறக்கம்",
      play: "இயக்கு",
      read: "படி",
      listen: "கேள்",
      start: "தொடங்கு",
      completed: "முடிந்தது",
      pending: "நிலுவையில்",
      overdue: "தாமதமான",
      scheduled: "திட்டமிடப்பட்ட",
      nextDose: "அடுத்த டோஸ்",
      vaccineSchedule: "தடுப்பூசி அட்டவணை",
      childImmunization: "குழந்தை தடுப்பூசி",
      adultImmunization: "வயது வந்தோர் தடுப்பூசி",
      travelVaccines: "பயண தடுப்பூசிகள்",
      seasonalVaccines: "பருவகால தடுப்பூசிகள்",
      noContent: "உள்ளடக்கம் இல்லை",
      offlineAvailable: "ஆஃப்லைனில் கிடைக்கிறது",
      downloadForOffline: "ஆஃப்லைன் பார்வைக்கு பதிவிறக்கம்",
      healthTips: "தினசரி சுகாதார குறிப்புகள்",
      diseasesPrevention: "நோய் தடுப்பு",
      emergencyFirstAid: "அவசர முதலுதவி",
      womenHealth: "பெண்கள் சுகாதாரம்",
      menHealth: "ஆண்கள் சுகாதாரம்",
      teenHealth: "இளம் பருவ சுகாதாரம்",
      geriatricCare: "வயதான பராமரிப்பு",
    },
  };

  const getEduText = (key: keyof typeof eduTexts.english): string => {
    return (
      eduTexts[currentLanguage as keyof typeof eduTexts]?.[key] ||
      eduTexts.english[key]
    );
  };

  // Mock education content
  const mockEducationContent: EducationContent[] = [
    {
      id: "edu1",
      title: "Prenatal Care Essentials",
      category: "MATERNAL",
      type: "VIDEO",
      duration: 15,
      language: "Tamil",
      isOfflineAvailable: true,
      description: "Complete guide to prenatal care during pregnancy",
      viewCount: 2543,
      rating: 4.8,
    },
    {
      id: "edu2",
      title: "Managing Diabetes Naturally",
      category: "CHRONIC",
      type: "ARTICLE",
      duration: 8,
      language: "Tamil",
      isOfflineAvailable: true,
      description: "Natural ways to manage diabetes through diet and lifestyle",
      viewCount: 1876,
      rating: 4.6,
    },
    {
      id: "edu3",
      title: "Mental Health Awareness",
      category: "MENTAL",
      type: "AUDIO",
      duration: 12,
      language: "Tamil",
      isOfflineAvailable: false,
      description: "Understanding mental health and seeking help",
      viewCount: 3421,
      rating: 4.9,
    },
    {
      id: "edu4",
      title: "Nutrition for Growing Children",
      category: "CHILD",
      type: "INTERACTIVE",
      duration: 20,
      language: "Tamil",
      isOfflineAvailable: true,
      description: "Interactive guide to child nutrition and healthy eating",
      viewCount: 1654,
      rating: 4.7,
    },
    {
      id: "edu5",
      title: "Hand Hygiene Techniques",
      category: "HYGIENE",
      type: "VIDEO",
      duration: 5,
      language: "Tamil",
      isOfflineAvailable: true,
      description: "Proper handwashing techniques to prevent infections",
      viewCount: 5432,
      rating: 4.5,
    },
  ];

  // Mock immunization data
  const mockImmunizationData: Vaccine[] = [
    {
      id: "vaccine1",
      name: "Hepatitis B",
      recommendedAge: "Birth",
      description: "Prevents hepatitis B infection",
      isCompleted: true,
      completedDate: "2024-01-15",
    },
    {
      id: "vaccine2",
      name: "DPT (Diphtheria, Pertussis, Tetanus)",
      recommendedAge: "6 weeks",
      description: "Prevents diphtheria, pertussis, and tetanus",
      isCompleted: true,
      completedDate: "2024-03-10",
    },
    {
      id: "vaccine3",
      name: "Polio (OPV)",
      recommendedAge: "6 weeks",
      description: "Prevents polio infection",
      isCompleted: false,
      scheduledDate: "2024-08-15",
      nextDose: "2024-08-15",
    },
    {
      id: "vaccine4",
      name: "MMR (Measles, Mumps, Rubella)",
      recommendedAge: "12 months",
      description: "Prevents measles, mumps, and rubella",
      isCompleted: false,
      scheduledDate: "2025-01-20",
    },
  ];

  useEffect(() => {
    setEducationContent(mockEducationContent);
    setImmunizationData(mockImmunizationData);
  }, []);

  const categories = [
    { key: "ALL", label: getEduText("all") },
    { key: "MATERNAL", label: getEduText("maternal") },
    { key: "CHILD", label: getEduText("child") },
    { key: "CHRONIC", label: getEduText("chronic") },
    { key: "MENTAL", label: getEduText("mental") },
    { key: "NUTRITION", label: getEduText("nutrition") },
    { key: "HYGIENE", label: getEduText("hygiene") },
    { key: "SEX_EDUCATION", label: getEduText("sexEducation") },
    { key: "ELDER_CARE", label: getEduText("elderCare") },
  ];

  const filteredContent = educationContent.filter((content) => {
    const matchesCategory =
      selectedCategory === "ALL" || content.category === selectedCategory;
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "🎥";
      case "ARTICLE":
        return "📄";
      case "AUDIO":
        return "🎧";
      case "INTERACTIVE":
        return "🎮";
      default:
        return "📚";
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case "VIDEO":
        return getEduText("play");
      case "ARTICLE":
        return getEduText("read");
      case "AUDIO":
        return getEduText("listen");
      case "INTERACTIVE":
        return getEduText("start");
      default:
        return getEduText("start");
    }
  };

  const getVaccineStatus = (vaccine: Vaccine) => {
    if (vaccine.isCompleted) return "completed";
    if (vaccine.scheduledDate) {
      const scheduled = new Date(vaccine.scheduledDate);
      const today = new Date();
      if (scheduled < today) return "overdue";
      return "scheduled";
    }
    return "pending";
  };

  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-xl">
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white text-2xl">📚</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {getEduText("title")}
            </h3>
            <p className="text-sm text-gray-600">{getEduText("subtitle")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowImmunization(!showImmunization)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold hover:scale-105 active:scale-95"
        >
          💉 {getEduText("immunization")}
        </button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getEduText("searchPlaceholder")}
            className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">{getEduText("categories")}</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedCategory === category.key
                  ? "bg-blue-600 text-white"
                  : "bg-white/50 text-gray-700 hover:bg-white/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Immunization Tracker */}
      {showImmunization && (
        <div className="mb-6 bg-white/50 p-4 rounded-lg border border-white/20">
          <h4 className="font-medium mb-3">{getEduText("vaccineSchedule")}</h4>
          <div className="space-y-3">
            {immunizationData.map((vaccine) => (
              <div
                key={vaccine.id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium truncate">{vaccine.name}</h5>
                  <p className="text-sm text-gray-600">{vaccine.description}</p>
                  <p className="text-xs text-gray-500">
                    Age: {vaccine.recommendedAge}
                  </p>
                  {vaccine.nextDose && (
                    <p className="text-xs text-blue-600">
                      {getEduText("nextDose")}:{" "}
                      {new Date(vaccine.nextDose).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getVaccineStatusColor(
                      getVaccineStatus(vaccine),
                    )}`}
                  >
                    {getEduText(getVaccineStatus(vaccine))}
                  </span>
                  {vaccine.isCompleted ? (
                    <div className="text-green-600">✅</div>
                  ) : (
                    <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all">
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-4">📚</div>
          <p className="text-gray-600">{getEduText("noContent")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-medium">{getEduText("featured")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredContent.map((content) => (
              <div
                key={content.id}
                className="bg-white/50 p-4 rounded-lg border border-white/20"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {getContentIcon(content.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium truncate">{content.title}</h5>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {content.description}
                    </p>

                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <span>
                        {getEduText(
                          content.type.toLowerCase() as keyof typeof eduTexts.english,
                        )}
                      </span>
                      <span>•</span>
                      <span>
                        {content.duration} {getEduText("minutes")}
                      </span>
                      <span>•</span>
                      <span>
                        {content.viewCount} {getEduText("views")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-xs">{content.rating}</span>
                        </div>
                        {content.isOfflineAvailable && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {getEduText("offlineAvailable")}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {content.isOfflineAvailable && (
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-all">
                            {getEduText("download")}
                          </button>
                        )}
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-all">
                          {getActionText(content.type)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offline Content Banner */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h4 className="font-medium text-green-800">
              {getEduText("offlineContent")}
            </h4>
            <p className="text-sm text-green-600">
              {getEduText("downloadForOffline")}
            </p>
          </div>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-all">
            View Offline
          </button>
        </div>
      </div>
    </section>
  );
}
