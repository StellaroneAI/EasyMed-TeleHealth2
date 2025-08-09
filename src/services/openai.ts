import OpenAI from "openai";

// Add the interfaces from SymptomChecker.tsx
export interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  bodyPart: string;
  duration: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "critical";
  target: { min: number; max: number };
  history: { date: string; value: number }[];
}

export interface ClinicalInsight {
  id: string;
  type:
    | "drug_interaction"
    | "diagnostic_suggestion"
    | "patient_risk"
    | "treatment_recommendation";
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
}

export interface DiagnosisResult {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  specialist: string;
}

export interface HealthInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

// Initialize OpenAI client

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key', // Make sure to add this to your .env file
  dangerouslyAllowBrowser: true, // Only for demo - in production, use a backend
});

export class EnhancedVoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  /**
   * Speech-to-Text using OpenAI Whisper
   * Supports all languages much better than browser speech recognition
   */
  async speechToText(audioBlob: Blob, language?: string): Promise<string> {
    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], "audio.webm", {
        type: "audio/webm",
      });

      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: this.getWhisperLanguageCode(language), // Optional: specify language
        response_format: "text",
        temperature: 0.1, // Lower temperature for more accurate transcription
      });

      return transcription;
    } catch (error) {
      console.error("Speech-to-text error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  /**
   * Text-to-Speech using OpenAI TTS
   * High quality voice synthesis in multiple languages
   */
  async textToSpeech(
    text: string,
    language: string = "english",
  ): Promise<Blob> {
    try {
      const voice = this.getOptimalVoice(language);

      const response = await openai.audio.speech.create({
        model: "tts-1-hd", // High quality model
        voice: voice,
        input: text,
        response_format: "mp3",
        speed: 0.9, // Slightly slower for better comprehension
      });

      const audioBlob = new Blob([await response.arrayBuffer()], {
        type: "audio/mpeg",
      });

      return audioBlob;
    } catch (error) {
      console.error("Text-to-speech error:", error);
      throw new Error("Failed to generate speech");
    }
  }

  /**
   * Enhanced AI Chat with multilingual support
   */
  async processHealthQuery(
    query: string,
    language: string = "english",
    context: any = {},
  ): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(language, context);

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return (
        completion.choices[0]?.message?.content ||
        "I apologize, I could not process your request."
      );
    } catch (error) {
      console.error("AI chat error:", error);
      throw new Error("Failed to process health query");
    }
  }

  /**
   * Start recording audio from microphone
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw new Error("Microphone access denied");
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error("No recording in progress"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: "audio/webm",
        });
        this.isRecording = false;

        // Stop all tracks
        this.mediaRecorder?.stream
          ?.getTracks()
          .forEach((track) => track.stop());

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Play audio blob
   */
  async playAudio(audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(audioBlob);

      audio.src = audioUrl;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error("Failed to play audio"));
      };

      audio.play().catch(reject);
    });
  }

  /**
   * Get optimal OpenAI voice for language
   */
  private getOptimalVoice(
    language: string,
  ): "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" {
    const voiceMapping = {
      english: "nova", // Clear female voice
      hindi: "alloy", // Good for Indian languages
      tamil: "shimmer", // Melodic voice
      telugu: "alloy",
      bengali: "echo", // Male voice for variation
      marathi: "nova",
      punjabi: "fable",
      gujarati: "shimmer",
      kannada: "nova",
      malayalam: "alloy",
      odia: "echo",
      assamese: "fable",
    };

    return voiceMapping[language as keyof typeof voiceMapping] || "nova";
  }

  /**
   * Get Whisper language codes for better recognition
   */
  private getWhisperLanguageCode(language?: string): string | undefined {
    if (!language) return undefined;

    const languageCodes = {
      english: "en",
      hindi: "hi",
      tamil: "ta",
      telugu: "te",
      bengali: "bn",
      marathi: "mr",
      punjabi: "pa",
      gujarati: "gu",
      kannada: "kn",
      malayalam: "ml",
      odia: "or",
      assamese: "as",
    };

    return languageCodes[language as keyof typeof languageCodes];
  }

  /**
   * Get system prompt for AI assistant in different languages
   */
  private getSystemPrompt(language: string, context: any): string {
    const prompts = {
      english: `You are EasyMedPro's AI health assistant. Provide helpful, accurate health information in simple English. Keep responses concise (2-3 sentences). Always recommend consulting healthcare professionals for serious concerns.`,

      hindi: `आप EasyMedPro के AI स्वास्थ्य सहायक हैं। सरल हिंदी में उपयोगी, सटीक स्वास्थ्य जानकारी प्रदान करें। जवाब संक्षिप्त रखें (2-3 वाक्य)। गंभीर समस्याओं के लिए हमेशा स्वास्थ्य पेशेवरों से सलाह लेने की सिफारिश करें।`,

      tamil: `நீங்கள் EasyMedPro இன் AI சுகாதார உதவியாளர். எளிய தமிழில் பயனுள்ள, துல்லியமான சுகாதார தகவல்களை வழங்கவும். பதில்களை சுருக்கமாக வைக்கவும் (2-3 வாக்கியங்கள்). தீவிர கவலைகளுக்கு எப்போதும் சுகாதார நிபுணர்களை அணுக பரிந்துரைக்கவும்।`,

      telugu: `మీరు EasyMedPro యొక్క AI ఆరోగ్య సహాయకులు. సరళమైన తెలుగులో ఉపయోగకరమైన, ఖచ్చితమైన ఆరోగ్య సమాచారాన్ని అందించండి. ప్రతిస్పందనలను సంక్షిప్తంగా ఉంచండి (2-3 వాక్యాలు). తీవ్రమైన ఆందోళనల కోసం ఎల్లప్పుడూ ఆరోగ్య నిపుణులను సంప్రదించాలని సిఫార్సు చేయండి।`,

      // Add more languages as needed...
    };

    return prompts[language as keyof typeof prompts] || prompts.english;
  }

  /**
   * Analyze symptoms using OpenAI GPT-4
   */
  async analyzeSymptomsWithAI(
    symptoms: Symptom[],
    patientInfo: { age: string; gender: string; existingConditions: string[] },
    naturalLanguageSymptoms: string,
    language: string = "english",
  ): Promise<DiagnosisResult> {
    try {
      const systemPrompt = `You are a highly intelligent medical AI assistant. Your role is to analyze patient symptoms and provide a preliminary, informational diagnosis. You must provide a response in the language specified: ${language}. You must return a JSON object that matches the following TypeScript interface:

interface DiagnosisResult {
  condition: string;
  probability: number; // A value between 0 and 100
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
  specialist: string;
}

Do not include any other text or explanations in your response.`;

      const userPrompt = `Patient Information:
- Age: ${patientInfo.age}
- Gender: ${patientInfo.gender}
- Existing Conditions: ${patientInfo.existingConditions.join(", ") || "None"}

Selected Symptoms:
${symptoms.map((s) => `- ${s.name} (Severity: ${s.severity}, Duration: ${s.duration})`).join("\n")}

Patient's Description:
"${naturalLanguageSymptoms}"

Please analyze this information and return a JSON object with your diagnosis.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(
        completion.choices[0]?.message?.content || "{}",
      );
      return result as DiagnosisResult;
    } catch (error) {
      console.error("AI symptom analysis error:", error);
      throw new Error("Failed to analyze symptoms");
    }
  }

  async getPersonalizedHealthInsights(
    healthMetrics: HealthMetric[],
    patientInfo: { age: string; gender: string; existingConditions: string[] },
    language: string = "english",
  ): Promise<HealthInsight[]> {
    try {
      const systemPrompt = `You are a highly intelligent medical AI assistant. Your role is to analyze a patient\'s health metrics and provide personalized, actionable insights. You must provide a response in the language specified: ${language}. You must return a JSON object containing an array of insights that matches the following TypeScript interface:

interface HealthInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

Do not include any other text or explanations in your response.`;

      const userPrompt = `Patient Information:
- Age: ${patientInfo.age}
- Gender: ${patientInfo.gender}
- Existing Conditions: ${patientInfo.existingConditions.join(", ") || "None"}

Health Metrics:
${healthMetrics.map((m) => `- ${m.name}: ${m.value} ${m.unit} (Trend: ${m.trend}, Status: ${m.status})`).join("\n")}

Please analyze this information and return a JSON object with an array of personalized health insights.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(
        completion.choices[0]?.message?.content || "{}",
      );
      return result.insights as HealthInsight[];
    } catch (error) {
      console.error("AI health insights error:", error);
      throw new Error("Failed to generate health insights");
    }
  }

  async getClinicalDecisionSupport(
    patientHistory: any, // This should be a structured object with the patient's medical history
    language: string = "english",
  ): Promise<ClinicalInsight[]> {
    try {
      const systemPrompt = `You are a highly intelligent clinical decision support AI. Your role is to analyze a patient\'s medical history and provide concise, relevant insights to a qualified medical professional. You must provide a response in the language specified: ${language}. You must return a JSON object containing an array of clinical insights that matches the following TypeScript interface:

interface ClinicalInsight {
  id: string;
  type: 'drug_interaction' | 'diagnostic_suggestion' | 'patient_risk' | 'treatment_recommendation';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
}

Do not include any other text or explanations in your response.`;

      const userPrompt = `Patient History:
${JSON.stringify(patientHistory, null, 2)}

Please analyze this information and return a JSON object with an array of clinical insights.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5, // Lower temperature for more deterministic, factual responses
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(
        completion.choices[0]?.message?.content || "{}",
      );
      return result.insights as ClinicalInsight[];
    } catch (error) {
      console.error("AI clinical decision support error:", error);
      throw new Error("Failed to generate clinical decision support");
    }
  }

  /**
   * Check if recording is in progress
   */
  get recording(): boolean {
    return this.isRecording;
  }
}

// Export singleton instance
export const voiceService = new EnhancedVoiceService();

// Health-specific voice commands processor
export class HealthVoiceCommands {
  static processCommand(transcript: string, language: string): any {
    const lowerTranscript = transcript.toLowerCase();

    const commands = {
      english: {
        appointment: ["appointment", "book"],
        medications: ["medicine", "medication"],
        emergency: ["emergency", "help"],
      },
      hindi: {
        appointment: ["अपॉइंटमेंट", "मुलाकात"],
        medications: ["दवा", "औषधि"],
        emergency: ["आपातकाल", "मदद"],
      },
      tamil: {
        appointment: ["சந்திப்பு", "முன்பதிவு"],
        medications: ["மருந்து"],
        emergency: ["அவசரம்", "உதவி"],
      },
      telugu: {
        appointment: ["అపాయింట్‌మెంట్", "బుకింగ్"],
        medications: ["మందు"],
        emergency: ["అత్యవసరం", "సహాయం"],
      },
      kannada: {
        appointment: ["ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್", "ಬುಕಿಂಗ್"],
        medications: ["ಔಷಧಿ"],
        emergency: ["ತುರ್ತು", "ಸಹಾಯ"],
      },
    };

    const langCommands =
      commands[language as keyof typeof commands] || commands.english;

    for (const [action, keywords] of Object.entries(langCommands)) {
      if (keywords.some((keyword) => lowerTranscript.includes(keyword))) {
        return { action: "navigate", target: action };
      }
    }

    return { action: "chat", query: transcript };
  }
}
