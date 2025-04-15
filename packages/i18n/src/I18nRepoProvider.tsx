import React, { useEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useI18nStore } from '@repo/store/i18n';
import REPO_CONSTANT from '@repo/utils/constant';

export function I18nRepoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, paths } = useI18nStore();
  const [initialized, setInitialized] = useState(false);

  // Khởi tạo i18next khi component mount (cho ngôn ngữ mặc định)
  useEffect(() => {
    const load = async () => {
      try {
        const [source1, source2] = await Promise.all([
          import(paths[lang]), // file JSON thứ nhất
          import(`../lang/${lang}.json`), // file JSON thứ hai
        ]);
        // Giả sử file JSON được export dưới dạng default export
        const mergedResource = {
          ...source1.default,
          ...source2.default,
        };

        await i18n
          .use(initReactI18next)
          .init({
            fallbackLng: 'en',
            interpolation: {
              escapeValue: false,
            },
            // Thêm resource cho cùng 1 namespace chung (ví dụ: 'common')
            resources: {
              [lang]: {
                [REPO_CONSTANT.TRANS_KEYS.common]: mergedResource,
              },
            },
            defaultNS: REPO_CONSTANT.TRANS_KEYS.common,
            ns: [REPO_CONSTANT.TRANS_KEYS.common],
          });
        setInitialized(true);
      } catch (error) {
        console.error('Error during i18n init:', error);
      }
    };

    load();
  }, []); // Giả sử lang, paths là giá trị ổn định khi mount

  // Khi lang thay đổi, cập nhật resource và chuyển ngôn ngữ
  useEffect(() => {
    if (!initialized) return;
    const load = async () => {
      try {
        const [source1, source2] = await Promise.all([
          import(paths[lang]),
          import(`../lang/${lang}.json`),
        ]);
        const mergedResource = {
          ...source1.default,
          ...source2.default,
        };
        // Thêm resource vào namespace 'common', deep merge để đảm bảo nội dung cũ không bị mất nếu có
        i18n.addResourceBundle(
          lang,
          REPO_CONSTANT.TRANS_KEYS.common,
          mergedResource,
          true, // deep merge
          true  // overwrite existing
        );
        await i18n.changeLanguage(lang);
      } catch (error) {
        console.error('Error while switching language:', error);
      }
    };

    load();
  }, [lang, initialized]);

  if (!initialized) {
    return <div>Loading translations...</div>;
  }

  return (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  );
}
