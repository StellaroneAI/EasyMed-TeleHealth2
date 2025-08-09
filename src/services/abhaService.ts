// ABHA (Ayushman Bharat Health Account) Integration Service
// National Digital Health Mission - India

export interface ABHAProfile {
  healthId: string;
  healthIdNumber: string;
  name: string;
  gender: "M" | "F" | "O";
  yearOfBirth: string;
  monthOfBirth: string;
  dayOfBirth: string;
  address: {
    line: string;
    district: string;
    state: string;
    pincode: string;
  };
  mobile: string;
  email?: string;
  profilePhoto?: string;
  kycVerified: boolean;
  authMethods: ("AADHAAR" | "MOBILE_OTP" | "DEMOGRAPHICS")[];
}

export interface ABHAHealthRecord {
  recordId: string;
  recordType:
    | "PRESCRIPTION"
    | "DIAGNOSTIC_REPORT"
    | "DISCHARGE_SUMMARY"
    | "CONSULTATION";
  createdDate: string;
  facilityName: string;
  doctorName: string;
  content: any;
  documentUrl?: string;
}

export interface ABHAConsent {
  consentId: string;
  status: "REQUESTED" | "GRANTED" | "DENIED" | "EXPIRED";
  purpose: string;
  dataTypes: string[];
  validFrom: string;
  validTo: string;
  frequency: "ONE_TIME" | "PERIODIC";
}

export interface ABHAFamilyMember {
  relationshipType: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "OTHER";
  healthId: string;
  name: string;
  dateOfBirth: string;
  gender: "M" | "F" | "O";
  mobile?: string;
  isLinked: boolean;
  consentGiven: boolean;
}

export interface TelemedicineSession {
  sessionId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  sessionType: "VIDEO" | "AUDIO" | "CHAT";
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  scheduledTime: string;
  duration: number;
  meetingUrl?: string;
  prescription?: any;
  consultationFee: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
}

export interface InsuranceClaim {
  claimId: string;
  policyNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  approvedAmount?: number;
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SETTLED";
  treatmentType: string;
  facilityName: string;
  submissionDate: string;
  settlementDate?: string;
  documents: string[];
}

export interface HealthScore {
  overallScore: number;
  categories: {
    cardiovascular: number;
    diabetes: number;
    mentalHealth: number;
    lifestyle: number;
    preventiveCare: number;
  };
  recommendations: string[];
  riskFactors: string[];
  lastUpdated: string;
}

