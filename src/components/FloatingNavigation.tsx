import { useState } from "react";

interface NavItem {
  id: string;
  icon: string;
  label: string;
  gradient: string;
  isActive?: boolean;
}

export default function FloatingNavigation() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      icon: "🏠",
      label: "Home",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "health",
      icon: "💓",
      label: "Health",
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "ai",
      icon: "🤖",
      label: "AI Doctor",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "family",
      icon: "👨‍👩‍👧‍👦",
      label: "Family",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "profile",
      icon: "👤",
      label: "Profile",
      gradient: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <>
      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        {/* Glassmorphism Background */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-white/30 shadow-2xl">
          <div className="flex items-center justify-around py-2 px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 min-w-[60px] ${
                  activeNav === item.id
                    ? "transform -translate-y-2"
                    : "hover:scale-105"
                }`}
              >
                {/* Active Background */}
                {activeNav === item.id && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-20 blur-sm scale-110`}
                  ></div>
                )}

                {/* Icon Container */}
                <div
                  className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeNav === item.id
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-110`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span
                    className={`text-lg transition-all duration-300 ${
                      activeNav === item.id ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium mt-1 transition-all duration-300 ${
                    activeNav === item.id
                      ? `bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent font-bold`
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {activeNav === item.id && (
                  <div
                    className={`absolute -top-1 w-2 h-2 bg-gradient-to-r ${item.gradient} rounded-full animate-pulse`}
                  ></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button - Desktop */}
      <div className="hidden sm:block fixed bottom-8 right-8 z-50">
        <div className="relative group">
          {/* Main FAB */}
          <button className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group">
            <span className="text-white text-2xl group-hover:rotate-12 transition-transform duration-300">
              🩺
            </span>
          </button>

          {/* Quick Actions on Hover */}
          <div className="absolute bottom-20 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 space-y-3">
            {[
              {
                icon: "🚑",
                label: "Emergency",
                gradient: "from-red-500 to-pink-500",
              },
              {
                icon: "📞",
                label: "Call Doctor",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: "💊",
                label: "Medicine",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "📊",
                label: "Vitals",
                gradient: "from-purple-500 to-indigo-500",
              },
            ].map((action, index) => (
              <div
                key={action.label}
                className="flex items-center space-x-3 transform transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center`}
                >
                  <span className="text-white text-lg">{action.icon}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
