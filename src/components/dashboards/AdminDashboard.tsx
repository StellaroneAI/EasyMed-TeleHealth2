import { useState } from "react";
import LanguageSelector from "../LanguageSelector";
import VoiceInterface from "../VoiceInterface";

interface AdminDashboardProps {
  userInfo: any;
  onLogout: () => void;
}

export default function AdminDashboard({
  userInfo,
  onLogout,
}: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const systemStats = {
    totalUsers: 320,
    patients: 220,
    ashaWorkers: 55,
    doctors: 45,
    appointments: 150,
    videoConsultations: 45,
    schemes: 25,
  };

  const recentActivity = [
    {
      id: 1,
      type: "user_registration",
      message: "New patient registration: Kamala Devi",
      time: "2 minutes ago",
      icon: "👤",
    },
    {
      id: 2,
      type: "appointment",
      message: "Video consultation completed: Dr. Rajesh Kumar",
      time: "15 minutes ago",
      icon: "📹",
    },
    {
      id: 3,
      type: "scheme_application",
      message: "Muthulakshmi Reddy scheme application approved",
      time: "1 hour ago",
      icon: "🏛️",
    },
    {
      id: 4,
      type: "asha_update",
      message: "ASHA worker submitted monthly report",
      time: "2 hours ago",
      icon: "📋",
    },
  ];

  const governmentSchemes = [
    {
      name: "Ayushman Bharat",
      applications: 156,
      approved: 142,
      budget: "₹50,00,000",
      utilization: "85%",
    },
    {
      name: "Muthulakshmi Reddy Maternity Assistance",
      applications: 42,
      approved: 38,
      budget: "₹7,20,000",
      utilization: "90%",
    },
    {
      name: "Janani Suraksha Yojana",
      applications: 89,
      approved: 82,
      budget: "₹1,20,000",
      utilization: "92%",
    },
  ];

  const stateWiseData = [
    { state: "Tamil Nadu", patients: 45, asha: 12, doctors: 8, schemes: 6 },
    { state: "Karnataka", patients: 38, asha: 10, doctors: 7, schemes: 5 },
    { state: "Andhra Pradesh", patients: 32, asha: 8, doctors: 6, schemes: 4 },
    { state: "Kerala", patients: 28, asha: 7, doctors: 5, schemes: 4 },
    { state: "Telangana", patients: 25, asha: 6, doctors: 4, schemes: 3 },
    { state: "Others", patients: 52, asha: 12, doctors: 15, schemes: 3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">EasyMedPro</h1>
                  <p className="text-red-100 text-sm">Super Admin Portal</p>
                </div>
              </div>
              <span className="ml-4 px-4 py-2 bg-red-500/30 backdrop-blur-sm text-red-100 rounded-full text-sm font-medium border border-red-300/30">
                System Administrator
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Voice Interface */}
              <VoiceInterface className="hidden sm:block" />

              <div className="flex items-center space-x-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {userInfo?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="hidden sm:block">
                  {userInfo?.name || "Super Admin"}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {[
                  { id: "overview", name: "System Overview", icon: "📊" },
                  { id: "users", name: "User Management", icon: "👥" },
                  { id: "schemes", name: "Government Schemes", icon: "🏛️" },
                  { id: "analytics", name: "Analytics & Reports", icon: "📈" },
                  { id: "state-data", name: "State-wise Data", icon: "🗺️" },
                  { id: "video-system", name: "Video System", icon: "📹" },
                  { id: "database", name: "Database Management", icon: "💾" },
                  { id: "settings", name: "System Settings", icon: "⚙️" },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeSection === item.id
                          ? "bg-red-100 text-red-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  System Overview
                </h2>

                {/* System Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl">👥</div>
                      <div className="ml-4">
                        <p className="text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {systemStats.totalUsers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl">📅</div>
                      <div className="ml-4">
                        <p className="text-gray-600">Appointments</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {systemStats.appointments}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl">📹</div>
                      <div className="ml-4">
                        <p className="text-gray-600">Video Calls</p>
                        <p className="text-2xl font-bold text-green-600">
                          {systemStats.videoConsultations}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl">🏛️</div>
                      <div className="ml-4">
                        <p className="text-gray-600">Active Schemes</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {systemStats.schemes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    User Distribution
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {systemStats.patients}
                      </div>
                      <div className="text-gray-600">Patients</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {systemStats.ashaWorkers}
                      </div>
                      <div className="text-gray-600">ASHA Workers</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {systemStats.doctors}
                      </div>
                      <div className="text-gray-600">Doctors</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent System Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1">
                          <span className="text-gray-800">
                            {activity.message}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "schemes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Government Schemes Management
                  </h2>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Add New Scheme
                  </button>
                </div>

                <div className="grid gap-6">
                  {governmentSchemes.map((scheme, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {scheme.name}
                          </h3>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-gray-600">Applications</p>
                              <p className="text-xl font-bold text-blue-600">
                                {scheme.applications}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Approved</p>
                              <p className="text-xl font-bold text-green-600">
                                {scheme.approved}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Budget</p>
                              <p className="text-xl font-bold text-purple-600">
                                {scheme.budget}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Utilization</p>
                              <p className="text-xl font-bold text-orange-600">
                                {scheme.utilization}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Muthulakshmi Reddy Scheme Highlight */}
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg border border-pink-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🎯 Featured: Muthulakshmi Reddy Maternity Assistance
                  </h3>
                  <p className="text-gray-700 mb-3">
                    This Tamil Nadu state scheme provides ₹18,000 to pregnant
                    women for safe delivery and maternal care.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Active Applications</p>
                      <p className="text-xl font-bold text-pink-600">42</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Success Rate</p>
                      <p className="text-xl font-bold text-green-600">90.5%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Impact</p>
                      <p className="text-xl font-bold text-blue-600">
                        38 families
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "state-data" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  State-wise Healthcare Data
                </h2>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Distribution Across States
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            State
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patients
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ASHA Workers
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doctors
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Active Schemes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stateWiseData.map((state, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {state.state}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                              {state.patients}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                              {state.asha}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                              {state.doctors}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                              {state.schemes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Special focus on Tamil Nadu */}
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🎯 Tamil Nadu - Special Focus State
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Leading state in implementation of Muthulakshmi Reddy
                    Maternity Assistance Scheme and rural healthcare
                    digitization.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Coverage</p>
                      <p className="text-xl font-bold text-orange-600">95%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Digital Adoption</p>
                      <p className="text-xl font-bold text-blue-600">88%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Scheme Utilization</p>
                      <p className="text-xl font-bold text-green-600">92%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-gray-600">Rural Reach</p>
                      <p className="text-xl font-bold text-purple-600">85%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "video-system" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Video Consultation System
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      System Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Server Status</span>
                        <span className="text-green-600 font-semibold">
                          🟢 Online
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Calls</span>
                        <span className="text-blue-600 font-semibold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Queue Length</span>
                        <span className="text-orange-600 font-semibold">8</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Daily Statistics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed Calls</span>
                        <span className="text-green-600 font-semibold">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Duration</span>
                        <span className="text-blue-600 font-semibold">
                          15 min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="text-green-600 font-semibold">
                          96%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ASHA Support
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">With ASHA Support</span>
                        <span className="text-purple-600 font-semibold">
                          78%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Translation Needed
                        </span>
                        <span className="text-orange-600 font-semibold">
                          65%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rural Patients</span>
                        <span className="text-green-600 font-semibold">
                          82%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Video Consultation Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        🎥 Core Features
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• HD video and audio quality</li>
                        <li>• Multi-language support</li>
                        <li>• ASHA worker integration</li>
                        <li>• Screen sharing capabilities</li>
                        <li>• Session recording (with consent)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        🏥 Healthcare Specific
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Digital prescription sharing</li>
                        <li>• Medical image sharing</li>
                        <li>• Appointment scheduling integration</li>
                        <li>• Electronic health records sync</li>
                        <li>• Follow-up reminder system</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "database" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Database Management
                </h2>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Database Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-green-600 text-xl font-bold">
                        ✅ Operational
                      </div>
                      <div className="text-gray-600">MongoDB Atlas</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-blue-600 text-xl font-bold">320</div>
                      <div className="text-gray-600">Total Records</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-purple-600 text-xl font-bold">
                        99.9%
                      </div>
                      <div className="text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Sample Data Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900">
                        ✅ Database Initialized Successfully
                      </h4>
                      <p className="text-blue-700 mt-1">
                        Sample data has been populated with:
                      </p>
                      <ul className="text-blue-700 mt-2 space-y-1">
                        <li>• 220 Patients across all Indian states</li>
                        <li>• 55 ASHA Workers (rural & urban areas)</li>
                        <li>• 45 Doctors with various specializations</li>
                        <li>
                          • 25+ Government schemes including Muthulakshmi Reddy
                        </li>
                        <li>• 150+ Sample appointments</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900">
                        🎯 Special Features
                      </h4>
                      <ul className="text-green-700 mt-2 space-y-1">
                        <li>• State-wise data distribution</li>
                        <li>• Rural healthcare focus</li>
                        <li>• Multilingual support (12 languages)</li>
                        <li>• Government scheme integration</li>
                        <li>• Video consultation ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
