import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface FloatingVoiceAssistantProps {
  onCommand?: (command: string, section?: string) => void;
}

const FloatingVoiceAssistant: React.FC<FloatingVoiceAssistantProps> = ({ onCommand }) => {
  const { currentLanguage, t, getVoiceCommand } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [recognitionActive, setRecognitionActive] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Map your language enum to speech language codes
  const getLanguageCode = (lang: Language): string => {
    switch (lang) {
      case Language.English: return 'en-US';
      case Language.Hindi: return 'hi-IN';
      case Language.Tamil: return 'ta-IN';
      case Language.Telugu: return 'te-IN';
      case Language.Bengali: return 'bn-IN';
      case Language.Marathi: return 'mr-IN';
      case Language.Gujarati: return 'gu-IN';
      case Language.Kannada: return 'kn-IN';
      case Language.Malayalam: return 'ml-IN';
      case Language.Punjabi: return 'pa-IN';
      case Language.Odia: return 'or-IN';
      case Language.Assamese: return 'as-IN';
      default: return 'en-US';
    }
  };
  
  const currentLangCode = getLanguageCode(currentLanguage);
  
  // Language configuration
  const languageConfig = {
    en: {
      speechLang: 'en-US',
      voiceNames: ['Microsoft Zira', 'Google US English', 'Microsoft David'],
      commands: {
        start: ['start consultation', 'book appointment', 'see doctor', 'begin consultation'],
        next: ['next', 'continue', 'proceed', 'go ahead'],
        back: ['back', 'previous', 'return', 'go back'],
        help: ['help', 'what can you do', 'commands', 'assist me']
      },
      responses: {
        welcome: 'Hello! I am Medini, your AI health assistant. I can help you book a consultation. Say "start consultation" to begin.',
        starting: 'Starting your consultation booking now.',
        next: 'Moving to the next step.',
        back: 'Going back to the previous step.',
        help: 'You can say: start consultation, next, back, or help.',
        notUnderstood: 'I did not understand. Please try saying "start consultation" or "help".'
      }
    },
    hi: {
      speechLang: 'hi-IN',
      voiceNames: ['Microsoft Hemant', 'Microsoft Kalpana', 'Google हिन्दी'],
      commands: {
        start: ['परामर्श शुरू करें', 'डॉक्टर से मिलें', 'अपॉइंटमेंट बुक करें', 'इलाज शुरू करें'],
        next: ['आगे', 'अगला', 'आगे बढ़ें', 'जारी रखें'],
        back: ['वापस', 'पीछे', 'पहले', 'वापस जाएं'],
        help: ['मदद', 'सहायता', 'आप क्या कर सकते हैं', 'कमांड']
      },
      responses: {
        welcome: 'नमस्ते! मैं मेदिनी हूं, आपकी एआई स्वास्थ्य सहायक। मैं आपको परामर्श बुक करने में मदद कर सकती हूं। "परामर्श शुरू करें" कहें।',
        starting: 'आपका परामर्श बुकिंग शुरू कर रही हूं।',
        next: 'अगले चरण पर जा रहे हैं।',
        back: 'पिछले चरण पर वापस जा रहे हैं।',
        help: 'आप कह सकते हैं: परामर्श शुरू करें, आगे, वापस, या मदद।',
        notUnderstood: 'मैं समझ नहीं पायी। कृपया "परामर्श शुरू करें" या "मदद" कहें।'
      }
    },
    ta: {
      speechLang: 'ta-IN',
      voiceNames: ['Microsoft Valluvar', 'Google தமிழ்'],
      commands: {
        start: ['ஆலோசனை தொடங்கு', 'மருத்துவரை பார்க்க', 'அப்பாயிண்ட்மென்ட் புக் செய்', 'சிகிச்சை தொடங்கு'],
        next: ['அடுத்தது', 'முன்னேறு', 'தொடர்க', 'மேலே செல்'],
        back: ['பின்னால்', 'முந்தைய', 'திரும்பு', 'பின் செல்'],
        help: ['உதவி', 'நீங்கள் என்ன செய்ய முடியும்', 'கட்டளைகள்', 'உதவி செய்']
      },
      responses: {
        welcome: 'வணக்கம்! நான் மெடினி, உங்கள் AI சுகாதார உதவியாளர். நான் உங்களுக்கு ஆலோசனை பதிவு செய்ய உதவ முடியும். "ஆலோசனை தொடங்கு" என்று சொல்லுங்கள்.',
        starting: 'உங்கள் ஆலோசனை பதிவை தொடங்குகிறேன்.',
        next: 'அடுத்த படிக்கு செல்கிறோம்.',
        back: 'முந்தைய படிக்கு திரும்புகிறோம்.',
        help: 'நீங்கள் சொல்லலாம்: ஆலோசனை தொடங்கு, அடுத்தது, பின்னால், அல்லது உதவி.',
        notUnderstood: 'எனக்கு புரியவில்லை. தயவுசெய்து "ஆலோசனை தொடங்கு" அல்லது "உதவி" என்று சொல்லுங்கள்.'
      }
    }
  };

  // Get current language configuration based on your Language enum
  const getCurrentConfig = () => {
    // Use actual translation function to get localized text
    const getLocalizedText = (key: string) => {
      try {
        return getVoiceCommand(key) || key;
      } catch {
        return key;
      }
    };

    switch (currentLanguage) {
      case Language.Hindi:
        return {
          speechLang: 'hi-IN',
          voiceNames: ['Microsoft Kalpana', 'Microsoft Heera', 'Google Hindi Female'],
          commands: {
            start: ['परामर्श शुरू करें', 'डॉक्टर से मिलें', 'अपॉइंटमेंट बुक करें', 'इलाज शुरू करें'],
            next: ['आगे', 'अगला', 'आगे बढ़ें', 'जारी रखें'],
            back: ['वापस', 'पीछे', 'पहले', 'वापस जाएं'],
            help: ['मदद', 'सहायता', 'आप क्या कर सकते हैं', 'कमांड']
          },
          responses: {
            welcome: 'नमस्ते! मैं मेदिनी हूं, आपकी एआई स्वास्थ्य सहायक। मैं आपको परामर्श बुक करने में मदद कर सकती हूं। "परामर्श शुरू करें" कहें।',
            starting: 'आपका परामर्श बुकिंग शुरू कर रही हूं।',
            next: 'अगले चरण पर जा रहे हैं।',
            back: 'पिछले चरण पर वापस जा रहे हैं।',
            help: 'आप कह सकते हैं: परामर्श शुरू करें, आगे, वापस, या मदद।',
            notUnderstood: 'मैं समझ नहीं पायी। कृपया "परामर्श शुरू करें" या "मदद" कहें।'
          }
        };
      case Language.Tamil:
        return {
          speechLang: 'ta-IN',
          voiceNames: ['Microsoft Heera', 'Google Tamil Female', 'Google தமிழ்'],
          commands: {
            start: ['ஆலோசனை தொடங்கு', 'மருத்துவரை பார்க்க', 'அப்பாயிண்ட்மென்ட் புக் செய்', 'சிகிச்சை தொடங்கு'],
            next: ['அடுத்தது', 'முன்னேறு', 'தொடர்க', 'மேலே செல்'],
            back: ['பின்னால்', 'முந்தைய', 'திரும்பு', 'பின் செல்'],
            help: ['உதவி', 'நீங்கள் என்ன செய்ய முடியும்', 'கட்டளைகள்', 'உதவி செய்']
          },
          responses: {
            welcome: 'வணக்கம்! நான் மெடினி, உங்கள் AI சுகாதார உதவியாளர். நான் உங்களுக்கு ஆலோசனை பதிவு செய்ய உதவ முடியும். "ஆலோசனை தொடங்கு" என்று சொல்லுங்கள்।',
            starting: 'உங்கள் ஆலோசனை பதிவை தொடங்குகிறேன்।',
            next: 'அடுத்த படிக்கு செல்கிறோம்.',
            back: 'முந்தைய படிக்கு திரும்புகிறோம்.',
            help: 'நீங்கள் சொல்லலாம்: ஆலோசனை தொடங்கு, அடுத்தது, பின்னால், அல்லது உதவி.',
            notUnderstood: 'எனக்கு புரியவில்லை. தயவுசெய்து "ஆலோசனை தொடங்கு" அல்லது "உதவி" என்று சொல்லுங்கள்.'
          }
        };
      case Language.Telugu:
        return {
          speechLang: 'te-IN',
          voiceNames: ['Google Telugu Female', 'Microsoft Telugu', 'Google Telugu'],
          commands: {
            start: ['సంప్రదింపు ప్రారంభించు', 'డాక్టర్ అపాయింట్మెంట్', 'వైద్య సహాయం'],
            next: ['తర్వాత', 'కొనసాగించు', 'ముందుకు'],
            back: ['వెనుకకు', 'మునుపటి', 'తిరిగి'],
            help: ['సహాయం', 'మీరు ఏం చేయగలరు', 'కమాండ్లు']
          },
          responses: {
            welcome: 'నమస్కారం! నేను మెడిని, మీ AI ఆరోగ్య సహాయకురాలిని. నేను మీకు సంప్రదింపు బుక్ చేయడంలో సహాయం చేయగలను. "సంప్రదింపు ప్రారంభించు" అని చెప్పండి.',
            starting: 'మీ సంప్రదింపు బుకింగ్ ప్రారంభిస్తున్నాను.',
            next: 'తదుపరి దశకు వెళుతున్నాము.',
            back: 'మునుపటి దశకు తిరిగి వెళుతున్నాము.',
            help: 'మీరు చెప్పవచ్చు: సంప్రదింపు ప్రారంభించు, తర్వాత, వెనుకకు, లేదా సహాయం.',
            notUnderstood: 'నాకు అర్థం కాలేదు. దయచేసి "సంప్రదింపు ప్రారంభించు" లేదా "సహాయం" అని చెప్పండి.'
          }
        };
      case Language.Bengali:
        return {
          speechLang: 'bn-IN',
          voiceNames: ['Google Bengali Female', 'Microsoft Bengali', 'Google Bengali'],
          commands: {
            start: ['পরামর্শ শুরু করুন', 'ডাক্তার অ্যাপয়েন্টমেন্ট', 'চিকিৎসা সহায়তা'],
            next: ['পরবর্তী', 'চালিয়ে যান', 'এগিয়ে যান'],
            back: ['পিছনে', 'আগের', 'ফিরে যান'],
            help: ['সাহায্য', 'আপনি কী করতে পারেন', 'কমান্ড']
          },
          responses: {
            welcome: 'নমস্কার! আমি মেদিনী, আপনার AI স্বাস্থ্য সহায়ক। আমি আপনাকে পরামর্শ বুক করতে সাহায্য করতে পারি। "পরামর্শ শুরু করুন" বলুন।',
            starting: 'আপনার পরামর্শ বুকিং শুরু করছি।',
            next: 'পরবর্তী ধাপে যাচ্ছি।',
            back: 'আগের ধাপে ফিরে যাচ্ছি।',
            help: 'আপনি বলতে পারেন: পরামর্শ শুরু করুন, পরবর্তী, পিছনে, অথবা সাহায্য।',
            notUnderstood: 'আমি বুঝতে পারিনি। অনুগ্রহ করে "পরামর্শ শুরু করুন" বা "সাহায্য" বলুন।'
          }
        };
      case Language.Marathi:
        return {
          speechLang: 'mr-IN',
          voiceNames: ['Google Marathi Female', 'Microsoft Marathi', 'Google Marathi'],
          commands: {
            start: ['सल्लामसलत सुरू करा', 'डॉक्टर भेटी', 'वैद्यकीय मदत'],
            next: ['पुढे', 'चालू ठेवा', 'पुढील'],
            back: ['मागे', 'आधीचे', 'परत'],
            help: ['मदत', 'तुम्ही काय करू शकता', 'आदेश']
          },
          responses: {
            welcome: 'नमस्कार! मी मेदिनी, तुमची AI आरोग्य सहायक आहे. मी तुम्हाला सल्लामसलत बुक करण्यात मदत करू शकते. "सल्लामसलत सुरू करा" म्हणा.',
            starting: 'तुमची सल्लामसलत बुकिंग सुरू करत आहे.',
            next: 'पुढच्या टप्प्यात जात आहोत.',
            back: 'आधीच्या टप्प्यात परत जात आहोत.',
            help: 'तुम्ही म्हणू शकता: सल्लामसलत सुरू करा, पुढे, मागे, किंवा मदत.',
            notUnderstood: 'मला समजले नाही. कृपया "सल्लामसलत सुरू करा" किंवा "मदत" म्हणा.'
          }
        };
      case Language.Punjabi:
        return {
          speechLang: 'pa-IN',
          voiceNames: ['Google Punjabi Female', 'Microsoft Punjabi', 'Google Punjabi'],
          commands: {
            start: ['ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ', 'ਡਾਕਟਰ ਮੁਲਾਕਾਤ', 'ਮੈਡੀਕਲ ਸਹਾਇਤਾ'],
            next: ['ਅਗਲਾ', 'ਜਾਰੀ ਰੱਖੋ', 'ਅੱਗੇ'],
            back: ['ਪਿੱਛੇ', 'ਪਹਿਲਾਂ ਵਾਲਾ', 'ਵਾਪਸ'],
            help: ['ਮਦਦ', 'ਤੁਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹੋ', 'ਕਮਾਂਡ']
          },
          responses: {
            welcome: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਮੇਦਿਨੀ ਹਾਂ, ਤੁਹਾਡੀ AI ਸਿਹਤ ਸਹਾਇਕ। ਮੈਂ ਤੁਹਾਨੂੰ ਸਲਾਹ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ। "ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ" ਕਹੋ।',
            starting: 'ਤੁਹਾਡੀ ਸਲਾਹ ਬੁਕਿੰਗ ਸ਼ੁਰੂ ਕਰ ਰਹੇ ਹਾਂ।',
            next: 'ਅਗਲੇ ਕਦਮ ਵੱਲ ਜਾ ਰਹੇ ਹਾਂ।',
            back: 'ਪਿਛਲੇ ਕਦਮ ਵੱਲ ਵਾਪਸ ਜਾ ਰਹੇ ਹਾਂ।',
            help: 'ਤੁਸੀਂ ਕਹਿ ਸਕਦੇ ਹੋ: ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ, ਅਗਲਾ, ਪਿੱਛੇ, ਜਾਂ ਮਦਦ।',
            notUnderstood: 'ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ "ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ" ਜਾਂ "ਮਦਦ" ਕਹੋ।'
          }
        };
      case Language.Gujarati:
        return {
          speechLang: 'gu-IN',
          voiceNames: ['Google Gujarati Female', 'Microsoft Gujarati', 'Google Gujarati'],
          commands: {
            start: ['સલાહ શરૂ કરો', 'ડૉક્ટર મુલાકાત', 'તબીબી મદદ'],
            next: ['આગળ', 'ચાલુ રાખો', 'આગામી'],
            back: ['પાછળ', 'અગાઉનું', 'પાછા જાઓ'],
            help: ['મદદ', 'તમે શું કરી શકો છો', 'આદેશો']
          },
          responses: {
            welcome: 'નમસ્કાર! હું મેદિની છું, તમારી AI આરોગ્य સહાયક. હું તમને સલાહ બુક કરવામાં મદદ કરી શકું છું. "સલાહ શરૂ કરો" કહો.',
            starting: 'તમારી સલાહ બુકિંગ શરૂ કરી રહ્યા છીએ.',
            next: 'આગળના પગલા પર જઈ રહ્યા છીએ.',
            back: 'અગાઉના પગલા પર પાછા જઈ રહ્યા છીએ.',
            help: 'તમે કહી શકો છો: સલાહ શરૂ કરો, આગળ, પાછળ, અથવા મદદ.',
            notUnderstood: 'મને સમજાયું નહીં. કૃપા કરીને "સલાહ શરૂ કરો" અથવા "મદદ" કહો.'
          }
        };
      case Language.Kannada:
        return {
          speechLang: 'kn-IN',
          voiceNames: ['Google Kannada Female', 'Microsoft Kannada', 'Google Kannada'],
          commands: {
            start: ['ಸಲಹೆ ಪ್ರಾರಂಭಿಸಿ', 'ವೈದ್ಯರ ಅಪಾಯಿಂಟ್ಮೆಂಟ್', 'ವೈದ್ಯಕೀಯ ಸಹಾಯ'],
            next: ['ಮುಂದೆ', 'ಮುಂದುವರಿಸಿ', 'ಮುಂದಿನ'],
            back: ['ಹಿಂದೆ', 'ಹಿಂದಿನ', 'ಹಿಂತಿರುಗಿ'],
            help: ['ಸಹಾಯ', 'ನೀವು ಏನು ಮಾಡಬಹುದು', 'ಆದೇಶಗಳು']
          },
          responses: {
            welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಮೆದಿನಿ, ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಸಲಹೆ ಬುಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡಬಹುದು. "ಸಲಹೆ ಪ್ರಾರಂಭಿಸಿ" ಎಂದು ಹೇಳಿ.',
            starting: 'ನಿಮ್ಮ ಸಲಹೆ ಬುಕಿಂಗ್ ಪ್ರಾರಂಭಿಸುತ್ತಿದ್ದೇವೆ.',
            next: 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇವೆ.',
            back: 'ಹಿಂದಿನ ಹಂತಕ್ಕೆ ಹಿಂತಿರುಗುತ್ತಿದ್ದೇವೆ.',
            help: 'ನೀವು ಹೇಳಬಹುದು: ಸಲಹೆ ಪ್ರಾರಂಭಿಸಿ, ಮುಂದೆ, ಹಿಂದೆ, ಅಥವಾ ಸಹಾಯ.',
            notUnderstood: 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು "ಸಲಹೆ ಪ್ರಾರಂಭಿಸಿ" ಅಥವಾ "ಸಹಾಯ" ಎಂದು ಹೇಳಿ.'
          }
        };
      case Language.Malayalam:
        return {
          speechLang: 'ml-IN',
          voiceNames: ['Google Malayalam Female', 'Microsoft Malayalam', 'Google Malayalam'],
          commands: {
            start: ['കൺസൾട്ടേഷൻ തുടങ്ങുക', 'ഡോക്ടർ അപ്പോയിൻറ്മെൻ്റ്', 'മെഡിക്കൽ സഹായം'],
            next: ['അടുത്തത്', 'തുടരുക', 'മുന്നോട്ട്'],
            back: ['പിന്നോട്ട്', 'മുമ്പത്തെ', 'തിരികെ'],
            help: ['സഹായം', 'നിങ്ങൾക്ക് എന്തു ചെയ്യാൻ കഴിയും', 'കമാൻഡുകൾ']
          },
          responses: {
            welcome: 'നമസ്കാരം! ഞാൻ മെദിനി, നിങ്ങളുടെ AI ആരോഗ്യ സഹായി. എനിക്ക് നിങ്ങളെ കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യാൻ സഹായിക്കാം. "കൺസൾട്ടേഷൻ തുടങ്ങുക" എന്ന് പറയുക.',
            starting: 'നിങ്ങളുടെ കൺസൾട്ടേഷൻ ബുക്കിംഗ് തുടങ്ങുന്നു.',
            next: 'അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നു.',
            back: 'മുമ്പത്തെ ഘട്ടത്തിലേക്ക് തിരികെ പോകുന്നു.',
            help: 'നിങ്ങൾക്ക് പറയാം: കൺസൾട്ടേഷൻ തുടങ്ങുക, അടുത്തത്, പിന്നോട്ട്, അല്ലെങ്കിൽ സഹായം.',
            notUnderstood: 'എനിക്ക് മനസ്സിലായില്ല. "കൺസൾട്ടേഷൻ തുടങ്ങുക" അല്ലെങ്കിൽ "സഹായം" എന്ന് പറയുക.'
          }
        };
      case Language.Odia:
        return {
          speechLang: 'or-IN',
          voiceNames: ['Google Oriya Female', 'Microsoft Oriya', 'Google Oriya'],
          commands: {
            start: ['ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ', 'ଡାକ୍ତର ସାକ୍ଷାତ', 'ଚିକିତ୍ସା ସହାୟତା'],
            next: ['ପରବର୍ତ୍ତୀ', 'ଚାଲୁ ରଖନ୍ତୁ', 'ଆଗକୁ'],
            back: ['ପଛକୁ', 'ପୂର୍ବ', 'ଫେରନ୍ତୁ'],
            help: ['ସହାୟତା', 'ଆପଣ କଣ କରିପାରିବେ', 'ନିର୍ଦ୍ଦେଶ']
          },
          responses: {
            welcome: 'ନମସ୍କାର! ମୁଁ ମେଦିନୀ, ଆପଣଙ୍କର AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ ପରାମର୍ଶ ବୁକ୍ କରିବାରେ ସହାୟତା କରିପାରିବି। "ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ" କୁହନ୍ତୁ।',
            starting: 'ଆପଣଙ୍କର ପରାମର୍ଶ ବୁକିଂ ଆରମ୍ଭ କରୁଛି।',
            next: 'ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପକୁ ଯାଉଛି।',
            back: 'ପୂର୍ବ ପଦକ୍ଷେପକୁ ଫେରୁଛି।',
            help: 'ଆପଣ କହିପାରିବେ: ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ, ପରବର୍ତ୍ତୀ, ପଛକୁ, କିମ୍ବା ସହାୟତା।',
            notUnderstood: 'ମୁଁ ବୁଝିପାରିଲି ନାହିଁ। ଦୟାକରି "ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ" କିମ୍ବା "ସହାୟତା" କୁହନ୍ତୁ।'
          }
        };
      case Language.Assamese:
        return {
          speechLang: 'as-IN',
          voiceNames: ['Google Assamese Female', 'Microsoft Assamese', 'Google Assamese'],
          commands: {
            start: ['পৰামৰ্শ আৰম্ভ কৰক', 'ডাক্তৰ সাক্ষাৎ', 'চিকিৎসা সহায়'],
            next: ['পৰৱৰ্তী', 'অব্যাহত ৰাখক', 'আগলৈ'],
            back: ['পিছলৈ', 'পূৰ্বৱৰ্তী', 'উভতি যাওক'],
            help: ['সহায়', 'আপুনি কি কৰিব পাৰে', 'আদেশ']
          },
          responses: {
            welcome: 'নমস্কাৰ! মই মেদিনী, আপোনাৰ AI স্বাস্থ্য সহায়ক। মই আপোনাক পৰামৰ্শ বুক কৰাত সহায় কৰিব পাৰো। "পৰামৰ্শ আৰম্ভ কৰক" কওক।',
            starting: 'আপোনাৰ পৰামৰ্শ বুকিং আৰম্ভ কৰি আছো।',
            next: 'পৰৱৰ্তী পদক্ষেপলৈ যাইছো।',
            back: 'পূৰ্বৱৰ্তী পদক্ষেপলৈ উভতি যাইছো।',
            help: 'আপুনি কব পাৰে: পৰামৰ্শ আৰম্ভ কৰক, পৰৱৰ্তী, পিছলৈ, বা সহায়।',
            notUnderstood: 'মই বুজিব পৰা নাই। অনুগ্ৰহ কৰি "পৰামৰ্শ আৰম্ভ কৰক" বা "সহায়" কওক।'
          }
        };

      default: // English and all other languages
        return {
          speechLang: 'en-US',
          voiceNames: ['Microsoft Zira', 'Google US English', 'Microsoft David'],
          commands: {
            start: ['start consultation', 'book appointment', 'see doctor', 'begin consultation'],
            next: ['next', 'continue', 'proceed', 'go ahead'],
            back: ['back', 'previous', 'return', 'go back'],
            help: ['help', 'what can you do', 'commands', 'assist me']
          },
          responses: {
            welcome: 'Hello! I am Medini, your AI health assistant. I can help you book a consultation. Say "start consultation" to begin.',
            starting: 'Starting your consultation booking now.',
            next: 'Moving to the next step.',
            back: 'Going back to the previous step.',
            help: 'You can say: start consultation, next, back, or help.',
            notUnderstood: 'I did not understand. Please try saying "start consultation" or "help".'
          }
        };
    }
  };
  
  const currentConfig = getCurrentConfig();

  // Speech synthesis function
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = currentConfig.speechLang;
    
    // Voice settings for human-like feminine speech
    utterance.pitch = 1.0; // Neutral pitch
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.volume = 1.0;

    // Wait for voices to be loaded
    const selectAndSpeak = () => {
      const voices = synthRef.current?.getVoices() || [];
      let selectedVoice = null;

      // First try to find female voices for the language
      const langCode = currentConfig.speechLang.split('-')[0];
      
      console.log(`Looking for voice for language: ${currentConfig.speechLang}`);
      console.log('Available voices for this language:', voices.filter(v => v.lang.startsWith(langCode)).map(v => ({ name: v.name, lang: v.lang })));
      
      // Language-specific voice selection with improved logic
      if (currentConfig.speechLang === 'ta-IN') {
        console.log('Searching for Tamil voices...');
        console.log('All available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
        
        // Tamil-specific logic - try multiple approaches
        // 1. Exact Tamil language match with preferred names
        selectedVoice = voices.find(voice => 
          voice.lang === 'ta-IN' && 
          (voice.name.toLowerCase().includes('heera') ||
           voice.name.toLowerCase().includes('tamil') ||
           voice.name.toLowerCase().includes('valluvar'))
        );
        console.log('Tamil voice with preferred names:', selectedVoice?.name);
        
        // 2. Any exact Tamil language match
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'ta-IN');
          console.log('Any Tamil voice (ta-IN):', selectedVoice?.name);
        }
        
        // 3. Look for Tamil in language code variations
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.toLowerCase().includes('ta') ||
            voice.lang.toLowerCase().includes('tamil')
          );
          console.log('Tamil by language variations:', selectedVoice?.name);
        }
        
        // 4. Look for Tamil in voice name
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('tamil') ||
            voice.name.toLowerCase().includes('தமிழ்') ||
            voice.name.toLowerCase().includes('valluvar') ||
            voice.name.toLowerCase().includes('heera')
          );
          console.log('Tamil by voice name:', selectedVoice?.name);
        }
        
        // 5. If still no Tamil voice, try Indian English as fallback
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang === 'en-IN' ||
            (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('india'))
          );
          console.log('Indian English fallback:', selectedVoice?.name);
        }
      } else if (currentConfig.speechLang === 'hi-IN') {
        // Hindi-specific logic - prioritize Hindi female voices
        selectedVoice = voices.find(voice => 
          voice.lang === 'hi-IN' && 
          (voice.name.toLowerCase().includes('kalpana') ||
           voice.name.toLowerCase().includes('heera'))
        );
        
        // Fallback to any Hindi voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'hi-IN');
        }
        
        // Last resort - look for Hindi in name
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('hindi')
          );
        }
      } else if (currentConfig.speechLang === 'en-US') {
        // English-specific logic - prioritize female voices
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-US' && 
          (voice.name.toLowerCase().includes('zira') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        // Fallback to any US English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'en-US');
        }
      } else if (currentConfig.speechLang === 'te-IN') {
        // Telugu-specific logic - comprehensive approach like Tamil
        console.log('Searching for Telugu voices...');
        console.log('All available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
        
        // 1. Exact Telugu language match with preferred names
        selectedVoice = voices.find(voice => 
          voice.lang === 'te-IN' && 
          (voice.name.toLowerCase().includes('telugu') ||
           voice.name.toLowerCase().includes('female'))
        );
        console.log('Telugu voice with preferred names:', selectedVoice?.name);
        
        // 2. Any exact Telugu language match
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'te-IN');
          console.log('Any Telugu voice (te-IN):', selectedVoice?.name);
        }
        
        // 3. Look for Telugu in language code variations
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.toLowerCase().includes('te') ||
            voice.lang.toLowerCase().includes('telugu')
          );
          console.log('Telugu by language variations:', selectedVoice?.name);
        }
        
        // 4. Look for Telugu in voice name
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('telugu') &&
            !voice.lang.startsWith('zh')
          );
          console.log('Telugu by voice name:', selectedVoice?.name);
        }
        
        // 5. If still no Telugu voice, try Indian English as fallback
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang === 'en-IN' ||
            (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('india'))
          );
          console.log('Indian English fallback for Telugu:', selectedVoice?.name);
        }
      } else if (currentConfig.speechLang === 'bn-IN') {
        // Bengali-specific logic - comprehensive approach like Tamil
        console.log('Searching for Bengali voices...');
        console.log('All available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
        
        // 1. Exact Bengali language match with preferred names
        selectedVoice = voices.find(voice => 
          voice.lang === 'bn-IN' && 
          (voice.name.toLowerCase().includes('bengali') ||
           voice.name.toLowerCase().includes('female'))
        );
        console.log('Bengali voice with preferred names:', selectedVoice?.name);
        
        // 2. Any exact Bengali language match
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'bn-IN');
          console.log('Any Bengali voice (bn-IN):', selectedVoice?.name);
        }
        
        // 3. Look for Bengali in language code variations
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.toLowerCase().includes('bn') ||
            voice.lang.toLowerCase().includes('bengali')
          );
          console.log('Bengali by language variations:', selectedVoice?.name);
        }
        
        // 4. Look for Bengali in voice name
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('bengali') &&
            !voice.lang.startsWith('zh')
          );
          console.log('Bengali by voice name:', selectedVoice?.name);
        }
        
        // 5. If still no Bengali voice, try Indian English as fallback
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang === 'en-IN' ||
            (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('india'))
          );
          console.log('Indian English fallback for Bengali:', selectedVoice?.name);
        }
      } else if (currentConfig.speechLang === 'mr-IN') {
        // Marathi-specific logic
        console.log('Searching for Marathi voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'mr-IN' && 
          (voice.name.toLowerCase().includes('marathi') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'mr-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('marathi') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Marathi voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'gu-IN') {
        // Gujarati-specific logic
        console.log('Searching for Gujarati voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'gu-IN' && 
          (voice.name.toLowerCase().includes('gujarati') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'gu-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('gujarati') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Gujarati voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'kn-IN') {
        // Kannada-specific logic
        console.log('Searching for Kannada voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'kn-IN' && 
          (voice.name.toLowerCase().includes('kannada') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'kn-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('kannada') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Kannada voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'ml-IN') {
        // Malayalam-specific logic
        console.log('Searching for Malayalam voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'ml-IN' && 
          (voice.name.toLowerCase().includes('malayalam') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'ml-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('malayalam') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Malayalam voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'pa-IN') {
        // Punjabi-specific logic
        console.log('Searching for Punjabi voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'pa-IN' && 
          (voice.name.toLowerCase().includes('punjabi') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'pa-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('punjabi') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Punjabi voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'or-IN') {
        // Odia-specific logic
        console.log('Searching for Odia voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'or-IN' && 
          (voice.name.toLowerCase().includes('oriya') ||
           voice.name.toLowerCase().includes('odia') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'or-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            (voice.name.toLowerCase().includes('oriya') ||
             voice.name.toLowerCase().includes('odia')) &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Odia voice selected:', selectedVoice?.name);
      } else if (currentConfig.speechLang === 'as-IN') {
        // Assamese-specific logic
        console.log('Searching for Assamese voices...');
        
        selectedVoice = voices.find(voice => 
          voice.lang === 'as-IN' && 
          (voice.name.toLowerCase().includes('assamese') ||
           voice.name.toLowerCase().includes('female'))
        );
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'as-IN');
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('assamese') &&
            !voice.lang.startsWith('zh')
          );
        }
        console.log('Assamese voice selected:', selectedVoice?.name);
      } else {
        // Generic fallback for any other language - but be very careful about Chinese
        const potentialVoice = voices.find(voice => 
          voice.lang.startsWith(langCode) && 
          !voice.lang.startsWith('zh') && // Avoid Chinese
          !voice.name.toLowerCase().includes('chinese') &&
          !voice.name.toLowerCase().includes('中文') &&
          voice.name.toLowerCase().includes('female')
        );
        
        // If no female voice, try any non-Chinese voice for the language
        if (!potentialVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith(langCode) &&
            !voice.lang.startsWith('zh') && // Avoid Chinese
            !voice.name.toLowerCase().includes('chinese') &&
            !voice.name.toLowerCase().includes('中文')
          );
        } else {
          selectedVoice = potentialVoice;
        }
        
        // If we got a Chinese voice somehow, reject it immediately
        if (selectedVoice && (
          selectedVoice.lang.startsWith('zh') || 
          selectedVoice.name.toLowerCase().includes('chinese') ||
          selectedVoice.name.toLowerCase().includes('中文')
        )) {
          console.log('Rejecting Chinese voice:', selectedVoice.name);
          selectedVoice = null;
        }
        
        console.log(`Looking for ${langCode} voice, found:`, selectedVoice?.name || 'none');
      }
      
      // If no specific voice found, try the configured voice names
      if (!selectedVoice) {
        for (const voiceName of currentConfig.voiceNames) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes(voiceName.toLowerCase())
          );
          if (selectedVoice) {
            console.log(`Found configured voice: ${selectedVoice.name}`);
            break;
          }
        }
      }

      // Smart fallback hierarchy for Indian languages
      if (!selectedVoice) {
        console.log(`No ${langCode} voice found, using fallback hierarchy...`);
        
        // 1. Try Indian English first
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-IN' || 
          (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('india'))
        );
        console.log('Indian English fallback:', selectedVoice?.name || 'none');
        
        // 2. Try Hindi as second fallback
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang === 'hi-IN' || 
            voice.name.toLowerCase().includes('hindi')
          );
          console.log('Hindi fallback:', selectedVoice?.name || 'none');
        }
        
        // 3. Try any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.toLowerCase().includes('zira') ||
             voice.name.toLowerCase().includes('david') ||
             voice.name.toLowerCase().includes('female'))
          );
          console.log('English fallback:', selectedVoice?.name || 'none');
        }
        
        // 4. Any US English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang === 'en-US');
          console.log('US English fallback:', selectedVoice?.name || 'none');
        }
      }

      // Final fallback - but avoid Chinese/other random languages
      if (!selectedVoice) {
        // Look for any English voice as absolute last resort
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        
        if (!selectedVoice && voices.length > 0) {
          // Only use first available if it's not an Asian language we don't want
          const firstVoice = voices[0];
          if (!firstVoice.lang.startsWith('zh') && 
              !firstVoice.lang.startsWith('ja') && 
              !firstVoice.lang.startsWith('ko')) {
            selectedVoice = firstVoice;
          } else {
            // Find any non-Asian voice
            selectedVoice = voices.find(voice => 
              !voice.lang.startsWith('zh') && 
              !voice.lang.startsWith('ja') && 
              !voice.lang.startsWith('ko')
            ) || voices[0]; // Absolute last resort
          }
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.log('No suitable voice found, using default');
      }

      utterance.onend = () => {
        console.log('Speech ended');
        // Don't auto-restart listening to prevent unwanted activation
        // User must manually activate listening
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
      };

      synthRef.current?.speak(utterance);
    };

    // Check if voices are loaded
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      selectAndSpeak();
    } else {
      // Wait for voices to load
      synthRef.current.onvoiceschanged = () => {
        selectAndSpeak();
        synthRef.current!.onvoiceschanged = null; // Remove listener after use
      };
    }
  }, [currentConfig, currentLanguage, isListening]);

  // Command matching function
  const matchCommand = useCallback((spokenText: string): string | null => {
    const text = spokenText.toLowerCase().trim();
    
    // Check each command category
    for (const [commandType, phrases] of Object.entries(currentConfig.commands)) {
      for (const phrase of phrases) {
        if (text.includes(phrase.toLowerCase())) {
          return commandType;
        }
      }
    }
    
    return null;
  }, [currentConfig]);

  // Handle recognized speech
  const handleSpeechResult = useCallback((transcript: string) => {
    console.log('Recognized:', transcript);
    setMessage(`You said: "${transcript}"`);
    setShowMessage(true);
    
    const command = matchCommand(transcript);
    
    if (command === 'start') {
      setMessage(currentConfig.responses.starting);
      speak(currentConfig.responses.starting);
      onCommand?.('start');
    } else if (command === 'next') {
      setMessage(currentConfig.responses.next);
      speak(currentConfig.responses.next);
      onCommand?.('next');
    } else if (command === 'back') {
      setMessage(currentConfig.responses.back);
      speak(currentConfig.responses.back);
      onCommand?.('back');
    } else if (command === 'help') {
      setMessage(currentConfig.responses.help);
      speak(currentConfig.responses.help);
    } else {
      setMessage(currentConfig.responses.notUnderstood);
      speak(currentConfig.responses.notUnderstood);
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  }, [currentConfig, matchCommand, speak, onCommand]);

  // Start listening function
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported || recognitionActive) return;

    try {
      // Only start if recognition is not already running
      if (recognitionRef.current && isListening && !recognitionActive) {
        recognitionRef.current.start();
        console.log('Started listening in', currentConfig.speechLang);
      }
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
      setRecognitionActive(false);
    }
  }, [currentConfig.speechLang, isSupported, recognitionActive, isListening]);

  // Toggle voice assistant
  const toggleVoiceAssistant = () => {
    if (!isSupported) return;

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsListening(false);
      setShowMessage(false);
    } else {
      // Start listening
      setIsListening(true);
      setMessage(currentConfig.responses.welcome);
      setShowMessage(true);
      speak(currentConfig.responses.welcome);
    }
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check browser support
    const speechSynthSupported = 'speechSynthesis' in window;
    const speechRecogSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    if (!speechSynthSupported || !speechRecogSupported) {
      setIsSupported(false);
      console.error('Speech APIs not supported');
      return;
    }

    setIsSupported(true);

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;
    
    // Debug: Log available voices
    synthRef.current.onvoiceschanged = () => {
      const voices = synthRef.current?.getVoices() || [];
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    };

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.lang = currentConfig.speechLang;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Set up event handlers
    recognition.onstart = () => {
      setRecognitionActive(true);
      console.log('Recognition started');
    };

    recognition.onresult = (event) => {
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        handleSpeechResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setRecognitionActive(false);
      
      // Don't auto-restart on errors to prevent unwanted listening
      if (event.error === 'aborted') {
        console.log('Recognition aborted');
      } else {
        console.log('Recognition error, not auto-restarting:', event.error);
      }
    };

    recognition.onend = () => {
      setRecognitionActive(false);
      console.log('Recognition ended');
      
      // Don't auto-restart - user must manually activate listening
      // This prevents unwanted auto-listening behavior
      console.log('Recognition ended, not auto-restarting');
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentConfig.speechLang, handleSpeechResult, isListening, startListening]);

  // Handle language changes
  useEffect(() => {
    if (recognitionRef.current && isSupported) {
      // Update recognition language
      recognitionRef.current.lang = currentConfig.speechLang;
      
      // If currently listening, restart with new language
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => {
          speak(currentConfig.responses.welcome);
        }, 500);
      }
    }
  }, [currentLanguage, isSupported, isListening, currentConfig, speak]);

  if (!isSupported) {
    return null; // Don't show anything if not supported
  }

  return (
    <>
      {/* Floating Voice Assistant Button */}
      <div
        onClick={toggleVoiceAssistant}
        style={{
          position: 'fixed',
          bottom: '140px',
          right: '30px',
          width: '60px',
          height: '60px',
          backgroundColor: isListening ? '#4CAF50' : '#2196F3',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        <span style={{ fontSize: '24px', color: 'white' }}>
          {isListening ? '🎤' : '🤖'}
        </span>
      </div>

      {/* Message Bubble */}
      {showMessage && message && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            maxWidth: '300px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '18px',
            fontSize: '14px',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {message}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '20px',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(0,0,0,0.8)'
            }}
          />
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default FloatingVoiceAssistant;
