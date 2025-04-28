import { Outlet } from 'react-router-dom';

export const PublicRoute = () => {
  // Always render the login page regardless of authentication status
  return <Outlet />;
};