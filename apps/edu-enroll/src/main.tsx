import '@ant-design/v5-patch-for-react-19';
import '@repo/extensions';
import { I18nRepoProvider } from '@repo/i18n';
import { useI18nStore } from '@repo/store/i18n';
import { LanguageCode } from '@repo/types/enum';
import "@repo/ui/styles.css";
import REPO_CONSTANT from '@repo/utils/constant';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Root from './Root.tsx';

const viURL = new URL(`./assets/locales/${LanguageCode.VietNam}.json`, import.meta.url).href;
const enURL = new URL(`./assets/locales/${LanguageCode.English}.json`, import.meta.url).href;

useI18nStore.setState({
  lang: REPO_CONSTANT.DEFAUL_VALUES.language,
  paths: {
    [LanguageCode.VietNam]: viURL,
    [LanguageCode.English]: enURL
  }
}); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nRepoProvider>
      <Root />
    </I18nRepoProvider>
  </StrictMode>,
)