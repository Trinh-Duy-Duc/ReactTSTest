import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { RegisterFormValues, useRegisterSchema } from '../../features/auth/schemas/register.schema';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const registerSchema = useRegisterSchema();
  const { lang } = useParams<{ lang: string }>();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Ở đây sẽ gọi API đăng ký thực tế
      console.log('Form data:', data);
      
      // Giả lập đăng ký thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('auth.register.successMessage'));
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('auth.register.title')}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.email')}
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.password')}
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.confirmPassword')}
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
          ) : (
            t('auth.register.submitButton')
          )}
        </button>
        
        {/* Login Link */}
        <div className="mt-4 text-center">
          <Link to={`/${lang}/login?pageIndex=1&pageSize=50`} className="text-blue-600 hover:text-blue-800">
            {t('auth.register.loginLink')}
          </Link>
        </div>
      </form>
    </div>
  );
};