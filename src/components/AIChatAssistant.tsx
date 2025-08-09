import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  message: string;
  timestamp: Date;
  language: string;
}

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  chatType: "SYMPTOM_CHECK" | "GENERAL_HEALTH" | "MEDICATION" | "EMERGENCY";
}

export default function AIChatAssistant({
  isOpen,
  onClose,
  chatType,
}: AIChatAssistantProps) {
  const { currentLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI Chat translations
  const chatTexts = {
    english: {
      symptomChecker: "AI Symptom Checker",
      generalHealth: "Health Assistant",
      medication: "Medication Guide",
      emergency: "Emergency Assistant",
      welcomeSymptom:
        "Hello! I'm your AI health assistant. Please describe your symptoms and I'll help you understand what might be causing them. Remember, I'm here to provide guidance, but always consult a doctor for serious concerns.",
      welcomeGeneral:
        "Hi! I'm here to help with your health questions. What would you like to know about?",
      welcomeMedication:
        "Hello! I can help you with medication information, dosages, and interactions. What medication would you like to know about?",
      welcomeEmergency:
        "This is an emergency assistant. If this is a life-threatening emergency, please call 108 immediately. How can I help you?",
      typePlaceholder: "Type your message...",
      send: "Send",
      listening: "Listening...",
      voiceInput: "Voice Input",
      clearChat: "Clear Chat",
      disclaimer: "AI guidance only. Consult doctors for medical decisions.",
      thinking: "AI is thinking...",
      speakResponse: "Speak Response",
    },
    hindi: {
      symptomChecker: "एआई लक्षण जांचकर्ता",
      generalHealth: "स्वास्थ्य सहायक",
      medication: "दवा गाइड",
      emergency: "आपातकालीन सहायक",
      welcomeSymptom:
        "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। कृपया अपने लक्षणों का वर्णन करें और मैं समझाने में मदद करूंगा कि इनका कारण क्या हो सकता है।",
      welcomeGeneral:
        "नमस्ते! मैं आपके स्वास्थ्य प्रश्नों में मदद के लिए हूं। आप क्या जानना चाहते हैं?",
      welcomeMedication:
        "नमस्ते! मैं दवा की जानकारी, खुराक और प्रभावों के बारे में मदद कर सकता हूं।",
      welcomeEmergency:
        "यह आपातकालीन सहायक है। यदि यह जीवन के लिए खतरनाक स्थिति है, तो कृपया तुरंत 108 पर कॉल करें।",
      typePlaceholder: "अपना संदेश टाइप करें...",
      send: "भेजें",
      listening: "सुन रहा हूं...",
      voiceInput: "आवाज इनपुट",
      clearChat: "चैट साफ़ करें",
      disclaimer:
        "केवल AI मार्गदर्शन। चिकित्सा निर्णयों के लिए डॉक्टरों से सलाह लें।",
      thinking: "AI सोच रहा है...",
      speakResponse: "उत्तर बोलें",
    },
    tamil: {
      symptomChecker: "AI அறிகுறி சரிபார்ப்பாளர்",
      generalHealth: "சுகாதார உதவியாளர்",
      medication: "மருந்து வழிகாட்டி",
      emergency: "அவசர உதவியாளர்",
      welcomeSymptom:
        "வணக்கம்! நான் உங்கள் AI சுகாதார உதவியாளர். உங்கள் அறிகுறிகளை விவரிக்கவும், அவற்றின் காரணங்களைப் புரிந்துகொள்ள உதவுவேன்.",
      welcomeGeneral:
        "வணக்கம்! உங்கள் சுகாதார கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன். நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
      welcomeMedication:
        "வணக்கம்! மருந்து தகவல், அளவுகள் மற்றும் தொடர்புகளில் உதவ முடியும்.",
      welcomeEmergency:
        "இது அவசர உதவியாளர். இது உயிருக்கு ஆபத்தான அவசரநிலை என்றால், உடனே 108 ஐ அழைக்கவும்.",
      typePlaceholder: "உங்கள் செய்தியை தட்டச்சு செய்யவும்...",
      send: "அனுப்பு",
      listening: "கேட்கிறேன்...",
      voiceInput: "குரல் உள்ளீடு",
      clearChat: "அரட்டையை அழிக்கவும்",
      disclaimer:
        "AI வழிகாட்டுதல் மட்டும். மருத்துவ முடிவுகளுக்கு மருத்துவர்களை அணுகவும்.",
      thinking: "AI சிந்திக்கிறது...",
      speakResponse: "பதிலைப் பேசு",
    },
  };

  const getChatText = (key: keyof typeof chatTexts.english): string => {
    return (
      chatTexts[currentLanguage as keyof typeof chatTexts]?.[key] ||
      chatTexts.english[key]
    );
  };

  const getChatTitle = () => {
    switch (chatType) {
      case "SYMPTOM_CHECK":
        return getChatText("symptomChecker");
      case "GENERAL_HEALTH":
        return getChatText("generalHealth");
      case "MEDICATION":
        return getChatText("medication");
      case "EMERGENCY":
        return getChatText("emergency");
      default:
        return getChatText("generalHealth");
    }
  };

  const getWelcomeMessage = () => {
    switch (chatType) {
      case "SYMPTOM_CHECK":
        return getChatText("welcomeSymptom");
      case "GENERAL_HEALTH":
        return getChatText("welcomeGeneral");
      case "MEDICATION":
        return getChatText("welcomeMedication");
      case "EMERGENCY":
        return getChatText("welcomeEmergency");
      default:
        return getChatText("welcomeGeneral");
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMsg: ChatMessage = {
        id: "1",
        type: "ai",
        message: getWelcomeMessage(),
        timestamp: new Date(),
        language: currentLanguage,
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on current language
      const langCodes = {
        english: "en-US",
        hindi: "hi-IN",
        tamil: "ta-IN",
        telugu: "te-IN",
        bengali: "bn-IN",
        marathi: "mr-IN",
        punjabi: "pa-IN",
      };

      utterance.lang =
        langCodes[currentLanguage as keyof typeof langCodes] || "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      // Set language
      const langCodes = {
        english: "en-US",
        hindi: "hi-IN",
        tamil: "ta-IN",
        telugu: "te-IN",
        bengali: "bn-IN",
        marathi: "mr-IN",
        punjabi: "pa-IN",
      };

      recognition.lang =
        langCodes[currentLanguage as keyof typeof langCodes] || "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const simulateAIResponse = (): string => {
    // Simulate AI responses based on chat type and language
    const responses = {
      english: {
        SYMPTOM_CHECK: [
          "Based on your symptoms, this could be related to several conditions. Can you tell me more about when these symptoms started?",
          "I understand your concern. These symptoms might indicate a common condition, but I recommend consulting with a healthcare provider for proper diagnosis.",
          "Thank you for sharing. Based on what you've described, here are some possible causes, but please seek medical attention if symptoms persist.",
        ],
        GENERAL_HEALTH: [
          "That's a great health question! Here's what I can tell you about that topic...",
          "I'm happy to help with your health inquiry. Based on current medical knowledge...",
          "Good question! Here's some helpful information about that health topic...",
        ],
        MEDICATION: [
          "Let me provide you with information about that medication, including dosage and potential side effects.",
          "That's an important medication question. Here's what you should know...",
          "I can help with medication information. Always consult your doctor before making changes.",
        ],
        EMERGENCY: [
          "If this is urgent, please call 108 immediately. For non-urgent concerns, here's what I suggest...",
          "Thank you for reaching out. If symptoms are severe, seek immediate medical care.",
          "I understand your concern. Here's immediate guidance, but please contact emergency services if needed.",
        ],
      },
      hindi: {
        SYMPTOM_CHECK: [
          "आपके लक्षणों के आधार पर, यह कई स्थितियों से संबंधित हो सकता है। क्या आप बता सकते हैं कि ये लक्षण कब शुरू हुए?",
          "मैं आपकी चिंता समझता हूं। ये लक्षण एक सामान्य स्थिति का संकेत हो सकते हैं, लेकिन मैं उचित निदान के लिए डॉक्टर से सलाह लेने की सलाह देता हूं।",
        ],
        GENERAL_HEALTH: [
          "यह एक बेहतरीन स्वास्थ्य प्रश्न है! मैं आपको इस विषय के बारे में बता सकता हूं...",
          "मैं आपकी स्वास्थ्य जांच में मदद करने में खुश हूं।",
        ],
      },
      tamil: {
        SYMPTOM_CHECK: [
          "உங்கள் அறிகுறிகளின் அடிப்படையில், இது பல நிலைமைகளுடன் தொடர்புடையதாக இருக்கலாம்.",
          "உங்கள் கவலையை நான் புரிந்துகொள்கிறேன். இந்த அறிகுறிகள் ஒரு பொதுவான நிலையைக் குறிக்கலாம்.",
        ],
      },
    };

    const langResponses =
      responses[currentLanguage as keyof typeof responses] || responses.english;
    const typeResponses =
      (langResponses as any)[chatType] ||
      (langResponses as any)["GENERAL_HEALTH"] ||
      langResponses.SYMPTOM_CHECK;

    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = simulateAIResponse();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: aiResponse,
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      // Speak AI response
      speakText(aiResponse);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        message: getWelcomeMessage(),
        timestamp: new Date(),
        language: currentLanguage,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-full max-h-[90vh] bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{getChatTitle()}</h2>
              <p className="text-white/80 text-sm">AI Health Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              title={getChatText("clearChat")}
            >
              <span className="text-white">🗑️</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
            >
              <span className="text-white text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto h-96 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-white/80 text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.type === "ai" && (
                    <button
                      onClick={() => speakText(message.message)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-all"
                      title={getChatText("speakResponse")}
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/80 px-4 py-3 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getChatText("thinking")}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white/50 border-t border-white/30">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={getChatText("typePlaceholder")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
              title={getChatText("voiceInput")}
            >
              <span className="text-lg">{isListening ? "🔴" : "🎤"}</span>
            </button>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
            >
              {getChatText("send")}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {getChatText("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}
