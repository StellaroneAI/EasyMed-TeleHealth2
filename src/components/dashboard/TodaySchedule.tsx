import React from "react";

interface Appointment {
  id: string;
  time: string;
  patient: string;
  type: string;
  status: "upcoming" | "in-progress" | "completed";
}

export default function TodaySchedule() {
  const appointments: Appointment[] = [
    {
      id: "1",
      time: "09:00 AM",
      patient: "Sarah Johnson",
      type: "General Checkup",
      status: "completed",
    },
    {
      id: "2",
      time: "10:30 AM",
      patient: "Michael Chen",
      type: "Follow-up",
      status: "in-progress",
    },
    {
      id: "3",
      time: "11:15 AM",
      patient: "Emily Davis",
      type: "Consultation",
      status: "upcoming",
    },
    {
      id: "4",
      time: "02:00 PM",
      patient: "Robert Wilson",
      type: "Physical Exam",
      status: "upcoming",
    },
    {
      id: "5",
      time: "03:30 PM",
      patient: "Lisa Brown",
      type: "Blood Work Review",
      status: "upcoming",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Today's Schedule
        </h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-900">
                {appointment.time}
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.patient}
                </p>
                <p className="text-sm text-gray-600">{appointment.type}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                appointment.status,
              )}`}
            >
              {appointment.status.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Add New Appointment
        </button>
      </div>
    </div>
  );
}
