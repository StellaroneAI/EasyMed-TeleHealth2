import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({
  isLoading,
  onLoadingComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const loadingPhases = [
    {
      icon: "🏥",
      text: "Initializing EasyMed...",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📊",
      text: "Loading health data...",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "🔐",
      text: "Securing connection...",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "🩺",
      text: "Preparing dashboard...",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "✨",
      text: "Almost ready!",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;

        // Update phase based on progress
        const phaseIndex = Math.floor(
          (newProgress / 100) * loadingPhases.length,
        );
        setCurrentPhase(Math.min(phaseIndex, loadingPhases.length - 1));

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  const currentPhaseData = loadingPhases[currentPhase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center p-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300">
            <span className="text-white text-4xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EasyMed Pro
          </h1>
          <p className="text-gray-600 mt-2">
            Your AI-Powered Healthcare Companion
          </p>
        </div>

        {/* Current Phase */}
        <div className="mb-8">
          <div
            className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${currentPhaseData.color} rounded-2xl shadow-xl flex items-center justify-center animate-pulse`}
          >
            <span className="text-white text-3xl">{currentPhaseData.icon}</span>
          </div>
          <p className="text-lg font-medium text-gray-700">
            {currentPhaseData.text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${currentPhaseData.color} rounded-full transition-all duration-300 ease-out relative`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-gradient-to-r ${currentPhaseData.color} rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>ABHA Integration</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>AI Health Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Multilingual Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span>Telemedicine Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
