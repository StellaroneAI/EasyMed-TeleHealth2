import { MongoClient, Db, Collection } from "mongodb";

// Database connection
let client: MongoClient;
let db: Db;

// MongoDB connection string from environment
const MONGODB_URI =
  import.meta.env.VITE_MONGODB_URI || "mongodb://localhost:27017/easymedpro";

// Initialize MongoDB connection
export async function connectDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("easymedpro");
    console.log("✅ Connected to MongoDB successfully");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

// Close database connection
export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Database schemas and types
export interface Patient {
  _id?: string;
  patientId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    district: string;
  };
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
    lastUpdated: Date;
  };
  appointments: string[]; // appointment IDs
  assignedASHA?: string; // ASHA worker ID
  assignedDoctor?: string; // Doctor ID
  language: string;
  schemes: string[]; // Government schemes enrolled
  isPregnant?: boolean;
  pregnancyInfo?: {
    trimester: number;
    expectedDelivery: Date;
    riskLevel: "low" | "medium" | "high";
    schemes: string[]; // Pregnancy-specific schemes
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ASHAWorker {
  _id?: string;
  ashaId: string;
  name: string;
  phone: string;
  email?: string;
  address: {
    village: string;
    block: string;
    district: string;
    state: string;
    pincode: string;
  };
  assignedArea: {
    villages: string[];
    population: number;
    households: number;
  };
  patients: string[]; // Patient IDs
  qualifications: string[];
  experience: number; // years
  language: string[];
  specializations: string[];
  performance: {
    patientsServed: number;
    vaccinationsDone: number;
    healthCheckups: number;
    emergencyResponses: number;
  };
  availability: {
    workingHours: string;
    emergencyAvailable: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  _id?: string;
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  qualification: string;
  specialization: string[];
  experience: number;
  languages: string[];
  address: {
    clinic: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  availability: {
    days: string[];
    timeSlots: string[];
    consultationFee: number;
    videoConsultationFee: number;
  };
  patients: string[]; // Patient IDs
  ratings: {
    average: number;
    total: number;
    reviews: {
      patientId: string;
      rating: number;
      comment: string;
      date: Date;
    }[];
  };
  telemedicine: {
    enabled: boolean;
    platforms: string[];
    maxPatientsPerDay: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id?: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  ashaId?: string;
  type: "physical" | "telemedicine" | "home-visit" | "emergency";
  status:
    | "scheduled"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "rescheduled";
  dateTime: Date;
  duration: number; // minutes
  symptoms: string;
  diagnosis?: string;
  prescription?: {
    medicines: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }[];
    instructions: string;
  };
  followUpDate?: Date;
  consultationFee: number;
  paymentStatus: "pending" | "paid" | "free";
  videoCall?: {
    roomId: string;
    platform: string;
    link: string;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GovernmentScheme {
  _id?: string;
  schemeId: string;
  name: string;
  nameLocal: string; // in local language
  state: string;
  description: string;
  eligibility: {
    ageRange?: { min: number; max: number };
    gender?: string[];
    income?: { max: number };
    pregnancy?: boolean;
    conditions?: string[];
  };
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  helpline: string;
  website?: string;
  isActive: boolean;
  language: string;
  category:
    | "pregnancy"
    | "child-health"
    | "women-health"
    | "general"
    | "elderly"
    | "disability";
  createdAt: Date;
  updatedAt: Date;
}

// Database service class
export class DatabaseService {
  private isConnected: boolean = false;

  // Database connection methods
  async connect(): Promise<void> {
    try {
      // In a real app, this would connect to MongoDB
      // For demo purposes, we'll simulate connection
      console.log("🔌 Connecting to MongoDB Atlas...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate connection delay
      this.isConnected = true;
      console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log("📡 Disconnected from MongoDB");
  }

  async clearAllData(): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Database not connected");
    }

    // In a real app, this would clear all collections
    console.log("🧹 Clearing all data from database...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("✅ All data cleared");
  }
  private db: Db | null = null;

  async init(): Promise<void> {
    this.db = await connectDB();
    await this.createIndexes();
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) return;

    // Create indexes for better performance
    await this.db
      .collection("patients")
      .createIndex({ patientId: 1 }, { unique: true });
    await this.db.collection("patients").createIndex({ phone: 1 });
    await this.db.collection("patients").createIndex({ email: 1 });
    await this.db.collection("patients").createIndex({ "address.state": 1 });

    await this.db
      .collection("ashaworkers")
      .createIndex({ ashaId: 1 }, { unique: true });
    await this.db.collection("ashaworkers").createIndex({ phone: 1 });

    await this.db
      .collection("doctors")
      .createIndex({ doctorId: 1 }, { unique: true });
    await this.db.collection("doctors").createIndex({ email: 1 });
    await this.db.collection("doctors").createIndex({ specialization: 1 });

    await this.db
      .collection("appointments")
      .createIndex({ appointmentId: 1 }, { unique: true });
    await this.db.collection("appointments").createIndex({ patientId: 1 });
    await this.db.collection("appointments").createIndex({ doctorId: 1 });
    await this.db.collection("appointments").createIndex({ dateTime: 1 });

    await this.db
      .collection("schemes")
      .createIndex({ schemeId: 1 }, { unique: true });
    await this.db.collection("schemes").createIndex({ state: 1 });
    await this.db.collection("schemes").createIndex({ category: 1 });
  }

  // Patient operations
  async createPatient(patient: Omit<Patient, "_id">): Promise<Patient> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db
      .collection<Patient>("patients")
      .insertOne(patient);
    return { ...patient, _id: result.insertedId.toString() };
  }

  async getPatient(patientId: string): Promise<Patient | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<Patient>("patients").findOne({ patientId });
  }

  async getPatientByPhone(phone: string): Promise<Patient | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<Patient>("patients").findOne({ phone });
  }

  async getAllPatients(
    limit: number = 50,
    skip: number = 0,
  ): Promise<Patient[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<Patient>("patients")
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();
  }

  async getPatientsByState(state: string): Promise<Patient[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<Patient>("patients")
      .find({ "address.state": state })
      .toArray();
  }

  async getPregnantPatients(state?: string): Promise<Patient[]> {
    if (!this.db) throw new Error("Database not initialized");

    const query: any = { isPregnant: true };
    if (state) query["address.state"] = state;

    return await this.db.collection<Patient>("patients").find(query).toArray();
  }

  // ASHA Worker operations
  async createASHA(asha: Omit<ASHAWorker, "_id">): Promise<ASHAWorker> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db
      .collection<ASHAWorker>("ashaworkers")
      .insertOne(asha);
    return { ...asha, _id: result.insertedId.toString() };
  }

  async getASHA(ashaId: string): Promise<ASHAWorker | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<ASHAWorker>("ashaworkers")
      .findOne({ ashaId });
  }

  async getAllASHAs(): Promise<ASHAWorker[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<ASHAWorker>("ashaworkers").find().toArray();
  }

  // Doctor operations
  async createDoctor(doctor: Omit<Doctor, "_id">): Promise<Doctor> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db
      .collection<Doctor>("doctors")
      .insertOne(doctor);
    return { ...doctor, _id: result.insertedId.toString() };
  }

  async getDoctor(doctorId: string): Promise<Doctor | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<Doctor>("doctors").findOne({ doctorId });
  }

  async getDoctorByEmail(email: string): Promise<Doctor | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<Doctor>("doctors").findOne({ email });
  }

  async getAllDoctors(): Promise<Doctor[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db.collection<Doctor>("doctors").find().toArray();
  }

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<Doctor>("doctors")
      .find({ specialization: { $in: [specialization] } })
      .toArray();
  }

  // Appointment operations
  async createAppointment(
    appointment: Omit<Appointment, "_id">,
  ): Promise<Appointment> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db
      .collection<Appointment>("appointments")
      .insertOne(appointment);
    return { ...appointment, _id: result.insertedId.toString() };
  }

  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<Appointment>("appointments")
      .findOne({ appointmentId });
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<Appointment>("appointments")
      .find({ patientId })
      .sort({ dateTime: -1 })
      .toArray();
  }

  async getDoctorAppointments(
    doctorId: string,
    date?: Date,
  ): Promise<Appointment[]> {
    if (!this.db) throw new Error("Database not initialized");

    const query: any = { doctorId };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.dateTime = { $gte: startDate, $lte: endDate };
    }

    return await this.db
      .collection<Appointment>("appointments")
      .find(query)
      .sort({ dateTime: 1 })
      .toArray();
  }

  // Government Scheme operations
  async createScheme(
    scheme: Omit<GovernmentScheme, "_id">,
  ): Promise<GovernmentScheme> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db
      .collection<GovernmentScheme>("schemes")
      .insertOne(scheme);
    return { ...scheme, _id: result.insertedId.toString() };
  }

  async getSchemesByState(state: string): Promise<GovernmentScheme[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<GovernmentScheme>("schemes")
      .find({ state, isActive: true })
      .toArray();
  }

  async getPregnancySchemes(state: string): Promise<GovernmentScheme[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<GovernmentScheme>("schemes")
      .find({ state, category: "pregnancy", isActive: true })
      .toArray();
  }

  async getAllSchemes(): Promise<GovernmentScheme[]> {
    if (!this.db) throw new Error("Database not initialized");

    return await this.db
      .collection<GovernmentScheme>("schemes")
      .find({ isActive: true })
      .toArray();
  }

  // Authentication methods
  async authenticateUser(
    identifier: string,
    userType: "patient" | "asha" | "doctor",
  ): Promise<any> {
    if (!this.db) throw new Error("Database not initialized");

    let user = null;

    switch (userType) {
      case "patient":
        user = await this.db
          .collection<Patient>("patients")
          .findOne({ $or: [{ phone: identifier }, { email: identifier }] });
        break;
      case "asha":
        user = await this.db
          .collection<ASHAWorker>("ashaworkers")
          .findOne({ $or: [{ phone: identifier }, { email: identifier }] });
        break;
      case "doctor":
        user = await this.db
          .collection<Doctor>("doctors")
          .findOne({ $or: [{ phone: identifier }, { email: identifier }] });
        break;
    }

    return user;
  }

  // Statistics and analytics
  async getDashboardStats(): Promise<any> {
    if (!this.db) throw new Error("Database not initialized");

    const [patientCount, ashaCount, doctorCount, appointmentCount] =
      await Promise.all([
        this.db.collection("patients").countDocuments(),
        this.db.collection("ashaworkers").countDocuments(),
        this.db.collection("doctors").countDocuments(),
        this.db.collection("appointments").countDocuments(),
      ]);

    const todayAppointments = await this.db
      .collection("appointments")
      .countDocuments({
        dateTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      });

    return {
      totalPatients: patientCount,
      totalASHAs: ashaCount,
      totalDoctors: doctorCount,
      totalAppointments: appointmentCount,
      todayAppointments,
    };
  }
}

// Export singleton instance
export const dbService = new DatabaseService();

// Utility functions
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
