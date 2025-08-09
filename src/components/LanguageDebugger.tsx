import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageDebugger() {
  const { currentLanguage, t, setLanguage } = useLanguage();

  const testKeys = [
    "welcome",
    "dashboard",
    "appointments",
    "goodMorning",
    "healthCompanion",
  ];

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 m-4">
      <h3 className="text-lg font-bold text-yellow-800 mb-3">
        🔧 Language Debug Panel
      </h3>

      <div className="mb-3">
        <strong>Current Language:</strong> {currentLanguage}
      </div>

      <div className="mb-3">
        <strong>Quick Language Switch:</strong>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setLanguage("english")}
            className={`px-3 py-1 rounded ${currentLanguage === "english" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("hindi")}
            className={`px-3 py-1 rounded ${currentLanguage === "hindi" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Hindi
          </button>
          <button
            onClick={() => setLanguage("tamil")}
            className={`px-3 py-1 rounded ${currentLanguage === "tamil" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Tamil
          </button>
        </div>
      </div>

      <div>
        <strong>Translation Test:</strong>
        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
          {testKeys.map((key) => (
            <div key={key} className="bg-white p-2 rounded border">
              <span className="text-gray-600">{key}:</span>{" "}
              <span className="font-medium">{t(key as any)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
