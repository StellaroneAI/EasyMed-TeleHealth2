import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  voiceService,
  HealthMetric,
  HealthInsight,
  HealthGoal,
} from "../services/openai";

export default function HealthAnalytics() {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Translation texts
  const texts = {
    english: {
      smartHealthAnalytics: "Smart Health Analytics",
      aiPoweredInsights: "AI-powered insights into your health trends and patterns",
      sevenDays: "7 Days",
      thirtyDays: "30 Days",
      threeMonths: "3 Months",
      oneYear: "1 Year",
      overview: "Overview",
      metrics: "Metrics",
      goals: "Goals",
      aiInsights: "AI Insights",
      loadingHealthAnalytics: "Loading Health Analytics",
      analyzingHealthData: "Analyzing your health data and generating insights...",
      heartRate: "Heart Rate",
      bloodPressure: "Blood Pressure",
      bpm: "bpm",
      mmHg: "mmHg",
      normal: "normal",
      warning: "warning",
      critical: "critical",
      stable: "Stable",
      increasing: "Increasing",
      decreasing: "Decreasing",
      recentAIInsights: "Recent AI Insights",
      targetRange: "Target Range",
      progress: "Progress",
      complete: "Complete",
      toGo: "to go",
      goalAchieved: "Goal achieved! 🎉",
      updateProgress: "Update Progress",
      setNewHealthGoal: "Set a New Health Goal",
      trackProgressBetterHealth: "Track your progress towards better health",
      addNewGoal: "+ Add New Goal",
      aiPoweredHealthInsights: "AI-Powered Health Insights",
      highPriority: "high priority",
      mediumPriority: "medium priority",
      lowPriority: "low priority",
      overallHealthScore: "Overall Health Score",
      goodKeepUp: "Good - Keep up the great work!",
    },
    hindi: {
      smartHealthAnalytics: "स्मार्ट स्वास्थ्य विश्लेषण",
      aiPoweredInsights: "आपके स्वास्थ्य रुझानों और पैटर्न में एआई-संचालित अंतर्दृष्टि",
      sevenDays: "7 दिन",
      thirtyDays: "30 दिन",
      threeMonths: "3 महीने",
      oneYear: "1 वर्ष",
      overview: "अवलोकन",
      metrics: "मेट्रिक्स",
      goals: "लक्ष्य",
      aiInsights: "एआई अंतर्दृष्टि",
      loadingHealthAnalytics: "स्वास्थ्य विश्लेषण लोड हो रहा है",
      analyzingHealthData: "आपके स्वास्थ्य डेटा का विश्लेषण और अंतर्दृष्टि जेनरेट की जा रही है...",
      heartRate: "हृदय गति",
      bloodPressure: "रक्तचाप",
      bpm: "बीपीएम",
      mmHg: "एमएमएचजी",
      normal: "सामान्य",
      warning: "चेतावनी",
      critical: "गंभीर",
      stable: "स्थिर",
      increasing: "बढ़ रहा है",
      decreasing: "घट रहा है",
      recentAIInsights: "हाल की एआई अंतर्दृष्टि",
      targetRange: "लक्ष्य सीमा",
      progress: "प्रगति",
      complete: "पूर्ण",
      toGo: "बाकी",
      goalAchieved: "लक्ष्य हासिल! 🎉",
      updateProgress: "प्रगति अपडेट करें",
      setNewHealthGoal: "नया स्वास्थ्य लक्ष्य सेट करें",
      trackProgressBetterHealth: "बेहतर स्वास्थ्य की दिशा में अपनी प्रगति को ट्रैक करें",
      addNewGoal: "+ नया लक्ष्य जोड़ें",
      aiPoweredHealthInsights: "एआई-संचालित स्वास्थ्य अंतर्दृष्टि",
      highPriority: "उच्च प्राथमिकता",
      mediumPriority: "मध्यम प्राथमिकता",
      lowPriority: "कम प्राथमिकता",
      overallHealthScore: "समग्र स्वास्थ्य स्कोर",
      goodKeepUp: "अच्छा - बेहतरीन काम जारी रखें!",
    },
    tamil: {
      smartHealthAnalytics: "ஸ்மார்ட் ஹெல்த் அனாலிட்டிக்ஸ்",
      aiPoweredInsights: "உங்கள் சுகாதார போக்குகள் மற்றும் வடிவங்களில் AI-இயங்கும் நுண்ணறிவு",
      sevenDays: "7 நாட்கள்",
      thirtyDays: "30 நாட்கள்",
      threeMonths: "3 மாதங்கள்",
      oneYear: "1 வருடம்",
      overview: "மேலோட்டமான பார்வை",
      metrics: "அளவீடுகள்",
      goals: "இலக்குகள்",
      aiInsights: "AI நுண்ணறிவு",
      loadingHealthAnalytics: "சுகாதார பகுப்பாய்வு ஏற்றப்படுகிறது",
      analyzingHealthData: "உங்கள் சுகாதார தரவை பகுப்பாயும் மற்றும் நுண்ணறிவுகளை உருவாக்குகிறது...",
      heartRate: "இதய துடிப்பு",
      bloodPressure: "இரத்த அழுத்தம்",
      bpm: "பிபிஎம்",
      mmHg: "எம்எம்எச்ஜி",
      normal: "சாதாரண",
      warning: "எச்சரிக்கை",
      critical: "கடுமையான",
      stable: "நிலையான",
      increasing: "அதிகரித்து வருகிறது",
      decreasing: "குறைந்து வருகிறது",
      recentAIInsights: "சமீபத்திய AI நுண்ணறிவுகள்",
      targetRange: "இலக்கு வரம்பு",
      progress: "முன்னேற்றம்",
      complete: "முழுமையான",
      toGo: "போக வேண்டும்",
      goalAchieved: "இலக்கு அடைந்தது! 🎉",
      updateProgress: "முன்னேற்றத்தை புதுப்பிக்கவும்",
      setNewHealthGoal: "புதிய சுகாதார இலக்கை அமைக்கவும்",
      trackProgressBetterHealth: "சிறந்த சுகாதாரத்தை நோக்கிய உங்கள் முன்னேற்றத்தை கண்காணிக்கவும்",
      addNewGoal: "+ புதிய இலக்கை சேர்க்கவும்",
      aiPoweredHealthInsights: "AI-இயங்கும் சுகாதார நுண்ணறிவுகள்",
      highPriority: "உயர் முன்னுரிமை",
      mediumPriority: "நடுத்தர முன்னுரிமை",
      lowPriority: "குறைந்த முன்னுரிமை",
      overallHealthScore: "ஒட்டுமொத்த சுகாதார மதிப்பெண்",
      goodKeepUp: "நல்லது - சிறந்த வேலையைத் தொடருங்கள்!",
    },
    telugu: {
      smartHealthAnalytics: "స్మార్ట్ హెల్త్ అనలిటిక్స్",
      aiPoweredInsights: "మీ ఆరోగ్య ట్రెండ్లు మరియు నమూనాలలో AI-శక్తితో కూడిన అంతర్దృష్టులు",
      sevenDays: "7 రోజులు",
      thirtyDays: "30 రోజులు",
      threeMonths: "3 నెలలు",
      oneYear: "1 సంవత్సరం",
      overview: "అవలోకనం",
      metrics: "మెట్రిక్స్",
      goals: "లక్ష్యాలు",
      aiInsights: "AI అంతర్దృష్టులు",
      loadingHealthAnalytics: "ఆరోగ్య విశ్లేషణ లోడ్ అవుతోంది",
      analyzingHealthData: "మీ ఆరోగ్య డేటాను విశ్లేషిస్తోంది మరియు అంతర్దృష్టులను జెనరేట్ చేస్తోంది...",
      heartRate: "హృదయ స్పందన",
      bloodPressure: "రక్తపోటు",
      bpm: "బిపిఎం",
      mmHg: "ఎంఎంహెచ్జి",
      normal: "సాధారణ",
      warning: "హెచ్చరిక",
      critical: "క్రిటికల్",
      stable: "స్థిరమైన",
      increasing: "పెరుగుతోంది",
      decreasing: "తగ్గుతోంది",
      recentAIInsights: "ఇటీవలి AI అంతర్దృష్టులు",
      targetRange: "లక్ష్య పరిధి",
      progress: "పురోగతి",
      complete: "పూర్తి",
      toGo: "వెళ్ళాలి",
      goalAchieved: "లక్ష్యం సాధించబడింది! 🎉",
      updateProgress: "పురోగతిని అప్డేట్ చేయండి",
      setNewHealthGoal: "కొత్త ఆరోగ్య లక్ష్యాన్ని సెట్ చేయండి",
      trackProgressBetterHealth: "మెరుగైన ఆరోగ్యం వైపు మీ పురోగతిని ట్రాక్ చేయండి",
      addNewGoal: "+ కొత్త లక్ష్యాన్ని జోడించండి",
      aiPoweredHealthInsights: "AI-శక్తితో కూడిన ఆరోగ్య అంతర్దృష్టులు",
      highPriority: "అధిక ప్రాధాన్యత",
      mediumPriority: "మధ్యస్థ ప్రాధాన్యత",
      lowPriority: "తక్కువ ప్రాధాన్యత",
      overallHealthScore: "మొత్తం ఆరోగ్య స్కోర్",
      goodKeepUp: "మంచిది - గొప్ప పనిని కొనసాగించండి!",
    },
    bengali: {
      smartHealthAnalytics: "স্মার্ট হেলথ অ্যানালিটিক্স",
      aiPoweredInsights: "আপনার স্বাস্থ্য প্রবণতা এবং প্যাটার্নে AI-চালিত অন্তর্দৃষ্টি",
      sevenDays: "৭ দিন",
      thirtyDays: "৩০ দিন",
      threeMonths: "৩ মাস",
      oneYear: "১ বছর",
      overview: "সংক্ষিপ্ত বিবরণ",
      metrics: "মেট্রিক্স",
      goals: "লক্ষ্য",
      aiInsights: "AI অন্তর্দৃষ্টি",
      loadingHealthAnalytics: "স্বাস্থ্য বিশ্লেষণ লোড হচ্ছে",
      analyzingHealthData: "আপনার স্বাস্থ্য ডেটা বিশ্লেষণ করা হচ্ছে এবং অন্তর্দৃষ্টি তৈরি করা হচ্ছে...",
      heartRate: "হৃদস্পন্দন",
      bloodPressure: "রক্তচাপ",
      bpm: "বিপিএম",
      mmHg: "এমএমএইচজি",
      normal: "স্বাভাবিক",
      warning: "সতর্কতা",
      critical: "সংকটজনক",
      stable: "স্থিতিশীল",
      increasing: "বৃদ্ধি পাচ্ছে",
      decreasing: "হ্রাস পাচ্ছে",
      recentAIInsights: "সাম্প্রতিক AI অন্তর্দৃষ্টি",
      targetRange: "লক্ষ্য পরিসীমা",
      progress: "অগ্রগতি",
      complete: "সম্পূর্ণ",
      toGo: "যেতে হবে",
      goalAchieved: "লক্ষ্য অর্জিত! 🎉",
      updateProgress: "অগ্রগতি আপডেট করুন",
      setNewHealthGoal: "নতুন স্বাস্থ্য লক্ষ্য সেট করুন",
      trackProgressBetterHealth: "ভাল স্বাস্থ্যের দিকে আপনার অগ্রগতি ট্র্যাক করুন",
      addNewGoal: "+ নতুন লক্ষ্য যোগ করুন",
      aiPoweredHealthInsights: "AI-চালিত স্বাস্থ্য অন্তর্দৃষ্টি",
      highPriority: "উচ্চ অগ্রাধিকার",
      mediumPriority: "মাঝারি অগ্রাধিকার",
      lowPriority: "কম অগ্রাধিকার",
      overallHealthScore: "সামগ্রিক স্বাস্থ্য স্কোর",
      goodKeepUp: "ভাল - দুর্দান্ত কাজ চালিয়ে যান!",
    },
  };

  const getLocalText = (key: keyof typeof texts.english): string => {
    return (
      texts[currentLanguage as keyof typeof texts]?.[key] ||
      texts.english[key]
    );
  };

  useEffect(() => {
    const loadHealthData = async () => {
      setIsLoading(true);
      // Simulate loading health metrics and goals
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockMetrics = [
        {
          id: "heart_rate",
          name: "Heart Rate",
          value: 72,
          unit: "bpm",
          trend: "stable" as const,
          status: "normal" as const,
          target: { min: 60, max: 100 },
          history: generateHealthHistory(70, 10, 7),
        },
        {
          id: "blood_pressure",
          name: "Blood Pressure",
          value: 125,
          unit: "mmHg",
          trend: "up" as const,
          status: "warning" as const,
          target: { min: 90, max: 120 },
          history: generateHealthHistory(120, 15, 7),
        },
        // ... other metrics
      ];
      setHealthMetrics(mockMetrics);

      const mockGoals = [
        {
          id: "weight_loss",
          title: "Lose Weight",
          target: 65,
          current: 68.5,
          unit: "kg",
          deadline: "2025-09-30",
          category: "fitness" as const,
        },
        // ... other goals
      ];
      setHealthGoals(mockGoals);

      // Generate AI insights
      try {
        const patientInfo = {
          age: "45",
          gender: "male",
          existingConditions: ["Hypertension"],
        }; // Replace with actual patient data
        const aiInsights = await voiceService.getPersonalizedHealthInsights(
          mockMetrics,
          patientInfo,
          currentLanguage,
        );
        setInsights(aiInsights);
      } catch (error) {
        console.error("Failed to load AI insights:", error);
      }

      setIsLoading(false);
    };

    loadHealthData();
  }, [timeRange, currentLanguage]);

  const generateHealthHistory = (
    baseValue: number,
    variance: number,
    days: number,
  ) => {
    const history = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomVariation = (Math.random() - 0.5) * variance;
      history.push({
        date: date.toISOString().split("T")[0],
        value: Math.round((baseValue + randomVariation) * 10) / 10,
      });
    }
    return history;
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "➡️";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness":
        return "💪";
      case "nutrition":
        return "🥗";
      case "medication":
        return "💊";
      case "lifestyle":
        return "🌟";
      default:
        return "📊";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "recommendation":
        return "💡";
      case "achievement":
        return "🏆";
      default:
        return "ℹ️";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {getLocalText('loadingHealthAnalytics')}
          </h2>
          <p className="text-gray-500">
            {getLocalText('analyzingHealthData')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">📊 {getLocalText('smartHealthAnalytics')}</h1>
        <p className="text-blue-100">
          {getLocalText('aiPoweredInsights')}
        </p>

        {/* Time Range Selector */}
        <div className="mt-4 flex space-x-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-white text-blue-600"
                  : "bg-blue-500 hover:bg-blue-400 text-white"
              }`}
            >
              {range === "7d"
                ? getLocalText('sevenDays')
                : range === "30d"
                  ? getLocalText('thirtyDays')
                  : range === "90d"
                    ? getLocalText('threeMonths')
                    : getLocalText('oneYear')}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-1">
        <div className="flex space-x-1">
          {[
            { id: "overview", nameKey: "overview", icon: "📊" },
            { id: "metrics", nameKey: "metrics", icon: "📈" },
            { id: "goals", nameKey: "goals", icon: "🎯" },
            { id: "insights", nameKey: "aiInsights", icon: "🧠" },
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
              <span>{getLocalText(tab.nameKey as keyof typeof texts.english)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthMetrics.slice(0, 6).map((metric) => (
              <div
                key={metric.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                  <span className="text-lg">{getTrendIcon(metric.trend)}</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-600 mb-1">
                    {metric.unit}
                  </span>
                </div>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMetricColor(metric.status)}`}
                >
                  {metric.status === "normal"
                    ? "✅"
                    : metric.status === "warning"
                      ? "⚠️"
                      : "🚨"}{" "}
                  {metric.status}
                </div>

                {/* Mini chart */}
                <div className="mt-4 h-16 bg-gray-50 rounded-lg p-2">
                  <div className="flex items-end justify-between h-full">
                    {metric.history.slice(-7).map((point, index) => (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t w-2"
                        style={{
                          height: `${(point.value / Math.max(...metric.history.map((h) => h.value))) * 100}%`,
                          minHeight: "4px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🔮 {getLocalText('recentAIInsights')}
            </h2>
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.priority === "high"
                      ? "border-red-500 bg-red-50"
                      : insight.priority === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">
                      {getInsightIcon(insight.type)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {insight.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                          {insight.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {healthMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{metric.name}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getMetricColor(metric.status)}`}
                  >
                    {metric.status}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-gray-600">{metric.unit}</div>
                  <div className="flex items-center space-x-1">
                    <span>{getTrendIcon(metric.trend)}</span>
                    <span className="text-sm text-gray-600">
                      {metric.trend === "up"
                        ? getLocalText('increasing')
                        : metric.trend === "down"
                          ? getLocalText('decreasing')
                          : getLocalText('stable')}
                    </span>
                  </div>
                </div>

                {/* Target Range */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{getLocalText('targetRange')}</span>
                    <span>
                      {metric.target.min} - {metric.target.max} {metric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.value >= metric.target.min &&
                        metric.value <= metric.target.max
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((metric.value / metric.target.max) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* History Chart */}
                <div className="h-32 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-end justify-between h-full space-x-1">
                    {metric.history.map((point, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="bg-blue-500 rounded-t w-full"
                          style={{
                            height: `${(point.value / Math.max(...metric.history.map((h) => h.value))) * 100}%`,
                            minHeight: "4px",
                          }}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(point.date).getDate()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthGoals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getCategoryIcon(goal.category)}
                    </span>
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{getLocalText('progress')}</span>
                    <span className="font-semibold">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {Math.round((goal.current / goal.target) * 100)}% {getLocalText('complete')}
                    </span>
                    <span className="text-gray-600">
                      {goal.target - goal.current > 0
                        ? `${Math.round((goal.target - goal.current) * 10) / 10} ${goal.unit} ${getLocalText('toGo')}`
                        : getLocalText('goalAchieved')}
                    </span>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {getLocalText('updateProgress')}
                </button>
              </div>
            ))}
          </div>

          {/* Add New Goal */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-green-300">
            <div className="text-center">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getLocalText('setNewHealthGoal')}
              </h3>
              <p className="text-gray-600 mb-4">
                {getLocalText('trackProgressBetterHealth')}
              </p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                {getLocalText('addNewGoal')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              🧠 {getLocalText('aiPoweredHealthInsights')}
            </h2>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-6 rounded-xl border-l-4 ${
                    insight.priority === "high"
                      ? "border-red-500 bg-red-50"
                      : insight.priority === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl">
                      {getInsightIcon(insight.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {insight.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.priority === "high"
                              ? "bg-red-200 text-red-800"
                              : insight.priority === "medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-200 text-green-800"
                          }`}
                        >
                          {getLocalText(`${insight.priority}Priority` as keyof typeof texts.english)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          {insight.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">
              🏆 {getLocalText('overallHealthScore')}
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-2">78/100</div>
                <p className="text-purple-100">
                  {getLocalText('goodKeepUp')}
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
