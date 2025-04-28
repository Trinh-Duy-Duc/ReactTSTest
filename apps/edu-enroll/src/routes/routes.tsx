import { LanguageWrapper } from '@repo/ui/wrapper';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import EE_CONSTANT from '../constant';
import { lazy } from 'react';

// Lazy load components
const Login = lazy(() => import('../features/auth/pages/login/Login'));
const Register = lazy(() => import('../features/auth/pages/register/Register'));
const Dashboard = lazy(() => import('../features/dashboard/pages/dashboard/Dashboard'));
const Product = lazy(() => import('../features/product/pages/product'));

const _route = EE_CONSTANT.ROUTE;

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/:lang/*" element={<LanguageWrapper />} >
                {/* Redirect root path to login with query parameters */}
                <Route index element={<Navigate to="login?pageIndex=1&pageSize=50" replace />} />
                
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                
                {/* Dashboard route */}
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Product management route */}
                <Route path="products" element={<Product />} />
                
                {/* Catch all other routes and redirect to login */}
                <Route path="*" element={<Navigate to={`${_route.fallBackInside}/login?pageIndex=1&pageSize=50`} replace />} />
            </Route>
            <Route path="*" element={<Navigate to={`${_route.fallBackRoot}/login?pageIndex=1&pageSize=50`} replace />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;