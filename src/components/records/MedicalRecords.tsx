import React, { useState } from "react";

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  type: "Consultation" | "Lab Results" | "Diagnosis" | "Treatment";
  description: string;
  doctor: string;
  status: "Completed" | "Pending" | "Review Required";
}

export default function MedicalRecords() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );

  const records: MedicalRecord[] = [
    {
      id: "MR001",
      patientName: "Sarah Johnson",
      patientId: "P001",
      date: "2024-01-22",
      type: "Consultation",
      description: "Regular check-up and blood pressure monitoring",
      doctor: "Dr. Smith",
      status: "Completed",
    },
    {
      id: "MR002",
      patientName: "Michael Chen",
      patientId: "P002",
      date: "2024-01-21",
      type: "Lab Results",
      description: "Blood glucose levels and HbA1c test results",
      doctor: "Dr. Smith",
      status: "Review Required",
    },
    {
      id: "MR003",
      patientName: "Emily Davis",
      patientId: "P003",
      date: "2024-01-20",
      type: "Diagnosis",
      description: "Migraine headaches - prescribed medication",
      doctor: "Dr. Smith",
      status: "Completed",
    },
    {
      id: "MR004",
      patientName: "Robert Wilson",
      patientId: "P004",
      date: "2024-01-19",
      type: "Treatment",
      description: "Physical therapy for knee pain",
      doctor: "Dr. Smith",
      status: "Pending",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Review Required":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "bg-blue-100 text-blue-800";
      case "Lab Results":
        return "bg-purple-100 text-purple-800";
      case "Diagnosis":
        return "bg-orange-100 text-orange-800";
      case "Treatment":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          New Record
        </button>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {record.id}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                      record.type,
                    )}`}
                  >
                    {record.type}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      record.status,
                    )}`}
                  >
                    {record.status}
                  </span>
                </div>

                <h3 className="font-medium text-gray-900 mb-1">
                  {record.patientName} ({record.patientId})
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {record.description}
                </p>

                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span>Date: {record.date}</span>
                  <span>Doctor: {record.doctor}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No medical records found.</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{records.length}</p>
            <p className="text-sm text-gray-600">Total Records</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {records.filter((r) => r.status === "Completed").length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {records.filter((r) => r.status === "Review Required").length}
            </p>
            <p className="text-sm text-gray-600">Need Review</p>
          </div>
        </div>
      </div>
    </div>
  );
}
