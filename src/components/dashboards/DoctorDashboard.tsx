import { useState, useEffect } from 'react';
import AddNewDoctor from './AddNewDoctor';
import LanguageSelector from '../LanguageSelector';
import VoiceInterface from '../VoiceInterface';
import { voiceService, ClinicalInsight } from '../../services/openai';

interface DoctorDashboardProps {
  userInfo: any;
  onLogout: () => void;
}

export default function DoctorDashboard({ userInfo, onLogout }: DoctorDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [clinicalInsights, setClinicalInsights] = useState<ClinicalInsight[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    if (selectedPatient) {
      const fetchClinicalInsights = async () => {
        const insights = await voiceService.getClinicalDecisionSupport(selectedPatient);
        setClinicalInsights(insights);
      };
      fetchClinicalInsights();
    }
  }, [selectedPatient]);

  const appointments = [
    {
      id: 1,
      patient: 'Ramesh Kumar',
      age: 45,
      time: '10:00 AM',
      type: 'Video Consultation',
      condition: 'Diabetes follow-up',
      status: 'Confirmed',
      ashaWorker: 'Kamala ASHA'
    },
    {
      id: 2,
      patient: 'Lakshmi Devi',
      age: 28,
      time: '11:30 AM',
      type: 'In-person',
      condition: 'Pregnancy checkup',
      status: 'Confirmed',
      ashaWorker: 'Priya ASHA'
    },
    {
      id: 3,
      patient: 'Suresh Babu',
      age: 52,
      time: '2:00 PM',
      type: 'Video Consultation',
      condition: 'Hypertension',
      status: 'Pending',
      ashaWorker: 'Kamala ASHA'
    }
  ];

  const patientQueue = [
    {
      id: 1,
      patient: 'Venkat Rao',
      condition: 'Chest pain',
      priority: 'High',
      waitTime: '15 mins',
      ashaSupport: true
    },
    {
      id: 2,
      patient: 'Meera Sundaram',
      condition: 'Regular checkup',
      priority: 'Normal',
      waitTime: '25 mins',
      ashaSupport: false
    }
  ];

  const consultationHistory = [
    {
      id: 1,
      patient: 'Ravi Kumar',
      date: '2025-01-25',
      diagnosis: 'Type 2 Diabetes',
      prescription: 'Metformin 500mg, Diet modification',
      followUp: '2025-02-25',
      ashaWorker: 'Kamala ASHA'
    },
    {
      id: 2,
      patient: 'Sowmya Rani',
      date: '2025-01-23',
      diagnosis: 'Pregnancy - Normal',
      prescription: 'Folic acid, Iron supplements',
      followUp: '2025-02-23',
      ashaWorker: 'Priya ASHA'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🩺</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">EasyMedPro</h1>
                  <p className="text-purple-100 text-sm">Doctor Portal</p>
                </div>
              </div>
              <span className="ml-4 px-4 py-2 bg-purple-500/30 backdrop-blur-sm text-purple-100 rounded-full text-sm font-medium border border-purple-300/30">
                Dr. {userInfo?.name || 'Doctor'}
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
                    {userInfo?.name?.charAt(0) || 'D'}
                  </span>
                </div>
                <span className="hidden sm:block">
                  Welcome, Dr. {userInfo?.name || 'Doctor'}
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
          {/* Modern Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-white">🩺</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800">
                  Dr. {userInfo?.name || 'Doctor'}
                </h3>
                <p className="text-center text-sm text-gray-600">
                  Medical Professional
                </p>
              </div>
              
              <ul className="space-y-2">
                {[
                  { id: 'overview', name: 'Dashboard', icon: '📊', color: 'from-purple-500 to-purple-600' },
                  { id: 'appointments', name: 'Appointments', icon: '📅', color: 'from-blue-500 to-blue-600' },
                  { id: 'patient-queue', name: 'Patient Queue', icon: '👥', color: 'from-green-500 to-green-600' },
                  { id: 'video-consultation', name: 'Video Calls', icon: '📹', color: 'from-red-500 to-red-600' },
                  { id: 'history', name: 'History', icon: '📋', color: 'from-orange-500 to-orange-600' },
                  { id: 'prescriptions', name: 'Prescriptions', icon: '💊', color: 'from-pink-500 to-pink-600' },
                  { id: 'profile', name: 'Profile', icon: '👤', color: 'from-indigo-500 to-indigo-600' }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeSection === item.id 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform`
                      }`}>
                        <span className="text-sm">{item.icon}</span>
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* Voice Interface for Mobile */}
              <div className="mt-6 sm:hidden">
                <VoiceInterface />
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'overview' && (
              <div className="space-y-8">
                {/* Modern Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">Good Morning, Dr. {userInfo?.name || 'Doctor'}! 👋</h2>
                      <p className="text-gray-600">Ready to help your patients today?</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">System Online</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                        <span className="text-sm">🩺 Professional Portal</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Today's Appointments</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{appointments.length}</p>
                        <p className="text-green-600 text-sm mt-1">📅 Next at 10:00 AM</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">📅</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Patients in Queue</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{patientQueue.length}</p>
                        <p className="text-green-600 text-sm mt-1">� Ready to see</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">👥</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Video Consultations</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{appointments.filter(a => a.type === 'Video Consultation').length}</p>
                        <p className="text-red-600 text-sm mt-1">📹 Virtual care</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">📹</span>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* Quick Actions with Modern Design */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📹', title: 'Start Video Call', desc: 'Begin consultation', color: 'from-red-500 to-pink-500' },
                      { icon: '👥', title: 'View Queue', desc: 'Check waiting patients', color: 'from-blue-500 to-cyan-500' },
                      { icon: '💊', title: 'Prescriptions', desc: 'Write medicine', color: 'from-green-500 to-teal-500' },
                      { icon: '📋', title: 'Patient Records', desc: 'View history', color: 'from-purple-500 to-indigo-500' }
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                      >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                        <h4 className="font-bold text-lg">{action.title}</h4>
                        <p className="text-sm opacity-90">{action.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule with Modern Design */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">📅</span>
                    Today's Schedule
                  </h3>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xl">
                            {appointment.type === 'Video Consultation' ? '📹' : '🏥'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{appointment.time} - {appointment.patient}</p>
                          <p className="text-blue-600 text-sm">{appointment.condition} • {appointment.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
                  <AddNewDoctor />
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Schedule New
                  </button>
                </div>

                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.patient}</h3>
                          <p className="text-gray-600">Age: {appointment.age} | {appointment.condition}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-700">⏰ {appointment.time}</p>
                            <p className="text-gray-700">
                              {appointment.type === 'Video Consultation' ? '📹' : '🏥'} {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                          <div className="mt-2 space-y-2">
                            {appointment.type === 'Video Consultation' && (
                              <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Start Video Call
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPatient(appointment)}
                              className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                              View Records
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'video-consultation' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Video Consultation</h2>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📹</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Consultation Center</h3>
                    <p className="text-gray-600 mb-6">Connect with patients remotely, with ASHA worker support when needed</p>
                    
                    <div className="space-y-4 max-w-md mx-auto">
                      <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                        <span>📹</span>
                        <span>Join Scheduled Call</span>
                      </button>
                      
                      <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                        <span>🔗</span>
                        <span>Create Instant Meeting</span>
                      </button>
                      
                      <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                        <span>📋</span>
                        <span>Schedule Future Call</span>
                      </button>
                    </div>
                    
                    <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Video Consultation Features:</h4>
                      <ul className="text-left text-gray-700 space-y-1">
                        <li>• High-quality video and audio</li>
                        <li>• ASHA worker can join as translator/support</li>
                        <li>• Screen sharing for educational materials</li>
                        <li>• Automatic recording for records (with consent)</li>
                        <li>• Digital prescription sharing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'patient-queue' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Patient Queue</h2>

                <div className="grid gap-4">
                  {patientQueue.map((patient) => (
                    <div key={patient.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{patient.patient}</h3>
                          <p className="text-gray-600">{patient.condition}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-700">⏱️ Waiting: {patient.waitTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            patient.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {patient.priority} Priority
                          </span>
                          <div className="mt-2 space-y-2">
                            <button className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                              Call Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Consultation History</h2>

                <div className="grid gap-4">
                  {consultationHistory.map((consultation) => (
                    <div key={consultation.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{consultation.patient}</h3>
                          <p className="text-gray-600">📅 {consultation.date}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-700"><span className="font-medium">Diagnosis:</span> {consultation.diagnosis}</p>
                            <p className="text-gray-700"><span className="font-medium">Prescription:</span> {consultation.prescription}</p>
                            <p className="text-gray-700"><span className="font-medium">Follow-up:</span> {consultation.followUp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            View Full Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
