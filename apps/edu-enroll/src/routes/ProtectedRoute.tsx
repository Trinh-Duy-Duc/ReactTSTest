import { Navigate, Outlet, useParams } from 'react-router-dom';
import { LanguageCode } from '@repo/types/enum';
import { useAuthStore } from '@repo/store/auth';
import { useEffect, useState } from 'react';
import { authCommon } from '@repo/utils/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const { lang } = useParams<{ lang: LanguageCode }>();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Kiểm tra token trong cookie
    const accessToken = authCommon.getAccessTokenFromCookie();
    setHasToken(!!accessToken);
    setIsChecking(false);
  }, []);

  // Hiển thị loading trong quá trình kiểm tra token
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu đã đăng nhập hoặc có token trong cookie thì cho phép truy cập
  return isAuthenticated || hasToken ? <Outlet /> : <Navigate to={`/${lang}/login`} replace />;
};