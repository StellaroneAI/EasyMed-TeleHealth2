import React, { useState } from "react";

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  status: "Active" | "Completed" | "Cancelled" | "Pending";
  instructions?: string;
}

export default function PrescriptionManagement() {
  const [activeTab, setActiveTab] = useState<"recent" | "pending" | "active">(
    "recent",
  );

  const prescriptions: Prescription[] = [
    {
      id: "RX001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      prescribedDate: "2024-01-22",
      status: "Active",
      instructions: "Take with food in the morning",
    },
    {
      id: "RX002",
      patientName: "Michael Chen",
      patientId: "P002",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      prescribedDate: "2024-01-21",
      status: "Active",
      instructions: "Take with meals",
    },
    {
      id: "RX003",
      patientName: "Emily Davis",
      patientId: "P003",
      medication: "Sumatriptan",
      dosage: "50mg",
      frequency: "As needed",
      duration: "30 days",
      prescribedDate: "2024-01-20",
      status: "Pending",
      instructions: "For migraine headaches only",
    },
    {
      id: "RX004",
      patientName: "Robert Wilson",
      patientId: "P004",
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "Three times daily",
      duration: "14 days",
      prescribedDate: "2024-01-15",
      status: "Completed",
      instructions: "Take with food to reduce stomach irritation",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    switch (activeTab) {
      case "pending":
        return prescription.status === "Pending";
      case "active":
        return prescription.status === "Active";
      case "recent":
      default:
        return true;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Prescription Management
        </h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          New Prescription
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: "recent", label: "Recent" },
          { key: "pending", label: "Pending" },
          { key: "active", label: "Active" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {prescription.id}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      prescription.status,
                    )}`}
                  >
                    {prescription.status}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900">
                  {prescription.patientName} ({prescription.patientId})
                </h3>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Edit
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm">
                  Print
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Medication
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {prescription.medication}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Dosage
                </p>
                <p className="text-sm text-gray-900">{prescription.dosage}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Frequency
                </p>
                <p className="text-sm text-gray-900">
                  {prescription.frequency}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Duration
                </p>
                <p className="text-sm text-gray-900">{prescription.duration}</p>
              </div>
            </div>

            {prescription.instructions && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Instructions
                </p>
                <p className="text-sm text-gray-700">
                  {prescription.instructions}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Prescribed on: {prescription.prescribedDate}
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No prescriptions found for the selected filter.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-600">
              {prescriptions.length}
            </p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">
              {prescriptions.filter((p) => p.status === "Active").length}
            </p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600">
              {prescriptions.filter((p) => p.status === "Pending").length}
            </p>
            <p className="text-xs text-gray-600">Pending</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-600">
              {prescriptions.filter((p) => p.status === "Completed").length}
            </p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
