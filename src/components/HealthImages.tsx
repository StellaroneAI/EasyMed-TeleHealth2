import React from "react";

interface HealthImageProps {
  type:
    | "doctor"
    | "patient"
    | "asha"
    | "telemedicine"
    | "hospital"
    | "medicine"
    | "health";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const healthImages = {
  doctor: {
    icon: "👨‍⚕️",
    gradient: "from-blue-500 to-blue-600",
    emoji: "🩺",
  },
  patient: {
    icon: "👤",
    gradient: "from-green-500 to-green-600",
    emoji: "🫂",
  },
  asha: {
    icon: "👩‍⚕️",
    gradient: "from-teal-500 to-teal-600",
    emoji: "🤝",
  },
  telemedicine: {
    icon: "📹",
    gradient: "from-purple-500 to-purple-600",
    emoji: "💻",
  },
  hospital: {
    icon: "🏥",
    gradient: "from-red-500 to-red-600",
    emoji: "🚑",
  },
  medicine: {
    icon: "💊",
    gradient: "from-pink-500 to-pink-600",
    emoji: "💉",
  },
  health: {
    icon: "❤️",
    gradient: "from-orange-500 to-orange-600",
    emoji: "🌟",
  },
};

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export default function HealthImage({
  type,
  className = "",
  size = "md",
}: HealthImageProps) {
  const image = healthImages[type];
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`${sizeClass} bg-gradient-to-br ${image.gradient} rounded-2xl flex items-center justify-center shadow-lg ${className}`}
    >
      <span className="text-white text-2xl">{image.icon}</span>
    </div>
  );
}

// Healthcare Hero Image Component
interface HealthcareHeroProps {
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}

export function HealthcareHero({
  title,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  className = "",
}: HealthcareHeroProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-3xl p-8 text-white ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-8 gap-4 h-full opacity-30">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <span className="text-4xl">
                  {["🏥", "💊", "🩺", "❤️", "🤝", "📱", "🌟", "🫂"][i % 8]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-blue-100 mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            {primaryAction && (
              <button
                onClick={onPrimaryAction}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {primaryAction}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={onSecondaryAction}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                {secondaryAction}
              </button>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <div className="grid grid-cols-3 gap-2">
            <HealthImage type="doctor" size="sm" />
            <HealthImage type="patient" size="sm" />
            <HealthImage type="asha" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Health Statistics Component with Visual Elements
interface HealthStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    icon: string;
    color: string;
  }>;
  className?: string;
}

export function HealthStats({ stats, className = "" }: HealthStatsProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
            >
              <span className="text-white text-2xl">{stat.icon}</span>
            </div>
            {stat.change && (
              <span className="text-green-600 text-sm font-medium">
                {stat.change}
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {stat.value}
            </p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
