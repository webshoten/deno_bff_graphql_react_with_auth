import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { cacheExchange, createClient, fetchExchange, Provider } from "urql";
import App from "./App.tsx";
import { refetchOnTypename } from "./utils/refetchOnTypename.ts";
import { AuthProvider } from "./context/AuthContext.tsx";

// urqlクライアントを作成
const urqlClient = createClient({
  url: "/graphql",
  exchanges: [refetchOnTypename, cacheExchange, fetchExchange],
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
