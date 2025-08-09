import { useLanguage } from "../../contexts/LanguageContext";

interface DoctorSpecificDashboardProps {
  user: {
    userType: "doctor";
    name: string;
  };
}

export default function DoctorSpecificDashboard({
  user,
}: DoctorSpecificDashboardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Doctor Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold">Welcome Dr. {user.name}</h2>
        <p className="text-teal-100">Medical Professional Dashboard</p>
      </div>

      {/* Doctor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-800">18</p>
              <p className="text-green-600 text-sm">3 pending</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Patients Treated</p>
              <p className="text-2xl font-bold text-gray-800">156</p>
              <p className="text-blue-600 text-sm">This month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Prescriptions</p>
              <p className="text-2xl font-bold text-gray-800">89</p>
              <p className="text-purple-600 text-sm">This week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Telemedicine</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-orange-600 text-sm">Video consultations</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">📅</span>
          <span className="font-semibold">Appointment Schedule</span>
        </button>

        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">📋</span>
          <span className="font-semibold">Patient Records</span>
        </button>

        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">💊</span>
          <span className="font-semibold">Prescription Management</span>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl hover:shadow-lg transition-all">
          <span className="text-2xl mb-2 block">💻</span>
          <span className="font-semibold">Telemedicine</span>
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Today's Schedule
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold">Rajesh Kumar - Follow-up</p>
              <p className="text-sm text-gray-600">Hypertension monitoring</p>
            </div>
            <span className="text-sm font-medium text-blue-600">10:00 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-semibold">Priya Sharma - Telemedicine</p>
              <p className="text-sm text-gray-600">Diabetes consultation</p>
            </div>
            <span className="text-sm font-medium text-green-600">11:30 AM</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <p className="font-semibold">Health Camp Visit</p>
              <p className="text-sm text-gray-600">
                Community screening program
              </p>
            </div>
            <span className="text-sm font-medium text-purple-600">2:00 PM</span>
          </div>
        </div>
      </div>

      {/* Clinical Analytics */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Clinical Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-800">Patient Outcomes</h4>
            <p className="text-sm text-gray-600">Recovery rate: 94%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">⭐</span>
            </div>
            <h4 className="font-semibold text-gray-800">
              Patient Satisfaction
            </h4>
            <p className="text-sm text-gray-600">Rating: 4.8/5</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-800">
              Treatment Efficiency
            </h4>
            <p className="text-sm text-gray-600">Average: 12 min/patient</p>
          </div>
        </div>
      </div>
    </div>
  );
}
