import { LanguageCode } from '@repo/types/enum';

type I18nState = {
    lang: LanguageCode;
    paths: Record<LanguageCode, string>;
    setLang: (lang: LanguageCode) => void;
};

export type { I18nState };