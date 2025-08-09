import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import QuickActions from "@/components/dashboard/QuickActions";
import AiAssistant from "@/components/dashboard/AiAssistant";
import RecentActivities from "@/components/dashboard/RecentActivities";
import PatientTable from "@/components/patients/PatientTable";
import MedicalRecords from "@/components/records/MedicalRecords";
import PrescriptionManagement from "@/components/prescriptions/PrescriptionManagement";

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Welcome back, Dr. {import.meta.env.VITE_DOCTOR_NAME || "User"}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>

        {/* Quick Actions & AI Assistant */}
        <div className="space-y-6">
          <QuickActions />
          <AiAssistant />
          <RecentActivities />
        </div>
      </div>

      {/* Patient Management Section */}
      <PatientTable />

      {/* Medical Records & Prescription Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MedicalRecords />
        <PrescriptionManagement />
      </div>
    </main>
  );
}
