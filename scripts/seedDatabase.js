#!/usr/bin/env node

/**
 * Database Seeding Script for EasyMedPro
 *
 * This script populates the MongoDB database with sample data:
 * - 220 Patients across all Indian states
 * - 55 ASHA Workers from rural and urban areas
 * - 45 Doctors with various specializations
 * - Government schemes including Muthulakshmi Reddy scheme
 * - Appointments and health records
 *
 * Usage: node scripts/seedDatabase.js
 */

import { dbService } from "../src/services/mongo.js";
import { DataSeeder } from "../src/utils/seedDemoData.js";

async function seedDatabase() {
  console.log("🌱 Starting database seeding process...\n");

  try {
    // Initialize database connection
    console.log("📡 Connecting to MongoDB...");
    await dbService.connect();
    console.log("✅ Connected to MongoDB successfully\n");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...");
    await dbService.clearAllData();
    console.log("✅ Existing data cleared\n");

    // Initialize the data seeder
    const seeder = new DataSeeder();

    // Seed patients
    console.log("👥 Seeding patients...");
    const patients = await seeder.seedPatients();
    console.log(`✅ Created ${patients.length} patients\n`);

    // Seed ASHA workers
    console.log("🏥 Seeding ASHA workers...");
    const ashaWorkers = await seeder.seedASHAWorkers();
    console.log(`✅ Created ${ashaWorkers.length} ASHA workers\n`);

    // Seed doctors
    console.log("👨‍⚕️ Seeding doctors...");
    const doctors = await seeder.seedDoctors();
    console.log(`✅ Created ${doctors.length} doctors\n`);

    // Seed government schemes
    console.log("🏛️ Seeding government schemes...");
    const schemes = await seeder.seedGovernmentSchemes();
    console.log(`✅ Created ${schemes.length} government schemes\n`);

    // Seed appointments
    console.log("📅 Seeding appointments...");
    const appointments = await seeder.seedAppointments(
      patients,
      ashaWorkers,
      doctors,
    );
    console.log(`✅ Created ${appointments.length} appointments\n`);

    // Print summary
    console.log("📊 SEEDING SUMMARY:");
    console.log("==================");
    console.log(`👥 Patients: ${patients.length}`);
    console.log(`🏥 ASHA Workers: ${ashaWorkers.length}`);
    console.log(`👨‍⚕️ Doctors: ${doctors.length}`);
    console.log(`🏛️ Government Schemes: ${schemes.length}`);
    console.log(`📅 Appointments: ${appointments.length}`);
    console.log(`📍 States Covered: All 28 states + 8 UTs`);
    console.log(`🗣️ Languages: 12 regional languages`);
    console.log(
      `🎯 Special Focus: Rural healthcare, Muthulakshmi Reddy scheme`,
    );

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n🚀 You can now login with:");
    console.log("   📱 Phone: Any 10-digit number + OTP: 123456");
    console.log("   📧 Email: patient@demo.com / patient123");
    console.log("   📧 Email: asha@demo.com / asha123");
    console.log("   📧 Email: doctor@demo.com / doctor123");
    console.log("   👑 Admin: admin@easymed.in / admin123");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    await dbService.disconnect();
    console.log("\n📡 Database connection closed");
    process.exit(0);
  }
}

// Run the seeding process
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
