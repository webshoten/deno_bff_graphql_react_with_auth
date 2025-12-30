import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 認証済みならダッシュボードへリダイレクト
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          React Auth Demo
        </h1>
        <SignupForm
          onSuccess={() => navigate("/login")}
          onSwitchToLogin={() => navigate("/login")}
        />
      </div>
    </div>
  );
}

