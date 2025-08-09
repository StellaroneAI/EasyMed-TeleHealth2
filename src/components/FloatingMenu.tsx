import { useState } from "react";

interface FloatingMenuProps {
  onMenuSelect: (menu: string) => void;
  activeMenu: string;
}

export default function FloatingMenu({
  onMenuSelect,
  activeMenu,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "overview",
      icon: "🏠",
      label: "Home",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "appointments",
      icon: "📅",
      label: "Appointments",
      color: "from-green-500 to-green-600",
    },
    {
      id: "video-consultation",
      icon: "📹",
      label: "Video",
      color: "from-red-500 to-red-600",
    },
    {
      id: "health-records",
      icon: "📋",
      label: "Records",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "government-schemes",
      icon: "🏛️",
      label: "Schemes",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Menu Items */}
      <div
        className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
          isOpen
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4 pointer-events-none"
        }`}
      >
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`transform transition-all duration-300 delay-${index * 50}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => {
                onMenuSelect(item.id);
                setIsOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                activeMenu === item.id
                  ? `bg-gradient-to-r ${item.color} text-white`
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${
          isOpen ? "rotate-45" : "rotate-0"
        }`}
      >
        <span className="text-2xl">{isOpen ? "✕" : "⚡"}</span>
      </button>
    </div>
  );
}
