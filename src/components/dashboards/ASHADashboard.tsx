import { useState } from 'react';
import LanguageSelector from '../LanguageSelector';
import VoiceInterface from '../VoiceInterface';

interface ASHADashboardProps {
  userInfo: any;
  onLogout: () => void;
}

export default function ASHADashboard({ userInfo, onLogout }: ASHADashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const communityMembers = [
    {
      id: 1,
      name: 'Lakshmi Devi',
      age: 28,
      condition: 'Pregnancy - 7 months',
      priority: 'High',
      lastVisit: '2025-01-25',
      phone: '9876543210'
    },
    {
      id: 2,
      name: 'Ramesh Kumar',
      age: 45,
      condition: 'Diabetes monitoring',
      priority: 'Medium',
      lastVisit: '2025-01-23',
      phone: '9876543211'
    }
  ];

  const healthPrograms = [
    {
      id: 1,
      name: 'Maternal Health Program',
      participants: 45,
      completed: 38,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Child Immunization Drive',
      participants: 120,
      completed: 105,
      status: 'Ongoing'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-green-600 via-green-700 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">EasyMedPro</h1>
                  <p className="text-green-100 text-sm">ASHA Worker Portal</p>
                </div>
              </div>
              <span className="ml-4 px-4 py-2 bg-green-500/30 backdrop-blur-sm text-green-100 rounded-full text-sm font-medium border border-green-300/30">
                ASHA {userInfo?.name || 'Worker'}
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
                    {userInfo?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <span className="hidden sm:block">
                  Welcome, {userInfo?.name || 'ASHA Worker'}
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
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-white">👩‍⚕️</span>
                </div>
                <h3 className="text-center font-semibold text-gray-800">
                  {userInfo?.name || 'ASHA Worker'}
                </h3>
                <p className="text-center text-sm text-gray-600">
                  Community Health Worker
                </p>
              </div>
              
              <ul className="space-y-2">
                {[
                  { id: 'overview', name: 'Dashboard', icon: '📊', color: 'from-green-500 to-green-600' },
                  { id: 'community', name: 'Community Members', icon: '👥', color: 'from-blue-500 to-blue-600' },
                  { id: 'programs', name: 'Health Programs', icon: '🏥', color: 'from-purple-500 to-purple-600' },
                  { id: 'visits', name: 'Home Visits', icon: '🏠', color: 'from-orange-500 to-orange-600' },
                  { id: 'reports', name: 'Reports', icon: '📋', color: 'from-red-500 to-red-600' },
                  { id: 'profile', name: 'Profile', icon: '👤', color: 'from-indigo-500 to-indigo-600' }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg scale-105'
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
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">Good Morning, {userInfo?.name || 'ASHA Worker'}! 👋</h2>
                      <p className="text-gray-600">Ready to serve your community today?</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">System Online</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                        <span className="text-sm">👩‍⚕️ Community Portal</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Community Members</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{communityMembers.length}</p>
                        <p className="text-green-600 text-sm mt-1">👥 Under care</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">👥</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Active Programs</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{healthPrograms.length}</p>
                        <p className="text-blue-600 text-sm mt-1">🏥 Health programs</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">🏥</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">High Priority</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{communityMembers.filter(m => m.priority === 'High').length}</p>
                        <p className="text-red-600 text-sm mt-1">⚠️ Immediate attention</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">⚠️</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Today's Visits</p>
                        <p className="text-3xl font-bold text-purple-600 mt-1">5</p>
                        <p className="text-purple-600 text-sm mt-1">🏠 Home visits</p>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-white">🏠</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '🏠', title: 'Schedule Visit', desc: 'Plan home visits', color: 'from-green-500 to-teal-500' },
                      { icon: '📋', title: 'Update Records', desc: 'Member health data', color: 'from-blue-500 to-cyan-500' },
                      { icon: '💊', title: 'Medicine Reminder', desc: 'Track medications', color: 'from-purple-500 to-indigo-500' },
                      { icon: '📞', title: 'Call Doctor', desc: 'Emergency consult', color: 'from-red-500 to-pink-500' }
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
              </div>
            )}

            {activeSection === 'community' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Community Members</h2>

                <div className="grid gap-4">
                  {communityMembers.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-gray-600">Age: {member.age} | {member.condition}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-gray-700">📞 {member.phone}</p>
                            <p className="text-gray-700">📅 Last visit: {member.lastVisit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            member.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {member.priority} Priority
                          </span>
                          <div className="mt-2 space-y-2">
                            <button className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                              Schedule Visit
                            </button>
                            <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Update Record
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'programs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Health Programs</h2>

                <div className="grid gap-4">
                  {healthPrograms.map((program) => (
                    <div key={program.id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                          <p className="text-gray-600">Participants: {program.participants} | Completed: {program.completed}</p>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(program.completed / program.participants) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {Math.round((program.completed / program.participants) * 100)}% Complete
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            program.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {program.status}
                          </span>
                          <div className="mt-2">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                              View Details
                            </button>
                          </div>
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
