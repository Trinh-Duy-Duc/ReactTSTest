import EE_CONSTANT from "@edu-enroll/constant";
import { useI18nStore } from "@repo/store/i18n";
import { LanguageCode } from "@repo/types/enum";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonBasic } from '@repo/ui/antd-ui';
import { Button, DatePicker } from 'antd';
import { useToastify } from "@repo/store/toastify";
import { usePaginationParams } from "@repo/hooks";
import { useEffect } from "react";

const Login = () => {
  const { t } = useTranslation(EE_CONSTANT.TRANS_KEYS.common, { keyPrefix: EE_CONSTANT.TRAN_KEYS_PREFIX.login } );
  const { t: t2 } = useTranslation(EE_CONSTANT.TRANS_KEYS.common);
  const { lang } = useI18nStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToastify();
  const { pageIndex, pageSize, setPageIndex, setPageSize } = usePaginationParams({ defaultPageIndex: 1, defaultPageSize: 50 });

  useEffect(() => {
    console.log('init')
  }, [pageIndex, pageSize])

  const changeLang = () => {
    const newLang = lang === LanguageCode.English ? LanguageCode.VietNam :  LanguageCode.English;
    // Regex này tìm chuỗi bắt đầu bằng "/" theo sau là 2 ký tự chữ thường, rồi có thể có "/" hoặc kết thúc chuỗi.
    const newPathname = location.pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${newLang}$1`);
    // Nối thêm query string và hash nếu có
    const newUrl = newPathname + location.search + location.hash;

    // Sử dụng navigate để chuyển đến đường dẫn mới.
    navigate(newUrl, { replace: true });
  }

  const handleDynamicTrans = () => {
    showToast('success', t('greeting', { name: 'John' } ))
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
        </div>
      </div>
    </div>
  )
}

export default Login