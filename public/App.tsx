import { Route, Routes } from "react-router-dom";
import {
  DashboardPage,
  LoginPage,
  SignupPage,
  VerifyEmailPage,
} from "./pages/index.ts";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <Routes>
      {/* 公開ルート */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* 認証必須ルート */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404: 未定義のパスはダッシュボードへ */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
