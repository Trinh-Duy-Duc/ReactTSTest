import { Navigate, Outlet, useParams } from 'react-router-dom';
import { LanguageCode } from '@repo/types/enum';
import { useAuthStore } from '@repo/store/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { lang } = useParams<{ lang: LanguageCode }>();

  // if (isLoading) return <div>Loading...</div>; // Hoặc spinner

  // Nếu chưa đăng nhập thì redirect về trang login
  return isAuthenticated ? <Outlet /> : <Navigate to={`/${lang}/login`} replace />;
};