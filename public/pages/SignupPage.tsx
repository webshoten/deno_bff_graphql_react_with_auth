import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm.tsx";
import { useAuth } from "../context/AuthContext.tsx";

export function SignupPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [signupComplete, setSignupComplete] = useState(false);

  // 認証済みならダッシュボードへリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // サインアップ完了後のメール確認案内画面
  if (signupComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              メールをご確認ください
            </h1>
            <p className="text-red-600 mb-6">
              ・※タイトル「単語アプリ確認メール」として迷惑メールなどに分類される場合があります。
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center"
              >
                ログインページへ
              </Link>
              <button
                type="button"
                onClick={() => setSignupComplete(false)}
                className="block w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                別のアカウントで登録する
              </button>
            </div>
          </div>
        </div>
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
          onSuccess={() => setSignupComplete(true)}
          onSwitchToLogin={() => navigate("/login")}
        />
      </div>
    </div>
  );
}
