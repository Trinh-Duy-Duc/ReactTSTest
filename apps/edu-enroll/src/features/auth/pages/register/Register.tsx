import React from 'react';
import { RegisterForm } from '../../../../components/ui/RegisterForm';
import { LanguageSwitcher } from '../../../../components/ui/LanguageSwitcher';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mb-4">
        <LanguageSwitcher />
      </div>
      <RegisterForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;