import { create } from 'zustand';
import { I18nState } from './i18n.type';
import { LanguageCode } from '@repo/types/enum';

const useI18nStore = create<I18nState>((set) => ({
  lang: LanguageCode.English,
  paths: {
    [LanguageCode.English]: "",
    [LanguageCode.VietNam]: ""
  },
  setLang: (lang: LanguageCode) => set({ lang })
}))

export { useI18nStore };