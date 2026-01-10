// public/components/Navigation.tsx
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export function Navigation() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="font-bold text-xl">
            Word Reflesher
          </Link>

          <div className="flex gap-4">
            {isAuthenticated
              ? (
                <>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600" : "text-gray-600"}
                  >
                    単語学習
                  </NavLink>
                  <button type="button" onClick={logout}>ログアウト</button>
                </>
              )
              : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600" : "text-gray-600"}
                  >
                    ログイン
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600" : "text-gray-600"}
                  >
                    新規登録
                  </NavLink>
                </>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
}
