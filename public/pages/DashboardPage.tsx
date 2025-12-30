import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { UserRegistrationForm } from "../components/UserRegistrationForm.tsx";
import { UserList } from "../components/UserList.tsx";
import { AuthUserList } from "../components/AuthUserList.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Header />
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              ようこそ、<span className="font-semibold">{user?.name}</span> さん
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              ログアウト
            </button>
          </div>
        </div>
        <AuthUserList />
        <UserRegistrationForm />
        <UserList />
      </div>
    </div>
  );
}
