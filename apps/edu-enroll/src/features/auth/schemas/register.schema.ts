import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export const useRegisterSchema = () => {
  const { t } = useTranslation();
  
  return z.object({
    email: z
      .string()
      .min(1, { message: t('auth.validation.email.required') })
      .email({ message: t('auth.validation.email.invalid') }),
    password: z
      .string()
      .min(1, { message: t('auth.validation.password.required') })
      .min(8, { message: t('auth.validation.password.minLength') })
      .regex(/[A-Z]/, { message: t('auth.validation.password.uppercase') })
      .regex(/[a-z]/, { message: t('auth.validation.password.lowercase') })
      .regex(/[0-9]/, { message: t('auth.validation.password.number') }),
    confirmPassword: z
      .string()
      .min(1, { message: t('auth.validation.confirmPassword.required') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.confirmPassword.match'),
    path: ['confirmPassword'],
  });
};

export type RegisterFormValues = z.infer<ReturnType<typeof useRegisterSchema>>;