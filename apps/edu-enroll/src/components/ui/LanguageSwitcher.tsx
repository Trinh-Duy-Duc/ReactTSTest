import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18nStore } from '@repo/store/i18n';
import { LanguageCode } from '@repo/types/enum';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useI18nRepo } from '@repo/hooks';
import { useParams } from 'react-router-dom';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { handleChangeLang } = useI18nRepo();
  const { lang } = useParams<{ lang: string }>();
  const { setLang } = useI18nStore();

  // Đảm bảo i18n và URL được đồng bộ
  useEffect(() => {
    if (lang && (lang === LanguageCode.English || lang === LanguageCode.VietNam)) {
      i18n.changeLanguage(lang);
      setLang(lang as LanguageCode);
    }
  }, [lang, i18n, setLang]);

  const languageOptions = [
    { value: LanguageCode.VietNam, label: 'Tiếng Việt' },
    { value: LanguageCode.English, label: 'English' },
  ];

  const handleChange = (value: string) => {
    handleChangeLang(value as LanguageCode);
    // Đặt lại trạng thái và ngôn ngữ trực tiếp
    setLang(value as LanguageCode);
    i18n.changeLanguage(value);
  };

  return (
    <div className="language-switcher">
      <Space>
        <GlobalOutlined style={{ color: '#1890ff' }} />
        <Select
          value={lang || i18n.language}
          onChange={handleChange}
          options={languageOptions}
          style={{ width: 120 }}
          bordered={false}
          dropdownStyle={{ borderRadius: '6px' }}
        />
      </Space>
    </div>
  );
};