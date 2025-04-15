// import Login from '@edu-enroll/features/auth/pages/login/Login';
// import Register from '@edu-enroll/features/auth/pages/register/Register';
import Dashboard from '@edu-enroll/features/dashboard/pages/dashboard/Dashboard';
import { LanguageWrapper } from '@repo/ui/wrapper';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import EE_CONSTANT from '@edu-enroll/constant';
import { lazy } from 'react';
// import { Login } from '@edu-enroll/features/auth';

// Lazy load components
const Login = lazy(() => import('@edu-enroll/features/auth/pages/login/Login'));
const Register = lazy(() => import('@edu-enroll/features/auth/pages/register/Register'));

const _route = EE_CONSTANT.ROUTE;

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/:lang/*" element={<LanguageWrapper />} >
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="*" element={<Navigate to={_route.fallBackInside} replace />} />
            </Route>
            <Route path="*" element={<Navigate to={_route.fallBackRoot} replace />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;