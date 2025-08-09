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
      voiceNames: ['Microsoft Zira', 'Google US English', 'Microsoft David'],
      commands: {
        start: ['start consultation', 'book appointment', 'see doctor', 'begin consultation'],
        next: ['next', 'continue', 'proceed', 'go ahead'],
        back: ['back', 'previous', 'return', 'go back'],
        help: ['help', 'what can you do', 'commands', 'assist me']
      },
      responses: {
        welcome: 'Hello! I can help you book a consultation. Say start consultation to begin.',
        starting: 'Starting your consultation booking now.',
        next: 'Moving to the next step.',
        back: 'Going back to the previous step.',
        help: 'You can say: start consultation, next, back, or help.',
        notUnderstood: 'I did not understand. Please try saying start consultation or help.'
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
        welcome: 'नमस्ते! मैं आपको परामर्श बुक करने में मदद कर सकता हूं। परामर्श शुरू करें कहें।',
        starting: 'आपका परामर्श बुकिंग शुरू कर रहा हूं।',
        next: 'अगले चरण पर जा रहे हैं।',
        back: 'पिछले चरण पर वापस जा रहे हैं।',
        help: 'आप कह सकते हैं: परामर्श शुरू करें, आगे, वापस, या मदद।',
        notUnderstood: 'मैं समझ नहीं पाया। कृपया परामर्श शुरू करें या मदद कहें।'
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
        welcome: 'வணக்கம்! நான் உங்களுக்கு ஆலோசனை பதிவு செய்ய உதவ முடியும். ஆலோசனை தொடங்கு என்று சொல்லுங்கள்.',
        starting: 'உங்கள் ஆலோசனை பதிவை தொடங்குகிறேன்.',
        next: 'அடுத்த படிக்கு செல்கிறோம்.',
        back: 'முந்தைய படிக்கு திரும்புகிறோம்.',
        help: 'நீங்கள் சொல்லலாம்: ஆலோசனை தொடங்கு, அடுத்தது, பின்னால், அல்லது உதவி.',
        notUnderstood: 'எனக்கு புரியவில்லை. தயவுசெய்து ஆலோசனை தொடங்கு அல்லது உதவி என்று சொல்லுங்கள்.'
      }
    }
  };

  // Get current language configuration
  const currentConfig = languageConfig[currentLang as keyof typeof languageConfig] || languageConfig.en;

  // Speech synthesis function
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = currentConfig.speechLang;
    
    // Voice settings for more human-like speech
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.rate = 0.85; // Slower for clarity
    utterance.volume = 1.0;

    // Try to find appropriate voice
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;

    // First try to find language-specific voice
    for (const voiceName of currentConfig.voiceNames) {
      selectedVoice = voices.find(voice => 
        voice.name.includes(voiceName) && 
        voice.lang.startsWith(currentLang)
      );
      if (selectedVoice) break;
    }

    // Fallback to any voice of the correct language
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.startsWith(currentLang));
    }

    // Final fallback to first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    }

    utterance.onend = () => {
      console.log('Speech ended');
      // Restart listening after speech
      if (recognitionRef.current && isSupported && isActive) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
    };

    synthRef.current.speak(utterance);
  }, [currentConfig, currentLang, isSupported, isActive]);

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
  }, [currentConfig, matchCommand, speak, onCommand]);

  // Start listening function
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported || !isActive || isListening) return;

    try {
      setIsListening(true);
      recognitionRef.current.start();
      console.log('Started listening in', currentConfig.speechLang);
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  }, [currentConfig.speechLang, isSupported, isActive, isListening]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check browser support
    const speechSynthSupported = 'speechSynthesis' in window;
    const speechRecogSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    if (!speechSynthSupported || !speechRecogSupported) {
      setIsSupported(false);
      setMessage('Voice assistant is not supported in this browser.');
      console.error('Speech APIs not supported');
      return;
    }

    setIsSupported(true);

    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.lang = currentConfig.speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Set up event handlers
    recognition.onresult = (event) => {
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        handleSpeechResult(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        // Restart listening after no speech detected
        setTimeout(() => {
          if (isActive) startListening();
        }, 1000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart listening if still active
      if (isActive) {
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    setIsInitialized(true);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentConfig.speechLang, handleSpeechResult, isActive, startListening]);

  // Start the voice assistant when initialized
  useEffect(() => {
    if (isInitialized && isSupported && isActive) {
      // Wait for voices to load
      const startAssistant = () => {
        setMessage(currentConfig.responses.welcome);
        speak(currentConfig.responses.welcome);
      };

      if (synthRef.current && synthRef.current.getVoices().length > 0) {
        startAssistant();
      } else if (synthRef.current) {
        synthRef.current.onvoiceschanged = () => {
          startAssistant();
        };
      }
    }
  }, [isInitialized, isSupported, isActive, currentConfig.responses.welcome, speak]);

  // Handle language changes
  useEffect(() => {
    if (recognitionRef.current && isInitialized) {
      // Update recognition language
      recognitionRef.current.lang = languageConfig[currentLang as keyof typeof languageConfig]?.speechLang || 'en-US';
      
      // Restart with new language
      if (isListening) {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (isActive) startListening();
        }, 500);
      }

      // Announce language change
      const newConfig = languageConfig[currentLang as keyof typeof languageConfig] || languageConfig.en;
      speak(newConfig.responses.welcome);
    }
  }, [currentLang, isInitialized, isListening, isActive, startListening, speak]);

  if (!isSupported) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <p>❌ Voice Assistant not supported in this browser</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px', margin: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>
          {isListening ? '🎤' : '🔇'}
        </span>
        <div>
          <strong>Voice Assistant ({currentLang.toUpperCase()})</strong>
          <br />
          <span style={{ fontSize: '14px', color: '#666' }}>
            Status: {isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>
      {message && (
        <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '3px' }}>
          {message}
        </div>
      )}
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
        Available commands: {currentConfig.commands.start[0]}, {currentConfig.commands.next[0]}, {currentConfig.commands.back[0]}, {currentConfig.commands.help[0]}
      </div>
    </div>
  );
};

export default VoiceAssistant;
