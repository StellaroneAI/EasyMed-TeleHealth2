import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.back": "Back",
      "common.next": "Next",
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.close": "Close",
      "common.confirm": "Confirm",
      "common.available": "Available",
      "common.private": "Private",
      "common.doctor": "Doctor",
      "common.time": "Time",
      "common.date": "Date",
      "common.today": "Today",
      "common.tomorrow": "Tomorrow",
      
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.consultation": "Consultation",
      "nav.telemedicine": "Telemedicine",
      "nav.medications": "Medications",
      "nav.health_analytics": "Health Analytics",
      "nav.emergency": "Emergency",
      
      // Consultation
      "consultation.title": "Multi-Specialty Consultation",
      "consultation.subtitle": "Choose video or chat consultation based on your comfort",
      "consultation.video": "Video Consultation",
      "consultation.chat": "Chat Consultation",
      "consultation.book": "Book Consultation",
      "consultation.confirm_booking": "Confirm Your Booking",
      "consultation.specialty": "Specialty",
      "consultation.type": "Consultation Type",
      "consultation.face_to_face": "Face-to-face consultation with doctor",
      "consultation.text_based": "Text-based private consultation",
      "consultation.personal_interaction": "✓ Personal interaction",
      "consultation.visual_examination": "✓ Visual examination",
      "consultation.real_time_diagnosis": "✓ Real-time diagnosis",
      "consultation.complete_privacy": "✓ Complete privacy",
      "consultation.written_records": "✓ Written records",
      "consultation.comfortable_sensitive": "✓ Comfortable for sensitive topics",
      "consultation.recommended_sensitive": "✓ Recommended for sensitive consultations",
      "consultation.privacy_notice_header": "Privacy Notice",
      "consultation.privacy_notice_body": "This specialty involves sensitive topics. Chat consultation provides complete privacy and may be more comfortable for discussing personal health matters.",
      "consultation.available_doctors": "Available Doctors for",
      "consultation.available_slots": "Available slots for today",
      "consultation.next_slot": "Next slot",
      "consultation.video_call": "📹 Video Call",
      "consultation.chat_option": "💬 Chat",
      
      // Telemedicine
      "telemedicine.title": "📺 Telemedicine Consultations",
      "telemedicine.subtitle": "Video consultations with certified doctors",
      "telemedicine.book": "Book Consultation",
      "telemedicine.upcoming": "Upcoming Sessions",
      "telemedicine.past": "Past Consultations",
      "telemedicine.no_sessions": "No consultations scheduled",
      "telemedicine.join": "Join Video Call",
      "telemedicine.reschedule": "Reschedule",
      "telemedicine.completed": "Completed",
      "telemedicine.scheduled": "Scheduled",
      "telemedicine.in_progress": "In Progress",
      "telemedicine.cancelled": "Cancelled",
      "telemedicine.select_date": "Select Date",
      "telemedicine.select_time": "Select Time",
      "telemedicine.select_doctor": "Select Doctor",
      "telemedicine.symptoms": "Symptoms/Chief Complaint",
      "telemedicine.enter_symptoms": "Describe your symptoms or reason for consultation",
      "telemedicine.general": "General Consultation",
      "telemedicine.specialist": "Specialist Consultation",
      "telemedicine.session_id": "Session ID",
      "telemedicine.duration": "Duration",
      "telemedicine.prescription": "View Prescription",
      "telemedicine.follow_up": "Schedule Follow-up",
      "telemedicine.rating": "Rate Consultation",
      
      // Steps
      "steps.select_specialty": "Select Medical Specialty",
      "steps.choose_type": "Choose Consultation Type",
      "steps.select_doctor": "Select Doctor",
      "steps.pick_time": "Pick Time Slot",
      "steps.confirm": "Confirm Booking",
    }
  },
  hi: {
    translation: {
      // Common
      "common.save": "सेव करें",
      "common.cancel": "रद्द करें",
      "common.back": "वापस",
      "common.next": "आगे",
      "common.loading": "लोड हो रहा है...",
      "common.close": "बंद करें",
      "common.confirm": "पुष्टि करें",
      "common.available": "उपलब्ध",
      "common.private": "निजी",
      "common.doctor": "डॉक्टर",
      "common.time": "समय",
      "common.date": "तारीख",
      "common.today": "आज",
      "common.tomorrow": "कल",
      
      // Navigation
      "nav.dashboard": "डैशबोर्ड",
      "nav.consultation": "परामर्श",
      "nav.telemedicine": "टेलीमेडिसिन",
      "nav.medications": "दवाइयां",
      "nav.health_analytics": "स्वास्थ्य विश्लेषण",
      "nav.emergency": "आपातकाल",
      
      // Consultation
      "consultation.title": "मल्टी-स्पेशल्टी परामर्श",
      "consultation.subtitle": "अपने आराम के अनुसार वीडियो या चैट परामर्श चुनें",
      "consultation.video": "वीडियो परामर्श",
      "consultation.chat": "चैट परामर्श",
      "consultation.book": "परामर्श बुक करें",
      "consultation.confirm_booking": "अपनी बुकिंग की पुष्टि करें",
      "consultation.specialty": "स्पेशलिटी",
      "consultation.type": "परामर्श प्रकार",
      "consultation.face_to_face": "डॉक्टर के साथ आमने-सामने परामर्श",
      "consultation.text_based": "टेक्स्ट-आधारित निजी परामर्श",
      "consultation.personal_interaction": "✓ व्यक्तिगत संपर्क",
      "consultation.visual_examination": "✓ दृश्य परीक्षा",
      "consultation.real_time_diagnosis": "✓ वास्तविक समय निदान",
      "consultation.complete_privacy": "✓ पूर्ण गोपनीयता",
      "consultation.written_records": "✓ लिखित रिकॉर्ड",
      "consultation.comfortable_sensitive": "✓ संवेदनशील विषयों के लिए आरामदायक",
      "consultation.recommended_sensitive": "✓ संवेदनशील परामर्श के लिए अनुशंसित",
      "consultation.privacy_notice_header": "गोपनीयता सूचना",
      "consultation.privacy_notice_body": "यह विशेषता संवेदनशील विषयों को शामिल करती है। चैट परामर्श पूरी गोपनीयता प्रदान करता है।",
      "consultation.available_doctors": "उपलब्ध डॉक्टर",
      "consultation.available_slots": "आज के लिए उपलब्ध स्लॉट",
      "consultation.next_slot": "अगला स्लॉट",
      "consultation.video_call": "📹 वीडियो कॉल",
      "consultation.chat_option": "💬 चैट",
      
      // Telemedicine
      "telemedicine.title": "📺 टेलीमेडिसिन परामर्श",
      "telemedicine.subtitle": "प्रमाणित डॉक्टरों के साथ वीडियो परामर्श",
      "telemedicine.book": "परामर्श बुक करें",
      "telemedicine.upcoming": "आगामी सत्र",
      "telemedicine.past": "पिछले परामर्श",
      "telemedicine.no_sessions": "कोई परामर्श निर्धारित नहीं",
      "telemedicine.join": "वीडियो कॉल में शामिल हों",
      "telemedicine.reschedule": "पुनर्निर्धारण",
      "telemedicine.completed": "पूर्ण",
      "telemedicine.scheduled": "निर्धारित",
      "telemedicine.in_progress": "चल रहा है",
      "telemedicine.cancelled": "रद्द",
      
      // Steps
      "steps.select_specialty": "मेडिकल स्पेशलिटी चुनें",
      "steps.choose_type": "परामर्श प्रकार चुनें",
      "steps.select_doctor": "डॉक्टर चुनें",
      "steps.pick_time": "समय स्लॉट चुनें",
      "steps.confirm": "बुकिंग की पुष्टि करें",
    }
  },
  ta: {
    translation: {
      "common.save": "சேமி",
      "common.cancel": "ரத்து செய்",
      "common.back": "மீண்டும்",
      "common.next": "அடுத்தது",
      "common.loading": "ஏற்றுகிறது...",
      "common.close": "மூடு",
      "common.confirm": "உறுதிப்படுத்தவும்",
      "common.available": "கிடைக்கின்றது",
      "common.private": "தனியார்",
      "common.doctor": "மருத்துவர்",
      "common.time": "நேரம்",
      "common.date": "தேதி",
      "common.today": "இன்று",
      "common.tomorrow": "நாளை",

      // Navigation
      "nav.dashboard": "டாஷ்போர்டு",
      "nav.consultation": "ஆலோசனை",
      "nav.telemedicine": "தொலைமருத்துவம்",
      "nav.medications": "மருந்துகள்",
      "nav.health_analytics": "சுகாதார பகுப்பாய்வு",
      "nav.emergency": "அவசரகாலம்",

      // Consultation
      "consultation.title": "பல சிறப்பு ஆலோசனை",
      "consultation.subtitle": "உங்கள் வசதிக்கு ஏற்ப வீடியோ அல்லது பேசும் ஆலோசனையை தேர்வு செய்யவும்",
      "consultation.video": "வீடியோ ஆலோசனை",
      "consultation.chat": "சொடுக்கவும்",
      "consultation.book": "ஆலோசனையை பதிவு செய்யவும்",
      "consultation.confirm_booking": "உங்கள் பதிவு உறுதிப்படுத்தவும்",
      "consultation.specialty": "சிறப்பு",
      "consultation.type": "ஆலோசனையின் வகை",
      "consultation.face_to_face": "மருத்துவருடன் நேருக்கு நேர் ஆலோசனை",
      "consultation.text_based": "உரைகூர்ச்சி அடிப்படையிலான தனியார் ஆலோசனை",
      "consultation.personal_interaction": "✓ தனிப்பட்ட தொடர்பு",
      "consultation.visual_examination": "✓ பார்வை பரிசோதனை",
      "consultation.real_time_diagnosis": "✓ நேரடி பகுப்பாய்வு",
      "consultation.complete_privacy": "✓ முழுமையான தனியுரிமை",
      "consultation.written_records": "✓ எழுதிய பதிவுகள்",
      "consultation.comfortable_sensitive": "✓ அபாயமில்லாமல் காண்க",
      "consultation.recommended_sensitive": "✓ பரிந்துரைக்கப்பட்ட ஆலோசனை",
      "consultation.privacy_notice_header": "தனியுரிமை குறிப்பு",
      "consultation.privacy_notice_body": "இந்த சிறப்பு அழகியல் விஷயங்கள் அடங்கிய கிரியேட்டிவ் ஆனது. பேசும் ஆலோசனை முழுமையாக தனியுரிமையை வழங்குகிறது மற்றும் உங்கள் தனி சுகாதாரப் பொருட்களுக்கு வசதியாக இருக்கலாம்.",
      "consultation.available_doctors": "கிடைக்கின்ற மருத்துவர்கள்",
      "consultation.available_slots": "இன்றைய கிடைக்கின்ற நேரம்",
      "consultation.next_slot": "அடுத்த நேரம்",
      "consultation.video_call": "📹 வீடியோ அழைப்பு",
      "consultation.chat_option": "💬 பேசவும்",

      // Telemedicine
      "telemedicine.title": "📺 தொலைமருத்துவ ஆலோசனைகள்",
      "telemedicine.subtitle": "சான்றிதழ்பெற்ற மருத்துவர்களுடன் வீடியோ ஆலோசனைகள்",
      "telemedicine.book": "ஆலோசனையை பதிவு செய்யவும்",
      "telemedicine.upcoming": "வரவிருக்கும் அமர்வுகள்",
      "telemedicine.past": "முந்தைய ஆலோசனைகள்",
      "telemedicine.no_sessions": "அந்தந்நாள் சேமிக்கபடவில்லை",
      "telemedicine.join": "வீடியோ அழைப்பில் சேர்க",
      "telemedicine.reschedule": "மறுசுற்றி",
      "telemedicine.completed": "முழுமை",
      "telemedicine.scheduled": "திட்டமிடப்பட்டது",
      "telemedicine.in_progress": "நடைபெற்றுக்கொண்டு உள்ளது",
      "telemedicine.cancelled": "ரத்து செய்யப்பட்டது",
      "telemedicine.select_date": "தேதியை தேர்வு செய்க",
      "telemedicine.select_time": "நேரத்தை தேர்வு செய்க",
      "telemedicine.select_doctor": "மருத்துவரை தேர்வு செய்க",
      "telemedicine.symptoms": "அறிகுறிகள் / முக்கிய குறைவு",
      "telemedicine.enter_symptoms": "உங்கள் அறிகுறிகள் அல்லது ஆலோசனையின் காரணத்தை விவரிக்கவும்",
      "telemedicine.general": "பொது ஆலோசனை",
      "telemedicine.specialist": "சிறப்பு ஆலோசனை",
      "telemedicine.session_id": "அமர்வு ஐடியை",
      "telemedicine.duration": "நேர அளவு",
      "telemedicine.prescription": "மருந்து மருத்துவர்",
      "telemedicine.follow_up": "அடுத்து அளிக்க",

      // Steps
      "steps.select_specialty": "மருத்துவ சிறப்பு தேர்ந்தெடுக்கவும்",
      "steps.choose_type": "ஆலோசனையின் வகையை தேர்வு செய்யவும்",
      "steps.select_doctor": "மருத்துவரை தேர்வு செய்க",
      "steps.pick_time": "நேரத்தை தேர்வு செய்க",
      "steps.confirm": "பதிவு உறுதிப்படுத்தவும்",
    }
  }
};

i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    // Auto-detect language from browser/localStorage
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
