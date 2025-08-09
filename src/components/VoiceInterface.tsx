import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface VoiceInterfaceProps {
  onVoiceCommand?: (command: string) => void;
  className?: string;
  userInfo?: any;
}

export default function VoiceInterface({
  onVoiceCommand,
  className = "",
  userInfo,
}: VoiceInterfaceProps) {
  const { currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const recognitionRef = useRef<any>(null);

  // Multilingual welcome messages
  const welcomeMessages: { [key: string]: string } = {
    english: `Hello ${userInfo?.name || "User"}! I'm EasyMed AI, how may I assist you today?`,
    hindi: `नमस्ते ${userInfo?.name || "उपयोगकर्ता"}! मैं EasyMed AI हूं, आज मैं आपकी कैसे सहायता कर सकता हूं?`,
    tamil: `வணக்கம் ${userInfo?.name || "பயனர்"}! நான் EasyMed AI, இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?`,
  };

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWelcomeGreeting = () => {
    const welcomeMsg =
      welcomeMessages[currentLanguage] || welcomeMessages.english;
    setLastResponse(welcomeMsg);
    speakResponse(welcomeMsg);
  };

  return (
    <div className={`${className} relative`}>
      <button
        onClick={handleWelcomeGreeting}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
      >
        <span className="text-lg">🤖</span>
        <span className="text-sm">EasyMed AI</span>
      </button>

      {lastResponse && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-xl border border-blue-200 p-4 z-50 min-w-80">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-800 mb-1">
                EasyMed AI Assistant
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {lastResponse}
              </div>
            </div>
            <button
              onClick={() => setLastResponse("")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
