import { useState, useEffect } from "react";
import { useAdmin } from "../contexts/AdminContext";

interface LoginPageProps {
  onLogin: (
    userType: "patient" | "asha" | "doctor" | "admin",
    userInfo: any,
  ) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { loginAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<
    "patient" | "asha" | "doctor" | "admin"
  >("patient");
  const [loginMethod, setLoginMethod] = useState<
    "phone" | "email" | "google" | "facebook"
  >("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const userTypes = [
    {
      id: "patient" as const,
      title: "Patient/Family",
      subtitle: "Access your health records and family care",
      icon: "👨‍👩‍👧‍👦",
      gradient: "from-blue-500 to-cyan-400",
      color: "text-blue-600",
    },
    {
      id: "asha" as const,
      title: "ASHA Worker",
      subtitle: "Manage community health programs",
      icon: "👩‍⚕️",
      gradient: "from-green-500 to-emerald-400",
      color: "text-green-600",
    },
    {
      id: "doctor" as const,
      title: "Healthcare Provider",
      subtitle: "Manage patients and consultations",
      icon: "🩺",
      gradient: "from-purple-500 to-violet-400",
      color: "text-purple-600",
    },
    {
      id: "admin" as const,
      title: "Admin/NGO",
      subtitle: "System administration and oversight",
      icon: "⚙️",
      gradient: "from-orange-500 to-red-400",
      color: "text-orange-600",
    },
  ];

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setShowOTP(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      if (activeTab === "admin") {
        // Admin login with your privileged phone number
        const success = await loginAdmin(phoneNumber, {
          name: phoneNumber === "+919060328119" ? "Super Admin" : "Admin User",
          email: email,
        });

        if (success) {
          onLogin("admin", {
            phone: phoneNumber,
            email,
            role: phoneNumber === "+919060328119" ? "super_admin" : "admin",
            name:
              phoneNumber === "+919060328119" ? "Super Admin" : "Admin User",
          });
        } else {
          alert("Access denied. Please contact system administrator.");
        }
      } else {
        // Regular user login simulation
        setTimeout(() => {
          onLogin(activeTab, {
            phone: phoneNumber,
            email: email,
            userType: activeTab,
            name: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} User`,
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    setIsLoading(true);
    // Simulate social login
    setTimeout(() => {
      onLogin(activeTab, {
        provider,
        userType: activeTab,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        socialAuth: true,
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div
        className={`w-full max-w-6xl transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            EasyMed Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced Healthcare Management Platform for Rural India
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* User Type Selection */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Choose Your Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userTypes.map((type, index) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    activeTab === type.id
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h3
                      className={`font-semibold mb-2 ${activeTab === type.id ? type.color : "text-gray-700"}`}
                    >
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {type.subtitle}
                    </p>
                  </div>
                  {activeTab === type.id && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      }}
                    ></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <div className="max-w-md mx-auto">
              {/* Login Method Tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                {[
                  { id: "phone", label: "📱 Phone", icon: "📱" },
                  { id: "email", label: "✉️ Email", icon: "✉️" },
                  { id: "google", label: "🔍 Google", icon: "🔍" },
                  { id: "facebook", label: "📘 Facebook", icon: "📘" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setLoginMethod(method.id as any)}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      loginMethod === method.id
                        ? "bg-white text-blue-600 shadow-md"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <span className="text-sm">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Phone Login */}
              {loginMethod === "phone" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 90603 28119"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        📱
                      </div>
                    </div>
                    {activeTab === "admin" &&
                      phoneNumber === "+919060328119" && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          ✅ Super Admin Access Detected
                        </p>
                      )}
                  </div>

                  {showOTP && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        maxLength={6}
                      />
                    </div>
                  )}

                  {!showOTP ? (
                    <button
                      onClick={handleSendOTP}
                      disabled={isLoading || !phoneNumber.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <span>📤</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      disabled={isLoading || !otp.trim()}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <span>Verify & Login</span>
                          <span>🔐</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Email Login */}
              {loginMethod === "email" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={isLoading || !email.trim() || !password.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Login</span>
                        <span>🔑</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Social Login */}
              {(loginMethod === "google" || loginMethod === "facebook") && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {loginMethod === "google" ? "🔍" : "📘"}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Continue with{" "}
                      {loginMethod === "google" ? "Google" : "Facebook"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Quick and secure authentication
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSocialLogin(loginMethod as "google" | "facebook")
                    }
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      loginMethod === "google"
                        ? "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : (
                      <>
                        <span className="text-2xl">
                          {loginMethod === "google" ? "🔍" : "📘"}
                        </span>
                        <span>
                          Continue with{" "}
                          {loginMethod === "google" ? "Google" : "Facebook"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>By continuing, you agree to our</p>
                <div className="space-x-4 mt-2">
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 flex items-center justify-center space-x-2">
            <span>🔒</span>
            <span>Secured by 256-bit SSL encryption</span>
          </p>
        </div>
      </div>
    </div>
  );
}
