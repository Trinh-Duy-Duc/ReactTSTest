// packages/auth/src/auth-provider.tsx
import { useAuthStore } from '@repo/store/auth';
import { useEffect } from 'react';
import { authCommon } from "@repo/utils/auth";
import { repoAuthApi } from '@repo/services';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  // const { handleGetUserInfo } = useAuth();
  const { accessToken, refreshToken, onSetToken, onClearAuth, onSetUser } = useAuthStore();
  
  useEffect(() => {
    const _accessToken = authCommon.getAccessTokenFromCookie();
    const _refreshToken = authCommon.getRefreshTokenFromCookie();

    if(_accessToken){
      onSetToken(_accessToken, _refreshToken || '');
      // handleGetUserInfo();
    }else{
      authCommon.deleteRefreshTokenInCookie();
      onClearAuth();
    }
  }, []);

  useEffect(() => {
    console.log('refreshToken-------', refreshToken)
  }, [refreshToken])

  useEffect(() => {
    if(!accessToken) return;

    handleGetUserInfo();
  }, [accessToken])

  const handleGetUserInfo = async () => {
    try {
      const resp = await repoAuthApi.userInfoApi();
      
      onSetUser(resp.data);
    } catch (error) {
      onClearAuth();
    }
  }

  return <>{children}</>;
}