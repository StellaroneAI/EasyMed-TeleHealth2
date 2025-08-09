import React, { useState } from "react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  lastVisit: string;
  status: "Active" | "Inactive";
  condition?: string;
}

export default function PatientTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const patients: Patient[] = [
    {
      id: "P001",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      lastVisit: "2024-01-20",
      status: "Active",
      condition: "Hypertension",
    },
    {
      id: "P002",
      name: "Michael Chen",
      age: 42,
      gender: "Male",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@email.com",
      lastVisit: "2024-01-18",
      status: "Active",
      condition: "Diabetes Type 2",
    },
    {
      id: "P003",
      name: "Emily Davis",
      age: 28,
      gender: "Female",
      phone: "+1 (555) 345-6789",
      email: "emily.davis@email.com",
      lastVisit: "2024-01-15",
      status: "Active",
    },
    {
      id: "P004",
      name: "Robert Wilson",
      age: 56,
      gender: "Male",
      phone: "+1 (555) 456-7890",
      email: "robert.wilson@email.com",
      lastVisit: "2024-01-10",
      status: "Inactive",
      condition: "Arthritis",
    },
    {
      id: "P005",
      name: "Lisa Brown",
      age: 31,
      gender: "Female",
      phone: "+1 (555) 567-8901",
      email: "lisa.brown@email.com",
      lastVisit: "2024-01-22",
      status: "Active",
    },
  ];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Patient Management
        </h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Add New Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "All" | "Active" | "Inactive")
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Patient ID
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Age
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Gender
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Last Visit
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm font-medium text-blue-600">
                  {patient.id}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {patient.name}
                    </p>
                    {patient.condition && (
                      <p className="text-xs text-gray-600">
                        {patient.condition}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {patient.age}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {patient.gender}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm text-gray-900">{patient.phone}</p>
                    <p className="text-xs text-gray-600">{patient.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {patient.lastVisit}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      patient.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No patients found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
