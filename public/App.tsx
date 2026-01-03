import { Outlet, Route, Routes } from "react-router-dom";
import { LoginPage, SignupPage } from "./pages/index.ts";
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

        <Route
          path="/"
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
              <WordReflesher />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
