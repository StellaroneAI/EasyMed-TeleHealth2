import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  taken: { [date: string]: boolean[] };
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
}

interface DrugInteraction {
  severity: "mild" | "moderate" | "severe";
  description: string;
  medications: string[];
  recommendation: string;
}

interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  taken: boolean;
  skipped: boolean;
  timestamp: Date;
}

export default function MedicationManager() {
  const { currentLanguage, getText } = useLanguage();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [activeTab, setActiveTab] = useState("today");
  const [isLoading, setIsLoading] = useState(true);
  const [adherenceScore, setAdherenceScore] = useState(0);

  // Translation texts
  const texts = {
    english: {
      smartMedicationManager: "Smart Medication Manager",
      aiPoweredMedicationTracking: "AI-powered medication tracking and interaction checking",
      adherenceScore: "Adherence Score",
      excellent: "🟢 Excellent",
      good: "🟡 Good",
      needsImprovement: "🔴 Needs Improvement",
      today: "Today",
      allMedications: "All Medications",
      drugInteractions: "Drug Interactions",
      history: "History",
      loadingMedicationManager: "Loading Medication Manager",
      preparingMedicationSchedule: "Preparing your medication schedule and checking for interactions...",
      todaysMedicationSchedule: "Today's Medication Schedule",
      pastDue: "Past due",
      upcoming: "Upcoming",
      scheduled: "Scheduled",
      taken: "Taken",
      skip: "Skip",
      skipped: "Skipped",
      markAsTaken: "Mark as taken",
      medicationsTakenToday: "Medications Taken Today",
      totalDosesToday: "Total Doses Today",
      activeMedications: "Active Medications",
      prescribedBy: "Prescribed by",
      dosage: "Dosage",
      frequency: "Frequency",
      times: "Times",
      startDate: "Start Date",
      instructions: "Instructions",
      commonSideEffects: "Common Side Effects",
      viewFullDetails: "View Full Details",
      drugInteractionChecker: "Drug Interaction Checker",
      interaction: "Interaction",
      recommendation: "Recommendation",
      noDrugInteractionsFound: "No Drug Interactions Found",
      medicationsAppearSafe: "Your current medications appear to be safe to take together.",
      addNewMedication: "Add New Medication",
      checkInteractionsBeforeStarting: "Check for interactions before starting a new medication",
      enterMedicationName: "Enter medication name...",
      checkInteractions: "Check Interactions",
      medicationAdherenceHistory: "Medication Adherence History",
      last30DaysAdherence: "Last 30 Days Adherence",
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      hundredPercentAdherence: "100% adherence",
      seventyToNinetyNineAdherence: "70-99% adherence",
      belowSeventyAdherence: "Below 70% adherence",
      noMedications: "No medications",
      individualMedicationAdherence: "Individual Medication Adherence",
      dosesTaken: "doses taken",
      of: "of",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",
    },
    hindi: {
      smartMedicationManager: "स्मार्ट दवा प्रबंधक",
      aiPoweredMedicationTracking: "एआई-संचालित दवा ट्रैकिंग और इंटरैक्शन जांच",
      adherenceScore: "पालन स्कोर",
      excellent: "🟢 उत्कृष्ट",
      good: "🟡 अच्छा",
      needsImprovement: "🔴 सुधार की आवश्यकता",
      today: "आज",
      allMedications: "सभी दवाएं",
      drugInteractions: "दवा इंटरैक्शन",
      history: "इतिहास",
      loadingMedicationManager: "दवा प्रबंधक लोड हो रहा है",
      preparingMedicationSchedule: "आपका दवा शेड्यूल तैयार किया जा रहा है और इंटरैक्शन की जांच की जा रही है...",
      todaysMedicationSchedule: "आज का दवा शेड्यूल",
      pastDue: "समय बीत गया",
      upcoming: "आने वाला",
      scheduled: "निर्धारित",
      taken: "लिया गया",
      skip: "छोड़ें",
      skipped: "छोड़ा गया",
      markAsTaken: "लिया गया के रूप में चिह्नित करें",
      medicationsTakenToday: "आज ली गई दवाएं",
      totalDosesToday: "आज कुल डोज़",
      activeMedications: "सक्रिय दवाएं",
      prescribedBy: "द्वारा निर्धारित",
      dosage: "खुराक",
      frequency: "आवृत्ति",
      times: "समय",
      startDate: "प्रारंभ तिथि",
      instructions: "निर्देश",
      commonSideEffects: "सामान्य साइड इफेक्ट्स",
      viewFullDetails: "पूरा विवरण देखें",
      drugInteractionChecker: "दवा इंटरैक्शन चेकर",
      interaction: "इंटरैक्शन",
      recommendation: "सिफारिश",
      noDrugInteractionsFound: "कोई दवा इंटरैक्शन नहीं मिला",
      medicationsAppearSafe: "आपकी वर्तमान दवाएं एक साथ लेने के लिए सुरक्षित प्रतीत होती हैं।",
      addNewMedication: "नई दवा जोड़ें",
      checkInteractionsBeforeStarting: "नई दवा शुरू करने से पहले इंटरैक्शन की जांच करें",
      enterMedicationName: "दवा का नाम दर्ज करें...",
      checkInteractions: "इंटरैक्शन जांचें",
      medicationAdherenceHistory: "दवा पालन इतिहास",
      last30DaysAdherence: "पिछले 30 दिनों का पालन",
      sun: "रवि",
      mon: "सोम",
      tue: "मंगल",
      wed: "बुध",
      thu: "गुरु",
      fri: "शुक्र",
      sat: "शनि",
      hundredPercentAdherence: "100% पालन",
      seventyToNinetyNineAdherence: "70-99% पालन",
      belowSeventyAdherence: "70% से कम पालन",
      noMedications: "कोई दवा नहीं",
      individualMedicationAdherence: "व्यक्तिगत दवा पालन",
      dosesTaken: "डोज़ लिए गए",
      of: "में से",
      mild: "हल्का",
      moderate: "मध्यम",
      severe: "गंभीर",
    },
    tamil: {
      smartMedicationManager: "ஸ்மார்ட் மருந்து மேலாளர்",
      aiPoweredMedicationTracking: "AI-இயங்கும் மருந்து கண்காணிப்பு மற்றும் இடைவினை சரிபார்ப்பு",
      adherenceScore: "கடைபிடிப்பு மதிப்பெண்",
      excellent: "🟢 சிறந்த",
      good: "🟡 நல்ல",
      needsImprovement: "🔴 மேம்பாடு தேவை",
      today: "இன்று",
      allMedications: "அனைத்து மருந்துகள்",
      drugInteractions: "மருந்து இடைவினைகள்",
      history: "வரலாறு",
      loadingMedicationManager: "மருந்து மேலாளர் ஏற்றப்படுகிறது",
      preparingMedicationSchedule: "உங்கள் மருந்து அட்டவணை தயாரிக்கப்பட்டு இடைவினைகள் சரிபார்க்கப்படுகிறது...",
      todaysMedicationSchedule: "இன்றைய மருந்து அட்டவணை",
      pastDue: "கால அவகாசம் கடந்தது",
      upcoming: "வரவிருக்கும்",
      scheduled: "திட்டமிடப்பட்ட",
      taken: "எடுத்துக்கொள்ளப்பட்டது",
      skip: "தவிர்க்கவும்",
      skipped: "தவிர்க்கப்பட்டது",
      markAsTaken: "எடுத்துக்கொண்டதாக குறிக்கவும்",
      medicationsTakenToday: "இன்று எடுத்துக்கொண்ட மருந்துகள்",
      totalDosesToday: "இன்று மொத்த அளவுகள்",
      activeMedications: "செயலில் உள்ள மருந்துகள்",
      prescribedBy: "பரிந்துரைத்தவர்",
      dosage: "அளவு",
      frequency: "அதிர்வெண்",
      times: "நேரங்கள்",
      startDate: "தொடக்க தேதி",
      instructions: "அறிவுரைகள்",
      commonSideEffects: "பொதுவான பக்க விளைவுகள்",
      viewFullDetails: "முழு விவரங்களைப் பார்க்கவும்",
      drugInteractionChecker: "மருந்து இடைவினை சரிபார்ப்பாளர்",
      interaction: "இடைவினை",
      recommendation: "பரிந்துரை",
      noDrugInteractionsFound: "மருந்து இடைவினைகள் எதுவும் கண்டறியப்படவில்லை",
      medicationsAppearSafe: "உங்கள் தற்போதைய மருந்துகள் ஒன்றாக எடுத்துக்கொள்ள பாதுகாப்பானதாக தோன்றுகின்றன।",
      addNewMedication: "புதிய மருந்து சேர்க்கவும்",
      checkInteractionsBeforeStarting: "புதிய மருந்தைத் தொடங்குவதற்கு முன் இடைவினைகளைச் சரிபார்க்கவும்",
      enterMedicationName: "மருந்தின் பெயரை உள்ளிடவும்...",
      checkInteractions: "இடைவினைகளைச் சரிபார்க்கவும்",
      medicationAdherenceHistory: "மருந்து கடைபிடிப்பு வரலாறு",
      last30DaysAdherence: "கடந்த 30 நாட்கள் கடைபிடிப்பு",
      sun: "ஞாயிறு",
      mon: "திங்கள்",
      tue: "செவ்வாய்",
      wed: "புதன்",
      thu: "வியாழன்",
      fri: "வெள்ளி",
      sat: "சனி",
      hundredPercentAdherence: "100% கடைபிடிப்பு",
      seventyToNinetyNineAdherence: "70-99% கடைபிடிப்பு",
      belowSeventyAdherence: "70% க்கும் குறைவான கடைபிடிப்பு",
      noMedications: "மருந்துகள் இல்லை",
      individualMedicationAdherence: "தனிப்பட்ட மருந்து கடைபிடிப்பு",
      dosesTaken: "அளவுகள் எடுக்கப்பட்டன",
      of: "இல்",
      mild: "மிதமான",
      moderate: "நடுத்தர",
      severe: "கடுமையான",
    },
    telugu: {
      smartMedicationManager: "స్మార్ట్ మెడికేషన్ మేనేజర్",
      aiPoweredMedicationTracking: "AI-శక్తితో కూడిన మందుల ట్రాకింగ్ మరియు ఇంటరాక్షన్ చెకింగ్",
      adherenceScore: "కట్టుబాటు స్కోర్",
      excellent: "🟢 అద్భుతమైన",
      good: "🟡 మంచి",
      needsImprovement: "🔴 మెరుగుదల అవసరం",
      today: "ఈరోజు",
      allMedications: "అన్ని మందులు",
      drugInteractions: "మందుల పరస్పర చర్యలు",
      history: "చరిత్ర",
      loadingMedicationManager: "మెడికేషన్ మేనేజర్ లోడ్ అవుతోంది",
      preparingMedicationSchedule: "మీ మందుల షెడ్యూల్ తయారు చేయబడుతోంది మరియు పరస్పర చర్యలు తనిఖీ చేయబడుతున్నాయి...",
      todaysMedicationSchedule: "నేటి మందుల షెడ్యూల్",
      pastDue: "గడువు దాటింది",
      upcoming: "రాబోయే",
      scheduled: "షెడ్యూల్ చేయబడింది",
      taken: "తీసుకున్నారు",
      skip: "దాటవేయండి",
      skipped: "దాటవేయబడింది",
      markAsTaken: "తీసుకున్నట్లు మార్క్ చేయండి",
      medicationsTakenToday: "ఈరోజు తీసుకున్న మందులు",
      totalDosesToday: "ఈరోజు మొత్తం డోసులు",
      activeMedications: "క్రియాశీల మందులు",
      prescribedBy: "సూచించినవారు",
      dosage: "మోతాదు",
      frequency: "తరచుదనం",
      times: "సమయాలు",
      startDate: "ప్రారంభ తేదీ",
      instructions: "సూచనలు",
      commonSideEffects: "సాధారణ దుష్ప్రభావాలు",
      viewFullDetails: "పూర్తి వివరాలను చూడండి",
      drugInteractionChecker: "మందుల పరస్పర చర్య తనిఖీ",
      interaction: "పరస్పర చర్య",
      recommendation: "సిఫార్సు",
      noDrugInteractionsFound: "మందుల పరస్పర చర్యలు కనుగొనబడలేదు",
      medicationsAppearSafe: "మీ ప్రస్తుత మందులు కలిసి తీసుకోవడానికి సురక్షితంగా కనిపిస్తున్నాయి।",
      addNewMedication: "కొత్త మందు జోడించండి",
      checkInteractionsBeforeStarting: "కొత్త మందు ప్రారంభించే ముందు పరస్పర చర్యలను తనిఖీ చేయండి",
      enterMedicationName: "మందు పేరు నమోదు చేయండి...",
      checkInteractions: "పరస్పర చర్యలను తనిఖీ చేయండి",
      medicationAdherenceHistory: "మందుల కట్టుబాటు చరిత్ర",
      last30DaysAdherence: "గత 30 రోజుల కట్టుబాటు",
      sun: "ఆది",
      mon: "సోమ",
      tue: "మంగళ",
      wed: "బుధ",
      thu: "గురు",
      fri: "శుక్ర",
      sat: "శని",
      hundredPercentAdherence: "100% కట్టుబాటు",
      seventyToNinetyNineAdherence: "70-99% కట్టుబాటు",
      belowSeventyAdherence: "70% కంటే తక్కువ కట్టుబాటు",
      noMedications: "మందులు లేవు",
      individualMedicationAdherence: "వ్యక్తిగత మందుల కట్టుబాటు",
      dosesTaken: "డోసులు తీసుకున్నారు",
      of: "లో",
      mild: "తేలికపాటి",
      moderate: "మధ్యస్థ",
      severe: "తీవ్రమైన",
    },
    bengali: {
      smartMedicationManager: "স্মার্ট ওষুধ ব্যবস্থাপক",
      aiPoweredMedicationTracking: "AI-চালিত ওষুধ ট্র্যাকিং এবং ইন্টারঅ্যাকশন চেকিং",
      adherenceScore: "মেনে চলার স্কোর",
      excellent: "🟢 চমৎকার",
      good: "🟡 ভাল",
      needsImprovement: "🔴 উন্নতি প্রয়োজন",
      today: "আজ",
      allMedications: "সব ওষুধ",
      drugInteractions: "ওষুধের পারস্পরিক ক্রিয়া",
      history: "ইতিহাস",
      loadingMedicationManager: "ওষুধ ব্যবস্থাপক লোড হচ্ছে",
      preparingMedicationSchedule: "আপনার ওষুধের সূচি প্রস্তুত করা হচ্ছে এবং পারস্পরিক ক্রিয়া পরীক্ষা করা হচ্ছে...",
      todaysMedicationSchedule: "আজকের ওষুধের সূচি",
      pastDue: "সময় পার হয়েছে",
      upcoming: "আসন্ন",
      scheduled: "নির্ধারিত",
      taken: "গ্রহণ করা হয়েছে",
      skip: "এড়িয়ে যান",
      skipped: "এড়িয়ে যাওয়া হয়েছে",
      markAsTaken: "গ্রহণ করা হিসেবে চিহ্নিত করুন",
      medicationsTakenToday: "আজ গ্রহণ করা ওষুধ",
      totalDosesToday: "আজ মোট ডোজ",
      activeMedications: "সক্রিয় ওষুধ",
      prescribedBy: "দ্বারা নির্ধারিত",
      dosage: "ডোজ",
      frequency: "ফ্রিকোয়েন্সি",
      times: "সময়",
      startDate: "শুরুর তারিখ",
      instructions: "নির্দেশাবলী",
      commonSideEffects: "সাধারণ পার্শ্বপ্রতিক্রিয়া",
      viewFullDetails: "সম্পূর্ণ বিবরণ দেখুন",
      drugInteractionChecker: "ওষুধের পারস্পরিক ক্রিয়া পরীক্ষক",
      interaction: "পারস্পরিক ক্রিয়া",
      recommendation: "সুপারিশ",
      noDrugInteractionsFound: "কোন ওষুধের পারস্পরিক ক্রিয়া পাওয়া যায়নি",
      medicationsAppearSafe: "আপনার বর্তমান ওষুধগুলি একসাথে গ্রহণ করার জন্য নিরাপদ বলে মনে হচ্ছে।",
      addNewMedication: "নতুন ওষুধ যোগ করুন",
      checkInteractionsBeforeStarting: "নতুন ওষুধ শুরু করার আগে পারস্পরিক ক্রিয়া পরীক্ষা করুন",
      enterMedicationName: "ওষুধের নাম লিখুন...",
      checkInteractions: "পারস্পরিক ক্রিয়া পরীক্ষা করুন",
      medicationAdherenceHistory: "ওষুধ মেনে চলার ইতিহাস",
      last30DaysAdherence: "গত ৩০ দিনের মেনে চলা",
      sun: "রবি",
      mon: "সোম",
      tue: "মঙ্গল",
      wed: "বুধ",
      thu: "বৃহস্পতি",
      fri: "শুক্র",
      sat: "শনি",
      hundredPercentAdherence: "১০০% মেনে চলা",
      seventyToNinetyNineAdherence: "৭০-৯৯% মেনে চলা",
      belowSeventyAdherence: "৭০% এর নিচে মেনে চলা",
      noMedications: "কোন ওষুধ নেই",
      individualMedicationAdherence: "ব্যক্তিগত ওষুধ মেনে চলা",
      dosesTaken: "ডোজ গ্রহণ করা হয়েছে",
      of: "এর",
      mild: "মৃদু",
      moderate: "মধ্যম",
      severe: "তীব্র",
    },
  };

  const getLocalText = (key: keyof typeof texts.english): string => {
    return (
      texts[currentLanguage as keyof typeof texts]?.[key] ||
      texts.english[key]
    );
  };

  useEffect(() => {
    loadMedicationData();
    generateTodayReminders();
    checkDrugInteractions();
  }, []);

  const loadMedicationData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockMedications: Medication[] = [
      {
        id: "med1",
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        times: ["08:00", "20:00"],
        taken: generateMedicationHistory(),
        startDate: "2025-01-01",
        prescribedBy: "Dr. Smith",
        instructions: "Take with food to reduce stomach upset",
        sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
        interactions: ["Alcohol", "Contrast dye"],
      },
      {
        id: "med2",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        times: ["08:00"],
        taken: generateMedicationHistory(),
        startDate: "2025-01-15",
        prescribedBy: "Dr. Johnson",
        instructions: "Take at the same time each day",
        sideEffects: ["Dry cough", "Dizziness", "Fatigue"],
        interactions: ["NSAIDs", "Potassium supplements"],
      },
      {
        id: "med3",
        name: "Vitamin D3",
        dosage: "2000 IU",
        frequency: "Once daily",
        times: ["09:00"],
        taken: generateMedicationHistory(),
        startDate: "2025-02-01",
        prescribedBy: "Dr. Wilson",
        instructions: "Take with fat-containing meal for better absorption",
        sideEffects: ["Constipation (rare)", "Kidney stones (with high doses)"],
        interactions: ["Thiazide diuretics"],
      },
      {
        id: "med4",
        name: "Omega-3",
        dosage: "1000mg",
        frequency: "Once daily",
        times: ["19:00"],
        taken: generateMedicationHistory(),
        startDate: "2025-01-10",
        prescribedBy: "Dr. Brown",
        instructions: "Take with evening meal",
        sideEffects: ["Fishy aftertaste", "Stomach upset"],
        interactions: ["Blood thinners"],
      },
    ];

    setMedications(mockMedications);
    calculateAdherenceScore(mockMedications);
    setIsLoading(false);
  };

  const generateMedicationHistory = () => {
    const history: { [date: string]: boolean[] } = {};
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // Simulate 85% adherence rate
      history[dateStr] = [Math.random() > 0.15, Math.random() > 0.15];
    }
    return history;
  };

  const generateTodayReminders = () => {
    const today = new Date().toISOString().split("T")[0];
    const reminders: Reminder[] = [];

    medications.forEach((med) => {
      med.times.forEach((time, index) => {
        const [hours, minutes] = time.split(":").map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);

        reminders.push({
          id: `${med.id}-${index}`,
          medicationId: med.id,
          time: time,
          taken: med.taken[today]?.[index] || false,
          skipped: false,
          timestamp: reminderTime,
        });
      });
    });

    setTodayReminders(
      reminders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    );
  };

  const checkDrugInteractions = () => {
    const drugInteractions: DrugInteraction[] = [
      {
        severity: "moderate",
        description:
          "Metformin and alcohol can increase risk of lactic acidosis",
        medications: ["Metformin", "Alcohol"],
        recommendation: "Limit alcohol consumption while taking Metformin",
      },
      {
        severity: "mild",
        description: "Omega-3 may enhance the effects of blood thinners",
        medications: ["Omega-3", "Blood thinners"],
        recommendation:
          "Monitor for increased bleeding risk, consult doctor if taking anticoagulants",
      },
    ];

    setInteractions(drugInteractions);
  };

  const calculateAdherenceScore = (meds: Medication[]) => {
    let totalDoses = 0;
    let takenDoses = 0;

    meds.forEach((med) => {
      Object.values(med.taken).forEach((dailyDoses) => {
        totalDoses += dailyDoses.length;
        takenDoses += dailyDoses.filter((taken) => taken).length;
      });
    });

    const score =
      totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
    setAdherenceScore(score);
  };

  const markMedicationTaken = (reminderId: string, taken: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const reminder = todayReminders.find((r) => r.id === reminderId);

    if (reminder) {
      // Update reminder
      setTodayReminders((prev) =>
        prev.map((r) =>
          r.id === reminderId ? { ...r, taken, skipped: !taken } : r,
        ),
      );

      // Update medication history
      const timeIndex =
        medications
          .find((m) => m.id === reminder.medicationId)
          ?.times.indexOf(reminder.time) || 0;

      setMedications((prev) =>
        prev.map((med) => {
          if (med.id === reminder.medicationId) {
            const updatedTaken = { ...med.taken };
            if (!updatedTaken[today]) {
              updatedTaken[today] = new Array(med.times.length).fill(false);
            }
            updatedTaken[today][timeIndex] = taken;
            return { ...med, taken: updatedTaken };
          }
          return med;
        }),
      );
    }

    // Recalculate adherence
    setTimeout(() => calculateAdherenceScore(medications), 100);
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "border-yellow-400 bg-yellow-50";
      case "moderate":
        return "border-orange-400 bg-orange-50";
      case "severe":
        return "border-red-400 bg-red-50";
      default:
        return "border-gray-400 bg-gray-50";
    }
  };

  const speakReminder = (medication: Medication, time: string) => {
    if ("speechSynthesis" in window) {
      const text = `Time to take your ${medication.name}, ${medication.dosage}. ${medication.instructions}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {getLocalText("loadingMedicationManager")}
          </h2>
          <p className="text-gray-500">
            {getLocalText("preparingMedicationSchedule")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Adherence Score */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              💊 {getLocalText("smartMedicationManager")}
            </h1>
            <p className="text-blue-100">
              {getLocalText("aiPoweredMedicationTracking")}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{adherenceScore}%</div>
            <div className="text-blue-100 text-sm">{getLocalText("adherenceScore")}</div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getAdherenceColor(adherenceScore).replace("text-", "text-").replace("bg-", "bg-opacity-20 bg-")}`}
            >
              {adherenceScore >= 90
                ? getLocalText("excellent")
                : adherenceScore >= 70
                  ? getLocalText("good")
                  : getLocalText("needsImprovement")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-1">
        <div className="flex space-x-1">
          {[
            { id: "today", name: getLocalText("today"), icon: "📅" },
            { id: "medications", name: getLocalText("allMedications"), icon: "💊" },
            { id: "interactions", name: getLocalText("drugInteractions"), icon: "⚠️" },
            { id: "history", name: getLocalText("history"), icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Medications Tab */}
      {activeTab === "today" && (
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🕐 {getLocalText("todaysMedicationSchedule")}
            </h2>
            <div className="space-y-3">
              {todayReminders.map((reminder) => {
                const medication = medications.find(
                  (m) => m.id === reminder.medicationId,
                );
                if (!medication) return null;

                const now = new Date();
                const reminderTime = reminder.timestamp;
                const isPast = now > reminderTime;
                const isUpcoming =
                  Math.abs(now.getTime() - reminderTime.getTime()) <
                  30 * 60 * 1000; // 30 minutes

                return (
                  <div
                    key={reminder.id}
                    className={`p-4 rounded-lg border-2 ${
                      reminder.taken
                        ? "border-green-400 bg-green-50"
                        : reminder.skipped
                          ? "border-red-400 bg-red-50"
                          : isPast
                            ? "border-yellow-400 bg-yellow-50"
                            : isUpcoming
                              ? "border-blue-400 bg-blue-50 animate-pulse"
                              : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {reminder.time}
                          </div>
                          <div className="text-xs text-gray-600">
                            {isPast
                              ? getLocalText("pastDue")
                              : isUpcoming
                                ? getLocalText("upcoming")
                                : getLocalText("scheduled")}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {medication.name}
                          </h3>
                          <p className="text-gray-600">
                            {medication.dosage} - {medication.frequency}
                          </p>
                          <p className="text-sm text-gray-500">
                            {medication.instructions}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isUpcoming && (
                          <button
                            onClick={() =>
                              speakReminder(medication, reminder.time)
                            }
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="Play reminder"
                          >
                            🔊
                          </button>
                        )}

                        {!reminder.taken && !reminder.skipped && (
                          <>
                            <button
                              onClick={() =>
                                markMedicationTaken(reminder.id, true)
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              ✅ {getLocalText("taken")}
                            </button>
                            <button
                              onClick={() =>
                                markMedicationTaken(reminder.id, false)
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              ❌ {getLocalText("skip")}
                            </button>
                          </>
                        )}

                        {reminder.taken && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <span>✅</span>
                            <span className="font-medium">{getLocalText("taken")}</span>
                          </div>
                        )}

                        {reminder.skipped && (
                          <div className="flex items-center space-x-2 text-red-600">
                            <span>❌</span>
                            <span className="font-medium">{getLocalText("skipped")}</span>
                            <button
                              onClick={() =>
                                markMedicationTaken(reminder.id, true)
                              }
                              className="text-sm underline"
                            >
                              {getLocalText("markAsTaken")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {todayReminders.filter((r) => r.taken).length}
              </div>
              <div className="text-gray-600">{getLocalText("medicationsTakenToday")}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {todayReminders.length}
              </div>
              <div className="text-gray-600">{getLocalText("totalDosesToday")}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {medications.length}
              </div>
              <div className="text-gray-600">{getLocalText("activeMedications")}</div>
            </div>
          </div>
        </div>
      )}

      {/* All Medications Tab */}
      {activeTab === "medications" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{medication.name}</h3>
                  <span className="text-sm text-gray-500">
                    Prescribed by {medication.prescribedBy}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dosage:</span>
                    <span className="font-medium">{medication.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{medication.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Times:</span>
                    <span className="font-medium">
                      {medication.times.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {new Date(medication.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Instructions:
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {medication.instructions}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Common Side Effects:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {medication.sideEffects.map((effect, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Full Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drug Interactions Tab */}
      {activeTab === "interactions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              ⚠️ Drug Interaction Checker
            </h2>

            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${getSeverityColor(interaction.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">
                        {interaction.severity === "severe"
                          ? "🚨"
                          : interaction.severity === "moderate"
                            ? "⚠️"
                            : "💡"}{" "}
                        {interaction.severity.charAt(0).toUpperCase() +
                          interaction.severity.slice(1)}{" "}
                        Interaction
                      </h3>
                      <span className="text-sm text-gray-600">
                        {interaction.medications.join(" + ")}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">
                      {interaction.description}
                    </p>

                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <h4 className="font-medium text-blue-800 mb-1">
                        Recommendation:
                      </h4>
                      <p className="text-blue-700 text-sm">
                        {interaction.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">✅</span>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  No Drug Interactions Found
                </h3>
                <p className="text-gray-600">
                  Your current medications appear to be safe to take together.
                </p>
              </div>
            )}

            {/* Add New Medication Check */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Add New Medication
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                Check for interactions before starting a new medication
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter medication name..."
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Check Interactions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 Medication Adherence History
            </h2>

            {/* Adherence Chart */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Last 30 Days Adherence</h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-gray-500 p-1"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (29 - i));
                  const dateStr = date.toISOString().split("T")[0];

                  // Calculate adherence for this day
                  let totalDoses = 0;
                  let takenDoses = 0;

                  medications.forEach((med) => {
                    if (med.taken[dateStr]) {
                      totalDoses += med.taken[dateStr].length;
                      takenDoses += med.taken[dateStr].filter(
                        (taken) => taken,
                      ).length;
                    }
                  });

                  const adherence =
                    totalDoses > 0 ? takenDoses / totalDoses : 0;

                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded text-xs flex items-center justify-center font-medium ${
                        adherence === 1
                          ? "bg-green-500 text-white"
                          : adherence >= 0.7
                            ? "bg-yellow-500 text-white"
                            : adherence > 0
                              ? "bg-red-500 text-white"
                              : "bg-gray-200"
                      }`}
                      title={`${date.toLocaleDateString()}: ${Math.round(adherence * 100)}% adherence`}
                    >
                      {Math.round(adherence * 100)}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>100% adherence</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>70-99% adherence</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Below 70% adherence</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>No medications</span>
                </div>
              </div>
            </div>

            {/* Individual Medication History */}
            <div className="space-y-4">
              <h3 className="font-medium">Individual Medication Adherence</h3>
              {medications.map((medication) => {
                const totalDoses = Object.values(medication.taken).reduce(
                  (sum, daily) => sum + daily.length,
                  0,
                );
                const takenDoses = Object.values(medication.taken).reduce(
                  (sum, daily) => sum + daily.filter((taken) => taken).length,
                  0,
                );
                const adherencePercent =
                  totalDoses > 0
                    ? Math.round((takenDoses / totalDoses) * 100)
                    : 0;

                return (
                  <div
                    key={medication.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{medication.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${getAdherenceColor(adherencePercent)}`}
                      >
                        {adherencePercent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          adherencePercent >= 90
                            ? "bg-green-500"
                            : adherencePercent >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${adherencePercent}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {takenDoses} of {totalDoses} doses taken
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
