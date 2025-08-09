// Script to seed MongoDB with demo data for EasyMedPro
import { connectDB } from "./mongo";
import { demoUsers } from "./demoData";

async function seedDemoData() {
  const db = await connectDB();
  const users = db.collection("users");
  const healthRecords = db.collection("healthRecords");
  const appointments = db.collection("appointments");
  const family = db.collection("family");
  const activities = db.collection("activities");
  const voiceAssistant = db.collection("voiceAssistant");
  const abha = db.collection("abha");

  // Remove existing demo data (optional)
  await Promise.all([
    users.deleteMany({ email: { $in: demoUsers.map((u) => u.email) } }),
    healthRecords.deleteMany({
      userEmail: { $in: demoUsers.map((u) => u.email) },
    }),
    appointments.deleteMany({
      userEmail: { $in: demoUsers.map((u) => u.email) },
    }),
    family.deleteMany({ userEmail: { $in: demoUsers.map((u) => u.email) } }),
    activities.deleteMany({
      userEmail: { $in: demoUsers.map((u) => u.email) },
    }),
    voiceAssistant.deleteMany({
      userEmail: { $in: demoUsers.map((u) => u.email) },
    }),
    abha.deleteMany({ userEmail: { $in: demoUsers.map((u) => u.email) } }),
  ]);

  // Insert demo users and related data
  for (const user of demoUsers) {
    await users.insertOne({ name: user.name, email: user.email });
    await healthRecords.insertOne({ userEmail: user.email, ...user.health });
    if (user.health.nextAppointment) {
      await appointments.insertOne({
        userEmail: user.email,
        ...user.health.nextAppointment,
      });
    }
    if (user.family && user.family.length) {
      for (const member of user.family) {
        await family.insertOne({ userEmail: user.email, ...member });
      }
    }
    if (user.recentActivity && user.recentActivity.length) {
      for (const activity of user.recentActivity) {
        await activities.insertOne({ userEmail: user.email, ...activity });
      }
    }
    if (user.voiceAssistant) {
      await voiceAssistant.insertOne({
        userEmail: user.email,
        ...user.voiceAssistant,
      });
    }
    if (user.abha) {
      await abha.insertOne({ userEmail: user.email, ...user.abha });
    }
  }
  console.log("All demo data seeded for dashboard features!");
  process.exit(0);
}

seedDemoData().catch((err) => {
  console.error("Error seeding demo data:", err);
  process.exit(1);
});
