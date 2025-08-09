import {
  dbService,
  Patient,
  ASHAWorker,
  Doctor,
  GovernmentScheme,
  generateId,
} from "./mongo";

// Sample data for 200+ patients, 50+ ASHA workers, 40+ doctors
export class DataSeeder {
  async seedDatabase(): Promise<void> {
    try {
      console.log("🌱 Starting database seeding...");

      await dbService.init();

      // Seed government schemes first
      await this.seedGovernmentSchemes();

      // Seed users
      await this.seedPatients();
      await this.seedASHAWorkers();
      await this.seedDoctors();

      console.log("✅ Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Database seeding failed:", error);
      throw error;
    }
  }

  private async seedGovernmentSchemes(): Promise<void> {
    console.log("📋 Seeding government schemes...");

    const schemes: Omit<GovernmentScheme, "_id">[] = [
      // Tamil Nadu Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
        nameLocal: "டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு உதவித் திட்டம்",
        state: "Tamil Nadu",
        description: "Financial assistance for pregnant women and new mothers",
        eligibility: {
          gender: ["female"],
          pregnancy: true,
          income: { max: 12000 },
        },
        benefits: [
          "Rs. 12,000 in 3 installments",
          "Free health checkups",
          "Nutritional supplements",
          "Safe delivery assistance",
        ],
        applicationProcess: [
          "Register at nearest PHC/hospital",
          "Submit required documents",
          "Complete health checkups",
          "Receive benefits in installments",
        ],
        documents: [
          "Aadhaar card",
          "Income certificate",
          "Pregnancy registration",
          "Bank account details",
        ],
        helpline: "104",
        website: "https://tn.gov.in/scheme/data_view/6987",
        isActive: true,
        language: "tamil",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        schemeId: generateId("SCHEME"),
        name: "Amma Baby Care Kit",
        nameLocal: "அம்மா குழந்தை பராமரிப்பு பெட்டி",
        state: "Tamil Nadu",
        description: "Free baby care kit for newborns",
        eligibility: {
          pregnancy: true,
        },
        benefits: [
          "Baby care essentials",
          "Clothing for baby",
          "Mother care items",
          "Educational materials",
        ],
        applicationProcess: [
          "Register pregnancy at government hospital",
          "Attend prenatal checkups",
          "Receive kit after delivery",
        ],
        documents: ["Hospital registration", "Aadhaar card"],
        helpline: "104",
        isActive: true,
        language: "tamil",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Kerala Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Vatsalya Scheme",
        nameLocal: "വാത്സല്യ പദ്ധതി",
        state: "Kerala",
        description: "Comprehensive maternal and child health scheme",
        eligibility: {
          pregnancy: true,
        },
        benefits: [
          "Free delivery",
          "Nutrition support",
          "Transport allowance",
          "Postnatal care",
        ],
        applicationProcess: [
          "Register at Anganwadi",
          "Complete antenatal checkups",
          "Institutional delivery",
        ],
        documents: ["Aadhaar", "BPL card", "Pregnancy card"],
        helpline: "104",
        isActive: true,
        language: "malayalam",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Karnataka Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Madilu Kit Scheme",
        nameLocal: "ಮಾದಿಲು ಕಿಟ್ ಯೋಜನೆ",
        state: "Karnataka",
        description: "Free nutrition kit for pregnant and lactating mothers",
        eligibility: {
          pregnancy: true,
          gender: ["female"],
        },
        benefits: [
          "Nutrition supplements",
          "Iron and folic acid tablets",
          "Health monitoring",
          "Counseling support",
        ],
        applicationProcess: [
          "Register at Anganwadi center",
          "Health checkup",
          "Regular monitoring",
        ],
        documents: ["Aadhaar", "Pregnancy registration"],
        helpline: "104",
        isActive: true,
        language: "kannada",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Gujarat Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Chiranjeevi Yojana",
        nameLocal: "ચિરંજીવી યોજના",
        state: "Gujarat",
        description: "Free healthcare for pregnant women",
        eligibility: {
          pregnancy: true,
          income: { max: 15000 },
        },
        benefits: [
          "Free delivery",
          "Emergency transport",
          "Postnatal care",
          "Family planning services",
        ],
        applicationProcess: [
          "Enroll at PHC",
          "Get Chiranjeevi card",
          "Avail services at empaneled hospitals",
        ],
        documents: ["Income certificate", "Aadhaar", "Residence proof"],
        helpline: "108",
        isActive: true,
        language: "gujarati",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // National Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Pradhan Mantri Matru Vandana Yojana",
        nameLocal: "प्रधानमंत्री मातृ वंदना योजना",
        state: "All States",
        description:
          "Maternity benefit programme for pregnant and lactating mothers",
        eligibility: {
          pregnancy: true,
          ageRange: { min: 19, max: 45 },
        },
        benefits: [
          "Rs. 5,000 in 3 installments",
          "Cash incentive for first living child",
          "Nutrition support",
          "Health checkups",
        ],
        applicationProcess: [
          "Register at Anganwadi/health center",
          "Complete ANC checkups",
          "Submit required documents",
          "Receive payments in bank account",
        ],
        documents: [
          "MCP card",
          "Aadhaar of mother and spouse",
          "Bank account details",
          "JSY/institutional delivery certificate",
        ],
        helpline: "104",
        website:
          "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
        isActive: true,
        language: "hindi",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Women Health Schemes
      {
        schemeId: generateId("SCHEME"),
        name: "Janani Suraksha Yojana",
        nameLocal: "जननी सुरक्षा योजना",
        state: "All States",
        description: "Safe motherhood intervention under NHM",
        eligibility: {
          pregnancy: true,
          gender: ["female"],
        },
        benefits: [
          "Cash assistance for institutional delivery",
          "Transportation support",
          "Postnatal care",
          "ASHA services",
        ],
        applicationProcess: [
          "Register at health facility",
          "Antenatal care",
          "Institutional delivery",
          "Receive cash benefit",
        ],
        documents: ["JSY card", "Aadhaar", "BPL card"],
        helpline: "104",
        isActive: true,
        language: "hindi",
        category: "pregnancy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const scheme of schemes) {
      try {
        await dbService.createScheme(scheme);
      } catch (error) {
        console.log(`Scheme ${scheme.name} might already exist, skipping...`);
      }
    }

    console.log(`✅ Seeded ${schemes.length} government schemes`);
  }

  private async seedPatients(): Promise<void> {
    console.log("👥 Seeding patients...");

    const states = [
      "Tamil Nadu",
      "Kerala",
      "Karnataka",
      "Gujarat",
      "Maharashtra",
      "Punjab",
      "West Bengal",
      "Odisha",
      "Assam",
      "Telugu",
      "Andhra Pradesh",
    ];

    const cities = {
      "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore", "Salem", "Trichy"],
      Kerala: [
        "Kochi",
        "Thiruvananthapuram",
        "Kozhikode",
        "Thrissur",
        "Kollam",
      ],
      Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
      "West Bengal": [
        "Kolkata",
        "Asansol",
        "Siliguri",
        "Durgapur",
        "Bardhaman",
      ],
      Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
      Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
      "Andhra Pradesh": [
        "Visakhapatnam",
        "Vijayawada",
        "Guntur",
        "Nellore",
        "Kurnool",
      ],
    };

    const indianNames = {
      male: [
        "Arjun Kumar",
        "Rajesh Singh",
        "Vikram Sharma",
        "Amit Patel",
        "Suresh Reddy",
        "Ravi Nair",
        "Manoj Gupta",
        "Sanjay Verma",
        "Deepak Joshi",
        "Ashok Yadav",
        "Ramesh Chand",
        "Pradeep Kumar",
        "Santosh Rao",
        "Vinod Agarwal",
        "Mahesh Shah",
        "Dinesh Jain",
        "Rakesh Bansal",
        "Anil Kapoor",
        "Sunil Mishra",
        "Govind Prasad",
      ],
      female: [
        "Priya Sharma",
        "Sunita Devi",
        "Kavita Singh",
        "Meera Patel",
        "Lakshmi Reddy",
        "Sita Nair",
        "Radha Gupta",
        "Geeta Verma",
        "Usha Joshi",
        "Maya Yadav",
        "Anita Chand",
        "Rekha Kumar",
        "Shanti Rao",
        "Pushpa Agarwal",
        "Kamala Shah",
        "Sudha Jain",
        "Lata Bansal",
        "Savita Kapoor",
        "Manjula Mishra",
        "Rama Prasad",
      ],
    };

    const conditions = [
      "Diabetes",
      "Hypertension",
      "Asthma",
      "Arthritis",
      "Heart Disease",
      "Migraine",
      "Thyroid",
      "PCOD",
      "Anemia",
      "Obesity",
    ];

    const allergies = [
      "Peanuts",
      "Shellfish",
      "Dust",
      "Pollen",
      "Medications",
      "Dairy",
      "Eggs",
      "Soy",
      "Wheat",
      "None",
    ];

    for (let i = 0; i < 220; i++) {
      const gender = Math.random() > 0.5 ? "female" : "male";
      const state = states[Math.floor(Math.random() * states.length)];
      const cityList = cities[state as keyof typeof cities] || ["Default City"];
      const city = cityList[Math.floor(Math.random() * cityList.length)];
      const age = Math.floor(Math.random() * 70) + 15; // 15-85 years

      const isPregnant =
        gender === "female" && age >= 18 && age <= 35 && Math.random() > 0.7;

      const nameList = indianNames[gender];
      const name = nameList[Math.floor(Math.random() * nameList.length)];

      const patient: Omit<Patient, "_id"> = {
        patientId: generateId("PAT"),
        name,
        age,
        gender,
        phone: `${Math.floor(Math.random() * 4) + 6}${Math.floor(
          Math.random() * 1000000000,
        )
          .toString()
          .padStart(9, "0")}`,
        email:
          Math.random() > 0.3
            ? `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`
            : undefined,
        address: {
          street: `${Math.floor(Math.random() * 999) + 1} ${["Main Road", "Gandhi Street", "Temple Street", "Market Road"][Math.floor(Math.random() * 4)]}`,
          city,
          state,
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
          district: city,
        },
        medicalHistory: {
          conditions:
            Math.random() > 0.6
              ? [conditions[Math.floor(Math.random() * conditions.length)]]
              : [],
          allergies:
            Math.random() > 0.8
              ? [allergies[Math.floor(Math.random() * allergies.length)]]
              : [],
          medications: [],
          emergencyContact: {
            name: `${name.split(" ")[0]} Contact`,
            phone: `${Math.floor(Math.random() * 4) + 6}${Math.floor(
              Math.random() * 1000000000,
            )
              .toString()
              .padStart(9, "0")}`,
            relation: ["Spouse", "Parent", "Sibling", "Child"][
              Math.floor(Math.random() * 4)
            ],
          },
        },
        vitals: {
          bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 70}`,
          heartRate: Math.floor(Math.random() * 40) + 60,
          temperature: Math.round((Math.random() * 2 + 97.5) * 10) / 10,
          weight: Math.floor(Math.random() * 50) + 45,
          height: Math.floor(Math.random() * 30) + 150,
          lastUpdated: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ), // Last 30 days
        },
        appointments: [],
        language: this.getLanguageForState(state),
        schemes: isPregnant ? ["PMMVY", "JSY"] : [],
        isPregnant,
        pregnancyInfo: isPregnant
          ? {
              trimester: Math.floor(Math.random() * 3) + 1,
              expectedDelivery: new Date(
                Date.now() + Math.random() * 9 * 30 * 24 * 60 * 60 * 1000,
              ),
              riskLevel: ["low", "medium", "high"][
                Math.floor(Math.random() * 3)
              ] as "low" | "medium" | "high",
              schemes: ["Dr. Muthulakshmi Reddy Scheme", "PMMVY"],
            }
          : undefined,
        createdAt: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ), // Last 90 days
        updatedAt: new Date(),
      };

      try {
        await dbService.createPatient(patient);
      } catch (error) {
        console.log(
          `Patient ${i + 1} might have duplicate phone, generating new one...`,
        );
        patient.phone = `${Math.floor(Math.random() * 4) + 6}${Math.floor(
          Math.random() * 1000000000,
        )
          .toString()
          .padStart(9, "0")}`;
        try {
          await dbService.createPatient(patient);
        } catch (retryError) {
          console.log(`Failed to create patient ${i + 1} even after retry`);
        }
      }
    }

    console.log("✅ Seeded 220 patients");
  }

  private async seedASHAWorkers(): Promise<void> {
    console.log("👩‍⚕️ Seeding ASHA workers...");

    const ashaNames = [
      "Sunita Devi",
      "Meera Kumari",
      "Pushpa Rani",
      "Lakshmi Bai",
      "Sita Devi",
      "Radha Rani",
      "Geeta Kumari",
      "Maya Devi",
      "Anita Rani",
      "Usha Kumari",
      "Kamala Devi",
      "Shanti Rani",
      "Rekha Kumari",
      "Savita Devi",
      "Priya Rani",
    ];

    const villages = [
      "Rampur",
      "Shivpuri",
      "Ganeshpur",
      "Hanuman Nagar",
      "Krishna Nagar",
      "Radha Nagar",
      "Sita Nagar",
      "Laxmi Nagar",
      "Saraswati Nagar",
      "Durga Nagar",
    ];

    const qualifications = [
      "Class 8 Pass",
      "Class 10 Pass",
      "Class 12 Pass",
      "ANM Training",
      "Health Worker Training",
      "Community Health Training",
    ];

    for (let i = 0; i < 55; i++) {
      const name =
        ashaNames[Math.floor(Math.random() * ashaNames.length)] + ` ${i + 1}`;
      const state = ["Tamil Nadu", "Kerala", "Karnataka", "Gujarat", "Punjab"][
        Math.floor(Math.random() * 5)
      ];

      const asha: Omit<ASHAWorker, "_id"> = {
        ashaId: generateId("ASHA"),
        name,
        phone: `${Math.floor(Math.random() * 4) + 6}${Math.floor(
          Math.random() * 1000000000,
        )
          .toString()
          .padStart(9, "0")}`,
        email:
          Math.random() > 0.7
            ? `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`
            : undefined,
        address: {
          village: villages[Math.floor(Math.random() * villages.length)],
          block: `Block ${Math.floor(Math.random() * 10) + 1}`,
          district: `District ${Math.floor(Math.random() * 20) + 1}`,
          state,
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        },
        assignedArea: {
          villages: [villages[Math.floor(Math.random() * villages.length)]],
          population: Math.floor(Math.random() * 2000) + 500,
          households: Math.floor(Math.random() * 400) + 100,
        },
        patients: [], // Will be assigned later
        qualifications: [
          qualifications[Math.floor(Math.random() * qualifications.length)],
        ],
        experience: Math.floor(Math.random() * 15) + 1,
        language: [this.getLanguageForState(state), "hindi"],
        specializations: [
          "Maternal Health",
          "Child Care",
          "Immunization",
          "Family Planning",
          "Nutrition",
          "Health Education",
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        performance: {
          patientsServed: Math.floor(Math.random() * 100) + 20,
          vaccinationsDone: Math.floor(Math.random() * 50) + 10,
          healthCheckups: Math.floor(Math.random() * 200) + 50,
          emergencyResponses: Math.floor(Math.random() * 20) + 5,
        },
        availability: {
          workingHours: "9 AM - 5 PM",
          emergencyAvailable: Math.random() > 0.3,
        },
        createdAt: new Date(
          Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
        ),
        updatedAt: new Date(),
      };

      try {
        await dbService.createASHA(asha);
      } catch (error) {
        console.log(`ASHA ${i + 1} might have duplicate phone, skipping...`);
      }
    }

    console.log("✅ Seeded 55 ASHA workers");
  }

  private async seedDoctors(): Promise<void> {
    console.log("👨‍⚕️ Seeding doctors...");

    const doctorNames = [
      "Dr. Rajesh Kumar",
      "Dr. Priya Sharma",
      "Dr. Amit Patel",
      "Dr. Sunita Singh",
      "Dr. Vikram Reddy",
      "Dr. Meera Nair",
      "Dr. Suresh Gupta",
      "Dr. Kavita Verma",
      "Dr. Manoj Joshi",
      "Dr. Lakshmi Rao",
      "Dr. Anil Shah",
      "Dr. Geeta Agarwal",
      "Dr. Ramesh Bansal",
      "Dr. Usha Mishra",
      "Dr. Santosh Kapoor",
    ];

    const specializations = [
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "Orthopedics",
      "Cardiology",
      "Dermatology",
      "ENT",
      "Ophthalmology",
      "Psychiatry",
      "Family Medicine",
      "Emergency Medicine",
      "Internal Medicine",
    ];

    const qualifications = [
      "MBBS",
      "MBBS, MD",
      "MBBS, MS",
      "MBBS, DNB",
      "MBBS, MD, DM",
      "MBBS, MS, MCh",
      "MBBS, MD, Fellowship",
    ];

    for (let i = 0; i < 45; i++) {
      const name =
        doctorNames[Math.floor(Math.random() * doctorNames.length)] +
        ` ${i + 1}`;
      const specialization = [
        specializations[Math.floor(Math.random() * specializations.length)],
      ];
      const state = [
        "Tamil Nadu",
        "Kerala",
        "Karnataka",
        "Gujarat",
        "Maharashtra",
      ][Math.floor(Math.random() * 5)];

      const doctor: Omit<Doctor, "_id"> = {
        doctorId: generateId("DOC"),
        name,
        phone: `${Math.floor(Math.random() * 4) + 6}${Math.floor(
          Math.random() * 1000000000,
        )
          .toString()
          .padStart(9, "0")}`,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@hospital.com`,
        qualification:
          qualifications[Math.floor(Math.random() * qualifications.length)],
        specialization,
        experience: Math.floor(Math.random() * 25) + 2,
        languages: [this.getLanguageForState(state), "english", "hindi"],
        address: {
          clinic: `${name.split(" ")[1]} Medical Center`,
          area: `Area ${Math.floor(Math.random() * 10) + 1}`,
          city: `City ${Math.floor(Math.random() * 20) + 1}`,
          state,
          pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        },
        availability: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          timeSlots: ["9:00-12:00", "14:00-17:00"],
          consultationFee: Math.floor(Math.random() * 800) + 200,
          videoConsultationFee: Math.floor(Math.random() * 500) + 150,
        },
        patients: [],
        ratings: {
          average: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
          total: Math.floor(Math.random() * 100) + 10,
          reviews: [],
        },
        telemedicine: {
          enabled: Math.random() > 0.2, // 80% enable telemedicine
          platforms: ["Google Meet", "Zoom", "Microsoft Teams"],
          maxPatientsPerDay: Math.floor(Math.random() * 20) + 10,
        },
        createdAt: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        ),
        updatedAt: new Date(),
      };

      try {
        await dbService.createDoctor(doctor);
      } catch (error) {
        console.log(`Doctor ${i + 1} might have duplicate email, skipping...`);
      }
    }

    console.log("✅ Seeded 45 doctors");
  }

  private getLanguageForState(state: string): string {
    const stateLanguages: { [key: string]: string } = {
      "Tamil Nadu": "tamil",
      Kerala: "malayalam",
      Karnataka: "kannada",
      Gujarat: "gujarati",
      Maharashtra: "marathi",
      Punjab: "punjabi",
      "West Bengal": "bengali",
      Odisha: "odia",
      Assam: "assamese",
      "Andhra Pradesh": "telugu",
    };

    return stateLanguages[state] || "hindi";
  }
}

// Export seeder instance
export const dataSeeder = new DataSeeder();
