/**
 * Mock Database Initialization Script
 * This script simulates database seeding for the demo using browser-compatible mock storage
 */

import { dbService } from "../src/services/mockDatabase.js";

async function initializeMockDatabase() {
  console.log("🌱 EasyMedPro Mock Database Initialization");
  console.log("==========================================\n");

  try {
    // Initialize database connection
    console.log("📡 Connecting to Mock Database...");
    await dbService.connect();
    console.log("✅ Connected to Mock Database successfully\n");

    // Get current stats
    const stats = await dbService.getSystemStats();
    console.log("📊 Current Database Stats:");
    console.log(`👥 Total Users: ${stats.totalUsers}`);
    console.log(`📋 Patients: ${stats.patients}`);
    console.log(`🏥 ASHA Workers: ${stats.ashaWorkers}`);
    console.log(`👨‍⚕️ Doctors: ${stats.doctors}`);
    console.log(`📅 Appointments: ${stats.appointments}`);
    console.log(`🏛️ Government Schemes: ${stats.schemes}`);
    console.log(`📹 Video Consultations: ${stats.videoConsultations}\n`);

    // Print detailed data
    console.log("🔍 Detailed Data:");
    console.log("================");

    const patients = await dbService.getPatients();
    console.log("\n👥 Patients:");
    patients.forEach((patient) => {
      console.log(`  • ${patient.name} (${patient.email}) - ${patient.phone}`);
    });

    const ashaWorkers = await dbService.getASHAWorkers();
    console.log("\n🏥 ASHA Workers:");
    ashaWorkers.forEach((asha) => {
      console.log(
        `  • ${asha.name} (${asha.email}) - ${asha.village || "Urban"}`,
      );
    });

    const doctors = await dbService.getDoctors();
    console.log("\n👨‍⚕️ Doctors:");
    doctors.forEach((doctor) => {
      console.log(
        `  • ${doctor.name} (${doctor.email}) - ${doctor.specialty || "General"}`,
      );
    });

    const schemes = await dbService.getGovernmentSchemes();
    console.log("\n🏛️ Government Schemes:");
    schemes.forEach((scheme) => {
      console.log(`  • ${scheme.name} - ${scheme.coverage} (${scheme.state})`);
    });

    const appointments = await dbService.getAppointments();
    console.log("\n📅 Appointments:");
    appointments.forEach((apt) => {
      console.log(`  • ${apt.date} ${apt.time} - ${apt.type} (${apt.status})`);
    });

    console.log("\n✨ Mock Database initialization completed successfully!");
    console.log("\n🚀 You can now login with:");
    console.log("   📱 Phone: Any 10-digit number + OTP: 123456");
    console.log("   📧 Email: patient@demo.com / patient123");
    console.log("   📧 Email: asha@demo.com / asha123");
    console.log("   📧 Email: doctor@demo.com / doctor123");
    console.log("   👑 Admin: admin@easymed.in / admin123");

    console.log("\n🎯 Special Features Available:");
    console.log("   • 12 regional languages supported");
    console.log("   • Video consultation system");
    console.log("   • Muthulakshmi Reddy scheme (Tamil Nadu)");
    console.log("   • Role-based dashboards");
    console.log("   • ASHA worker integration");
  } catch (error) {
    console.error("❌ Mock Database initialization failed:", error);
  } finally {
    // Keep connection open for browser use
    console.log("\n📡 Mock Database ready for browser use");
  }
}

// Auto-run when script is executed
if (typeof window === "undefined") {
  // Node.js environment
  initializeMockDatabase();
} else {
  // Browser environment - database is already auto-initialized
  console.log("🌐 Mock Database running in browser environment");
}

export { initializeMockDatabase };
