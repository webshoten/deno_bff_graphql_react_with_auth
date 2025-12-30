import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTypedMutation } from "../utils/genql-urql-bridge.ts";

type VerifyStatus = "loading" | "success" | "error";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  const [, verifyEmail] = useTypedMutation({
    mutation: {
      verifyEmail: {
        __args: { token: "" },
        success: true,
        message: true,
      },
    },
  });

  useEffect(() => {
    // 既に実行済みの場合はスキップ
    if (hasVerified.current) {
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("認証トークンがありません");
      return;
    }

    // 実行済みフラグを立てる
    hasVerified.current = true;

    // 認証を実行
    verifyEmail({ token }).then((result) => {
      if (result.error) {
        setStatus("error");
        setMessage(result.error.message || "エラーが発生しました");
        return;
      }

      const data = result.data?.verifyEmail;
      if (data?.success) {
        setStatus("success");
        setMessage(data.message || "メール認証が完了しました");
      } else {
        setStatus("error");
        setMessage(data?.message || "認証失敗");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              ⏳
            </div>
            <h1 style={{ color: "#333", marginBottom: "0.5rem" }}>
              確認中...
            </h1>
            <p style={{ color: "#666" }}>
              メールアドレスを確認しています。しばらくお待ちください。
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              ✅
            </div>
            <h1 style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
              メール認証完了！
            </h1>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              メールアドレスの確認が完了しました。ログインしてご利用ください。
            </p>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              ログインページへ
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
              }}
            >
              ❌
            </div>
            <h1 style={{ color: "#dc2626", marginBottom: "0.5rem" }}>
              認証に失敗しました
            </h1>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              リンクが無効または期限切れです。再度登録をお試しください。
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <Link
                to="/signup"
                style={{
                  display: "inline-block",
                  backgroundColor: "#6b7280",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                新規登録へ
              </Link>
              <Link
                to="/login"
                style={{
                  display: "inline-block",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                ログインページへ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
