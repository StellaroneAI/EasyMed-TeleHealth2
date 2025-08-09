import { useLanguage } from "../../contexts/LanguageContext";

interface AdminSpecificDashboardProps {
  user: {
    userType: "admin";
    name: string;
  };
}

export default function AdminSpecificDashboard({
  user,
}: AdminSpecificDashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Admin Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold">
          Welcome Administrator, {user.name}
        </h2>
        <p className="text-indigo-100">System Administration Dashboard</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">1,247</p>
              <p className="text-green-600 text-sm">+12% this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ASHA Workers</p>
              <p className="text-2xl font-bold text-gray-800">89</p>
              <p className="text-blue-600 text-sm">Active in system</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Doctors</p>
              <p className="text-2xl font-bold text-gray-800">45</p>
              <p className="text-purple-600 text-sm">
                Registered practitioners
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Health</p>
              <p className="text-2xl font-bold text-green-800">99.2%</p>
              <p className="text-green-600 text-sm">Uptime</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">👥</span>
          <span className="font-semibold">User Management</span>
        </button>

        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">📊</span>
          <span className="font-semibold">Analytics Dashboard</span>
        </button>

        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">⚙️</span>
          <span className="font-semibold">System Settings</span>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">🔒</span>
          <span className="font-semibold">Security Management</span>
        </button>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Recent System Activities
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold">New ASHA Worker Registration</p>
              <p className="text-sm text-gray-600">
                Priya Kumari - Patna District
              </p>
            </div>
            <span className="text-sm font-medium text-blue-600">
              2 hours ago
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-semibold">System Update Completed</p>
              <p className="text-sm text-gray-600">
                EasyMed v2.1.3 deployed successfully
              </p>
            </div>
            <span className="text-sm font-medium text-green-600">
              5 hours ago
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <p className="font-semibold">Data Backup Completed</p>
              <p className="text-sm text-gray-600">Daily backup at 2:00 AM</p>
            </div>
            <span className="text-sm font-medium text-purple-600">
              8 hours ago
            </span>
          </div>
        </div>
      </div>

      {/* System Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Usage Analytics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Patient Logins</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>ASHA Activity</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Doctor Engagement</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Regional Coverage
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Bihar</span>
              <span className="font-semibold">342 users</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Uttar Pradesh</span>
              <span className="font-semibold">298 users</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">West Bengal</span>
              <span className="font-semibold">267 users</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Odisha</span>
              <span className="font-semibold">189 users</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Jharkhand</span>
              <span className="font-semibold">151 users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
