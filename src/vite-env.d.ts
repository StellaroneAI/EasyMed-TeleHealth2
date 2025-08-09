/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ABHA_BASE_URL: string;
  readonly VITE_ABHA_CLIENT_ID: string;
  readonly VITE_ABHA_CLIENT_SECRET: string;
  readonly VITE_ABDM_GATEWAY_URL: string;
  readonly VITE_FACILITY_ID: string;
  readonly VITE_HIP_ID: string;
  readonly VITE_HIU_ID: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_DOCTOR_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
