import { useAuth } from "@repo/hooks"
import { repoAuthApi } from "@repo/services";
import { useAuthStore } from "@repo/store/auth";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { LanguageSwitcher } from "../../../../components/ui/LanguageSwitcher";

const Dashboard = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { refreshToken, onLoginSuccess, user } = useAuthStore();

  const handleTestRefreshToken = async () => {
    // handleRefreshToken();
    const resp = await repoAuthApi.refreshTokenApi(refreshToken!);
    onLoginSuccess(resp.data);
  }

  const onLoggedOut = () => {
    if (window.confirm(t('dashboard.logoutConfirm', 'Bạn có chắc chắn muốn đăng xuất?'))) {
      handleLogout();
      toast.info(t('dashboard.logoutSuccess', 'Đăng xuất thành công'));
      navigate(`/${lang}/login?pageIndex=1&pageSize=50`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <div className="flex justify-end items-center space-x-4 mb-4">
        {/* Language Switcher */}
        <div className="mr-4">
          <LanguageSwitcher />
        </div>
        
        {user && (
          <div className="flex items-center">
            <span className="text-gray-700 font-medium">
              {t('dashboard.welcome', 'Xin chào')}, {user.name || user.email}
            </span>
          </div>
        )}
        <button
          onClick={onLoggedOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.586 2H4a1 1 0 00-1 1zm9 2.414L14.586 7H12V5.414zM5 4h5v3a1 1 0 001 1h3v7H5V4zm4.293 9.293a1 1 0 011.414 0L12 14.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t('dashboard.logout', 'Đăng xuất')}
        </button>
      </div>
      
      <div className="flex-grow">
        {/* Dashboard content goes here */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('dashboard.title', 'Dashboard')}</h1>
          <p className="text-gray-600 mb-6">{t('dashboard.content', 'Your dashboard content will appear here.')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title={t('dashboard.menu.products', 'Quản lý Sản phẩm')}
              bordered={true}
              hoverable
              className="shadow-sm"
            >
              <p className="mb-4">{t('dashboard.menu.productsDesc', 'Quản lý danh sách sản phẩm với các chức năng thêm, sửa, xóa.')}</p>
              <Link to={`/${lang}/products`}>
                <Button type="primary" icon={<ShoppingOutlined />}>
                  {t('dashboard.menu.products', 'Quản lý Sản phẩm')}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>     
    </div>      
  )
}

export default Dashboard