class ABHAService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_ABHA_BASE_URL || "https://abhasbx.abdm.gov.in";
    this.clientId = import.meta.env.VITE_ABHA_CLIENT_ID || "";
    this.clientSecret = import.meta.env.VITE_ABHA_CLIENT_SECRET || "";
  }

  // Step 1: Generate ABHA Number using Aadhaar
  async generateABHAWithAadhaar(
    aadhaarNumber: string,
    mobile: string,
  ): Promise<{ txnId: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/registration/aadhaar/generateOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CM-ID": this.clientId,
          },
          body: JSON.stringify({
            aadhaar: aadhaarNumber,
            mobile: mobile,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate ABHA with Aadhaar");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA Aadhaar generation error:", error);
      throw error;
    }
  }

  // Step 2: Verify OTP and Create ABHA
  async verifyOTPAndCreateABHA(
    txnId: string,
    otp: string,
  ): Promise<ABHAProfile> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/registration/aadhaar/verifyOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CM-ID": this.clientId,
          },
          body: JSON.stringify({
            txnId: txnId,
            otp: otp,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP and create ABHA");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA OTP verification error:", error);
      throw error;
    }
  }

  // Generate ABHA using Mobile Number
  async generateABHAWithMobile(mobile: string): Promise<{ txnId: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/registration/mobile/generateOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CM-ID": this.clientId,
          },
          body: JSON.stringify({
            mobile: mobile,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate ABHA with mobile");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA mobile generation error:", error);
      throw error;
    }
  }

  // Get ABHA Profile
  async getABHAProfile(
    healthId: string,
    accessToken: string,
  ): Promise<ABHAProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/account/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
          "X-HIP-ID": healthId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get ABHA profile");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA profile fetch error:", error);
      throw error;
    }
  }

  // Login with ABHA
  async loginWithABHA(
    healthId: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          healthid: healthId,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to login with ABHA");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA login error:", error);
      throw error;
    }
  }

  // Fetch Health Records
  async getHealthRecords(
    healthId: string,
    accessToken: string,
  ): Promise<ABHAHealthRecord[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/patients/health-records`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CM-ID": this.clientId,
            "X-HIP-ID": healthId,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch health records");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA health records fetch error:", error);
      throw error;
    }
  }

  // Share Health Records (Consent Management)
  async requestConsent(
    healthId: string,
    purpose: string,
    dataTypes: string[],
  ): Promise<ABHAConsent> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/consent-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          consent: {
            purpose: purpose,
            patient: { id: healthId },
            hiu: { id: this.clientId },
            requester: { name: "EasyMed", identifier: { value: "easymed.in" } },
            hiTypes: dataTypes,
            permission: {
              accessMode: "VIEW",
              dateRange: {
                from: new Date().toISOString(),
                to: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toISOString(), // 30 days
              },
              dataEraseAt: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000,
              ).toISOString(), // 1 year
              frequency: { unit: "HOUR", value: 1, repeats: 720 }, // 30 days hourly
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request consent");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA consent request error:", error);
      throw error;
    }
  }

  // Link Healthcare Facility
  async linkFacility(healthId: string, facilityId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/patients/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          patientId: healthId,
          facilityId: facilityId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("ABHA facility link error:", error);
      return false;
    }
  }

  // Search Healthcare Providers
  async searchHealthcareProviders(
    location: string,
    speciality?: string,
  ): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/facility/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          location: location,
          speciality: speciality,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to search healthcare providers");
      }

      return await response.json();
    } catch (error) {
      console.error("ABHA provider search error:", error);
      return [];
    }
  }

  // === FAMILY MEMBER MANAGEMENT ===

  // Add Family Member
  async addFamilyMember(
    primaryHealthId: string,
    memberData: Omit<ABHAFamilyMember, "isLinked" | "consentGiven">,
    accessToken: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/family/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          primaryHealthId,
          memberData,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Add family member error:", error);
      return false;
    }
  }

  // Get Family Members
  async getFamilyMembers(
    healthId: string,
    accessToken: string,
  ): Promise<ABHAFamilyMember[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/family/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
          "X-HIP-ID": healthId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch family members");
      }

      return await response.json();
    } catch (error) {
      console.error("Family members fetch error:", error);
      return [];
    }
  }

  // Link Family Member ABHA
  async linkFamilyMemberABHA(
    primaryHealthId: string,
    memberHealthId: string,
    accessToken: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/family/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          primaryHealthId,
          memberHealthId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Link family member error:", error);
      return false;
    }
  }

  // === TELEMEDICINE INTEGRATION ===

  // Schedule Telemedicine Consultation
  async scheduleTelemedicine(
    patientHealthId: string,
    doctorId: string,
    sessionType: "VIDEO" | "AUDIO" | "CHAT",
    scheduledTime: string,
    accessToken: string,
  ): Promise<TelemedicineSession | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/telemedicine/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          patientId: patientHealthId,
          doctorId,
          sessionType,
          scheduledTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule telemedicine session");
      }

      return await response.json();
    } catch (error) {
      console.error("Telemedicine scheduling error:", error);
      return null;
    }
  }

  // Get Telemedicine Sessions
  async getTelemedicineSessions(
    healthId: string,
    accessToken: string,
  ): Promise<TelemedicineSession[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/telemedicine/sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
          "X-HIP-ID": healthId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch telemedicine sessions");
      }

      return await response.json();
    } catch (error) {
      console.error("Telemedicine sessions fetch error:", error);
      return [];
    }
  }

  // Join Telemedicine Session
  async joinTelemedicineSession(
    sessionId: string,
    accessToken: string,
  ): Promise<{ meetingUrl: string } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/telemedicine/join/${sessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CM-ID": this.clientId,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to join telemedicine session");
      }

      return await response.json();
    } catch (error) {
      console.error("Join telemedicine session error:", error);
      return null;
    }
  }

  // === INSURANCE CLAIM PROCESSING ===

  // Submit Insurance Claim
  async submitInsuranceClaim(
    healthId: string,
    claimData: Omit<InsuranceClaim, "claimId" | "status" | "submissionDate">,
    documents: File[],
    accessToken: string,
  ): Promise<InsuranceClaim | null> {
    try {
      const formData = new FormData();
      formData.append("healthId", healthId);
      formData.append("claimData", JSON.stringify(claimData));

      documents.forEach((doc, index) => {
        formData.append(`document_${index}`, doc);
      });

      const response = await fetch(
        `${this.baseUrl}/v2/insurance/claims/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CM-ID": this.clientId,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit insurance claim");
      }

      return await response.json();
    } catch (error) {
      console.error("Insurance claim submission error:", error);
      return null;
    }
  }

  // Get Insurance Claims
  async getInsuranceClaims(
    healthId: string,
    accessToken: string,
  ): Promise<InsuranceClaim[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/insurance/claims`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
          "X-HIP-ID": healthId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insurance claims");
      }

      return await response.json();
    } catch (error) {
      console.error("Insurance claims fetch error:", error);
      return [];
    }
  }

  // Check Insurance Eligibility
  async checkInsuranceEligibility(
    healthId: string,
    policyNumber: string,
    insuranceProvider: string,
    accessToken: string,
  ): Promise<{
    eligible: boolean;
    coverageAmount?: number;
    policyStatus?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/insurance/eligibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          healthId,
          policyNumber,
          insuranceProvider,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check insurance eligibility");
      }

      return await response.json();
    } catch (error) {
      console.error("Insurance eligibility check error:", error);
      return { eligible: false };
    }
  }

  // === AI HEALTH SCORING ===

  // Generate Health Score
  async generateHealthScore(
    healthId: string,
    accessToken: string,
  ): Promise<HealthScore | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/ai/health-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          healthId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate health score");
      }

      return await response.json();
    } catch (error) {
      console.error("Health score generation error:", error);
      return null;
    }
  }

  // Get Health Insights
  async getHealthInsights(
    healthId: string,
    accessToken: string,
  ): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/ai/insights`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
          "X-HIP-ID": healthId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch health insights");
      }

      const data = await response.json();
      return data.insights || [];
    } catch (error) {
      console.error("Health insights fetch error:", error);
      return [];
    }
  }

  // === EMERGENCY SERVICES ===

  // Emergency 108 Integration
  async triggerEmergency108(
    healthId: string,
    location: { latitude: number; longitude: number },
    emergencyType: "MEDICAL" | "ACCIDENT" | "CARDIAC" | "STROKE" | "OTHER",
    accessToken: string,
  ): Promise<{ emergencyId: string; estimatedArrival: number } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/emergency/108`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          healthId,
          location,
          emergencyType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to trigger 108 emergency");
      }

      return await response.json();
    } catch (error) {
      console.error("Emergency 108 trigger error:", error);
      return null;
    }
  }

  // Share Emergency Health Info
  async shareEmergencyHealthInfo(
    healthId: string,
    emergencyContacts: string[],
    accessToken: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/emergency/share-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-CM-ID": this.clientId,
        },
        body: JSON.stringify({
          healthId,
          emergencyContacts,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Emergency info sharing error:", error);
      return false;
    }
  }
}

export const abhaService = new ABHAService();
