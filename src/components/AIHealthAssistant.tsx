import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: "text" | "suggestion" | "warning" | "action";
  suggestions?: string[];
  actions?: { label: string; action: string }[];
}

interface HealthContext {
  symptoms: string[];
  medications: string[];
  conditions: string[];
  recentActivity: string[];
}

export default function AIHealthAssistant() {
  const { currentLanguage, getText } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [healthContext, setHealthContext] = useState<HealthContext>({
    symptoms: [],
    medications: ["Metformin", "Lisinopril"],
    conditions: ["Type 2 Diabetes", "Hypertension"],
    recentActivity: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  const quickSuggestions = [
    "What are my vital signs today?",
    "Remind me about my medications",
    "I'm feeling unwell, what should I do?",
    "Book an appointment with my doctor",
    "Show my health trends",
    "I need emergency help",
    "Track my symptoms",
    "Check drug interactions",
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: "1",
      text: `Hello! I'm your AI Health Assistant. I can help you with symptoms, medications, appointments, and health insights. How can I assist you today?`,
      isUser: false,
      timestamp: new Date(),
      type: "text",
      suggestions: quickSuggestions.slice(0, 4),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processAIResponse = async (userInput: string): Promise<ChatMessage> => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate AI processing
    setIsTyping(false);

    const input = userInput.toLowerCase();
    let response: ChatMessage;

    // Advanced NLP-style responses
    if (
      input.includes("symptom") ||
      input.includes("feel") ||
      input.includes("pain")
    ) {
      response = {
        id: Date.now().toString(),
        text: "I understand you're experiencing some symptoms. Let me help you assess this. Can you describe your symptoms in more detail?",
        isUser: false,
        timestamp: new Date(),
        type: "suggestion",
        suggestions: [
          "I have a headache",
          "I'm feeling nauseous",
          "I have chest pain",
          "I'm running a fever",
        ],
        actions: [
          { label: "🤖 Start Symptom Checker", action: "symptom-checker" },
          { label: "🚨 Emergency Help", action: "emergency" },
        ],
      };
    } else if (
      input.includes("medication") ||
      input.includes("medicine") ||
      input.includes("pill")
    ) {
      response = {
        id: Date.now().toString(),
        text: `Based on your profile, you're taking ${healthContext.medications.join(" and ")}. Your next doses are coming up soon.`,
        isUser: false,
        timestamp: new Date(),
        type: "text",
        actions: [
          {
            label: "💊 View Medication Schedule",
            action: "medication-manager",
          },
          { label: "⚠️ Check Drug Interactions", action: "drug-interactions" },
          { label: "🔔 Set Reminder", action: "set-reminder" },
        ],
      };
    } else if (
      input.includes("appointment") ||
      input.includes("doctor") ||
      input.includes("book")
    ) {
      response = {
        id: Date.now().toString(),
        text: "I can help you book an appointment. Which type of consultation would you prefer?",
        isUser: false,
        timestamp: new Date(),
        type: "suggestion",
        suggestions: [
          "General Medicine",
          "Cardiology",
          "Endocrinology",
          "Video Consultation",
        ],
        actions: [
          { label: "📅 Book Appointment", action: "consultation-booking" },
          { label: "📹 Start Video Call", action: "video-call" },
        ],
      };
    } else if (
      input.includes("vital") ||
      input.includes("health") ||
      input.includes("monitor")
    ) {
      response = {
        id: Date.now().toString(),
        text: "Let me check your latest vital signs and health metrics for you.",
        isUser: false,
        timestamp: new Date(),
        type: "text",
        actions: [
          { label: "💓 View Vital Signs", action: "vital-dashboard" },
          { label: "📊 Health Analytics", action: "health-analytics" },
          { label: "📈 Track Progress", action: "progress-tracking" },
        ],
      };
    } else if (
      input.includes("emergency") ||
      input.includes("urgent") ||
      input.includes("help")
    ) {
      response = {
        id: Date.now().toString(),
        text: "This sounds urgent. I'm here to help. Do you need immediate medical attention?",
        isUser: false,
        timestamp: new Date(),
        type: "warning",
        actions: [
          { label: "🚨 Call Emergency Services", action: "emergency-call" },
          { label: "📍 Share Location", action: "share-location" },
          { label: "👨‍⚕️ Contact Doctor", action: "contact-doctor" },
        ],
      };
    } else if (
      input.includes("trend") ||
      input.includes("progress") ||
      input.includes("analytics")
    ) {
      response = {
        id: Date.now().toString(),
        text: "Your health trends look good overall! Your blood pressure has been stable, and your medication adherence is at 87%. Keep up the great work!",
        isUser: false,
        timestamp: new Date(),
        type: "text",
        actions: [
          { label: "📊 Detailed Analytics", action: "health-analytics" },
          { label: "🎯 Set New Goals", action: "set-goals" },
        ],
      };
    } else {
      response = {
        id: Date.now().toString(),
        text: `I understand you said: "${userInput}". I'm here to help with your health needs. What specific area would you like assistance with?`,
        isUser: false,
        timestamp: new Date(),
        type: "suggestion",
        suggestions: quickSuggestions.slice(0, 4),
      };
    }

    return response;
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const aiResponse = await processAIResponse(text);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleActionClick = (action: string) => {
    // This would integrate with your existing navigation system
    console.log(`Navigating to: ${action}`);

    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Great! I'm opening ${action.replace("-", " ")} for you.`,
      isUser: false,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, actionMessage]);
  };

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
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

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Health Assistant</h1>
            <p className="text-purple-100 text-sm">
              Powered by Advanced Natural Language Processing
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white border-x-2 border-gray-200 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : message.type === "warning"
                    ? "bg-red-50 border border-red-200 text-red-800"
                    : message.type === "suggestion"
                      ? "bg-purple-50 border border-purple-200 text-purple-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>

              {/* Suggestions */}
              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-3 py-2 text-xs bg-white rounded-lg hover:bg-gray-50 transition-colors border"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {message.actions && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionClick(action.action)}
                      className="block w-full text-left px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-b-2xl border-x-2 border-b-2 border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me about your health, symptoms, medications..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            🎤
          </button>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Send
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickSuggestions.slice(0, 4).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
