// Sample data for EasyMedPro demo features
export const sampleUser = {
  name: "Rajesh",
  email: "rajesh@example.com",
  health: {
    heartRate: 72,
    bloodPressure: "120/80",
    medications: ["Amlodipine", "Metformin"],
    nextAppointment: {
      doctor: "Dr. Sharma",
      date: "2025-07-30T15:00:00Z",
      type: "General Checkup",
    },
    status: "Normal",
    dueToday: ["Blood Pressure Medication"],
  },
  family: [
    {
      relation: "Wife",
      name: "Priya",
      health: {
        status: "Normal",
        vaccinationDue: "2025-08-05",
      },
    },
    {
      relation: "Son",
      name: "Amit",
      health: {
        status: "Normal",
        vaccinationDue: "2025-08-12",
      },
    },
  ],
  recentActivity: [
    {
      type: "bloodPressureRecorded",
      value: "120/80",
      date: "2025-07-27T10:00:00Z",
    },
    {
      type: "appointmentBooked",
      doctor: "Dr. Sharma",
      date: "2025-07-27T09:00:00Z",
    },
    { type: "healthReportShared", date: "2025-07-26T18:00:00Z" },
  ],
  voiceAssistant: {
    lastCommand: "Show my medication schedule",
    lastResponse: "Your next medication is at 2 PM.",
  },
  abha: {
    connected: true,
    healthId: "ABHA123456789",
    nationalId: "NDH987654321",
    viewRecords: true,
  },
};
