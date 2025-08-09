import { useTranslation as useI18nextTranslation } from 'react-i18next';

// Simple hook that any component can use
export const useTranslation = () => {
  const { t, i18n } = useI18nextTranslation();
  
  return {
    // Simple translation function
    t,
    
    // Change language programmatically
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    
    // Current language
    currentLanguage: i18n.language,
    
    // Helper functions for common patterns
    tCommon: (key: string) => t(`common.${key}`),
    tNav: (key: string) => t(`nav.${key}`),
    tConsultation: (key: string) => t(`consultation.${key}`),
    tTelemedicine: (key: string) => t(`telemedicine.${key}`),
    tSteps: (key: string) => t(`steps.${key}`),
  };
};

export default useTranslation;
