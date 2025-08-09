import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { voiceService, HealthVoiceCommands } from "../services/openai";

interface EnhancedVoiceAssistantProps {
  userName?: string;
  onCommand?: (command: string, language: string) => void;
  onNavigate?: (target: string) => void;
}

export default function EnhancedVoiceAssistant({
  userName = "User",
  onCommand,
  onNavigate,
}: EnhancedVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const { currentLanguage, t } = useLanguage();

  // Initialize and show greeting
  useEffect(() => {
    if (isEnabled) {
      const greeting = getTimeGreeting();
      const welcomeMessage = `${t(greeting)}, ${userName}! ${t("healthCompanion")}`;
      speakResponse(welcomeMessage);
    }
  }, [currentLanguage, userName, isEnabled]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "goodMorning";
    if (hour < 17) return "goodAfternoon";
    return "goodEvening";
  };

  const startListening = async () => {
    if (!isEnabled || isListening) return;

    try {
      setError("");
      setIsListening(true);
      setTranscript("");

      // Start recording
      await voiceService.startRecording();

      // Auto-stop after 30 seconds (prevent long recordings)
      setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 30000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access.");
      setIsListening(false);
      console.error("Recording error:", err);
    }
  };

  const stopListening = async () => {
    if (!isListening || !voiceService.recording) return;

    try {
      setIsListening(false);
      setIsProcessing(true);

      // Stop recording and get audio
      const audioBlob = await voiceService.stopRecording();

      // Convert speech to text using OpenAI Whisper
      const transcribedText = await voiceService.speechToText(
        audioBlob,
        currentLanguage,
      );
      setTranscript(transcribedText);

      // Process the command
      await processVoiceCommand(transcribedText);
    } catch (err) {
      setError("Failed to process voice input. Please try again.");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const processVoiceCommand = async (text: string) => {
    if (!text.trim()) return;

    try {
      // Check for specific health commands
      const command = HealthVoiceCommands.processCommand(text, currentLanguage);

      if (command.action === "navigate" && onNavigate) {
        onNavigate(command.target);
        const navResponse = getTranslation(
          `voiceCommands.goTo${command.target.charAt(0).toUpperCase() + command.target.slice(1)}`,
        );
        await speakResponse(navResponse || `Navigating to ${command.target}`);
        return;
      }

      if (command.action === "emergency") {
        const emergencyResponse = getTranslation("voiceCommands.emergency");
        await speakResponse(
          emergencyResponse || "Connecting to emergency services",
        );
        onCommand?.("emergency", currentLanguage);
        return;
      }

      // For general health queries, use AI
      if (command.action === "chat") {
        const aiResponse = await voiceService.processHealthQuery(
          text,
          currentLanguage,
          { userName, userType: "patient" },
        );
        setResponse(aiResponse);
        await speakResponse(aiResponse);
        onCommand?.(text, currentLanguage);
      }
    } catch (err) {
      const errorMessage =
        getTranslation("aiChat") + " is temporarily unavailable.";
      setResponse(errorMessage);
      await speakResponse(errorMessage);
      console.error("Command processing error:", err);
    }
  };

  const speakResponse = async (text: string) => {
    if (!isEnabled || !text.trim()) return;

    try {
      setIsSpeaking(true);

      // Generate speech using OpenAI TTS
      const audioBlob = await voiceService.textToSpeech(text, currentLanguage);

      // Play the audio
      await voiceService.playAudio(audioBlob);
    } catch (err) {
      console.error("Speech synthesis error:", err);
      // Fallback to browser TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleVoiceAssistant = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled && isListening) {
      stopListening();
    }
  };

  const quickCommands = [
    { key: "appointments", icon: "📅", label: getTranslation("appointments") },
    { key: "medications", icon: "💊", label: getTranslation("medications") },
    { key: "emergency", icon: "🚨", label: getTranslation("emergency") },
    { key: "aiChat", icon: "🤖", label: getTranslation("aiChat") },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Quick Commands Panel */}
      {isEnabled && (
        <div className="mb-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Voice Commands
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.key}
                onClick={() => processVoiceCommand(cmd.label)}
                className="flex items-center gap-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
              >
                <span>{cmd.icon}</span>
                <span className="truncate">{cmd.label}</span>
              </button>
            ))}
          </div>

          {/* Status Display */}
          {isListening && (
            <div className="text-center text-sm text-blue-600 mb-2">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              {getTranslation("listening")}
            </div>
          )}

          {isProcessing && (
            <div className="text-center text-sm text-orange-600 mb-2">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Processing...
            </div>
          )}

          {isSpeaking && (
            <div className="text-center text-sm text-green-600 mb-2">
              <Volume2 className="w-4 h-4 inline mr-2" />
              Speaking...
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="bg-blue-50 p-2 rounded text-sm mb-2">
              <strong>You said:</strong> {transcript}
            </div>
          )}

          {/* Response */}
          {response && (
            <div className="bg-green-50 p-2 rounded text-sm mb-2">
              <strong>Assistant:</strong> {response}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 p-2 rounded text-sm text-red-600 mb-2">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Main Voice Button */}
      <div className="flex flex-col gap-2">
        {/* Voice Toggle */}
        <button
          onClick={toggleVoiceAssistant}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isEnabled
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
          title={
            isEnabled ? "Disable Voice Assistant" : "Enable Voice Assistant"
          }
        >
          {isEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>

        {/* Microphone Button */}
        {isEnabled && (
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform ${
              isListening
                ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse"
                : isProcessing || isSpeaking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
            } text-white`}
            title={
              isListening
                ? "Stop Listening"
                : isProcessing
                  ? "Processing..."
                  : isSpeaking
                    ? "Speaking..."
                    : "Start Voice Input"
            }
          >
            {isProcessing || isSpeaking ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        )}
      </div>

      {/* Language Indicator */}
      {isEnabled && (
        <div className="text-center mt-2">
          <span className="text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentLanguage.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
