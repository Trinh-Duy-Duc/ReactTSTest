import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useRepoAuth } from '@repo/hooks';

/**
 * Hook xử lý các thao tác liên quan đến xác thực trong ứng dụng edu-enroll
 * Mở rộng từ hook useAuth chung trong @repo/hooks
 * @returns Các hàm và state liên quan đến xác thực cho ứng dụng edu-enroll
 */
const useAuth = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user,
    token,
    error,
    loading,
    handleLogin: repoHandleLogin,
    handleLogout: repoHandleLogout
  } = useRepoAuth();

  /**
   * Xử lý đăng nhập với navigation
   * @param email Email người dùng
   * @param password Mật khẩu
   */
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await repoHandleLogin(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [repoHandleLogin, navigate]);

  /**
   * Xử lý đăng xuất với navigation
   */
  const handleLogout = useCallback(() => {
    repoHandleLogout();
    navigate('/login');
  }, [repoHandleLogout, navigate]);

  /**
   * Xử lý đăng ký
   * @param userData Thông tin người dùng đăng ký
   */
  const handleRegister = useCallback(async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    // Trong thực tế, sẽ gọi API đăng ký ở đây
    console.log('Register with data:', userData);
    
    // Giả lập thành công
    return Promise.resolve({
      success: true,
      message: 'Registration successful'
    });
  }, []);

  return {
    isAuthenticated,
    user,
    token,
    error,
    loading,
    handleLogin,
    handleLogout,
    handleRegister
  };
};

export default useAuth;