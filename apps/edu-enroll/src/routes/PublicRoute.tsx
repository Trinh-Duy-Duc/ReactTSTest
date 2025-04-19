import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuthStore } from '@repo/store/auth';
import { LanguageCode } from '@repo/types/enum';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { lang } = useParams<{ lang: LanguageCode }>();

  // Nếu đã đăng nhập thì redirect về trang chính
  return isAuthenticated ? <Navigate to={`/${lang}/dashboard`} replace /> : <Outlet />;
};