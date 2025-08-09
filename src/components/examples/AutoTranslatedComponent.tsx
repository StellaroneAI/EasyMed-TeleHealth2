import React from 'react';
import useTranslation from '../../hooks/useTranslation';

// ✨ ANY new component automatically gets translations like this:
export const AutoTranslatedComponent = () => {
  const { t, tCommon, tConsultation, changeLanguage } = useTranslation();

  return (
    <div className="p-6">
      {/* 🎯 No need to define translations in component! */}
      <h1>{tConsultation('title')}</h1>
      <p>{tConsultation('subtitle')}</p>
      
      <div className="flex gap-4 mt-4">
        <button className="btn btn-primary">
          {tConsultation('book')}
        </button>
        <button className="btn btn-secondary">
          {tCommon('cancel')}
        </button>
      </div>

      {/* Language switcher */}
      <div className="mt-6 flex gap-2">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('hi')}>हिंदी</button>
        <button onClick={() => changeLanguage('ta')}>தமிழ்</button>
      </div>

      {/* ✨ Even dynamic translations work automatically */}
      <div className="mt-4">
        <p>{t('consultation.subtitle')}</p>
        <p>{t('common.loading')}</p>
      </div>
    </div>
  );
};

// 🚀 That's it! No translation objects needed in component
export default AutoTranslatedComponent;
