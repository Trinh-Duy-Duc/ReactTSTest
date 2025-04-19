// packages/auth/src/auth-provider.tsx
import { useAuthStore } from '@repo/store/auth';
import { useEffect } from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthStore();
  
  useEffect(() => {
    initAuth();
  }, []);

  return <>{children}</>;
}