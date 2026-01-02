import { Outlet, Route, Routes } from "react-router-dom";
import { DashboardPage, LoginPage, SignupPage } from "./pages/index.ts";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Navigation } from "./components/Navigation.tsx";
import { WordReflesher } from "./pages/WordReflesher.tsx";

function Layout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet /> {/* 子ルートがここに表示される */}
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 公開ルート */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 認証必須ルート */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/word"
          element={
            <ProtectedRoute>
              <WordReflesher />
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
      </Route>
    </Routes>
  );
}

export default App;
