import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import QuickActions from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, Dr. {import.meta.env.VITE_DOCTOR_NAME || "User"}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Test: Stats Cards (Working) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">✅ Stats Cards (Working)</h2>
        <StatsCards />
      </div>

      {/* Test: Today's Schedule (Working) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          ✅ Today's Schedule (Working)
        </h2>
        <TodaySchedule />
      </div>

      {/* Test: Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          🔍 Testing: Quick Actions Component
        </h2>
        <QuickActions />
      </div>

      {/* Debug info */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="text-sm text-gray-600">
          🔍 Debug: If you see this and the Quick Actions above looks normal,
          we'll add the next component. If you see an oversized icon, then the
          issue is in the QuickActions component.
        </p>
      </div>
    </main>
  );
}
