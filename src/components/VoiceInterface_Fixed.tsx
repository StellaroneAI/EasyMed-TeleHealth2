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

  // Multilingual responses for health commands
  const healthResponses: { [key: string]: { [key: string]: string } } = {
    appointment: {
      english:
        "I can help you book an appointment. Would you like to schedule with a specific doctor or specialty?",
      hindi:
        "मैं आपको अपॉइंटमेंट बुक करने में मदद कर सकता हूं। क्या आप किसी विशिष्ट डॉक्टर या विशेषज्ञता के साथ शेड्यूल करना चाहेंगे?",
      tamil:
        "நான் உங்களுக்கு அப்பாயின்ட்மெண்ட் புக் செய்ய உதவ முடியும். குறிப்பிட்ட மருத்துவர் அல்லது சிறப்புத்துறையுடன் ஷெட்யூல் செய்ய விரும்புகிறீர்களா?",
    },
    emergency: {
      english:
        "This seems like an emergency. I recommend calling emergency services immediately or visiting the nearest hospital.",
      hindi:
        "यह एक आपातकालीन स्थिति लगती है। मैं तुरंत आपातकालीन सेवाओं को कॉल करने या निकटतम अस्पताल जाने की सलाह देता हूं।",
      tamil:
        "இது அவசரநிலை போல் தெரிகிறது. உடனடியாக அவசர சேவைகளை அழைக்க அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்ல பரிந்துரைக்கிறேன்।",
    },
  };

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      // Set language based on current selection
      const langMap: { [key: string]: string } = {
        english: "en-US",
        hindi: "hi-IN",
        tamil: "ta-IN",
      };

      recognitionRef.current.lang = langMap[currentLanguage] || "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setIsProcessing(true);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setIsProcessing(false);
      };
    }
  }, [currentLanguage]);

  // Speech synthesis function with language support
  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set language for speech synthesis
      const langMap: { [key: string]: string } = {
        english: "en-US",
        hindi: "hi-IN",
        tamil: "ta-IN",
      };

      utterance.lang = langMap[currentLanguage] || "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Welcome message when AI assistant is clicked
  const handleWelcomeGreeting = () => {
    const welcomeMsg =
      welcomeMessages[currentLanguage] || welcomeMessages.english;
    setLastResponse(welcomeMsg);
    speakResponse(welcomeMsg);
  };

  const processVoiceCommand = async (command: string) => {
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const lowerCommand = command.toLowerCase();
      let response = "";

      // Health-related commands with multilingual responses
      if (
        lowerCommand.includes("appointment") ||
        lowerCommand.includes("doctor")
      ) {
        response =
          healthResponses.appointment[currentLanguage] ||
          healthResponses.appointment.english;
      } else if (
        lowerCommand.includes("emergency") ||
        lowerCommand.includes("urgent")
      ) {
        response =
          healthResponses.emergency[currentLanguage] ||
          healthResponses.emergency.english;
      } else if (
        lowerCommand.includes("medicine") ||
        lowerCommand.includes("prescription")
      ) {
        response =
          "I can help you with your prescription. Let me check your current medications.";
      } else if (
        lowerCommand.includes("health record") ||
        lowerCommand.includes("report")
      ) {
        response =
          "Your health records are being retrieved. You can view them in the Health Records section.";
      } else if (
        lowerCommand.includes("video call") ||
        lowerCommand.includes("consultation")
      ) {
        response =
          "Starting video consultation setup. Please ensure your camera and microphone are ready.";
      } else if (
        lowerCommand.includes("asha") ||
        lowerCommand.includes("worker")
      ) {
        response =
          "I am connecting you with your local ASHA worker for community health support.";
      } else {
        response = `I heard: "${command}". How can I help you with your healthcare needs today?`;
      }

      // Set the response for display
      setLastResponse(response);

      // Call the callback if provided
      if (onVoiceCommand) {
        onVoiceCommand(command);
      }

      // Speak the response
      speakResponse(response);
    } catch (error) {
      console.error("Error processing voice command:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className={`${className} opacity-50`}>
        <button
          disabled
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
        >
          <span className="text-lg">🎤</span>
          <span className="text-sm">Voice not supported</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <button
        onClick={() => {
          if (!isListening) {
            handleWelcomeGreeting();
            startListening();
          } else {
            stopListening();
          }
        }}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg ${
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
            : isProcessing
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        }`}
        disabled={isProcessing}
      >
        <span className="text-lg">
          {isListening ? "🎙️" : isProcessing ? "⏳" : "🤖"}
        </span>
        <span className="text-sm">
          {isListening
            ? "Listening..."
            : isProcessing
              ? "Processing..."
              : "EasyMed AI"}
        </span>
      </button>

      {/* Voice feedback */}
      {(isListening || transcript) && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-green-500"}`}
            ></div>
            <span className="text-xs font-semibold text-gray-600">
              {isListening
                ? "Listening in " + currentLanguage
                : "Voice Command Received"}
            </span>
          </div>
          {transcript && (
            <div className="text-sm text-gray-800 bg-gray-50 rounded p-2">
              "{transcript}"
            </div>
          )}
          {isProcessing && (
            <div className="text-xs text-blue-600 mt-2 flex items-center space-x-1">
              <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full"></div>
              <span>Processing with AI...</span>
            </div>
          )}
        </div>
      )}

      {/* AI Response Display */}
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

      {/* Voice commands help */}
      <div className="absolute top-full mt-16 left-0 right-0 bg-blue-50 rounded-lg p-3 text-xs text-blue-800 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="font-semibold mb-1">Try saying:</div>
        <div className="space-y-1">
          <div>• "Book an appointment with doctor"</div>
          <div>• "Show my health records"</div>
          <div>• "Connect with ASHA worker"</div>
          <div>• "Start video consultation"</div>
          <div>• "Emergency help needed"</div>
        </div>
      </div>
    </div>
  );
}
