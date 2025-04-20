import React, { useEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useI18nStore } from '@repo/store/i18n';
import REPO_CONSTANT from '@repo/utils/constant';
import LanguageDetector from 'i18next-browser-languagedetector';

export function I18nRepoProvider({ children }: { children: React.ReactNode }) {
  const { lang, paths } = useI18nStore();
  const [initialized, setInitialized] = useState(false);

  // ✅ Fetch JSON thay vì import (tránh lỗi MIME)
  const fetchLangData = async (path: string): Promise<any> => {
    const res = await fetch(path);
    return await res.json();
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [source1, source2] = await Promise.all([
          fetchLangData(paths[lang]),                  // từ path mapping
          fetchLangData(`/i18n/${lang}.json`)          // từ public folder
        ]);

        const mergedResource = {
          ...source1,
          ...source2,
        };

        await i18n
          .use(LanguageDetector)
          .use(initReactI18next)
          .init({
            fallbackLng: REPO_CONSTANT.DEFAUL_VALUES.language,
            interpolation: { escapeValue: false },
            resources: {
              [lang]: {
                [REPO_CONSTANT.TRANS_KEYS.common]: mergedResource,
              },
            },
            defaultNS: REPO_CONSTANT.TRANS_KEYS.common,
            ns: [REPO_CONSTANT.TRANS_KEYS.common],
            detection: {
              order: ['cookie', 'localStorage', 'navigator'],
              lookupCookie: REPO_CONSTANT.COOKIE_KEYS.lang,
              caches: ['cookie'],
              cookieMinutes: 60 * 24 * 30,
            },
          });

        setInitialized(true);
      } catch (error) {
        console.error('Error during i18n init:', error);
      }
    };

    load();
  }, []);

  // ✅ Khi lang thay đổi
  useEffect(() => {
    if (!initialized) return;

    const load = async () => {
      try {
        if (!i18n.hasResourceBundle(lang, REPO_CONSTANT.TRANS_KEYS.common)) {
          const [source1, source2] = await Promise.all([
            fetchLangData(paths[lang]),
            fetchLangData(`/i18n/${lang}.json`)
          ]);

          const mergedResource = {
            ...source1,
            ...source2,
          };

          i18n.addResourceBundle(
            lang,
            REPO_CONSTANT.TRANS_KEYS.common,
            mergedResource,
            true,
            true
          );
        }

        i18n.changeLanguage(lang);
      } catch (error) {
        console.error('Error while switching language:', error);
      }
    };

    load();
  }, [lang, initialized]);

  if (!initialized) {
    return <div>Loading translations...</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
