import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ABHAProfile,
  ABHAHealthRecord,
  abhaService,
} from "../services/abhaService";

interface ABHAContextType {
  abhaProfile: ABHAProfile | null;
  healthRecords: ABHAHealthRecord[];
  isABHAConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectABHA: (profile: ABHAProfile) => void;
  disconnectABHA: () => void;
  fetchHealthRecords: () => Promise<void>;
  clearError: () => void;
}

const ABHAContext = createContext<ABHAContextType | undefined>(undefined);

interface ABHAProviderProps {
  children: ReactNode;
}

export function ABHAProvider({ children }: ABHAProviderProps) {
  const [abhaProfile, setABHAProfile] = useState<ABHAProfile | null>(null);
  const [healthRecords, setHealthRecords] = useState<ABHAHealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load ABHA profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("abha_profile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setABHAProfile(profile);
      } catch (error) {
        console.error("Failed to parse saved ABHA profile:", error);
        localStorage.removeItem("abha_profile");
      }
    }
  }, []);

  const connectABHA = (profile: ABHAProfile) => {
    setABHAProfile(profile);
    localStorage.setItem("abha_profile", JSON.stringify(profile));
    setError(null);
  };

  const disconnectABHA = () => {
    setABHAProfile(null);
    setHealthRecords([]);
    localStorage.removeItem("abha_profile");
    localStorage.removeItem("abha_tokens");
    setError(null);
  };

  const fetchHealthRecords = async () => {
    if (!abhaProfile) {
      setError("ABHA profile not found");
      return;
    }

    const tokens = localStorage.getItem("abha_tokens");
    if (!tokens) {
      setError("ABHA authentication tokens not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { accessToken } = JSON.parse(tokens);
      const records = await abhaService.getHealthRecords(
        abhaProfile.healthId,
        accessToken,
      );
      setHealthRecords(records);
    } catch (error) {
      console.error("Failed to fetch health records:", error);
      setError("Failed to fetch health records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: ABHAContextType = {
    abhaProfile,
    healthRecords,
    isABHAConnected: !!abhaProfile,
    isLoading,
    error,
    connectABHA,
    disconnectABHA,
    fetchHealthRecords,
    clearError,
  };

  return <ABHAContext.Provider value={value}>{children}</ABHAContext.Provider>;
}

export function useABHA(): ABHAContextType {
  const context = useContext(ABHAContext);
  if (context === undefined) {
    throw new Error("useABHA must be used within an ABHAProvider");
  }
  return context;
}
