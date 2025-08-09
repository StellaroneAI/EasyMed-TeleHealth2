import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';

interface LoginPageProps {
  onLogin: (userType: 'patient' | 'asha' | 'doctor' | 'admin', userInfo: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { currentLanguage } = useLanguage();
  const { loginAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'patient' | 'asha' | 'doctor' | 'admin'>('patient');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | 'social'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const loginTexts = {
    english: {
      welcome: "Welcome to EasyMed",
      tagline: "Your Family's Health, Just a Tap Away",
      patient: "Patient/Family",
      asha: "ASHA Worker",
      doctor: "Doctor/Healthcare Provider",
      admin: "Admin/NGO",
      phoneLogin: "Login with Phone",
      emailLogin: "Login with Email",
      socialLogin: "Social Login",
      phoneNumber: "Phone Number",
      email: "Email Address",
      password: "Password",
      enterOtp: "Enter OTP",
      sendOtp: "Send OTP",
      verifyOtp: "Verify OTP",
      login: "Login",
      continueWith: "Or continue with",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign Up",
      terms: "By continuing, you agree to our Terms & Privacy Policy",
      patientDesc: "Access your health records, book appointments, and manage family health",
      ashaDesc: "Manage community health programs and patient outreach",
      doctorDesc: "Manage patients, appointments, and medical consultations",
      adminDesc: "Oversee healthcare programs and manage system data"
    },
    hindi: {
      welcome: "EasyMed में आपका स्वागत है",
      tagline: "आपके परिवार का स्वास्थ्य, बस एक टैप दूर",
      patient: "मरीज़/परिवार",
      asha: "आशा कार्यकर्ता",
      doctor: "डॉक्टर/स्वास्थ्य प्रदाता",
      admin: "एडमिन/एनजीओ",
      phoneLogin: "फोन से लॉगिन करें",
      emailLogin: "ईमेल से लॉगिन करें",
      socialLogin: "सामाजिक लॉगिन",
      phoneNumber: "फोन नंबर",
      email: "ईमेल पता",
      password: "पासवर्ड",
      enterOtp: "OTP दर्ज करें",
      sendOtp: "OTP भेजें",
      verifyOtp: "OTP सत्यापित करें",
      login: "लॉगिन",
      continueWith: "या जारी रखें",
      dontHaveAccount: "खाता नहीं है?",
      signUp: "साइन अप करें",
      terms: "जारी रखकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं",
      patientDesc: "अपने स्वास्थ्य रिकॉर्ड तक पहुंचें, अपॉइंटमेंट बुक करें और पारिवारिक स्वास्थ्य प्रबंधित करें",
      ashaDesc: "सामुदायिक स्वास्थ्य कार्यक्रमों और रोगी आउटरीच का प्रबंधन करें",
      doctorDesc: "रोगियों, अपॉइंटमेंट्स और चिकित्सा परामर्श का प्रबंधन करें",
      adminDesc: "स्वास्थ्य कार्यक्रमों की देखरेख करें और सिस्टम डेटा प्रबंधित करें"
    },
    tamil: {
      welcome: "EasyMed இல் உங்களை வரவேற்கிறோம்",
      tagline: "உங்கள் குடும்பத்தின் ஆரோக்கியம், ஒரு தட்டல் தூரத்தில்",
      patient: "நோயாளி/குடும்பம்",
      asha: "ஆஷா பணியாளர்",
      doctor: "மருத்துவர்/சுகாதார வழங்குநர்",
      admin: "நிர்வாகி/என்ஜிஓ",
      phoneLogin: "தொலைபேசியில் உள்நுழைக",
      emailLogin: "மின்னஞ்சலில் உள்நுழைக",
      socialLogin: "சமூக உள்நுழைவு",
      phoneNumber: "தொலைபேசி எண்",
      email: "மின்னஞ்சல் முகவரி",
      password: "கடவுச்சொல்",
      enterOtp: "OTP ஐ உள்ளிடவும்",
      sendOtp: "OTP அனுப்பு",
      verifyOtp: "OTP சரிபார்க்கவும்",
      login: "உள்நுழைக",
      continueWith: "அல்லது தொடரவும்",
      dontHaveAccount: "கணக்கு இல்லையா?",
      signUp: "பதிவு செய்யவும்",
      terms: "தொடர்வதன் மூலம், எங்கள் விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஒப்புக்கொள்கிறீர்கள்",
      patientDesc: "உங்கள் சுகாதார பதிவுகளை அணுகவும், நியமனங்களை முன்பதிவு செய்யவும் மற்றும் குடும்ப சுகாதாரத்தை நிர்வகிக்கவும்",
      ashaDesc: "சமூக சுகாதார திட்டங்கள் மற்றும் நோயாளி வெளியீட்டை நிர்வகிக்கவும்",
      doctorDesc: "நோயாளிகள், நியமனங்கள் மற்றும் மருத்துவ ஆலோசனைகளை நிர்வகிக்கவும்",
      adminDesc: "சுகாதார திட்டங்களை மேற்பார்வையிடுங்கள் மற்றும் கணினி தரவை நிர்வகிக்கவும்"
    }
  };

  const getText = (key: keyof typeof loginTexts.english): string => {
    return loginTexts[currentLanguage as keyof typeof loginTexts]?.[key] || loginTexts.english[key];
  };

  const userTypes = [
    {
      id: 'patient' as const,
      icon: '👨‍👩‍👧‍👦',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'asha' as const,
      icon: '👩‍⚕️',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'doctor' as const,
      icon: '👨‍⚕️',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'admin' as const,
      icon: '🏛️',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleSendOTP = async () => {
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      
      // Auto-login for your admin number
      if (phoneNumber === '9060328119' && activeTab === 'admin') {
        setTimeout(() => {
          setIsLoading(false);
          handleLogin();
        }, 1000);
        return;
      }
      
      // Simulate OTP sending with realistic delay for other numbers
      setTimeout(() => {
        setShowOTP(true);
        setIsLoading(false);
        // Generate a random 6-digit OTP for demo
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOTP(otpCode);
        console.log(`OTP for ${phoneNumber}: ${otpCode}`);
        alert(`OTP sent to ${phoneNumber}\nFor demo purposes, your OTP is: ${otpCode}\n\nCopy this OTP and paste it in the verification field.`);
      }, 1500);
    } else {
      alert('Please enter a valid phone number (minimum 10 digits)');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (activeTab === 'admin') {
        // Admin login with multiple methods
        let success = false;
        
        // Method 1: Phone number check
        if (loginMethod === 'phone' && phoneNumber === '9060328119') {
          success = await loginAdmin(phoneNumber, {
            name: 'Super Admin',
            email: email
          });
        }
        // Method 2: Email and password check for admin
        else if (loginMethod === 'email' && 
                 (email === 'admin@easymed.in' || email === 'admin@gmail.com' || email === 'superadmin@easymed.in') && 
                 (password === 'admin123' || password === 'easymed2025' || password === 'admin@123')) {
          success = await loginAdmin(email, {
            name: 'Super Admin (Email)',
            email: email,
            phone: '9060328119'
          });
        }
        
        if (success) {
          const userInfo = {
            phoneNumber: phoneNumber || '9060328119',
            email,
            loginMethod,
            name: 'Super Admin',
            role: 'super_admin',
            timestamp: new Date().toISOString()
          };
          onLogin('admin', userInfo);
        } else {
          alert('Access denied. Use one of these methods:\n\n📱 Phone: 9060328119\n📧 Email: admin@easymed.in\n🔑 Password: admin123\n\nOr try: admin@gmail.com / easymed2025');
        }
      } else {
        // Regular user login simulation
        if (loginMethod === 'phone' && showOTP) {
          // For phone login with OTP, validate OTP
          if (otp.length < 4) {
            alert('Please enter a valid OTP');
            setIsLoading(false);
            return;
          }
          
          // Check if OTP matches the generated one (for demo)
          if (generatedOTP && otp !== generatedOTP) {
            alert(`Invalid OTP. Please enter the correct OTP.\nHint: Check the console or the alert message for the correct OTP.`);
            setIsLoading(false);
            return;
          }
        }
        
        setTimeout(() => {
          const userInfo = {
            phoneNumber,
            email,
            loginMethod,
            name: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} User`,
            timestamp: new Date().toISOString()
          };
          onLogin(activeTab, userInfo);
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      const userInfo = {
        loginMethod: 'social',
        provider,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        timestamp: new Date().toISOString()
      };
      onLogin(activeTab, userInfo);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = () => {
    alert('Signup functionality will redirect to registration form. For demo, you can login directly with any credentials.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V21H5V3H13V9H21ZM14 13V15H12V17H14V19H16V17H18V15H16V13H14ZM19.5 19.5L17.5 17.5L19 16L19.5 16.5L22 14L23.5 15.5L19.5 19.5Z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {getText('welcome')}
          </h1>
          <p className="text-gray-600 text-sm">{getText('tagline')}</p>
          
          {/* Admin Privilege Indicator */}
          {activeTab === 'admin' && (
            <div className="mt-3 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-bold flex items-center justify-center mb-2">
                <span className="mr-2">👑</span>
                Admin Login Options
              </p>
              <div className="text-blue-700 text-xs space-y-1">
                <p><strong>📱 Phone:</strong> 9060328119 (Auto login)</p>
                <p><strong>📧 Email:</strong> admin@easymed.in</p>
                <p><strong>🔑 Password:</strong> admin123</p>
                <p className="text-blue-600 mt-2">Alternative: admin@gmail.com / easymed2025</p>
              </div>
            </div>
          )}
        </div>

        {/* User Type Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Select User Type</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  activeTab === type.id
                    ? `bg-gradient-to-br ${type.bgColor} ${type.borderColor} border-opacity-50 scale-105 shadow-lg`
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${activeTab === type.id ? 'scale-110' : ''} transition-transform`}>
                    {type.icon}
                  </div>
                  <div className={`text-xs font-semibold ${
                    activeTab === type.id 
                      ? `bg-gradient-to-r ${type.color} bg-clip-text text-transparent`
                      : 'text-gray-600'
                  }`}>
                    {getText(type.id)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* User Type Description */}
          <div className="text-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
            <p className="text-xs text-gray-600">{getText(`${activeTab}Desc` as keyof typeof loginTexts.english)}</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
          {/* Login Method Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              📱 {getText('phoneLogin')}
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              ✉️ {getText('emailLogin')}
            </button>
          </div>

          {/* Phone Login */}
          {loginMethod === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('phoneNumber')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-16 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>

              {!showOTP ? (
                <button
                  onClick={handleSendOTP}
                  disabled={phoneNumber.length < 10 || isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[0.98] transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{phoneNumber === '9060328119' && activeTab === 'admin' ? 'Logging in...' : 'Sending...'}</span>
                    </div>
                  ) : (
                    phoneNumber === '9060328119' && activeTab === 'admin' ? 'Auto Login' : getText('sendOtp')
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('enterOtp')}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                      placeholder="0000"
                      maxLength={4}
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={otp.length < 4 || isLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      getText('verifyOtp')
                    )}
                  </button>
                  
                  {/* Resend OTP Button */}
                  <button
                    onClick={() => {
                      setOtp('');
                      setShowOTP(false);
                      handleSendOTP();
                    }}
                    disabled={isLoading}
                    className="w-full py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Email Login */}
          {loginMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={!email || !password || isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[0.98] transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  getText('login')
                )}
              </button>
            </div>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{getText('continueWith')}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                ) : (
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuNDMgMTBDNC40MyA5LjE4IDQuNjEgOC40MiA0LjkzIDcuNzNMMS4zMSA0Ljk1QzAuNDggNi40NSAwIDguMTcgMCAxMEMwIDExLjgzIDAuNDggMTMuNTUgMS4zMSAxNS4wNUw0LjkzIDEyLjI3QzQuNjEgMTEuNTggNC40MyAxMC44MiA0LjQzIDEwWiIgZmlsbD0iI0ZCQkMwNCIvPgo8cGF0aCBkPSJNMTAgNC4xM0MxMS41NSA0LjEzIDEyLjk5IDQuNzMgMTQuMTIgNS43N0wxNy4zNiAyLjUzQzE1LjUxIDEuMDYgMTIuOTMgMC4yNSAxMCAwLjI1QzYuMDkgMC4yNSAyLjcxIDIuNDcgMS4zMSA1LjA1TDQuOTMgNy43M0M1Ljc5IDUuNTMgNy43IDQuMTMgMTAgNC4xM1oiIGZpbGw9IiNFQTQzMzUiLz4KPHN0YXRoIGQ9Ik0xMCAxNS44N0M3LjcgMTUuODcgNS43OSAxNC40NyA0LjkzIDEyLjI3TDEuMzEgMTUuMDVDMi43MSAxNy41MyA2LjA5IDE5Ljc1IDEwIDE5Ljc1QzEyLjgyIDE5Ljc1IDE1LjM1IDE4Ljk3IDE3LjI5IDE3LjU0TDEzLjkgMTQuODdDMTIuODggMTUuNTEgMTEuNDggMTUuODcgMTAgMTUuODdaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik0xNy4yOSAyLjQ2TDEzLjkgNS4xM0MxMi44OCA0LjQ5IDExLjQ4IDQuMTMgMTAgNC4xM1Y0LjEzVjE1Ljg3QzExLjQ4IDE1Ljg3IDEyLjg4IDE1LjUxIDEzLjkgMTQuODdMMTcuMjkgMTcuNTRDMTkuMDggMTYuMTYgMjAuMDcgMTMuNjggMjAuMDcgMTBTMTkuMDggMy44NCAxNy4yOSAyLjQ2WiIgZmlsbD0iIzQyODVGNCIvPgo8L3N2Zz4K" alt="Google" className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span className="text-xl">f</span>
                )}
              </button>
              
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                className="flex items-center justify-center py-3 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span className="text-xl">🍎</span>
                )}
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {getText('dontHaveAccount')}{' '}
              <button 
                onClick={handleSignup}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                {getText('signUp')}
              </button>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">{getText('terms')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
