import { useI18nStore } from '@repo/store/i18n';
import { LanguageCode } from '@repo/types/enum';
import REPO_CONSTANT from '@repo/utils/constant';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const allowedLangs = [LanguageCode.English, LanguageCode.VietNam]; // Danh sách các ngôn ngữ cho phép

export function LanguageWrapper() {
  // Lấy param lang từ URL, ví dụ: "en" hoặc "vi"
  const { lang } = useParams<{ lang: LanguageCode }>();
  const { setLang } = useI18nStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!allowedLangs.includes(lang!)){
      const [_, __, ..._rest] = location.pathname.split('/');
      const newPathname = `/${REPO_CONSTANT.DEFAUL_VALUES.language}/${_rest}`;
      // Nối thêm query string và hash nếu có
      const newUrl = newPathname + location.search + location.hash;
  
      // Sử dụng navigate để chuyển đến đường dẫn mới.
      navigate(newUrl, { replace: true });
      return;
    }
    setLang(lang!);
  }, [lang]);

  return (
    <Outlet />
  );
}
