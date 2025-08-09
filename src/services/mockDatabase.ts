/**
 * Mock Database Service for Browser Environment
 * This simulates MongoDB operations for the frontend demo
 */

// Mock data storage
const mockStorage = {
  patients: [] as any[],
  ashaWorkers: [] as any[],
  doctors: [] as any[],
  appointments: [] as any[],
  governmentSchemes: [] as any[],
};

// User credentials for demo
const demoCredentials = {
  patients: [
    {
      email: "patient@demo.com",
      password: "patient123",
      phone: "9876543210",
      name: "Demo Patient",
      id: "patient_1",
    },
    {
      email: "john.doe@gmail.com",
      password: "demo123",
      phone: "9876543211",
      name: "John Doe",
      id: "patient_2",
    },
    {
      email: "patient@easymed.in",
      password: "patient123",
      phone: "9876543212",
      name: "EasyMed Patient",
      id: "patient_3",
    },
  ],
  asha: [
    {
      email: "asha@demo.com",
      password: "asha123",
      phone: "9876543220",
      name: "Demo ASHA Worker",
      id: "asha_1",
      village: "Ramanathapuram",
    },
    {
      email: "asha.worker@gmail.com",
      password: "demo123",
      phone: "9876543221",
      name: "ASHA Community Worker",
      id: "asha_2",
      village: "Thanjavur",
    },
    {
      email: "asha@easymed.in",
      password: "asha123",
      phone: "9876543222",
      name: "EasyMed ASHA",
      id: "asha_3",
      village: "Kumbakonam",
    },
  ],
  doctor: [
    {
      email: "doctor@demo.com",
      password: "doctor123",
      phone: "9876543230",
      name: "Dr. Demo",
      id: "doctor_1",
      specialty: "General Medicine",
    },
    {
      email: "dr.smith@gmail.com",
      password: "demo123",
      phone: "9876543231",
      name: "Dr. Smith",
      id: "doctor_2",
      specialty: "Cardiology",
    },
    {
      email: "doctor@easymed.in",
      password: "doctor123",
      phone: "9876543232",
      name: "Dr. EasyMed",
      id: "doctor_3",
      specialty: "Pediatrics",
    },
  ],
};

class MockDatabaseService {
  private isConnected: boolean = false;

