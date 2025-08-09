import React from "react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: "New Patient",
      description: "Register a new patient",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      onClick: () => console.log("New Patient"),
    },
    {
      title: "Schedule Appointment",
      description: "Book new appointment",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: () => console.log("Schedule Appointment"),
    },
    {
      title: "Write Prescription",
      description: "Create new prescription",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      onClick: () => console.log("Write Prescription"),
    },
    {
      title: "Medical Records",
      description: "View patient records",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      onClick: () => console.log("Medical Records"),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-colors text-left ${action.color}`}
          >
            <div className="flex items-center space-x-3">
              {action.icon}
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs opacity-75">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
