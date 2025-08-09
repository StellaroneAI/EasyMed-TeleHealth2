// Comprehensive demo data for EasyMedPro testing
export const demoUsers = [
  {
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
      vitalsHistory: [
        { date: "2025-07-25", heartRate: 70, bloodPressure: "118/78" },
        { date: "2025-07-26", heartRate: 73, bloodPressure: "121/81" },
      ],
    },
    family: [
      {
        relation: "Wife",
        name: "Priya",
        health: {
          status: "Normal",
          vaccinationDue: "2025-08-05",
          medications: ["Vitamin D"],
          vitalsHistory: [
            { date: "2025-07-25", heartRate: 75, bloodPressure: "115/76" },
          ],
        },
      },
      {
        relation: "Son",
        name: "Amit",
        health: {
          status: "Normal",
          vaccinationDue: "2025-08-12",
          medications: [],
          vitalsHistory: [
            { date: "2025-07-25", heartRate: 90, bloodPressure: "110/70" },
          ],
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
      history: [
        { command: "Check heart rate", response: "Your heart rate is 72." },
        {
          command: "Book appointment",
          response: "Appointment booked with Dr. Sharma.",
        },
      ],
    },
    abha: {
      connected: true,
      healthId: "ABHA123456789",
      nationalId: "NDH987654321",
      viewRecords: true,
    },
  },
  {
    name: "Anita",
    email: "anita@example.com",
    health: {
      heartRate: 80,
      bloodPressure: "130/85",
      medications: ["Lisinopril"],
      nextAppointment: {
        doctor: "Dr. Verma",
        date: "2025-08-02T11:00:00Z",
        type: "Cardiology",
      },
      status: "Elevated",
      dueToday: ["Lisinopril"],
      vitalsHistory: [
        { date: "2025-07-25", heartRate: 78, bloodPressure: "128/84" },
        { date: "2025-07-26", heartRate: 81, bloodPressure: "132/86" },
      ],
    },
    family: [
      {
        relation: "Husband",
        name: "Suresh",
        health: {
          status: "Normal",
          medications: ["Aspirin"],
          vitalsHistory: [
            { date: "2025-07-25", heartRate: 68, bloodPressure: "117/75" },
          ],
        },
      },
    ],
    recentActivity: [
      {
        type: "medicationReminder",
        value: "Lisinopril",
        date: "2025-07-27T08:00:00Z",
      },
      {
        type: "appointmentBooked",
        doctor: "Dr. Verma",
        date: "2025-07-26T15:00:00Z",
      },
    ],
    voiceAssistant: {
      lastCommand: "Check blood pressure",
      lastResponse: "Your blood pressure is 130/85.",
      history: [
        {
          command: "Show family health",
          response: "All family members are healthy.",
        },
      ],
    },
    abha: {
      connected: false,
      healthId: "",
      nationalId: "",
      viewRecords: false,
    },
  },
];