  // Database connection methods
  async connect(): Promise<void> {
    try {
      console.log("🔌 Connecting to Mock Database...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate connection delay
      this.isConnected = true;
      console.log("✅ Connected to Mock Database successfully");

      // Initialize with sample data if empty
      if (mockStorage.patients.length === 0) {
        await this.initializeSampleData();
      }
    } catch (error) {
      console.error("❌ Mock Database connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log("📡 Disconnected from Mock Database");
  }

  async clearAllData(): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    console.log("🧹 Clearing all data from mock database...");
    mockStorage.patients = [];
    mockStorage.ashaWorkers = [];
    mockStorage.doctors = [];
    mockStorage.appointments = [];
    mockStorage.governmentSchemes = [];
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("✅ All data cleared");
  }

  // Authentication method
  async authenticateUser(identifier: string, userType: string): Promise<any> {
    console.log(`🔐 Authenticating ${userType}:`, identifier);

    const credentials =
      demoCredentials[userType as keyof typeof demoCredentials];
    if (!credentials) {
      throw new Error(`Invalid user type: ${userType}`);
    }

    // Check by email or phone
    const user = credentials.find(
      (cred) => cred.email === identifier || cred.phone === identifier,
    );

    if (user) {
      console.log("✅ User found in demo credentials:", user.name);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        ...(user as any), // Include additional fields like village, specialty
      };
    }

    // If not found in demo credentials, check mock storage
    const storageKey = userType === "asha" ? "ashaWorkers" : `${userType}s`;
    const users = mockStorage[storageKey as keyof typeof mockStorage] as any[];
    const mockUser = users.find(
      (u: any) => u.email === identifier || u.phone === identifier,
    );

    if (mockUser) {
      console.log("✅ User found in mock storage:", mockUser.name);
      return mockUser;
    }

    return null;
  }

  // Initialize sample data
  private async initializeSampleData(): Promise<void> {
    console.log("📊 Initializing sample data...");

    // Add demo users to mock storage
    mockStorage.patients = [...demoCredentials.patients];
    mockStorage.ashaWorkers = [...demoCredentials.asha];
    mockStorage.doctors = [...demoCredentials.doctor];

    // Add government schemes
    mockStorage.governmentSchemes = [
      {
        id: "scheme_1",
        name: "Ayushman Bharat",
        description: "Health insurance coverage up to ₹5 lakh",
        eligibility: "BPL families",
        coverage: "₹5,00,000",
        applications: 156,
        approved: 142,
        state: "National",
      },
      {
        id: "scheme_2",
        name: "Muthulakshmi Reddy Maternity Assistance",
        description: "Financial assistance for pregnant women in Tamil Nadu",
        eligibility: "Pregnant women in Tamil Nadu",
        coverage: "₹18,000",
        applications: 42,
        approved: 38,
        state: "Tamil Nadu",
      },
      {
        id: "scheme_3",
        name: "Janani Suraksha Yojana",
        description: "Safe motherhood intervention scheme",
        eligibility: "Pregnant women below poverty line",
        coverage: "₹1,400",
        applications: 89,
        approved: 82,
        state: "National",
      },
    ];

    // Add sample appointments
    mockStorage.appointments = [
      {
        id: "apt_1",
        patientId: "patient_1",
        doctorId: "doctor_1",
        ashaWorkerId: "asha_1",
        date: "2025-01-30",
        time: "10:00 AM",
        type: "Video Consultation",
        status: "Confirmed",
        condition: "General checkup",
      },
      {
        id: "apt_2",
        patientId: "patient_2",
        doctorId: "doctor_2",
        ashaWorkerId: "asha_2",
        date: "2025-02-01",
        time: "2:30 PM",
        type: "In-person",
        status: "Pending",
        condition: "Follow-up consultation",
      },
    ];

    console.log("✅ Sample data initialized");
  }

  // CRUD operations for different entities
  async getPatients(): Promise<any[]> {
    return mockStorage.patients;
  }

  async getASHAWorkers(): Promise<any[]> {
    return mockStorage.ashaWorkers;
  }

  async getDoctors(): Promise<any[]> {
    return mockStorage.doctors;
  }

  async getAppointments(): Promise<any[]> {
    return mockStorage.appointments;
  }

  async getGovernmentSchemes(): Promise<any[]> {
    return mockStorage.governmentSchemes;
  }

  // Add new entities
  async addPatient(patient: any): Promise<string> {
    const id = `patient_${Date.now()}`;
    mockStorage.patients.push({ ...patient, id });
    return id;
  }

  async addAppointment(appointment: any): Promise<string> {
    const id = `apt_${Date.now()}`;
    mockStorage.appointments.push({ ...appointment, id });
    return id;
  }

  // Update entities
  async updatePatient(id: string, updates: any): Promise<boolean> {
    const index = mockStorage.patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockStorage.patients[index] = {
        ...mockStorage.patients[index],
        ...updates,
      };
      return true;
    }
    return false;
  }

  // Delete entities
  async deletePatient(id: string): Promise<boolean> {
    const index = mockStorage.patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockStorage.patients.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get statistics
  async getSystemStats(): Promise<any> {
    return {
      totalUsers:
        mockStorage.patients.length +
        mockStorage.ashaWorkers.length +
        mockStorage.doctors.length,
      patients: mockStorage.patients.length,
      ashaWorkers: mockStorage.ashaWorkers.length,
      doctors: mockStorage.doctors.length,
      appointments: mockStorage.appointments.length,
      schemes: mockStorage.governmentSchemes.length,
      videoConsultations: mockStorage.appointments.filter(
        (a) => a.type === "Video Consultation",
      ).length,
    };
  }

  // Search functionality
  async searchPatients(query: string): Promise<any[]> {
    const lowercaseQuery = query.toLowerCase();
    return mockStorage.patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(lowercaseQuery) ||
        patient.email.toLowerCase().includes(lowercaseQuery) ||
        patient.phone.includes(query),
    );
  }
}

// Export singleton instance
export const dbService = new MockDatabaseService();

// Auto-connect when imported
dbService.connect().catch(console.error);
