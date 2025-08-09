import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../translations";

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions = [
    { code: "english", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "hindi", name: "Hindi", flag: "🇮🇳", nativeName: "हिंदी" },
    { code: "tamil", name: "Tamil", flag: "🇮🇳", nativeName: "தமிழ்" },
    { code: "telugu", name: "Telugu", flag: "🇮🇳", nativeName: "తెలుగు" },
    { code: "bengali", name: "Bengali", flag: "🇮🇳", nativeName: "বাংলা" },
    { code: "marathi", name: "Marathi", flag: "🇮🇳", nativeName: "मराठी" },
    { code: "punjabi", name: "Punjabi", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ" },
    { code: "gujarati", name: "Gujarati", flag: "🇮🇳", nativeName: "ગુજરાતી" },
    { code: "kannada", name: "Kannada", flag: "🇮🇳", nativeName: "ಕನ್ನಡ" },
    { code: "malayalam", name: "Malayalam", flag: "🇮🇳", nativeName: "മലയാളം" },
    { code: "odia", name: "Odia", flag: "🇮🇳", nativeName: "ଓଡ଼ିଆ" },
    { code: "assamese", name: "Assamese", flag: "🇮🇳", nativeName: "অসমীয়া" },
  ];

  const currentLang =
    languageOptions.find((lang) => lang.code === currentLanguage) ||
    languageOptions[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="font-medium">{currentLang.nativeName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 border-b">
              🌍 Select Language / भाषा चुनें
            </div>
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors duration-200 ${
                  currentLanguage === lang.code
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {currentLanguage === lang.code && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
