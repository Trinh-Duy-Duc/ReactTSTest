import React from 'react';
import { useTranslation } from 'react-i18next';
import { useI18nStore } from '@repo/store/i18n';
import { LanguageCode } from '@repo/types/enum';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLang } = useI18nStore();

  const changeLanguage = (languageCode: LanguageCode) => {
    setLang(languageCode);
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex justify-center items-center space-x-4 mb-4">
      <button
        onClick={() => changeLanguage(LanguageCode.English)}
        className={`px-3 py-1 rounded-md ${
          i18n.language === LanguageCode.English 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage(LanguageCode.VietNam)}
        className={`px-3 py-1 rounded-md ${
          i18n.language === LanguageCode.VietNam 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        Tiếng Việt
      </button>
    </div>
  );
};