import EE_CONSTANT from "@edu-enroll/constant";
import { useAuth, useI18nRepo, usePaginationParams } from "@repo/hooks";
import { useI18nStore } from "@repo/store/i18n";
import { useToastify } from "@repo/store/toastify";
import { LanguageCode } from "@repo/types/enum";
import { ButtonBasic } from '@repo/ui/antd-ui';
import { Button, DatePicker } from 'antd';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation(EE_CONSTANT.TRANS_KEYS.common, { keyPrefix: EE_CONSTANT.TRAN_KEYS_PREFIX.login } );
  const { t: t2 } = useTranslation(EE_CONSTANT.TRANS_KEYS.common);
  const { lang } = useI18nStore();
  const { showToast } = useToastify();
  const { pageIndex, pageSize, setPageIndex, setPageSize } = usePaginationParams({ defaultPageIndex: 1, defaultPageSize: 50 });
  const { handleLogin } = useAuth();
  const { handleChangeLang } = useI18nRepo();
  const navigate = useNavigate();
  const { lang: currentLang } = useParams<{ lang: string }>();

  const changeLang = () => {
    const newLang = lang === LanguageCode.English ? LanguageCode.VietNam :  LanguageCode.English;
    
    handleChangeLang(newLang);
  }

  const handleDynamicTrans = () => {
    showToast('success', t('greeting', { name: 'John' } ))
  }

  const handleTestLogin = () => {
    handleLogin({ userNameOrEmail: 'string', password: 'string' }, () => {
      showToast("success", 'Login Success');
      navigate(`/${currentLang}/dashboard`);
    });
  }

  const handleTestRegister = () => {
    navigate(`/${currentLang}/register`);
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-y-4 mt-10">
          <div>
            <span>{t('title')}</span>
          </div>
          <div>
          <span>{t2('title.welcome')}</span>
          </div>
          <DatePicker></DatePicker>
          <ButtonBasic></ButtonBasic>
          <Button type="primary" onClick={handleDynamicTrans}>New</Button>
          <button onClick={changeLang}>change</button>
          <button onClick={() => setPageIndex(pageIndex + 1)} >change page index</button>
          <button onClick={() => setPageSize(pageSize + 50)} >change page size</button>
          <button onClick={handleTestLogin} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">test login</button>
          <button onClick={handleTestRegister} className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded">test register</button>
        </div>
      </div>
    </div>
  )
}

export default Login