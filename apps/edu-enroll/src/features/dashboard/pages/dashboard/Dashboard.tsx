import { useAuth } from "@repo/hooks"
import { repoAuthApi } from "@repo/services";
import { useAuthStore } from "@repo/store/auth";

const Dashboard = () => {
  const { handleLogout } = useAuth();
  const { refreshToken, onLoginSuccess } = useAuthStore();

  const handleTestRefreshToken = async () =>{
    // handleRefreshToken();
    const resp = await repoAuthApi.refreshTokenApi(refreshToken!);
    onLoginSuccess(resp.data);
  }


  const onLoggedOut = () => {
    handleLogout(() => {
      console.log('logged out success')
    })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={onLoggedOut}>Logout simulate</button>
      <button onClick={handleTestRefreshToken} >test refresh token</button>
    </div>
  )
}

export default Dashboard