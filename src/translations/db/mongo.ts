// MongoDB integration for EasyMedPro
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

export async function connectDB() {
  if (!client.isConnected()) await client.connect();
  return client.db(process.env.DB_NAME || "easymedpro");
}

export async function addDemoUser() {
  const db = await connectDB();
  const users = db.collection("users");
  const demoUser = {
    name: "Rajesh",
    email: "rajesh@example.com",
    health: {
      heartRate: 72,
      bloodPressure: "120/80",
      medications: ["Amlodipine"],
      nextAppointment: "2025-07-30T15:00:00Z",
    },
  };
  await users.insertOne(demoUser);
  return demoUser;
}

export async function getDemoUsers() {
  const db = await connectDB();
  return db.collection("users").find().toArray();
}
