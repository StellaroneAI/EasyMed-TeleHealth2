import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  isActive?: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand, isActive = true }) => {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  // Get current language (en, hi, ta)
  const currentLang = i18n.language.split('-')[0];
  
  // Language configuration
  const languageConfig = {
    en: {
      speechLang: 'en-US',
      commands: {
        start: ['start consultation', 'book appointment', 'see doctor', 'begin'],
        next: ['next', 'continue', 'proceed'],
        back: ['back', 'previous', 'return'],
        help: ['help', 'what can you do', 'commands']
      },
      responses: {
        welcome: 'Hello! I can help you book a consultation. Say "start consultation" to begin.',
        starting: 'Starting your consultation booking.',
        next: 'Moving to the next step.',
        back: 'Going back to the previous step.',
        help: 'You can say: start consultation, next, back, or help.',
        notUnderstood: 'I didn\'t understand. Please try saying "start consultation" or "help".'
      }
    },
    hi: {
      speechLang: 'hi-IN',
      commands: {
        start: ['परामर्श शुरू करें', 'डॉक्टर से मिलें', 'अपॉइंटमेंट', 'शुरू करें'],
        next: ['आगे', 'अगला', 'जारी रखें'],
        back: ['वापस', 'पीछे', 'पहले'],
        help: ['मदद', 'सहायता', 'कमांड']
      },
      responses: {
        welcome: 'नमस्ते! मैं आपको परामर्श बुक करने में मदद कर सकता हूं। "परामर्श शुरू करें" कहें।',
        starting: 'आपका परामर्श बुकिंग शुरू कर रहा हूं।',
        next: 'अगले चरण पर जा रहे हैं।',
        back: 'पिछले चरण पर वापस जा रहे हैं।',
        help: 'आप कह सकते हैं: परामर्श शुरू करें, आगे, वापस, या मदद।',
        notUnderstood: 'मैं समझ नहीं पाया। कृपया "परामर्श शुरू करें" या "मदद" कहें।'
      }
    },
    ta: {
      speechLang: 'ta-IN',
      commands: {
        start: ['ஆலோசனை தொடங்கு', 'மருத்துவரை பார்க்க', 'அப்பாயிண்ட்மென்ட்', 'தொடங்கு'],
        next: ['அடுத்தது', 'முன்னேறு', 'தொடர்க'],
        back: ['பின்னால்', 'முந்தைய', 'திரும்பு'],
        help: ['உதவி', 'கமாண்ட்', 'என்ன செய்யலாம்']
      },
      responses: {
        welcome: 'வணக்கம்! நான் உங்களுக்கு ஆலோசனை பதிவு செய்ய உதவ முடியும். "ஆலோசனை தொடங்கு" என்று சொல்லுங்கள்.',
        starting: 'உங்கள் ஆலோசனை பதிவை தொடங்குகிறேன்.',
        next: 'அடுத்த படிக்கு செல்கிறோம்.',
        back: 'முந்தைய படிக்கு திரும்புகிறோம்.',
        help: 'நீங்கள் சொல்லலாம்: ஆலோசனை தொடங்கு, அடுத்தது, பின்னால், அல்லது உதவி.',
        notUnderstood: 'எனக்கு புரியவில்லை. தயவுசெய்து "ஆலோசனை தொடங்கு" அல்லது "உதவி" என்று சொல்லுங்கள்.'
      }
    }
  };

  // Get current language configuration
  const currentConfig = languageConfig[currentLang as keyof typeof languageConfig] || languageConfig.en;

  const handleClick = () ={
    setIsListening(!isListening);
    if (!isListening) {
      speak(currentConfig.responses.welcome);
      startListening();
    } else {
      stopListening();
    }
  }

  const stopListening = () ={
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }
  
  
  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (!isActive) return;
    
    // Check if speech APIs are supported
    const speechSupported = 'speechSynthesis' in window && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setIsSupported(speechSupported);
    
    if (!speechSupported) {
      setMessage('Voice assistant is not supported in this browser.');
      return;
    }
    const synth = window.speechSynthesis;
    let recognition: SpeechRecognition | null = null;

    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = voiceSettings.language;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = true; // Keep listening
    }

    // Enhanced speak function with custom settings
    const speak = (text: string, settings: VoiceSettings = voiceSettings) => {
      if (!synth) return;
      
      // Stop any ongoing speech
      synth.cancel();
      
      const utterThis = new SpeechSynthesisUtterance(text);
      
      // Wait for voices to load if not already loaded
      const setVoice = () => {
        const voices = synth.getVoices();
        
        // Try to find preferred voice
        let selectedVoice = voices.find(voice => 
          voice.name.includes(settings.voiceName || 'Google') && 
          voice.lang.startsWith(settings.language.split('-')[0])
        );
        
        // Fallback to any female voice for more human-like sound
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel')
          );
        }
        
        // Final fallback to first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
        }
        
        utterThis.voice = selectedVoice;
        utterThis.pitch = settings.pitch;
        utterThis.rate = settings.rate;
        utterThis.volume = settings.volume;
        
        // Add emotion and pauses for more natural speech
        utterThis.onstart = () => console.log('Speech started');
        utterThis.onend = () => {
          console.log('Speech ended');
          // Restart listening after speaking
          if (recognition && !isListening) {
            setTimeout(() => {
              setIsListening(true);
              recognition.start();
            }, 500);
          }
        };
        
        synth.speak(utterThis);
      };
      
      if (synth.getVoices().length > 0) {
        setVoice();
      } else {
        synth.onvoiceschanged = setVoice;
      }
    };

    const handleCommand = (command: string) => {
      if (command.includes('start consultation')) {
        setMessage('Starting your consultation.');
        speak('Starting your consultation.');
      } else if (command.includes('next')) {
        setMessage('Moving to the next step.');
        speak('Moving to the next step.');
      } else {
        setMessage('Say start consultation or next.');
        speak('I did not understand, please say, start consultation or next.');
      }
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ' + event.error);
      speak('Error occurred, please try again.');
    };

    const startListening = () => {
      recognition.start();
    };

    speak(message);
    startListening();

    return () => {
      recognition.stop();
    };
  }, []);

  return <div>{message}</div>;
};

export default VoiceAssistant;
