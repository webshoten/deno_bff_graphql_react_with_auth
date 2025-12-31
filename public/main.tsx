import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { cacheExchange, createClient, fetchExchange, Provider } from "urql";
import App from "./App.tsx";
import { refetchOnTypename } from "./utils/refetchOnTypename.ts";
import { AuthProvider } from "./context/AuthContext.tsx";
import { auth } from "./firebase/auth.ts";

// urqlクライアントを作成（認証トークン付き）
const urqlClient = createClient({
  url: "/graphql",
  exchanges: [refetchOnTypename, cacheExchange, fetchExchange],
  fetchOptions: () => {
    // Firebase の現在のユーザーからトークンを取得
    const user = auth.currentUser;
    if (!user) {
      return {};
    }

    // getIdToken は非同期だが、キャッシュされたトークンを同期的に取得するため
    // accessToken プロパティを直接使用（Firebase SDK が内部でキャッシュ）
    // deno-lint-ignore no-explicit-any
    const token = (user as any).accessToken;
    if (!token) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
});

const rootElement = document.getElementById("app");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider value={urqlClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
