import { useState, useEffect } from "react";

interface DashboardMetrics {
  totalPatients: number;
  activeASHAWorkers: number;
  consultationsToday: number;
  emergencyAlerts: number;
  vaccinesCovered: number;
  chronicDiseasePatients: number;
  maternalHealthCases: number;
  mentalHealthSessions: number;
}

interface RegionData {
  district: string;
  villages: number;
  population: number;
  healthCenters: number;
  ashaWorkers: number;
  coveragePercentage: number;
}

interface HealthAlert {
  id: string;
  type: "EPIDEMIC" | "EMERGENCY" | "SUPPLY_SHORTAGE" | "INFRASTRUCTURE";
  message: string;
  location: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
}

export default function GovernmentNGODashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockMetrics: DashboardMetrics = {
    totalPatients: 45892,
    activeASHAWorkers: 1234,
    consultationsToday: 567,
    emergencyAlerts: 12,
    vaccinesCovered: 8934,
    chronicDiseasePatients: 5678,
    maternalHealthCases: 234,
    mentalHealthSessions: 123,
  };

  const mockRegionData: RegionData[] = [
    {
      district: "Thiruvallur",
      villages: 234,
      population: 890456,
      healthCenters: 45,
      ashaWorkers: 234,
      coveragePercentage: 87,
    },
    {
      district: "Kancheepuram",
      villages: 189,
      population: 756234,
      healthCenters: 38,
      ashaWorkers: 189,
      coveragePercentage: 92,
    },
    {
      district: "Vellore",
      villages: 267,
      population: 1234567,
      healthCenters: 52,
      ashaWorkers: 267,
      coveragePercentage: 84,
    },
  ];

  const mockHealthAlerts: HealthAlert[] = [
    {
      id: "alert1",
      type: "EPIDEMIC",
      message: "Dengue outbreak reported in 3 villages",
      location: "Thiruvallur District",
      severity: "HIGH",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "alert2",
      type: "SUPPLY_SHORTAGE",
      message: "Vaccine stock running low",
      location: "Kancheepuram PHC",
      severity: "MEDIUM",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "alert3",
      type: "EMERGENCY",
      message: "Medical emergency - immediate attention required",
      location: "Vellore District",
      severity: "CRITICAL",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMetrics(mockMetrics);
      setRegionData(mockRegionData);
      setHealthAlerts(mockHealthAlerts);
      setIsLoading(false);
    }, 2000);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "EPIDEMIC":
        return "🦠";
      case "EMERGENCY":
        return "🚨";
      case "SUPPLY_SHORTAGE":
        return "📦";
      case "INFRASTRUCTURE":
        return "🏥";
      default:
        return "⚠️";
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin w-16 h-16 border-4 border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent rounded-full mx-auto mb-6 shadow-lg"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Loading Government Dashboard
            </h2>
            <p className="text-gray-600 text-lg">
              Fetching real-time health data across regions...
            </p>
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-cyan-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/30 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                🏛️ Government Health Command Center
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg max-w-2xl">
                Real-time monitoring and analytics for rural healthcare delivery
                across Tamil Nadu
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </span>
                <span>•</span>
                <span>Last Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border-0 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium"
              >
                <option value="ALL">🌍 All Regions</option>
                {regionData.map((region) => (
                  <option key={region.district} value={region.district}>
                    📍 {region.district}
                  </option>
                ))}
              </select>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm">
                📊 Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.totalPatients || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Total Patients
              </p>
              <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                👩‍⚕️
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.activeASHAWorkers || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                ASHA Workers
              </p>
              <div className="w-full bg-green-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.consultationsToday || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Consultations Today
              </p>
              <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🚨
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {metrics?.emergencyAlerts || 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Emergency Alerts
              </p>
              <div className="w-full bg-red-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-1 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                💉
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.vaccinesCovered || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Vaccines Given
              </p>
              <div className="w-full bg-orange-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-1 rounded-full w-5/6"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🏥
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.chronicDiseasePatients || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Chronic Disease
              </p>
              <div className="w-full bg-indigo-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-1 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🤱
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.maternalHealthCases || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Maternal Health
              </p>
              <div className="w-full bg-pink-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-1 rounded-full w-4/5"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🧠
              </div>
              <p className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {formatNumber(metrics?.mentalHealthSessions || 0)}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Mental Health
              </p>
              <div className="w-full bg-teal-100 rounded-full h-1 mt-2">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Health Alerts */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h3 className="text-lg font-semibold mb-4">
              🚨 Health Alerts & Emergencies
            </h3>
            <div className="space-y-3">
              {healthAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{alert.message}</h4>
                      <p className="text-sm text-gray-600">{alert.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(alert.timestamp)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-all">
                        View Details
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-all">
                        Take Action
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Coverage */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <h3 className="text-lg font-semibold mb-4">
              📍 Regional Health Coverage
            </h3>
            <div className="space-y-4">
              {regionData.map((region) => (
                <div
                  key={region.district}
                  className="p-4 bg-white/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{region.district} District</h4>
                    <span
                      className={`text-sm font-bold ${
                        region.coveragePercentage >= 90
                          ? "text-green-600"
                          : region.coveragePercentage >= 80
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {region.coveragePercentage}% Coverage
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Villages: </span>
                      <span className="font-medium">{region.villages}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Population: </span>
                      <span className="font-medium">
                        {formatNumber(region.population)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Health Centers: </span>
                      <span className="font-medium">
                        {region.healthCenters}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ASHA Workers: </span>
                      <span className="font-medium">{region.ashaWorkers}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          region.coveragePercentage >= 90
                            ? "bg-green-500"
                            : region.coveragePercentage >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${region.coveragePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Status */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/20">
          <h3 className="text-lg font-semibold mb-4">
            🎯 Government Health Program Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🤱</div>
                <div>
                  <h4 className="font-medium text-green-800">
                    Muthulakshmi Reddy Scheme
                  </h4>
                  <p className="text-sm text-green-600">
                    Maternity Support Program
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    87% enrollment target achieved
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏥</div>
                <div>
                  <h4 className="font-medium text-blue-800">Ayushman Bharat</h4>
                  <p className="text-sm text-blue-600">
                    Universal Health Coverage
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    92% ABHA cards distributed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💉</div>
                <div>
                  <h4 className="font-medium text-orange-800">
                    Universal Immunization
                  </h4>
                  <p className="text-sm text-orange-600">
                    Childhood Vaccine Program
                  </p>
                  <p className="text-xs text-orange-500 mt-1">
                    94% coverage achieved
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🧠</div>
                <div>
                  <h4 className="font-medium text-purple-800">
                    Mental Health Initiative
                  </h4>
                  <p className="text-sm text-purple-600">
                    Community Mental Health
                  </p>
                  <p className="text-xs text-purple-500 mt-1">
                    156 counselors deployed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
