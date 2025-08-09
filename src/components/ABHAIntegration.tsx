import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  abhaService,
  ABHAProfile,
  ABHAHealthRecord,
} from "../services/abhaService";

interface ABHAIntegrationProps {
  onABHAConnected?: (profile: ABHAProfile) => void;
}

export default function ABHAIntegration({
  onABHAConnected,
}: ABHAIntegrationProps) {
  const { t, currentLanguage } = useLanguage();
  const [abhaProfile, setABHAProfile] = useState<ABHAProfile | null>(null);
  const [healthRecords, setHealthRecords] = useState<ABHAHealthRecord[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showABHASetup, setShowABHASetup] = useState(false);
  const [step, setStep] = useState<
    "method" | "aadhaar" | "mobile" | "otp" | "login"
  >("method");

  // Form states
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [healthId, setHealthId] = useState("");
  const [password, setPassword] = useState("");
  const [txnId, setTxnId] = useState("");

  // Load saved ABHA profile on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("abha_profile");
    if (savedProfile) {
      setABHAProfile(JSON.parse(savedProfile));
    }
  }, []);

  // ABHA Translations
  const abhaTexts = {
    english: {
      title: "🏥 ABHA Integration",
      subtitle: "Connect your Ayushman Bharat Health Account",
      notConnected: "ABHA Not Connected",
      connectNow: "Connect ABHA",
      connected: "ABHA Connected",
      healthId: "Health ID",
      viewRecords: "View Health Records",
      createAbha: "Create ABHA",
      loginAbha: "Login with ABHA",
      aadhaarMethod: "Using Aadhaar",
      mobileMethod: "Using Mobile",
      enterAadhaar: "Enter Aadhaar Number",
      enterMobile: "Enter Mobile Number",
      enterOtp: "Enter OTP",
      enterHealthId: "Enter ABHA Health ID",
      enterPassword: "Enter Password",
      sendOtp: "Send OTP",
      verifyOtp: "Verify OTP",
      login: "Login",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      loading: "Connecting...",
      error: "Connection failed. Please try again.",
      success: "ABHA connected successfully!",
      records: "Health Records",
      noRecords: "No health records found",
      consent: "Data Sharing Consent",
      facilities: "Linked Facilities",
    },
    hindi: {
      title: "🏥 आभा एकीकरण",
      subtitle: "अपना आयुष्मान भारत स्वास्थ्य खाता जोड़ें",
      notConnected: "आभा जुड़ा नहीं है",
      connectNow: "आभा जोड़ें",
      connected: "आभा जुड़ा हुआ",
      healthId: "स्वास्थ्य आईडी",
      viewRecords: "स्वास्थ्य रिकॉर्ड देखें",
      createAbha: "आभा बनाएं",
      loginAbha: "आभा से लॉगिन करें",
      aadhaarMethod: "आधार का उपयोग करके",
      mobileMethod: "मोबाइल का उपयोग करके",
      enterAadhaar: "आधार नंबर दर्ज करें",
      enterMobile: "मोबाइल नंबर दर्ज करें",
      enterOtp: "OTP दर्ज करें",
      enterHealthId: "आभा स्वास्थ्य आईडी दर्ज करें",
      enterPassword: "पासवर्ड दर्ज करें",
      sendOtp: "OTP भेजें",
      verifyOtp: "OTP सत्यापित करें",
      login: "लॉगिन",
      cancel: "रद्द करें",
      back: "वापस",
      next: "अगला",
      loading: "जोड़ रहे हैं...",
      error: "कनेक्शन विफल। कृपया पुनः प्रयास करें।",
      success: "आभा सफलतापूर्वक जुड़ गया!",
      records: "स्वास्थ्य रिकॉर्ड",
      noRecords: "कोई स्वास्थ्य रिकॉर्ड नहीं मिला",
      consent: "डेटा साझाकरण सहमति",
      facilities: "जुड़ी हुई सुविधाएं",
    },
  };

  const getABHAText = (key: keyof typeof abhaTexts.english): string => {
    return (
      abhaTexts[currentLanguage as keyof typeof abhaTexts]?.[key] ||
      abhaTexts.english[key]
    );
  };

  const handleAadhaarMethod = async () => {
    if (!aadhaarNumber || !mobileNumber) return;

    setIsConnecting(true);
    try {
      const result = await abhaService.generateABHAWithAadhaar(
        aadhaarNumber,
        mobileNumber,
      );
      setTxnId(result.txnId);
      setStep("otp");
    } catch (error) {
      console.error("ABHA Aadhaar method error:", error);
    }
    setIsConnecting(false);
  };

  const handleMobileMethod = async () => {
    if (!mobileNumber) return;

    setIsConnecting(true);
    try {
      const result = await abhaService.generateABHAWithMobile(mobileNumber);
      setTxnId(result.txnId);
      setStep("otp");
    } catch (error) {
      console.error("ABHA Mobile method error:", error);
    }
    setIsConnecting(false);
  };

  const handleOTPVerification = async () => {
    if (!otp || !txnId) return;

    setIsConnecting(true);
    try {
      const profile = await abhaService.verifyOTPAndCreateABHA(txnId, otp);
      setABHAProfile(profile);
      localStorage.setItem("abha_profile", JSON.stringify(profile));
      setShowABHASetup(false);
      onABHAConnected?.(profile);
    } catch (error) {
      console.error("ABHA OTP verification error:", error);
    }
    setIsConnecting(false);
  };

  const handleABHALogin = async () => {
    if (!healthId || !password) return;

    setIsConnecting(true);
    try {
      const authResult = await abhaService.loginWithABHA(healthId, password);
      const profile = await abhaService.getABHAProfile(
        healthId,
        authResult.accessToken,
      );

      setABHAProfile(profile);
      localStorage.setItem("abha_profile", JSON.stringify(profile));
      localStorage.setItem("abha_tokens", JSON.stringify(authResult));
      setShowABHASetup(false);
      onABHAConnected?.(profile);
    } catch (error) {
      console.error("ABHA login error:", error);
    }
    setIsConnecting(false);
  };

  const loadHealthRecords = async () => {
    if (!abhaProfile) return;

    const tokens = localStorage.getItem("abha_tokens");
    if (!tokens) return;

    const { accessToken } = JSON.parse(tokens);
    try {
      const records = await abhaService.getHealthRecords(
        abhaProfile.healthId,
        accessToken,
      );
      setHealthRecords(records);
    } catch (error) {
      console.error("Health records fetch error:", error);
    }
  };

  if (!abhaProfile) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">
              {getABHAText("title")}
            </h3>
            <p className="text-sm text-gray-600">{getABHAText("subtitle")}</p>
          </div>
          <div className="text-orange-500">⚠️</div>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400 mb-4">
          <p className="text-sm text-orange-800">
            {getABHAText("notConnected")}
          </p>
        </div>

        <button
          onClick={() => setShowABHASetup(true)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all touch-manipulation"
        >
          {getABHAText("connectNow")}
        </button>

        {/* ABHA Setup Modal */}
        {showABHASetup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              {step === "method" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {getABHAText("title")}
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setStep("aadhaar")}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      {getABHAText("createAbha")} -{" "}
                      {getABHAText("aadhaarMethod")}
                    </button>
                    <button
                      onClick={() => setStep("mobile")}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all"
                    >
                      {getABHAText("createAbha")} -{" "}
                      {getABHAText("mobileMethod")}
                    </button>
                    <button
                      onClick={() => setStep("login")}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all"
                    >
                      {getABHAText("loginAbha")}
                    </button>
                    <button
                      onClick={() => setShowABHASetup(false)}
                      className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                    >
                      {getABHAText("cancel")}
                    </button>
                  </div>
                </div>
              )}

              {step === "aadhaar" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {getABHAText("aadhaarMethod")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={getABHAText("enterAadhaar")}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={12}
                    />
                    <input
                      type="tel"
                      placeholder={getABHAText("enterMobile")}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={10}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStep("method")}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                      >
                        {getABHAText("back")}
                      </button>
                      <button
                        onClick={handleAadhaarMethod}
                        disabled={
                          isConnecting || !aadhaarNumber || !mobileNumber
                        }
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {isConnecting
                          ? getABHAText("loading")
                          : getABHAText("sendOtp")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === "mobile" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {getABHAText("mobileMethod")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="tel"
                      placeholder={getABHAText("enterMobile")}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={10}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStep("method")}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                      >
                        {getABHAText("back")}
                      </button>
                      <button
                        onClick={handleMobileMethod}
                        disabled={isConnecting || !mobileNumber}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                        {isConnecting
                          ? getABHAText("loading")
                          : getABHAText("sendOtp")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === "otp" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {getABHAText("enterOtp")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={getABHAText("enterOtp")}
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      className="w-full p-3 border rounded-lg text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStep("method")}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                      >
                        {getABHAText("back")}
                      </button>
                      <button
                        onClick={handleOTPVerification}
                        disabled={isConnecting || !otp}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {isConnecting
                          ? getABHAText("loading")
                          : getABHAText("verifyOtp")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === "login" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {getABHAText("loginAbha")}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={getABHAText("enterHealthId")}
                      value={healthId}
                      onChange={(e) => setHealthId(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input
                      type="password"
                      placeholder={getABHAText("enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStep("method")}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                      >
                        {getABHAText("back")}
                      </button>
                      <button
                        onClick={handleABHALogin}
                        disabled={isConnecting || !healthId || !password}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
                      >
                        {isConnecting
                          ? getABHAText("loading")
                          : getABHAText("login")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">
            {getABHAText("title")}
          </h3>
          <p className="text-sm text-green-600">{getABHAText("connected")}</p>
        </div>
        <div className="text-green-500">✅</div>
      </div>

      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400 mb-4">
        <div className="text-sm">
          <p className="font-medium">{abhaProfile.name}</p>
          <p className="text-gray-600">
            {getABHAText("healthId")}: {abhaProfile.healthId}
          </p>
        </div>
      </div>

      <button
        onClick={loadHealthRecords}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all touch-manipulation"
      >
        {getABHAText("viewRecords")}
      </button>

      {healthRecords.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">{getABHAText("records")}</h4>
          {healthRecords.map((record) => (
            <div key={record.recordId} className="bg-white/50 p-3 rounded-lg">
              <p className="font-medium text-sm">{record.recordType}</p>
              <p className="text-xs text-gray-600">{record.facilityName}</p>
              <p className="text-xs text-gray-500">
                {new Date(record.createdDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
