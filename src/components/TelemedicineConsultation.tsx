import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useABHA } from "../contexts/ABHAContext";
import { abhaService, TelemedicineSession } from "../services/abhaService";

export default function TelemedicineConsultation() {
  const { currentLanguage } = useLanguage();
  const { abhaProfile, isABHAConnected } = useABHA();
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [consultationType, setConsultationType] = useState<
    "general" | "specialist"
  >("general");
  const [symptoms, setSymptoms] = useState("");

  // Telemedicine translations
  const teleTexts = {
    english: {
      title: "📺 Telemedicine Consultations",
      subtitle: "Video consultations with certified doctors",
      bookConsultation: "Book Consultation",
      upcomingSessions: "Upcoming Sessions",
      pastSessions: "Past Consultations",
      noSessions: "No consultations scheduled",
      doctorName: "Doctor Name",
      consultationType: "Consultation Type",
      date: "Date",
      time: "Time",
      status: "Status",
      symptoms: "Symptoms/Chief Complaint",
      general: "General Consultation",
      specialist: "Specialist Consultation",
      scheduled: "Scheduled",
      inProgress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      joinSession: "Join Video Call",
      reschedule: "Reschedule",
      cancel: "Cancel",
      save: "Book Appointment",
      close: "Close",
      selectDate: "Select Date",
      selectTime: "Select Time",
      selectDoctor: "Select Doctor",
      enterSymptoms: "Describe your symptoms or reason for consultation",
      sessionId: "Session ID",
      duration: "Duration",
      prescription: "View Prescription",
      followUp: "Schedule Follow-up",
      rating: "Rate Consultation",
      today: "Today",
      tomorrow: "Tomorrow",
      thisWeek: "This Week",
    },
    hindi: {
      title: "📺 टेलीमेडिसिन परामर्श",
      subtitle: "प्रमाणित डॉक्टरों के साथ वीडियो परामर्श",
      bookConsultation: "परामर्श बुक करें",
      upcomingSessions: "आगामी सत्र",
      pastSessions: "पिछले परामर्श",
      noSessions: "कोई परामर्श निर्धारित नहीं",
      doctorName: "डॉक्टर का नाम",
      consultationType: "परामर्श प्रकार",
      date: "तारीख",
      time: "समय",
      status: "स्थिति",
      symptoms: "लक्षण/मुख्य शिकायत",
      general: "सामान्य परामर्श",
      specialist: "विशेषज्ञ परामर्श",
      scheduled: "निर्धारित",
      inProgress: "चल रहा है",
      completed: "पूर्ण",
      cancelled: "रद्द",
      joinSession: "वीडियो कॉल में शामिल हों",
      reschedule: "पुनर्निर्धारण",
      cancel: "रद्द करें",
      save: "अपॉइंटमेंट बुक करें",
      close: "बंद करें",
      selectDate: "तारीख चुनें",
      selectTime: "समय चुनें",
      selectDoctor: "डॉक्टर चुनें",
      enterSymptoms: "अपने लक्षण या परामर्श का कारण बताएं",
      sessionId: "सत्र आईडी",
      duration: "अवधि",
      prescription: "प्रिस्क्रिप्शन देखें",
      followUp: "फॉलो-अप शेड्यूल करें",
      rating: "परामर्श रेटिंग दें",
      today: "आज",
      tomorrow: "कल",
      thisWeek: "इस सप्ताह",
    },
    tamil: {
      title: "📺 டெலிமெடிசின் ஆலோசனைகள்",
      subtitle: "சான்றளிக்கப்பட்ட மருத்துவர்களுடன் வீடியோ ஆலோசனைகள்",
      bookConsultation: "ஆலோசனை புக் செய்யவும்",
      upcomingSessions: "வரவிருக்கும் அமர்வுகள்",
      pastSessions: "முந்தைய ஆலோசனைகள்",
      noSessions: "எந்த ஆலோசனையும் திட்டமிடப்படவில்லை",
      doctorName: "மருத்துவர் பெயர்",
      consultationType: "ஆலோசனை வகை",
      date: "தேதி",
      time: "நேரம்",
      status: "நிலை",
      symptoms: "அறிகுறிகள்/முக்கிய புகார்",
      general: "பொது ஆலோசனை",
      specialist: "நிபுணர் ஆலோசனை",
      scheduled: "திட்டமிடப்பட்டது",
      inProgress: "நடந்து கொண்டிருக்கிறது",
      completed: "நிறைவுற்றது",
      cancelled: "ரத்து செய்யப்பட்டது",
      joinSession: "வீடியோ கால் சேரவும்",
      reschedule: "மறுதிட்டமிடல்",
      cancel: "ரத்து செய்",
      save: "அப்பாயின்ட்மென்ட் புக் செய்",
      close: "மூடு",
      selectDate: "தேதியைத் தேர்ந்தெடுக்கவும்",
      selectTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
      selectDoctor: "மருத்துவரைத் தேர்ந்தெடுக்கவும்",
      enterSymptoms: "உங்கள் அறிகுறிகள் அல்லது ஆலோசனைக்கான காரணத்தை விவரிக்கவும்",
      sessionId: "அமர்வு ID",
      duration: "காலம்",
      prescription: "மருந்துச் சீட்டைப் பார்க்கவும்",
      followUp: "பின்தொடர்தலைத் திட்டமிடவும்",
      rating: "ஆலோசனையை மதிப்பிடவும்",
      today: "இன்று",
      tomorrow: "நாளை",
      thisWeek: "இந்த வாரம்",
    },
    telugu: {
      title: "📺 టెలిమెడిసిన్ కన్సల్టేషన్లు",
      subtitle: "సర్టిఫైడ్ డాక్టర్లతో వీడియో కన్సల్టేషన్లు",
      bookConsultation: "కన్సల్టేషన్ బుక్ చేయండి",
      upcomingSessions: "రాబోయే సెషన్లు",
      pastSessions: "గత కన్సల్టేషన్లు",
      noSessions: "ఎలాంటి కన్సల్టేషన్లు షెడ్యూల్ చేయబడలేదు",
      doctorName: "డాక్టర్ పేరు",
      consultationType: "కన్సల్టేషన్ రకం",
      date: "తేదీ",
      time: "సమయం",
      status: "స్థితి",
      symptoms: "లక్షణాలు/ప్రధాన ఫిర్యాదు",
      general: "జనరల్ కన్సల్టేషన్",
      specialist: "స్పెషలిస్ట్ కన్సల్టేషన్",
      scheduled: "షెడ్యూల్ చేయబడింది",
      inProgress: "జరుగుతోంది",
      completed: "పూర్తయింది",
      cancelled: "రద్దు చేయబడింది",
      joinSession: "వీడియో కాల్లో చేరండి",
      reschedule: "రీషెడ్యూల్ చేయండి",
      cancel: "రద్దు చేయండి",
      save: "అపాయింట్మెంట్ బుక్ చేయండి",
      close: "మూసివేయండి",
      selectDate: "తేదీని ఎంచుకోండి",
      selectTime: "సమయాన్ని ఎంచుకోండి",
      selectDoctor: "డాక్టర్ని ఎంచుకోండి",
      enterSymptoms: "మీ లక్షణాలను లేదా కన్సల్టేషన్ కారణాన్ని వివరించండి",
      sessionId: "సెషన్ ID",
      duration: "వ్యవధి",
      prescription: "ప్రిస్క్రిప్షన్ చూడండి",
      followUp: "ఫాలో-అప్ షెడ్యూల్ చేయండి",
      rating: "కన్సల్టేషన్ రేటింగ్ ఇవ్వండి",
      today: "ఈరోజు",
      tomorrow: "రేపు",
      thisWeek: "ఈ వారం",
    },
    bengali: {
      title: "📺 টেলিমেডিসিন পরামর্শ",
      subtitle: "প্রত্যয়িত ডাক্তারদের সাথে ভিডিও পরামর্শ",
      bookConsultation: "পরামর্শ বুক করুন",
      upcomingSessions: "আসন্ন সেশন",
      pastSessions: "অতীতের পরামর্শ",
      noSessions: "কোন পরামর্শ নির্ধারিত নেই",
      doctorName: "ডাক্তারের নাম",
      consultationType: "পরামর্শের ধরন",
      date: "তারিখ",
      time: "সময়",
      status: "অবস্থা",
      symptoms: "লক্ষণ/প্রধান অভিযোগ",
      general: "সাধারণ পরামর্শ",
      specialist: "বিশেষজ্ঞ পরামর্শ",
      scheduled: "নির্ধারিত",
      inProgress: "চলমান",
      completed: "সম্পূর্ণ",
      cancelled: "বাতিল",
      joinSession: "ভিডিও কলে যোগ দিন",
      reschedule: "পুনর্নির্ধারণ",
      cancel: "বাতিল করুন",
      save: "অ্যাপয়েন্টমেন্ট বুক করুন",
      close: "বন্ধ করুন",
      selectDate: "তারিখ নির্বাচন করুন",
      selectTime: "সময় নির্বাচন করুন",
      selectDoctor: "ডাক্তার নির্বাচন করুন",
      enterSymptoms: "আপনার লক্ষণ বা পরামর্শের কারণ বর্ণনা করুন",
      sessionId: "সেশন ID",
      duration: "সময়কাল",
      prescription: "প্রেসক্রিপশন দেখুন",
      followUp: "ফলো-আপ নির্ধারণ করুন",
      rating: "পরামর্শের রেটিং দিন",
      today: "আজ",
      tomorrow: "আগামীকাল",
      thisWeek: "এই সপ্তাহে",
    },
  };

  const getTeleText = (key: keyof typeof teleTexts.english): string => {
    return (
      teleTexts[currentLanguage as keyof typeof teleTexts]?.[key] ||
      teleTexts.english[key]
    );
  };

  // Mock doctors data
  const availableDoctors = [
    {
      id: "dr1",
      name: "Dr. Rajesh Sharma",
      specialization: "General Medicine",
      rating: 4.8,
    },
    {
      id: "dr2",
      name: "Dr. Priya Patel",
      specialization: "Cardiology",
      rating: 4.9,
    },
    {
      id: "dr3",
      name: "Dr. Arjun Singh",
      specialization: "Pediatrics",
      rating: 4.7,
    },
    {
      id: "dr4",
      name: "Dr. Kavya Reddy",
      specialization: "Dermatology",
      rating: 4.8,
    },
    {
      id: "dr5",
      name: "Dr. Vikram Kumar",
      specialization: "Orthopedics",
      rating: 4.6,
    },
  ];

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  useEffect(() => {
    if (isABHAConnected && abhaProfile) {
      loadTelemedicineSessions();
    }
  }, [isABHAConnected, abhaProfile]);

  const loadTelemedicineSessions = async () => {
    if (!abhaProfile) return;

    setIsLoading(true);
    try {
      const tokens = localStorage.getItem("abha_tokens");
      if (tokens) {
        const { accessToken } = JSON.parse(tokens);
        const sessionsData = await abhaService.getTelemedicineSessions(
          abhaProfile.healthId,
          accessToken,
        );
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error("Failed to load telemedicine sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookConsultation = async () => {
    if (!abhaProfile || !selectedDoctor || !appointmentDate || !appointmentTime)
      return;

    setIsLoading(true);
    try {
      const tokens = localStorage.getItem("abha_tokens");
      if (tokens) {
        const { accessToken } = JSON.parse(tokens);

        const session = await abhaService.scheduleTelemedicine(
          abhaProfile.healthId,
          selectedDoctor,
          "VIDEO",
          new Date(`${appointmentDate}T${appointmentTime}`).toISOString(),
          accessToken,
        );

        if (session) {
          await loadTelemedicineSessions();
          setShowBooking(false);
          resetBookingForm();
        }
      }
    } catch (error) {
      console.error("Failed to book consultation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setConsultationType("general");
    setSymptoms("");
  };

  const handleJoinSession = async (sessionId: string) => {
    if (!abhaProfile) return;

    try {
      const tokens = localStorage.getItem("abha_tokens");
      if (tokens) {
        const { accessToken } = JSON.parse(tokens);
        const sessionData = await abhaService.joinTelemedicineSession(
          sessionId,
          accessToken,
        );

        if (sessionData && sessionData.meetingUrl) {
          window.open(sessionData.meetingUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Failed to join session:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return getTeleText("today");
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return getTeleText("tomorrow");
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isABHAConnected) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📺</div>
          <h3 className="text-lg font-semibold mb-2">{getTeleText("title")}</h3>
          <p className="text-gray-600 mb-4">
            Connect ABHA to access telemedicine services
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">
            {getTeleText("title")}
          </h3>
          <p className="text-sm text-gray-600">{getTeleText("subtitle")}</p>
        </div>
        <button
          onClick={() => setShowBooking(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
        >
          {getTeleText("bookConsultation")}
        </button>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upcoming Sessions */}
          <div>
            <h4 className="font-medium mb-3">
              {getTeleText("upcomingSessions")}
            </h4>
            {sessions.filter(
              (s) => s.status === "SCHEDULED" || s.status === "ACTIVE",
            ).length === 0 ? (
              <div className="text-center py-6 bg-white/30 rounded-lg">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-gray-600 text-sm">
                  {getTeleText("noSessions")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions
                  .filter(
                    (s) => s.status === "SCHEDULED" || s.status === "ACTIVE",
                  )
                  .map((session) => (
                    <div
                      key={session.sessionId}
                      className="bg-white/50 p-4 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                              👨‍⚕️
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium truncate">
                                {session.doctorName}
                              </h5>
                              <p className="text-xs text-gray-600">
                                {session.specialty}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">
                                {getTeleText("date")}:{" "}
                              </span>
                              <span className="font-medium">
                                {formatDate(session.scheduledTime)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {getTeleText("time")}:{" "}
                              </span>
                              <span className="font-medium">
                                {new Date(
                                  session.scheduledTime,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}
                            >
                              {getTeleText(
                                session.status.toLowerCase() as keyof typeof teleTexts.english,
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {session.status === "ACTIVE" && (
                            <button
                              onClick={() =>
                                handleJoinSession(session.sessionId)
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-all"
                            >
                              {getTeleText("joinSession")}
                            </button>
                          )}
                          {session.status === "SCHEDULED" && (
                            <>
                              <button
                                onClick={() =>
                                  handleJoinSession(session.sessionId)
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-all"
                              >
                                {getTeleText("joinSession")}
                              </button>
                              <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition-all">
                                {getTeleText("reschedule")}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Past Sessions */}
          <div>
            <h4 className="font-medium mb-3">{getTeleText("pastSessions")}</h4>
            <div className="space-y-3">
              {sessions
                .filter(
                  (s) => s.status === "COMPLETED" || s.status === "CANCELLED",
                )
                .slice(0, 3)
                .map((session) => (
                  <div
                    key={session.sessionId}
                    className="bg-white/30 p-3 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {session.doctorName}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}
                          >
                            {getTeleText(
                              session.status.toLowerCase() as keyof typeof teleTexts.english,
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {formatDate(session.scheduledTime)} •{" "}
                          {session.duration} min
                        </p>
                      </div>
                      {session.status === "COMPLETED" && (
                        <div className="flex space-x-1">
                          <button className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-all">
                            {getTeleText("prescription")}
                          </button>
                          <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all">
                            {getTeleText("followUp")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {getTeleText("bookConsultation")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {getTeleText("consultationType")}
                </label>
                <select
                  value={consultationType}
                  onChange={(e) =>
                    setConsultationType(
                      e.target.value as "general" | "specialist",
                    )
                  }
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="general">{getTeleText("general")}</option>
                  <option value="specialist">
                    {getTeleText("specialist")}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {getTeleText("selectDoctor")}
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">{getTeleText("selectDoctor")}</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization} (⭐{" "}
                      {doctor.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {getTeleText("selectDate")}
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {getTeleText("selectTime")}
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">{getTeleText("selectTime")}</option>
                  {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {getTeleText("symptoms")}
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3 border rounded-lg h-24 resize-none"
                  placeholder={getTeleText("enterSymptoms")}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
              >
                {getTeleText("close")}
              </button>
              <button
                onClick={handleBookConsultation}
                disabled={
                  isLoading ||
                  !selectedDoctor ||
                  !appointmentDate ||
                  !appointmentTime
                }
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isLoading ? "Booking..." : getTeleText("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
